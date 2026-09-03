// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  AktivitiAllHealthReport,
  AktivitiAllInput,
  AktivitiAllResult,
  AktivitiAllStatus,
} from './types';
import {
  AKTIVITI_ALL_API_RESPONSE_MAX_MS,
  AKTIVITI_ALL_CONTRACT_VERSION,
  AKTIVITI_ALL_DISCLAIMER,
  AKTIVITI_ALL_DISPLAY_NAME,
  AKTIVITI_ALL_LINKED_REPO_IMPACT,
  AKTIVITI_ALL_MAX_DURATION_MINUTES,
  AKTIVITI_ALL_MODULE_VERSION,
  AKTIVITI_ALL_PERFORMANCE_MAX_MS,
  AKTIVITI_ALL_PERSONA_ID,
  AKTIVITI_ALL_SLUG,
} from './types';
import { ACTIVITY_PROFILES, VALID_AKTIVITI_ALL_ACTIVITIES } from './registry';

let evaluations = 0;
let lastReadinessScore = 0;
let lastStatus: AktivitiAllStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveStatus(score: number): AktivitiAllStatus {
  if (score >= 80) return 'READY';
  if (score >= 60) return 'STEADY';
  if (score >= 40) return 'RECOVER';
  return 'BLOCKED';
}

function buildRecommendation(activityLabel: string, status: AktivitiAllStatus): string {
  switch (status) {
    case 'READY':
      return `${activityLabel}: strong readiness detected. Proceed with full intent.`;
    case 'STEADY':
      return `${activityLabel}: acceptable readiness. Proceed with moderate pacing.`;
    case 'RECOVER':
      return `${activityLabel}: reduced readiness. Prefer lighter scope and recovery support.`;
    case 'BLOCKED':
      return `${activityLabel}: current state is not suitable. Pause and recover first.`;
  }
}

function markEvaluation(result?: { score?: number; status?: AktivitiAllStatus }): void {
  evaluations += 1;
  if (typeof result?.score === 'number') {
    lastReadinessScore = result.score;
  }
  if (result?.status) {
    lastStatus = result.status;
  }
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): AktivitiAllResult {
  markEvaluation({ score: 0, status: 'BLOCKED' });
  return {
    referenceId: referenceId ?? 'n/a',
    activity: null,
    readinessScore: 0,
    status: 'BLOCKED',
    recommendation: warning,
    warnings: [warning],
    valid: false,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    disclaimer: AKTIVITI_ALL_DISCLAIMER,
  };
}

function isWholeNumber(value: number): boolean {
  return Number.isFinite(value) && Math.floor(value) === value;
}

export function evaluateAktivitiAll(input: AktivitiAllInput): AktivitiAllResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!VALID_AKTIVITI_ALL_ACTIVITIES.includes(input.activity)) {
    return invalidResult(
      input.referenceId,
      `activity must be one of: ${VALID_AKTIVITI_ALL_ACTIVITIES.join(', ')}`,
      start,
    );
  }

  if (!isWholeNumber(input.durationMinutes) || input.durationMinutes < 0 || input.durationMinutes > AKTIVITI_ALL_MAX_DURATION_MINUTES) {
    return invalidResult(
      input.referenceId,
      `durationMinutes must be an integer 0-${AKTIVITI_ALL_MAX_DURATION_MINUTES}`,
      start,
    );
  }

  if (!Number.isFinite(input.energyLevel) || input.energyLevel < 0 || input.energyLevel > 100) {
    return invalidResult(input.referenceId, 'energyLevel must be 0-100', start);
  }

  if (!Number.isFinite(input.focusLevel) || input.focusLevel < 0 || input.focusLevel > 100) {
    return invalidResult(input.referenceId, 'focusLevel must be 0-100', start);
  }

  if (!Number.isFinite(input.stressLevel) || input.stressLevel < 0 || input.stressLevel > 100) {
    return invalidResult(input.referenceId, 'stressLevel must be 0-100', start);
  }

  if (!Number.isFinite(input.completionRate) || input.completionRate < 0 || input.completionRate > 100) {
    return invalidResult(input.referenceId, 'completionRate must be 0-100', start);
  }

  const warnings: string[] = [];
  if (input.durationMinutes === 0) warnings.push('durationMinutes is 0; readiness may be less representative.');
  if (input.stressLevel >= 85) warnings.push('High stress detected; consider recovery before high-load activity.');
  if (input.completionRate <= 20) warnings.push('Very low completionRate indicates unfinished context.');

  const profile = ACTIVITY_PROFILES[input.activity];
  const durationScore = clamp((input.durationMinutes / AKTIVITI_ALL_MAX_DURATION_MINUTES) * 100, 0, 100);
  const inverseStress = 100 - input.stressLevel;

  const baselineScore =
    input.energyLevel * 0.25 +
    input.focusLevel * 0.20 +
    inverseStress * 0.20 +
    input.completionRate * 0.25 +
    durationScore * 0.10;

  const profileFitScore =
    input.energyLevel * profile.energyBias +
    input.focusLevel * profile.focusBias +
    inverseStress * profile.stressTolerance;

  const readinessScore = Math.round(clamp(baselineScore * 0.70 + profileFitScore * 0.30, 0, 100) * 100) / 100;
  const status = resolveStatus(readinessScore);

  markEvaluation({ score: readinessScore, status });

  return {
    referenceId: input.referenceId ?? 'n/a',
    activity: input.activity,
    readinessScore,
    status,
    recommendation: buildRecommendation(profile.label, status),
    warnings,
    valid: true,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    disclaimer: AKTIVITI_ALL_DISCLAIMER,
  };
}

export function getAktivitiAllHealthReport(): AktivitiAllHealthReport {
  return {
    personaId: AKTIVITI_ALL_PERSONA_ID,
    displayName: AKTIVITI_ALL_DISPLAY_NAME,
    slug: AKTIVITI_ALL_SLUG,
    contractVersion: AKTIVITI_ALL_CONTRACT_VERSION,
    moduleVersion: AKTIVITI_ALL_MODULE_VERSION,
    linkedRepoImpact: AKTIVITI_ALL_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastReadinessScore,
    lastEvaluatedAt,
    supportedActivities: [...VALID_AKTIVITI_ALL_ACTIVITIES],
    performanceMaxMs: AKTIVITI_ALL_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: AKTIVITI_ALL_API_RESPONSE_MAX_MS,
  };
}

export function _resetAktivitiAllMetrics(): void {
  evaluations = 0;
  lastReadinessScore = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
