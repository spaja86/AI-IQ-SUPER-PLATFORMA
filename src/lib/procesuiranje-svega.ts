// SpajaUltraOmegaCore — EKSTREMNO PROCESUIRANJE SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven izvor istine za aktivni pipeline procesiranja svih domena:
//   - Bankarski procesi
//   - AI procesi
//   - Finansijski procesi
//   - Licencni procesi
//   - Ekosistem procesi
//   - Autofinish procesi
//   - Bezbednosni procesi
//   - Analitički procesi

import { runDiagnostics } from './auto-repair';
import { getAutofinishHealthSummary, getAutofinishPetljaSummary } from './autofinish-petlja';
import { autentifikacijaSistem } from './autentifikacija';
import { spajaPlatniSistem } from './spaja-platni-sistem';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { getDeployStatistike } from './proksi-github-deploy';
import { getStatistike } from './statistika';

export type ProcesuiranjeStatus = 'aktivno' | 'cekanje' | 'greska' | 'zavrseno';
export type ProcesuiranjePrioritet = 'kriticno' | 'visoko' | 'srednje' | 'nisko';
export type ProcesuiranjeFreshness = 'fresh' | 'stale';

export const PROCESUIRANJE_SVEGA_CONTRACT_VERSION = 'v2';
export const PROCESUIRANJE_SVEGA_MODEL_VERSION = '2.0.0';
export const PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH = '/api/procesuiranje-svega';

interface ProcesuiranjeScore {
  throughputPerMin: number;
  latencyMsP95: number;
  errorRatePct: number;
}

const CRITICAL_SIGNAL_SOURCES = {
  stats: 'statistika',
  diagnostics: 'auto-repair.diagnostics',
  operativa: 'kompanija-spaja-operativa',
  autofinishHealth: 'autofinish-petlja.health',
} as const;

export interface ProcesuiranjeStavka {
  id: string;
  opis: string;
  status: ProcesuiranjeStatus;
  tip: string;
  prioritet?: ProcesuiranjePrioritet;
}

export interface ProcesuiranjeDomen {
  naziv: string;
  ikona: string;
  status: ProcesuiranjeStatus;
  procenat: number;
  stavke: ProcesuiranjeStavka[];
  vreme: string;
  freshness?: ProcesuiranjeFreshness;
}

export interface ProcesuiranjeScheduler {
  rezim: 'sekvencijalno-kriticni-i-paralelno-nekriticni';
  emergencyOverride: boolean;
  fairnessIndex: number;
  starvationRizik: number;
  queueDepth: number;
  saturacijaPct: number;
  redovi: Array<{
    domen: string;
    stavkaId: string;
    prioritet: ProcesuiranjePrioritet;
    strategija: 'sekvencijalno' | 'paralelno';
  }>;
}

export interface ProcesuiranjeMeta {
  contractVersion: typeof PROCESUIRANJE_SVEGA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH;
  generatedAt: string;
  degraded: boolean;
  degradedSources: string[];
  ciljevi: {
    throughputPerMin: number;
    latencyMsP95: number;
    maxErrorRatePct: number;
    maxQueueDepth: number;
  };
}

export interface ProcesuiranjeSvegaRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanProcenat: number;
  aktivnihProcesa: number;
  cekajucihProcesa: number;
  gresakaUkupno: number;
  zavrsenihProcesa: number;
  domeni: {
    bankarski: ProcesuiranjeDomen;
    ai: ProcesuiranjeDomen;
    finansijski: ProcesuiranjeDomen;
    licencni: ProcesuiranjeDomen;
    ekosistem: ProcesuiranjeDomen;
    autofinish: ProcesuiranjeDomen;
    bezbednosni: ProcesuiranjeDomen;
    analiticki: ProcesuiranjeDomen;
  };
  aktivneStavke: ProcesuiranjeStavka[];
  scheduler: ProcesuiranjeScheduler;
  score: ProcesuiranjeScore;
  kriticniProcesi: ProcesuiranjeStavka[];
  uskaGrla: string[];
  preporuke: string[];
  meta: ProcesuiranjeMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function clampNonNegative(value: number): number {
  return Math.max(0, Math.round(value));
}

