// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  GeografijaRealnaHealthReport,
  GeografijaRealnaInput,
  GeografijaRealnaObjective,
  GeografijaRealnaRegionScale,
  GeografijaRealnaResult,
  GeografijaRealnaStatus,
  GeografijaRealnaTerrainComplexity,
} from './types';
import {
  GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS,
  GEOGRAFIJA_REALNA_CONTRACT_VERSION,
  GEOGRAFIJA_REALNA_DISCLAIMER,
  GEOGRAFIJA_REALNA_DISPLAY_NAME,
  GEOGRAFIJA_REALNA_LINKED_REPO_IMPACT,
  GEOGRAFIJA_REALNA_MAX_CONSTRAINTS,
  GEOGRAFIJA_REALNA_MAX_SCORE,
  GEOGRAFIJA_REALNA_MAX_TIME_WINDOW_HOURS,
  GEOGRAFIJA_REALNA_MIN_SCORE,
  GEOGRAFIJA_REALNA_MODULE_VERSION,
  GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS,
  GEOGRAFIJA_REALNA_PERSONA_ID,
  GEOGRAFIJA_REALNA_SLUG,
} from './types';
import {
  ACTION_TARGET_HOURS,
  OBJECTIVE_BOOST,
  OBJECTIVE_TARGET_HOURS,
  REGION_BASE,
  TERRAIN_BASE,
  VALID_GEOGRAFIJA_REALNA_OBJECTIVES,
  VALID_GEOGRAFIJA_REALNA_REGION_SCALES,
  VALID_GEOGRAFIJA_REALNA_TERRAIN_COMPLEXITIES,
} from './registry';

let evaluations = 0;
let lastStatus: GeografijaRealnaStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is GeografijaRealnaObjective {
  return (
    typeof value === 'string' &&
    VALID_GEOGRAFIJA_REALNA_OBJECTIVES.includes(value as GeografijaRealnaObjective)
  );
}

function isRegionScale(value: unknown): value is GeografijaRealnaRegionScale {
  return (
    typeof value === 'string' &&
    VALID_GEOGRAFIJA_REALNA_REGION_SCALES.includes(value as GeografijaRealnaRegionScale)
  );
}

function isTerrainComplexity(
  value: unknown,
): value is GeografijaRealnaTerrainComplexity {
  return (
    typeof value === 'string' &&
    VALID_GEOGRAFIJA_REALNA_TERRAIN_COMPLEXITIES.includes(
      value as GeografijaRealnaTerrainComplexity,
    )
  );
}

function validateBoundedNumber(
  value: number,
  field: string,
  min = 0,
  max = 100,
): string | null {
  if (!Number.isFinite(value) || value < min || value > max) {
    return `${field} must be within ${min}..${max}`;
  }
  return null;
}

function validateBoundedInteger(
  value: number,
  field: string,
  min: number,
  max: number,
): string | null {
  if (!Number.isInteger(value) || value < min || value > max) {
    return `${field} must be an integer within ${min}..${max}`;
  }
  return null;
}

