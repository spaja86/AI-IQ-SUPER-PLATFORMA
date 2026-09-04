// SpajaUltraOmegaCore -∞Ω+∞ — ÐUMBIR Types
// Kompanija SPAJA — Digitalna Industrija

export const DUMBIR_CONTRACT_VERSION = 'v1';
export const DUMBIR_MODULE_VERSION = '1.0.0';
export const DUMBIR_PERSONA_ID = 'dumbir-wellness-core';
export const DUMBIR_DISPLAY_NAME = 'ÐUMBIR';
export const DUMBIR_SLUG = 'dumbir';
export const DUMBIR_OCTAVE = 12;
export const DUMBIR_HIPERMREZA_NODE = 96;
export const DUMBIR_MIN_SCORE = 0;
export const DUMBIR_MAX_SCORE = 100;
export const DUMBIR_MAX_GINGER_GRAMS = 120;
export const DUMBIR_MAX_WATER_ML = 2000;
export const DUMBIR_MAX_STEEP_MINUTES = 60;
export const DUMBIR_MAX_SERVINGS = 12;
export const DUMBIR_PERFORMANCE_MAX_MS = 50;
export const DUMBIR_API_RESPONSE_MAX_MS = 200;
export const DUMBIR_LINKED_REPO_IMPACT = 'documentation-only';
export const DUMBIR_DISCLAIMER =
  'ÐUMBIR provides deterministic ginger-wellness guidance and does not replace medical, nutritional, or emergency advice.';

export type DumbirGoal = 'DIGESTION' | 'IMMUNITY' | 'FOCUS' | 'RECOVERY';
export type DumbirSensitivity = 'LOW' | 'MEDIUM' | 'HIGH';
export type DumbirPreparation = 'TEA' | 'SHOT' | 'TONIC' | 'MEAL';
export type DumbirAddon = 'LEMON' | 'HONEY' | 'MINT' | 'TURMERIC';
export type DumbirStatus = 'LIGHT' | 'BALANCED' | 'BOOSTED' | 'INTENSE';

export interface DumbirInput {
  referenceId?: string;
  goal: DumbirGoal;
  sensitivity: DumbirSensitivity;
  preparation: DumbirPreparation;
  gingerGrams: number;
  waterMl: number;
  steepMinutes: number;
  servings?: number;
  addons?: DumbirAddon[];
}

export interface DumbirResult {
  referenceId: string;
  goal: DumbirGoal;
  preparation: DumbirPreparation;
  potencyScore: number;
  comfortScore: number;
  goalFitScore: number;
  balanceScore: number;
  status: DumbirStatus;
  recommendedServingMl: number;
  recommendedAddons: DumbirAddon[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface DumbirHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: DumbirStatus;
  lastEvaluatedAt: string | null;
  supportedAddons: DumbirAddon[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
