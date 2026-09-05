// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT Types
// Kompanija SPAJA — Digitalna Industrija

export const TRIKOT_CONTRACT_VERSION = 'v1';
export const TRIKOT_MODULE_VERSION = '1.0.0';
export const TRIKOT_PERSONA_ID = 'trikot-style-core';
export const TRIKOT_DISPLAY_NAME = 'TRIKOT';
export const TRIKOT_SLUG = 'trikot';
export const TRIKOT_OCTAVE = 6;
export const TRIKOT_HIPERMREZA_NODE = 54;
export const TRIKOT_MIN_SCORE = 0;
export const TRIKOT_MAX_SCORE = 100;
export const TRIKOT_MAX_PREP_TIME_HOURS = 168;
export const TRIKOT_MAX_ACCESSORY_COMPLEXITY = 10;
export const TRIKOT_PERFORMANCE_MAX_MS = 50;
export const TRIKOT_API_RESPONSE_MAX_MS = 200;
export const TRIKOT_LINKED_REPO_IMPACT = 'none';
export const TRIKOT_DISCLAIMER =
  'TRIKOT provides deterministic outfit-readiness guidance and does not replace medical, legal, financial, or safety judgment.';

export type TrikotObjective = 'CASUAL' | 'BUSINESS' | 'SPORT' | 'FORMAL';
export type TrikotSeason = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
export type TrikotDressCode = 'RELAXED' | 'SMART' | 'STRICT';
export type TrikotStatus = 'REWORK' | 'ADJUST' | 'READY' | 'PRIME';
export type TrikotAction = 'CHANGE_BASE_LAYER' | 'SIMPLIFY_LOOK' | 'VALIDATE_DETAILS' | 'LOCK_COMBINATION';

export interface TrikotInput {
  referenceId?: string;
  objective: TrikotObjective;
  season: TrikotSeason;
  dressCode: TrikotDressCode;
  comfortScore: number;
  weatherFitScore: number;
  budgetFitScore: number;
  mobilityScore: number;
  maintenanceRisk: number;
  prepTimeHours: number;
  accessoryComplexity: number;
}

export interface TrikotResult {
  referenceId: string;
  objective: TrikotObjective | null;
  season: TrikotSeason | null;
  dressCode: TrikotDressCode | null;
  styleScore: number;
  practicalityScore: number;
  readinessScore: number;
  durabilityScore: number;
  overallScore: number;
  status: TrikotStatus | null;
  recommendedAction: TrikotAction | null;
  recommendedReviewHours: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
  rawObjective?: unknown;
  rawSeason?: unknown;
  rawDressCode?: unknown;
}

export interface TrikotHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: TrikotStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: TrikotObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
