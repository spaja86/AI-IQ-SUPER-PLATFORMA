// SpajaUltraOmegaCore -∞Ω+∞ — NUDE Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  NudeEnvironment,
  NudeHealthReport,
  NudeInput,
  NudeMode,
  NudePriority,
  NudeResult,
  NudeStatus,
} from './types';
import {
  NUDE_API_RESPONSE_MAX_MS,
  NUDE_CONTRACT_VERSION,
  NUDE_DISCLAIMER,
  NUDE_DISPLAY_NAME,
  NUDE_LINKED_REPO_IMPACT,
  NUDE_MAX_CONTEXT_LOAD,
  NUDE_MAX_SCORE,
  NUDE_MAX_SESSION_MINUTES,
  NUDE_MAX_STRESS_LEVEL,
  NUDE_MIN_SCORE,
  NUDE_MODULE_VERSION,
  NUDE_PERFORMANCE_MAX_MS,
  NUDE_PERSONA_ID,
  NUDE_SLUG,
} from './types';

const MODES = ['RESET', 'FOCUS', 'RECOVERY', 'SOCIAL'] as const;
const ENVIRONMENTS = ['HOME', 'WORK', 'TRANSIT', 'OUTDOOR'] as const;
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;

const MODE_CLARITY_BONUS: Record<NudeMode, number> = {
  RESET: 6,
  FOCUS: 10,
  RECOVERY: 4,
  SOCIAL: 2,
};

const MODE_RECOVERY_BONUS: Record<NudeMode, number> = {
  RESET: 18,
  FOCUS: -4,
  RECOVERY: 16,
  SOCIAL: 0,
};

const ENVIRONMENT_REGULATION_BONUS: Record<NudeEnvironment, number> = {
  HOME: 10,
  WORK: -2,
  TRANSIT: -10,
  OUTDOOR: 5,
};

const PRIORITY_STRESS_PENALTY: Record<NudePriority, number> = {
  LOW: 0.45,
  MEDIUM: 0.65,
  HIGH: 0.85,
};

let evaluations = 0;
let lastStatus: NudeStatus = 'CALM';
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isMode(value: unknown): value is NudeMode {
  return typeof value === 'string' && MODES.includes(value as NudeMode);
}

function isEnvironment(value: unknown): value is NudeEnvironment {
  return typeof value === 'string' && ENVIRONMENTS.includes(value as NudeEnvironment);
}

