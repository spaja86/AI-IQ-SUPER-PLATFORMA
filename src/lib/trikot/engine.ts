// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT Engine
// Kompanija SPAJA — Digitalna Industrija

import {
  TRIKOT_API_RESPONSE_MAX_MS,
  TRIKOT_CONTRACT_VERSION,
  TRIKOT_DISCLAIMER,
  TRIKOT_DISPLAY_NAME,
  TRIKOT_LINKED_REPO_IMPACT,
  TRIKOT_MAX_ACCESSORY_COMPLEXITY,
  TRIKOT_MAX_PREP_TIME_HOURS,
  TRIKOT_MAX_SCORE,
  TRIKOT_MIN_SCORE,
  TRIKOT_MODULE_VERSION,
  TRIKOT_PERFORMANCE_MAX_MS,
  TRIKOT_PERSONA_ID,
  TRIKOT_SLUG,
} from './types';
import {
  ACTION_REVIEW_HOURS,
  DRESS_CODE_BASE_SCORE,
  OBJECTIVE_BASE_SCORE,
  OBJECTIVE_TARGET_PREP_HOURS,
  SEASON_BASE_SCORE,
  VALID_TRIKOT_DRESS_CODES,
  VALID_TRIKOT_OBJECTIVES,
  VALID_TRIKOT_SEASONS,
} from './registry';
import type {
  TrikotDressCode,
  TrikotHealthReport,
  TrikotInput,
  TrikotObjective,
  TrikotResult,
  TrikotSeason,
  TrikotStatus,
} from './types';

let evaluations = 0;
let lastStatus: TrikotStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is TrikotObjective {
  return typeof value === 'string' && VALID_TRIKOT_OBJECTIVES.includes(value as TrikotObjective);
}

function isSeason(value: unknown): value is TrikotSeason {
  return typeof value === 'string' && VALID_TRIKOT_SEASONS.includes(value as TrikotSeason);
}

function isDressCode(value: unknown): value is TrikotDressCode {
  return typeof value === 'string' && VALID_TRIKOT_DRESS_CODES.includes(value as TrikotDressCode);
}

function recordEvaluation(status: TrikotStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): TrikotResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    season: null,
    dressCode: null,
    styleScore: 0,
    practicalityScore: 0,
    readinessScore: 0,
    durabilityScore: 0,
    overallScore: 0,
    status: null,
    recommendedAction: null,
    recommendedReviewHours: ACTION_REVIEW_HOURS.CHANGE_BASE_LAYER,
    warnings: [warning],
    disclaimer: TRIKOT_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeStyleScore(input: TrikotInput): number {
  const raw =
    input.weatherFitScore * 0.24 +
    input.comfortScore * 0.22 +
    input.mobilityScore * 0.16 +
    OBJECTIVE_BASE_SCORE[input.objective] * 0.18 +
    DRESS_CODE_BASE_SCORE[input.dressCode] * 0.12 +
    SEASON_BASE_SCORE[input.season] * 0.08;
  return round2(clamp(raw, TRIKOT_MIN_SCORE, TRIKOT_MAX_SCORE));
}

function computePracticalityScore(input: TrikotInput): number {
  const raw =
    input.budgetFitScore * 0.35 +
    input.comfortScore * 0.25 +
    input.mobilityScore * 0.2 +
    (100 - input.maintenanceRisk) * 0.2;
  return round2(clamp(raw, TRIKOT_MIN_SCORE, TRIKOT_MAX_SCORE));
}

function computeReadinessScore(input: TrikotInput): number {
  const target = OBJECTIVE_TARGET_PREP_HOURS[input.objective];
  const safeTarget = Math.max(1, target);
  const prepPenalty = Math.abs(input.prepTimeHours - target) / safeTarget * 40;
  const complexityPenalty = input.accessoryComplexity * 3;
  const raw = 100 - prepPenalty - complexityPenalty + input.weatherFitScore * 0.12;
  return round2(clamp(raw, TRIKOT_MIN_SCORE, TRIKOT_MAX_SCORE));
}

function computeDurabilityScore(input: TrikotInput): number {
  const raw =
    100 -
    input.maintenanceRisk * 0.62 -
    input.accessoryComplexity * 2.5 +
    input.mobilityScore * 0.18 +
    input.budgetFitScore * 0.08;
  return round2(clamp(raw, TRIKOT_MIN_SCORE, TRIKOT_MAX_SCORE));
}

function resolveStatus(input: TrikotInput, overallScore: number): TrikotStatus {
  if (input.maintenanceRisk >= 90 && input.accessoryComplexity >= 8) return 'REWORK';
  if (
    overallScore >= 82 &&
    input.weatherFitScore >= 75 &&
    input.maintenanceRisk <= 30 &&
    input.mobilityScore >= 45 &&
    input.dressCode !== 'RELAXED'
  ) return 'PRIME';
  if (overallScore >= 64) return 'READY';
  if (overallScore >= 42) return 'ADJUST';
  return 'REWORK';
}

function resolveRecommendedAction(
  input: TrikotInput,
  status: TrikotStatus,
): NonNullable<TrikotResult['recommendedAction']> {
  if (status === 'REWORK' || input.maintenanceRisk >= 85) return 'CHANGE_BASE_LAYER';
  if (input.accessoryComplexity >= 7) return 'SIMPLIFY_LOOK';
  if (status === 'ADJUST' || input.prepTimeHours < 2) return 'VALIDATE_DETAILS';
  return 'LOCK_COMBINATION';
}

