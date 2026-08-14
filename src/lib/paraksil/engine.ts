// SpajaUltraOmegaCore -∞Ω+∞ — PARAKSIL
// Kompanija SPAJA — Digitalna Industrija

import type {
  ParaksilHealthReport,
  ParaksilInput,
  ParaksilMetricsInput,
  ParaksilResult,
  ParaksilStatus,
} from './types';
import {
  PARAKSIL_API_RESPONSE_MAX_MS,
  PARAKSIL_CONTRACT_VERSION,
  PARAKSIL_COVERAGE_TARGET_PCT,
  PARAKSIL_ERROR_RATE_BLOCK_PCT,
  PARAKSIL_ERROR_RATE_WARN_PCT,
  PARAKSIL_LATENCY_BUDGET_MS,
  PARAKSIL_MODULE_VERSION,
  PARAKSIL_PERFORMANCE_MAX_MS,
  PARAKSIL_PERSONA_ID,
} from './types';

let evaluations = 0;
let lastModuleId = 'n/a';
let lastStatus: ParaksilStatus = 'BLOCKED';
let lastValidationScore = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): ParaksilResult {
  return {
    referenceId: referenceId ?? 'n/a',
    moduleId: 'unknown-module',
    moduleVersion: 'unknown',
    suite: 'UNIT',
    validationScore: 0,
    status: 'BLOCKED',
    passRate: 0,
    withinLatencyBudget: false,
    valid: false,
    warnings: [warning],
    durationMs: round2(performance.now() - start),
  };
}

function validateIntegerField(
  metrics: ParaksilMetricsInput,
  field: keyof Pick<ParaksilMetricsInput, 'totalChecks' | 'passedChecks' | 'failedChecks'>,
): string | null {
  const value = metrics[field];
  if (!Number.isFinite(value)) return `${field} must be finite`;
  if (!Number.isInteger(value)) return `${field} must be an integer`;
  if (value < 0) return `${field} must be >= 0`;
  return null;
}

function validatePercentField(
  metrics: ParaksilMetricsInput,
  field: keyof Pick<ParaksilMetricsInput, 'errorRatePct' | 'coveragePct'>,
): string | null {
  const value = metrics[field];
  if (!Number.isFinite(value)) return `${field} must be finite`;
  if (value < 0 || value > 100) return `${field} must be within 0..100`;
  return null;
}

function buildWarnings(metrics: ParaksilMetricsInput, status: ParaksilStatus, latencyBudgetMs: number): string[] {
  const warnings: string[] = [];
  if (metrics.failedChecks > 0) warnings.push('failed checks detected');
  if (metrics.coveragePct < PARAKSIL_COVERAGE_TARGET_PCT) warnings.push('coverage below target threshold');
  if (metrics.errorRatePct > PARAKSIL_ERROR_RATE_WARN_PCT) warnings.push('error rate above warning threshold');
  if (metrics.avgLatencyMs > latencyBudgetMs) warnings.push('latency budget exceeded');
  if (status === 'BLOCKED') warnings.push('module validation is blocked pending fixes');
  return warnings;
}

function resolveStatus(
  passRate: number,
  metrics: ParaksilMetricsInput,
  latencyBudgetMs: number,
): ParaksilStatus {
  if (
    passRate < 70 ||
    metrics.coveragePct < 50 ||
    metrics.errorRatePct > PARAKSIL_ERROR_RATE_BLOCK_PCT ||
    metrics.avgLatencyMs > latencyBudgetMs * 2
  ) {
    return 'BLOCKED';
  }
  if (
    metrics.failedChecks > 0 ||
    passRate < 95 ||
    metrics.coveragePct < PARAKSIL_COVERAGE_TARGET_PCT ||
    metrics.errorRatePct > PARAKSIL_ERROR_RATE_WARN_PCT ||
    metrics.avgLatencyMs > latencyBudgetMs
  ) {
    return 'NEEDS_REVIEW';
  }
  return 'READY';
}

