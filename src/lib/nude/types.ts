// SpajaUltraOmegaCore -∞Ω+∞ — NUDE Types
// Kompanija SPAJA — Digitalna Industrija

export const NUDE_CONTRACT_VERSION = 'v1';
export const NUDE_MODULE_VERSION = '1.0.0';
export const NUDE_PERSONA_ID = 'nude-balance-core';
export const NUDE_DISPLAY_NAME = 'NUDE';
export const NUDE_SLUG = 'nude';
export const NUDE_OCTAVE = 8;
export const NUDE_HIPERMREZA_NODE = 65;
export const NUDE_MIN_SCORE = 0;
export const NUDE_MAX_SCORE = 100;
export const NUDE_MAX_SESSION_MINUTES = 240;
export const NUDE_MAX_CONTEXT_LOAD = 100;
export const NUDE_MAX_STRESS_LEVEL = 100;
export const NUDE_PERFORMANCE_MAX_MS = 50;
export const NUDE_API_RESPONSE_MAX_MS = 200;
export const NUDE_LINKED_REPO_IMPACT = 'documentation-only';
export const NUDE_DISCLAIMER =
  'NUDE provides deterministic wellbeing-readiness guidance and does not replace medical, legal, or emergency advice.';

export type NudeMode = 'RESET' | 'FOCUS' | 'RECOVERY' | 'SOCIAL';
export type NudeEnvironment = 'HOME' | 'WORK' | 'TRANSIT' | 'OUTDOOR';
export type NudePriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type NudeStatus = 'CALM' | 'BALANCED' | 'OVERLOADED' | 'CRITICAL';

export interface NudeInput {
  referenceId?: string;
  mode: NudeMode;
  environment: NudeEnvironment;
  priority: NudePriority;
  stressLevel: number;
  contextLoad: number;
  sessionMinutes: number;
  breaksTaken?: number;
}

export interface NudeResult {
  referenceId: string;
  mode: NudeMode;
  environment: NudeEnvironment;
  regulationScore: number;
  clarityScore: number;
  recoveryScore: number;
  readinessScore: number;
  status: NudeStatus;
  recommendedBreakMinutes: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface NudeHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: NudeStatus;
  lastEvaluatedAt: string | null;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
