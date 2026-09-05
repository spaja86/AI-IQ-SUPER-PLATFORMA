// SpajaUltraOmegaCore -∞Ω+∞ — DUET Types
// Kompanija SPAJA — Digitalna Industrija

export const DUET_CONTRACT_VERSION = 'v1';
export const DUET_MODULE_VERSION = '1.0.0';
export const DUET_PERSONA_ID = 'duet-sync-core';
export const DUET_DISPLAY_NAME = 'DUET';
export const DUET_SLUG = 'duet';
export const DUET_OCTAVE = 8;
export const DUET_HIPERMREZA_NODE = 66;
export const DUET_MIN_SCORE = 0;
export const DUET_MAX_SCORE = 100;
export const DUET_MAX_SHARED_WINDOW_HOURS = 168;
export const DUET_PERFORMANCE_MAX_MS = 50;
export const DUET_API_RESPONSE_MAX_MS = 200;
export const DUET_LINKED_REPO_IMPACT = 'none';
export const DUET_DISCLAIMER =
  'DUET provides deterministic two-party synchronization guidance and does not replace relationship, legal, medical, or emergency judgment.';

export type DuetObjective = 'CREATE' | 'DELIVER' | 'REPAIR' | 'PERFORM';
export type DuetMode = 'ASYNC' | 'LIVE' | 'HYBRID' | 'RITUAL';
export type DuetEnergyMatch = 'LOW' | 'MEDIUM' | 'HIGH';
export type DuetStatus = 'DISSONANT' | 'FRAGILE' | 'ALIGNED' | 'HARMONIZED';
export type DuetAction = 'RESET_EXPECTATIONS' | 'RUN_CHECKIN' | 'START_SESSION' | 'LOCK_DUET';

export interface DuetInput {
  referenceId?: string;
  objective: DuetObjective;
  mode: DuetMode;
  energyMatch: DuetEnergyMatch;
  clarityScore: number;
  reciprocityScore: number;
  trustScore: number;
  rhythmScore: number;
  tensionLevel: number;
  sharedWindowHours: number;
}

export interface DuetResult {
  referenceId: string;
  objective: DuetObjective | null;
  mode: DuetMode | null;
  energyMatch: DuetEnergyMatch | null;
  alignmentScore: number;
  resilienceScore: number;
  timingScore: number;
  harmonyScore: number;
  overallScore: number;
  status: DuetStatus;
  recommendedAction: DuetAction;
  recommendedWindowHours: number;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface DuetHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: DuetStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: DuetObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
