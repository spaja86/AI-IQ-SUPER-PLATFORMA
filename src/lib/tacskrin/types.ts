// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN Types
// Kompanija SPAJA — Digitalna Industrija

export const TACSKRIN_CONTRACT_VERSION = 'v1';
export const TACSKRIN_MODULE_VERSION = '1.0.0';
export const TACSKRIN_PERSONA_ID = 'tacskrin-core';
export const TACSKRIN_DISPLAY_NAME = 'TAČSKRIN';
export const TACSKRIN_SLUG = 'tacskrin';
export const TACSKRIN_OCTAVE = 10;
export const TACSKRIN_HIPERMREZA_NODE = 85;
export const TACSKRIN_PERFORMANCE_MAX_MS = 50;
export const TACSKRIN_API_RESPONSE_MAX_MS = 200;
export const TACSKRIN_LINKED_REPO_IMPACT = 'none';
export const TACSKRIN_MIN_SIGNAL_STRENGTH = 0;
export const TACSKRIN_MAX_SIGNAL_STRENGTH = 100;
export const TACSKRIN_DISCLAIMER =
  'TAČSKRIN daje determinističku procenu ekvivalentnosti signala i ne predstavlja pravni, medicinski, finansijski niti bezbednosni savet.';

export type TacskrinStatus = 'INVALID' | 'NEPOZNATO' | 'ODSTUPANJE' | 'EKVIVALENTNA';

export type TacskrinAction =
  | 'ISPRAVI_FORMAT'
  | 'VALIDIRAJ_POZNATE_SLOJEVE'
  | 'USKLADI_REDOSLED'
  | 'POTVRDI_PROJEKCIJU';

export interface TacskrinInput {
  referenceId?: string;
  projectionExpression?: string;
  layers?: string[];
  signalStrength?: number;
  strictOrder?: boolean;
}

export interface TacskrinResult {
  referenceId: string;
  projectionExpression: string | null;
  normalizedLayers: string[];
  equivalent: boolean;
  status: TacskrinStatus;
  recommendedAction: TacskrinAction;
  strictOrderApplied: boolean;
  orderMatch: boolean;
  signalStrength: number;
  matchRatio: number;
  missingLayers: string[];
  extraLayers: string[];
  unknownLayers: string[];
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface TacskrinHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: TacskrinStatus | null;
  lastEvaluatedAt: string | null;
  officialLayerCount: number;
  officialUniqueLayerCount: number;
  strictOrderDefault: boolean;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
