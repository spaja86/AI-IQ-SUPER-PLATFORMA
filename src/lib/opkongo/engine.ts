// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  OpkongoChannel,
  OpkongoHealthReport,
  OpkongoInput,
  OpkongoObjective,
  OpkongoRelationshipTemperature,
  OpkongoResult,
  OpkongoStatus,
} from './types';
import {
  OPKONGO_API_RESPONSE_MAX_MS,
  OPKONGO_CONTRACT_VERSION,
  OPKONGO_DISCLAIMER,
  OPKONGO_DISPLAY_NAME,
  OPKONGO_LINKED_REPO_IMPACT,
  OPKONGO_MAX_FOLLOW_UP_COUNT,
  OPKONGO_MAX_SCORE,
  OPKONGO_MAX_TIME_WINDOW_HOURS,
  OPKONGO_MIN_SCORE,
  OPKONGO_MODULE_VERSION,
  OPKONGO_PERFORMANCE_MAX_MS,
  OPKONGO_PERSONA_ID,
  OPKONGO_SLUG,
} from './types';
import {
  ACTION_TARGET_HOURS,
  CHANNEL_BASE_SCORE,
  OBJECTIVE_BASE_BOOST,
  OBJECTIVE_TARGET_HOURS,
  TEMPERATURE_BASE_SCORE,
  VALID_OPKONGO_CHANNELS,
  VALID_OPKONGO_OBJECTIVES,
  VALID_OPKONGO_RELATIONSHIP_TEMPERATURES,
} from './registry';

let evaluations = 0;
let lastStatus: OpkongoStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is OpkongoObjective {
  return typeof value === 'string' && VALID_OPKONGO_OBJECTIVES.includes(value as OpkongoObjective);
}

function isChannel(value: unknown): value is OpkongoChannel {
  return typeof value === 'string' && VALID_OPKONGO_CHANNELS.includes(value as OpkongoChannel);
}

function isRelationshipTemperature(value: unknown): value is OpkongoRelationshipTemperature {
  return (
    typeof value === 'string' &&
    VALID_OPKONGO_RELATIONSHIP_TEMPERATURES.includes(value as OpkongoRelationshipTemperature)
  );
}

function recordEvaluation(status: OpkongoStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): OpkongoResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    channel: null,
    relationshipTemperature: null,
    readinessScore: 0,
    alignmentScore: 0,
    timingScore: 0,
    pressureScore: 0,
    overallScore: 0,
    status: 'HOLD',
    recommendedAction: 'REFINE_BRIEF',
    recommendedWindowHours: 0,
    warnings: [warning],
    disclaimer: OPKONGO_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeReadinessScore(input: OpkongoInput): number {
  const raw =
    input.clarityScore * 0.4 +
    input.leverageScore * 0.2 +
    input.trustScore * 0.24 +
    OBJECTIVE_BASE_BOOST[input.objective] +
    (TEMPERATURE_BASE_SCORE[input.relationshipTemperature] - 60) * 0.2;
  return round2(clamp(raw, OPKONGO_MIN_SCORE, OPKONGO_MAX_SCORE));
}

function computeAlignmentScore(input: OpkongoInput): number {
  const raw =
    input.trustScore * 0.44 +
    input.clarityScore * 0.24 +
    input.leverageScore * 0.14 +
    CHANNEL_BASE_SCORE[input.channel] * 0.1 +
    TEMPERATURE_BASE_SCORE[input.relationshipTemperature] * 0.08;
  return round2(clamp(raw, OPKONGO_MIN_SCORE, OPKONGO_MAX_SCORE));
}

function computeTimingScore(input: OpkongoInput): number {
  const targetHours = OBJECTIVE_TARGET_HOURS[input.objective];
  const targetPenalty = Math.abs(input.timeWindowHours - targetHours) / targetHours * 42;
  const asyncBonus = input.channel === 'ASYNC' ? 4 : 0;
  const raw = 100 - targetPenalty - input.urgencyLevel * 0.15 - input.followUpCount * 2.5 + asyncBonus;
  return round2(clamp(raw, OPKONGO_MIN_SCORE, OPKONGO_MAX_SCORE));
}

function computePressureScore(input: OpkongoInput): number {
  const raw =
    100 -
    input.urgencyLevel * 0.52 -
    input.followUpCount * 4 +
    input.trustScore * 0.18 +
    input.leverageScore * 0.12;
  return round2(clamp(raw, OPKONGO_MIN_SCORE, OPKONGO_MAX_SCORE));
}

function resolveStatus(input: OpkongoInput, overallScore: number): OpkongoStatus {
  if (
    overallScore >= 80 &&
    input.trustScore >= 75 &&
    input.clarityScore >= 70 &&
    input.relationshipTemperature !== 'COLD'
  ) return 'COMMIT';
  if (overallScore >= 63) return 'ENGAGE';
  if (overallScore >= 40) return 'PREP';
  return 'HOLD';
}

function resolveRecommendedAction(input: OpkongoInput, status: OpkongoStatus): OpkongoResult['recommendedAction'] {
  if (status === 'HOLD' || input.clarityScore < 45) return 'REFINE_BRIEF';
  if (input.objective === 'CLOSING' && input.trustScore >= 60) return 'CLOSE_NEXT_STEP';
  if (input.objective === 'NEGOTIATION' || input.channel === 'MEETING') return 'BOOK_CALL';
  if (input.objective === 'FOLLOW_UP' && input.followUpCount >= 2 && status !== 'PREP') return 'BOOK_CALL';
  return 'SEND_OUTREACH';
}

