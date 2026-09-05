// SpajaUltraOmegaCore -∞Ω+∞ — DELET Registry
// Kompanija SPAJA — Digitalna Industrija

import type { DeletAction, DeletObjective, DeletScope } from './types';

export const VALID_DELET_OBJECTIVES: DeletObjective[] = [
  'SOFT_DELETE',
  'HARD_DELETE',
  'ANONYMIZE',
  'RETENTION_EXPIRE',
];

export const VALID_DELET_SCOPES: DeletScope[] = ['SINGLE_RECORD', 'BATCH', 'TENANT'];

export const OBJECTIVE_BASE_RISK: Record<DeletObjective, number> = {
  SOFT_DELETE: 18,
  HARD_DELETE: 52,
  ANONYMIZE: 26,
  RETENTION_EXPIRE: 20,
};

export const OBJECTIVE_BASE_REVERSIBILITY: Record<DeletObjective, number> = {
  SOFT_DELETE: 92,
  HARD_DELETE: 14,
  ANONYMIZE: 36,
  RETENTION_EXPIRE: 70,
};

export const SCOPE_RISK_MULTIPLIER: Record<DeletScope, number> = {
  SINGLE_RECORD: 0.9,
  BATCH: 1.15,
  TENANT: 1.35,
};

export const ACTION_TARGET_WINDOW_HOURS: Record<DeletAction, number> = {
  ABORT: 0,
  REQUEST_REVIEW: 48,
  SCHEDULE_WINDOW: 72,
  EXECUTE: 12,
};
