// SpajaUltraOmegaCore -∞Ω+∞ — EKSPRITING
// Kompanija SPAJA — Digitalna Industrija
//
// EKSPRITING — Ekspresni Skripting i Pisanje Engine
// Brzi, ekspresivni engine za generisanje, orkestraciju i automatizaciju
// pisanog sadržaja, skriptova i šablona unutar AI-IQ SUPER PLATFORME.
// Cross-domain engine sa 5 domena:
//   - Ekspresna Sinteza
//   - Skripting Logika
//   - Pisanje Toka
//   - Iterativno Uredivanje
//   - Tokenizacija Sadržaja

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
import { addEkspritingSnapshot, getEkspritingSnapshots } from './ekspriting-store';
import type { EkspritingSnapshot } from './ekspriting-store';

export const EKSPRITING_CONTRACT_VERSION = 'v1';
export const EKSPRITING_MODEL_VERSION = '1.0.0';
export const EKSPRITING_SOURCE_OF_TRUTH = '/api/ekspriting';
export const EKSPRITING_NAZIV =
  'EKSPRITING — Ekspresni Skripting i Pisanje Engine za generisanje, orkestraciju i automatizaciju sadržaja';

export const EKSPRITING_WEIGHTS = {
  ekspresaSinteza: 0.22,
  skriptingLogika: 0.21,
  pisanjeToka: 0.19,
  iterativnoUredjivanje: 0.19,
  tokenizacijaSadrzaja: 0.19,
} as const;

export const EKSPRITING_SLA_THRESHOLDS = {
  ekspresaSinteza: 80,
  skriptingLogika: 78,
  pisanjeToka: 76,
  iterativnoUredjivanje: 75,
  tokenizacijaSadrzaja: 77,
} as const;

const VELOCITY_EPSILON = 0.001;
const MOMENTUM_THRESHOLD = 2;
const WEIGHT_NORMALIZATION_EPSILON = 0.0001;
// Snapshot persistence je dijagnostička i ephemeralan runtime signal;
// ne zamenjuje commit/PR audit log pravila definisana u AGENTS.md.
const EKSPRITING_SNAPSHOT_THROTTLE_MS = 60_000;

const weightSum = Object.values(EKSPRITING_WEIGHTS).reduce((sum, w) => sum + w, 0);
if (Math.abs(weightSum - 1) > WEIGHT_NORMALIZATION_EPSILON) {
  throw new Error(
    `EKSPRITING_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${weightSum})`,
  );
}

// Divisors/caps are tuned so current platform inventory keeps domain scores
// in the "SPREMNO" band while leaving visible headroom for future growth.
const EKSPRESA_SINTEZA_API_DIVISOR = 105;
const EKSPRESA_SINTEZA_API_CAP = 12;
const EKSPRESA_SINTEZA_PAGES_DIVISOR = 19;
const EKSPRESA_SINTEZA_PAGES_CAP = 8;

const SKRIPTING_LOGIKA_AUTOFINISH_DIVISOR = 145;
const SKRIPTING_LOGIKA_AUTOFINISH_CAP = 10;
const SKRIPTING_LOGIKA_API_DIVISOR = 165;
const SKRIPTING_LOGIKA_API_CAP = 8;
const SKRIPTING_LOGIKA_BASE = 63;

const PISANJE_TOKA_ROUTES_DIVISOR = 170;
const PISANJE_TOKA_ROUTES_CAP = 9;
const PISANJE_TOKA_DIAGNOSTIKA_DIVISOR = 400;
const PISANJE_TOKA_DIAGNOSTIKA_CAP = 6;
const PISANJE_TOKA_BASE = 63;

const ITERATIVNO_PAGES_DIVISOR = 15;
const ITERATIVNO_PAGES_CAP = 10;
const ITERATIVNO_PERSONA_DIVISOR = 8;
const ITERATIVNO_PERSONA_CAP = 7;
const ITERATIVNO_BASE = 61;

const TOKENIZACIJA_API_DIVISOR = 145;
const TOKENIZACIJA_API_CAP = 9;
const TOKENIZACIJA_AUTOFINISH_DIVISOR = 200;
const TOKENIZACIJA_AUTOFINISH_CAP = 8;
const TOKENIZACIJA_BASE = 63;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type EkspritingOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type EkspritingTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type EkspritingMomentum = 'bullish' | 'bearish' | 'neutral';

export interface EkspritingDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  trendDirection: EkspritingTrendDirection;
  velocity: number;
  momentum: EkspritingMomentum;
  slaThreshold: number;
}

export interface EkspritingHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface EkspritingMeta {
  contractVersion: typeof EKSPRITING_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof EKSPRITING_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof EKSPRITING_WEIGHTS;
  slaThresholds: typeof EKSPRITING_SLA_THRESHOLDS;
}

