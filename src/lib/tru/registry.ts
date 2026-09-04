// SpajaUltraOmegaCore -∞Ω+∞ — TRU Registry
// Kompanija SPAJA — Digitalna Industrija

import type { TruAction, TruChannel, TruEvidenceLevel, TruObjective } from './types';

export const VALID_TRU_OBJECTIVES: TruObjective[] = ['VERIFY', 'ALIGN', 'NEGOTIATE', 'COMMIT'];
export const VALID_TRU_CHANNELS: TruChannel[] = ['ASYNC', 'CALL', 'MEETING', 'DOC_REVIEW'];
export const VALID_TRU_EVIDENCE_LEVELS: TruEvidenceLevel[] = ['NONE', 'PARTIAL', 'STRONG'];

export const OBJECTIVE_BASE_BOOST: Record<TruObjective, number> = {
  VERIFY: 4,
  ALIGN: 8,
  NEGOTIATE: 10,
  COMMIT: 12,
};

export const CHANNEL_BASE_SCORE: Record<TruChannel, number> = {
  ASYNC: 62,
  CALL: 70,
  MEETING: 82,
  DOC_REVIEW: 76,
};

export const EVIDENCE_BASE_SCORE: Record<TruEvidenceLevel, number> = {
  NONE: 24,
  PARTIAL: 58,
  STRONG: 88,
};

export const OBJECTIVE_TARGET_REVIEW_HOURS: Record<TruObjective, number> = {
  VERIFY: 48,
  ALIGN: 72,
  NEGOTIATE: 96,
  COMMIT: 120,
};

export const ACTION_REVIEW_HOURS: Record<TruAction, number> = {
  REQUEST_EVIDENCE: 72,
  RUN_PILOT: 96,
  SCHEDULE_REVIEW: 48,
  PROCEED: 24,
};
