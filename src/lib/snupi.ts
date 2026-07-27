// SpajaUltraOmegaCore -∞Ω+∞ — SNUPI
// Kompanija SPAJA — Digitalna Industrija
//
// Sistemska Napredna Unifikacija Procesnih Inteligentnih tokova —
// cross-domain unifikacioni engine za 6 operativnih tokova:
//   - Sinhronizacija
//   - Normalizacija
//   - Unifikacija
//   - Procesuiranje
//   - Integracija
//   - Inovacija

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  EXPECTED_AUTOFINISH_STEPOVI_COUNT,
  KOMPANIJA,
  OMEGA_AI_OKTAVA_COUNT,
  OMEGA_AI_PERSONA_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_GEJMING_ENTITETA,
  TOTAL_IGRICA,
  TOTAL_PAGES,
  TOTAL_PROTOKOLA,
  TOTAL_ROUTES,
} from './constants';
import { addSnupiSnapshot, getSnupiSnapshots } from './snupi-store';
import type { SnupiSnapshot } from './snupi-store';

export const SNUPI_CONTRACT_VERSION = 'v1';
export const SNUPI_MODEL_VERSION = '1.0.0';
export const SNUPI_SOURCE_OF_TRUTH = '/api/snupi';

export const SNUPI_WEIGHTS = {
  sinhronizacija: 0.20,
  normalizacija: 0.15,
  unifikacija: 0.20,
  procesuiranje: 0.20,
  integracija: 0.15,
  inovacija: 0.10,
} as const;

export const SNUPI_SLA_THRESHOLDS = {
  sinhronizacija: 78,
  normalizacija: 74,
  unifikacija: 80,
  procesuiranje: 79,
  integracija: 76,
  inovacija: 72,
} as const;

const SNUPI_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;
const UNIFIKACIJA_API_ROUTE_DIVISOR = 60;
const PROCESUIRANJE_AUTOFINISH_DIVISOR = 60;