export function evaluateParaksil(input: ParaksilInput): ParaksilResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }
  if (!input.target || typeof input.target !== 'object') {
    return invalidResult(input.referenceId, 'target is required', start);
  }
  if (!input.metrics || typeof input.metrics !== 'object') {
    return invalidResult(input.referenceId, 'metrics is required', start);
  }
  if (typeof input.target.moduleId !== 'string' || input.target.moduleId.trim().length === 0) {
    return invalidResult(input.referenceId, 'moduleId is required', start);
  }
  if (!['UNIT', 'API', 'INTEGRATION', 'FULL'].includes(input.target.suite)) {
    return invalidResult(input.referenceId, 'suite must be a supported value', start);
  }
  if (input.target.moduleVersion !== undefined && typeof input.target.moduleVersion !== 'string') {
    return invalidResult(input.referenceId, 'moduleVersion must be a string', start);
  }

  for (const field of ['totalChecks', 'passedChecks', 'failedChecks'] as const) {
    const warning = validateIntegerField(input.metrics, field);
    if (warning) return invalidResult(input.referenceId, warning, start);
  }
  if (input.metrics.totalChecks <= 0) {
    return invalidResult(input.referenceId, 'totalChecks must be > 0', start);
  }
  if (input.metrics.passedChecks > input.metrics.totalChecks) {
    return invalidResult(input.referenceId, 'passedChecks cannot exceed totalChecks', start);
  }
  if (input.metrics.failedChecks > input.metrics.totalChecks) {
    return invalidResult(input.referenceId, 'failedChecks cannot exceed totalChecks', start);
  }
  if (input.metrics.passedChecks + input.metrics.failedChecks > input.metrics.totalChecks) {
    return invalidResult(input.referenceId, 'passedChecks + failedChecks cannot exceed totalChecks', start);
  }

  if (!Number.isFinite(input.metrics.avgLatencyMs)) {
    return invalidResult(input.referenceId, 'avgLatencyMs must be finite', start);
  }
  if (input.metrics.avgLatencyMs < 0) {
    return invalidResult(input.referenceId, 'avgLatencyMs must be >= 0', start);
  }

  for (const field of ['errorRatePct', 'coveragePct'] as const) {
    const warning = validatePercentField(input.metrics, field);
    if (warning) return invalidResult(input.referenceId, warning, start);
  }

  const passRate = round2((input.metrics.passedChecks / input.metrics.totalChecks) * 100);
  const latencyBudgetMs = PARAKSIL_LATENCY_BUDGET_MS[input.target.suite];
  const withinLatencyBudget = input.metrics.avgLatencyMs <= latencyBudgetMs;
  const latencyScore = withinLatencyBudget
    ? 100
    : clamp(100 - ((input.metrics.avgLatencyMs - latencyBudgetMs) / latencyBudgetMs) * 100, 0, 100);
  const validationScore = round2(clamp(
    passRate * 0.5 +
      input.metrics.coveragePct * 0.25 +
      latencyScore * 0.15 +
      (100 - input.metrics.errorRatePct) * 0.1,
    0,
    100,
  ));
  const status = resolveStatus(passRate, input.metrics, latencyBudgetMs);
  const warnings = buildWarnings(input.metrics, status, latencyBudgetMs);

  evaluations += 1;
  lastModuleId = input.target.moduleId.trim();
  lastStatus = status;
  lastValidationScore = validationScore;

  return {
    referenceId: input.referenceId ?? 'n/a',
    moduleId: lastModuleId,
    moduleVersion: input.target.moduleVersion?.trim() || 'unversioned',
    suite: input.target.suite,
    validationScore,
    status,
    passRate,
    withinLatencyBudget,
    valid: true,
    warnings,
    durationMs: round2(performance.now() - start),
  };
}

export function getParaksilHealthReport(): ParaksilHealthReport {
  return {
    personaId: PARAKSIL_PERSONA_ID,
    contractVersion: PARAKSIL_CONTRACT_VERSION,
    moduleVersion: PARAKSIL_MODULE_VERSION,
    evaluations,
    lastModuleId,
    lastStatus,
    lastValidationScore,
    performanceMaxMs: PARAKSIL_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: PARAKSIL_API_RESPONSE_MAX_MS,
  };
}

export function _resetParaksilMetrics(): void {
  evaluations = 0;
  lastModuleId = 'n/a';
  lastStatus = 'BLOCKED';
  lastValidationScore = 0;
}
