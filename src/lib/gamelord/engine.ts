// SpajaUltraOmegaCore -∞Ω+∞ — GAMELORD
// Kompanija SPAJA — Digitalna Industrija

import type { GamelordAction, GamelordHealthReport, GamelordInput, GamelordResult, GamelordStatus } from './types';
import {
  GAMELORD_API_RESPONSE_MAX_MS,
  GAMELORD_CONTRACT_VERSION,
  GAMELORD_DISCLAIMER,
  GAMELORD_DISPLAY_NAME,
  GAMELORD_MAX_ANOMALY_COUNT,
  GAMELORD_MAX_MATCH_DURATION_MS,
  GAMELORD_MAX_PENALTY_POINTS,
  GAMELORD_MAX_SCORE,
  GAMELORD_MIN_SCORE,
  GAMELORD_MODULE_VERSION,
  GAMELORD_PERFORMANCE_MAX_MS,
  GAMELORD_REQUIRED_OUTPUTS,
  GAMELORD_ROLLOUT_GUARDRAILS,
  GAMELORD_SCOPE,
  GAMELORD_SLUG,
} from './types';

let evaluations = 0;
let lastScore = 0;
let lastStatus: GamelordStatus = 'UNRANKED';
let lastEvaluatedAt: string | null = null;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function invalidResult(input: GamelordInput, warning: string, start: number): GamelordResult {
  return {
    referenceId: input.referenceId ?? 'n/a',
    valid: false,
    mode: null,
    status: 'UNRANKED',
    recommendedAction: 'TRAIN_CORE',
    dominanceScore: 0,
    disciplineScore: 0,
    stabilityScore: 0,
    warnings: [warning],
    durationMs: Date.now() - start,
    disclaimer: GAMELORD_DISCLAIMER,
  };
}

function resolveStatus(score: number): GamelordStatus {
  if (score >= 88) return 'GAMELORD';
  if (score >= 72) return 'WARMASTER';
  if (score >= 55) return 'CONTENDER';
  return 'UNRANKED';
}

function resolveAction(status: GamelordStatus): GamelordAction {
  if (status === 'GAMELORD') return 'HOLD_THRONE';
  if (status === 'WARMASTER') return 'PRESS_ADVANTAGE';
  if (status === 'CONTENDER') return 'STABILIZE';
  return 'TRAIN_CORE';
}

function isFiniteBoundedScore(value: number): boolean {
  return Number.isFinite(value) && value >= GAMELORD_MIN_SCORE && value <= GAMELORD_MAX_SCORE;
}

export function evaluateGamelord(input: GamelordInput): GamelordResult {
  const start = Date.now();

  if (!['SOLO', 'DUO', 'SQUAD'].includes(input.mode)) {
    return invalidResult(input, 'mode must be SOLO, DUO, or SQUAD', start);
  }

  if (!isFiniteBoundedScore(input.strategyScore)) {
    return invalidResult(input, 'strategyScore must be a finite score between 0 and 100', start);
  }
  if (!isFiniteBoundedScore(input.executionScore)) {
    return invalidResult(input, 'executionScore must be a finite score between 0 and 100', start);
  }
  if (!isFiniteBoundedScore(input.consistencyScore)) {
    return invalidResult(input, 'consistencyScore must be a finite score between 0 and 100', start);
  }
  if (!isFiniteBoundedScore(input.riskControlScore)) {
    return invalidResult(input, 'riskControlScore must be a finite score between 0 and 100', start);
  }

  if (!Number.isFinite(input.penaltyPoints) || input.penaltyPoints < 0 || input.penaltyPoints > GAMELORD_MAX_PENALTY_POINTS) {
    return invalidResult(input, `penaltyPoints must be a finite value between 0 and ${GAMELORD_MAX_PENALTY_POINTS}`, start);
  }

  if (!Number.isInteger(input.anomalyCount) || input.anomalyCount < 0 || input.anomalyCount > GAMELORD_MAX_ANOMALY_COUNT) {
    return invalidResult(input, `anomalyCount must be an integer between 0 and ${GAMELORD_MAX_ANOMALY_COUNT}`, start);
  }

  if (!Number.isFinite(input.matchDurationMs) || input.matchDurationMs < 0 || input.matchDurationMs > GAMELORD_MAX_MATCH_DURATION_MS) {
    return invalidResult(input, `matchDurationMs must be between 0 and ${GAMELORD_MAX_MATCH_DURATION_MS}`, start);
  }

  const dominanceBase =
    input.strategyScore * 0.35 +
    input.executionScore * 0.35 +
    input.consistencyScore * 0.2 +
    input.riskControlScore * 0.1;

  const disciplineScore = clamp(
    100 - input.penaltyPoints * 0.7 - input.anomalyCount * 4,
    GAMELORD_MIN_SCORE,
    GAMELORD_MAX_SCORE,
  );

  const modeStabilityMultiplier = input.mode === 'SOLO' ? 0.98 : input.mode === 'DUO' ? 1 : 1.03;
  const stabilityScore = clamp(
    (input.consistencyScore * 0.55 + input.riskControlScore * 0.45) * modeStabilityMultiplier,
    GAMELORD_MIN_SCORE,
    GAMELORD_MAX_SCORE,
  );

  const dominanceScore = clamp(
    dominanceBase * 0.7 + disciplineScore * 0.15 + stabilityScore * 0.15,
    GAMELORD_MIN_SCORE,
    GAMELORD_MAX_SCORE,
  );

  const warnings: string[] = [];
  if (input.penaltyPoints > 40) warnings.push('penalty pressure is high');
  if (input.anomalyCount > 3) warnings.push('anomaly count exceeds healthy threshold');
  if (input.riskControlScore < 50) warnings.push('risk control is below minimum stability threshold');
  if (input.matchDurationMs > 900000) warnings.push('long match duration may reduce consistency');

  const finalDominance = round(dominanceScore);
  const status = resolveStatus(finalDominance);
  const recommendedAction = resolveAction(status);

  evaluations += 1;
  lastScore = finalDominance;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    valid: true,
    mode: input.mode,
    status,
    recommendedAction,
    dominanceScore: finalDominance,
    disciplineScore: round(disciplineScore),
    stabilityScore: round(stabilityScore),
    warnings,
    durationMs: Date.now() - start,
    disclaimer: GAMELORD_DISCLAIMER,
  };
}

export function getGamelordHealthReport(): GamelordHealthReport {
  return {
    slug: GAMELORD_SLUG,
    displayName: GAMELORD_DISPLAY_NAME,
    contractVersion: GAMELORD_CONTRACT_VERSION,
    moduleVersion: GAMELORD_MODULE_VERSION,
    scope: GAMELORD_SCOPE,
    evaluations,
    lastScore,
    lastStatus,
    lastEvaluatedAt,
    performanceMaxMs: GAMELORD_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: GAMELORD_API_RESPONSE_MAX_MS,
    requiredOutputs: GAMELORD_REQUIRED_OUTPUTS,
    rolloutGuardrails: GAMELORD_ROLLOUT_GUARDRAILS,
  };
}

export function _resetGamelordMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastStatus = 'UNRANKED';
  lastEvaluatedAt = null;
}
