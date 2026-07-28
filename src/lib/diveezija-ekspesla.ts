// SpajaUltraOmegaCore -∞Ω+∞ — DIVEEZIJA EKSPESLA
// Kompanija SPAJA — Digitalna Industrija
//
// DIVEEZIJA EKSPESLA — Dinamična Inteligentna Vektorizovana Ekspanzija i Ekspresija
// Zona Integracije Javnih Automatizovanih sistema + Ekspresni Paralelni Engine
// Sistemske Logike i Automatizacije.
// Cross-domain engine sa 6 domena:
//   - Divergencija
//   - Iteracija
//   - Vektorizacija
//   - Ekspanzija
//   - Ekspresna Logika
//   - Automatizacija

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  EXPECTED_AUTOFINISH_STEPOVI_COUNT,
  KOMPANIJA,
  OMEGA_AI_PERSONA_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_ROUTES,
} from './constants';
import { addDivezijaEkspeslaSnapshot, getDivezijaEkspeslaSnapshots } from './diveezija-ekspesla-store';
import type { DivezijaEkspeslaSnapshot } from './diveezija-ekspesla-store';

export const DIVEEZIJA_EKSPESLA_CONTRACT_VERSION = 'v1';
export const DIVEEZIJA_EKSPESLA_MODEL_VERSION = '1.0.0';
export const DIVEEZIJA_EKSPESLA_SOURCE_OF_TRUTH = '/api/diveezija-ekspesla';
export const DIVEEZIJA_EKSPESLA_NAZIV =
  'DIVEEZIJA EKSPESLA — Dinamična Inteligentna Vektorizovana Ekspanzija i Ekspresija Zona Integracije Javnih Automatizovanih sistema';

export const DIVEEZIJA_EKSPESLA_WEIGHTS = {
  divergencija: 0.17,
  iteracija: 0.17,
  vektorizacija: 0.17,
  ekspanzija: 0.16,
  ekspresnaLogika: 0.17,
  automatizacija: 0.16,
} as const;

export const DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS = {
  divergencija: 78,
  iteracija: 76,
  vektorizacija: 77,
  ekspanzija: 79,
  ekspresnaLogika: 80,
  automatizacija: 75,
} as const;

const VELOCITY_EPSILON = 0.001;
const MOMENTUM_THRESHOLD = 2;
const WEIGHT_NORMALIZATION_EPSILON = 0.0001;
// Snapshot persistence je dijagnostička i ephemeralan runtime signal;
// ne zamenjuje commit/PR audit log pravila definisana u AGENTS.md.
const DIVEEZIJA_EKSPESLA_SNAPSHOT_THROTTLE_MS = 60_000;

const weightSum = Object.values(DIVEEZIJA_EKSPESLA_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > WEIGHT_NORMALIZATION_EPSILON) {
  throw new Error(
    `DIVEEZIJA_EKSPESLA_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`,
  );
}

// Divisors/caps are tuned so current platform inventory keeps domain scores
// in the "SPREMNO" band while leaving visible headroom for future growth.
const DIVERGENCIJA_ROUTES_DIVISOR = 90;
const DIVERGENCIJA_ROUTES_CAP = 18;
const DIVERGENCIJA_PAGES_DIVISOR = 8;
const DIVERGENCIJA_PAGES_CAP = 15;

const ITERACIJA_AUTOFINISH_DIVISOR = 65;
const ITERACIJA_AUTOFINISH_CAP = 20;
const ITERACIJA_STEPOVI_FACTOR = 1.5;
const ITERACIJA_STEPOVI_CAP = 12;

const VEKTORIZACIJA_DIAGNOSTIKA_DIVISOR = 200;
const VEKTORIZACIJA_DIAGNOSTIKA_CAP = 16;
const VEKTORIZACIJA_ROUTES_DIVISOR = 100;
const VEKTORIZACIJA_ROUTES_CAP = 14;

