// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL Types
// Kompanija SPAJA — Digitalna Industrija

export const AKTIVITI_ALL_CONTRACT_VERSION = 'v1';
export const AKTIVITI_ALL_MODULE_VERSION = '1.0.0';
export const AKTIVITI_ALL_PERSONA_ID = 'aktiviti-all-core';
export const AKTIVITI_ALL_DISPLAY_NAME = 'AKTIVITI ALL';
export const AKTIVITI_ALL_SLUG = 'aktiviti-all';
export const AKTIVITI_ALL_PERFORMANCE_MAX_MS = 50;
export const AKTIVITI_ALL_API_RESPONSE_MAX_MS = 200;
export const AKTIVITI_ALL_MAX_DURATION_MINUTES = 300;
export const AKTIVITI_ALL_LINKED_REPO_IMPACT = 'none';
export const AKTIVITI_ALL_DISCLAIMER =
  'AKTIVITI ALL provides deterministic activity-readiness guidance and does not replace medical, legal, safety, or emergency decisions.';

export type AktivitiAllActivity = 'FOCUS' | 'FITNESS' | 'LEARNING' | 'SOCIAL' | 'RECOVERY';
export type AktivitiAllStatus = 'READY' | 'STEADY' | 'RECOVER' | 'BLOCKED';

export interface AktivitiAllInput {
  referenceId?: string;
  activity: AktivitiAllActivity;
  durationMinutes: number;
  energyLevel: number;
  focusLevel: number;
  stressLevel: number;
  completionRate: number;
}

export interface AktivitiAllResult {
  referenceId: string;
  activity: AktivitiAllActivity | null;
  readinessScore: number;
  status: AktivitiAllStatus;
  recommendation: string;
  warnings: string[];
  valid: boolean;
  durationMs: number;
  disclaimer: string;
}

export interface AktivitiAllHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: AktivitiAllStatus | null;
  lastReadinessScore: number;
  lastEvaluatedAt: string | null;
  supportedActivities: AktivitiAllActivity[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
