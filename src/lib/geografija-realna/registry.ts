// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  GeografijaRealnaAction,
  GeografijaRealnaObjective,
  GeografijaRealnaRegionScale,
  GeografijaRealnaTerrainComplexity,
} from './types';

export const VALID_GEOGRAFIJA_REALNA_OBJECTIVES: GeografijaRealnaObjective[] = [
  'LEARNING',
  'NAVIGATION',
  'ANALYSIS',
  'PLANNING',
];

export const VALID_GEOGRAFIJA_REALNA_REGION_SCALES: GeografijaRealnaRegionScale[] = [
  'LOCAL',
  'REGIONAL',
  'GLOBAL',
];

export const VALID_GEOGRAFIJA_REALNA_TERRAIN_COMPLEXITIES: GeografijaRealnaTerrainComplexity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

export const OBJECTIVE_BOOST: Record<GeografijaRealnaObjective, number> = {
  LEARNING: 4,
  NAVIGATION: 8,
  ANALYSIS: 9,
  PLANNING: 7,
};

export const REGION_BASE: Record<GeografijaRealnaRegionScale, number> = {
  LOCAL: 80,
  REGIONAL: 72,
  GLOBAL: 66,
};

export const TERRAIN_BASE: Record<GeografijaRealnaTerrainComplexity, number> = {
  LOW: 82,
  MEDIUM: 74,
  HIGH: 64,
};

export const OBJECTIVE_TARGET_HOURS: Record<GeografijaRealnaObjective, number> = {
  LEARNING: 72,
  NAVIGATION: 12,
  ANALYSIS: 48,
  PLANNING: 96,
};

export const ACTION_TARGET_HOURS: Record<GeografijaRealnaAction, number> = {
  REFINE_DATA: 24,
  ADD_CONTEXT: 48,
  RUN_SCENARIOS: 72,
  EXECUTE_PLAN: 12,
};
