// SpajaUltraOmegaCore -∞Ω+∞ — TRU Types
// Kompanija SPAJA — Digitalna Industrija

export const TRU_CONTRACT_VERSION = 'v1';
export const TRU_MODULE_VERSION = '1.0.0';
export const TRU_PERSONA_ID = 'tru-trust-core';
export const TRU_DISPLAY_NAME = 'TRU';
export const TRU_SLUG = 'tru';
export const TRU_OCTAVE = 7;
export const TRU_HIPERMREZA_NODE = 63;
export const TRU_MIN_SCORE = 0;
export const TRU_MAX_SCORE = 100;
export const TRU_MAX_ESCALATION_COUNT = 10;
export const TRU_MAX_RESPONSE_LATENCY_HOURS = 240;
export const TRU_PERFORMANCE_MAX_MS = 50;
export const TRU_API_RESPONSE_MAX_MS = 200;
export const TRU_LINKED_REPO_IMPACT = 'none';
export const TRU_DISCLAIMER =
  'TRU provides deterministic trust-readiness guidance and does not replace legal, financial, compliance, or emergency judgment.';

export type TruObjective = 'VERIFY' | 'ALIGN' | 'NEGOTIATE' | 'COMMIT';
export type TruChannel = 'ASYNC' | 'CALL' | 'MEETING' | 'DOC_REVIEW';
export type TruEvidenceLevel = 'NONE' | 'PARTIAL' | 'STRONG';
export type TruStatus = 'BLOCK' | 'CAUTION' | 'READY' | 'TRUSTED';
export type TruAction = 'REQUEST_EVIDENCE' | 'RUN_PILOT' | 'SCHEDULE_REVIEW' | 'PROCEED';

export interface TruInput {
  referenceId?: string;
  objective: TruObjective;
  channel: TruChannel;
  evidenceLevel: TruEvidenceLevel;
  transparencyScore: number;
  reliabilityScore: number;
  reciprocityScore: number;
  riskLevel: number;
  responseLatencyHours: number;
  escalationCount: number;
}

export interface TruResult {
  referenceId: string;
  objective: TruObjective | null;
  channel: TruChannel | null;
  evidenceLevel: TruEvidenceLevel | null;
  trustScore: number;
  readinessScore: number;
  stabilityScore: number;
  pressureScore: number;
  overallScore: number;
  status: TruStatus | null;
  recommendedAction: TruAction | null;
  recommendedReviewHours: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface TruHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: TruStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: TruObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
