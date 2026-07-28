// SpajaUltraOmegaCore -∞Ω+∞ — VUKOBAT
// Kompanija SPAJA — Digitalna Industrija
//
// VUKOBAT — Visoko Usklađena Komandna Orkestracija Budnosti, Analitike i Tokova.
// Cross-domain engine sa 6 domena:
//   - Vizija
//   - Upravljanje
//   - Koordinacija
//   - Operativa
//   - Bezbednost
//   - Automatizacija

import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  KOMPANIJA,
  OMEGA_AI_PERSONA_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_PROTOKOLA,
  TOTAL_ROUTES,
} from './constants';
import { addVukobatSnapshot, getVukobatSnapshots } from './vukobat-store';
import type { VukobatSnapshot } from './vukobat-store';

export const VUKOBAT_CONTRACT_VERSION = 'v1';
export const VUKOBAT_MODEL_VERSION = '1.0.0';
export const VUKOBAT_SOURCE_OF_TRUTH = '/api/vukobat';
export const VUKOBAT_NAZIV =
  'VUKOBAT — Visoko Usklađena Komandna Orkestracija Budnosti, Analitike i Tokova';

export const VUKOBAT_WEIGHTS = {
  vizija: 0.16,
  upravljanje: 0.18,
  koordinacija: 0.17,
  operativa: 0.17,
  bezbednost: 0.16,
  automatizacija: 0.16,
} as const;

export const VUKOBAT_SLA_THRESHOLDS = {
  vizija: 78,
  upravljanje: 80,
  koordinacija: 77,
  operativa: 79,
  bezbednost: 81,
  automatizacija: 76,
} as const;

const VELOCITY_EPSILON = 0.001;
const MOMENTUM_THRESHOLD = 2;
const WEIGHT_NORMALIZATION_EPSILON = 0.0001;

export type VukobatOcena = 'ODLICNO' | 'SPREMNO' | 'DELIMICNO' | 'POTREBNO_POBOLJSANJE';
export type VukobatTrendDirection = 'rising' | 'falling' | 'accelerating' | 'decelerating' | 'stable';
export type VukobatMomentum = 'bullish' | 'bearish' | 'neutral';

export interface VukobatDomenSignal {
  naziv: string;
  score: number;
  confidence: number;
  tezina: number;
  doprinos: number;
  sourceOfTruth: string;
  trendDirection: VukobatTrendDirection;
  velocity: number;
  momentum: VukobatMomentum;
  slaThreshold: number;
}

export interface VukobatHistoryEntry {
  score: number;
  velocity: number;
  timestamp: string;
}

export interface VukobatMeta {
  contractVersion: typeof VUKOBAT_CONTRACT_VERSION;
  modelVersion: string;
  sourceOfTruth: typeof VUKOBAT_SOURCE_OF_TRUTH;
  generatedAt: string;
  scoreWeights: typeof VUKOBAT_WEIGHTS;
  slaThresholds: typeof VUKOBAT_SLA_THRESHOLDS;
}

