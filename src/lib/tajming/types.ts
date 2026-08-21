// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING
// Kompanija SPAJA — Digitalna Industrija

export type TajmingActivity =
  | 'physical'
  | 'cognitive'
  | 'creative'
  | 'social'
  | 'administrative';

export type TajmingStatus =
  | 'OPTIMAL_WINDOW'
  | 'GOOD_WINDOW'
  | 'NEUTRAL'
  | 'SUBOPTIMAL'
  | 'AVOID';

export interface TajmingInput {
  referenceId?: string;
  activity: TajmingActivity;
  /** Hour of day 0–23 */
  timeOfDay: number;
  /** Energy level 0–100 */
  energyLevel: number;
  /** ISO timestamp or undefined */
  deadline?: string;
}

export interface TajmingResult {
  referenceId: string;
  timingScore: number;
  status: TajmingStatus;
  optimalWindow: string;
  recommendation: string;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

export interface TajmingHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastTimingScore: number;
  lastStatus: TajmingStatus;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const TAJMING_CONTRACT_VERSION = 'v1';
export const TAJMING_MODULE_VERSION = '1.0.0';
export const TAJMING_PERSONA_ID = 'tajming-core';
export const TAJMING_PERFORMANCE_MAX_MS = 50;
export const TAJMING_API_RESPONSE_MAX_MS = 200;
