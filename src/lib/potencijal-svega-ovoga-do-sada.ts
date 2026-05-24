// SpajaUltraOmegaCore -∞Ω+∞ — POTENCIJAL SVEGA OVOGA DO SADA
// Kompanija SPAJA — Digitalna Industrija
//
// Jedinstven izvor istine za potencijal sistema:
//   - stanje sada (ostvareni score)
//   - potencijal posle sledećih koraka (unlock score)
//   - blokeri i unlock akcije
//   - preporuke i prioriteti

import { getStatistike } from './statistika';
import { runDiagnostics } from './auto-repair';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { getAutofinishPetljaSummary, getAutofinishHealthSummary } from './autofinish-petlja';
import { autentifikacijaSistem } from './autentifikacija';
import { spajaPricingLogin } from './spaja-pricing-login';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  TOTAL_API_ROUTES,
  TOTAL_PROTOKOLA,
} from './constants';

export type PotencijalOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type PotencijalFreshness = 'fresh' | 'stale' | 'unknown';
export type PotencijalTrendDirection = 'up' | 'down' | 'flat';

export const POTENCIJAL_CONTRACT_VERSION = 'v1';
export const POTENCIJAL_MODEL_VERSION = '1.0.0';

export const POTENCIJAL_DOMAIN_WEIGHTS = {
  ekosistem: 0.14,
  infrastruktura: 0.14,
  finansije: 0.16,
  bezbednost: 0.14,
  operativa: 0.16,
  autofinish: 0.12,
  aiProizvod: 0.14,
} as const;

type PotencijalDomenKljuc = keyof typeof POTENCIJAL_DOMAIN_WEIGHTS;

const POTENCIJAL_PRIORITY_RANK = {
  visok: 0,
  srednji: 1,
  nizak: 2,
} as const;