function resolveRecommendedWindowHours(
  input: OpkongoInput,
  action: OpkongoResult['recommendedAction'],
  status: OpkongoStatus,
): number {
  const statusAdjustment =
    status === 'COMMIT' ? -6 :
    status === 'HOLD' ? 24 :
    status === 'PREP' ? 6 :
    0;
  const target = clamp(ACTION_TARGET_HOURS[action] + statusAdjustment, 1, OPKONGO_MAX_TIME_WINDOW_HOURS);
  return Math.min(input.timeWindowHours, target);
}

function buildWarnings(
  input: OpkongoInput,
  status: OpkongoStatus,
  pressureScore: number,
): string[] {
  const warnings: string[] = [];

  if (input.urgencyLevel >= 85 && input.trustScore < 50) {
    warnings.push('High urgency with limited trust may create commitment risk.');
  }

  if (input.objective === 'CLOSING' && input.relationshipTemperature === 'COLD') {
    warnings.push('Closing on a cold relationship usually needs a warmer handoff first.');
  }

  if (input.followUpCount >= 6 && input.channel === 'EMAIL') {
    warnings.push('Repeated email follow-ups may reduce response quality.');
  }

  if (input.timeWindowHours <= 6 && input.objective === 'NEGOTIATION') {
    warnings.push('Very narrow time window may block negotiation prep.');
  }

  if (input.clarityScore < 40) {
    warnings.push('Offer clarity is too low for confident progression.');
  }

  if (status === 'HOLD' && pressureScore < 35) {
    warnings.push('Current urgency/follow-up pressure is working against OPKONGO progression.');
  }

  if (input.objective === 'FOLLOW_UP' && input.relationshipTemperature === 'COLD' && input.followUpCount === 0) {
    warnings.push('FOLLOW_UP on a cold relationship usually needs an initial outreach step first.');
  }

  return warnings;
}

export function evaluateOpkongo(input: OpkongoInput): OpkongoResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_OPKONGO_OBJECTIVES.join(', ')}`, start);
  }

  if (!isChannel(input.channel)) {
    return invalidResult(input.referenceId, `channel must be one of: ${VALID_OPKONGO_CHANNELS.join(', ')}`, start);
  }

  if (!isRelationshipTemperature(input.relationshipTemperature)) {
    return invalidResult(
      input.referenceId,
      `relationshipTemperature must be one of: ${VALID_OPKONGO_RELATIONSHIP_TEMPERATURES.join(', ')}`,
      start,
    );
  }

  if (!Number.isFinite(input.clarityScore) || input.clarityScore < 0 || input.clarityScore > 100) {
    return invalidResult(input.referenceId, 'clarityScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.leverageScore) || input.leverageScore < 0 || input.leverageScore > 100) {
    return invalidResult(input.referenceId, 'leverageScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.trustScore) || input.trustScore < 0 || input.trustScore > 100) {
    return invalidResult(input.referenceId, 'trustScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.urgencyLevel) || input.urgencyLevel < 0 || input.urgencyLevel > 100) {
    return invalidResult(input.referenceId, 'urgencyLevel must be within 0..100', start);
  }

  if (!Number.isInteger(input.followUpCount) || input.followUpCount < 0 || input.followUpCount > OPKONGO_MAX_FOLLOW_UP_COUNT) {
    return invalidResult(
      input.referenceId,
      `followUpCount must be an integer within 0..${OPKONGO_MAX_FOLLOW_UP_COUNT}`,
      start,
    );
  }

  if (!Number.isInteger(input.timeWindowHours) || input.timeWindowHours <= 0 || input.timeWindowHours > OPKONGO_MAX_TIME_WINDOW_HOURS) {
    return invalidResult(
      input.referenceId,
      `timeWindowHours must be an integer within 1..${OPKONGO_MAX_TIME_WINDOW_HOURS}`,
      start,
    );
  }

  const readinessScore = computeReadinessScore(input);
  const alignmentScore = computeAlignmentScore(input);
  const timingScore = computeTimingScore(input);
  const pressureScore = computePressureScore(input);
  const overallScore = round2(
    clamp(
      readinessScore * 0.34 + alignmentScore * 0.28 + timingScore * 0.18 + pressureScore * 0.2,
      OPKONGO_MIN_SCORE,
      OPKONGO_MAX_SCORE,
    ),
  );
  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const recommendedWindowHours = resolveRecommendedWindowHours(input, recommendedAction, status);
  const warnings = buildWarnings(input, status, pressureScore);

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    channel: input.channel,
    relationshipTemperature: input.relationshipTemperature,
    readinessScore,
    alignmentScore,
    timingScore,
    pressureScore,
    overallScore,
    status,
    recommendedAction,
    recommendedWindowHours,
    warnings,
    disclaimer: OPKONGO_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getOpkongoHealthReport(): OpkongoHealthReport {
  return {
    personaId: OPKONGO_PERSONA_ID,
    displayName: OPKONGO_DISPLAY_NAME,
    slug: OPKONGO_SLUG,
    contractVersion: OPKONGO_CONTRACT_VERSION,
    moduleVersion: OPKONGO_MODULE_VERSION,
    linkedRepoImpact: OPKONGO_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_OPKONGO_OBJECTIVES],
    performanceMaxMs: OPKONGO_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: OPKONGO_API_RESPONSE_MAX_MS,
  };
}

export function _resetOpkongoMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
