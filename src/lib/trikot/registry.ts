// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  TrikotAction,
  TrikotDressCode,
  TrikotObjective,
  TrikotSeason,
} from './types';

export const VALID_TRIKOT_OBJECTIVES: TrikotObjective[] = ['CASUAL', 'BUSINESS', 'SPORT', 'FORMAL'];
export const VALID_TRIKOT_SEASONS: TrikotSeason[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
export const VALID_TRIKOT_DRESS_CODES: TrikotDressCode[] = ['RELAXED', 'SMART', 'STRICT'];

export const OBJECTIVE_BASE_SCORE: Record<TrikotObjective, number> = {
  CASUAL: 64,
  BUSINESS: 72,
  SPORT: 70,
  FORMAL: 80,
};

export const SEASON_BASE_SCORE: Record<TrikotSeason, number> = {
  SPRING: 72,
  SUMMER: 74,
  AUTUMN: 70,
  WINTER: 68,
};

export const DRESS_CODE_BASE_SCORE: Record<TrikotDressCode, number> = {
  RELAXED: 64,
  SMART: 76,
  STRICT: 82,
};

export const OBJECTIVE_TARGET_PREP_HOURS: Record<TrikotObjective, number> = {
  CASUAL: 2,
  BUSINESS: 6,
  SPORT: 3,
  FORMAL: 8,
};

export const ACTION_REVIEW_HOURS: Record<TrikotAction, number> = {
  CHANGE_BASE_LAYER: 12,
  SIMPLIFY_LOOK: 8,
  VALIDATE_DETAILS: 6,
  LOCK_COMBINATION: 24,
};
