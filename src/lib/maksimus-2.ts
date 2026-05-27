// SpajaUltraOmegaCore -∞Ω+∞ — MAKSIMUS 2
// Kompanija SPAJA — Digitalna Industrija
//
// V2 objedinjeni signal sa 6 domena:
//   - Analiza Svega
//   - Potencijal Svega Ovoga Do Sada
//   - Procesuiranje Svega
//   - Autofinish Svega (orkestracija)
//   - Ekstremno Procesuiranje Svega
//   - Operativna Spremnost

import { buildAnalizaSvega } from './analiza-svega';
import { buildPotencijalSvegaOvogaDoSada } from './potencijal-svega-ovoga-do-sada';
import { buildProcesuiranjeSvega, buildEkstremnoProcesuiranjeSvega } from './procesuiranje-svega';
import { getAutofinishSvegaInfo } from './autofinish-svega';
import { getOperativnaSpremnost } from './kompanija-spaja-operativa';
import { getMaksimus2LastSnapshot, setMaksimus2LastSnapshot } from './maksimus-2-store';
import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';

export type MaksimusOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type Maksimus2TrendDirection = 'up' | 'down' | 'flat';

export const MAKSIMUS_2_CONTRACT_VERSION = 'v2';
export const MAKSIMUS_2_MODEL_VERSION = '2.0.0';
export const MAKSIMUS_2_SOURCE_OF_TRUTH = '/api/maksimus-2';

export const MAKSIMUS_2_WEIGHTS = {
  analiza: 0.28,
  potencijal: 0.22,
  procesuiranje: 0.2,
  orkestracija: 0.1,
  ekstremnoProcesuiranje: 0.1,
  operativnaSpremnost: 0.1,
} as const;

const MAKSIMUS_2_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;

const weightSum = Object.values(MAKSIMUS_2_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
if (Math.abs(weightSum - 1) > 0.0001) {
  throw new Error(`MAKSIMUS_2_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

export interface Maksimus2DomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: Maksimus2TrendDirection;
}

export interface Maksimus2Trend {
  direction: Maksimus2TrendDirection;
  deltaScore: number;
  previousScore: number | null;
  currentScore: number;
  reliable: boolean;
}

export interface Maksimus2Meta {
  contractVersion: typeof MAKSIMUS_2_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof MAKSIMUS_2_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof MAKSIMUS_2_WEIGHTS;
  degraded: boolean;
  degradedSources: string[];
}

export interface Maksimus2Svega {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  konacnaOcena: MaksimusOcena;
  procenatSpremnosti: number;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  domeni: {
    analiza: Maksimus2DomenSignal;
    potencijal: Maksimus2DomenSignal;
    procesuiranje: Maksimus2DomenSignal;
    orkestracija: Maksimus2DomenSignal;
    ekstremnoProcesuiranje: Maksimus2DomenSignal;
    operativnaSpremnost: Maksimus2DomenSignal;
  };
  trend: Maksimus2Trend;
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: Maksimus2Meta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): MaksimusOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function freshnessFromSourceState(available: boolean, degraded: boolean): 'fresh' | 'stale' | 'unknown' {
  if (!available) return 'unknown';
  return degraded ? 'stale' : 'fresh';
}

function computeConfidence(score: number, available: boolean, degraded: boolean): number {
  if (!available) return 45;
  const base = degraded ? 60 : 88;
  const variance = score >= 90
    ? MAKSIMUS_2_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? MAKSIMUS_2_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? MAKSIMUS_2_CONFIDENCE_VARIANCE.delimicno
        : MAKSIMUS_2_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function scoreDeltaDirection(current: number, previous: number | null): Maksimus2TrendDirection {
  if (previous === null) return 'flat';
  const delta = current - previous;
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'flat';
}

async function safeCallAsync<T>(sourceName: string, degradedSources: string[], fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[maksimus-2] source failure: ${sourceName}`, error);
    return null;
  }
}

