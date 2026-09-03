// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  PilotrelaxEnvironment,
  PilotrelaxHealthReport,
  PilotrelaxInput,
  PilotrelaxObjective,
  PilotrelaxProtocol,
  PilotrelaxResult,
  PilotrelaxStatus,
} from './types';
import {
  PILOTRELAX_API_RESPONSE_MAX_MS,
  PILOTRELAX_CONTRACT_VERSION,
  PILOTRELAX_DISCLAIMER,
  PILOTRELAX_DISPLAY_NAME,
  PILOTRELAX_LINKED_REPO_IMPACT,
  PILOTRELAX_MAX_AVAILABLE_MINUTES,
  PILOTRELAX_MAX_BREATHING_CYCLES,
  PILOTRELAX_MAX_NOISE_LEVEL_DB,
  PILOTRELAX_MAX_SCORE,
  PILOTRELAX_MAX_SCREEN_MINUTES,
  PILOTRELAX_MIN_SCORE,
  PILOTRELAX_MODULE_VERSION,
  PILOTRELAX_PERFORMANCE_MAX_MS,
  PILOTRELAX_PERSONA_ID,
  PILOTRELAX_SLUG,
} from './types';
import {
  ENVIRONMENT_BASE_SCORE,
  OBJECTIVE_BASE_BOOST,
  PHASE_RECOVERY_BONUS,
  PROTOCOL_TARGET_MINUTES,
  VALID_PILOTRELAX_ENVIRONMENTS,
  VALID_PILOTRELAX_OBJECTIVES,
  VALID_PILOTRELAX_PHASES,
} from './registry';

let evaluations = 0;
let lastStatus: PilotrelaxStatus = 'GROUNDED';
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is PilotrelaxObjective {
  return typeof value === 'string' && VALID_PILOTRELAX_OBJECTIVES.includes(value as PilotrelaxObjective);
}

function isEnvironment(value: unknown): value is PilotrelaxEnvironment {
  return typeof value === 'string' && VALID_PILOTRELAX_ENVIRONMENTS.includes(value as PilotrelaxEnvironment);
}