const EKSPANZIJA_PAGES_DIVISOR = 9;
const EKSPANZIJA_PAGES_CAP = 16;
const EKSPANZIJA_PERSONA_DIVISOR = 3;
const EKSPANZIJA_PERSONA_CAP = 14;

const EKSPRESNA_LOGIKA_API_DIVISOR = 80;
const EKSPRESNA_LOGIKA_API_CAP = 18;
const EKSPRESNA_LOGIKA_VERSION_BONUS = 2;

const AUTOMATIZACIJA_AUTOFINISH_DIVISOR = 70;
const AUTOMATIZACIJA_AUTOFINISH_CAP = 20;
const AUTOMATIZACIJA_API_DIVISOR = 85;
const AUTOMATIZACIJA_API_CAP = 14;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type DivezijaEkspeslaOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type DivezijaEkspeslaTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type DivezijaEkspeslaMomentum = 'bullish' | 'bearish' | 'neutral';

export interface DivezijaEkspeslaDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  trendDirection: DivezijaEkspeslaTrendDirection;
  velocity: number;
  momentum: DivezijaEkspeslaMomentum;
  slaThreshold: number;
}

export interface DivezijaEkspeslaHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface DivezijaEkspeslaMeta {
  contractVersion: typeof DIVEEZIJA_EKSPESLA_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof DIVEEZIJA_EKSPESLA_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof DIVEEZIJA_EKSPESLA_WEIGHTS;
  slaThresholds: typeof DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS;
}

export interface DivezijaEkspeslaOutput {
  sistem: typeof DIVEEZIJA_EKSPESLA_NAZIV;
  kompanija: string;
  verzija: string;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: DivezijaEkspeslaOcena;
  trendMomentum: DivezijaEkspeslaMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    divergencija: DivezijaEkspeslaDomenSignal;
    iteracija: DivezijaEkspeslaDomenSignal;
    vektorizacija: DivezijaEkspeslaDomenSignal;
    ekspanzija: DivezijaEkspeslaDomenSignal;
    ekspresnaLogika: DivezijaEkspeslaDomenSignal;
    automatizacija: DivezijaEkspeslaDomenSignal;
  };
  history: DivezijaEkspeslaHistoryEntry[];
  operativniKontekst: {
    stranice: number;
    apiRute: number;
    ukupnoRuta: number;
    dijagnostika: number;
    omegaPersone: number;
    autofinish: number;
  };
  meta: DivezijaEkspeslaMeta;
  timestamp: string;
}

