// SpajaUltraOmegaCore -∞Ω+∞ — DUET Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  DuetAction,
  DuetEnergyMatch,
  DuetHealthReport,
  DuetInput,
  DuetMode,
  DuetObjective,
  DuetResult,
  DuetStatus,
} from './types';
import {
  DUET_API_RESPONSE_MAX_MS,
  DUET_CONTRACT_VERSION,
  DUET_DISCLAIMER,
  DUET_DISPLAY_NAME,
  DUET_LINKED_REPO_IMPACT,
  DUET_MAX_SCORE,
  DUET_MAX_SHARED_WINDOW_HOURS,
  DUET_MIN_SCORE,
  DUET_MODULE_VERSION,
  DUET_PERFORMANCE_MAX_MS,
  DUET_PERSONA_ID,
  DUET_SLUG,
} from './types';
import {
  ACTION_TARGET_HOURS,
  ENERGY_MATCH_BASE_SCORE,
  MODE_BASE_SCORE,
  OBJECTIVE_BASE_BOOST,
  OBJECTIVE_TARGET_HOURS,
  VALID_DUET_ENERGY_MATCHES,
  VALID_DUET_MODES,
  VALID_DUET_OBJECTIVES,
} from './registry';

let evaluations = 0;
let lastStatus: DuetStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is DuetObjective {
  return typeof value === 'string' && VALID_DUET_OBJECTIVES.includes(value as DuetObjective);
}

function isMode(value: unknown): value is DuetMode {
  return typeof value === 'string' && VALID_DUET_MODES.includes(value as DuetMode);
}

function isEnergyMatch(value: unknown): value is DuetEnergyMatch {
  return typeof value === 'string' && VALID_DUET_ENERGY_MATCHES.includes(value as DuetEnergyMatch);
}

