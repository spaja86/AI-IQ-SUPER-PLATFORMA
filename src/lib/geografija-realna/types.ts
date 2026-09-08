// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA Types
// Kompanija SPAJA — Digitalna Industrija

export const GEOGRAFIJA_REALNA_CONTRACT_VERSION = 'v1';
export const GEOGRAFIJA_REALNA_MODULE_VERSION = '1.0.0';
export const GEOGRAFIJA_REALNA_PERSONA_ID = 'geografija-realna-core';
export const GEOGRAFIJA_REALNA_DISPLAY_NAME = 'GEOGRAFIJA REALNA';
export const GEOGRAFIJA_REALNA_SLUG = 'geografija-realna';
export const GEOGRAFIJA_REALNA_OCTAVE = 10;
export const GEOGRAFIJA_REALNA_HIPERMREZA_NODE = 82;
export const GEOGRAFIJA_REALNA_MIN_SCORE = 0;
export const GEOGRAFIJA_REALNA_MAX_SCORE = 100;
export const GEOGRAFIJA_REALNA_MAX_TIME_WINDOW_HOURS = 168;
export const GEOGRAFIJA_REALNA_MAX_CONSTRAINTS = 20;
export const GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS = 50;
export const GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS = 200;
export const GEOGRAFIJA_REALNA_LINKED_REPO_IMPACT = 'none';
export const GEOGRAFIJA_REALNA_DISCLAIMER =
  'GEOGRAFIJA REALNA provides deterministic geographic guidance and does not replace official maps, legal regulations, or emergency instructions.';

export type GeografijaRealnaObjective =
  | 'LEARNING'
  | 'NAVIGATION'
  | 'ANALYSIS'
  | 'PLANNING';

export type GeografijaRealnaRegionScale =
  | 'LOCAL'
  | 'REGIONAL'
  | 'GLOBAL';

export type GeografijaRealnaTerrainComplexity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export type GeografijaRealnaStatus =
  | 'UNSTABLE'
  | 'VIABLE'
  | 'PRECISE'
  | 'ATLAS_READY';

export type GeografijaRealnaAction =
  | 'REFINE_DATA'
  | 'ADD_CONTEXT'
  | 'RUN_SCENARIOS'
  | 'EXECUTE_PLAN';

export interface GeografijaRealnaInput {
  referenceId?: string;
  objective: GeografijaRealnaObjective;
  regionScale: GeografijaRealnaRegionScale;
  terrainComplexity: GeografijaRealnaTerrainComplexity;
  accuracyScore: number;
  contextScore: number;
  dataFreshnessScore: number;
  riskScore: number;
  timeWindowHours: number;
  constraintsCount: number;
}

export interface GeografijaRealnaResult {
  referenceId: string;
  objective: GeografijaRealnaObjective | null;
  regionScale: GeografijaRealnaRegionScale | null;
  terrainComplexity: GeografijaRealnaTerrainComplexity | null;
  realismScore: number;
  clarityScore: number;
  feasibilityScore: number;
  resilienceScore: number;
  overallScore: number;
  status: GeografijaRealnaStatus;
  recommendedAction: GeografijaRealnaAction;
  recommendedWindowHours: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface GeografijaRealnaHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: GeografijaRealnaStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: GeografijaRealnaObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
