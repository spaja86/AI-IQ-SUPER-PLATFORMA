// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET Types
// Kompanija SPAJA — Digitalna Industrija

export const PROSPARITET_CONTRACT_VERSION = 'v1';
export const PROSPARITET_MODULE_VERSION = '1.0.0';
export const PROSPARITET_PERSONA_ID = 'prosparitet-core';
export const PROSPARITET_DISPLAY_NAME = 'PROSPARITET';
export const PROSPARITET_SLUG = 'prosparitet';
export const PROSPARITET_OCTAVE = 9;
export const PROSPARITET_HIPERMREZA_NODE = 73;
export const PROSPARITET_MIN_SCORE = 0;
export const PROSPARITET_MAX_SCORE = 100;
export const PROSPARITET_MAX_HORIZON_MONTHS = 120;
export const PROSPARITET_PERFORMANCE_MAX_MS = 50;
export const PROSPARITET_API_RESPONSE_MAX_MS = 200;
export const PROSPARITET_LINKED_REPO_IMPACT = 'none';
export const PROSPARITET_DISCLAIMER =
  'PROSPARITET provides deterministic prosperity guidance and does not replace legal, financial, tax, or emergency judgment.';

export type ProsparitetObjective = 'CASHFLOW' | 'SAVINGS' | 'INVESTMENT' | 'EXPANSION';
export type ProsparitetHorizon = 'SHORT' | 'MEDIUM' | 'LONG';
export type ProsparitetRiskAppetite = 'LOW' | 'MEDIUM' | 'HIGH';
export type ProsparitetStatus = 'CRITICAL' | 'STABLE' | 'GROWING' | 'PROSPER';
export type ProsparitetAction = 'STABILIZE_BASE' | 'BUILD_BUFFER' | 'OPTIMIZE_ALLOCATION' | 'SCALE_CONFIDENTLY';

export interface ProsparitetInput {
  referenceId?: string;
  objective: ProsparitetObjective;
  horizon: ProsparitetHorizon;
  riskAppetite: ProsparitetRiskAppetite;
  revenueStabilityScore: number;
  marginScore: number;
  liquidityScore: number;
  debtLoadScore: number;
  disciplineScore: number;
  horizonMonths: number;
}

export interface ProsparitetResult {
  referenceId: string;
  objective: ProsparitetObjective | null;
  horizon: ProsparitetHorizon | null;
  riskAppetite: ProsparitetRiskAppetite | null;
  stabilityScore: number;
  growthScore: number;
  resilienceScore: number;
  efficiencyScore: number;
  overallScore: number;
  status: ProsparitetStatus;
  recommendedAction: ProsparitetAction;
  warnings: string[];
  disclaimer: string;
  valid: boolean;
  durationMs: number;
}

export interface ProsparitetHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  evaluations: number;
  lastStatus: ProsparitetStatus | null;
  lastEvaluatedAt: string | null;
  supportedObjectives: ProsparitetObjective[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}
