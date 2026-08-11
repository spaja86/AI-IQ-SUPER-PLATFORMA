// SpajaUltraOmegaCore -∞Ω+∞ — FORCE
// Kompanija SPAJA — Digitalna Industrija
//
// FORCE — Fokusirana Orkestracija Reakcionih i Ciljnih Energija.
// Cross-domain engine sa 6 domena:
//   - Fokus
//   - Operativa
//   - Reakcija
//   - Cilj
//   - Energija
//   - Snaga

import { APP_VERSION, AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES, TOTAL_ROUTES } from './constants';
import { buildCilj } from './cilj';
import { buildEnergijaForce } from './energija-force';
import { buildFokus } from './fokus';
import { buildOperativa } from './operativa';
import { buildReakcija } from './reakcija';
import { buildSnaga } from './snaga';
import { addForceSnapshot, getForceSnapshots } from './force-store';
import type { ForceSnapshot } from './force-store';

export const FORCE_CONTRACT_VERSION = 'v1';
export const FORCE_MODEL_VERSION = '1.0.0';
export const FORCE_SOURCE_OF_TRUTH = '/api/force';
export const FORCE_NAZIV =
  'FORCE — Fokusirana Orkestracija Reakcionih i Ciljnih Energija';

export const FORCE_WEIGHTS = {
  fokus: 0.20,
  operativa: 0.18,
  reakcija: 0.16,
  cilj: 0.18,
  energija: 0.16,
  snaga: 0.12,
} as const;

export const FORCE_SLA_THRESHOLDS = {
  fokus: 78,
  operativa: 75,
  reakcija: 73,
  cilj: 77,
  energija: 74,
  snaga: 72,
} as const;

const FORCE_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;
const FORCE_DEGRADATION_THRESHOLD = 0.7;

function assertForceWeights(): void {
  const weightSum = Object.values(FORCE_WEIGHTS).reduce((sum, w) => sum + w, 0);
  if (Math.abs(weightSum - 1) > 0.0001) {
    throw new Error(`FORCE_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
  }
}

export type ForceOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type ForceTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type ForceMomentum = 'bullish' | 'bearish' | 'neutral';

export interface ForceDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: ForceTrendDirection;
  velocity: number;
  momentum: ForceMomentum;
  slaThreshold: number;
}

export interface ForceHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface ForceMeta {
  contractVersion: typeof FORCE_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof FORCE_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof FORCE_WEIGHTS;
  slaThresholds: typeof FORCE_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface ForceRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: ForceOcena;
  trendMomentum: ForceMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    fokus: ForceDomenSignal;
    operativa: ForceDomenSignal;
    reakcija: ForceDomenSignal;
    cilj: ForceDomenSignal;
    energija: ForceDomenSignal;
    snaga: ForceDomenSignal;
  };
  history: ForceHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: ForceMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): ForceOcena {
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
    ? FORCE_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? FORCE_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? FORCE_CONFIDENCE_VARIANCE.delimicno
        : FORCE_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): ForceTrendDirection {
  const epsilon = 0.001;
  if (velocity === 0) return 'stable';
  if (previousVelocity === null) {
    return velocity > 0 ? 'rising' : 'falling';
  }
  const acceleration = velocity - previousVelocity;
  if (velocity > 0) {
    if (acceleration > epsilon) return 'accelerating';
    if (acceleration < -epsilon) return 'decelerating';
    return 'rising';
  }
  if (acceleration > epsilon) return 'decelerating';
  return 'falling';
}

function momentumFromVelocity(velocity: number): ForceMomentum {
  if (velocity > 2) return 'bullish';
  if (velocity < -2) return 'bearish';
  return 'neutral';
}

function safeCallSync<T>(
  sourceName: string,
  degradedSources: string[],
  fn: () => T,
): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[force] source failure: ${sourceName}`, error);
    return null;
  }
}

