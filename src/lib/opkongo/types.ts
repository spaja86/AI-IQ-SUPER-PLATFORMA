// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO Types
// Kompanija SPAJA — Digitalna Industrija

export const OPKONGO_CONTRACT_VERSION = 'v1';
export const OPKONGO_MODULE_VERSION = '1.0.0';
export const OPKONGO_PERSONA_ID = 'opkongo-commit-core';
export const OPKONGO_DISPLAY_NAME = 'OPKONGO';
export const OPKONGO_SLUG = 'opkongo';
export const OPKONGO_OCTAVE = 8;
export const OPKONGO_HIPERMREZA_NODE = 65;
export const OPKONGO_MIN_SCORE = 0;
export const OPKONGO_MAX_SCORE = 100;
export const OPKONGO_MAX_FOLLOW_UP_COUNT = 12;
export const OPKONGO_MAX_TIME_WINDOW_HOURS = 168;
export const OPKONGO_PERFORMANCE_MAX_MS = 50;
export const OPKONGO_API_RESPONSE_MAX_MS = 200;
export const OPKONGO_LINKED_REPO_IMPACT = 'none';
export const OPKONGO_DISCLAIMER =
  'OPKONGO provides deterministic opportunity-progression guidance and does not replace legal, financial, sales, or emergency judgment.';

export type OpkongoObjective = 'OUTREACH' | 'NEGOTIATION' | 'FOLLOW_UP' | 'CLOSING';
export type OpkongoChannel = 'EMAIL' | 'CALL' | 'MEETING' | 'ASYNC';
export type OpkongoRelationshipTemperature = 'COLD' | 'WARM' | 'HOT';
export type OpkongoStatus = 'HOLD' | 'PREP' | 'ENGAGE' | 'COMMIT';
export type OpkongoAction = 'REFINE_BRIEF' | 'SEND_OUTREACH' | 'BOOK_CALL' | 'CLOSE_NEXT_STEP';

export interface OpkongoInput {
  referenceId?: string;
  objective: OpkongoObjective;
  channel: OpkongoChannel;
  relationshipTemperature: OpkongoRelationshipTemperature;
  clarityScore: number;
  leverageScore: number;
  trustScore: number;
  urgencyLevel: number;
  followUpCount: number;
  timeWindowHours: number;
}

export interface OpkongoResult {
  referenceId: string;
  objective: OpkongoObjective | null;
  channel: OpkongoChannel | null;
  relationshipTemperature: OpkongoRelationshipTemperature | null;
  readinessScore: number;
  alignmentScore: number;
  timingScore: number;
  pressureScore: number;
  overallScore: number;
  status: OpkongoStatus;
  recommendedAction: OpkongoAction;
  recommendedWindowHours: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface OpkongoHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: OpkongoStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: OpkongoObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