function stavkeProcenat(stavke: ProcesuiranjeStavka[]): number {
  if (stavke.length === 0) return 0;
  const zavrsene = stavke.filter((s) => s.status === 'zavrseno' || s.status === 'aktivno').length;
  return Math.round((zavrsene / stavke.length) * 100);
}

function dominantniStatus(stavke: ProcesuiranjeStavka[]): ProcesuiranjeStatus {
  if (stavke.some((s) => s.status === 'greska')) return 'greska';
  if (stavke.some((s) => s.status === 'aktivno')) return 'aktivno';
  if (stavke.some((s) => s.status === 'cekanje')) return 'cekanje';
  return 'zavrseno';
}

function safeCall<T>(sourceName: string, degradedSources: string[], fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error('[procesuiranje-svega] source failure:', sourceName, error);
    return null;
  }
}

function statusFromSignal(ok: boolean, waiting: boolean): ProcesuiranjeStatus {
  if (ok) return 'zavrseno';
  if (waiting) return 'cekanje';
  return 'aktivno';
}

const PRIORITET_RANK: Record<ProcesuiranjePrioritet, number> = {
  kriticno: 0,
  visoko: 1,
  srednje: 2,
  nisko: 3,
};

/**
 * Ekstremni scheduler kalibracija (jedinice):
 * - THROUGHPUT_*: procenjeni "procesni događaji/min".
 * - LATENCY_*: ms (p95 modelovani signal).
 * - STARVATION_*: procenat reda čekanja.
 *
 * Kalibracija je heuristička i konzervativna:
 * - završeni proces nosi veći doprinos (x20) od dijagnostičkog događaja
 *   jer predstavlja kraj end-to-end toka;
 * - baseline p95 je 400ms, uz maksimalnu redukciju 250ms po rastu spremnosti;
 * - emergency override uvodi +120ms penal radi zaštitnog throttling signala.
 */
const SCHEDULER_CONFIG = {
  throughput: {
    zavrseniMultiplier: 20,
    dijagnostikaMultiplier: 1,
  },
  latency: {
    baseMs: 400,
    maxReductionMs: 250,
    procenatMultiplier: 1.7,
    emergencyPenaltyMs: 120,
  },
  starvation: {
    warningThreshold: 35,
    actionThreshold: 40,
  },
} as const;

function classifyPrioritet(domen: string, status: ProcesuiranjeStatus): ProcesuiranjePrioritet {
  if (status === 'greska') return 'kriticno';
  if (domen === 'bankarski' || domen === 'bezbednosni') return 'kriticno';
  if (domen === 'finansijski' || domen === 'ekosistem') return 'visoko';
  if (status === 'cekanje') return 'srednje';
  return 'nisko';
}

function buildDomen(
  naziv: string,
  ikona: string,
  freshness: ProcesuiranjeFreshness,
  stavke: ProcesuiranjeStavka[],
  now: string,
): ProcesuiranjeDomen {
  return {
    naziv,
    ikona,
    status: dominantniStatus(stavke),
    procenat: clampScore(stavkeProcenat(stavke)),
    stavke,
    vreme: now,
    freshness,
  };
}