const domainWeightSum = Object.values(POTENCIJAL_DOMAIN_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
if (Math.abs(domainWeightSum - 1) > 0.0001) {
  throw new Error(`POTENCIJAL_DOMAIN_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${domainWeightSum})`);
}

export interface PotencijalDomen {
  naziv: string;
  ocena: PotencijalOcena;
  ostvareniScore: number;
  potencijalScore: number;
  uplift: number;
  confidence: number;
  freshness: PotencijalFreshness;
  izvori: string[];
  detalji: Record<string, unknown>;
}

export interface PotencijalBloker {
  id: string;
  domen: PotencijalDomenKljuc;
  naslov: string;
  opis: string;
  prioritet: 'visok' | 'srednji' | 'nizak';
  klasa: 'blocking' | 'non-blocking';
  expectedUplift: number;
  unlockAkcije: string[];
}

export interface PotencijalPreporuka {
  id: string;
  poruka: string;
  prioritet: 'visok' | 'srednji' | 'nizak';
  klasa: 'blocking' | 'non-blocking';
  domeni: PotencijalDomenKljuc[];
  expectedUplift: number;
}

export interface PotencijalMeta {
  contractVersion: typeof POTENCIJAL_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: '/api/potencijal-svega-ovoga-do-sada';
  generatedAt: string;
  scoreWeights: Record<PotencijalDomenKljuc, number>;
  degraded: boolean;
  degradedSources: string[];
}

export interface PotencijalTrend {
  direction: PotencijalTrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface PotencijalSvegaOvogaDoSada {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupniPotencijal: number;
  ostvarenoDoSada: number;
  najbliziRast: number;
  blokiranoUkupno: number;
  konacnaOcena: PotencijalOcena;
  domeni: {
    ekosistem: PotencijalDomen;
    infrastruktura: PotencijalDomen;
    finansije: PotencijalDomen;
    bezbednost: PotencijalDomen;
    operativa: PotencijalDomen;
    autofinish: PotencijalDomen;
    aiProizvod: PotencijalDomen;
  };
  blokeri: PotencijalBloker[];
  unlockFaktori: PotencijalBloker[];
  preporuke: string[];
  preporukeDetaljno: PotencijalPreporuka[];
  kriticniDomeni: string[];
  trend: PotencijalTrend;
  meta: PotencijalMeta;
  timestamp: string;
}

interface PotencijalSnapshot {
  ukupniPotencijal: number;
  timestamp: string;
}

let previousSnapshot: PotencijalSnapshot | null = null;

function clampScore(score: number): number {
  const clamped = Math.max(0, Math.min(100, score));
  return Math.round(clamped);
}

function scoreToOcena(score: number): PotencijalOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function freshnessFromDegradation(degraded: boolean): PotencijalFreshness {
  return degraded ? 'stale' : 'fresh';
}

function domenConfidence(score: number, degraded: boolean): number {
  const base = degraded ? 60 : 88;
  const variance = score >= 90 ? 8 : score >= 75 ? 5 : score >= 50 ? 2 : 0;
  return clampScore(base + variance);
}

function safeCall<T>(sourceName: string, degradedSources: string[], fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[potencijal-svega-ovoga-do-sada] source failure: ${sourceName}`, error);
    return null;
  }
}

function buildDomen(
  naziv: string,
  ostvareniScore: number,
  potencijalScore: number,
  degraded: boolean,
  izvori: string[],
  detalji: Record<string, unknown>,
): PotencijalDomen {
  const ostvareni = clampScore(ostvareniScore);
  const potencijal = clampScore(potencijalScore);
  return {
    naziv,
    ocena: scoreToOcena(potencijal),
    ostvareniScore: ostvareni,
    potencijalScore: potencijal,
    uplift: clampScore(potencijal - ostvareni),
    confidence: domenConfidence(potencijal, degraded),
    freshness: freshnessFromDegradation(degraded),
    izvori,
    detalji,
  };
}

export function buildPotencijalSvegaOvogaDoSada(): PotencijalSvegaOvogaDoSada {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const stats = safeCall('statistika', degradedSources, () => getStatistike());
  const dijagnostika = safeCall('auto-repair.diagnostics', degradedSources, () => runDiagnostics());
  const operativa = safeCall('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());
  const autofinishSummary = safeCall('autofinish-petlja.summary', degradedSources, () => getAutofinishPetljaSummary());
  const autofinishHealth = safeCall('autofinish-petlja.health', degradedSources, () => getAutofinishHealthSummary());

  const ukupnoPlatformi = stats?.ukupnoPlatformi ?? 0;
  const aktivnihPlatformi = stats?.aktivnihPlatformi ?? 0;
  const ukupnoPromptova = stats?.ukupnoPromptova ?? 0;
  const ukupnoOmegaPersona = stats?.ukupnoOmegaPersona ?? 0;
  const zdravljeSistema = dijagnostika?.zdravlje ?? 0;
  const pricingPlanovi = spajaPricingLogin.planovi ?? [];
  const loginMetode = spajaPricingLogin.loginMetode ?? [];
  const oauthProvajderi = autentifikacijaSistem.konfiguracija.oauthProvajderi ?? [];

  const runtimeReady = operativa?.spremnost.modelStanja.runtime === 'runtime-ready';
  const opsReady = operativa?.spremnost.modelStanja.ops === 'ops-ready';
  const enterpriseReady = operativa?.spremnost.modelStanja.enterprise === 'enterprise-ready';
  const missingEnvCount = operativa?.spremnost.missingEnv.length ?? 0;
  const missingVercelEnvCount = operativa?.spremnost.missingVercelEnv.length ?? 0;

  const autofinishStatus = autofinishSummary?.status ?? 'nepoznat';
  const autofinishZdravlje = autofinishHealth?.zdravlje ?? 0;
  const autofinishProgressPct = Math.min(100, Math.round((AUTOFINISH_COUNT / 1500) * 100));

  const ekosistemCoverage = ukupnoPlatformi > 0 ? Math.round((aktivnihPlatformi / ukupnoPlatformi) * 100) : 0;
  const ekosistemOstvareni = clampScore((ekosistemCoverage * 0.6) + (Math.min(ukupnoPromptova, 30) / 30 * 100 * 0.4));
  const ekosistemPotencijal = clampScore(ekosistemOstvareni + ((100 - ekosistemCoverage) * 0.4));

  const infrastrukturaOstvareni = clampScore((zdravljeSistema * 0.6) + (Math.min(TOTAL_API_ROUTES, 1500) / 1500 * 100 * 0.4));
  const infrastrukturaPotencijal = clampScore(infrastrukturaOstvareni + Math.min(20, (100 - zdravljeSistema) * 0.5));

  const finansijeOstvareni = clampScore(
    (pricingPlanovi.length >= 3 ? 100 : (pricingPlanovi.length / 3) * 100) * 0.5 +
    (loginMetode.length >= 2 ? 100 : 60) * 0.2 +
    (stats?.platniStatus === 'aktivan' ? 100 : 45) * 0.3,
  );
  const finansijePotencijal = clampScore(finansijeOstvareni + (enterpriseReady ? 8 : 18));

  const bezbednostOstvareni = clampScore(
    (autentifikacijaSistem.status === 'aktivan' ? 100 : 40) * 0.5 +
    (autentifikacijaSistem.dozvole.length >= 5 ? 100 : (autentifikacijaSistem.dozvole.length / 5) * 100) * 0.2 +
    (oauthProvajderi.length >= 2 ? 100 : 60) * 0.3,
  );
  const bezbednostPotencijal = clampScore(bezbednostOstvareni + (oauthProvajderi.length >= 2 ? 6 : 16));

  const operativaOstvareni = clampScore(((runtimeReady ? 100 : 50) * 0.5) + ((opsReady ? 100 : 50) * 0.5));
  const operativaPotencijal = clampScore(operativaOstvareni + Math.min(18, (missingEnvCount + missingVercelEnvCount) > 0 ? 18 : 8));

  const autofinishOstvareni = clampScore((autofinishZdravlje * 0.5) + (autofinishProgressPct * 0.5));
  const autofinishPotencijal = clampScore(autofinishOstvareni + (autofinishStatus === 'aktivan' ? 10 : 6));

  const aiProizvodOstvareni = clampScore(
    (Math.min(ukupnoOmegaPersona, 21) / 21 * 100 * 0.4) +
    (Math.min(ukupnoPromptova, 30) / 30 * 100 * 0.4) +
    (Math.min(TOTAL_PROTOKOLA, 12) / 12 * 100 * 0.2),
  );
  const aiProizvodPotencijal = clampScore(aiProizvodOstvareni + 12);

  const domeni = {
    ekosistem: buildDomen(
      'Ekosistem Potencijal',
      ekosistemOstvareni,
      ekosistemPotencijal,
      degradedSources.includes('statistika'),
      ['statistika.ts', 'platforme.ts', 'prompt.ts'],
      {
        platforme: ukupnoPlatformi,
        aktivnePlatforme: aktivnihPlatformi,
        pokrivenost: `${ekosistemCoverage}%`,
      },
    ),
    infrastruktura: buildDomen(
      'Infrastrukturni Potencijal',
      infrastrukturaOstvareni,
      infrastrukturaPotencijal,
      degradedSources.includes('auto-repair.diagnostics') || degradedSources.includes('statistika'),
      ['auto-repair/diagnostics.ts', 'constants.ts', 'statistika.ts'],
      {
        zdravljeSistema: `${zdravljeSistema}%`,
        apiRuta: TOTAL_API_ROUTES,
      },
    ),
    finansije: buildDomen(
      'Finansijski Potencijal',
      finansijeOstvareni,
      finansijePotencijal,
      degradedSources.includes('statistika'),
      ['spaja-pricing-login.ts', 'statistika.ts'],
      {
        pricingPlanovi: pricingPlanovi.length,
        loginMetode: loginMetode.length,
        platniStatus: stats?.platniStatus ?? 'nepoznat',
      },
    ),
    bezbednost: buildDomen(
      'Bezbednosni Potencijal',
      bezbednostOstvareni,
      bezbednostPotencijal,
      false,
      ['autentifikacija.ts'],
      {
        autentifikacijaStatus: autentifikacijaSistem.status,
        dozvole: autentifikacijaSistem.dozvole.length,
        oauthProvajderi: oauthProvajderi.length,
      },
    ),
    operativa: buildDomen(
      'Operativni Potencijal',
      operativaOstvareni,
      operativaPotencijal,
      degradedSources.includes('kompanija-spaja-operativa'),
      ['kompanija-spaja-operativa.ts'],
      {
        runtimeReady,
        opsReady,
        enterpriseReady,
        missingEnv: missingEnvCount,
        missingVercelEnv: missingVercelEnvCount,
      },
    ),
    autofinish: buildDomen(
      'Autofinish Potencijal',
      autofinishOstvareni,
      autofinishPotencijal,
      degradedSources.includes('autofinish-petlja.summary') || degradedSources.includes('autofinish-petlja.health'),
      ['autofinish-petlja.ts', 'constants.ts'],
      {
        iteracija: AUTOFINISH_COUNT,
        status: autofinishStatus,
        zdravlje: `${autofinishZdravlje}%`,
        progresKa1500: `${autofinishProgressPct}%`,
      },
    ),
    aiProizvod: buildDomen(
      'AI/Proizvodni Potencijal',
      aiProizvodOstvareni,
      aiProizvodPotencijal,
      degradedSources.includes('statistika'),
      ['statistika.ts', 'constants.ts'],
      {
        omegaPersona: ukupnoOmegaPersona,
        promptovi: ukupnoPromptova,
        protokoli: TOTAL_PROTOKOLA,
      },
    ),
  };

  const weightedPotencijal = (Object.entries(domeni) as Array<[PotencijalDomenKljuc, PotencijalDomen]>)
    .reduce((sum, [key, domen]) => sum + (domen.potencijalScore * POTENCIJAL_DOMAIN_WEIGHTS[key]), 0);
  const weightedOstvareno = (Object.entries(domeni) as Array<[PotencijalDomenKljuc, PotencijalDomen]>)
    .reduce((sum, [key, domen]) => sum + (domen.ostvareniScore * POTENCIJAL_DOMAIN_WEIGHTS[key]), 0);

  const ukupniPotencijal = clampScore(weightedPotencijal);
  const ostvarenoDoSada = clampScore(weightedOstvareno);
  const najbliziRast = clampScore(ukupniPotencijal - ostvarenoDoSada);

  const blokeri: PotencijalBloker[] = [];
  if (missingEnvCount > 0) {
    blokeri.push({
      id: 'operativa-missing-env',
      domen: 'operativa',
      naslov: 'Nedostaju produkcione env varijable',
      opis: `Nedostaje ${missingEnvCount} env varijabli koje direktno utiču na runtime/ops readiness.`,
      prioritet: 'visok',
      klasa: 'blocking',
      expectedUplift: 14,
      unlockAkcije: [
        'Postaviti sve required env varijable u runtime okruženju',
        'Validirati predeploy:check status bez upozorenja',
      ],
    });
  }
  if (oauthProvajderi.length < 2) {
    blokeri.push({
      id: 'bezbednost-oauth-kljucevi',
      domen: 'bezbednost',
      naslov: 'Nepotpuna OAuth konfiguracija',
      opis: 'Produkcioni OAuth ključevi nisu kompletno aktivirani za sve podržane provajdere.',
      prioritet: 'visok',
      klasa: 'blocking',
      expectedUplift: 10,
      unlockAkcije: [
        'Aktivirati Google OAuth u produkciji',
        'Aktivirati GitHub OAuth u produkciji',
      ],
    });
  }
  if (autofinishProgressPct < 90) {
    blokeri.push({
      id: 'autofinish-progres-1500',
      domen: 'autofinish',
      naslov: 'Autofinish progres ispod ciljnog praga',
      opis: `Trenutni progres ${autofinishProgressPct}% je ispod cilja za punu stabilizaciju roadmap-a.`,
      prioritet: 'srednji',
      klasa: 'non-blocking',
      expectedUplift: 8,
      unlockAkcije: [
        'Nastaviti iteracije autofinish petlje',
        'Zatvoriti preostale route coverage praznine',
      ],
    });
  }
  if (!enterpriseReady) {
    blokeri.push({
      id: 'finansije-enterprise-konverzija',
      domen: 'finansije',
      naslov: 'Enterprise monetizacija nije zaključana',
      opis: 'Enterprise režim je i dalje u pripremi, što smanjuje kratkoročni monetizacioni uplift.',
      prioritet: 'srednji',
      klasa: 'non-blocking',
      expectedUplift: 6,
      unlockAkcije: [
        'Finalizovati enterprise ugovore i planove',
        'Potvrditi billing i support tokove za enterprise nivo',
      ],
    });
  }

  const unlockFaktori = [...blokeri].sort((a, b) => b.expectedUplift - a.expectedUplift);

  const preporukeDetaljno: PotencijalPreporuka[] = unlockFaktori.map((bloker) => ({
    id: `preporuka-${bloker.id}`,
    poruka: `${bloker.naslov} — ${bloker.unlockAkcije[0]}`,
    prioritet: bloker.prioritet,
    klasa: bloker.klasa,
    domeni: [bloker.domen],
    expectedUplift: bloker.expectedUplift,
  }));

  preporukeDetaljno.push({
    id: 'preporuka-ai-proizvod-iteracije',
    poruka: 'Pojačati AI/proizvodne iteracije za brži rast potencijala u domenima prompt+persona.',
    prioritet: 'nizak',
    klasa: 'non-blocking',
    domeni: ['aiProizvod', 'ekosistem'],
    expectedUplift: 4,
  });

  preporukeDetaljno.sort((a, b) => {
    if (a.klasa !== b.klasa) {
      return a.klasa === 'blocking' ? -1 : 1;
    }
    return POTENCIJAL_PRIORITY_RANK[a.prioritet] - POTENCIJAL_PRIORITY_RANK[b.prioritet];
  });

  const preporuke = preporukeDetaljno.map((p) => p.poruka);
  const kriticniDomeni = (Object.entries(domeni) as Array<[string, PotencijalDomen]>)
    .filter(([, domen]) => domen.potencijalScore < 75)
    .map(([naziv]) => naziv);

  const previousScore = previousSnapshot?.ukupniPotencijal ?? null;
  const deltaScore = previousScore === null ? 0 : ukupniPotencijal - previousScore;
  const direction: PotencijalTrendDirection = deltaScore > 0 ? 'up' : deltaScore < 0 ? 'down' : 'flat';
  previousSnapshot = {
    ukupniPotencijal,
    timestamp: nowIso,
  };

  return {
    sistem: 'POTENCIJAL SVEGA OVOGA DO SADA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupniPotencijal,
    ostvarenoDoSada,
    najbliziRast,
    blokiranoUkupno: blokeri.length,
    konacnaOcena: scoreToOcena(ukupniPotencijal),
    domeni,
    blokeri,
    unlockFaktori,
    preporuke,
    preporukeDetaljno,
    kriticniDomeni,
    trend: {
      direction,
      deltaScore,
      previousScore,
      currentScore: ukupniPotencijal,
      reliable: previousScore !== null,
    },
    meta: {
      contractVersion: POTENCIJAL_CONTRACT_VERSION,
      modelVersion: POTENCIJAL_MODEL_VERSION,
      sourceOfTruth: '/api/potencijal-svega-ovoga-do-sada',
      generatedAt: nowIso,
      scoreWeights: { ...POTENCIJAL_DOMAIN_WEIGHTS },
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
