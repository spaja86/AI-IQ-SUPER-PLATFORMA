// SpajaUltraOmegaCore -∞Ω+∞ — TRU Engine
// Kompanija SPAJA — Digitalna Industrija

import {
  TRU_API_RESPONSE_MAX_MS,
  TRU_CONTRACT_VERSION,
  TRU_DISCLAIMER,
  TRU_DISPLAY_NAME,
  TRU_LINKED_REPO_IMPACT,
  TRU_MAX_ESCALATION_COUNT,
  TRU_MAX_RESPONSE_LATENCY_HOURS,
  TRU_MAX_SCORE,
  TRU_MIN_SCORE,
  TRU_MODULE_VERSION,
  TRU_PERFORMANCE_MAX_MS,
  TRU_PERSONA_ID,
  TRU_SLUG,
} from './types';
import {
  ACTION_REVIEW_HOURS,
  CHANNEL_BASE_SCORE,
  EVIDENCE_BASE_SCORE,
  OBJECTIVE_BASE_BOOST,
  OBJECTIVE_TARGET_REVIEW_HOURS,
  VALID_TRU_CHANNELS,
  VALID_TRU_EVIDENCE_LEVELS,
  VALID_TRU_OBJECTIVES,
} from './registry';
import type {
  TruChannel,
  TruEvidenceLevel,
  TruHealthReport,
  TruInput,
  TruObjective,
  TruResult,
  TruStatus,
} from './types';

let evaluations = 0;
let lastStatus: TruStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is TruObjective {
  return typeof value === 'string' && VALID_TRU_OBJECTIVES.includes(value as TruObjective);
}

function isChannel(value: unknown): value is TruChannel {
  return typeof value === 'string' && VALID_TRU_CHANNELS.includes(value as TruChannel);
}

function isEvidenceLevel(value: unknown): value is TruEvidenceLevel {
  return typeof value === 'string' && VALID_TRU_EVIDENCE_LEVELS.includes(value as TruEvidenceLevel);
}

function recordEvaluation(status: TruStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): TruResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    channel: null,
    evidenceLevel: null,
    trustScore: 0,
    readinessScore: 0,
    stabilityScore: 0,
    pressureScore: 0,
    overallScore: 0,
    status: null,
    recommendedAction: null,
    recommendedReviewHours: ACTION_REVIEW_HOURS.REQUEST_EVIDENCE,
    warnings: [warning],
    disclaimer: TRU_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeTrustScore(input: TruInput): number {
  const raw =
    input.transparencyScore * 0.36 +
    input.reliabilityScore * 0.32 +
    input.reciprocityScore * 0.24 +
    EVIDENCE_BASE_SCORE[input.evidenceLevel] * 0.08;
  return round2(clamp(raw, TRU_MIN_SCORE, TRU_MAX_SCORE));
}

function computeReadinessScore(input: TruInput): number {
  const raw =
    input.reliabilityScore * 0.4 +
    input.transparencyScore * 0.24 +
    CHANNEL_BASE_SCORE[input.channel] * 0.12 +
    OBJECTIVE_BASE_BOOST[input.objective] -
    input.riskLevel * 0.18;
  return round2(clamp(raw, TRU_MIN_SCORE, TRU_MAX_SCORE));
}

function computeStabilityScore(input: TruInput): number {
  const targetHours = OBJECTIVE_TARGET_REVIEW_HOURS[input.objective];
  const latencyPenalty = Math.abs(input.responseLatencyHours - targetHours) / targetHours * 34;
  const escalationPenalty = input.escalationCount * 5.2;
  const raw = 100 - latencyPenalty - escalationPenalty + EVIDENCE_BASE_SCORE[input.evidenceLevel] * 0.06;
  return round2(clamp(raw, TRU_MIN_SCORE, TRU_MAX_SCORE));
}

function computePressureScore(input: TruInput): number {
  const raw =
    100 -
    input.riskLevel * 0.54 -
    input.escalationCount * 4.8 -
    input.responseLatencyHours * 0.08 +
    input.reciprocityScore * 0.22;
  return round2(clamp(raw, TRU_MIN_SCORE, TRU_MAX_SCORE));
}

function resolveStatus(input: TruInput, overallScore: number): TruStatus {
  if (
    (input.riskLevel >= 90 && input.evidenceLevel === 'NONE') ||
    (input.escalationCount >= 8 && input.transparencyScore < 40)
  ) return 'BLOCK';

  if (
    overallScore >= 80 &&
    input.riskLevel <= 32 &&
    input.evidenceLevel === 'STRONG' &&
    input.transparencyScore >= 75
  ) return 'TRUSTED';
  if (overallScore >= 64) return 'READY';
  if (overallScore >= 40) return 'CAUTION';
  return 'BLOCK';
}

function resolveRecommendedAction(input: TruInput, status: TruStatus): TruResult['recommendedAction'] {
  if (status === 'BLOCK' || input.evidenceLevel === 'NONE') return 'REQUEST_EVIDENCE';
  if (input.riskLevel >= 70 || input.escalationCount >= 5) return 'RUN_PILOT';
  if (status === 'CAUTION' || input.objective === 'VERIFY') return 'SCHEDULE_REVIEW';
  return 'PROCEED';
}