function buildFallbackProcesuiranjeSvega(reason = 'unknown'): ProcesuiranjeSvegaRezultat {
  const now = new Date().toISOString();
  const fallbackStavka: ProcesuiranjeStavka = {
    id: 'fallback-001',
    opis: `Signal degradacija: ${reason}`,
    status: 'cekanje',
    tip: 'degraded-fallback',
    prioritet: 'srednje',
  };
  const fallbackDomen = buildDomen('Fallback', '⚠️', 'stale', [fallbackStavka], now);
  return {
    sistem: 'PROCESUIRANJE SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanProcenat: 0,
    aktivnihProcesa: 0,
    cekajucihProcesa: 1,
    gresakaUkupno: 0,
    zavrsenihProcesa: 0,
    domeni: {
      bankarski: fallbackDomen,
      ai: fallbackDomen,
      finansijski: fallbackDomen,
      licencni: fallbackDomen,
      ekosistem: fallbackDomen,
      autofinish: fallbackDomen,
      bezbednosni: fallbackDomen,
      analiticki: fallbackDomen,
    },
    aktivneStavke: [],
    scheduler: {
      rezim: 'sekvencijalno-kriticni-i-paralelno-nekriticni',
      emergencyOverride: false,
      fairnessIndex: 0,
      starvationRizik: 100,
      queueDepth: 1,
      saturacijaPct: 100,
      redovi: [{
        domen: 'fallback',
        stavkaId: fallbackStavka.id,
        prioritet: 'srednje',
        strategija: 'sekvencijalno',
      }],
    },
    score: {
      throughputPerMin: 0,
      latencyMsP95: 1500,
      errorRatePct: 100,
    },
    kriticniProcesi: [],
    uskaGrla: ['Nedostupni izvori signala — fallback režim'],
    preporuke: ['Proveriti health dijagnostiku i env konfiguraciju pre nastavka.'],
    meta: {
      contractVersion: PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
      modelVersion: PROCESUIRANJE_SVEGA_MODEL_VERSION,
      sourceOfTruth: PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH,
      generatedAt: now,
      degraded: true,
      degradedSources: [reason],
      ciljevi: {
        throughputPerMin: 1200,
        latencyMsP95: 300,
        maxErrorRatePct: 2,
        maxQueueDepth: 80,
      },
    },
    timestamp: now,
  };
}

