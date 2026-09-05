// SpajaUltraOmegaCore -∞Ω+∞ — GAMELORD
// Kompanija SPAJA — Digitalna Industrija

export type GamelordMode = 'SOLO' | 'DUO' | 'SQUAD';
export type GamelordStatus = 'UNRANKED' | 'CONTENDER' | 'WARMASTER' | 'GAMELORD';
export type GamelordAction = 'TRAIN_CORE' | 'STABILIZE' | 'PRESS_ADVANTAGE' | 'HOLD_THRONE';

export interface GamelordInput {
  referenceId?: string;
  mode: GamelordMode;
  strategyScore: number;
  executionScore: number;
  consistencyScore: number;
  riskControlScore: number;
  penaltyPoints: number;
  anomalyCount: number;
  matchDurationMs: number;
}

export interface GamelordResult {
  referenceId: string;
  valid: boolean;
  mode: GamelordMode | null;
  status: GamelordStatus;
  recommendedAction: GamelordAction;
  dominanceScore: number;
  disciplineScore: number;
  stabilityScore: number;
  warnings: string[];
  durationMs: number;
  disclaimer: string;
}

export interface GamelordHealthReport {
  slug: string;
  displayName: string;
  contractVersion: string;
  moduleVersion: string;
  scope: 'standalone-game-mode';
  evaluations: number;
  lastScore: number;
  lastStatus: GamelordStatus;
  lastEvaluatedAt: string | null;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  requiredOutputs: readonly string[];
  rolloutGuardrails: readonly string[];
}

export const GAMELORD_SLUG = 'gamelord';
export const GAMELORD_DISPLAY_NAME = 'GAMES (GAMELORD)';
export const GAMELORD_CONTRACT_VERSION = 'v1';
export const GAMELORD_MODULE_VERSION = '1.0.0';
export const GAMELORD_SCOPE = 'standalone-game-mode' as const;

export const GAMELORD_MIN_SCORE = 0;
export const GAMELORD_MAX_SCORE = 100;
export const GAMELORD_MAX_PENALTY_POINTS = 100;
export const GAMELORD_MAX_ANOMALY_COUNT = 20;
export const GAMELORD_MAX_MATCH_DURATION_MS = 1800000;

export const GAMELORD_PERFORMANCE_MAX_MS = 50;
export const GAMELORD_API_RESPONSE_MAX_MS = 200;

export const GAMELORD_DISCLAIMER =
  'GAMELORD rezultat je automatska evaluacija i ne predstavlja pravni, medicinski ili bezbednosni savet.';

export const GAMELORD_REQUIRED_OUTPUTS = [
  'catalog-entry',
  'runner-compatibility',
  'api-summary',
  'analytics-fields',
  'rollout-guardrails',
] as const;

export const GAMELORD_ROLLOUT_GUARDRAILS = [
  'feature-flag-staged-rollout',
  'deterministic-evaluation-only',
  'no-secrets-in-payload',
  '422-on-invalid-domain-input',
] as const;
