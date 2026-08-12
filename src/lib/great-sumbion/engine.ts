// SpajaUltraOmegaCore -∞Ω+∞ — GREAT SUMBION
// Kompanija SPAJA — Digitalna Industrija

import type {
  GreatSumbionHealthReport,
  GreatSumbionInput,
  GreatSumbionResult,
  GreatSumbionTier,
} from './types';
import {
  GREAT_SUMBION_API_RESPONSE_MAX_MS,
  GREAT_SUMBION_CONTRACT_VERSION,
  GREAT_SUMBION_MODULE_VERSION,
  GREAT_SUMBION_PERFORMANCE_MAX_MS,
  GREAT_SUMBION_PERSONA_ID,
} from './types';

let evaluations = 0;
let lastScore = 0;
let lastTier: GreatSumbionTier = 'FOUNDATION';

function resolveTier(score: number): GreatSumbionTier {
  if (score >= 80) return 'APEX';
  if (score >= 50) return 'GROWTH';
  return 'FOUNDATION';
}

function invalidResult(input: GreatSumbionInput, warning: string, start: number): GreatSumbionResult {
  return {
    referenceId: input.referenceId ?? 'n/a',
    score: 0,
    tier: 'FOUNDATION',
    valid: false,
    warnings: [warning],
    durationMs: Date.now() - start,
    signals: [],
  };
}

export function calculateGreatSumbion(input: GreatSumbionInput): GreatSumbionResult {
  const start = Date.now();

  if (!Array.isArray(input.signals) || input.signals.length === 0) {
    return invalidResult(input, 'signals must be a non-empty array', start);
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const signal of input.signals) {
    if (!signal || typeof signal.id !== 'string' || signal.id.length === 0) {
      return invalidResult(input, 'every signal must have a non-empty id', start);
    }

    if (!Number.isFinite(signal.value) || Number.isNaN(signal.value)) {
      return invalidResult(input, `signal ${signal.id} has non-finite value`, start);
    }

    if (!Number.isFinite(signal.weight) || Number.isNaN(signal.weight)) {
      return invalidResult(input, `signal ${signal.id} has non-finite weight`, start);
    }

    if (signal.value < 0 || signal.weight < 0) {
      return invalidResult(input, `signal ${signal.id} has negative value/weight`, start);
    }

    totalWeight += signal.weight;
    weightedSum += signal.value * signal.weight;
  }

  if (totalWeight === 0) {
    return invalidResult(input, 'sum of weights must be greater than 0 (division-by-zero guard)', start);
  }

  const rawScore = weightedSum / totalWeight;
  const score = Math.max(0, Math.min(100, Math.round(rawScore * 100) / 100));
  const tier = resolveTier(score);

  evaluations += 1;
  lastScore = score;
  lastTier = tier;

  return {
    referenceId: input.referenceId ?? 'n/a',
    score,
    tier,
    valid: true,
    warnings: [],
    durationMs: Date.now() - start,
    signals: input.signals.map((signal) => ({
      id: signal.id,
      value: signal.value,
      weight: signal.weight,
      contribution: Math.round(signal.value * signal.weight * 100) / 100,
    })),
  };
}

export function getGreatSumbionHealthReport(): GreatSumbionHealthReport {
  return {
    personaId: GREAT_SUMBION_PERSONA_ID,
    contractVersion: GREAT_SUMBION_CONTRACT_VERSION,
    moduleVersion: GREAT_SUMBION_MODULE_VERSION,
    evaluations,
    lastScore,
    lastTier,
    performanceMaxMs: GREAT_SUMBION_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: GREAT_SUMBION_API_RESPONSE_MAX_MS,
  };
}

export function _resetGreatSumbionMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastTier = 'FOUNDATION';
}