function resolveRecommendedReviewHours(
  action: NonNullable<TruResult['recommendedAction']>,
  status: TruStatus,
): number {
  const statusAdjustment =
    status === 'TRUSTED' ? -12 :
    status === 'BLOCK' ? 24 :
    status === 'CAUTION' ? 12 :
    0;

  const target = clamp(
    ACTION_REVIEW_HOURS[action] + statusAdjustment,
    1,
    TRU_MAX_RESPONSE_LATENCY_HOURS,
  );
  return target;
}

function buildWarnings(input: TruInput, status: TruStatus, pressureScore: number): string[] {
  const warnings: string[] = [];

  if (input.evidenceLevel === 'NONE') {
    warnings.push('Missing evidence increases trust and compliance risk.');
  }

  if (input.riskLevel >= 80) {
    warnings.push('Risk level is high and may block safe commitment.');
  }

  if (input.escalationCount >= 6) {
    warnings.push('Frequent escalations indicate unstable collaboration conditions.');
  }

  if (input.responseLatencyHours >= 168) {
    warnings.push('Very slow response latency can break trust continuity.');
  }

  if (input.transparencyScore < 35) {
    warnings.push('Transparency is too low for a reliable trust decision.');
  }

  if (status === 'BLOCK' && pressureScore < 35) {
    warnings.push('Pressure is too high and resilience is too low to proceed without remediation.');
  }

  return warnings;
}

export function evaluateTru(input: TruInput): TruResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_TRU_OBJECTIVES.join(', ')}`, start);
  }

  if (!isChannel(input.channel)) {
    return invalidResult(input.referenceId, `channel must be one of: ${VALID_TRU_CHANNELS.join(', ')}`, start);
  }

  if (!isEvidenceLevel(input.evidenceLevel)) {
    return invalidResult(input.referenceId, `evidenceLevel must be one of: ${VALID_TRU_EVIDENCE_LEVELS.join(', ')}`, start);
  }

  if (!Number.isFinite(input.transparencyScore) || input.transparencyScore < 0 || input.transparencyScore > 100) {
    return invalidResult(input.referenceId, 'transparencyScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.reliabilityScore) || input.reliabilityScore < 0 || input.reliabilityScore > 100) {
    return invalidResult(input.referenceId, 'reliabilityScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.reciprocityScore) || input.reciprocityScore < 0 || input.reciprocityScore > 100) {
    return invalidResult(input.referenceId, 'reciprocityScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.riskLevel) || input.riskLevel < 0 || input.riskLevel > 100) {
    return invalidResult(input.referenceId, 'riskLevel must be within 0..100', start);
  }

  if (
    !Number.isInteger(input.responseLatencyHours) ||
    input.responseLatencyHours < 0 ||
    input.responseLatencyHours > TRU_MAX_RESPONSE_LATENCY_HOURS
  ) {
    return invalidResult(
      input.referenceId,
      `responseLatencyHours must be an integer within 0..${TRU_MAX_RESPONSE_LATENCY_HOURS}`,
      start,
    );
  }

  if (
    !Number.isInteger(input.escalationCount) ||
    input.escalationCount < 0 ||
    input.escalationCount > TRU_MAX_ESCALATION_COUNT
  ) {
    return invalidResult(
      input.referenceId,
      `escalationCount must be an integer within 0..${TRU_MAX_ESCALATION_COUNT}`,
      start,
    );
  }

  const trustScore = computeTrustScore(input);
  const readinessScore = computeReadinessScore(input);
  const stabilityScore = computeStabilityScore(input);
  const pressureScore = computePressureScore(input);

  const overallScore = round2(
    clamp(
      trustScore * 0.35 + readinessScore * 0.27 + stabilityScore * 0.2 + pressureScore * 0.18,
      TRU_MIN_SCORE,
      TRU_MAX_SCORE,
    ),
  );

  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const recommendedReviewHours = resolveRecommendedReviewHours(recommendedAction, status);
  const warnings = buildWarnings(input, status, pressureScore);

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    channel: input.channel,
    evidenceLevel: input.evidenceLevel,
    trustScore,
    readinessScore,
    stabilityScore,
    pressureScore,
    overallScore,
    status,
    recommendedAction,
    recommendedReviewHours,
    warnings,
    disclaimer: TRU_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getTruHealthReport(): TruHealthReport {
  return {
    personaId: TRU_PERSONA_ID,
    displayName: TRU_DISPLAY_NAME,
    slug: TRU_SLUG,
    contractVersion: TRU_CONTRACT_VERSION,
    moduleVersion: TRU_MODULE_VERSION,
    linkedRepoImpact: TRU_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_TRU_OBJECTIVES],
    performanceMaxMs: TRU_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: TRU_API_RESPONSE_MAX_MS,
  };
}

export function _resetTruMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