function isPriority(value: unknown): value is NudePriority {
  return typeof value === 'string' && PRIORITIES.includes(value as NudePriority);
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): NudeResult {
  return {
    referenceId: referenceId ?? 'n/a',
    mode: 'RESET',
    environment: 'HOME',
    regulationScore: 0,
    clarityScore: 0,
    recoveryScore: 0,
    readinessScore: 0,
    status: 'CRITICAL',
    recommendedBreakMinutes: 0,
    warnings: [warning],
    disclaimer: NUDE_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeRegulationScore(input: NudeInput): number {
  const loadPenalty = input.contextLoad * 0.55;
  const stressPenalty = input.stressLevel * 0.35;
  const sessionPenalty = input.sessionMinutes * 0.08;
  const breakCredit = (input.breaksTaken ?? 0) * 4;
  const raw =
    100 -
    loadPenalty -
    stressPenalty -
    sessionPenalty +
    breakCredit +
    ENVIRONMENT_REGULATION_BONUS[input.environment];
  return round2(clamp(raw, NUDE_MIN_SCORE, NUDE_MAX_SCORE));
}

function computeClarityScore(input: NudeInput): number {
  const modeBonus = MODE_CLARITY_BONUS[input.mode];
  const stressPenalty = input.stressLevel * PRIORITY_STRESS_PENALTY[input.priority] * 0.45;
  const loadPenalty = input.contextLoad * 0.35;
  const breakCredit = (input.breaksTaken ?? 0) * 2;
  const raw = 92 - stressPenalty - loadPenalty + modeBonus + breakCredit;
  return round2(clamp(raw, NUDE_MIN_SCORE, NUDE_MAX_SCORE));
}

function computeRecoveryScore(input: NudeInput): number {
  const modeBonus = MODE_RECOVERY_BONUS[input.mode];
  const stressNeed = input.stressLevel * 0.7;
  const sessionNeed = input.sessionMinutes * 0.15;
  const breakCredit = (input.breaksTaken ?? 0) * 3.5;
  const raw = 35 + stressNeed + sessionNeed + modeBonus - breakCredit;
  return round2(clamp(raw, NUDE_MIN_SCORE, NUDE_MAX_SCORE));
}

function computeReadinessScore(regulationScore: number, clarityScore: number, recoveryScore: number): number {
  const raw = regulationScore * 0.45 + clarityScore * 0.4 + (100 - recoveryScore) * 0.15;
  return round2(clamp(raw, NUDE_MIN_SCORE, NUDE_MAX_SCORE));
}

function computeStatus(readinessScore: number, regulationScore: number, recoveryScore: number): NudeStatus {
  if (regulationScore < 25 || recoveryScore > 85) return 'CRITICAL';
  if (readinessScore < 45) return 'OVERLOADED';
  if (readinessScore >= 75) return 'CALM';
  return 'BALANCED';
}

function computeRecommendedBreakMinutes(status: NudeStatus, sessionMinutes: number): number {
  const base = Math.max(5, Math.round(sessionMinutes * 0.1));
  if (status === 'CRITICAL') return Math.max(20, base + 15);
  if (status === 'OVERLOADED') return Math.max(12, base + 5);
  if (status === 'BALANCED') return base;
  return 5;
}

function buildWarnings(input: NudeInput, regulationScore: number, clarityScore: number, recoveryScore: number): string[] {
  const warnings: string[] = [];

  if (input.stressLevel >= 85) warnings.push('Stress level is critically high for sustained execution.');
  if (input.contextLoad >= 90) warnings.push('Context load is near saturation and can degrade decision quality.');
  if (regulationScore < 35) warnings.push('Regulation score is low; reduce scope before continuing.');
  if (clarityScore < 40) warnings.push('Clarity score is low; simplify objectives and sequence tasks.');
  if (recoveryScore > 80) warnings.push('Recovery need is high; schedule a longer recovery block.');

  return warnings;
}

export function evaluateNude(input: NudeInput): NudeResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isMode(input.mode)) {
    return invalidResult(input.referenceId, 'mode must be one of: RESET, FOCUS, RECOVERY, SOCIAL', start);
  }

  if (!isEnvironment(input.environment)) {
    return invalidResult(input.referenceId, 'environment must be one of: HOME, WORK, TRANSIT, OUTDOOR', start);
  }

  if (!isPriority(input.priority)) {
    return invalidResult(input.referenceId, 'priority must be one of: LOW, MEDIUM, HIGH', start);
  }

  if (typeof input.stressLevel !== 'number' || !Number.isFinite(input.stressLevel)) {
    return invalidResult(input.referenceId, 'stressLevel must be a finite number', start);
  }

  if (typeof input.contextLoad !== 'number' || !Number.isFinite(input.contextLoad)) {
    return invalidResult(input.referenceId, 'contextLoad must be a finite number', start);
  }

  if (typeof input.sessionMinutes !== 'number' || !Number.isFinite(input.sessionMinutes)) {
    return invalidResult(input.referenceId, 'sessionMinutes must be a finite number', start);
  }

  if (input.stressLevel < 0 || input.stressLevel > NUDE_MAX_STRESS_LEVEL) {
    return invalidResult(input.referenceId, `stressLevel must be between 0 and ${NUDE_MAX_STRESS_LEVEL}`, start);
  }

  if (input.contextLoad < 0 || input.contextLoad > NUDE_MAX_CONTEXT_LOAD) {
    return invalidResult(input.referenceId, `contextLoad must be between 0 and ${NUDE_MAX_CONTEXT_LOAD}`, start);
  }

  if (input.sessionMinutes < 0 || input.sessionMinutes > NUDE_MAX_SESSION_MINUTES) {
    return invalidResult(input.referenceId, `sessionMinutes must be between 0 and ${NUDE_MAX_SESSION_MINUTES}`, start);
  }

  if (input.breaksTaken !== undefined) {
    if (typeof input.breaksTaken !== 'number' || !Number.isFinite(input.breaksTaken)) {
      return invalidResult(input.referenceId, 'breaksTaken must be a finite number when provided', start);
    }
    if (!Number.isInteger(input.breaksTaken) || input.breaksTaken < 0 || input.breaksTaken > 48) {
      return invalidResult(input.referenceId, 'breaksTaken must be an integer between 0 and 48', start);
    }
  }

  const regulationScore = computeRegulationScore(input);
  const clarityScore = computeClarityScore(input);
  const recoveryScore = computeRecoveryScore(input);
  const readinessScore = computeReadinessScore(regulationScore, clarityScore, recoveryScore);
  const status = computeStatus(readinessScore, regulationScore, recoveryScore);
  const recommendedBreakMinutes = computeRecommendedBreakMinutes(status, input.sessionMinutes);
  const warnings = buildWarnings(input, regulationScore, clarityScore, recoveryScore);

  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    mode: input.mode,
    environment: input.environment,
    regulationScore,
    clarityScore,
    recoveryScore,
    readinessScore,
    status,
    recommendedBreakMinutes,
    warnings,
    disclaimer: NUDE_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getNudeHealthReport(): NudeHealthReport {
  return {
    personaId: NUDE_PERSONA_ID,
    displayName: NUDE_DISPLAY_NAME,
    slug: NUDE_SLUG,
    contractVersion: NUDE_CONTRACT_VERSION,
    moduleVersion: NUDE_MODULE_VERSION,
    linkedRepoImpact: NUDE_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    performanceMaxMs: NUDE_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: NUDE_API_RESPONSE_MAX_MS,
  };
}

export function _resetNudeMetrics(): void {
  evaluations = 0;
  lastStatus = 'CALM';
  lastEvaluatedAt = null;
}
