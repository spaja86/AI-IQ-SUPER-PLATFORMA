// SpajaUltraOmegaCore -∞Ω+∞ — KULKON Types
// Kompanija SPAJA — Digitalna Industrija

export const KULKON_CONTRACT_VERSION = 'v1';
export const KULKON_MODULE_VERSION = '1.0.0';
export const KULKON_PERSONA_ID = 'kulkon-core';
export const KULKON_DISPLAY_NAME = 'KULKON';
export const KULKON_SLUG = 'kulkon';
export const KULKON_OCTAVE = 7;
export const KULKON_HIPERMREZA_NODE = 59;
export const KULKON_MIN_SCORE = 0;
export const KULKON_MAX_SCORE = 100;
export const KULKON_MAX_PARTICIPANTS = 50;
export const KULKON_MAX_WINDOW_DAYS = 90;
export const KULKON_PERFORMANCE_MAX_MS = 50;
export const KULKON_API_RESPONSE_MAX_MS = 200;
export const KULKON_LINKED_REPO_IMPACT = 'none';
export const KULKON_DISCLAIMER =
  'KULKON provides deterministic collaboration-culture guidance and does not replace legal, HR, financial, or emergency judgment.';

export type KulkonObjective = 'ALIGNMENT' | 'ONBOARDING' | 'RETENTION' | 'CONFLICT_RESET';
export type KulkonEnvironment = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type KulkonRhythm = 'ADHOC' | 'WEEKLY' | 'DAILY';
export type KulkonStatus = 'FRAGILE' | 'STABLE' | 'COHESIVE' | 'EXEMPLARY';
export type KulkonAction = 'CLARIFY_NORMS' | 'SCHEDULE_RITUAL' | 'RUN_RETRO' | 'SCALE_PLAYBOOK';

export interface KulkonInput {
  referenceId?: string;
  objective: KulkonObjective;
  environment: KulkonEnvironment;
  rhythm: KulkonRhythm;
  clarityScore: number;
  trustScore: number;
  accountabilityScore: number;
  communicationLoad: number;
  conflictRate: number;
  participantCount: number;
  windowDays: number;
}

export interface KulkonResult {
  referenceId: string;
  objective: KulkonObjective | null;
  environment: KulkonEnvironment | null;
  rhythm: KulkonRhythm | null;
  cohesionScore: number;
  resilienceScore: number;
  cadenceScore: number;
  pressureScore: number;
  overallScore: number;
  status: KulkonStatus;
  recommendedAction: KulkonAction;
  recommendedWindowDays: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface KulkonHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: KulkonStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: KulkonObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
