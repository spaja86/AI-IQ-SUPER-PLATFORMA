// SpajaUltraOmegaCore -∞Ω+∞ — INDUKCIJA
// Kompanija SPAJA — Digitalna Industrija
//
// Inteligentni Napredni Detektor Unificiranih Koherentnih Ciklusa i Jezgra Automatizacije:
//   - Indukcija
//   - Koherencija
//   - Amplifikacija
//   - Rezonancija
//   - Polarizacija
//   - Konvergencija

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
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
import { addIndukcijaSnapshot, getIndukcijaSnapshots } from './indukcija-store';
import type { IndukcijaSnapshot } from './indukcija-store';

export const INDUKCIJA_CONTRACT_VERSION = 'v1';
export const INDUKCIJA_MODEL_VERSION = '1.0.0';
export const INDUKCIJA_SOURCE_OF_TRUTH = '/api/indukcija';

export const INDUKCIJA_WEIGHTS = {
  indukcija: 0.18,
  koherencija: 0.17,
  amplifikacija: 0.16,
  rezonancija: 0.17,
  polarizacija: 0.16,
  konvergencija: 0.16,
} as const;

export const INDUKCIJA_SLA_THRESHOLDS = {
  indukcija: 77,
  koherencija: 75,
  amplifikacija: 74,
  rezonancija: 76,
  polarizacija: 73,
  konvergencija: 75,
} as const;

const INDUKCIJA_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;
const VELOCITY_ACCELERATION_EPSILON = 0.001;
const MOMENTUM_DIRECTION_THRESHOLD = 2;

