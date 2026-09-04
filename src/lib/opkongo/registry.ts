// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO Registry
// Kompanija SPAJA — Digitalna Industrija

import type {
  OpkongoAction,
  OpkongoChannel,
  OpkongoObjective,
  OpkongoRelationshipTemperature,
} from './types';

export const VALID_OPKONGO_OBJECTIVES: OpkongoObjective[] = ['OUTREACH', 'NEGOTIATION', 'FOLLOW_UP', 'CLOSING'];
export const VALID_OPKONGO_CHANNELS: OpkongoChannel[] = ['EMAIL', 'CALL', 'MEETING', 'ASYNC'];
export const VALID_OPKONGO_RELATIONSHIP_TEMPERATURES: OpkongoRelationshipTemperature[] = ['COLD', 'WARM', 'HOT'];

export const OBJECTIVE_BASE_BOOST: Record<OpkongoObjective, number> = {
  OUTREACH: 4,
  NEGOTIATION: 8,
  FOLLOW_UP: 6,
  CLOSING: 10,
};

export const OBJECTIVE_TARGET_HOURS: Record<OpkongoObjective, number> = {
  OUTREACH: 12,
  NEGOTIATION: 48,
  FOLLOW_UP: 24,
  CLOSING: 72,
};

export const CHANNEL_BASE_SCORE: Record<OpkongoChannel, number> = {
  EMAIL: 72,
  CALL: 68,
  MEETING: 82,
  ASYNC: 64,
};

export const TEMPERATURE_BASE_SCORE: Record<OpkongoRelationshipTemperature, number> = {
  COLD: 42,
  WARM: 70,
  HOT: 88,
};

export const ACTION_TARGET_HOURS: Record<OpkongoAction, number> = {
  REFINE_BRIEF: 24,
  SEND_OUTREACH: 12,
  BOOK_CALL: 48,
  CLOSE_NEXT_STEP: 72,
};
