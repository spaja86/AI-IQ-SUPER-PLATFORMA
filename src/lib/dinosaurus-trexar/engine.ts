// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar
// Kompanija SPAJA — Digitalna Industrija

import type {
  TrexarHealthReport,
  TrexarInput,
  TrexarResult,
  TrexarStatus,
  TrexarTier,
} from './types';
import {
  DINOSAURUS_TREXAR_API_RESPONSE_MAX_MS,
  DINOSAURUS_TREXAR_CONTRACT_VERSION,
  DINOSAURUS_TREXAR_MAX_MASS_KG,
  DINOSAURUS_TREXAR_MAX_REACTION_MS,
  DINOSAURUS_TREXAR_MODULE_VERSION,
  DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS,
  DINOSAURUS_TREXAR_PERSONA_ID,
  DINOSAURUS_TREXAR_SIGNAL_MAX,
  DINOSAURUS_TREXAR_SIGNAL_MIN,
} from './types';
import { VALID_AGE_CATEGORIES } from './registry';

let evaluations = 0;
let lastScore = 0;
let lastStatus: TrexarStatus = 'CRITICAL';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isSignalRange(value: number): boolean {
  return Number.isFinite(value) && value >= DINOSAURUS_TREXAR_SIGNAL_MIN && value <= DINOSAURUS_TREXAR_SIGNAL_MAX;
}

function scoreReaction(reactionMs: number): number {
  const normalized = 100 - (reactionMs / DINOSAURUS_TREXAR_MAX_REACTION_MS) * 100;
  return clamp(normalized, 0, 100);
}

function resolveStatus(score: number): TrexarStatus {
  if (score >= 85) return 'APEX';
  if (score >= 70) return 'HUNT_READY';
  if (score >= 50) return 'ADAPTIVE';
  if (score >= 30) return 'STRESSED';
  return 'CRITICAL';
}

function resolveTier(score: number): TrexarTier {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 55) return 'B';
  return 'C';
}

function recommendation(status: TrexarStatus): string {
  switch (status) {
    case 'APEX':
      return 'Maintain current strategy; full-capability engagement is recommended.';
    case 'HUNT_READY':
      return 'Proceed with controlled high-output execution and monitor threat shifts.';
    case 'ADAPTIVE':
      return 'Use adaptive pacing and reinforce focus before high-risk maneuvers.';
    case 'STRESSED':
      return 'Reduce intensity and increase recovery/support before next operation.';
    case 'CRITICAL':
      return 'Abort risky actions; require stabilization and baseline restoration.';
  }
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): TrexarResult {
  return {
    referenceId: referenceId ?? 'n/a',
    specimenId: 'unknown-specimen',
    trexarScore: 0,
    status: 'CRITICAL',
    tier: 'C',
    recommendation: warning,
    valid: false,
    warnings: [warning],
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

function validate(input: TrexarInput): string | null {
  if (!input || typeof input !== 'object') return 'input must be an object';
  if (!input.profile || typeof input.profile !== 'object') return 'profile is required';
  if (!input.signals || typeof input.signals !== 'object') return 'signals is required';

  if (!VALID_AGE_CATEGORIES.includes(input.profile.ageCategory)) {
    return `ageCategory must be one of: ${VALID_AGE_CATEGORIES.join(', ')}`;
  }

  if (!Number.isFinite(input.profile.massKg) || input.profile.massKg <= 0 || input.profile.massKg > DINOSAURUS_TREXAR_MAX_MASS_KG) {
    return `massKg must be within 1..${DINOSAURUS_TREXAR_MAX_MASS_KG}`;
  }

  const numericSignals = input.signals;
  if (!isSignalRange(numericSignals.stamina)) return 'stamina must be within 0..100';
  if (!isSignalRange(numericSignals.aggression)) return 'aggression must be within 0..100';
  if (!isSignalRange(numericSignals.focus)) return 'focus must be within 0..100';
  if (!isSignalRange(numericSignals.threatLevel)) return 'threatLevel must be within 0..100';
  if (!isSignalRange(numericSignals.terrainFriction)) return 'terrainFriction must be within 0..100';
  if (!isSignalRange(numericSignals.packSupport)) return 'packSupport must be within 0..100';

  if (!Number.isFinite(numericSignals.reactionMs) || numericSignals.reactionMs < 0 || numericSignals.reactionMs > DINOSAURUS_TREXAR_MAX_REACTION_MS) {
    return `reactionMs must be within 0..${DINOSAURUS_TREXAR_MAX_REACTION_MS}`;
  }

  return null;
}

export function evaluateDinosaurusTrexar(input: TrexarInput): TrexarResult {
  const start = performance.now();
  const validationError = validate(input);
  if (validationError) return invalidResult(input?.referenceId, validationError, start);

  const warnings: string[] = [];
  const reactionScore = scoreReaction(input.signals.reactionMs);

  const baseScore =
    input.signals.stamina * 0.2 +
    input.signals.aggression * 0.15 +
    input.signals.focus * 0.2 +
    (100 - input.signals.threatLevel) * 0.15 +
    input.signals.terrainFriction * 0.1 +
    input.signals.packSupport * 0.1 +
    reactionScore * 0.1;

  const ageAdjustment = input.profile.ageCategory === 'JUVENILE' ? -5 : input.profile.ageCategory === 'ELDER' ? -3 : 0;
  const instabilityPenalty = input.signals.threatLevel > 85 && input.signals.packSupport < 20 ? -10 : 0;

  if (input.signals.stamina < 20) warnings.push('stamina is low; avoid prolonged high-intensity engagement');
  if (input.signals.reactionMs > 450) warnings.push('reaction latency is elevated; reduce tactical complexity');
  if (instabilityPenalty < 0) warnings.push('high threat with low pack support detected; stability penalty applied');

  const trexarScore = Math.round(clamp(baseScore + ageAdjustment + instabilityPenalty, 0, 100) * 100) / 100;
  const status = resolveStatus(trexarScore);
  const tier = resolveTier(trexarScore);

  evaluations += 1;
  lastScore = trexarScore;
  lastStatus = status;

  return {
    referenceId: input.referenceId ?? 'n/a',
    specimenId: input.profile.specimenId?.trim() || 'anonymous-specimen',
    trexarScore,
    status,
    tier,
    recommendation: recommendation(status),
    valid: true,
    warnings,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
  };
}

export function getDinosaurusTrexarHealthReport(): TrexarHealthReport {
  return {
    personaId: DINOSAURUS_TREXAR_PERSONA_ID,
    contractVersion: DINOSAURUS_TREXAR_CONTRACT_VERSION,
    moduleVersion: DINOSAURUS_TREXAR_MODULE_VERSION,
    evaluations,
    lastScore,
    lastStatus,
    performanceMaxMs: DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DINOSAURUS_TREXAR_API_RESPONSE_MAX_MS,
  };
}

export function _resetDinosaurusTrexarMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastStatus = 'CRITICAL';
}