function resolveRecommendedReviewHours(
  action: NonNullable<TrikotResult['recommendedAction']>,
  status: TrikotStatus,
): number {
  const statusAdjustment =
    status === 'PRIME' ? -4 :
    status === 'REWORK' ? 8 :
    status === 'ADJUST' ? 4 :
    0;

  return clamp(
    ACTION_REVIEW_HOURS[action] + statusAdjustment,
    1,
    TRIKOT_MAX_PREP_TIME_HOURS,
  );
}

function buildWarnings(input: TrikotInput, status: TrikotStatus): string[] {
  const warnings: string[] = [];

  if (input.maintenanceRisk >= 80) {
    warnings.push('Maintenance risk is high and may reduce sustained wearability.');
  }
  if (input.weatherFitScore <= 30) {
    warnings.push('Weather fit is poor for the selected season and objective.');
  }
  if (input.accessoryComplexity >= 8) {
    warnings.push('Accessory complexity is too high for stable execution.');
  }
  if (input.prepTimeHours > 48) {
    warnings.push('Prep time is very high and can delay execution readiness.');
  }
  if (status === 'REWORK' && input.mobilityScore < 35) {
    warnings.push('Mobility is too low for safe and practical movement.');
  }

  return warnings;
}

export function evaluateTrikot(input: TrikotInput): TrikotResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_TRIKOT_OBJECTIVES.join(', ')}`, start);
  }
  if (!isSeason(input.season)) {
    return invalidResult(input.referenceId, `season must be one of: ${VALID_TRIKOT_SEASONS.join(', ')}`, start);
  }
  if (!isDressCode(input.dressCode)) {
    return invalidResult(input.referenceId, `dressCode must be one of: ${VALID_TRIKOT_DRESS_CODES.join(', ')}`, start);
  }

  if (!Number.isFinite(input.comfortScore) || input.comfortScore < 0 || input.comfortScore > 100) {
    return invalidResult(input.referenceId, 'comfortScore must be within 0..100', start);
  }
  if (!Number.isFinite(input.weatherFitScore) || input.weatherFitScore < 0 || input.weatherFitScore > 100) {
    return invalidResult(input.referenceId, 'weatherFitScore must be within 0..100', start);
  }
  if (!Number.isFinite(input.budgetFitScore) || input.budgetFitScore < 0 || input.budgetFitScore > 100) {
    return invalidResult(input.referenceId, 'budgetFitScore must be within 0..100', start);
  }
  if (!Number.isFinite(input.mobilityScore) || input.mobilityScore < 0 || input.mobilityScore > 100) {
    return invalidResult(input.referenceId, 'mobilityScore must be within 0..100', start);
  }
  if (!Number.isFinite(input.maintenanceRisk) || input.maintenanceRisk < 0 || input.maintenanceRisk > 100) {
    return invalidResult(input.referenceId, 'maintenanceRisk must be within 0..100', start);
  }
  if (!Number.isInteger(input.prepTimeHours) || input.prepTimeHours < 0 || input.prepTimeHours > TRIKOT_MAX_PREP_TIME_HOURS) {
    return invalidResult(
      input.referenceId,
      `prepTimeHours must be an integer within 0..${TRIKOT_MAX_PREP_TIME_HOURS}`,
      start,
    );
  }
  if (
    !Number.isInteger(input.accessoryComplexity) ||
    input.accessoryComplexity < 0 ||
    input.accessoryComplexity > TRIKOT_MAX_ACCESSORY_COMPLEXITY
  ) {
    return invalidResult(
      input.referenceId,
      `accessoryComplexity must be an integer within 0..${TRIKOT_MAX_ACCESSORY_COMPLEXITY}`,
      start,
    );
  }

  const styleScore = computeStyleScore(input);
  const practicalityScore = computePracticalityScore(input);
  const readinessScore = computeReadinessScore(input);
  const durabilityScore = computeDurabilityScore(input);
  const overallScore = round2(
    clamp(
      styleScore * 0.34 + practicalityScore * 0.26 + readinessScore * 0.22 + durabilityScore * 0.18,
      TRIKOT_MIN_SCORE,
      TRIKOT_MAX_SCORE,
    ),
  );

  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const recommendedReviewHours = resolveRecommendedReviewHours(recommendedAction, status);
  const warnings = buildWarnings(input, status);
  const durationMs = round2(performance.now() - start);
  const result: TrikotResult = {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    season: input.season,
    dressCode: input.dressCode,
    styleScore,
    practicalityScore,
    readinessScore,
    durabilityScore,
    overallScore,
    status,
    recommendedAction,
    recommendedReviewHours,
    warnings,
    disclaimer: TRIKOT_DISCLAIMER,
    valid: true,
    durationMs,
  };

  recordEvaluation(result.status);
  return result;
}

export function getTrikotHealthReport(): TrikotHealthReport {
  return {
    personaId: TRIKOT_PERSONA_ID,
    displayName: TRIKOT_DISPLAY_NAME,
    slug: TRIKOT_SLUG,
    contractVersion: TRIKOT_CONTRACT_VERSION,
    moduleVersion: TRIKOT_MODULE_VERSION,
    linkedRepoImpact: TRIKOT_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_TRIKOT_OBJECTIVES],
    performanceMaxMs: TRIKOT_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: TRIKOT_API_RESPONSE_MAX_MS,
  };
}

export function _resetTrikotMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
