// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER
// Kompanija SPAJA — Digitalna Industrija

import type {
  TrenazerExperienceLevel,
  TrenazerGoal,
  TrenazerHealthReport,
  TrenazerInput,
  TrenazerMetricsInput,
  TrenazerReadiness,
  TrenazerRecommendedIntensity,
  TrenazerResult,
} from './types';
import {
  TRENAZER_API_RESPONSE_MAX_MS,
  TRENAZER_CONTRACT_VERSION,
  TRENAZER_MAX_AVAILABLE_MINUTES,
  TRENAZER_MODULE_VERSION,
  TRENAZER_PERFORMANCE_MAX_MS,
  TRENAZER_PERSONA_ID,
} from './types';

let evaluations = 0;
let lastReadinessScore = 0;
let lastReadiness: TrenazerReadiness = 'RECOVERY';

const GOAL_FOCUS_AREAS: Record<TrenazerGoal, string[]> = {
  ENDURANCE: ['tempo', 'cardio-capacity'],
  STRENGTH: ['compound-lifts', 'progressive-load'],
  RECOVERY: ['mobility', 'breathing'],
  BALANCE: ['coordination', 'stability'],
};

const DURATION_CAPS: Record<TrenazerExperienceLevel, Record<TrenazerReadiness, number>> = {
  BEGINNER: {
    RECOVERY: 25,
    MODERATE: 40,
    INTENSIVE: 55,
  },
  INTERMEDIATE: {
    RECOVERY: 30,
    MODERATE: 55,
    INTENSIVE: 70,
  },
  ADVANCED: {
    RECOVERY: 35,
    MODERATE: 65,
    INTENSIVE: 85,
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeSleepHours(hours: number): number {
  return clamp((hours / 8) * 100, 0, 100);
}

function normalizeAvailableMinutes(minutes: number): number {
  return clamp((minutes / 60) * 100, 0, 100);
}

function resolveReadiness(score: number): TrenazerReadiness {
  if (score >= 75) return 'INTENSIVE';
  if (score >= 45) return 'MODERATE';
  return 'RECOVERY';
}

function resolveIntensity(readiness: TrenazerReadiness): TrenazerRecommendedIntensity {
  if (readiness === 'INTENSIVE') return 'HIGH';
  if (readiness === 'MODERATE') return 'MEDIUM';
  return 'LOW';
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): TrenazerResult {
  return {
    referenceId: referenceId ?? 'n/a',
    traineeId: 'unknown',
    readinessScore: 0,
    readiness: 'RECOVERY',
    recommendedIntensity: 'LOW',
    recommendedDurationMinutes: 0,
    focusAreas: [],
    valid: false,
    warnings: [warning],
    durationMs: Date.now() - start,
  };
}

function validateMetricRange(
  metrics: TrenazerMetricsInput,
  field: keyof Pick<TrenazerMetricsInput, 'energy' | 'focus' | 'soreness' | 'stress'>,
): string | null {
  const value = metrics[field];
  if (!Number.isFinite(value)) {
    return `${field} must be finite`;
  }
  if (value < 0 || value > 100) {
    return `${field} must be within 0..100`;
  }
  return null;
}

function buildWarnings(metrics: TrenazerMetricsInput, readiness: TrenazerReadiness): string[] {
  const warnings: string[] = [];
  if (metrics.sleepHours < 6) warnings.push('sleep below optimal threshold');
  if (metrics.soreness >= 70) warnings.push('soreness indicates reduced load');
  if (metrics.stress >= 75) warnings.push('stress indicates focus on recovery');
  if (metrics.availableMinutes < 20) warnings.push('limited session duration available');
  if (readiness === 'RECOVERY') warnings.push('recovery-first session recommended');
  return warnings;
}

export function evaluateTrenazer(input: TrenazerInput): TrenazerResult {
  const start = Date.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!input.profile || typeof input.profile !== 'object') {
    return invalidResult(input.referenceId, 'profile is required', start);
  }

  if (!input.metrics || typeof input.metrics !== 'object') {
    return invalidResult(input.referenceId, 'metrics is required', start);
  }

  if (!['ENDURANCE', 'STRENGTH', 'RECOVERY', 'BALANCE'].includes(input.profile.goal)) {
    return invalidResult(input.referenceId, 'goal must be a supported value', start);
  }

  if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(input.profile.experienceLevel)) {
    return invalidResult(input.referenceId, 'experienceLevel must be a supported value', start);
  }

  for (const field of ['energy', 'focus', 'soreness', 'stress'] as const) {
    const metricWarning = validateMetricRange(input.metrics, field);
    if (metricWarning) return invalidResult(input.referenceId, metricWarning, start);
  }

  if (!Number.isFinite(input.metrics.sleepHours)) {
    return invalidResult(input.referenceId, 'sleepHours must be finite', start);
  }
  if (input.metrics.sleepHours < 0 || input.metrics.sleepHours > 24) {
    return invalidResult(input.referenceId, 'sleepHours must be within 0..24', start);
  }

  if (!Number.isFinite(input.metrics.availableMinutes)) {
    return invalidResult(input.referenceId, 'availableMinutes must be finite', start);
  }
  if (input.metrics.availableMinutes <= 0 || input.metrics.availableMinutes > TRENAZER_MAX_AVAILABLE_MINUTES) {
    return invalidResult(
      input.referenceId,
      `availableMinutes must be within 1..${TRENAZER_MAX_AVAILABLE_MINUTES}`,
      start,
    );
  }

  const sleepScore = normalizeSleepHours(input.metrics.sleepHours);
  const timeScore = normalizeAvailableMinutes(input.metrics.availableMinutes);
  const rawScore = (
    input.metrics.energy * 0.35 +
    input.metrics.focus * 0.2 +
    sleepScore * 0.15 +
    timeScore * 0.1 +
    (100 - input.metrics.soreness) * 0.1 +
    (100 - input.metrics.stress) * 0.1
  );
  const readinessScore = Math.round(clamp(rawScore, 0, 100) * 100) / 100;
  const readiness = resolveReadiness(readinessScore);
  const recommendedIntensity = resolveIntensity(readiness);
  const recommendedDurationMinutes = Math.min(
    Math.round(input.metrics.availableMinutes),
    DURATION_CAPS[input.profile.experienceLevel][readiness],
  );
  const warnings = buildWarnings(input.metrics, readiness);

  evaluations += 1;
  lastReadinessScore = readinessScore;
  lastReadiness = readiness;

  return {
    referenceId: input.referenceId ?? 'n/a',
    traineeId: input.profile.traineeId?.trim() || 'anonymous-trainee',
    readinessScore,
    readiness,
    recommendedIntensity,
    recommendedDurationMinutes,
    focusAreas: GOAL_FOCUS_AREAS[input.profile.goal],
    valid: true,
    warnings,
    durationMs: Date.now() - start,
  };
}

export function getTrenazerHealthReport(): TrenazerHealthReport {
  return {
    personaId: TRENAZER_PERSONA_ID,
    contractVersion: TRENAZER_CONTRACT_VERSION,
    moduleVersion: TRENAZER_MODULE_VERSION,
    evaluations,
    lastReadinessScore,
    lastReadiness,
    performanceMaxMs: TRENAZER_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: TRENAZER_API_RESPONSE_MAX_MS,
  };
}

export function _resetTrenazerMetrics(): void {
  evaluations = 0;
  lastReadinessScore = 0;
  lastReadiness = 'RECOVERY';
}
