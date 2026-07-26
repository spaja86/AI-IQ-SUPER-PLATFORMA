// SpajaUltraOmegaCore -∞Ω+∞ — SVE OD SVEGA
// Kompanija SPAJA — Digitalna Industrija
//
// Ultimativni agregator koji unifikuje sve "svega" domene u jedan
// mega-signal Digitalne Industrije:
//   - Analiza Svega (ekosistem dijagnostika)
//   - Potencijal Svega Ovoga Do Sada (uplift)
//   - Procesuiranje Svega (operativni pipeline)
//   - Autofinish Svega (orkestracija)

import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from './constants';

// ─── Konstante ────────────────────────────────────────────────────────────────

export const SVE_OD_SVEGA_CONTRACT_VERSION = 'v1';
export const SVE_OD_SVEGA_MODEL_VERSION = '1.0.0';
export const SVE_OD_SVEGA_SOURCE_OF_TRUTH = '/api/sve-od-svega';

const SVE_WEIGHTS = {
  analiza: 0.30,
  potencijal: 0.20,
  procesuiranje: 0.25,
  orkestracija: 0.25,
} as const;

// ─── Tipovi ──────────────────────────────────────────────────────────────────

export type SveOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type SveFreshness = 'fresh' | 'stale' | 'unknown';

export interface SveDomenSignal {
  naziv: string;
  score: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: SveFreshness;
}

export interface SveOdSvegaMeta {
  contractVersion: typeof SVE_OD_SVEGA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof SVE_OD_SVEGA_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof SVE_WEIGHTS;
  degraded: boolean;
  degradedSources: string[];
}

export interface SveOdSvega {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  konacnaOcena: SveOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  preporuke: string[];
  domeni: {
    analiza: SveDomenSignal;
    potencijal: SveDomenSignal;
    procesuiranje: SveDomenSignal;
    orkestracija: SveDomenSignal;
  };
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: SveOdSvegaMeta;
  timestamp: string;
}

export interface SveOdSvegaInfo {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  endpoint: string;
  contractVersion: string;
  modelVersion: string;
  scoreWeights: typeof SVE_WEIGHTS;
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  timestamp: string;
}

// ─── Pomoćnici ────────────────────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): SveOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

async function safeAsync<T>(
  naziv: string,
  degradedSources: string[],
  fn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    degradedSources.push(naziv);
    console.error(`[sve-od-svega] source failure: ${naziv}`, error);
    return null;
  }
}

function safeSync<T>(
  naziv: string,
  degradedSources: string[],
  fn: () => T,
): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(naziv);
    console.error(`[sve-od-svega] source failure: ${naziv}`, error);
    return null;
  }
}

// ─── Graditelj ───────────────────────────────────────────────────────────────

export async function buildSveOdSvega(): Promise<SveOdSvega> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  // Pokrenuti sve izvore paralelno
  const [analiza, potencijal, procesuiranje, autofinishInfo] = await Promise.all([
    safeAsync('analiza-svega', degradedSources, () => buildAnalizaSvega()),
    Promise.resolve(
      safeSync('potencijal-svega-ovoga-do-sada', degradedSources, () =>
        buildPotencijalSvegaOvogaDoSada(),
      ),
    ),
    Promise.resolve(
      safeSync('procesuiranje-svega', degradedSources, () => buildProcesuiranjeSvega()),
    ),
    Promise.resolve(
      safeSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo()),
    ),
  ]);

  const analizaScore = clampScore(analiza?.ukupanScore ?? 0);
  const potencijalScore = clampScore(potencijal?.ukupniPotencijal ?? 0);
  const procesuiranjeScore = clampScore(procesuiranje?.ukupanProcenat ?? 0);
  const orkestracijaScore = autofinishInfo
    ? clampScore((autofinishInfo.dostupniStepovi.length / 9) * 100)
    : 0;

  const domeni: SveOdSvega['domeni'] = {
    analiza: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      tezina: SVE_WEIGHTS.analiza,
      doprinos: clampScore(analizaScore * SVE_WEIGHTS.analiza),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: analiza === null ? 'unknown' : analiza.meta.degraded ? 'stale' : 'fresh',
    },
    potencijal: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      tezina: SVE_WEIGHTS.potencijal,
      doprinos: clampScore(potencijalScore * SVE_WEIGHTS.potencijal),
      sourceOfTruth: potencijal?.meta.sourceOfTruth ?? '/api/potencijal-svega-ovoga-do-sada',
      freshness: potencijal === null ? 'unknown' : potencijal.meta.degraded ? 'stale' : 'fresh',
    },
    procesuiranje: {
      naziv: 'Procesuiranje Svega',
      score: procesuiranjeScore,
      tezina: SVE_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * SVE_WEIGHTS.procesuiranje),
      sourceOfTruth: procesuiranje?.meta.sourceOfTruth ?? '/api/procesuiranje-svega',
      freshness:
        procesuiranje === null ? 'unknown' : procesuiranje.meta.degraded ? 'stale' : 'fresh',
    },
    orkestracija: {
      naziv: 'Autofinish Orkestracija',
      score: orkestracijaScore,
      tezina: SVE_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * SVE_WEIGHTS.orkestracija),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: 'fresh',
    },
  };

  const ukupanScore = clampScore(
    domeni.analiza.score * SVE_WEIGHTS.analiza +
      domeni.potencijal.score * SVE_WEIGHTS.potencijal +
      domeni.procesuiranje.score * SVE_WEIGHTS.procesuiranje +
      domeni.orkestracija.score * SVE_WEIGHTS.orkestracija,
  );

  const kriticniDomeni = Object.values(domeni)
    .filter((d) => d.score < 75)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(
      `Prioritetno unaprediti domene ispod 75%: ${kriticniDomeni.join(', ')}`,
    );
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push(
      'Svi domeni su stabilni — SVE OD svega je u optimalnom stanju. Nastaviti monitoring.',
    );
  }

  return {
    sistem: 'SVE OD SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    kriticniDomeni,
    preporuke,
    domeni,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    meta: {
      contractVersion: SVE_OD_SVEGA_CONTRACT_VERSION,
      modelVersion: SVE_OD_SVEGA_MODEL_VERSION,
      sourceOfTruth: SVE_OD_SVEGA_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: SVE_WEIGHTS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

export function getSveOdSvegaInfo(): SveOdSvegaInfo {
  return {
    sistem: 'SVE OD SVEGA — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    endpoint: SVE_OD_SVEGA_SOURCE_OF_TRUTH,
    contractVersion: SVE_OD_SVEGA_CONTRACT_VERSION,
    modelVersion: SVE_OD_SVEGA_MODEL_VERSION,
    scoreWeights: SVE_WEIGHTS,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}
