// SpajaUltraOmegaCore -∞Ω+∞ — EKSPRES
// Kompanija SPAJA — Digitalna Industrija
//
// EKSPRES — Ekspresni Operativni Readiness Engine
// Cross-domain engine sa 4 operativna domena:
//   - Brzina
//   - Pouzdanost
//   - Automatizacija
//   - Kvalitet Izlaza

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  OMEGA_AI_PERSONA_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_ROUTES,
} from './constants';
import { addEkspresSnapshot, getEkspresSnapshots } from './ekspres-store';
import type { EkspresSnapshot } from './ekspres-store';

export const EKSPRES_CONTRACT_VERSION = 'v1';
export const EKSPRES_MODEL_VERSION = '1.0.0';
export const EKSPRES_SOURCE_OF_TRUTH = '/api/ekspres';
export const EKSPRES_NAZIV =
  'EKSPRES — Ekspresni Operativni Readiness Engine za brzinu, pouzdanost, automatizaciju i kvalitet izlaza';

export const EKSPRES_WEIGHTS = {
  brzina: 0.27,
  pouzdanost: 0.26,
  automatizacija: 0.24,
  kvalitetIzlaza: 0.23,
} as const;

export const EKSPRES_SLA_THRESHOLDS = {
  brzina: 80,
  pouzdanost: 81,
  automatizacija: 78,
  kvalitetIzlaza: 79,
} as const;

const VELOCITY_EPSILON = 0.001;
const MOMENTUM_THRESHOLD = 2;
const WEIGHT_NORMALIZATION_EPSILON = 0.0001;
const EKSPRES_SNAPSHOT_THROTTLE_MS = 60_000;

const weightSum = Object.values(EKSPRES_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > WEIGHT_NORMALIZATION_EPSILON) {
  throw new Error(`EKSPRES_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`);
}

const BRZINA_ROUTES_DIVISOR = 165;
const BRZINA_ROUTES_CAP = 10;
const BRZINA_AUTOFINISH_DIVISOR = 200;
const BRZINA_AUTOFINISH_CAP = 9;
const BRZINA_BASE = 62;

const POUZDANOST_DIAG_DIVISOR = 380;
const POUZDANOST_DIAG_CAP = 10;
const POUZDANOST_API_DIVISOR = 170;
const POUZDANOST_API_CAP = 8;
const POUZDANOST_BASE = 63;

const AUTOMATIZACIJA_AUTOFINISH_DIVISOR = 150;
const AUTOMATIZACIJA_AUTOFINISH_CAP = 10;
const AUTOMATIZACIJA_PAGES_DIVISOR = 22;
const AUTOMATIZACIJA_PAGES_CAP = 8;
const AUTOMATIZACIJA_BASE = 61;

const KVALITET_DIAG_DIVISOR = 420;
const KVALITET_DIAG_CAP = 8;
const KVALITET_PERSONA_DIVISOR = 8;
const KVALITET_PERSONA_CAP = 8;
const KVALITET_BASE = 64;

export type EkspresOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type EkspresTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type EkspresMomentum = 'bullish' | 'bearish' | 'neutral';

export interface EkspresDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  trendDirection: EkspresTrendDirection;
  velocity: number;
  momentum: EkspresMomentum;
  slaThreshold: number;
}

export interface EkspresHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface EkspresMeta {
  contractVersion: typeof EKSPRES_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof EKSPRES_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof EKSPRES_WEIGHTS;
  slaThresholds: typeof EKSPRES_SLA_THRESHOLDS;
}

export interface EkspresOutput {
  sistem: typeof EKSPRES_NAZIV;
  kompanija: string;
  verzija: string;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: EkspresOcena;
  trendMomentum: EkspresMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    brzina: EkspresDomenSignal;
    pouzdanost: EkspresDomenSignal;
    automatizacija: EkspresDomenSignal;
    kvalitetIzlaza: EkspresDomenSignal;
  };
  history: EkspresHistoryEntry[];
  operativniKontekst: {
    stranice: number;
    apiRute: number;
    ukupnoRuta: number;
    dijagnostika: number;
    omegaPersone: number;
    autofinish: number;
  };
  meta: EkspresMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): EkspresOcena {
  if (score >= 90) return 'ODLICNO';
  if (score >= 75) return 'SPREMNO';
  if (score >= 50) return 'DELIMICNO';
  return 'POTREBNO_POBOLJSANJE';
}

