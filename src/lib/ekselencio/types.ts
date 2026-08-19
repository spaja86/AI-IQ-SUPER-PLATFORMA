// SpajaUltraOmegaCore -∞Ω+∞ — EKSELENCIO
// Kompanija SPAJA — Digitalna Industrija
// OKRID: OKRID-2026-EKSELENCIO-001

// ─── EKUARE RA EKSILARIUM Six Pillars ────────────────────────────────────────

export type EkuarePillar =
  | 'ES'  // Excellence Scoring
  | 'KC'  // Knowledge Convergence
  | 'UOA' // Unified Output Audit
  | 'AR'  // Adaptive Refinement
  | 'RT'  // Rank & Tier Mapping
  | 'EV'; // Evolution Signal

export const EKUARE_PILLARS: EkuarePillar[] = ['ES', 'KC', 'UOA', 'AR', 'RT', 'EV'];

export const EKUARE_PILLAR_LABELS: Record<EkuarePillar, string> = {
  ES: 'Excellence Scoring',
  KC: 'Knowledge Convergence',
  UOA: 'Unified Output Audit',
  AR: 'Adaptive Refinement',
  RT: 'Rank & Tier Mapping',
  EV: 'Evolution Signal',
};

// ─── Tier ─────────────────────────────────────────────────────────────────────

export type EkselencioTier =
  | 'GENESIS'
  | 'RISING'
  | 'MASTER'
  | 'APEX'
  | 'TRANSCENDENT';

// ─── Input / Output ───────────────────────────────────────────────────────────

export interface EkselencioInput {
  agentId: string;
  domainScores: Partial<Record<EkuarePillar, number>>;
  context?: string;
  historyVector?: number[];
}

export interface PillarBreakdown {
  pillar: EkuarePillar;
  label: string;
  score: number;         // 0–100, clamped
  isBlindSpot: boolean;  // score < 20
}

export interface EkselencioResult {
  agentId: string;
  ekuareRaScore: number;       // 0–1000
  tier: EkselencioTier;
  pillars: PillarBreakdown[];
  blindSpots: EkuarePillar[];
  evolutionSignal: number;     // -1 to +1
  recommendation: string;
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface EkselencioHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastTier: EkselencioTier;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const EKSELENCIO_PERSONA_ID = 'ekselencio-apex';
export const EKSELENCIO_OCTAVE = 16;
export const EKSELENCIO_HIPERMREZA_NODE = 255;
export const EKSELENCIO_CONTRACT_VERSION = 'v1';
export const EKSELENCIO_MODULE_VERSION = '1.0.0';
export const EKSELENCIO_PERFORMANCE_MAX_MS = 50;
export const EKSELENCIO_API_RESPONSE_MAX_MS = 200;
export const EKSELENCIO_BLIND_SPOT_THRESHOLD = 20;
export const EKSELENCIO_MIN_SCORE = 0;
export const EKSELENCIO_MAX_SCORE = 100;
export const EKSELENCIO_MAX_EKUARE_SCORE = 1000;
export const EKSELENCIO_DISCLAIMER =
  'EKSELENCIO rezultati su automatski generisani i ne predstavljaju garantovanu procenu.';
