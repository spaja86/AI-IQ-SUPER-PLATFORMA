// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING
// Kompanija SPAJA — Digitalna Industrija

export type SwimingStrokeType =
  | 'freestyle'
  | 'breaststroke'
  | 'backstroke'
  | 'butterfly'
  | 'medley';

export type SwimingFitnessLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type SwimingIntensity = 'RECOVERY' | 'AEROBIC' | 'THRESHOLD' | 'SPRINT';

export interface SwimingInput {
  referenceId?: string;
  strokeType: SwimingStrokeType;
  /** Duration in minutes */
  sessionDurationMin: number;
  /** Pool length in meters */
  poolLengthM: number;
  /** Resting heart rate in bpm */
  restingHeartRate: number;
  /** Water temperature in Celsius */
  waterTempC: number;
  fitnessLevel: SwimingFitnessLevel;
}

export interface SwimingResult {
  referenceId: string;
  readinessScore: number;
  intensityRecommendation: SwimingIntensity;
  estimatedCalories: number;
  hydrationAlert: boolean;
  safetyAlerts: string[];
  valid: boolean;
  warnings: string[];
  durationMs: number;
  disclaimer: string;
}

export interface SwimingHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastReadinessScore: number;
  lastIntensity: SwimingIntensity;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const SWIMING_CONTRACT_VERSION = 'v1';
export const SWIMING_MODULE_VERSION = '1.0.0';
export const SWIMING_PERSONA_ID = 'swiming-core';
export const SWIMING_PERFORMANCE_MAX_MS = 50;
export const SWIMING_API_RESPONSE_MAX_MS = 200;
export const SWIMING_MAX_DURATION_MIN = 180;
export const SWIMING_DISCLAIMER =
  'Swiming rezultati su informativni. Konsultujte stručnog trenera pre intenzivnih sesija.';
