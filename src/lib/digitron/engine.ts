// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  DigitronAction,
  DigitronHealthReport,
  DigitronInput,
  DigitronMode,
  DigitronResult,
  DigitronStatus,
} from './types';
import {
  DIGITRON_API_RESPONSE_MAX_MS,
  DIGITRON_CONTRACT_VERSION,
  DIGITRON_DISCLAIMER,
  DIGITRON_DISPLAY_NAME,
  DIGITRON_LINKED_REPO_IMPACT,
  DIGITRON_LOOKUP_MAX_MS,
  DIGITRON_MAX_LATENCY_MS,
  DIGITRON_MAX_SCORE,
  DIGITRON_MIN_SCORE,
  DIGITRON_MODULE_VERSION,
  DIGITRON_PERFORMANCE_MAX_MS,
  DIGITRON_PERSONA_ID,
  DIGITRON_SLUG,
  DIGITRON_SUCCESSOR_OF,
} from './types';
import {
  DIGITRON_MODE_BASE_BOOST,
  getDigitronDescriptor,
  VALID_DIGITRON_MODES,
} from './registry';

let evaluations = 0;
let lastStatus: DigitronStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isBoundedScore(value: number): boolean {
  return Number.isFinite(value) && value >= DIGITRON_MIN_SCORE && value <= DIGITRON_MAX_SCORE;
}

function isMode(value: unknown): value is DigitronMode {
  return typeof value === 'string' && VALID_DIGITRON_MODES.includes(value as DigitronMode);
}

function recordEvaluation(status: DigitronStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): DigitronResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    digit: null,
    mode: null,
    descriptor: null,
    coherenceScore: 0,
    stabilityScore: 0,
    latencyScore: 0,
    overallScore: 0,
    status: 'LEGACY_FALLBACK',
    recommendedAction: 'FALLBACK_COMPAT',
    warnings: [warning],
    disclaimer: DIGITRON_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function resolveStatus(overallScore: number): DigitronStatus {
  if (overallScore >= 85) return 'STELLAR';
  if (overallScore >= 68) return 'SYNCHRONIZED';
  if (overallScore >= 45) return 'TRANSITIONAL';
  return 'LEGACY_FALLBACK';
}

function resolveRecommendedAction(status: DigitronStatus): DigitronAction {
  if (status === 'STELLAR') return 'SCALE_NATIVE';
  if (status === 'SYNCHRONIZED') return 'LOCK_SYNC';
  if (status === 'TRANSITIONAL') return 'RECALIBRATE';
  return 'FALLBACK_COMPAT';
}

export function evaluateDigitron(input: DigitronInput): DigitronResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isMode(input.mode)) {
    return invalidResult(input.referenceId, `mode must be one of: ${VALID_DIGITRON_MODES.join(', ')}`, start);
  }

  const descriptor = getDigitronDescriptor(input.digit);
  if (!descriptor) {
    return invalidResult(input.referenceId, 'digit must be an integer within 0..9', start);
  }

  if (!isBoundedScore(input.signalStrength)) {
    return invalidResult(input.referenceId, 'signalStrength must be within 0..100', start);
  }

  if (!isBoundedScore(input.syncScore)) {
    return invalidResult(input.referenceId, 'syncScore must be within 0..100', start);
  }

  if (!isBoundedScore(input.resilienceScore)) {
    return invalidResult(input.referenceId, 'resilienceScore must be within 0..100', start);
  }

  if (
    !Number.isFinite(input.latencyMs) ||
    input.latencyMs < DIGITRON_MIN_SCORE ||
    input.latencyMs > DIGITRON_MAX_LATENCY_MS
  ) {
    return invalidResult(input.referenceId, `latencyMs must be within 0..${DIGITRON_MAX_LATENCY_MS}`, start);
  }

  const latencyScore = round2(clamp(DIGITRON_MAX_SCORE - input.latencyMs / 2, DIGITRON_MIN_SCORE, DIGITRON_MAX_SCORE));
  const coherenceRaw =
    input.signalStrength * 0.34 +
    input.syncScore * 0.28 +
    input.resilienceScore * 0.24 +
    latencyScore * 0.14 +
    descriptor.octave * 0.4 +
    DIGITRON_MODE_BASE_BOOST[input.mode];
  const coherenceScore = round2(clamp(coherenceRaw, DIGITRON_MIN_SCORE, DIGITRON_MAX_SCORE));
  const stabilityRaw =
    input.syncScore * 0.4 +
    input.resilienceScore * 0.3 +
    latencyScore * 0.2 +
    input.signalStrength * 0.1 +
    descriptor.id * 0.5;
  const stabilityScore = round2(clamp(stabilityRaw, DIGITRON_MIN_SCORE, DIGITRON_MAX_SCORE));
  const overallScore = round2(
    clamp(
      coherenceScore * 0.46 +
      stabilityScore * 0.34 +
      latencyScore * 0.2,
      DIGITRON_MIN_SCORE,
      DIGITRON_MAX_SCORE,
    ),
  );

  const status = resolveStatus(overallScore);
  const recommendedAction = resolveRecommendedAction(status);
  const warnings: string[] = [];

  if (input.latencyMs > 160) warnings.push('Latency is high and may force legacy fallback behavior.');
  if (input.mode === 'LEGACY' && input.digit >= 8) warnings.push('High digit layers are underused while LEGACY mode is active.');
  if (input.signalStrength < 35) warnings.push('Signal strength is weak for stable symbolic synchronization.');
  if (input.syncScore < 40) warnings.push('Sync score is below safe lock threshold.');

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    digit: descriptor.id,
    mode: input.mode,
    descriptor,
    coherenceScore,
    stabilityScore,
    latencyScore,
    overallScore,
    status,
    recommendedAction,
    warnings,
    disclaimer: DIGITRON_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getDigitronHealthReport(): DigitronHealthReport {
  return {
    personaId: DIGITRON_PERSONA_ID,
    displayName: DIGITRON_DISPLAY_NAME,
    slug: DIGITRON_SLUG,
    successorOf: DIGITRON_SUCCESSOR_OF,
    contractVersion: DIGITRON_CONTRACT_VERSION,
    moduleVersion: DIGITRON_MODULE_VERSION,
    linkedRepoImpact: DIGITRON_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedModes: [...VALID_DIGITRON_MODES],
    lookupMaxMs: DIGITRON_LOOKUP_MAX_MS,
    evaluationMaxMs: DIGITRON_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DIGITRON_API_RESPONSE_MAX_MS,
  };
}

export function _resetDigitronMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