export function buildForce(): ForceRezultat {
  assertForceWeights();
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const fokus = safeCallSync('fokus', degradedSources, () => buildFokus('system'));
  const operativa = safeCallSync('operativa', degradedSources, () => buildOperativa('system'));
  const reakcija = safeCallSync('reakcija', degradedSources, () => buildReakcija('system'));
  const cilj = safeCallSync('cilj', degradedSources, () => buildCilj('system'));
  const energija = safeCallSync('energija', degradedSources, () => buildEnergijaForce('system'));
  const snaga = safeCallSync('snaga', degradedSources, () => buildSnaga('system'));

  const allSnapshots: ForceSnapshot[] = getForceSnapshots();
  const historyBefore: ForceHistoryEntry[] = allSnapshots.map((s) => ({
    score: s.ukupanScore,
    velocity: s.ukupnaVelocity,
    timestamp: s.timestamp,
  }));

  const previousSnapshot: ForceSnapshot | null = allSnapshots.length > 0
    ? allSnapshots[allSnapshots.length - 1]
    : null;
  const prePreviousSnapshot: ForceSnapshot | null = allSnapshots.length > 1
    ? allSnapshots[allSnapshots.length - 2]
    : null;

  const fokusScore = clampScore((fokus?.indeksFokusa ?? 0) * 100);
  const operativaScore = clampScore((operativa?.indeksOperative ?? 0) * 100);
  const reakcijaScore = clampScore((reakcija?.indeksReakcije ?? 0) * 100);
  const ciljScore = clampScore((cilj?.indeksCilja ?? 0) * 100);
  const energijaScore = clampScore((energija?.indeksEnergije ?? 0) * 100);
  const snagaScore = clampScore((snaga?.indeksSnage ?? 0) * 100);

  const ukupanScore = clampScore(
    fokusScore * FORCE_WEIGHTS.fokus
    + operativaScore * FORCE_WEIGHTS.operativa
    + reakcijaScore * FORCE_WEIGHTS.reakcija
    + ciljScore * FORCE_WEIGHTS.cilj
    + energijaScore * FORCE_WEIGHTS.energija
    + snagaScore * FORCE_WEIGHTS.snaga,
  );

  const globalPreviousScore = previousSnapshot?.ukupanScore ?? null;
  const globalVelocity = computeVelocity(ukupanScore, globalPreviousScore);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  function domainVelocity(current: number, key: keyof ForceSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof ForceSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const fokusVelocity = domainVelocity(fokusScore, 'fokus');
  const operativaVelocity = domainVelocity(operativaScore, 'operativa');
  const reakcijaVelocity = domainVelocity(reakcijaScore, 'reakcija');
  const ciljVelocity = domainVelocity(ciljScore, 'cilj');
  const energijaVelocity = domainVelocity(energijaScore, 'energija');
  const snagaVelocity = domainVelocity(snagaScore, 'snaga');

  const fokusDegraded = fokus !== null && fokus.stabilnostFokusa < FORCE_DEGRADATION_THRESHOLD;
  const operativaDegraded = operativa !== null && operativa.stabilnostOperative < FORCE_DEGRADATION_THRESHOLD;
  const reakcijaDegraded = reakcija !== null && reakcija.stabilnostReakcije < FORCE_DEGRADATION_THRESHOLD;
  const ciljDegraded = cilj !== null && cilj.stabilnostCilja < FORCE_DEGRADATION_THRESHOLD;
  const energijaDegraded = energija !== null && energija.stabilnostEnergije < FORCE_DEGRADATION_THRESHOLD;
  const snagaDegraded = snaga !== null && snaga.stabilnostSnage < FORCE_DEGRADATION_THRESHOLD;

  const domeni = {
    fokus: {
      naziv: 'Fokus',
      score: fokusScore,
      confidence: computeConfidence(fokusScore, fokus !== null, fokusDegraded),
      tezina: FORCE_WEIGHTS.fokus,
      doprinos: clampScore(fokusScore * FORCE_WEIGHTS.fokus),
      sourceOfTruth: '/api/fokus',
      freshness: freshnessFromSourceState(fokus !== null, fokusDegraded),
      trendDirection: velocityToTrendDirection(fokusVelocity, domainPrevVelocity('fokus')),
      velocity: fokusVelocity,
      momentum: momentumFromVelocity(fokusVelocity),
      slaThreshold: FORCE_SLA_THRESHOLDS.fokus,
    } satisfies ForceDomenSignal,
    operativa: {
      naziv: 'Operativa',
      score: operativaScore,
      confidence: computeConfidence(operativaScore, operativa !== null, operativaDegraded),
      tezina: FORCE_WEIGHTS.operativa,
      doprinos: clampScore(operativaScore * FORCE_WEIGHTS.operativa),
      sourceOfTruth: '/api/operativa',
      freshness: freshnessFromSourceState(operativa !== null, operativaDegraded),
      trendDirection: velocityToTrendDirection(operativaVelocity, domainPrevVelocity('operativa')),
      velocity: operativaVelocity,
      momentum: momentumFromVelocity(operativaVelocity),
      slaThreshold: FORCE_SLA_THRESHOLDS.operativa,
    } satisfies ForceDomenSignal,
    reakcija: {
      naziv: 'Reakcija',
      score: reakcijaScore,
      confidence: computeConfidence(reakcijaScore, reakcija !== null, reakcijaDegraded),
      tezina: FORCE_WEIGHTS.reakcija,
      doprinos: clampScore(reakcijaScore * FORCE_WEIGHTS.reakcija),
      sourceOfTruth: '/api/reakcija',
      freshness: freshnessFromSourceState(reakcija !== null, reakcijaDegraded),
      trendDirection: velocityToTrendDirection(reakcijaVelocity, domainPrevVelocity('reakcija')),
      velocity: reakcijaVelocity,
      momentum: momentumFromVelocity(reakcijaVelocity),
      slaThreshold: FORCE_SLA_THRESHOLDS.reakcija,
    } satisfies ForceDomenSignal,
    cilj: {
      naziv: 'Cilj',
      score: ciljScore,
      confidence: computeConfidence(ciljScore, cilj !== null, ciljDegraded),
      tezina: FORCE_WEIGHTS.cilj,
      doprinos: clampScore(ciljScore * FORCE_WEIGHTS.cilj),
      sourceOfTruth: '/api/cilj',
      freshness: freshnessFromSourceState(cilj !== null, ciljDegraded),
      trendDirection: velocityToTrendDirection(ciljVelocity, domainPrevVelocity('cilj')),
      velocity: ciljVelocity,
      momentum: momentumFromVelocity(ciljVelocity),
      slaThreshold: FORCE_SLA_THRESHOLDS.cilj,
    } satisfies ForceDomenSignal,
    energija: {
      naziv: 'Energija',
      score: energijaScore,
      confidence: computeConfidence(energijaScore, energija !== null, energijaDegraded),
      tezina: FORCE_WEIGHTS.energija,
      doprinos: clampScore(energijaScore * FORCE_WEIGHTS.energija),
      sourceOfTruth: '/api/energija',
      freshness: freshnessFromSourceState(energija !== null, energijaDegraded),
      trendDirection: velocityToTrendDirection(energijaVelocity, domainPrevVelocity('energija')),
      velocity: energijaVelocity,
      momentum: momentumFromVelocity(energijaVelocity),
      slaThreshold: FORCE_SLA_THRESHOLDS.energija,
    } satisfies ForceDomenSignal,
    snaga: {
      naziv: 'Snaga',
      score: snagaScore,
      confidence: computeConfidence(snagaScore, snaga !== null, snagaDegraded),
      tezina: FORCE_WEIGHTS.snaga,
      doprinos: clampScore(snagaScore * FORCE_WEIGHTS.snaga),
      sourceOfTruth: '/api/snaga',
      freshness: freshnessFromSourceState(snaga !== null, snagaDegraded),
      trendDirection: velocityToTrendDirection(snagaVelocity, domainPrevVelocity('snaga')),
      velocity: snagaVelocity,
      momentum: momentumFromVelocity(snagaVelocity),
      slaThreshold: FORCE_SLA_THRESHOLDS.snaga,
    } satisfies ForceDomenSignal,
  };

  const kriticniDomeni = (Object.values(domeni) as ForceDomenSignal[])
    .filter((d) => d.score < d.slaThreshold)
    .map((d) => d.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno stabilizovati FORCE domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as ForceDomenSignal[])
    .filter((d) => d.momentum === 'bearish')
    .map((d) => d.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish energetski signal detektovan u: ${bearishDomeni.join(', ')} — pratiti pad snage.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore za FORCE: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi FORCE domeni su iznad SLA praga uz stabilan ili bullish energetski ritam.');
  }

  addForceSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      fokus: fokusScore,
      operativa: operativaScore,
      reakcija: reakcijaScore,
      cilj: ciljScore,
      energija: energijaScore,
      snaga: snagaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: FORCE_NAZIV,
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    autofinishBroj: AUTOFINISH_COUNT,
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    konacnaOcena: scoreToOcena(ukupanScore),
    trendMomentum,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    trendSnapshotCount: historyBefore.length + 1,
    domeni,
    history: historyBefore,
    ekosistem: {
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
    },
    meta: {
      contractVersion: FORCE_CONTRACT_VERSION,
      modelVersion: FORCE_MODEL_VERSION,
      sourceOfTruth: FORCE_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: FORCE_WEIGHTS,
      slaThresholds: FORCE_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