function recordEvaluation(status: DuetStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function isBoundedScore(value: number): boolean {
  return Number.isFinite(value) && value >= DUET_MIN_SCORE && value <= DUET_MAX_SCORE;
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): DuetResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    mode: null,
    energyMatch: null,
    alignmentScore: 0,
    resilienceScore: 0,
    timingScore: 0,
    harmonyScore: 0,
    overallScore: 0,
    status: 'DISSONANT',
    recommendedAction: 'RESET_EXPECTATIONS',
    recommendedWindowHours: 1,
    warnings: [warning],
    disclaimer: DUET_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeAlignmentScore(input: DuetInput): number {
  const raw =
    input.clarityScore * 0.28 +
    input.reciprocityScore * 0.22 +
    input.trustScore * 0.26 +
    input.rhythmScore * 0.16 +
    ENERGY_MATCH_BASE_SCORE[input.energyMatch] * 0.08;
  return round2(clamp(raw, DUET_MIN_SCORE, DUET_MAX_SCORE));
}

function computeResilienceScore(input: DuetInput): number {
  const raw =
    100 -
    input.tensionLevel * 0.48 +
    input.trustScore * 0.22 +
    input.reciprocityScore * 0.18 +
    (MODE_BASE_SCORE[input.mode] - 70) * 0.12;
  return round2(clamp(raw, DUET_MIN_SCORE, DUET_MAX_SCORE));
}

function computeTimingScore(input: DuetInput): number {
  const targetHours = OBJECTIVE_TARGET_HOURS[input.objective];
  const targetPenalty = Math.abs(input.sharedWindowHours - targetHours) / targetHours * 44;
  const modeBonus =
    input.mode === 'LIVE' ? 6 :
    input.mode === 'HYBRID' ? 4 :
    input.mode === 'RITUAL' ? 8 :
    0;
  const raw = 100 - targetPenalty - input.tensionLevel * 0.08 + modeBonus;
  return round2(clamp(raw, DUET_MIN_SCORE, DUET_MAX_SCORE));
}

function computeHarmonyScore(input: DuetInput): number {
  const raw =
    input.clarityScore * 0.18 +
    input.reciprocityScore * 0.22 +
    input.trustScore * 0.2 +
    input.rhythmScore * 0.25 +
    OBJECTIVE_BASE_BOOST[input.objective] +
    (ENERGY_MATCH_BASE_SCORE[input.energyMatch] - 60) * 0.15 -
    input.tensionLevel * 0.12;
  return round2(clamp(raw, DUET_MIN_SCORE, DUET_MAX_SCORE));
}

function resolveStatus(input: DuetInput, overallScore: number): DuetStatus {
  if (
    overallScore >= 82 &&
    input.trustScore >= 72 &&
    input.rhythmScore >= 70 &&
    input.tensionLevel <= 35 &&
    input.energyMatch !== 'LOW'
  ) return 'HARMONIZED';
  if (overallScore >= 64) return 'ALIGNED';
  if (overallScore >= 42) return 'FRAGILE';
  return 'DISSONANT';
}

function resolveRecommendedAction(input: DuetInput, status: DuetStatus): DuetAction {
  if (status === 'DISSONANT' || input.clarityScore < 45) return 'RESET_EXPECTATIONS';
  if (status === 'FRAGILE' || input.objective === 'REPAIR' || input.trustScore < 60) return 'RUN_CHECKIN';
  if (status === 'HARMONIZED') return 'LOCK_DUET';
  return 'START_SESSION';
}

function resolveRecommendedWindowHours(
  action: DuetAction,
  status: DuetStatus,
): number {
  const statusAdjustment =
    status === 'DISSONANT' ? 24 :
    status === 'FRAGILE' ? 6 :
    0;
  return clamp(
    ACTION_TARGET_HOURS[action] + statusAdjustment,
    1,
    DUET_MAX_SHARED_WINDOW_HOURS,
  );
}

function buildWarnings(input: DuetInput, status: DuetStatus, resilienceScore: number): string[] {
  const warnings: string[] = [];

  if (input.tensionLevel >= 80) {
    warnings.push('High tension may overpower the duet before stable synchronization is reached.');
  }

  if (input.trustScore < 40) {
    warnings.push('Trust is too low for a confident duet lock.');
  }

  if (input.objective === 'REPAIR' && input.rhythmScore < 50) {
    warnings.push('Repair-oriented duets need a steadier rhythm before recovery can hold.');
  }

  if (input.sharedWindowHours <= 4 && input.objective === 'DELIVER') {
    warnings.push('Very narrow shared window may block reliable delivery handoff.');
  }

  if (input.energyMatch === 'LOW' && input.mode === 'LIVE') {
    warnings.push('Low energy match can reduce live-session synchronization quality.');
  }

  if (status === 'DISSONANT' && resilienceScore < 35) {
    warnings.push('Current duet load is too unstable for consistent execution.');
  }

  return warnings;
}

export function evaluateDuet(input: DuetInput): DuetResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_DUET_OBJECTIVES.join(', ')}`, start);
  }

  if (!isMode(input.mode)) {
    return invalidResult(input.referenceId, `mode must be one of: ${VALID_DUET_MODES.join(', ')}`, start);
  }

  if (!isEnergyMatch(input.energyMatch)) {
    return invalidResult(
      input.referenceId,
      `energyMatch must be one of: ${VALID_DUET_ENERGY_MATCHES.join(', ')}`,
      start,
    );
  }

  if (!isBoundedScore(input.clarityScore)) {
    return invalidResult(input.referenceId, 'clarityScore must be within 0..100', start);
  }

  if (!isBoundedScore(input.reciprocityScore)) {
    return invalidResult(input.referenceId, 'reciprocityScore must be within 0..100', start);
  }

  if (!isBoundedScore(input.trustScore)) {
    return invalidResult(input.referenceId, 'trustScore must be within 0..100', start);
  }

  if (!isBoundedScore(input.rhythmScore)) {
    return invalidResult(input.referenceId, 'rhythmScore must be within 0..100', start);
  }

  if (!isBoundedScore(input.tensionLevel)) {
    return invalidResult(input.referenceId, 'tensionLevel must be within 0..100', start);
  }

  if (
    !Number.isInteger(input.sharedWindowHours) ||
    input.sharedWindowHours <= 0 ||
    input.sharedWindowHours > DUET_MAX_SHARED_WINDOW_HOURS
  ) {
    return invalidResult(
      input.referenceId,
      `sharedWindowHours must be an integer within 1..${DUET_MAX_SHARED_WINDOW_HOURS}`,
      start,
    );
  }

  const alignmentScore = computeAlignmentScore(input);
  const resilienceScore = computeResilienceScore(input);
  const timingScore = computeTimingScore(input);
  const harmonyScore = computeHarmonyScore(input);
  const overallScore = round2(
    clamp(
      alignmentScore * 0.3 +
      resilienceScore * 0.24 +
      timingScore * 0.18 +
      harmonyScore * 0.28,
      DUET_MIN_SCORE,
      DUET_MAX_SCORE,
    ),
  );
  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const recommendedWindowHours = resolveRecommendedWindowHours(recommendedAction, status);
  const warnings = buildWarnings(input, status, resilienceScore);

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    mode: input.mode,
    energyMatch: input.energyMatch,
    alignmentScore,
    resilienceScore,
    timingScore,
    harmonyScore,
    overallScore,
    status,
    recommendedAction,
    recommendedWindowHours,
    warnings,
    disclaimer: DUET_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getDuetHealthReport(): DuetHealthReport {
  return {
    personaId: DUET_PERSONA_ID,
    displayName: DUET_DISPLAY_NAME,
    slug: DUET_SLUG,
    contractVersion: DUET_CONTRACT_VERSION,
    moduleVersion: DUET_MODULE_VERSION,
    linkedRepoImpact: DUET_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_DUET_OBJECTIVES],
    performanceMaxMs: DUET_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DUET_API_RESPONSE_MAX_MS,
  };
}

export function _resetDuetMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
