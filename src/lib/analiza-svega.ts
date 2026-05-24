// SpajaUltraOmegaCore -∞Ω+∞ — ANALIZA SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven izvor istine za celokupnu analizu ekosistema:
//   - Ekosistem KPI
//   - Infrastruktura
//   - Finansije
//   - Bezbednost
//   - Operativa & readiness
//   - Autofinish progres
//   - Protokoli & compliance
//   - Preporuke

import { getStatistike } from './statistika';
import { runDiagnostics } from './auto-repair';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { getAutofinishPetljaSummary, getAutofinishHealthSummary } from './autofinish-petlja';
import { autentifikacijaSistem } from './autentifikacija';
import { spajaPricingLogin } from './spaja-pricing-login';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PROTOKOLA,
  KOMPANIJA,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type AnalizaOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type AnalizaFreshness = 'fresh' | 'stale' | 'unknown';
export type AnalizaTrendDirection = 'up' | 'down' | 'flat';

export const ANALIZA_CONTRACT_VERSION = 'v2';
export const ANALIZA_MODEL_VERSION = '2.0.0';

export const ANALIZA_DOMAIN_WEIGHTS = {
  ekosistem: 0.14,
  infrastruktura: 0.16,
  finansije: 0.14,
  bezbednost: 0.16,
  operativa: 0.16,
  autofinish: 0.12,
  protokoli: 0.12,
} as const;

type AnalizaDomenKljuc = keyof typeof ANALIZA_DOMAIN_WEIGHTS;

export interface AnalizaDomen {
  naziv: string;
  ocena: AnalizaOcena;
  score: number; // 0-100
  confidence: number; // 0-100
  freshness: AnalizaFreshness;
  izvori: string[];
  detalji: Record<string, unknown>;
}

export interface AnalizaPreporuka {
  id: string;
  poruka: string;
  prioritet: 'visok' | 'srednji' | 'nizak';
  klasa: 'blocking' | 'non-blocking';
  domeni: AnalizaDomenKljuc[];
}

export interface AnalizaMeta {
  contractVersion: typeof ANALIZA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: '/api/analiza-svega';
  generatedAt: string;
  scoreWeights: Record<AnalizaDomenKljuc, number>;
  degraded: boolean;
  degradedSources: string[];
}

export interface AnalizaTrend {
  direction: AnalizaTrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  kriticniDomeni: string[];
}

export interface AnalizaSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;

  // Ukupni pregled
  ukupanScore: number;
  konacnaOcena: AnalizaOcena;
  procenatSpremnosti: number;

  // Domeni
  domeni: {
    ekosistem: AnalizaDomen;
    infrastruktura: AnalizaDomen;
    finansije: AnalizaDomen;
    bezbednost: AnalizaDomen;
    operativa: AnalizaDomen;
    autofinish: AnalizaDomen;
    protokoli: AnalizaDomen;
  };

  // Akcione preporuke
  preporuke: string[];
  preporukeDetaljno: AnalizaPreporuka[];
  kriticniDomeni: string[];
  trend: AnalizaTrend;
  meta: AnalizaMeta;

  timestamp: string;
}

// ─── Pomocne funkcije ─────────────────────────────────────────────────────────

interface AnalizaSnapshot {
  ukupanScore: number;
  timestamp: string;
}

let previousAnalizaSnapshot: AnalizaSnapshot | null = null;

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreToAnalizaOcena(score: number): AnalizaOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function domenConfidence(score: number, degraded: boolean): number {
  const base = degraded ? 60 : 88;
  const variance = score >= 90 ? 8 : score >= 75 ? 5 : score >= 50 ? 2 : 0;
  return clampScore(base + variance);
}

function freshnessFromDegradation(degraded: boolean): AnalizaFreshness {
  return degraded ? 'stale' : 'fresh';
}

