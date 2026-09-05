// SpajaUltraOmegaCore -∞Ω+∞ — KULKON Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  KulkonEnvironment,
  KulkonHealthReport,
  KulkonInput,
  KulkonObjective,
  KulkonResult,
  KulkonRhythm,
  KulkonStatus,
} from './types';
import {
  KULKON_API_RESPONSE_MAX_MS,
  KULKON_CONTRACT_VERSION,
  KULKON_DISCLAIMER,
  KULKON_DISPLAY_NAME,
  KULKON_LINKED_REPO_IMPACT,
  KULKON_MAX_PARTICIPANTS,
  KULKON_MAX_SCORE,
  KULKON_MAX_WINDOW_DAYS,
  KULKON_MIN_SCORE,
  KULKON_MODULE_VERSION,
  KULKON_PERFORMANCE_MAX_MS,
  KULKON_PERSONA_ID,
  KULKON_SLUG,
} from './types';
import {
  ACTION_TARGET_DAYS,
  ENVIRONMENT_BASE,
  OBJECTIVE_BOOST,
  OBJECTIVE_TARGET_DAYS,
  RHYTHM_BASE,
  VALID_KULKON_ENVIRONMENTS,
  VALID_KULKON_OBJECTIVES,
  VALID_KULKON_RHYTHMS,
} from './registry';

let evaluations = 0;
let lastStatus: KulkonStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is KulkonObjective {
  return typeof value === 'string' && VALID_KULKON_OBJECTIVES.includes(value as KulkonObjective);
}

function isEnvironment(value: unknown): value is KulkonEnvironment {
  return typeof value === 'string' && VALID_KULKON_ENVIRONMENTS.includes(value as KulkonEnvironment);
}