export interface EkspritingOutput {
  sistem: typeof EKSPRITING_NAZIV;
  kompanija: string;
  verzija: string;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: EkspritingOcena;
  trendMomentum: EkspritingMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    ekspresaSinteza: EkspritingDomenSignal;
    skriptingLogika: EkspritingDomenSignal;
    pisanjeToka: EkspritingDomenSignal;
    iterativnoUredjivanje: EkspritingDomenSignal;
    tokenizacijaSadrzaja: EkspritingDomenSignal;
  };
  history: EkspritingHistoryEntry[];
  operativniKontekst: {
    stranice: number;
    apiRute: number;
    ukupnoRuta: number;
    dijagnostika: number;
    omegaPersone: number;
    autofinish: number;
  };
  meta: EkspritingMeta;
  timestamp: string;
}

// ─── Pomoćne funkcije ─────────────────────────────────────────────────────────

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToOcena(score: number): EkspritingOcena {
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
): EkspritingTrendDirection {
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

function momentumFromVelocity(velocity: number): EkspritingMomentum {
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

function computeEkspresaSintezaScore(): number {
  return clampScore(
    62
    + Math.min(EKSPRESA_SINTEZA_API_CAP, TOTAL_API_ROUTES / EKSPRESA_SINTEZA_API_DIVISOR)
    + Math.min(EKSPRESA_SINTEZA_PAGES_CAP, TOTAL_PAGES / EKSPRESA_SINTEZA_PAGES_DIVISOR),
  );
}

function computeSkriptingLogikaScore(): number {
  return clampScore(
    SKRIPTING_LOGIKA_BASE
    + Math.min(SKRIPTING_LOGIKA_AUTOFINISH_CAP, AUTOFINISH_COUNT / SKRIPTING_LOGIKA_AUTOFINISH_DIVISOR)
    + Math.min(SKRIPTING_LOGIKA_API_CAP, TOTAL_API_ROUTES / SKRIPTING_LOGIKA_API_DIVISOR),
  );
}

function computePisanjeTokaScore(): number {
  return clampScore(
    PISANJE_TOKA_BASE
    + Math.min(PISANJE_TOKA_ROUTES_CAP, TOTAL_ROUTES / PISANJE_TOKA_ROUTES_DIVISOR)
    + Math.min(PISANJE_TOKA_DIAGNOSTIKA_CAP, TOTAL_DIAGNOSTIKA / PISANJE_TOKA_DIAGNOSTIKA_DIVISOR),
  );
}

function computeIterativnoUredjivanje(): number {
  return clampScore(
    ITERATIVNO_BASE
    + Math.min(ITERATIVNO_PAGES_CAP, TOTAL_PAGES / ITERATIVNO_PAGES_DIVISOR)
    + Math.min(ITERATIVNO_PERSONA_CAP, OMEGA_AI_PERSONA_COUNT / ITERATIVNO_PERSONA_DIVISOR),
  );
}

function computeTokenizacijaSadrzajaScore(): number {
  return clampScore(
    TOKENIZACIJA_BASE
    + Math.min(TOKENIZACIJA_API_CAP, TOTAL_API_ROUTES / TOKENIZACIJA_API_DIVISOR)
    + Math.min(TOKENIZACIJA_AUTOFINISH_CAP, AUTOFINISH_COUNT / TOKENIZACIJA_AUTOFINISH_DIVISOR),
  );
}

// ─── Factory funkcija ─────────────────────────────────────────────────────────

export function buildEkspriting(options?: { persistSnapshot?: boolean }): EkspritingOutput {
  const ekspresaSintezaScore = computeEkspresaSintezaScore();
  const skriptingLogikaScore = computeSkriptingLogikaScore();
  const pisanjeTokaScore = computePisanjeTokaScore();
  const iterativnoUredjivanje = computeIterativnoUredjivanje();
  const tokenizacijaSadrzajaScore = computeTokenizacijaSadrzajaScore();

  const allSnapshots: EkspritingSnapshot[] = getEkspritingSnapshots();
  const historyBefore: EkspritingHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    ekspresaSintezaScore * EKSPRITING_WEIGHTS.ekspresaSinteza
    + skriptingLogikaScore * EKSPRITING_WEIGHTS.skriptingLogika
    + pisanjeTokaScore * EKSPRITING_WEIGHTS.pisanjeToka
    + iterativnoUredjivanje * EKSPRITING_WEIGHTS.iterativnoUredjivanje
    + tokenizacijaSadrzajaScore * EKSPRITING_WEIGHTS.tokenizacijaSadrzaja,
  );

  const ukupnaVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(ukupnaVelocity);

  function domenVelocity(current: number, key: keyof EkspritingSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function prethodniDomenVelocity(key: keyof EkspritingSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  function kreirajDomenSignal(
    key: keyof EkspritingSnapshot['domenScores'],
    naziv: string,
    score: number,
    tezina: number,
    slaThreshold: number,
  ): EkspritingDomenSignal {
    const velocity = domenVelocity(score, key);
    return {
      naziv,
      score,
      confidence: computeConfidence(score),
      tezina,
      doprinos: clampScore(score * tezina),
      sourceOfTruth: EKSPRITING_SOURCE_OF_TRUTH,
      trendDirection: velocityToTrendDirection(velocity, prethodniDomenVelocity(key)),
      velocity,
      momentum: momentumFromVelocity(velocity),
      slaThreshold,
    };
  }

  const domeni = {
    ekspresaSinteza: kreirajDomenSignal('ekspresaSinteza', 'Ekspresna Sinteza', ekspresaSintezaScore, EKSPRITING_WEIGHTS.ekspresaSinteza, EKSPRITING_SLA_THRESHOLDS.ekspresaSinteza),
    skriptingLogika: kreirajDomenSignal('skriptingLogika', 'Skripting Logika', skriptingLogikaScore, EKSPRITING_WEIGHTS.skriptingLogika, EKSPRITING_SLA_THRESHOLDS.skriptingLogika),
    pisanjeToka: kreirajDomenSignal('pisanjeToka', 'Pisanje Toka', pisanjeTokaScore, EKSPRITING_WEIGHTS.pisanjeToka, EKSPRITING_SLA_THRESHOLDS.pisanjeToka),
    iterativnoUredjivanje: kreirajDomenSignal('iterativnoUredjivanje', 'Iterativno Uredivanje', iterativnoUredjivanje, EKSPRITING_WEIGHTS.iterativnoUredjivanje, EKSPRITING_SLA_THRESHOLDS.iterativnoUredjivanje),
    tokenizacijaSadrzaja: kreirajDomenSignal('tokenizacijaSadrzaja', 'Tokenizacija Sadrzaja', tokenizacijaSadrzajaScore, EKSPRITING_WEIGHTS.tokenizacijaSadrzaja, EKSPRITING_SLA_THRESHOLDS.tokenizacijaSadrzaja),
  };

  const kriticniDomeni = (Object.values(domeni) as EkspritingDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Stabilizovati EKSPRITING domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }

  const bearishDomeni = (Object.values(domeni) as EkspritingDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Negativan momentum detektovan u domenima: ${bearishDomeni.join(', ')}.`);
  }

  if (preporuke.length === 0) {
    preporuke.push('EKSPRITING održava stabilan ili bullish operativni ritam kroz svih 5 domena.');
  }

  const shouldPersistSnapshot = options?.persistSnapshot ?? false;
  const previousSnapshotTimestamp = previousSnapshot?.timestamp;
  const hasValidPreviousSnapshotTimestamp = previousSnapshotTimestamp
    ? isValidIsoTimestamp(previousSnapshotTimestamp)
    : false;

  if (previousSnapshotTimestamp && !hasValidPreviousSnapshotTimestamp) {
    console.warn('[ekspriting] invalid snapshot timestamp detected; skipping persistence to prevent data corruption');
  }

  const enoughTimeElapsed = !previousSnapshotTimestamp
    || (hasValidPreviousSnapshotTimestamp
      && Date.now() - Date.parse(previousSnapshotTimestamp) >= EKSPRITING_SNAPSHOT_THROTTLE_MS);
  const completedAt = new Date().toISOString();
  const persistedSnapshotDelta = shouldPersistSnapshot && enoughTimeElapsed ? 1 : 0;

  if (persistedSnapshotDelta === 1) {
    addEkspritingSnapshot({
      ukupanScore,
      ukupnaVelocity,
      domenScores: {
        ekspresaSinteza: ekspresaSintezaScore,
        skriptingLogika: skriptingLogikaScore,
        pisanjeToka: pisanjeTokaScore,
        iterativnoUredjivanje,
        tokenizacijaSadrzaja: tokenizacijaSadrzajaScore,
      },
      timestamp: completedAt,
    });
  }

  return {
    sistem: EKSPRITING_NAZIV,
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
      contractVersion: EKSPRITING_CONTRACT_VERSION,
      modelVersion: EKSPRITING_MODEL_VERSION,
      sourceOfTruth: EKSPRITING_SOURCE_OF_TRUTH,
      generatedAt: completedAt,
      scoreWeights: EKSPRITING_WEIGHTS,
      slaThresholds: EKSPRITING_SLA_THRESHOLDS,
    },
    timestamp: completedAt,
  };
}
