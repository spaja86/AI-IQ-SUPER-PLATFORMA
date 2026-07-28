// SpajaUltraOmegaCore -∞Ω+∞ — AUTO
// Kompanija SPAJA — Digitalna Industrija
//
// Autonomna Upravljačka Transformativna Orkestracija —
// cross-domain engine za 6 operativnih domena autonomnih procesa:
//   - Autonomija
//   - Upravljanje
//   - Transformacija
//   - Orkestracija
//   - Optimizacija
//   - Automatizacija

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  OMEGA_AI_OKTAVA_COUNT,
  OMEGA_AI_PERSONA_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  TOTAL_PAGES,
  TOTAL_PROTOKOLA,
  TOTAL_ROUTES,
} from './constants';
import { addAutoSnapshot, getAutoSnapshots } from './auto-store';
import type { AutoSnapshot } from './auto-store';

export const AUTO_CONTRACT_VERSION = 'v1';
export const AUTO_MODEL_VERSION = '1.0.0';
export const AUTO_SOURCE_OF_TRUTH = '/api/auto';

export const AUTO_WEIGHTS = {
  autonomija: 0.20,
  upravljanje: 0.20,
  transformacija: 0.15,
  orkestracija: 0.20,
  optimizacija: 0.15,
  automatizacija: 0.10,
} as const;

export const AUTO_SLA_THRESHOLDS = {
  autonomija: 80,
  upravljanje: 78,
  transformacija: 74,
  orkestracija: 79,
  optimizacija: 76,
  automatizacija: 72,
} as const;

const AUTO_CONFIDENCE_VARIANCE = {
  odlicno: 8,
  spremno: 5,
  delimicno: 2,
  potrebnoPoboljsanje: 0,
} as const;
const VELOCITY_ACCELERATION_EPSILON = 0.001;
// Velocity deltas inside ±2 predstavljaju mikro-pomeranja jednog snapshot koraka i ostaju neutralna.
const MOMENTUM_DIRECTION_THRESHOLD = 2;
// 60 drži trenutni TOTAL_PAGES blizu gornje granice 24 bez trenutne saturacije skora.
const AUTONOMIJA_PAGES_NORMALIZATION_DIVISOR = 60;
// 60 drži trenutni AUTOFINISH_COUNT blizu gornje granice 24 i ostavlja prostor za budući rast.
const AUTOMATIZACIJA_AUTOFINISH_NORMALIZATION_DIVISOR = 60;
// 60 drži trenutni TOTAL_API_ROUTES blizu gornje granice 21 bez saturacije.
const ORKESTRACIJA_API_ROUTE_NORMALIZATION_DIVISOR = 60;

// Baseline i cap konstante za svaki domen — izdvojene radi transparentnosti formula.
const AUTONOMIJA_BASELINE = 62;
const AUTONOMIJA_PAGES_FACTOR = 10;
const AUTONOMIJA_PAGES_CAP = 24;
const AUTONOMIJA_DIAGNOSTIKA_NORMALIZATION_DIVISOR = 240;
const AUTONOMIJA_DIAGNOSTIKA_CAP = 14;

const UPRAVLJANJE_BASELINE = 60;
const UPRAVLJANJE_PROTOKOLA_FACTOR = 1.2;
const UPRAVLJANJE_PROTOKOLA_CAP = 22;
const UPRAVLJANJE_PERSONA_DIVISOR = 2;
const UPRAVLJANJE_PERSONA_CAP = 18;

const TRANSFORMACIJA_BASELINE = 58;
const TRANSFORMACIJA_PERSONA_CAP = 22;
const TRANSFORMACIJA_OKTAVA_CAP = 14;

const ORKESTRACIJA_BASELINE = 55;
const ORKESTRACIJA_API_FACTOR = 1.5;
const ORKESTRACIJA_API_CAP = 21;
const ORKESTRACIJA_ROUTES_DIVISOR = 80;
const ORKESTRACIJA_ROUTES_CAP = 24;

const OPTIMIZACIJA_BASELINE = 57;
const OPTIMIZACIJA_IGRICA_DIVISOR = 5;
const OPTIMIZACIJA_IGRICA_CAP = 25;
const OPTIMIZACIJA_DIAGNOSTIKA_DIVISOR = 200;
const OPTIMIZACIJA_DIAGNOSTIKA_CAP = 18;

