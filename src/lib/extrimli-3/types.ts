// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI 3
// Kompanija SPAJA — Digitalna Industrija

import type { RawWeatherData, RiskLevel, SportCategory } from '../extrimli';

export interface SportRiskProfile {
  sportId: string;
  category: SportCategory;
  sportMultiplier: number;
  minimumExperience: number;
  riskBias: number;
  experienceWeight: number;
  weatherWeight: number;
  terrainWeight: number;
  gearWeight: number;
  requiredWeatherData: boolean;
  focus: 'weather' | 'terrain' | 'experience' | 'gear';
}

export interface AthleteProgressSnapshot {
  athleteId: string;
  sportId: string;
  sessionCount: number;
  recentSessionCount: number;
  improvementRate: number;
  consistencyScore: number;
  readinessScore: number;
  warnings: string[];
}

export interface Extrimli3RiskInput {
  sportId: string;
  athleteExperience: number;
  terrainDifficulty: number;
  gearQualityIndex: number;
  athleteId?: string;
  weatherData?: RawWeatherData;
  referenceId?: string;
}

export interface Extrimli3RiskBreakdown {
  experienceRisk: number;
  weatherRisk: number;
  terrainRisk: number;
  gearRisk: number;
  weightedBaseScore: number;
  profileAdjustedScore: number;
}

export interface Extrimli3RiskResult {
  referenceId: string;
  sportId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: string;
  valid: boolean;
  warnings: string[];
  blockers: string[];
  durationMs: number;
  readinessScore: number;
  breakdown: Extrimli3RiskBreakdown;
  athleteProgress: AthleteProgressSnapshot | null;
  weatherRiskFactors: {
    windRiskModifier: number;
    terrainRiskModifier: number;
    overallWeatherScore: number;
    gearRecommendation: string;
    valid: boolean;
    warnings: string[];
  };
  sportProfile: SportRiskProfile;
}

export interface Extrimli3HealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  profileCount: number;
  riskEvaluations: number;
  lastRiskScore: number;
  lastRiskLevel: RiskLevel;
  lastReadinessScore: number;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const EXTRIMLI3_CONTRACT_VERSION = 'v3';
export const EXTRIMLI3_MODULE_VERSION = '3.0.0';
export const EXTRIMLI3_PERSONA_ID = 'extrimli-core';
export const EXTRIMLI3_PERFORMANCE_MAX_MS = 50;
export const EXTRIMLI3_API_RESPONSE_MAX_MS = 200;