function safeCall<T>(sourceName: string, degradedSources: string[], fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[analiza-svega] source failure: ${sourceName}`, error);
    return null;
  }
}

// ─── Agregacija ───────────────────────────────────────────────────────────────

/**
 * Gradi kompletnu analizu celokupnog ekosistema.
 * Koristi se i u /api/analiza-svega i u sekvence stranici.
 */
export function buildAnalizaSvega(): AnalizaSvega {
  const degradedSources: string[] = [];
  const stats = safeCall('statistika', degradedSources, () => getStatistike());
  const dijagnostika = safeCall('auto-repair.diagnostics', degradedSources, () => runDiagnostics());
  const operativa = safeCall('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const autofinishSummary = safeCall('autofinish-petlja.summary', degradedSources, () => getAutofinishPetljaSummary());
  const autofinishZdravlje = safeCall('autofinish-petlja.health', degradedSources, () => getAutofinishHealthSummary());
  const nowIso = new Date().toISOString();

  const ukupnoPlatformi = stats?.ukupnoPlatformi ?? 0;
  const aktivnihPlatformi = stats?.aktivnihPlatformi ?? 0;
  const ukupnoPromptova = stats?.ukupnoPromptova ?? 0;
  const ukupnoIgrica = stats?.ukupnoIgrica ?? 0;
  const spajaProVerzija = stats?.spajaProVerzija ?? 0;
  const ukupnoOmegaPersona = stats?.ukupnoOmegaPersona ?? 0;
  const ukupnoKompanija = stats?.ukupnoKompanija ?? 0;
  const ukupnoOrganizacija = stats?.ukupnoOrganizacija ?? 0;
  const ukupnoMobilnihCentrala = stats?.ukupnoMobilnihCentrala ?? 0;
  const ukupnoProksiSignala = stats?.ukupnoProksiSignala ?? 0;
  const ukupnoProvera = dijagnostika?.ukupnoProvera ?? 0;
  const uspesnihDijagnostika = dijagnostika?.uspesnih ?? 0;
  const dijagnostikaZdravlje = dijagnostika?.zdravlje ?? 0;
  const pricingPlanovi = spajaPricingLogin.planovi ?? [];
  const loginMetode = spajaPricingLogin.loginMetode ?? [];
  const platniProizvoda = stats?.platniProizvoda ?? 0;
  const oauthProvajderi = autentifikacijaSistem.konfiguracija.oauthProvajderi ?? [];
  const operativaSpremnost = operativa?.spremnost;
  const runtimeReady = operativaSpremnost?.modelStanja?.runtime === 'runtime-ready';
  const opsReady = operativaSpremnost?.modelStanja?.ops === 'ops-ready';
  const enterpriseMode = operativaSpremnost?.modelStanja?.enterprise ?? 'enterprise-in-progress';
  const acceptanceCriteriaIspunjeni = runtimeReady && opsReady;
  const complianceSignal = enterpriseMode === 'enterprise-ready' ? 100 : 65;
  const readinessSignal = acceptanceCriteriaIspunjeni ? 100 : 55;
  const autofinishStatus = autofinishSummary?.status ?? 'nepoznat';
  const autofinishHealth = autofinishZdravlje?.zdravlje ?? 0;
  const autofinishUkupnoProvera = autofinishZdravlje?.ukupnoProvera ?? 0;
  const autofinishUspesnih = autofinishZdravlje?.uspesnih ?? 0;
  const missingEnvCount = operativaSpremnost?.missingEnv?.length ?? 0;
  const missingVercelEnvCount = operativaSpremnost?.missingVercelEnv?.length ?? 0;

  // ── 1. Ekosistem ────────────────────────────────────────────────────────────
  const platformePokrivenost = ukupnoPlatformi > 0
    ? Math.round((aktivnihPlatformi / ukupnoPlatformi) * 100)
    : 0;
  const ekosistemScore = clampScore(
    Math.round(
      (platformePokrivenost * 0.3) +
      (Math.min(ukupnoPromptova, 30) / 30 * 100 * 0.2) +
      (Math.min(ukupnoIgrica, 97) / 97 * 100 * 0.2) +
      (Math.min(spajaProVerzija, 10) / 10 * 100 * 0.15) +
      (Math.min(ukupnoOmegaPersona, 21) / 21 * 100 * 0.15),
    ),
  );

  const ekosistem: AnalizaDomen = {
    naziv: 'Ekosistem',
    ocena: scoreToAnalizaOcena(ekosistemScore),
    score: ekosistemScore,
    confidence: domenConfidence(ekosistemScore, degradedSources.includes('statistika')),
    freshness: freshnessFromDegradation(degradedSources.includes('statistika')),
    izvori: ['statistika.ts', 'platforme.ts', 'prompt.ts', 'omega-ai.ts'],
    detalji: {
      platforme: ukupnoPlatformi,
      aktivnePlatforme: aktivnihPlatformi,
      platformePokrivenost: `${platformePokrivenost}%`,
      promptovi: ukupnoPromptova,
      igrice: ukupnoIgrica,
      spajaProVerzija,
      omegaPersona: ukupnoOmegaPersona,
      kompanije: ukupnoKompanija,
      organizacije: ukupnoOrganizacija,
    },
  };

  // ── 2. Infrastruktura ───────────────────────────────────────────────────────
  const infraScore = clampScore(
    Math.round(
      (dijagnostikaZdravlje * 0.4) +
      (Math.min(TOTAL_API_ROUTES, 1000) / 1000 * 100 * 0.3) +
      (ukupnoMobilnihCentrala > 0 ? 100 : 0) * 0.15 +
      (ukupnoProksiSignala > 0 ? 100 : 0) * 0.15,
    ),
  );

  const infrastruktura: AnalizaDomen = {
    naziv: 'Infrastruktura',
    ocena: scoreToAnalizaOcena(infraScore),
    score: infraScore,
    confidence: domenConfidence(infraScore, degradedSources.includes('auto-repair.diagnostics') || degradedSources.includes('statistika')),
    freshness: freshnessFromDegradation(degradedSources.includes('auto-repair.diagnostics') || degradedSources.includes('statistika')),
    izvori: ['auto-repair/diagnostics.ts', 'constants.ts', 'statistika.ts'],
    detalji: {
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      stranica: TOTAL_PAGES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      zdravlje: `${dijagnostikaZdravlje}%`,
      ukupnoProvera,
      uspesnih: uspesnihDijagnostika,
      proksiSignala: ukupnoProksiSignala,
      proksiCvorova: stats?.ukupnoProksiCvorova ?? 0,
      mobilnihCentrala: ukupnoMobilnihCentrala,
      mobilnihServisa: stats?.ukupnoMobilnihServisa ?? 0,
      bazaStatus: stats?.bazaStatus ?? 'nepoznat',
      bazaKolekcija: stats?.bazaKolekcija ?? 0,
      realtimeKanala: stats?.realtimeKanala ?? 0,
    },
  };

  // ── 3. Finansije ────────────────────────────────────────────────────────────
  const mesecniPrihod = pricingPlanovi.reduce((s, p) => s + p.cenaMesecno, 0);
  const finansijeScore = clampScore(
    Math.round(
      (pricingPlanovi.length >= 3 ? 100 : pricingPlanovi.length / 3 * 100) * 0.4 +
      (loginMetode.length >= 2 ? 100 : 50) * 0.3 +
      (platniProizvoda >= 3 ? 100 : platniProizvoda / 3 * 100) * 0.3,
    ),
  );

  const finansije: AnalizaDomen = {
    naziv: 'Finansije',
    ocena: scoreToAnalizaOcena(finansijeScore),
    score: finansijeScore,
    confidence: domenConfidence(finansijeScore, degradedSources.includes('statistika')),
    freshness: freshnessFromDegradation(degradedSources.includes('statistika')),
    izvori: ['spaja-pricing-login.ts', 'statistika.ts'],
    detalji: {
      pricingPlanovi: pricingPlanovi.length,
      loginMetode: loginMetode.length,
      platniProizvoda,
      mesecniPrihodPotencijal: mesecniPrihod,
      godisnjaPrihodPotencijal: pricingPlanovi.reduce((s, p) => s + p.cenaGodisnje, 0),
      pricingStatus: spajaPricingLogin.status,
      platniStatus: stats?.platniStatus ?? 'nepoznat',
    },
  };

  // ── 4. Bezbednost ───────────────────────────────────────────────────────────
  const bezbednostScore = clampScore(
    Math.round(
      (autentifikacijaSistem.status === 'aktivan' ? 100 : 0) * 0.4 +
      (autentifikacijaSistem.dozvole.length >= 5 ? 100 : autentifikacijaSistem.dozvole.length / 5 * 100) * 0.3 +
      (oauthProvajderi.length >= 2 ? 100 : 50) * 0.3,
    ),
  );

  const bezbednost: AnalizaDomen = {
    naziv: 'Bezbednost',
    ocena: scoreToAnalizaOcena(bezbednostScore),
    score: bezbednostScore,
    confidence: domenConfidence(bezbednostScore, false),
    freshness: 'fresh',
    izvori: ['autentifikacija.ts'],
    detalji: {
      autentifikacijaStatus: autentifikacijaSistem.status,
      dozvole: autentifikacijaSistem.dozvole.length,
      mogucnosti: autentifikacijaSistem.mogucnosti.length,
      oauthProvajderi: oauthProvajderi.length,
      jwtAutentifikacija: true,
      dvofaktorDostupan: true,
      rbacNivoa: 5,
    },
  };

  // ── 5. Operativa & Readiness ────────────────────────────────────────────────
  const operativaScore = clampScore(
    Math.round(((runtimeReady ? 100 : 45) * 0.5) + ((opsReady ? 100 : 45) * 0.5)),
  );

  const operativa_domen: AnalizaDomen = {
    naziv: 'Operativa',
    ocena: scoreToAnalizaOcena(operativaScore),
    score: operativaScore,
    confidence: domenConfidence(operativaScore, degradedSources.includes('kompanija-spaja-operativa')),
    freshness: freshnessFromDegradation(degradedSources.includes('kompanija-spaja-operativa')),
    izvori: ['kompanija-spaja-operativa.ts'],
    detalji: {
      status: operativaSpremnost?.status ?? 'blokirano',
      ukupanScore: operativaSpremnost?.ukupanScore ?? 0,
      modelStanja: operativaSpremnost?.modelStanja ?? { runtime: 'runtime-incomplete', ops: 'ops-incomplete', enterprise: 'enterprise-in-progress' },
      runtimeReady,
      opsReady,
      readinessSignal,
      complianceSignal,
      acceptanceCriteria: acceptanceCriteriaIspunjeni,
      mailSpreman: operativaSpremnost?.mail?.status ?? 'nepoznat',
      vercelSpreman: operativaSpremnost?.vercel?.status ?? 'nepoznat',
      githubSpreman: operativaSpremnost?.github?.status ?? 'nepoznat',
      enterpriseSpreman: operativaSpremnost?.enterprise?.vercel ?? 'u_pripremi',
      missingEnv: missingEnvCount,
      missingVercelEnv: missingVercelEnvCount,
    },
  };

  // ── 6. Autofinish ────────────────────────────────────────────────────────────
  const autofinishProgressPct = Math.min(100, Math.round((AUTOFINISH_COUNT / 1500) * 100));
  const autofinishScore = clampScore(
    Math.round(
      (autofinishHealth * 0.5) +
      (autofinishProgressPct * 0.3) +
      (autofinishStatus === 'aktivan' ? 100 : 0) * 0.2,
    ),
  );

  const autofinish: AnalizaDomen = {
    naziv: 'Autofinish',
    ocena: scoreToAnalizaOcena(autofinishScore),
    score: autofinishScore,
    confidence: domenConfidence(autofinishScore, degradedSources.includes('autofinish-petlja.summary') || degradedSources.includes('autofinish-petlja.health')),
    freshness: freshnessFromDegradation(degradedSources.includes('autofinish-petlja.summary') || degradedSources.includes('autofinish-petlja.health')),
    izvori: ['autofinish-petlja.ts', 'constants.ts'],
    detalji: {
      iteracija: AUTOFINISH_COUNT,
      status: autofinishStatus,
      zdravlje: `${autofinishHealth}%`,
      ukupnoProvera: autofinishUkupnoProvera,
      uspesnih: autofinishUspesnih,
      progresKa1500: `${autofinishProgressPct}%`,
    },
  };

  // ── 7. Protokoli & Compliance ───────────────────────────────────────────────
  const protokoliScore = clampScore(
    Math.round(
      (TOTAL_PROTOKOLA >= 10 ? 100 : TOTAL_PROTOKOLA / 10 * 100) * 0.6 +
      (complianceSignal * 0.4),
    ),
  );

  const protokoli: AnalizaDomen = {
    naziv: 'Protokoli',
    ocena: scoreToAnalizaOcena(protokoliScore),
    score: protokoliScore,
    confidence: domenConfidence(protokoliScore, degradedSources.includes('kompanija-spaja-operativa')),
    freshness: freshnessFromDegradation(degradedSources.includes('kompanija-spaja-operativa')),
    izvori: ['constants.ts', 'kompanija-spaja-operativa.ts'],
    detalji: {
      ukupnoProtokola: TOTAL_PROTOKOLA,
      readinessSignal,
      complianceSignal,
      acceptanceCriteria: operativaSpremnost?.acceptanceCriteria ?? null,
      enterpriseMode,
      complianceStatus: 'aktivan',
    },
  };

  // ── Ukupni score ─────────────────────────────────────────────────────────────
  const domeni = { ekosistem, infrastruktura, finansije, bezbednost, operativa: operativa_domen, autofinish, protokoli };
  const weightedScore = (Object.entries(domeni) as Array<[AnalizaDomenKljuc, AnalizaDomen]>)
    .reduce((sum, [key, domen]) => sum + (domen.score * ANALIZA_DOMAIN_WEIGHTS[key]), 0);
  const ukupanScore = clampScore(weightedScore);
  const procenatSpremnosti = ukupanScore;

  const konacnaOcena: AnalizaOcena = scoreToAnalizaOcena(ukupanScore);
  const kriticniDomeni = (Object.entries(domeni) as Array<[string, AnalizaDomen]>)
    .filter(([, domen]) => domen.score < 75)
    .map(([naziv]) => naziv);

  const previousScore = previousAnalizaSnapshot?.ukupanScore ?? null;
  const deltaScore = previousScore === null ? 0 : ukupanScore - previousScore;
  const trendDirection: AnalizaTrendDirection =
    deltaScore > 0 ? 'up' : deltaScore < 0 ? 'down' : 'flat';
  previousAnalizaSnapshot = {
    ukupanScore,
    timestamp: nowIso,
  };

  // ── Preporuke ─────────────────────────────────────────────────────────────────
  const preporukeDetaljno: AnalizaPreporuka[] = [];
  const addPreporuka = (preporuka: AnalizaPreporuka) => preporukeDetaljno.push(preporuka);

  if (missingEnvCount > 0) {
    addPreporuka({
      id: 'operativa-missing-env',
      poruka: `Postaviti ${missingEnvCount} nedostajućih env varijabli za runtime/ops`,
      prioritet: 'visok',
      klasa: 'blocking',
      domeni: ['operativa'],
    });
  }
  if (finansijeScore < 90) {
    addPreporuka({
      id: 'finansije-stripe',
      poruka: 'Aktivirati Stripe integraciju za prijem uplata',
      prioritet: 'visok',
      klasa: 'blocking',
      domeni: ['finansije'],
    });
  }
  if (bezbednostScore < 90) {
    addPreporuka({
      id: 'bezbednost-oauth',
      poruka: 'Konfigurisati produkcione OAuth ključeve (Google, GitHub)',
      prioritet: 'visok',
      klasa: 'blocking',
      domeni: ['bezbednost'],
    });
  }
  if (infraScore < 90) {
    addPreporuka({
      id: 'infra-diagnostics',
      poruka: 'Optimizovati zdravlje dijagnostičkog sistema i stabilnost infrastrukture',
      prioritet: 'srednji',
      klasa: 'non-blocking',
      domeni: ['infrastruktura'],
    });
  }
  if (ekosistemScore < 90) {
    addPreporuka({
      id: 'ekosistem-aktivacija',
      poruka: 'Aktivirati sve platforme u ekosistemu',
      prioritet: 'srednji',
      klasa: 'non-blocking',
      domeni: ['ekosistem'],
    });
  }
  if (autofinishScore < 90) {
    addPreporuka({
      id: 'autofinish-progress',
      poruka: 'Nastaviti autofinish iteracije do punog pokrića',
      prioritet: 'srednji',
      klasa: 'non-blocking',
      domeni: ['autofinish'],
    });
  }
  addPreporuka({
    id: 'ops-monitoring',
    poruka: 'Konfigurisati monitoring i alerting za produkciju',
    prioritet: 'nizak',
    klasa: 'non-blocking',
    domeni: ['operativa', 'protokoli'],
  });
  addPreporuka({
    id: 'finansije-e2e',
    poruka: 'Testirati sve pricing planove end-to-end',
    prioritet: 'nizak',
    klasa: 'non-blocking',
    domeni: ['finansije'],
  });

  const prioritetRank = { visok: 0, srednji: 1, nizak: 2 };
  preporukeDetaljno.sort((a, b) => prioritetRank[a.prioritet] - prioritetRank[b.prioritet]);
  const preporuke = preporukeDetaljno.map((p) => p.poruka);

  return {
    sistem: 'ANALIZA SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    konacnaOcena,
    procenatSpremnosti,
    domeni,
    preporuke,
    preporukeDetaljno,
    kriticniDomeni,
    trend: {
      direction: trendDirection,
      deltaScore,
      previousScore,
      currentScore: ukupanScore,
      kriticniDomeni,
    },
    meta: {
      contractVersion: ANALIZA_CONTRACT_VERSION,
      modelVersion: ANALIZA_MODEL_VERSION,
      sourceOfTruth: '/api/analiza-svega',
      generatedAt: nowIso,
      scoreWeights: { ...ANALIZA_DOMAIN_WEIGHTS },
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