const AUTOMATIZACIJA_BASELINE = 52;
const AUTOMATIZACIJA_AUTOFINISH_CAP = 24;
const AUTOMATIZACIJA_API_CAP = 24;
// Namerno isti divisor kao ORKESTRACIJA ali kao zaseban konstant za Automatizacija domen.
const AUTOMATIZACIJA_API_NORMALIZATION_DIVISOR = 60;

function assertAutoWeights(): void {
  const weightSum = Object.values(AUTO_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(weightSum - 1) > 0.0001) {
    throw new Error(`AUTO_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
  }
}

export type AutoOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type AutoTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type AutoMomentum = 'bullish' | 'bearish' | 'neutral';

export interface AutoDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  freshness: 'fresh' | 'stale' | 'unknown';
  trendDirection: AutoTrendDirection;
  velocity: number;
  momentum: AutoMomentum;
  slaThreshold: number;
}

export interface AutoHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface AutoMeta {
  contractVersion: typeof AUTO_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof AUTO_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof AUTO_WEIGHTS;
  slaThresholds: typeof AUTO_SLA_THRESHOLDS;
  degraded: boolean;
  degradedSources: string[];
}

export interface AutoOutput {
  sistem: string;
  kompanija: string;
  verzija: string;
  autofinishBroj: number;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: AutoOcena;
  trendMomentum: AutoMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    autonomija: AutoDomenSignal;
    upravljanje: AutoDomenSignal;
    transformacija: AutoDomenSignal;
    orkestracija: AutoDomenSignal;
    optimizacija: AutoDomenSignal;
    automatizacija: AutoDomenSignal;
  };
  history: AutoHistoryEntry[];
  ekosistem: {
    apiRute: number;
    ukupnoRuta: number;
  };
  meta: AutoMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): AutoOcena {
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
    ? AUTO_CONFIDENCE_VARIANCE.odlicno
    : score >= 75
      ? AUTO_CONFIDENCE_VARIANCE.spremno
      : score >= 50
        ? AUTO_CONFIDENCE_VARIANCE.delimicno
        : AUTO_CONFIDENCE_VARIANCE.potrebnoPoboljsanje;
  return clampScore(base + variance);
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): AutoTrendDirection {
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

function momentumFromVelocity(velocity: number): AutoMomentum {
  if (velocity > MOMENTUM_DIRECTION_THRESHOLD) return 'bullish';
  if (velocity < -MOMENTUM_DIRECTION_THRESHOLD) return 'bearish';
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
    console.error(`[auto] source failure: ${sourceName}`, error);
    return null;
  }
}

function computeAutonomijaScore(): number {
  return clampScore(
    AUTONOMIJA_BASELINE
    + Math.min(AUTONOMIJA_PAGES_CAP, (TOTAL_PAGES / AUTONOMIJA_PAGES_NORMALIZATION_DIVISOR) * AUTONOMIJA_PAGES_FACTOR)
    + Math.min(AUTONOMIJA_DIAGNOSTIKA_CAP, TOTAL_DIAGNOSTIKA / AUTONOMIJA_DIAGNOSTIKA_NORMALIZATION_DIVISOR),
  );
}

function computeUpravljanjeScore(): number {
  return clampScore(
    UPRAVLJANJE_BASELINE
    + Math.min(UPRAVLJANJE_PROTOKOLA_CAP, TOTAL_PROTOKOLA * UPRAVLJANJE_PROTOKOLA_FACTOR)
    + Math.min(UPRAVLJANJE_PERSONA_CAP, OMEGA_AI_PERSONA_COUNT / UPRAVLJANJE_PERSONA_DIVISOR),
  );
}

function computeTransformacijaScore(): number {
  return clampScore(
    TRANSFORMACIJA_BASELINE
    + Math.min(TRANSFORMACIJA_PERSONA_CAP, OMEGA_AI_PERSONA_COUNT)
    + Math.min(TRANSFORMACIJA_OKTAVA_CAP, OMEGA_AI_OKTAVA_COUNT),
  );
}

function computeOrkestracijaScore(): number {
  return clampScore(
    ORKESTRACIJA_BASELINE
    + Math.min(ORKESTRACIJA_API_CAP, (TOTAL_API_ROUTES / ORKESTRACIJA_API_ROUTE_NORMALIZATION_DIVISOR) * ORKESTRACIJA_API_FACTOR)
    + Math.min(ORKESTRACIJA_ROUTES_CAP, TOTAL_ROUTES / ORKESTRACIJA_ROUTES_DIVISOR),
  );
}

function computeOptimizacijaScore(): number {
  return clampScore(
    OPTIMIZACIJA_BASELINE
    + Math.min(OPTIMIZACIJA_IGRICA_CAP, TOTAL_IGRICA / OPTIMIZACIJA_IGRICA_DIVISOR)
    + Math.min(OPTIMIZACIJA_DIAGNOSTIKA_CAP, TOTAL_DIAGNOSTIKA / OPTIMIZACIJA_DIAGNOSTIKA_DIVISOR),
  );
}

function computeAutomatizacijaScore(): number {
  return clampScore(
    AUTOMATIZACIJA_BASELINE
    + Math.min(AUTOMATIZACIJA_AUTOFINISH_CAP, AUTOFINISH_COUNT / AUTOMATIZACIJA_AUTOFINISH_NORMALIZATION_DIVISOR)
    + Math.min(AUTOMATIZACIJA_API_CAP, TOTAL_API_ROUTES / AUTOMATIZACIJA_API_NORMALIZATION_DIVISOR),
  );
}

export function buildAuto(): AutoOutput {
  assertAutoWeights();
  const nowIso = new Date().toISOString();
  const degradedSources: string[] = [];

  const autonomijaScore = safeCallSync('autonomija', degradedSources, computeAutonomijaScore) ?? 0;
  const upravljanjeScore = safeCallSync('upravljanje', degradedSources, computeUpravljanjeScore) ?? 0;
  const transformacijaScore = safeCallSync('transformacija', degradedSources, computeTransformacijaScore) ?? 0;
  const orkestracijaScore = safeCallSync('orkestracija', degradedSources, computeOrkestracijaScore) ?? 0;
  const optimizacijaScore = safeCallSync('optimizacija', degradedSources, computeOptimizacijaScore) ?? 0;
  const automatizacijaScore = safeCallSync('automatizacija', degradedSources, computeAutomatizacijaScore) ?? 0;

  const allSnapshots: AutoSnapshot[] = getAutoSnapshots();
  const historyBefore: AutoHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    autonomijaScore * AUTO_WEIGHTS.autonomija
    + upravljanjeScore * AUTO_WEIGHTS.upravljanje
    + transformacijaScore * AUTO_WEIGHTS.transformacija
    + orkestracijaScore * AUTO_WEIGHTS.orkestracija
    + optimizacijaScore * AUTO_WEIGHTS.optimizacija
    + automatizacijaScore * AUTO_WEIGHTS.automatizacija,
  );

  const globalVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(globalVelocity);

  function domainVelocity(current: number, key: keyof AutoSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function domainPrevVelocity(key: keyof AutoSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  const autonomijaVelocity = domainVelocity(autonomijaScore, 'autonomija');
  const upravljanjeVelocity = domainVelocity(upravljanjeScore, 'upravljanje');
  const transformacijaVelocity = domainVelocity(transformacijaScore, 'transformacija');
  const orkestracijaVelocity = domainVelocity(orkestracijaScore, 'orkestracija');
  const optimizacijaVelocity = domainVelocity(optimizacijaScore, 'optimizacija');
  const automatizacijaVelocity = domainVelocity(automatizacijaScore, 'automatizacija');

  const domeni = {
    autonomija: {
      naziv: 'Autonomija',
      score: autonomijaScore,
      confidence: computeConfidence(autonomijaScore, true, false),
      tezina: AUTO_WEIGHTS.autonomija,
      doprinos: clampScore(autonomijaScore * AUTO_WEIGHTS.autonomija),
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(autonomijaVelocity, domainPrevVelocity('autonomija')),
      velocity: autonomijaVelocity,
      momentum: momentumFromVelocity(autonomijaVelocity),
      slaThreshold: AUTO_SLA_THRESHOLDS.autonomija,
    } satisfies AutoDomenSignal,
    upravljanje: {
      naziv: 'Upravljanje',
      score: upravljanjeScore,
      confidence: computeConfidence(upravljanjeScore, true, false),
      tezina: AUTO_WEIGHTS.upravljanje,
      doprinos: clampScore(upravljanjeScore * AUTO_WEIGHTS.upravljanje),
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(upravljanjeVelocity, domainPrevVelocity('upravljanje')),
      velocity: upravljanjeVelocity,
      momentum: momentumFromVelocity(upravljanjeVelocity),
      slaThreshold: AUTO_SLA_THRESHOLDS.upravljanje,
    } satisfies AutoDomenSignal,
    transformacija: {
      naziv: 'Transformacija',
      score: transformacijaScore,
      confidence: computeConfidence(transformacijaScore, true, false),
      tezina: AUTO_WEIGHTS.transformacija,
      doprinos: clampScore(transformacijaScore * AUTO_WEIGHTS.transformacija),
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(transformacijaVelocity, domainPrevVelocity('transformacija')),
      velocity: transformacijaVelocity,
      momentum: momentumFromVelocity(transformacijaVelocity),
      slaThreshold: AUTO_SLA_THRESHOLDS.transformacija,
    } satisfies AutoDomenSignal,
    orkestracija: {
      naziv: 'Orkestracija',
      score: orkestracijaScore,
      confidence: computeConfidence(orkestracijaScore, true, false),
      tezina: AUTO_WEIGHTS.orkestracija,
      doprinos: clampScore(orkestracijaScore * AUTO_WEIGHTS.orkestracija),
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(orkestracijaVelocity, domainPrevVelocity('orkestracija')),
      velocity: orkestracijaVelocity,
      momentum: momentumFromVelocity(orkestracijaVelocity),
      slaThreshold: AUTO_SLA_THRESHOLDS.orkestracija,
    } satisfies AutoDomenSignal,
    optimizacija: {
      naziv: 'Optimizacija',
      score: optimizacijaScore,
      confidence: computeConfidence(optimizacijaScore, true, false),
      tezina: AUTO_WEIGHTS.optimizacija,
      doprinos: clampScore(optimizacijaScore * AUTO_WEIGHTS.optimizacija),
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(optimizacijaVelocity, domainPrevVelocity('optimizacija')),
      velocity: optimizacijaVelocity,
      momentum: momentumFromVelocity(optimizacijaVelocity),
      slaThreshold: AUTO_SLA_THRESHOLDS.optimizacija,
    } satisfies AutoDomenSignal,
    automatizacija: {
      naziv: 'Automatizacija',
      score: automatizacijaScore,
      confidence: computeConfidence(automatizacijaScore, true, false),
      tezina: AUTO_WEIGHTS.automatizacija,
      doprinos: clampScore(automatizacijaScore * AUTO_WEIGHTS.automatizacija),
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      freshness: freshnessFromSourceState(true, false),
      trendDirection: velocityToTrendDirection(automatizacijaVelocity, domainPrevVelocity('automatizacija')),
      velocity: automatizacijaVelocity,
      momentum: momentumFromVelocity(automatizacijaVelocity),
      slaThreshold: AUTO_SLA_THRESHOLDS.automatizacija,
    } satisfies AutoDomenSignal,
  };

  const kriticniDomeni = (Object.values(domeni) as AutoDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Prioritetno stabilizovati AUTO domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }
  const bearishDomeni = (Object.values(domeni) as AutoDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish momentum detektovan u: ${bearishDomeni.join(', ')} — pratiti pad ritma.`);
  }
  if (degradedSources.length > 0) {
    preporuke.push(`Sanirati degradirane izvore za AUTO: ${degradedSources.join(', ')}`);
  }
  if (preporuke.length === 0) {
    preporuke.push('Svi AUTO domeni su iznad SLA praga uz stabilan ili bullish autonomni ritam.');
  }

  addAutoSnapshot({
    ukupanScore,
    ukupnaVelocity: globalVelocity,
    domenScores: {
      autonomija: autonomijaScore,
      upravljanje: upravljanjeScore,
      transformacija: transformacijaScore,
      orkestracija: orkestracijaScore,
      optimizacija: optimizacijaScore,
      automatizacija: automatizacijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: 'AUTO — Autonomna Upravljačka Transformativna Orkestracija',
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
      contractVersion: AUTO_CONTRACT_VERSION,
      modelVersion: AUTO_MODEL_VERSION,
      sourceOfTruth: AUTO_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: AUTO_WEIGHTS,
      slaThresholds: AUTO_SLA_THRESHOLDS,
      degraded: degradedSources.length > 0,
      degradedSources,
    },
    timestamp: nowIso,
  };
}
