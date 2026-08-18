// SpajaUltraOmegaCore -∞Ω+∞ — DIREKT
// Kompanija SPAJA — Digitalna Industrija

import type {
  DirektHealthReport,
  DirektInput,
  DirektResult,
  DirektSignalResult,
  DirektStatus,
} from './types';
import {
  DIREKT_API_RESPONSE_MAX_MS,
  DIREKT_CONTRACT_VERSION,
  DIREKT_DEFAULT_MINIMUM_SCORE,
  DIREKT_DEFAULT_TARGET_SCORE,
  DIREKT_MODULE_VERSION,
  DIREKT_PERFORMANCE_MAX_MS,
  DIREKT_PERSONA_ID,
} from './types';

let evaluations = 0;
let lastScore = 0;
let lastStatus: DirektStatus = 'VAGUE';
let lastEvaluatedAt: string | null = null;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveStatus(score: number, requiredSatisfied: boolean): DirektStatus {
  if (!requiredSatisfied) {
    return score >= 50 ? 'PARTIAL' : 'VAGUE';
  }
  if (score >= 90) return 'PRECISE';
  if (score >= 75) return 'DIRECT';
  if (score >= 50) return 'PARTIAL';
  return 'VAGUE';
}

function invalidResult(input: DirektInput, warning: string, start: number): DirektResult {
  const minimumScore = Number.isFinite(input.minimumScore)
    ? Number(input.minimumScore)
    : DIREKT_DEFAULT_MINIMUM_SCORE;
  const targetScore = Number.isFinite(input.targetScore)
    ? Number(input.targetScore)
    : DIREKT_DEFAULT_TARGET_SCORE;

  return {
    referenceId: input.referenceId ?? 'n/a',
    overallScore: 0,
    status: 'VAGUE',
    valid: false,
    warnings: [warning],
    durationMs: Date.now() - start,
    coveragePct: 0,
    minimumScore,
    targetScore,
    targetDelta: round(0 - targetScore),
    requiredSatisfied: false,
    signals: [],
  };
}

export function evaluateDirekt(input: DirektInput): DirektResult {
  const start = Date.now();

  if (!Array.isArray(input.signals) || input.signals.length === 0) {
    return invalidResult(input, 'signals must be a non-empty array', start);
  }

  const minimumScore = input.minimumScore ?? DIREKT_DEFAULT_MINIMUM_SCORE;
  if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 100) {
    return invalidResult(input, 'minimumScore must be between 0 and 100', start);
  }

  const targetScore = input.targetScore ?? DIREKT_DEFAULT_TARGET_SCORE;
  if (!Number.isFinite(targetScore) || targetScore < 0 || targetScore > 100) {
    return invalidResult(input, 'targetScore must be between 0 and 100', start);
  }

  let totalWeight = 0;
  let weightedSum = 0;
  let signalsWithExamples = 0;
  let requiredSatisfied = true;
  const warnings: string[] = [];
  const signals: DirektSignalResult[] = [];

  for (const signal of input.signals) {
    if (!signal || typeof signal.id !== 'string' || signal.id.trim().length === 0) {
      return invalidResult(input, 'every signal must have a non-empty id', start);
    }

    if (typeof signal.label !== 'string' || signal.label.trim().length === 0) {
      return invalidResult(input, `signal ${signal.id} must have a non-empty label`, start);
    }

    if (!Number.isFinite(signal.score) || signal.score < 0 || signal.score > 100) {
      return invalidResult(input, `signal ${signal.id} must have a score between 0 and 100`, start);
    }

    if (!Number.isFinite(signal.weight) || signal.weight < 0) {
      return invalidResult(input, `signal ${signal.id} must have a non-negative finite weight`, start);
    }

    const exampleCount = signal.exampleCount ?? 0;
    if (!Number.isInteger(exampleCount) || exampleCount < 0) {
      return invalidResult(input, `signal ${signal.id} must have a non-negative integer exampleCount`, start);
    }

    const required = signal.required === true;
    const hasExample = exampleCount > 0;
    const meetsMinimumScore = signal.score >= minimumScore;

    totalWeight += signal.weight;
    weightedSum += signal.score * signal.weight;

    if (hasExample) {
      signalsWithExamples += 1;
    } else {
      warnings.push(`signal ${signal.id} has no examples`);
    }

    if (required && !meetsMinimumScore) {
      requiredSatisfied = false;
      warnings.push(`required signal ${signal.id} is below minimumScore ${minimumScore}`);
    }

    signals.push({
      id: signal.id,
      label: signal.label,
      score: signal.score,
      weight: signal.weight,
      required,
      exampleCount,
      contribution: round(signal.score * signal.weight),
      meetsMinimumScore,
      hasExample,
    });
  }

  if (totalWeight === 0) {
    return invalidResult(input, 'sum of weights must be greater than 0 (division-by-zero guard)', start);
  }

  const overallScore = round(weightedSum / totalWeight);
  const coveragePct = round((signalsWithExamples / input.signals.length) * 100);
  const targetDelta = round(overallScore - targetScore);

  if (coveragePct < 100) {
    warnings.push(`example coverage is incomplete (${coveragePct}%)`);
  }

  if (Math.abs(targetDelta) > 15) {
    warnings.push(`overall directness is far from targetScore ${targetScore} (delta ${targetDelta})`);
  }

  const status = resolveStatus(overallScore, requiredSatisfied);

  evaluations += 1;
  lastScore = overallScore;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();

  return {
    referenceId: input.referenceId ?? 'n/a',
    overallScore,
    status,
    valid: requiredSatisfied,
    warnings,
    durationMs: Date.now() - start,
    coveragePct,
    minimumScore,
    targetScore,
    targetDelta,
    requiredSatisfied,
    signals,
  };
}

export function getDirektHealthReport(): DirektHealthReport {
  return {
    personaId: DIREKT_PERSONA_ID,
    contractVersion: DIREKT_CONTRACT_VERSION,
    moduleVersion: DIREKT_MODULE_VERSION,
    evaluations,
    lastScore,
    lastStatus,
    lastEvaluatedAt,
    performanceMaxMs: DIREKT_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DIREKT_API_RESPONSE_MAX_MS,
    defaultMinimumScore: DIREKT_DEFAULT_MINIMUM_SCORE,
    defaultTargetScore: DIREKT_DEFAULT_TARGET_SCORE,
  };
}

export function _resetDirektMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastStatus = 'VAGUE';
  lastEvaluatedAt = null;
}