export function buildProcesuiranjeSvega(): ProcesuiranjeSvegaRezultat {
  const now = new Date().toISOString();
  const degradedSources: string[] = [];

  const stats = safeCall('statistika', degradedSources, () => getStatistike());
  const diagnostics = safeCall('auto-repair.diagnostics', degradedSources, () => runDiagnostics());
  const operativa = safeCall('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const autofinishSummary = safeCall('autofinish-petlja.summary', degradedSources, () => getAutofinishPetljaSummary());
  const autofinishHealth = safeCall('autofinish-petlja.health', degradedSources, () => getAutofinishHealthSummary());
  const deployStats = safeCall('proksi-github-deploy', degradedSources, () => getDeployStatistike());

  // Tiered degradacija: samo CRITICAL_SIGNAL_SOURCES obaraju payload na fallback.
  // Dodatni izvori imaju bezbedne default vrednosti da API ostane dostupan.
  const missingCriticalSources: string[] = [
    ...(!stats ? [CRITICAL_SIGNAL_SOURCES.stats] : []),
    ...(!diagnostics ? [CRITICAL_SIGNAL_SOURCES.diagnostics] : []),
    ...(!operativa ? [CRITICAL_SIGNAL_SOURCES.operativa] : []),
    ...(!autofinishHealth ? [CRITICAL_SIGNAL_SOURCES.autofinishHealth] : []),
  ];
  if (missingCriticalSources.length > 0) {
    return buildFallbackProcesuiranjeSvega(
      `critical:${missingCriticalSources.join('|')}`,
    );
  }
  const stableAutofinishSummary = autofinishSummary ?? {
    status: 'DEGRADED',
    podsistemi: '0/0',
    progres: '0%',
    iteracije: 0,
    autofinish: AUTOFINISH_COUNT,
  };
  const stableDeployStats = deployStats ?? {
    deployUToku: 0,
    cekajuMerge: 0,
    paralelniTokovi: 0,
  };

  // All critical sources are non-null at this point (guarded above).
  const safeOperativa = operativa!;
  const safeDiagnostics = diagnostics!;
  const safeStats = stats!;
  const safeAutofinishHealth = autofinishHealth!;

  const runtimeReady = safeOperativa.spremnost.modelStanja.runtime === 'runtime-ready';
  const opsReady = safeOperativa.spremnost.modelStanja.ops === 'ops-ready';
  const enterpriseReady = safeOperativa.spremnost.modelStanja.enterprise === 'enterprise-ready';
  const diagnosticsOk = safeDiagnostics.kriticnih === 0 && safeDiagnostics.gresaka === 0;
  const authOk = autentifikacijaSistem.status === 'aktivan';
  const billingOk = spajaPlatniSistem.status === 'aktivan';

  const bankarskiStavke: ProcesuiranjeStavka[] = [
    {
      id: 'bank-001',
      opis: `Platni sistem status: ${spajaPlatniSistem.status}`,
      status: billingOk ? 'zavrseno' : 'cekanje',
      tip: 'billing-status',
    },
    {
      id: 'bank-002',
      opis: `Operativni runtime mode: ${safeOperativa.spremnost.modelStanja.runtime}`,
      status: runtimeReady ? 'aktivno' : 'cekanje',
      tip: 'runtime-gate',
    },
    {
      id: 'bank-003',
      opis: `Dijagnostika kritičnih: ${safeDiagnostics.kriticnih}`,
      status: safeDiagnostics.kriticnih > 0 ? 'greska' : 'zavrseno',
      tip: 'risk-signal',
    },
  ];

  const aiStavke: ProcesuiranjeStavka[] = [
    {
      id: 'ai-001',
      opis: `OMEGA persona aktivno: ${safeStats.ukupnoOmegaPersona}`,
      status: safeStats.ukupnoOmegaPersona > 0 ? 'zavrseno' : 'cekanje',
      tip: 'persona',
    },
    {
      id: 'ai-002',
      opis: `Prompt pokrivenost: ${safeStats.ukupnoPromptova}`,
      status: safeStats.ukupnoPromptova >= 28 ? 'aktivno' : 'cekanje',
      tip: 'prompt',
    },
    {
      id: 'ai-003',
      opis: `AI health signal: ${safeDiagnostics.zdravlje}%`,
      status: safeDiagnostics.zdravlje >= 80 ? 'zavrseno' : 'aktivno',
      tip: 'health',
    },
  ];

  const finansijskiStavke: ProcesuiranjeStavka[] = [
    {
      id: 'fin-001',
      opis: `Billing status: ${spajaPlatniSistem.status}`,
      status: statusFromSignal(billingOk, !billingOk),
      tip: 'billing',
    },
    {
      id: 'fin-002',
      opis: `Enterprise mode: ${safeOperativa.spremnost.modelStanja.enterprise}`,
      status: enterpriseReady ? 'zavrseno' : 'cekanje',
      tip: 'enterprise',
    },
    {
      id: 'fin-003',
      opis: `Deploy čekaju merge: ${stableDeployStats.cekajuMerge}`,
      status: stableDeployStats.cekajuMerge > 0 ? 'aktivno' : 'zavrseno',
      tip: 'deploy',
    },
  ];

  const licencniStavke: ProcesuiranjeStavka[] = [
    {
      id: 'lic-001',
      opis: `Ops mode: ${safeOperativa.spremnost.modelStanja.ops}`,
      status: opsReady ? 'zavrseno' : 'cekanje',
      tip: 'ops',
    },
    {
      id: 'lic-002',
      opis: `Runtime env missing: ${safeOperativa.spremnost.missingEnv.length}`,
      status: safeOperativa.spremnost.missingEnv.length === 0 ? 'zavrseno' : 'aktivno',
      tip: 'env',
    },
    {
      id: 'lic-003',
      opis: `Support spremnost: ${safeOperativa.spremnost.support.status}`,
      status: safeOperativa.spremnost.support.status === 'spremno' ? 'zavrseno' : 'aktivno',
      tip: 'support',
    },
  ];

  const ekosistemStavke: ProcesuiranjeStavka[] = [
    {
      id: 'eko-001',
      opis: `API rute: ${TOTAL_API_ROUTES}`,
      status: TOTAL_API_ROUTES > 0 ? 'zavrseno' : 'cekanje',
      tip: 'api',
    },
    {
      id: 'eko-002',
      opis: `Ukupno ruta: ${TOTAL_ROUTES}`,
      status: TOTAL_ROUTES >= TOTAL_API_ROUTES ? 'zavrseno' : 'greska',
      tip: 'routes',
    },
    {
      id: 'eko-003',
      opis: `Deploy u toku: ${stableDeployStats.deployUToku}, parallel tokovi: ${stableDeployStats.paralelniTokovi}`,
      status: stableDeployStats.deployUToku > 0 ? 'aktivno' : 'zavrseno',
      tip: 'deploy-pipeline',
    },
    {
      id: 'eko-004',
      opis: `Dijagnostika zdravlje: ${safeDiagnostics.zdravlje}%`,
      status: diagnosticsOk ? 'zavrseno' : 'aktivno',
      tip: 'dijagnostika',
    },
  ];

  const autofinishProcenat = Math.min(100, Math.round((AUTOFINISH_COUNT / 1500) * 100));
  const autofinishStavke: ProcesuiranjeStavka[] = [
    {
      id: 'af-001',
      opis: `Autofinish iteracija #${AUTOFINISH_COUNT}`,
      status: 'aktivno',
      tip: 'iteracija',
    },
    {
      id: 'af-002',
      opis: `Autofinish progres signal: ${stableAutofinishSummary.progres}`,
      status: autofinishProcenat >= 100 ? 'zavrseno' : 'aktivno',
      tip: 'progres',
    },
    {
      id: 'af-003',
      opis: `Autofinish health: ${safeAutofinishHealth.status}`,
      status: safeAutofinishHealth.status === 'ok' ? 'zavrseno' : safeAutofinishHealth.status === 'warning' ? 'aktivno' : 'greska',
      tip: 'health',
    },
  ];

  const bezbednosniStavke: ProcesuiranjeStavka[] = [
    {
      id: 'bez-001',
      opis: `Auth status: ${autentifikacijaSistem.status}`,
      status: authOk ? 'zavrseno' : 'greska',
      tip: 'auth',
    },
    {
      id: 'bez-002',
      opis: `OAuth provajdera: ${autentifikacijaSistem.konfiguracija.oauthProvajderi.length}`,
      status: autentifikacijaSistem.konfiguracija.oauthProvajderi.length >= 2 ? 'zavrseno' : 'cekanje',
      tip: 'oauth',
    },
    {
      id: 'bez-003',
      opis: `Dijagnostika grešaka: ${safeDiagnostics.gresaka}, kritičnih: ${safeDiagnostics.kriticnih}`,
      status: safeDiagnostics.kriticnih > 0 ? 'greska' : safeDiagnostics.gresaka > 0 ? 'aktivno' : 'zavrseno',
      tip: 'diagnostics',
    },
  ];

  const analitickiStavke: ProcesuiranjeStavka[] = [
    {
      id: 'an-001',
      opis: `Ukupno stranica: ${safeStats.ukupnoStranica}`,
      status: safeStats.ukupnoStranica > 0 ? 'zavrseno' : 'cekanje',
      tip: 'kpi',
    },
    {
      id: 'an-002',
      opis: `Ukupno dijagnostika: ${safeStats.ukupnoDijagnostika}`,
      status: safeStats.ukupnoDijagnostika > 0 ? 'zavrseno' : 'cekanje',
      tip: 'diag-total',
    },
    {
      id: 'an-003',
      opis: `Autofinish/Deploy signal korelacija`,
      status: stableDeployStats.deployUToku > 0 || safeAutofinishHealth.status !== 'ok' ? 'aktivno' : 'zavrseno',
      tip: 'correlation',
    },
  ];

  const freshness: ProcesuiranjeFreshness = degradedSources.length > 0 ? 'stale' : 'fresh';
  const domeni = {
    bankarski: buildDomen('Bankarski Procesi', '🏦', freshness, bankarskiStavke, now),
    ai: buildDomen('AI Procesi', '🧠', freshness, aiStavke, now),
    finansijski: buildDomen('Finansijski Procesi', '💰', freshness, finansijskiStavke, now),
    licencni: buildDomen('Licencni Procesi', '📜', freshness, licencniStavke, now),
    ekosistem: buildDomen('Ekosistem Procesi', '🌐', freshness, ekosistemStavke, now),
    autofinish: buildDomen('Autofinish Procesi', '♻️', freshness, autofinishStavke, now),
    bezbednosni: buildDomen('Bezbednosni Procesi', '🔒', freshness, bezbednosniStavke, now),
    analiticki: buildDomen('Analitički Procesi', '📊', freshness, analitickiStavke, now),
  };

  const sveStavke = Object.entries(domeni).flatMap(([domenKljuc, domen]) =>
    domen.stavke.map((stavka) => ({
      ...stavka,
      prioritet: stavka.prioritet ?? classifyPrioritet(domenKljuc, stavka.status),
    })));

  const aktivnihProcesa = sveStavke.filter((s) => s.status === 'aktivno').length;
  const cekajucihProcesa = sveStavke.filter((s) => s.status === 'cekanje').length;
  const gresakaUkupno = sveStavke.filter((s) => s.status === 'greska').length;
  const zavrsenihProcesa = sveStavke.filter((s) => s.status === 'zavrseno').length;
  const domenProcenati = Object.values(domeni).map((d) => d.procenat);
  const ukupanProcenat = clampScore(domenProcenati.reduce((a, b) => a + b, 0) / domenProcenati.length);
  const aktivneStavke = sveStavke.filter((s) => s.status === 'aktivno');
  const kriticniProcesi = sveStavke.filter((s) => s.prioritet === 'kriticno');

  const redovi = Object.entries(domeni).flatMap(([domenKljuc, domen]) =>
    domen.stavke.map((stavka) => {
      const prioritet = stavka.prioritet ?? classifyPrioritet(domenKljuc, stavka.status);
      return {
        domen: domenKljuc,
        stavkaId: stavka.id,
        prioritet,
        strategija: prioritet === 'kriticno' ? 'sekvencijalno' as const : 'paralelno' as const,
      };
    }),
  ).sort((a, b) => PRIORITET_RANK[a.prioritet] - PRIORITET_RANK[b.prioritet] || a.domen.localeCompare(b.domen));

  const queueDepth = redovi.length;
  const brojDomena = Object.keys(domeni).length;
  const fairnessIdeal = queueDepth / Math.max(1, brojDomena);
  // fairnessIndex meri ravnomernost raspodele po domenima:
  // 100 = potpuno balansirano, niže vrednosti = veća neravnomernost.
  const fairnessDelta = Object.values(domeni)
    .map((d) => Math.abs(d.stavke.length - fairnessIdeal))
    .reduce((a, b) => a + b, 0);
  const fairnessIndex = clampScore(100 - Math.round((fairnessDelta / Math.max(queueDepth, 1)) * 100));
  const starvationRizik = clampScore(Math.round((cekajucihProcesa / Math.max(queueDepth, 1)) * 100));
  const saturacijaPct = clampScore(Math.round(((aktivnihProcesa + cekajucihProcesa + gresakaUkupno) / Math.max(queueDepth, 1)) * 100));
  const emergencyOverride = gresakaUkupno > 0 || safeDiagnostics.kriticnih > 0;

  const score: ProcesuiranjeScore = {
    // Composite throughput: završeni procesi + broj uspešnih dijagnostičkih događaja.
    throughputPerMin: Math.max(
      0,
      (zavrsenihProcesa * SCHEDULER_CONFIG.throughput.zavrseniMultiplier) +
        Math.round(safeDiagnostics.uspesnih * SCHEDULER_CONFIG.throughput.dijagnostikaMultiplier),
    ),
    latencyMsP95: clampNonNegative(
      SCHEDULER_CONFIG.latency.baseMs - Math.min(
        SCHEDULER_CONFIG.latency.maxReductionMs,
        Math.round(ukupanProcenat * SCHEDULER_CONFIG.latency.procenatMultiplier),
      ),
    ) + (emergencyOverride ? SCHEDULER_CONFIG.latency.emergencyPenaltyMs : 0),
    errorRatePct: clampScore(Math.round((gresakaUkupno / Math.max(queueDepth, 1)) * 100)),
  };

  const uskaGrla: string[] = [];
  if (starvationRizik >= SCHEDULER_CONFIG.starvation.warningThreshold) {
    uskaGrla.push(`Visok rizik starvation-a (${starvationRizik}%)`);
  }
  if (safeOperativa.spremnost.missingEnv.length > 0) uskaGrla.push(`Nedostaje ${safeOperativa.spremnost.missingEnv.length} runtime env signala`);
  if (stableDeployStats.cekajuMerge > 0) uskaGrla.push(`Deploy red čeka merge (${stableDeployStats.cekajuMerge})`);
  if (safeDiagnostics.kriticnih > 0) uskaGrla.push(`Dijagnostika prijavljuje kritične check-ove (${safeDiagnostics.kriticnih})`);
  if (uskaGrla.length === 0) uskaGrla.push('Nema detektovanih uskih grla u ekstremnom režimu');

  const preporuke: string[] = [];
  if (starvationRizik > SCHEDULER_CONFIG.starvation.actionThreshold) {
    preporuke.push('Povećati paralelizam za nekritične domene i rasteretiti kritični red.');
  }
  if (!runtimeReady || !opsReady) preporuke.push('Zatvoriti runtime/ops readiness gap pre povećanja burst opterećenja.');
  if (!enterpriseReady) preporuke.push('Nastaviti enterprise onboarding bez blokiranja runtime/ops toka.');
  if (score.errorRatePct > 2) preporuke.push('Aktivirati emergency override i pokrenuti incident runbook.');
  if (preporuke.length === 0) preporuke.push('Sistem je stabilan: nastaviti shadow + dual-output rollout ekstremnog režima.');

  return {
    sistem: 'PROCESUIRANJE SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanProcenat,
    aktivnihProcesa,
    cekajucihProcesa,
    gresakaUkupno,
    zavrsenihProcesa,
    domeni,
    aktivneStavke,
    scheduler: {
      rezim: 'sekvencijalno-kriticni-i-paralelno-nekriticni',
      emergencyOverride,
      fairnessIndex,
      starvationRizik,
      queueDepth,
      saturacijaPct,
      redovi,
    },
    score,
    kriticniProcesi,
    uskaGrla,
    preporuke,
    meta: {
      contractVersion: PROCESUIRANJE_SVEGA_CONTRACT_VERSION,
      modelVersion: PROCESUIRANJE_SVEGA_MODEL_VERSION,
      sourceOfTruth: PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH,
      generatedAt: now,
      degraded: degradedSources.length > 0,
      degradedSources,
      ciljevi: {
        throughputPerMin: 1200,
        latencyMsP95: 300,
        maxErrorRatePct: 2,
        maxQueueDepth: 80,
      },
    },
    timestamp: now,
  };
}

export function buildEkstremnoProcesuiranjeSvega(
  mode: 'shadow' | 'extreme' = 'extreme',
): ProcesuiranjeSvegaRezultat {
  // Trenutno ekstremni API koristi isti signal-driven builder kao i standardni endpoint.
  // `mode` je feature-hook za rollout (shadow/extreme) bez menjanja call-site ugovora.
  const rezultat = buildProcesuiranjeSvega();
  if (mode === 'shadow') {
    return {
      ...rezultat,
      preporuke: [...rezultat.preporuke, 'Shadow mode aktivan: signal-only evaluacija bez promene izvršnog toka.'],
    };
  }
  return rezultat;
}

export function buildEkstremnoProcesuiranjeSvegaFallback(reason?: string): ProcesuiranjeSvegaRezultat {
  return buildFallbackProcesuiranjeSvega(reason);
}
