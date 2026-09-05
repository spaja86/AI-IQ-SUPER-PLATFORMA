// SpajaUltraOmegaCore -∞Ω+∞ — DELET Types
// Kompanija SPAJA — Digitalna Industrija

export const DELET_CONTRACT_VERSION = 'v1';
export const DELET_MODULE_VERSION = '1.0.0';
export const DELET_PERSONA_ID = 'delet-governance-core';
export const DELET_DISPLAY_NAME = 'DELET';
export const DELET_SLUG = 'delet';
export const DELET_OCTAVE = 6;
export const DELET_HIPERMREZA_NODE = 52;
export const DELET_MIN_SCORE = 0;
export const DELET_MAX_SCORE = 100;
export const DELET_MAX_RETENTION_AGE_DAYS = 3650;
export const DELET_MAX_RECOVERY_WINDOW_HOURS = 720;
export const DELET_MAX_DEPENDENCY_COUNT = 1000;
export const DELET_PERFORMANCE_MAX_MS = 50;
export const DELET_API_RESPONSE_MAX_MS = 200;
export const DELET_LINKED_REPO_IMPACT = 'none';
export const DELET_DISCLAIMER =
  'DELET provides deterministic deletion-readiness guidance and does not replace legal, compliance, privacy, or incident-response judgment.';

export type DeletObjective = 'SOFT_DELETE' | 'HARD_DELETE' | 'ANONYMIZE' | 'RETENTION_EXPIRE';
export type DeletScope = 'SINGLE_RECORD' | 'BATCH' | 'TENANT';
export type DeletStatus = 'BLOCK' | 'REVIEW' | 'APPROVE' | 'AUTO_APPROVE';
export type DeletAction = 'ABORT' | 'REQUEST_REVIEW' | 'SCHEDULE_WINDOW' | 'EXECUTE';

export interface DeletInput {
  referenceId?: string;
  objective: DeletObjective;
  scope: DeletScope;
  dataSensitivityScore: number;
  retentionAgeDays: number;
  recoveryWindowHours: number;
  dependencyCount: number;
  backupCoverageScore: number;
  legalHoldActive: boolean;
}

export interface DeletResult {
  referenceId: string;
  objective: DeletObjective | null;
  scope: DeletScope | null;
  safetyScore: number;
  complianceScore: number;
  reversibilityScore: number;
  riskScore: number;
  overallScore: number;
  status: DeletStatus | null;
  recommendedAction: DeletAction | null;
  recommendedWindowHours: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface DeletHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: DeletStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: DeletObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