function isPhase(value: unknown): value is PilotrelaxInput['phaseOfDay'] {
  return typeof value === 'string' && VALID_PILOTRELAX_PHASES.includes(value as PilotrelaxInput['phaseOfDay']);
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): PilotrelaxResult {
  return {
    referenceId: referenceId ?? 'n/a',
    objective: 'RESET',
    environment: 'HOME',
    phaseOfDay: 'EVENING',
    calmScore: 0,
    breathingScore: 0,
    environmentScore: 0,
    focusScore: 0,
    overallScore: 0,
    status: 'GROUNDED',
    recommendedProtocol: 'BREATH_RESET',
    recommendedMinutes: 0,
    warnings: [warning],
    disclaimer: PILOTRELAX_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeCalmScore(input: PilotrelaxInput): number {
  const raw =
    100 -
    input.stressLoad * 0.68 +
    input.availableMinutes * 0.24 +
    input.breathingCycles * 0.55 +
    OBJECTIVE_BASE_BOOST[input.objective] +
    PHASE_RECOVERY_BONUS[input.phaseOfDay];
  return round2(clamp(raw, PILOTRELAX_MIN_SCORE, PILOTRELAX_MAX_SCORE));
}

function computeBreathingScore(input: PilotrelaxInput): number {
  const screenPenalty = input.objective === 'SLEEP' ? input.screenMinutesBeforeBreak * 0.18 : input.screenMinutesBeforeBreak * 0.08;
  const raw =
    input.breathingCycles * 1.7 +
    input.availableMinutes * 0.35 +
    OBJECTIVE_BASE_BOOST[input.objective] -
    screenPenalty;
  return round2(clamp(raw, PILOTRELAX_MIN_SCORE, PILOTRELAX_MAX_SCORE));
}

function computeEnvironmentScore(input: PilotrelaxInput): number {
  const phaseBonus =
    input.environment === 'HOME' || input.environment === 'LOUNGE'
      ? PHASE_RECOVERY_BONUS[input.phaseOfDay]
      : PHASE_RECOVERY_BONUS[input.phaseOfDay] * 0.5;
  const raw = ENVIRONMENT_BASE_SCORE[input.environment] + phaseBonus - Math.max(input.noiseLevelDb - 35, 0) * 1.15;
  return round2(clamp(raw, PILOTRELAX_MIN_SCORE, PILOTRELAX_MAX_SCORE));
}

function computeFocusScore(input: PilotrelaxInput): number {
  const objectiveBonus = input.objective === 'FOCUS' ? 18 : input.objective === 'RESET' ? 8 : 4;
  const nightPenalty = input.phaseOfDay === 'NIGHT' && input.objective === 'FOCUS' ? 8 : 0;
  const raw =
    100 -
    input.screenMinutesBeforeBreak * 0.3 -
    input.stressLoad * 0.22 +
    input.availableMinutes * 0.14 +
    objectiveBonus -
    nightPenalty;
  return round2(clamp(raw, PILOTRELAX_MIN_SCORE, PILOTRELAX_MAX_SCORE));
}

function resolveStatus(input: PilotrelaxInput, overallScore: number): PilotrelaxStatus {
  if (overallScore >= 82 && input.stressLoad <= 35 && input.noiseLevelDb <= 55) return 'DEEP_RESET';
  if (overallScore >= 64) return 'CALM';
  if (overallScore >= 42) return 'STEADY';
  return 'GROUNDED';
}

function resolveProtocol(input: PilotrelaxInput, status: PilotrelaxStatus): PilotrelaxProtocol {
  if (input.objective === 'SLEEP') return 'SLEEP_WINDDOWN';
  if (input.objective === 'FOCUS') return 'SILENT_RESET';
  if (input.objective === 'RECOVERY') return input.availableMinutes >= 18 && status !== 'GROUNDED' ? 'WALK_RESET' : 'BREATH_RESET';
  if (input.environment === 'OUTDOOR' && status !== 'GROUNDED') return 'WALK_RESET';
  return 'BREATH_RESET';
}

function resolveRecommendedMinutes(
  input: PilotrelaxInput,
  protocol: PilotrelaxProtocol,
  status: PilotrelaxStatus,
): number {
  const statusAdjustment =
    status === 'DEEP_RESET' ? 5 :
    status === 'GROUNDED' ? -2 :
    0;
  const target = clamp(PROTOCOL_TARGET_MINUTES[protocol] + statusAdjustment, 1, PILOTRELAX_MAX_AVAILABLE_MINUTES);
  return Math.min(input.availableMinutes, target);
}

function buildWarnings(
  input: PilotrelaxInput,
  status: PilotrelaxStatus,
  environmentScore: number,
  focusScore: number,
): string[] {
  const warnings: string[] = [];

  if (input.noiseLevelDb >= 75) {
    warnings.push(`Noise level ${input.noiseLevelDb}dB is high for stable relaxation.`);
  }

  if (input.stressLoad >= 85 && input.availableMinutes < 10) {
    warnings.push('High stress with less than 10 available minutes may limit calm-down effectiveness.');
  }

  if (input.objective === 'SLEEP' && input.screenMinutesBeforeBreak > 90) {
    warnings.push('Screen exposure is high for a sleep wind-down protocol.');
  }

  if (input.environment === 'COCKPIT' && input.objective === 'SLEEP') {
    warnings.push('SLEEP protocol should be scheduled after landing, not during active cockpit operations.');
  }

  if (input.breathingCycles === 0 && (input.objective === 'RESET' || input.objective === 'RECOVERY')) {
    warnings.push('At least a few breathing cycles improve RESET and RECOVERY outcomes.');
  }

  if (status === 'GROUNDED' && environmentScore < 35) {
    warnings.push('Environment conditions are currently working against relaxation goals.');
  }

  if (input.objective === 'FOCUS' && focusScore < 40) {
    warnings.push('Current screen/stress profile is weak for focus restoration.');
  }

  return warnings;
}

export function evaluatePilotrelax(input: PilotrelaxInput): PilotrelaxResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_PILOTRELAX_OBJECTIVES.join(', ')}`, start);
  }

  if (!isEnvironment(input.environment)) {
    return invalidResult(
      input.referenceId,
      `environment must be one of: ${VALID_PILOTRELAX_ENVIRONMENTS.join(', ')}`,
      start,
    );
  }

  if (!isPhase(input.phaseOfDay)) {
    return invalidResult(input.referenceId, `phaseOfDay must be one of: ${VALID_PILOTRELAX_PHASES.join(', ')}`, start);
  }

  if (!Number.isFinite(input.stressLoad) || input.stressLoad < 0 || input.stressLoad > 100) {
    return invalidResult(input.referenceId, 'stressLoad must be within 0..100', start);
  }

  if (!Number.isFinite(input.availableMinutes) || input.availableMinutes <= 0 || input.availableMinutes > PILOTRELAX_MAX_AVAILABLE_MINUTES) {
    return invalidResult(
      input.referenceId,
      `availableMinutes must be within 1..${PILOTRELAX_MAX_AVAILABLE_MINUTES}`,
      start,
    );
  }

  if (!Number.isInteger(input.breathingCycles) || input.breathingCycles < 0 || input.breathingCycles > PILOTRELAX_MAX_BREATHING_CYCLES) {
    return invalidResult(
      input.referenceId,
      `breathingCycles must be an integer within 0..${PILOTRELAX_MAX_BREATHING_CYCLES}`,
      start,
    );
  }

  if (!Number.isFinite(input.noiseLevelDb) || input.noiseLevelDb < 0 || input.noiseLevelDb > PILOTRELAX_MAX_NOISE_LEVEL_DB) {
    return invalidResult(
      input.referenceId,
      `noiseLevelDb must be within 0..${PILOTRELAX_MAX_NOISE_LEVEL_DB}`,
      start,
    );
  }

  if (!Number.isFinite(input.screenMinutesBeforeBreak) || input.screenMinutesBeforeBreak < 0 || input.screenMinutesBeforeBreak > PILOTRELAX_MAX_SCREEN_MINUTES) {
    return invalidResult(
      input.referenceId,
      `screenMinutesBeforeBreak must be within 0..${PILOTRELAX_MAX_SCREEN_MINUTES}`,
      start,
    );
  }

  const calmScore = computeCalmScore(input);
  const breathingScore = computeBreathingScore(input);
  const environmentScore = computeEnvironmentScore(input);
  const focusScore = computeFocusScore(input);
  const overallScore = round2(
    clamp(
      calmScore * 0.32 +
      breathingScore * 0.28 +
      environmentScore * 0.2 +
      focusScore * 0.2,
      PILOTRELAX_MIN_SCORE,
      PILOTRELAX_MAX_SCORE,
    ),
  );
  const status = resolveStatus(input, overallScore);
  const recommendedProtocol = resolveProtocol(input, status);
  const recommendedMinutes = resolveRecommendedMinutes(input, recommendedProtocol, status);
  const warnings = buildWarnings(input, status, environmentScore, focusScore);

  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    environment: input.environment,
    phaseOfDay: input.phaseOfDay,
    calmScore,
    breathingScore,
    environmentScore,
    focusScore,
    overallScore,
    status,
    recommendedProtocol,
    recommendedMinutes,
    warnings,
    disclaimer: PILOTRELAX_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getPilotrelaxHealthReport(): PilotrelaxHealthReport {
  return {
    personaId: PILOTRELAX_PERSONA_ID,
    displayName: PILOTRELAX_DISPLAY_NAME,
    slug: PILOTRELAX_SLUG,
    contractVersion: PILOTRELAX_CONTRACT_VERSION,
    moduleVersion: PILOTRELAX_MODULE_VERSION,
    linkedRepoImpact: PILOTRELAX_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_PILOTRELAX_OBJECTIVES],
    performanceMaxMs: PILOTRELAX_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: PILOTRELAX_API_RESPONSE_MAX_MS,
  };
}

export function _resetPilotrelaxMetrics(): void {
  evaluations = 0;
  lastStatus = 'GROUNDED';
  lastEvaluatedAt = null;
}