function safeCallSync<T>(sourceName: string, degradedSources: string[], fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[maksimus-2] source failure: ${sourceName}`, error);
    return null;
  }
}

export async function buildMaksimus2(): Promise<Maksimus2Svega> {
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const analizaPromise = safeCallAsync('analiza-svega', degradedSources, () => buildAnalizaSvega());
  const potencijal = safeCallSync('potencijal-svega-ovoga-do-sada', degradedSources, () => buildPotencijalSvegaOvogaDoSada());
  const procesuiranje = safeCallSync('procesuiranje-svega', degradedSources, () => buildProcesuiranjeSvega());
  const autofinishInfo = safeCallSync('autofinish-svega', degradedSources, () => getAutofinishSvegaInfo());
  const ekstremnoProcesuiranje = safeCallSync('ekstremno-procesuiranje-svega', degradedSources, () => buildEkstremnoProcesuiranjeSvega());
  const operativnaSpremnost = safeCallSync('kompanija-spaja-operativa', degradedSources, () => getOperativnaSpremnost());

  const analiza = await analizaPromise;
  const previousSnapshot = getMaksimus2LastSnapshot();

  const analizaScore = analiza?.ukupanScore ?? 0;
  const potencijalScore = potencijal?.ukupniPotencijal ?? 0;
  const procesuiranjeScore = procesuiranje?.ukupanProcenat ?? 0;
  const orkestracijaScore = autofinishInfo
    ? clampScore((autofinishInfo.dostupniStepovi.length / 6) * 100)
    : 0;
  const ekstremnoProcesuiranjeScore = ekstremnoProcesuiranje?.ukupanProcenat ?? 0;
  const operativnaSpremnostScore = operativnaSpremnost?.spremnost?.ukupanScore ?? 0;

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const ukupanScore = clampScore(
    analizaScore * MAKSIMUS_2_WEIGHTS.analiza
      + potencijalScore * MAKSIMUS_2_WEIGHTS.potencijal
      + procesuiranjeScore * MAKSIMUS_2_WEIGHTS.procesuiranje
      + orkestracijaScore * MAKSIMUS_2_WEIGHTS.orkestracija
      + ekstremnoProcesuiranjeScore * MAKSIMUS_2_WEIGHTS.ekstremnoProcesuiranje
      + operativnaSpremnostScore * MAKSIMUS_2_WEIGHTS.operativnaSpremnost,
  );

  const deltaScore = globalPreviousScore === null ? 0 : ukupanScore - globalPreviousScore;
  const trendDirection = scoreDeltaDirection(ukupanScore, globalPreviousScore);

  const domeni = {
    analiza: {
      naziv: 'Analiza Svega',
      score: analizaScore,
      confidence: computeConfidence(analizaScore, analiza !== null, analiza?.meta.degraded ?? false),
      tezina: MAKSIMUS_2_WEIGHTS.analiza,
      doprinos: clampScore(analizaScore * MAKSIMUS_2_WEIGHTS.analiza),
      sourceOfTruth: analiza?.meta.sourceOfTruth ?? '/api/analiza-svega',
      freshness: freshnessFromSourceState(analiza !== null, analiza?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(analizaScore, previousSnapshot?.domenScores.analiza ?? null),
    } satisfies Maksimus2DomenSignal,
    potencijal: {
      naziv: 'Potencijal Svega Ovoga Do Sada',
      score: potencijalScore,
      confidence: computeConfidence(potencijalScore, potencijal !== null, potencijal?.meta.degraded ?? false),
      tezina: MAKSIMUS_2_WEIGHTS.potencijal,
      doprinos: clampScore(potencijalScore * MAKSIMUS_2_WEIGHTS.potencijal),
      sourceOfTruth: potencijal?.meta.sourceOfTruth ?? '/api/potencijal-svega-ovoga-do-sada',
      freshness: freshnessFromSourceState(potencijal !== null, potencijal?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(potencijalScore, previousSnapshot?.domenScores.potencijal ?? null),
    } satisfies Maksimus2DomenSignal,
    procesuiranje: {
      naziv: 'Procesuiranje Svega',
      score: procesuiranjeScore,
      confidence: computeConfidence(procesuiranjeScore, procesuiranje !== null, procesuiranje?.meta.degraded ?? false),
      tezina: MAKSIMUS_2_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * MAKSIMUS_2_WEIGHTS.procesuiranje),
      sourceOfTruth: procesuiranje?.meta.sourceOfTruth ?? '/api/procesuiranje-svega',
      freshness: freshnessFromSourceState(procesuiranje !== null, procesuiranje?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(procesuiranjeScore, previousSnapshot?.domenScores.procesuiranje ?? null),
    } satisfies Maksimus2DomenSignal,
    orkestracija: {
      naziv: 'Autofinish Svega',
      score: orkestracijaScore,
      confidence: computeConfidence(orkestracijaScore, autofinishInfo !== null, false),
      tezina: MAKSIMUS_2_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * MAKSIMUS_2_WEIGHTS.orkestracija),
      sourceOfTruth: autofinishInfo?.endpoint ?? '/api/autofinish-svega',
      freshness: freshnessFromSourceState(autofinishInfo !== null, false),
      trendDirection: scoreDeltaDirection(orkestracijaScore, previousSnapshot?.domenScores.orkestracija ?? null),
    } satisfies Maksimus2DomenSignal,
    ekstremnoProcesuiranje: {
      naziv: 'Ekstremno Procesuiranje Svega',
      score: ekstremnoProcesuiranjeScore,
      confidence: computeConfidence(ekstremnoProcesuiranjeScore, ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      tezina: MAKSIMUS_2_WEIGHTS.ekstremnoProcesuiranje,
      doprinos: clampScore(ekstremnoProcesuiranjeScore * MAKSIMUS_2_WEIGHTS.ekstremnoProcesuiranje),
      sourceOfTruth: ekstremnoProcesuiranje?.meta.sourceOfTruth ?? '/api/ekstremno-procesuiranje-svega',
      freshness: freshnessFromSourceState(ekstremnoProcesuiranje !== null, ekstremnoProcesuiranje?.meta.degraded ?? false),
      trendDirection: scoreDeltaDirection(ekstremnoProcesuiranjeScore, previousSnapshot?.domenScores.ekstremnoProcesuiranje ?? null),
    } satisfies Maksimus2DomenSignal,
    operativnaSpremnost: {
      naziv: 'Operativna Spremnost',
      score: operativnaSpremnostScore,
      confidence: computeConfidence(operativnaSpremnostScore, operativnaSpremnost !== null, false),
      tezina: MAKSIMUS_2_WEIGHTS.operativnaSpremnost,
      doprinos: clampScore(operativnaSpremnostScore * MAKSIMUS_2_WEIGHTS.operativnaSpremnost),
      sourceOfTruth: '/api/status',
      freshness: freshnessFromSourceState(operativnaSpremnost !== null, false),
      trendDirection: scoreDeltaDirection(operativnaSpremnostScore, previousSnapshot?.domenScores.operativnaSpremnost ?? null),
    } satisfies Maksimus2DomenSignal,
  };

  const kriticniDomeni = Object.values(domeni).filter((domen) => domen.score < 75).map((domen) => domen.naziv);
  const preporuke: string[] = [];

  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno unaprediti domene ispod 75%: ${kriticniDomeni.join(', ')}`);
  }
  if (operativnaSpremnostScore < 75) {
    preporuke.push('Podići runtime i ops readiness kako bi MAKSIMUS 2 ostao stabilan u produkciji.');
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore signala: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi ključni domeni su stabilni; nastaviti regularni monitoring i iterativnu optimizaciju.');
  }

  setMaksimus2LastSnapshot({
    ukupanScore,
    domenScores: {
      analiza: analizaScore,
      potencijal: potencijalScore,
      procesuiranje: procesuiranjeScore,
      orkestracija: orkestracijaScore,
      ekstremnoProcesuiranje: ekstremnoProcesuiranjeScore,
      operativnaSpremnost: operativnaSpremnostScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'MAKSIMUS 2 — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    konacnaOcena: scoreToOcena(ukupanScore),
    procenatSpremnosti: ukupanScore,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    domeni,
    trend: {
      direction: trendDirection,
      deltaScore,
      previousScore: globalPreviousScore,
      currentScore: ukupanScore,
      reliable: globalPreviousScore !== null,
    },
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    meta: {
      contractVersion: MAKSIMUS_2_CONTRACT_VERSION,
      modelVersion: MAKSIMUS_2_MODEL_VERSION,
      sourceOfTruth: MAKSIMUS_2_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: MAKSIMUS_2_WEIGHTS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}

export function getMaksimus2Info() {
  return {
    sistem: 'MAKSIMUS 2 — Digitalna Industrija',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    endpoint: MAKSIMUS_2_SOURCE_OF_TRUTH,
    contractVersion: MAKSIMUS_2_CONTRACT_VERSION,
    modelVersion: MAKSIMUS_2_MODEL_VERSION,
    scoreWeights: MAKSIMUS_2_WEIGHTS,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}
