// SpajaUltraOmegaCore -∞Ω+∞ — PARAKSIL
// Kompanija SPAJA — Digitalna Industrija

export type ParaksilSuite = 'UNIT' | 'API' | 'INTEGRATION' | 'FULL';
export type ParaksilStatus = 'READY' | 'NEEDS_REVIEW' | 'BLOCKED';

export interface ParaksilTargetInput {
  moduleId: string;
  moduleVersion?: string;
  suite: ParaksilSuite;
}

export interface ParaksilMetricsInput {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  avgLatencyMs: number;
  errorRatePct: number;
  coveragePct: number;
}

export interface ParaksilInput {
  referenceId?: string;
  target: ParaksilTargetInput;
  metrics: ParaksilMetricsInput;
}

export interface ParaksilResult {
  referenceId: string;
  moduleId: string;
  moduleVersion: string;
  suite: ParaksilSuite;
  validationScore: number;
  status: ParaksilStatus;
  passRate: number;
  withinLatencyBudget: boolean;
  valid: boolean;
  warnings: string[];
  durationMs: number;
}

export interface ParaksilHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  evaluations: number;
  lastModuleId: string;
  lastStatus: ParaksilStatus;
  lastValidationScore: number;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export const PARAKSIL_CONTRACT_VERSION = 'v1';
export const PARAKSIL_MODULE_VERSION = '1.0.0';
export const PARAKSIL_PERSONA_ID = 'paraksil-validator-core';
export const PARAKSIL_PERFORMANCE_MAX_MS = 50;
export const PARAKSIL_API_RESPONSE_MAX_MS = 200;
export const PARAKSIL_COVERAGE_TARGET_PCT = 80;
export const PARAKSIL_ERROR_RATE_WARN_PCT = 5;
export const PARAKSIL_ERROR_RATE_BLOCK_PCT = 20;
export const PARAKSIL_LATENCY_BUDGET_MS: Record<ParaksilSuite, number> = {
  UNIT: 50,
  API: 200,
  INTEGRATION: 300,
  FULL: 500,
};