function isRhythm(value: unknown): value is KulkonRhythm {
  return typeof value === 'string' && VALID_KULKON_RHYTHMS.includes(value as KulkonRhythm);
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): KulkonResult {
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    environment: null,
    rhythm: null,
    cohesionScore: 0,
    resilienceScore: 0,
    cadenceScore: 0,
    pressureScore: 0,
    overallScore: 0,
    status: 'FRAGILE',
    recommendedAction: 'CLARIFY_NORMS',
    recommendedWindowDays: 0,
    warnings: [warning],
    disclaimer: KULKON_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
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

function recordEvaluation(status: KulkonStatus): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function computeCohesionScore(input: KulkonInput): number {
  const raw =
    input.clarityScore * 0.35 +
    input.trustScore * 0.35 +
    input.accountabilityScore * 0.3 +
    OBJECTIVE_BOOST[input.objective] -
    input.conflictRate * 0.12;
  return round2(clamp(raw, KULKON_MIN_SCORE, KULKON_MAX_SCORE));
}

function computeResilienceScore(input: KulkonInput): number {
  const raw =
    input.trustScore * 0.3 +
    input.accountabilityScore * 0.28 +
    ENVIRONMENT_BASE[input.environment] * 0.18 +
    RHYTHM_BASE[input.rhythm] * 0.1 +
    (100 - input.conflictRate) * 0.14;
  return round2(clamp(raw, KULKON_MIN_SCORE, KULKON_MAX_SCORE));
}

function computeCadenceScore(input: KulkonInput): number {
  const targetDays = OBJECTIVE_TARGET_DAYS[input.objective];
  const targetPenalty = (Math.abs(input.windowDays - targetDays) / targetDays) * 45;
  const raw = RHYTHM_BASE[input.rhythm] + input.clarityScore * 0.22 - targetPenalty - input.communicationLoad * 0.1;
  return round2(clamp(raw, KULKON_MIN_SCORE, KULKON_MAX_SCORE));
}

function computePressureScore(input: KulkonInput): number {
  const participantPenalty = (input.participantCount / KULKON_MAX_PARTICIPANTS) * 24;
  const raw =
    100 -
    input.communicationLoad * 0.45 -
    input.conflictRate * 0.4 -
    participantPenalty +
    input.trustScore * 0.2;
  return round2(clamp(raw, KULKON_MIN_SCORE, KULKON_MAX_SCORE));
}

function resolveStatus(input: KulkonInput, overallScore: number): KulkonStatus {
  if (overallScore >= 86 && input.trustScore >= 75 && input.conflictRate <= 25) return 'EXEMPLARY';
  if (overallScore >= 68) return 'COHESIVE';
  if (overallScore >= 44) return 'STABLE';
  return 'FRAGILE';
}

function resolveRecommendedAction(input: KulkonInput, status: KulkonStatus): KulkonResult['recommendedAction'] {
  if (status === 'FRAGILE' || input.clarityScore < 40) return 'CLARIFY_NORMS';
  if (input.objective === 'CONFLICT_RESET' || input.conflictRate >= 60) return 'RUN_RETRO';
  if (status === 'EXEMPLARY' && input.objective === 'RETENTION') return 'SCALE_PLAYBOOK';
  return 'SCHEDULE_RITUAL';
}

function resolveRecommendedWindowDays(
  objective: KulkonInput['objective'],
  action: KulkonResult['recommendedAction'],
  status: KulkonStatus,
): number {
  const statusAdjustment = status === 'EXEMPLARY' ? 7 : status === 'FRAGILE' ? -4 : 0;
  const base = (OBJECTIVE_TARGET_DAYS[objective] + ACTION_TARGET_DAYS[action]) / 2;
  return clamp(base + statusAdjustment, 1, KULKON_MAX_WINDOW_DAYS);
}

function buildWarnings(input: KulkonInput, status: KulkonStatus, pressureScore: number): string[] {
  const warnings: string[] = [];

  if (input.communicationLoad >= 85 && input.rhythm === 'ADHOC') {
    warnings.push('High communication load with ad-hoc rhythm can fragment team focus.');
  }

  if (input.conflictRate >= 70 && input.objective !== 'CONFLICT_RESET') {
    warnings.push('Conflict rate suggests a reset objective before broader optimization.');
  }

  if (input.participantCount >= 35 && input.clarityScore < 55) {
    warnings.push('Large participant groups require clearer norms to avoid drift.');
  }

  if (input.environment === 'REMOTE' && input.rhythm === 'ADHOC') {
    warnings.push('Remote teams usually need predictable rituals to preserve cohesion.');
  }

  if (status === 'FRAGILE' && pressureScore < 35) {
    warnings.push('Current pressure indicators are working against KULKON stability.');
  }

  return warnings;
}

export function evaluateKulkon(input: KulkonInput): KulkonResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_KULKON_OBJECTIVES.join(', ')}`, start);
  }

  if (!isEnvironment(input.environment)) {
    return invalidResult(
      input.referenceId,
      `environment must be one of: ${VALID_KULKON_ENVIRONMENTS.join(', ')}`,
      start,
    );
  }

  if (!isRhythm(input.rhythm)) {
    return invalidResult(input.referenceId, `rhythm must be one of: ${VALID_KULKON_RHYTHMS.join(', ')}`, start);
  }

  const boundedNumberFields: Array<[value: number, field: string]> = [
    [input.clarityScore, 'clarityScore'],
    [input.trustScore, 'trustScore'],
    [input.accountabilityScore, 'accountabilityScore'],
    [input.communicationLoad, 'communicationLoad'],
    [input.conflictRate, 'conflictRate'],
  ];

  for (const [value, field] of boundedNumberFields) {
    const error = validateBoundedNumber(value, field);
    if (error) return invalidResult(input.referenceId, error, start);
  }

  const participantError = validateBoundedInteger(input.participantCount, 'participantCount', 1, KULKON_MAX_PARTICIPANTS);
  if (participantError) return invalidResult(input.referenceId, participantError, start);

  const windowError = validateBoundedInteger(input.windowDays, 'windowDays', 1, KULKON_MAX_WINDOW_DAYS);
  if (windowError) return invalidResult(input.referenceId, windowError, start);

  const cohesionScore = computeCohesionScore(input);
  const resilienceScore = computeResilienceScore(input);
  const cadenceScore = computeCadenceScore(input);
  const pressureScore = computePressureScore(input);
  const overallScore = round2(
    clamp(
      cohesionScore * 0.33 + resilienceScore * 0.27 + cadenceScore * 0.2 + pressureScore * 0.2,
      KULKON_MIN_SCORE,
      KULKON_MAX_SCORE,
    ),
  );

  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const recommendedWindowDays = resolveRecommendedWindowDays(input.objective, recommendedAction, status);
  const warnings = buildWarnings(input, status, pressureScore);
  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    environment: input.environment,
    rhythm: input.rhythm,
    cohesionScore,
    resilienceScore,
    cadenceScore,
    pressureScore,
    overallScore,
    status,
    recommendedAction,
    recommendedWindowDays,
    warnings,
    disclaimer: KULKON_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getKulkonHealthReport(): KulkonHealthReport {
  return {
    personaId: KULKON_PERSONA_ID,
    displayName: KULKON_DISPLAY_NAME,
    slug: KULKON_SLUG,
    contractVersion: KULKON_CONTRACT_VERSION,
    moduleVersion: KULKON_MODULE_VERSION,
    linkedRepoImpact: KULKON_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_KULKON_OBJECTIVES],
    performanceMaxMs: KULKON_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: KULKON_API_RESPONSE_MAX_MS,
  };
}

export function _resetKulkonMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