export interface VukobatOutput {
  sistem: typeof VUKOBAT_NAZIV;
  kompanija: string;
  verzija: string;
  ukupanScore: number;
  ukupnaVelocity: number;
  konacnaOcena: VukobatOcena;
  trendMomentum: VukobatMomentum;
  kriticniDomeni: string[];
  domeniBrojKriticnih: number;
  preporuke: string[];
  trendSnapshotCount: number;
  domeni: {
    vizija: VukobatDomenSignal;
    upravljanje: VukobatDomenSignal;
    koordinacija: VukobatDomenSignal;
    operativa: VukobatDomenSignal;
    bezbednost: VukobatDomenSignal;
    automatizacija: VukobatDomenSignal;
  };
  history: VukobatHistoryEntry[];
  operativniKontekst: {
    stranice: number;
    apiRute: number;
    ukupnoRuta: number;
    protokoli: number;
    dijagnostika: number;
    omegaPersone: number;
    autofinish: number;
  };
  meta: VukobatMeta;
  timestamp: string;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function assertVukobatWeights(): void {
  const total = Object.values(VUKOBAT_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(total - 1) > WEIGHT_NORMALIZATION_EPSILON) {
    throw new Error(`VUKOBAT_WEIGHTS moraju biti normalizovani na 1.0 (trenutno: ${total})`);
  }
}

function scoreToOcena(score: number): VukobatOcena {
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
): VukobatTrendDirection {
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

function momentumFromVelocity(velocity: number): VukobatMomentum {
  if (velocity > MOMENTUM_THRESHOLD) return 'bullish';
  if (velocity < -MOMENTUM_THRESHOLD) return 'bearish';
  return 'neutral';
}

function computeVizijaScore(): number {
  return clampScore(
    63
    + Math.min(20, TOTAL_PAGES / 8)
    + Math.min(16, OMEGA_AI_PERSONA_COUNT / 3),
  );
}

function computeUpravljanjeScore(): number {
  return clampScore(
    61
    + Math.min(18, TOTAL_PROTOKOLA * 1.05)
    + Math.min(18, TOTAL_API_ROUTES / 90),
  );
}

function computeKoordinacijaScore(): number {
  return clampScore(
    60
    + Math.min(20, TOTAL_ROUTES / 95)
    + Math.min(16, TOTAL_DIAGNOSTIKA / 220),
  );
}

function computeOperativaScore(): number {
  return clampScore(
    62
    + Math.min(18, TOTAL_API_ROUTES / 80)
    + Math.min(15, TOTAL_DIAGNOSTIKA / 200),
  );
}

function computeBezbednostScore(): number {
  return clampScore(
    64
    + Math.min(18, TOTAL_PROTOKOLA * 0.9)
    + Math.min(14, TOTAL_DIAGNOSTIKA / 260),
  );
}

function computeAutomatizacijaScore(): number {
  return clampScore(
    58
    + Math.min(20, AUTOFINISH_COUNT / 70)
    + Math.min(16, TOTAL_API_ROUTES / 85),
  );
}

export function buildVukobat(): VukobatOutput {
  assertVukobatWeights();
  const nowIso = new Date().toISOString();

  const vizijaScore = computeVizijaScore();
  const upravljanjeScore = computeUpravljanjeScore();
  const koordinacijaScore = computeKoordinacijaScore();
  const operativaScore = computeOperativaScore();
  const bezbednostScore = computeBezbednostScore();
  const automatizacijaScore = computeAutomatizacijaScore();

  const allSnapshots: VukobatSnapshot[] = getVukobatSnapshots();
  const historyBefore: VukobatHistoryEntry[] = allSnapshots.map((snapshot) => ({
    score: snapshot.ukupanScore,
    velocity: snapshot.ukupnaVelocity,
    timestamp: snapshot.timestamp,
  }));

  const previousSnapshot = allSnapshots.length > 0 ? allSnapshots[allSnapshots.length - 1] : null;
  const prePreviousSnapshot = allSnapshots.length > 1 ? allSnapshots[allSnapshots.length - 2] : null;

  const ukupanScore = clampScore(
    vizijaScore * VUKOBAT_WEIGHTS.vizija
    + upravljanjeScore * VUKOBAT_WEIGHTS.upravljanje
    + koordinacijaScore * VUKOBAT_WEIGHTS.koordinacija
    + operativaScore * VUKOBAT_WEIGHTS.operativa
    + bezbednostScore * VUKOBAT_WEIGHTS.bezbednost
    + automatizacijaScore * VUKOBAT_WEIGHTS.automatizacija,
  );

  const ukupnaVelocity = computeVelocity(ukupanScore, previousSnapshot?.ukupanScore ?? null);
  const trendMomentum = momentumFromVelocity(ukupnaVelocity);

  function domainVelocity(current: number, key: keyof VukobatSnapshot['domenScores']): number {
    return computeVelocity(current, previousSnapshot?.domenScores[key] ?? null);
  }

  function previousDomainVelocity(key: keyof VukobatSnapshot['domenScores']): number | null {
    if (!previousSnapshot || !prePreviousSnapshot) return null;
    return computeVelocity(previousSnapshot.domenScores[key], prePreviousSnapshot.domenScores[key]);
  }

  function createDomenSignal(
    key: keyof VukobatSnapshot['domenScores'],
    naziv: string,
    score: number,
    tezina: number,
    slaThreshold: number,
  ): VukobatDomenSignal {
    const velocity = domainVelocity(score, key);
    return {
      naziv,
      score,
      confidence: computeConfidence(score),
      tezina,
      doprinos: clampScore(score * tezina),
      sourceOfTruth: VUKOBAT_SOURCE_OF_TRUTH,
      trendDirection: velocityToTrendDirection(velocity, previousDomainVelocity(key)),
      velocity,
      momentum: momentumFromVelocity(velocity),
      slaThreshold,
    };
  }

  const domeni = {
    vizija: createDomenSignal('vizija', 'Vizija', vizijaScore, VUKOBAT_WEIGHTS.vizija, VUKOBAT_SLA_THRESHOLDS.vizija),
    upravljanje: createDomenSignal('upravljanje', 'Upravljanje', upravljanjeScore, VUKOBAT_WEIGHTS.upravljanje, VUKOBAT_SLA_THRESHOLDS.upravljanje),
    koordinacija: createDomenSignal('koordinacija', 'Koordinacija', koordinacijaScore, VUKOBAT_WEIGHTS.koordinacija, VUKOBAT_SLA_THRESHOLDS.koordinacija),
    operativa: createDomenSignal('operativa', 'Operativa', operativaScore, VUKOBAT_WEIGHTS.operativa, VUKOBAT_SLA_THRESHOLDS.operativa),
    bezbednost: createDomenSignal('bezbednost', 'Bezbednost', bezbednostScore, VUKOBAT_WEIGHTS.bezbednost, VUKOBAT_SLA_THRESHOLDS.bezbednost),
    automatizacija: createDomenSignal('automatizacija', 'Automatizacija', automatizacijaScore, VUKOBAT_WEIGHTS.automatizacija, VUKOBAT_SLA_THRESHOLDS.automatizacija),
  };

  const kriticniDomeni = (Object.values(domeni) as VukobatDomenSignal[])
    .filter((domen) => domen.score < domen.slaThreshold)
    .map((domen) => domen.naziv);

  const preporuke: string[] = [];
  if (kriticniDomeni.length > 0) {
    preporuke.push(`Stabilizovati VUKOBAT domene ispod SLA praga: ${kriticniDomeni.join(', ')}`);
  }

  const bearishDomeni = (Object.values(domeni) as VukobatDomenSignal[])
    .filter((domen) => domen.momentum === 'bearish')
    .map((domen) => domen.naziv);
  if (bearishDomeni.length > 0) {
    preporuke.push(`Bearish momentum detektovan u domenima: ${bearishDomeni.join(', ')}.`);
  }

  if (preporuke.length === 0) {
    preporuke.push('VUKOBAT održava stabilan ili bullish operativni ritam kroz svih 6 domena.');
  }

  addVukobatSnapshot({
    ukupanScore,
    ukupnaVelocity,
    domenScores: {
      vizija: vizijaScore,
      upravljanje: upravljanjeScore,
      koordinacija: koordinacijaScore,
      operativa: operativaScore,
      bezbednost: bezbednostScore,
      automatizacija: automatizacijaScore,
    },
    timestamp: nowIso,
  });

  return {
    sistem: VUKOBAT_NAZIV,
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    ukupanScore,
    ukupnaVelocity,
    konacnaOcena: scoreToOcena(ukupanScore),
    trendMomentum,
    kriticniDomeni,
    domeniBrojKriticnih: kriticniDomeni.length,
    preporuke,
    trendSnapshotCount: historyBefore.length + 1,
    domeni,
    history: historyBefore,
    operativniKontekst: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      protokoli: TOTAL_PROTOKOLA,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      omegaPersone: OMEGA_AI_PERSONA_COUNT,
      autofinish: AUTOFINISH_COUNT,
    },
    meta: {
      contractVersion: VUKOBAT_CONTRACT_VERSION,
      modelVersion: VUKOBAT_MODEL_VERSION,
      sourceOfTruth: VUKOBAT_SOURCE_OF_TRUTH,
      generatedAt: nowIso,
      scoreWeights: VUKOBAT_WEIGHTS,
      slaThresholds: VUKOBAT_SLA_THRESHOLDS,
    },
    timestamp: nowIso,
  };
}
