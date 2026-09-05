// SpajaUltraOmegaCore -∞Ω+∞ — DUET Registry
// Kompanija SPAJA — Digitalna Industrija

import type { DuetAction, DuetEnergyMatch, DuetMode, DuetObjective } from './types';

export const VALID_DUET_OBJECTIVES: DuetObjective[] = ['CREATE', 'DELIVER', 'REPAIR', 'PERFORM'];
export const VALID_DUET_MODES: DuetMode[] = ['ASYNC', 'LIVE', 'HYBRID', 'RITUAL'];
export const VALID_DUET_ENERGY_MATCHES: DuetEnergyMatch[] = ['LOW', 'MEDIUM', 'HIGH'];

export const OBJECTIVE_BASE_BOOST: Record<DuetObjective, number> = {
  CREATE: 6,
  DELIVER: 8,
  REPAIR: 4,
  PERFORM: 10,
};

export const OBJECTIVE_TARGET_HOURS: Record<DuetObjective, number> = {
  CREATE: 24,
  DELIVER: 48,
  REPAIR: 12,
  PERFORM: 6,
};

export const MODE_BASE_SCORE: Record<DuetMode, number> = {
  ASYNC: 62,
  LIVE: 82,
  HYBRID: 80,
  RITUAL: 88,
};

export const ENERGY_MATCH_BASE_SCORE: Record<DuetEnergyMatch, number> = {
  LOW: 38,
  MEDIUM: 68,
  HIGH: 88,
};

export const ACTION_TARGET_HOURS: Record<DuetAction, number> = {
  RESET_EXPECTATIONS: 24,
  RUN_CHECKIN: 12,
  START_SESSION: 6,
  LOCK_DUET: 48,
};
