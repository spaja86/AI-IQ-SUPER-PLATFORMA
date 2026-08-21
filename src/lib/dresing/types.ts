// SpajaUltraOmegaCore -∞Ω+∞ — DRESING
// Kompanija SPAJA — Digitalna Industrija

export type DresingOccasion =
  | 'business'
  | 'casual'
  | 'sport'
  | 'formal'
  | 'beach'
  | 'outdoor'
  | 'evening';

export type DresingStyle =
  | 'classic'
  | 'minimalist'
  | 'sporty'
  | 'bohemian'
  | 'streetwear'
  | 'neutral';

export type DresscodeStatus =
  | 'PERFECT_FIT'
  | 'APPROPRIATE'
  | 'ACCEPTABLE'
  | 'NEEDS_ADJUSTMENT'
  | 'MISMATCH';

export interface DresingInput {
  referenceId?: string;
  occasion: DresingOccasion;
  /** Temperature in Celsius */
  weatherTempC: number;
  /** Wind speed in km/h */
  windSpeedKmh: number;
  /** Precipitation 0–100 (%) */
  precipitation: number;
  /** Formality level 0–10 (0 = ultra casual, 10 = black tie) */
  formalityLevel: number;
  colorPalette: string[];
  preferredStyle: DresingStyle;
}

export interface DresingResult {
  referenceId: string;
  fitScore: number;
  dresscodeStatus: DresscodeStatus;
  recommendations: string[];
  weatherAdaptation: string;
  styleCoherence: number;
  valid: boolean;
  warnings: string[];
  durationMs: number;
  disclaimer: string;
}

export interface DresingHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastFitScore: number;
  lastStatus: DresscodeStatus;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const DRESING_CONTRACT_VERSION = 'v1';
export const DRESING_MODULE_VERSION = '1.0.0';
export const DRESING_PERSONA_ID = 'dresing-core';
export const DRESING_PERFORMANCE_MAX_MS = 50;
export const DRESING_API_RESPONSE_MAX_MS = 200;
export const DRESING_DISCLAIMER =
  'Dresing preporuke su automatski generisane i služe kao smernica. Finalna odluka je uvek na korisniku.';