function computeConfidence(score: number): number {
  if (score >= 90) return 95;
  if (score >= 75) return 89;
  if (score >= 50) return 81;
  return 72;
}

function computeVelocity(current: number, previous: number | null): number {
  if (previous === null) return 0;
  return Math.max(-100, Math.min(100, current - previous));
}

function velocityToTrendDirection(
  velocity: number,
  previousVelocity: number | null,
): EkspresTrendDirection {
  if (Math.abs(velocity) < VELOCITY_EPSILON) return 'stable';
  if (previousVelocity === null) return velocity > 0 ? 'rising' : 'falling';

  const acceleration = velocity - previousVelocity;
  if (velocity > 0) {
    if (acceleration > VELOCITY_EPSILON) return 'accelerating';
    if (acceleration < -VELOCITY_EPSILON) return 'decelerating';
    return 'rising';
  }

  if (acceleration > VELOCITY_EPSILON) return 'decelerating';
  return 'falling';
}

function momentumFromVelocity(velocity: number): EkspresMomentum {
  if (velocity > MOMENTUM_THRESHOLD) return 'bullish';
  if (velocity < -MOMENTUM_THRESHOLD) return 'bearish';
  return 'neutral';
}

function isValidIsoTimestamp(timestamp: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(timestamp)) {
    return false;
  }
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return false;
  }
  return new Date(parsed).toISOString() === timestamp;
}

function computeBrzinaScore(): number {
  return clampScore(
    BRZINA_BASE
    + Math.min(BRZINA_ROUTES_CAP, TOTAL_ROUTES / BRZINA_ROUTES_DIVISOR)
    + Math.min(BRZINA_AUTOFINISH_CAP, AUTOFINISH_COUNT / BRZINA_AUTOFINISH_DIVISOR),
  );
}

function computePouzdanostScore(): number {
  return clampScore(
    POUZDANOST_BASE
    + Math.min(POUZDANOST_DIAG_CAP, TOTAL_DIAGNOSTIKA / POUZDANOST_DIAG_DIVISOR)
    + Math.min(POUZDANOST_API_CAP, TOTAL_API_ROUTES / POUZDANOST_API_DIVISOR),
  );
}

function computeAutomatizacijaScore(): number {
  return clampScore(
    AUTOMATIZACIJA_BASE
    + Math.min(AUTOMATIZACIJA_AUTOFINISH_CAP, AUTOFINISH_COUNT / AUTOMATIZACIJA_AUTOFINISH_DIVISOR)
    + Math.min(AUTOMATIZACIJA_PAGES_CAP, TOTAL_PAGES / AUTOMATIZACIJA_PAGES_DIVISOR),
  );
}

function computeKvalitetIzlazaScore(): number {
  return clampScore(
    KVALITET_BASE
    + Math.min(KVALITET_DIAG_CAP, TOTAL_DIAGNOSTIKA / KVALITET_DIAG_DIVISOR)
    + Math.min(KVALITET_PERSONA_CAP, OMEGA_AI_PERSONA_COUNT / KVALITET_PERSONA_DIVISOR),
  );
}

