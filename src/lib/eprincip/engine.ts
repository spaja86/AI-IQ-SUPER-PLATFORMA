// SpajaUltraOmegaCore -∞Ω+∞ — EPRINCIP
// Kompanija SPAJA — Digitalna Industrija

import type {
  EPrincipHealthReport,
  EPrincipInput,
  EPrincipPrincipleResult,
  EPrincipResult,
  EPrincipStatus,
} from './types';
import {
  EPRINCIP_API_RESPONSE_MAX_MS,
  EPRINCIP_CONTRACT_VERSION,
  EPRINCIP_DEFAULT_MINIMUM_SCORE,
  EPRINCIP_MODULE_VERSION,
  EPRINCIP_PERFORMANCE_MAX_MS,
  EPRINCIP_PERSONA_ID,
} from './types';

let evaluations = 0;
let lastScore = 0;
let lastStatus: EPrincipStatus = 'NON_COMPLIANT';
let lastEvaluatedAt: string | null = null;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveStatus(score: number, requiredSatisfied: boolean): EPrincipStatus {
  if (!requiredSatisfied) {
    return score >= 50 ? 'PARTIAL' : 'NON_COMPLIANT';
  }
  if (score >= 90) return 'EXEMPLARY';
  if (score >= 75) return 'ALIGNED';
  if (score >= 50) return 'PARTIAL';
  return 'NON_COMPLIANT';
}

function invalidResult(input: EPrincipInput, warning: string, start: number): EPrincipResult {
  const minimumScore = Number.isFinite(input.minimumScore)
    ? Number(input.minimumScore)
    : EPRINCIP_DEFAULT_MINIMUM_SCORE;

  return {
    referenceId: input.referenceId ?? 'n/a',
    overallScore: 0,
    status: 'NON_COMPLIANT',
    valid: false,
    warnings: [warning],
    durationMs: Date.now() - start,
    coveragePct: 0,
    minimumScore,
    requiredSatisfied: false,
    principles: [],
  };
}

export function evaluateEPrincip(input: EPrincipInput): EPrincipResult {
  const start = Date.now();

  if (!Array.isArray(input.principles) || input.principles.length === 0) {
    return invalidResult(input, 'principles must be a non-empty array', start);
  }

  const minimumScore = input.minimumScore ?? EPRINCIP_DEFAULT_MINIMUM_SCORE;
  if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 100) {
    return invalidResult(input, 'minimumScore must be between 0 and 100', start);
  }

  let totalWeight = 0;
  let weightedSum = 0;
  let principlesWithEvidence = 0;
  let requiredSatisfied = true;
  const warnings: string[] = [];
  const principles: EPrincipPrincipleResult[] = [];

  for (const principle of input.principles) {
    if (!principle || typeof principle.id !== 'string' || principle.id.trim().length === 0) {
      return invalidResult(input, 'every principle must have a non-empty id', start);
    }

    if (typeof principle.label !== 'string' || principle.label.trim().length === 0) {
      return invalidResult(input, `principle ${principle.id} must have a non-empty label`, start);
    }

    if (!Number.isFinite(principle.score) || principle.score < 0 || principle.score > 100) {
      return invalidResult(input, `principle ${principle.id} must have a score between 0 and 100`, start);
    }

    if (!Number.isFinite(principle.weight) || principle.weight < 0) {
      return invalidResult(input, `principle ${principle.id} must have a non-negative finite weight`, start);
    }

    const evidenceCount = principle.evidenceCount ?? 0;
    if (!Number.isInteger(evidenceCount) || evidenceCount < 0) {
      return invalidResult(input, `principle ${principle.id} must have a non-negative integer evidenceCount`, start);
    }

    const required = principle.required === true;
    const hasEvidence = evidenceCount > 0;
    const meetsMinimumScore = principle.score >= minimumScore;

    totalWeight += principle.weight;
    weightedSum += principle.score * principle.weight;

    if (hasEvidence) {
      principlesWithEvidence += 1;
    } else {
      warnings.push(`principle ${principle.id} has no evidence`);
    }

    if (required && !meetsMinimumScore) {
      requiredSatisfied = false;
      warnings.push(`required principle ${principle.id} is below minimumScore ${minimumScore}`);
    }

    principles.push({
      id: principle.id,
      label: principle.label,
      score: principle.score,
      weight: principle.weight,
      required,
      evidenceCount,
      contribution: round(principle.score * principle.weight),
      meetsMinimumScore,
      hasEvidence,
    });
  }

  if (totalWeight === 0) {
    return invalidResult(input, 'sum of weights must be greater than 0 (division-by-zero guard)', start);
  }

  const overallScore = round(weightedSum / totalWeight);
  const coveragePct = round((principlesWithEvidence / input.principles.length) * 100);
  if (coveragePct < 100) {
    warnings.push(`evidence coverage is incomplete (${coveragePct}%)`);
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
    requiredSatisfied,
    principles,
  };
}

export function getEPrincipHealthReport(): EPrincipHealthReport {
  return {
    personaId: EPRINCIP_PERSONA_ID,
    contractVersion: EPRINCIP_CONTRACT_VERSION,
    moduleVersion: EPRINCIP_MODULE_VERSION,
    evaluations,
    lastScore,
    lastStatus,
    lastEvaluatedAt,
    performanceMaxMs: EPRINCIP_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EPRINCIP_API_RESPONSE_MAX_MS,
    defaultMinimumScore: EPRINCIP_DEFAULT_MINIMUM_SCORE,
  };
}

export function _resetEPrincipMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastStatus = 'NON_COMPLIANT';
  lastEvaluatedAt = null;
}