// ─── Pomoćne funkcije ─────────────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): DivezijaEkspeslaOcena {
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
): DivezijaEkspeslaTrendDirection {
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

function momentumFromVelocity(velocity: number): DivezijaEkspeslaMomentum {
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

// ─── Score računanje po domenima ─────────────────────────────────────────────

function computeDivergencijaScore(): number {
  return clampScore(
    60
    + Math.min(DIVERGENCIJA_ROUTES_CAP, TOTAL_ROUTES / DIVERGENCIJA_ROUTES_DIVISOR)
    + Math.min(DIVERGENCIJA_PAGES_CAP, TOTAL_PAGES / DIVERGENCIJA_PAGES_DIVISOR),
  );
}

function computeIteracijaScore(): number {
  return clampScore(
    58
    + Math.min(ITERACIJA_AUTOFINISH_CAP, AUTOFINISH_COUNT / ITERACIJA_AUTOFINISH_DIVISOR)
    + Math.min(ITERACIJA_STEPOVI_CAP, EXPECTED_AUTOFINISH_STEPOVI_COUNT * ITERACIJA_STEPOVI_FACTOR),
  );
}

function computeVektorizacijaScore(): number {
  return clampScore(
    61
    + Math.min(VEKTORIZACIJA_DIAGNOSTIKA_CAP, TOTAL_DIAGNOSTIKA / VEKTORIZACIJA_DIAGNOSTIKA_DIVISOR)
    + Math.min(VEKTORIZACIJA_ROUTES_CAP, TOTAL_ROUTES / VEKTORIZACIJA_ROUTES_DIVISOR),
  );
}

function computeEkspanzijaScore(): number {
  return clampScore(
    62
    + Math.min(EKSPANZIJA_PAGES_CAP, TOTAL_PAGES / EKSPANZIJA_PAGES_DIVISOR)
    + Math.min(EKSPANZIJA_PERSONA_CAP, OMEGA_AI_PERSONA_COUNT / EKSPANZIJA_PERSONA_DIVISOR),
  );
}

function computeEkspresnaLogikaScore(): number {
  return clampScore(
    60
    + Math.min(EKSPRESNA_LOGIKA_API_CAP, TOTAL_API_ROUTES / EKSPRESNA_LOGIKA_API_DIVISOR)
    + EKSPRESNA_LOGIKA_VERSION_BONUS,
  );
}

function computeAutomatizacijaScore(): number {
  return clampScore(
    59
    + Math.min(AUTOMATIZACIJA_AUTOFINISH_CAP, AUTOFINISH_COUNT / AUTOMATIZACIJA_AUTOFINISH_DIVISOR)
    + Math.min(AUTOMATIZACIJA_API_CAP, TOTAL_API_ROUTES / AUTOMATIZACIJA_API_DIVISOR),
  );
}

// ─── Factory funkcija ─────────────────────────────────────────────────────────

export function buildDivezijaEkspesla(options?: { persistSnapshot?: boolean }): DivezijaEkspeslaOutput {
  const divergencijaScore = computeDivergencijaScore();
  const iteracijaScore = computeIteracijaScore();
  const vektorizacijaScore = computeVektorizacijaScore();
  const ekspanzijaScore = computeEkspanzijaScore();
  const ekspresnaLogikaScore = computeEkspresnaLogikaScore();
  const automatizacijaScore = computeAutomatizacijaScore();

  const allSnapshots: DivezijaEkspeslaSnapshot[] = getDivezijaEkspeslaSnapshots();
  const historyBefore: DivezijaEkspeslaHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    divergencijaScore * DIVEEZIJA_EKSPESLA_WEIGHTS.divergencija
    + iteracijaScore * DIVEEZIJA_EKSPESLA_WEIGHTS.iteracija
    + vektorizacijaScore * DIVEEZIJA_EKSPESLA_WEIGHTS.vektorizacija
    + ekspanzijaScore * DIVEEZIJA_EKSPESLA_WEIGHTS.ekspanzija
    + ekspresnaLogikaScore * DIVEEZIJA_EKSPESLA_WEIGHTS.ekspresnaLogika
    + automatizacijaScore * DIVEEZIJA_EKSPESLA_WEIGHTS.automatizacija,
  );

  const ukupnaVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(ukupnaVelocity);

  function domenVelocity(current: number, key: keyof DivezijaEkspeslaSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function prethodniDomenVelocity(key: keyof DivezijaEkspeslaSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  function kreirajDomenSignal(
    key: keyof DivezijaEkspeslaSnapshot['domenScores'],
    naziv: string,
    score: number,
    tezina: number,
    slaThreshold: number,
  ): DivezijaEkspeslaDomenSignal {
    const velocity = domenVelocity(score, key);
    return {
      naziv,
      score,
      confidence: computeConfidence(score),
      tezina,
      doprinos: clampScore(score * tezina),
      sourceOfTruth: DIVEEZIJA_EKSPESLA_SOURCE_OF_TRUTH,
      trendDirection: velocityToTrendDirection(velocity, prethodniDomenVelocity(key)),
      velocity,
      momentum: momentumFromVelocity(velocity),
      slaThreshold,
    };
  }

  const domeni = {
    divergencija: kreirajDomenSignal('divergencija', 'Divergencija', divergencijaScore, DIVEEZIJA_EKSPESLA_WEIGHTS.divergencija, DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS.divergencija),
    iteracija: kreirajDomenSignal('iteracija', 'Iteracija', iteracijaScore, DIVEEZIJA_EKSPESLA_WEIGHTS.iteracija, DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS.iteracija),
    vektorizacija: kreirajDomenSignal('vektorizacija', 'Vektorizacija', vektorizacijaScore, DIVEEZIJA_EKSPESLA_WEIGHTS.vektorizacija, DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS.vektorizacija),
    ekspanzija: kreirajDomenSignal('ekspanzija', 'Ekspanzija', ekspanzijaScore, DIVEEZIJA_EKSPESLA_WEIGHTS.ekspanzija, DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS.ekspanzija),
    ekspresnaLogika: kreirajDomenSignal('ekspresnaLogika', 'Ekspresna Logika', ekspresnaLogikaScore, DIVEEZIJA_EKSPESLA_WEIGHTS.ekspresnaLogika, DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS.ekspresnaLogika),
    automatizacija: kreirajDomenSignal('automatizacija', 'Automatizacija', automatizacijaScore, DIVEEZIJA_EKSPESLA_WEIGHTS.automatizacija, DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS.automatizacija),
  };

  const kriticniDomeni = (Object.values(domeni) as DivezijaEkspeslaDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Stabilizovati DIVEEZIJA EKSPESLA domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }

  const bearishDomeni = (Object.values(domeni) as DivezijaEkspeslaDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Negativan momentum detektovan u domenima: ${bearishDomeni.join(', ')}.`);
  }

  if (preporuke.length === 0) {
    preporuke.push('DIVEEZIJA EKSPESLA održava stabilan ili bullish operativni ritam kroz svih 6 domena.');
  }

  const shouldPersistSnapshot = options?.persistSnapshot ?? false;
  const previousSnapshotTimestamp = previousSnapshot?.timestamp;
  const hasValidPreviousSnapshotTimestamp = previousSnapshotTimestamp
    ? isValidIsoTimestamp(previousSnapshotTimestamp)
    : false;

  if (previousSnapshotTimestamp && !hasValidPreviousSnapshotTimestamp) {
    console.warn('[diveezija-ekspesla] invalid snapshot timestamp detected; skipping persistence to prevent data corruption');
  }

  const enoughTimeElapsed = !previousSnapshotTimestamp
    || (hasValidPreviousSnapshotTimestamp
      && Date.now() - Date.parse(previousSnapshotTimestamp) >= DIVEEZIJA_EKSPESLA_SNAPSHOT_THROTTLE_MS);
  const completedAt = new Date().toISOString();
  const persistedSnapshotDelta = shouldPersistSnapshot && enoughTimeElapsed ? 1 : 0;

  if (persistedSnapshotDelta === 1) {
    addDivezijaEkspeslaSnapshot({
      ukupanScore,
      ukupnaVelocity,
      domenScores: {
        divergencija: divergencijaScore,
        iteracija: iteracijaScore,
        vektorizacija: vektorizacijaScore,
        ekspanzija: ekspanzijaScore,
        ekspresnaLogika: ekspresnaLogikaScore,
        automatizacija: automatizacijaScore,
      },
      timestamp: completedAt,
    });
  }

  return {
    sistem: DIVEEZIJA_EKSPESLA_NAZIV,
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
      contractVersion: DIVEEZIJA_EKSPESLA_CONTRACT_VERSION,
      modelVersion: DIVEEZIJA_EKSPESLA_MODEL_VERSION,
      sourceOfTruth: DIVEEZIJA_EKSPESLA_SOURCE_OF_TRUTH,
      generatedAt: completedAt,
      scoreWeights: DIVEEZIJA_EKSPESLA_WEIGHTS,
      slaThresholds: DIVEEZIJA_EKSPESLA_SLA_THRESHOLDS,
    },
    timestamp: completedAt,
  };
}