export function buildEkspres(options?: { persistSnapshot?: boolean }): EkspresOutput {
  const brzinaScore = computeBrzinaScore();
  const pouzdanostScore = computePouzdanostScore();
  const automatizacijaScore = computeAutomatizacijaScore();
  const kvalitetIzlazaScore = computeKvalitetIzlazaScore();

  const allSnapshots: EkspresSnapshot[] = getEkspresSnapshots();
  const historyBefore: EkspresHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    brzinaScore * EKSPRES_WEIGHTS.brzina
    + pouzdanostScore * EKSPRES_WEIGHTS.pouzdanost
    + automatizacijaScore * EKSPRES_WEIGHTS.automatizacija
    + kvalitetIzlazaScore * EKSPRES_WEIGHTS.kvalitetIzlaza,
  );

  const ukupnaVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(ukupnaVelocity);

  function domenVelocity(current: number, key: keyof EkspresSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function prethodniDomenVelocity(key: keyof EkspresSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  function kreirajDomenSignal(
    key: keyof EkspresSnapshot['domenScores'],
    naziv: string,
    score: number,
    tezina: number,
    slaThreshold: number,
  ): EkspresDomenSignal {
    const velocity = domenVelocity(score, key);
    return {
      naziv,
      score,
      confidence: computeConfidence(score),
      tezina,
      doprinos: clampScore(score * tezina),
      sourceOfTruth: EKSPRES_SOURCE_OF_TRUTH,
      trendDirection: velocityToTrendDirection(velocity, prethodniDomenVelocity(key)),
      velocity,
      momentum: momentumFromVelocity(velocity),
      slaThreshold,
    };
  }

  const domeni = {
    brzina: kreirajDomenSignal('brzina', 'Brzina', brzinaScore, EKSPRES_WEIGHTS.brzina, EKSPRES_SLA_THRESHOLDS.brzina),
    pouzdanost: kreirajDomenSignal('pouzdanost', 'Pouzdanost', pouzdanostScore, EKSPRES_WEIGHTS.pouzdanost, EKSPRES_SLA_THRESHOLDS.pouzdanost),
    automatizacija: kreirajDomenSignal('automatizacija', 'Automatizacija', automatizacijaScore, EKSPRES_WEIGHTS.automatizacija, EKSPRES_SLA_THRESHOLDS.automatizacija),
    kvalitetIzlaza: kreirajDomenSignal('kvalitetIzlaza', 'Kvalitet izlaza', kvalitetIzlazaScore, EKSPRES_WEIGHTS.kvalitetIzlaza, EKSPRES_SLA_THRESHOLDS.kvalitetIzlaza),
  };

  const kriticniDomeni = (Object.values(domeni) as EkspresDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Stabilizovati EKSPRES domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }

  const bearishDomeni = (Object.values(domeni) as EkspresDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Negativan momentum detektovan u domenima: ${bearishDomeni.join(', ')}.`);
  }

  if (preporuke.length === 0) {
    preporuke.push('EKSPRES održava stabilan ili bullish operativni ritam kroz sva 4 domena.');
  }

  const shouldPersistSnapshot = options?.persistSnapshot ?? false;
  const previousSnapshotTimestamp = previousSnapshot?.timestamp;
  const hasValidPreviousSnapshotTimestamp = previousSnapshotTimestamp
    ? isValidIsoTimestamp(previousSnapshotTimestamp)
    : false;

  if (previousSnapshotTimestamp && !hasValidPreviousSnapshotTimestamp) {
    console.warn('[ekspres] invalid snapshot timestamp detected; skipping persistence to prevent data corruption');
  }

  const enoughTimeElapsed = !previousSnapshotTimestamp
    || (hasValidPreviousSnapshotTimestamp
      && Date.now() - Date.parse(previousSnapshotTimestamp) >= EKSPRES_SNAPSHOT_THROTTLE_MS);
  const completedAt = new Date().toISOString();
  const persistedSnapshotDelta = shouldPersistSnapshot && enoughTimeElapsed ? 1 : 0;

  if (persistedSnapshotDelta === 1) {
    addEkspresSnapshot({
      ukupanScore,
      ukupnaVelocity,
      domenScores: {
        brzina: brzinaScore,
        pouzdanost: pouzdanostScore,
        automatizacija: automatizacijaScore,
        kvalitetIzlaza: kvalitetIzlazaScore,
      },
      timestamp: completedAt,
    });
  }

  return {
    sistem: EKSPRES_NAZIV,
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    ukupanScore,
    ukupnaVelocity,
    konacnaOcena: scoreToOcena(ukupanScore),
    trendMomentum,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    trendSnapshotCount: historyBefore.length + persistedSnapshotDelta,
    domeni,
    history: historyBefore,
    operativniKontekst: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      omegaPersone: OMEGA_AI_PERSONA_COUNT,
      autofinish: AUTOFINISH_COUNT,
    },
    meta: {
      contractVersion: EKSPRES_CONTRACT_VERSION,
      modelVersion: EKSPRES_MODEL_VERSION,
      sourceOfTruth: EKSPRES_SOURCE_OF_TRUTH,
      generatedAt: completedAt,
      scoreWeights: EKSPRES_WEIGHTS,
      slaThresholds: EKSPRES_SLA_THRESHOLDS,
    },
    timestamp: completedAt,
  };
}
