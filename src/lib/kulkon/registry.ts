// SpajaUltraOmegaCore -∞Ω+∞ — KULKON Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  KulkonAction,
  KulkonEnvironment,
  KulkonObjective,
  KulkonRhythm,
} from './types';

export const VALID_KULKON_OBJECTIVES: KulkonObjective[] = [
  'ALIGNMENT',
  'ONBOARDING',
  'RETENTION',
  'CONFLICT_RESET',
];

export const VALID_KULKON_ENVIRONMENTS: KulkonEnvironment[] = ['REMOTE', 'HYBRID', 'ONSITE'];

export const VALID_KULKON_RHYTHMS: KulkonRhythm[] = ['ADHOC', 'WEEKLY', 'DAILY'];

export const OBJECTIVE_BOOST: Record<KulkonObjective, number> = {
  ALIGNMENT: 8,
  ONBOARDING: 4,
  RETENTION: 10,
  CONFLICT_RESET: 6,
};

export const ENVIRONMENT_BASE: Record<KulkonEnvironment, number> = {
  REMOTE: 66,
  HYBRID: 74,
  ONSITE: 70,
};

export const RHYTHM_BASE: Record<KulkonRhythm, number> = {
  ADHOC: 52,
  WEEKLY: 74,
  DAILY: 80,
};

export const OBJECTIVE_TARGET_DAYS: Record<KulkonObjective, number> = {
  ALIGNMENT: 14,
  ONBOARDING: 21,
  RETENTION: 30,
  CONFLICT_RESET: 10,
};

export const ACTION_TARGET_DAYS: Record<KulkonAction, number> = {
  CLARIFY_NORMS: 14,
  SCHEDULE_RITUAL: 21,
  RUN_RETRO: 10,
  SCALE_PLAYBOOK: 30,
};