function assertSnupiWeights(): void {
  const weightSum = Object.values(SNUPI_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(weightSum - 1) > 0.0001) {
    throw new Error(`SNUPI_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
  }
}

export type SnupiOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type SnupiTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type SnupiMomentum = 'bullish' | 'bearish' | 'neutral';

export interface SnupiDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: SnupiTrendDirection;
  velocity: number;
  momentum: SnupiMomentum;
  slaThreshold: number;
}

export interface SnupiHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface SnupiMeta {
  contractVersion: typeof SNUPI_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof SNUPI_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof SNUPI_WEIGHTS;
  slaThresholds: typeof SNUPI_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface SnupiRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: SnupiOcena;
  trendMomentum: SnupiMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    sinhronizacija: SnupiDomenSignal;
    normalizacija: SnupiDomenSignal;
    unifikacija: SnupiDomenSignal;
    procesuiranje: SnupiDomenSignal;
    integracija: SnupiDomenSignal;
    inovacija: SnupiDomenSignal;
  };
  history: SnupiHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: SnupiMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): SnupiOcena {
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
    ? SNUPI_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? SNUPI_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? SNUPI_CONFIDENCE_VARIANCE.delimicno
        : SNUPI_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): SnupiTrendDirection {
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

function momentumFromVelocity(velocity: number): SnupiMomentum {
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
    console.error(`[snupi] source failure: ${sourceName}`, error);
    return null;
  }
}

function computeSinhronizacijaScore(): number {
  const routeCoherence = TOTAL_ROUTES === TOTAL_PAGES + TOTAL_API_ROUTES ? 18 : 4;
  return clampScore(68 + routeCoherence + Math.min(12, TOTAL_PROTOKOLA / 2));
}

function computeNormalizacijaScore(): number {
  return clampScore(
    60
    + Math.min(20, EXPECTED_AUTOFINISH_STEPOVI_COUNT * 2)
    + Math.min(20, TOTAL_PAGES / 8),
  );
}

function computeUnifikacijaScore(): number {
  return clampScore(
    58
    + Math.min(22, TOTAL_API_ROUTES / UNIFIKACIJA_API_ROUTE_DIVISOR)
    + Math.min(20, TOTAL_GEJMING_ENTITETA / 4),
  );
}

function computeProcesuiranjeScore(): number {
  return clampScore(
    55
    + Math.min(25, AUTOFINISH_COUNT / PROCESUIRANJE_AUTOFINISH_DIVISOR)
    + Math.min(20, TOTAL_DIAGNOSTIKA / 180),
  );
}

function computeIntegracijaScore(): number {
  return clampScore(
    57
    + Math.min(23, TOTAL_ROUTES / 80)
    + Math.min(20, TOTAL_PROTOKOLA),
  );
}

function computeInovacijaScore(): number {
  return clampScore(
    52
    + Math.min(24, OMEGA_AI_PERSONA_COUNT)
    + Math.min(16, OMEGA_AI_OKTAVA_COUNT)
    + Math.min(8, TOTAL_IGRICA / 20),
  );
}

export function buildSnupi(): SnupiRezultat {
  assertSnupiWeights();
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const sinhronizacijaScore = safeCallSync('sinhronizacija', degradedSources, computeSinhronizacijaScore) ?? 0;
  const normalizacijaScore = safeCallSync('normalizacija', degradedSources, computeNormalizacijaScore) ?? 0;
  const unifikacijaScore = safeCallSync('unifikacija', degradedSources, computeUnifikacijaScore) ?? 0;
  const procesuiranjeScore = safeCallSync('procesuiranje', degradedSources, computeProcesuiranjeScore) ?? 0;
  const integracijaScore = safeCallSync('integracija', degradedSources, computeIntegracijaScore) ?? 0;
  const inovacijaScore = safeCallSync('inovacija', degradedSources, computeInovacijaScore) ?? 0;

  const allSnapshots: SnupiSnapshot[] = getSnupiSnapshots();
  const historyBefore: SnupiHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    sinhronizacijaScore * SNUPI_WEIGHTS.sinhronizacija
    + normalizacijaScore * SNUPI_WEIGHTS.normalizacija
    + unifikacijaScore * SNUPI_WEIGHTS.unifikacija
    + procesuiranjeScore * SNUPI_WEIGHTS.procesuiranje
    + integracijaScore * SNUPI_WEIGHTS.integracija
    + inovacijaScore * SNUPI_WEIGHTS.inovacija,
  );

  const globalVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  function domainVelocity(current: number, key: keyof SnupiSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof SnupiSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const sinhronizacijaVelocity = domainVelocity(sinhronizacijaScore, 'sinhronizacija');
  const normalizacijaVelocity = domainVelocity(normalizacijaScore, 'normalizacija');
  const unifikacijaVelocity = domainVelocity(unifikacijaScore, 'unifikacija');
  const procesuiranjeVelocity = domainVelocity(procesuiranjeScore, 'procesuiranje');
  const integracijaVelocity = domainVelocity(integracijaScore, 'integracija');
  const inovacijaVelocity = domainVelocity(inovacijaScore, 'inovacija');

  const domeni = {
    sinhronizacija: {
      naziv: 'Sinhronizacija',
      score: sinhronizacijaScore,
      confidence: computeConfidence(sinhronizacijaScore, true, false),
      tezina: SNUPI_WEIGHTS.sinhronizacija,
      doprinos: clampScore(sinhronizacijaScore * SNUPI_WEIGHTS.sinhronizacija),
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(sinhronizacijaVelocity, domainPrevVelocity('sinhronizacija')),
      velocity: sinhronizacijaVelocity,
      momentum: momentumFromVelocity(sinhronizacijaVelocity),
      slaThreshold: SNUPI_SLA_THRESHOLDS.sinhronizacija,
    } satisfies SnupiDomenSignal,
    normalizacija: {
      naziv: 'Normalizacija',
      score: normalizacijaScore,
      confidence: computeConfidence(normalizacijaScore, true, false),
      tezina: SNUPI_WEIGHTS.normalizacija,
      doprinos: clampScore(normalizacijaScore * SNUPI_WEIGHTS.normalizacija),
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(normalizacijaVelocity, domainPrevVelocity('normalizacija')),
      velocity: normalizacijaVelocity,
      momentum: momentumFromVelocity(normalizacijaVelocity),
      slaThreshold: SNUPI_SLA_THRESHOLDS.normalizacija,
    } satisfies SnupiDomenSignal,
    unifikacija: {
      naziv: 'Unifikacija',
      score: unifikacijaScore,
      confidence: computeConfidence(unifikacijaScore, true, false),
      tezina: SNUPI_WEIGHTS.unifikacija,
      doprinos: clampScore(unifikacijaScore * SNUPI_WEIGHTS.unifikacija),
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(unifikacijaVelocity, domainPrevVelocity('unifikacija')),
      velocity: unifikacijaVelocity,
      momentum: momentumFromVelocity(unifikacijaVelocity),
      slaThreshold: SNUPI_SLA_THRESHOLDS.unifikacija,
    } satisfies SnupiDomenSignal,
    procesuiranje: {
      naziv: 'Procesuiranje',
      score: procesuiranjeScore,
      confidence: computeConfidence(procesuiranjeScore, true, false),
      tezina: SNUPI_WEIGHTS.procesuiranje,
      doprinos: clampScore(procesuiranjeScore * SNUPI_WEIGHTS.procesuiranje),
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(procesuiranjeVelocity, domainPrevVelocity('procesuiranje')),
      velocity: procesuiranjeVelocity,
      momentum: momentumFromVelocity(procesuiranjeVelocity),
      slaThreshold: SNUPI_SLA_THRESHOLDS.procesuiranje,
    } satisfies SnupiDomenSignal,
    integracija: {
      naziv: 'Integracija',
      score: integracijaScore,
      confidence: computeConfidence(integracijaScore, true, false),
      tezina: SNUPI_WEIGHTS.integracija,
      doprinos: clampScore(integracijaScore * SNUPI_WEIGHTS.integracija),
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(integracijaVelocity, domainPrevVelocity('integracija')),
      velocity: integracijaVelocity,
      momentum: momentumFromVelocity(integracijaVelocity),
      slaThreshold: SNUPI_SLA_THRESHOLDS.integracija,
    } satisfies SnupiDomenSignal,
    inovacija: {
      naziv: 'Inovacija',
      score: inovacijaScore,
      confidence: computeConfidence(inovacijaScore, true, false),
      tezina: SNUPI_WEIGHTS.inovacija,
      doprinos: clampScore(inovacijaScore * SNUPI_WEIGHTS.inovacija),
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(inovacijaVelocity, domainPrevVelocity('inovacija')),
      velocity: inovacijaVelocity,
      momentum: momentumFromVelocity(inovacijaVelocity),
      slaThreshold: SNUPI_SLA_THRESHOLDS.inovacija,
    } satisfies SnupiDomenSignal,
  };

  const kriticniDomeni = (Object.values(domeni) as SnupiDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno stabilizovati SNUPI domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as SnupiDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish unifikaciona refleksija detektovana u: ${bearishDomeni.join(', ')} — pratiti pad ritma.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore za SNUPI: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi SNUPI domeni su iznad SLA praga uz stabilan ili bullish unifikacioni ritam.');
  }

  addSnupiSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      sinhronizacija: sinhronizacijaScore,
      normalizacija: normalizacijaScore,
      unifikacija: unifikacijaScore,
      procesuiranje: procesuiranjeScore,
      integracija: integracijaScore,
      inovacija: inovacijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'SNUPI — Sistemska Napredna Unifikacija Procesnih Inteligentnih tokova',
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
      contractVersion: SNUPI_CONTRACT_VERSION,
      modelVersion: SNUPI_MODEL_VERSION,
      sourceOfTruth: SNUPI_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: SNUPI_WEIGHTS,
      slaThresholds: SNUPI_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
