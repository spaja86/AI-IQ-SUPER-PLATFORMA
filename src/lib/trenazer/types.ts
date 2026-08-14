// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER
// Kompanija SPAJA — Digitalna Industrija

export type TrenazerGoal = 'ENDURANCE' | 'STRENGTH' | 'RECOVERY' | 'BALANCE';
export type TrenazerExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type TrenazerReadiness = 'RECOVERY' | 'MODERATE' | 'INTENSIVE';
export type TrenazerRecommendedIntensity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TrenazerProfileInput {
  traineeId?: string;
  goal: TrenazerGoal;
  experienceLevel: TrenazerExperienceLevel;
}

export interface TrenazerMetricsInput {
  energy: number;
  focus: number;
  soreness: number;
  stress: number;
  sleepHours: number;
  availableMinutes: number;
}

export interface TrenazerInput {
  referenceId?: string;
  profile: TrenazerProfileInput;
  metrics: TrenazerMetricsInput;
}

export interface TrenazerResult {
  referenceId: string;
  traineeId: string;
  readinessScore: number;
  readiness: TrenazerReadiness;
  recommendedIntensity: TrenazerRecommendedIntensity;
  recommendedDurationMinutes: number;
  focusAreas: string[];
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

export interface TrenazerHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastReadinessScore: number;
  lastReadiness: TrenazerReadiness;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const TRENAZER_CONTRACT_VERSION = 'v1';
export const TRENAZER_MODULE_VERSION = '1.0.0';
export const TRENAZER_PERSONA_ID = 'trenazer-coach-core';
export const TRENAZER_PERFORMANCE_MAX_MS = 50;
export const TRENAZER_API_RESPONSE_MAX_MS = 200;
export const TRENAZER_MAX_AVAILABLE_MINUTES = 300;