function invalidResult(
  referenceId: string | undefined,
  warning: string,
  start: number,
): GeografijaRealnaResult {
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    regionScale: null,
    terrainComplexity: null,
    realismScore: 0,
    clarityScore: 0,
    feasibilityScore: 0,
    resilienceScore: 0,
    overallScore: 0,
    status: 'UNSTABLE',
    recommendedAction: 'REFINE_DATA',
    recommendedWindowHours: 0,
    warnings: [warning],
    disclaimer: GEOGRAFIJA_REALNA_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function recordEvaluation(status: GeografijaRealnaStatus): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function computeRealismScore(input: GeografijaRealnaInput): number {
  const raw =
    input.accuracyScore * 0.45 +
    input.dataFreshnessScore * 0.3 +
    OBJECTIVE_BOOST[input.objective] +
    (100 - input.riskScore) * 0.12;
  return round2(clamp(raw, GEOGRAFIJA_REALNA_MIN_SCORE, GEOGRAFIJA_REALNA_MAX_SCORE));
}

function computeClarityScore(input: GeografijaRealnaInput): number {
  const raw =
    input.contextScore * 0.58 +
    REGION_BASE[input.regionScale] * 0.2 +
    TERRAIN_BASE[input.terrainComplexity] * 0.12 -
    input.constraintsCount * 0.8;
  return round2(clamp(raw, GEOGRAFIJA_REALNA_MIN_SCORE, GEOGRAFIJA_REALNA_MAX_SCORE));
}

function computeFeasibilityScore(input: GeografijaRealnaInput): number {
  const targetHours = OBJECTIVE_TARGET_HOURS[input.objective];
  const timePenalty =
    (Math.abs(input.timeWindowHours - targetHours) / targetHours) * 35;
  const constraintsPenalty =
    (input.constraintsCount / GEOGRAFIJA_REALNA_MAX_CONSTRAINTS) * 28;
  const raw =
    input.accuracyScore * 0.28 +
    input.contextScore * 0.22 +
    (100 - input.riskScore) * 0.24 +
    TERRAIN_BASE[input.terrainComplexity] * 0.16 -
    timePenalty -
    constraintsPenalty;
  return round2(clamp(raw, GEOGRAFIJA_REALNA_MIN_SCORE, GEOGRAFIJA_REALNA_MAX_SCORE));
}

function computeResilienceScore(input: GeografijaRealnaInput): number {
  const raw =
    (100 - input.riskScore) * 0.45 +
    REGION_BASE[input.regionScale] * 0.24 +
    input.dataFreshnessScore * 0.18 +
    (100 - input.constraintsCount * 4) * 0.13;
  return round2(clamp(raw, GEOGRAFIJA_REALNA_MIN_SCORE, GEOGRAFIJA_REALNA_MAX_SCORE));
}

function resolveStatus(
  input: GeografijaRealnaInput,
  overallScore: number,
): GeografijaRealnaStatus {
  if (
    overallScore >= 84 &&
    input.accuracyScore >= 85 &&
    input.dataFreshnessScore >= 80 &&
    input.riskScore <= 25
  ) {
    return 'ATLAS_READY';
  }
  if (overallScore >= 68) return 'PRECISE';
  if (overallScore >= 42) return 'VIABLE';
  return 'UNSTABLE';
}

function resolveRecommendedAction(
  input: GeografijaRealnaInput,
  status: GeografijaRealnaStatus,
): GeografijaRealnaResult['recommendedAction'] {
  if (status === 'UNSTABLE' || input.accuracyScore < 45) return 'REFINE_DATA';
  if (input.contextScore < 55 || input.regionScale === 'GLOBAL') return 'ADD_CONTEXT';
  if (status === 'PRECISE' && input.constraintsCount >= 8) return 'RUN_SCENARIOS';
  return 'EXECUTE_PLAN';
}

function resolveRecommendedWindowHours(
  objective: GeografijaRealnaInput['objective'],
  action: GeografijaRealnaResult['recommendedAction'],
  status: GeografijaRealnaStatus,
): number {
  const statusAdjustment =
    status === 'ATLAS_READY' ? -4 : status === 'UNSTABLE' ? 10 : 0;
  const base =
    (OBJECTIVE_TARGET_HOURS[objective] + ACTION_TARGET_HOURS[action]) / 2;
  return clamp(
    Math.round(base + statusAdjustment),
    1,
    GEOGRAFIJA_REALNA_MAX_TIME_WINDOW_HOURS,
  );
}

function buildWarnings(
  input: GeografijaRealnaInput,
  status: GeografijaRealnaStatus,
): string[] {
  const warnings: string[] = [];

  if (input.dataFreshnessScore < 40) {
    warnings.push('Data freshness is low; verify with recent geographic sources.');
  }

  if (input.riskScore >= 70 && input.objective !== 'ANALYSIS') {
    warnings.push('High risk suggests running additional analysis before execution.');
  }

  if (input.regionScale === 'GLOBAL' && input.contextScore < 60) {
    warnings.push('Global scope needs stronger context coverage and localization assumptions.');
  }

  if (input.terrainComplexity === 'HIGH' && input.accuracyScore < 65) {
    warnings.push('High terrain complexity requires better source precision.');
  }

  if (status === 'UNSTABLE') {
    warnings.push('Current profile is unstable for production-level geographic decisions.');
  }

  return warnings;
}

export function evaluateGeografijaRealna(
  input: GeografijaRealnaInput,
): GeografijaRealnaResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(
      input.referenceId,
      `objective must be one of: ${VALID_GEOGRAFIJA_REALNA_OBJECTIVES.join(', ')}`,
      start,
    );
  }

  if (!isRegionScale(input.regionScale)) {
    return invalidResult(
      input.referenceId,
      `regionScale must be one of: ${VALID_GEOGRAFIJA_REALNA_REGION_SCALES.join(', ')}`,
      start,
    );
  }

  if (!isTerrainComplexity(input.terrainComplexity)) {
    return invalidResult(
      input.referenceId,
      `terrainComplexity must be one of: ${VALID_GEOGRAFIJA_REALNA_TERRAIN_COMPLEXITIES.join(', ')}`,
      start,
    );
  }

  const boundedNumberFields: Array<[value: number, field: string]> = [
    [input.accuracyScore, 'accuracyScore'],
    [input.contextScore, 'contextScore'],
    [input.dataFreshnessScore, 'dataFreshnessScore'],
    [input.riskScore, 'riskScore'],
  ];

  for (const [value, field] of boundedNumberFields) {
    const err = validateBoundedNumber(value, field);
    if (err) return invalidResult(input.referenceId, err, start);
  }

  const windowErr = validateBoundedInteger(
    input.timeWindowHours,
    'timeWindowHours',
    1,
    GEOGRAFIJA_REALNA_MAX_TIME_WINDOW_HOURS,
  );
  if (windowErr) return invalidResult(input.referenceId, windowErr, start);

  const constraintsErr = validateBoundedInteger(
    input.constraintsCount,
    'constraintsCount',
    0,
    GEOGRAFIJA_REALNA_MAX_CONSTRAINTS,
  );
  if (constraintsErr) return invalidResult(input.referenceId, constraintsErr, start);

  const realismScore = computeRealismScore(input);
  const clarityScore = computeClarityScore(input);
  const feasibilityScore = computeFeasibilityScore(input);
  const resilienceScore = computeResilienceScore(input);
  const overallScore = round2(
    clamp(
      realismScore * 0.34 +
        clarityScore * 0.22 +
        feasibilityScore * 0.24 +
        resilienceScore * 0.2,
      GEOGRAFIJA_REALNA_MIN_SCORE,
      GEOGRAFIJA_REALNA_MAX_SCORE,
    ),
  );

  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const recommendedWindowHours = resolveRecommendedWindowHours(
    input.objective,
    recommendedAction,
    status,
  );
  const warnings = buildWarnings(input, status);

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    regionScale: input.regionScale,
    terrainComplexity: input.terrainComplexity,
    realismScore,
    clarityScore,
    feasibilityScore,
    resilienceScore,
    overallScore,
    status,
    recommendedAction,
    recommendedWindowHours,
    warnings,
    disclaimer: GEOGRAFIJA_REALNA_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getGeografijaRealnaHealthReport(): GeografijaRealnaHealthReport {
  return {
    personaId: GEOGRAFIJA_REALNA_PERSONA_ID,
    displayName: GEOGRAFIJA_REALNA_DISPLAY_NAME,
    slug: GEOGRAFIJA_REALNA_SLUG,
    contractVersion: GEOGRAFIJA_REALNA_CONTRACT_VERSION,
    moduleVersion: GEOGRAFIJA_REALNA_MODULE_VERSION,
    linkedRepoImpact: GEOGRAFIJA_REALNA_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_GEOGRAFIJA_REALNA_OBJECTIVES],
    performanceMaxMs: GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: GEOGRAFIJA_REALNA_API_RESPONSE_MAX_MS,
  };
}

export function _resetGeografijaRealnaMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