export function assertIndukcijaWeights(weights: Record<string, number> = INDUKCIJA_WEIGHTS): void {
  const weightSum = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(weightSum - 1) > 0.0001) {
    throw new Error(`INDUKCIJA_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
  }
}

export type IndukcijaOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type IndukcijaTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type IndukcijaMomentum = 'bullish' | 'bearish' | 'neutral';

export interface IndukcijaDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: IndukcijaTrendDirection;
  velocity: number;
  momentum: IndukcijaMomentum;
  slaThreshold: number;
}

export interface IndukcijaHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface IndukcijaMeta {
  contractVersion: typeof INDUKCIJA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof INDUKCIJA_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof INDUKCIJA_WEIGHTS;
  slaThresholds: typeof INDUKCIJA_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface IndukcijaRezultat {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: IndukcijaOcena;
  trendMomentum: IndukcijaMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    indukcija: IndukcijaDomenSignal;
    koherencija: IndukcijaDomenSignal;
    amplifikacija: IndukcijaDomenSignal;
    rezonancija: IndukcijaDomenSignal;
    polarizacija: IndukcijaDomenSignal;
    konvergencija: IndukcijaDomenSignal;
  };
  history: IndukcijaHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: IndukcijaMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): IndukcijaOcena {
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
    ? INDUKCIJA_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? INDUKCIJA_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? INDUKCIJA_CONFIDENCE_VARIANCE.delimicno
        : INDUKCIJA_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

export function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): IndukcijaTrendDirection {
  if (Math.abs(velocity) < VELOCITY_ACCELERATION_EPSILON) return 'stable';
  if (previousVelocity === null) {
    return velocity > 0 ? 'rising' : 'falling';
  }
  const acceleration = velocity - previousVelocity;
  if (velocity > 0) {
    if (acceleration > VELOCITY_ACCELERATION_EPSILON) return 'accelerating';
    if (acceleration < -VELOCITY_ACCELERATION_EPSILON) return 'decelerating';
    return 'rising';
  }
  if (acceleration > VELOCITY_ACCELERATION_EPSILON) return 'decelerating';
  return 'falling';
}

export function momentumFromVelocity(velocity: number): IndukcijaMomentum {
  if (velocity > MOMENTUM_DIRECTION_THRESHOLD) return 'bullish';
  if (velocity < -MOMENTUM_DIRECTION_THRESHOLD) return 'bearish';
  return 'neutral';
}

export function safeCallSync<T>(
  sourceName: string,
  degradedSources: string[],
  fn: () => T,
): T | null {
  try {
    return fn();
  } catch (error) {
    degradedSources.push(sourceName);
    console.error(`[indukcija] source failure: ${sourceName}`, error);
    return null;
  }
}

function computeIndukcijaScore(): number {
  return clampScore(
    60
      + Math.min(18, TOTAL_ROUTES / 90)
      + Math.min(14, TOTAL_API_ROUTES / 120)
      + Math.min(8, TOTAL_PROTOKOLA / 2),
  );
}

function computeKoherencijaScore(): number {
  const routeKoherencija = TOTAL_ROUTES === TOTAL_PAGES + TOTAL_API_ROUTES ? 22 : 10;
  return clampScore(58 + routeKoherencija + Math.min(15, TOTAL_DIAGNOSTIKA / 220));
}

function computeAmplifikacijaScore(): number {
  return clampScore(
    55
      + Math.min(20, TOTAL_IGRICA / 6)
      + Math.min(20, TOTAL_GEJMING_ENTITETA / 4)
      + Math.min(8, OMEGA_AI_OKTAVA_COUNT / 2),
  );
}

function computeRezonancijaScore(): number {
  return clampScore(57 + Math.min(20, TOTAL_PROTOKOLA) + Math.min(20, OMEGA_AI_PERSONA_COUNT / 2));
}

function computePolarizacijaScore(): number {
  return clampScore(
    56
      + Math.min(24, AUTOFINISH_COUNT / 70)
      + Math.min(16, TOTAL_API_ROUTES / 150),
  );
}

function computeKonvergencijaScore(): number {
  return clampScore(
    54
      + Math.min(20, TOTAL_PAGES / 7)
      + Math.min(20, TOTAL_DIAGNOSTIKA / 160)
      + Math.min(6, OMEGA_AI_OKTAVA_COUNT),
  );
}

export function buildIndukcija(): IndukcijaRezultat {
  assertIndukcijaWeights();
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const indukcijaScore = safeCallSync('indukcija', degradedSources, computeIndukcijaScore) ?? 0;
  const koherencijaScore = safeCallSync('koherencija', degradedSources, computeKoherencijaScore) ?? 0;
  const amplifikacijaScore = safeCallSync('amplifikacija', degradedSources, computeAmplifikacijaScore) ?? 0;
  const rezonancijaScore = safeCallSync('rezonancija', degradedSources, computeRezonancijaScore) ?? 0;
  const polarizacijaScore = safeCallSync('polarizacija', degradedSources, computePolarizacijaScore) ?? 0;
  const konvergencijaScore = safeCallSync('konvergencija', degradedSources, computeKonvergencijaScore) ?? 0;

  const allSnapshots: IndukcijaSnapshot[] = getIndukcijaSnapshots();
  const historyBefore: IndukcijaHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    indukcijaScore * INDUKCIJA_WEIGHTS.indukcija
    + koherencijaScore * INDUKCIJA_WEIGHTS.koherencija
    + amplifikacijaScore * INDUKCIJA_WEIGHTS.amplifikacija
    + rezonancijaScore * INDUKCIJA_WEIGHTS.rezonancija
    + polarizacijaScore * INDUKCIJA_WEIGHTS.polarizacija
    + konvergencijaScore * INDUKCIJA_WEIGHTS.konvergencija,
  );

  const globalVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  function domainVelocity(current: number, key: keyof IndukcijaSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof IndukcijaSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const indukcijaVelocity = domainVelocity(indukcijaScore, 'indukcija');
  const koherencijaVelocity = domainVelocity(koherencijaScore, 'koherencija');
  const amplifikacijaVelocity = domainVelocity(amplifikacijaScore, 'amplifikacija');
  const rezonancijaVelocity = domainVelocity(rezonancijaScore, 'rezonancija');
  const polarizacijaVelocity = domainVelocity(polarizacijaScore, 'polarizacija');
  const konvergencijaVelocity = domainVelocity(konvergencijaScore, 'konvergencija');

  const domeni = {
    indukcija: {
      naziv: 'Indukcija',
      score: indukcijaScore,
      confidence: computeConfidence(indukcijaScore, true, false),
      tezina: INDUKCIJA_WEIGHTS.indukcija,
      doprinos: clampScore(indukcijaScore * INDUKCIJA_WEIGHTS.indukcija),
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(indukcijaVelocity, domainPrevVelocity('indukcija')),
      velocity: indukcijaVelocity,
      momentum: momentumFromVelocity(indukcijaVelocity),
      slaThreshold: INDUKCIJA_SLA_THRESHOLDS.indukcija,
    } satisfies IndukcijaDomenSignal,
    koherencija: {
      naziv: 'Koherencija',
      score: koherencijaScore,
      confidence: computeConfidence(koherencijaScore, true, false),
      tezina: INDUKCIJA_WEIGHTS.koherencija,
      doprinos: clampScore(koherencijaScore * INDUKCIJA_WEIGHTS.koherencija),
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(koherencijaVelocity, domainPrevVelocity('koherencija')),
      velocity: koherencijaVelocity,
      momentum: momentumFromVelocity(koherencijaVelocity),
      slaThreshold: INDUKCIJA_SLA_THRESHOLDS.koherencija,
    } satisfies IndukcijaDomenSignal,
    amplifikacija: {
      naziv: 'Amplifikacija',
      score: amplifikacijaScore,
      confidence: computeConfidence(amplifikacijaScore, true, false),
      tezina: INDUKCIJA_WEIGHTS.amplifikacija,
      doprinos: clampScore(amplifikacijaScore * INDUKCIJA_WEIGHTS.amplifikacija),
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(amplifikacijaVelocity, domainPrevVelocity('amplifikacija')),
      velocity: amplifikacijaVelocity,
      momentum: momentumFromVelocity(amplifikacijaVelocity),
      slaThreshold: INDUKCIJA_SLA_THRESHOLDS.amplifikacija,
    } satisfies IndukcijaDomenSignal,
    rezonancija: {
      naziv: 'Rezonancija',
      score: rezonancijaScore,
      confidence: computeConfidence(rezonancijaScore, true, false),
      tezina: INDUKCIJA_WEIGHTS.rezonancija,
      doprinos: clampScore(rezonancijaScore * INDUKCIJA_WEIGHTS.rezonancija),
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(rezonancijaVelocity, domainPrevVelocity('rezonancija')),
      velocity: rezonancijaVelocity,
      momentum: momentumFromVelocity(rezonancijaVelocity),
      slaThreshold: INDUKCIJA_SLA_THRESHOLDS.rezonancija,
    } satisfies IndukcijaDomenSignal,
    polarizacija: {
      naziv: 'Polarizacija',
      score: polarizacijaScore,
      confidence: computeConfidence(polarizacijaScore, true, false),
      tezina: INDUKCIJA_WEIGHTS.polarizacija,
      doprinos: clampScore(polarizacijaScore * INDUKCIJA_WEIGHTS.polarizacija),
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(polarizacijaVelocity, domainPrevVelocity('polarizacija')),
      velocity: polarizacijaVelocity,
      momentum: momentumFromVelocity(polarizacijaVelocity),
      slaThreshold: INDUKCIJA_SLA_THRESHOLDS.polarizacija,
    } satisfies IndukcijaDomenSignal,
    konvergencija: {
      naziv: 'Konvergencija',
      score: konvergencijaScore,
      confidence: computeConfidence(konvergencijaScore, true, false),
      tezina: INDUKCIJA_WEIGHTS.konvergencija,
      doprinos: clampScore(konvergencijaScore * INDUKCIJA_WEIGHTS.konvergencija),
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(konvergencijaVelocity, domainPrevVelocity('konvergencija')),
      velocity: konvergencijaVelocity,
      momentum: momentumFromVelocity(konvergencijaVelocity),
      slaThreshold: INDUKCIJA_SLA_THRESHOLDS.konvergencija,
    } satisfies IndukcijaDomenSignal,
  };

  const kriticniDomeni = (Object.values(domeni) as IndukcijaDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno stabilizovati INDUKCIJA domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as IndukcijaDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish indukcioni ritam detektovan u: ${bearishDomeni.join(', ')} — pratiti usporavanje.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore za INDUKCIJA: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi INDUKCIJA domeni su iznad SLA praga uz stabilan ili bullish operativni ritam.');
  }

  addIndukcijaSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      indukcija: indukcijaScore,
      koherencija: koherencijaScore,
      amplifikacija: amplifikacijaScore,
      rezonancija: rezonancijaScore,
      polarizacija: polarizacijaScore,
      konvergencija: konvergencijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'INDUKCIJA — Inteligentni Napredni Detektor Unificiranih Koherentnih Ciklusa i Jezgra Automatizacije',
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
      contractVersion: INDUKCIJA_CONTRACT_VERSION,
      modelVersion: INDUKCIJA_MODEL_VERSION,
      sourceOfTruth: INDUKCIJA_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: INDUKCIJA_WEIGHTS,
      slaThresholds: INDUKCIJA_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
