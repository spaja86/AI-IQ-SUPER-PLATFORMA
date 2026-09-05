// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET Engine
// Kompanija SPAJA — Digitalna Industrija

import type {
  ProsparitetHealthReport,
  ProsparitetHorizon,
  ProsparitetInput,
  ProsparitetObjective,
  ProsparitetResult,
  ProsparitetRiskAppetite,
  ProsparitetStatus,
} from './types';
import {
  PROSPARITET_API_RESPONSE_MAX_MS,
  PROSPARITET_CONTRACT_VERSION,
  PROSPARITET_DISCLAIMER,
  PROSPARITET_DISPLAY_NAME,
  PROSPARITET_LINKED_REPO_IMPACT,
  PROSPARITET_MAX_HORIZON_MONTHS,
  PROSPARITET_MAX_SCORE,
  PROSPARITET_MIN_SCORE,
  PROSPARITET_MODULE_VERSION,
  PROSPARITET_PERFORMANCE_MAX_MS,
  PROSPARITET_PERSONA_ID,
  PROSPARITET_SLUG,
} from './types';
import {
  HORIZON_BASE_SCORE,
  OBJECTIVE_BASE_BOOST,
  RISK_APPETITE_FACTOR,
  VALID_PROSPARITET_HORIZONS,
  VALID_PROSPARITET_OBJECTIVES,
  VALID_PROSPARITET_RISK_APPETITES,
} from './registry';

let evaluations = 0;
let lastStatus: ProsparitetStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is ProsparitetObjective {
  return typeof value === 'string' && VALID_PROSPARITET_OBJECTIVES.includes(value as ProsparitetObjective);
}

function isHorizon(value: unknown): value is ProsparitetHorizon {
  return typeof value === 'string' && VALID_PROSPARITET_HORIZONS.includes(value as ProsparitetHorizon);
}

function isRiskAppetite(value: unknown): value is ProsparitetRiskAppetite {
  return typeof value === 'string' && VALID_PROSPARITET_RISK_APPETITES.includes(value as ProsparitetRiskAppetite);
}

function recordEvaluation(status: ProsparitetStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): ProsparitetResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    horizon: null,
    riskAppetite: null,
    stabilityScore: 0,
    growthScore: 0,
    resilienceScore: 0,
    efficiencyScore: 0,
    overallScore: 0,
    status: 'CRITICAL',
    recommendedAction: 'STABILIZE_BASE',
    warnings: [warning],
    disclaimer: PROSPARITET_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeStabilityScore(input: ProsparitetInput): number {
  const raw =
    input.revenueStabilityScore * 0.38 +
    input.marginScore * 0.22 +
    input.liquidityScore * 0.3 +
    HORIZON_BASE_SCORE[input.horizon] * 0.1 -
    input.debtLoadScore * 0.2;
  return round2(clamp(raw, PROSPARITET_MIN_SCORE, PROSPARITET_MAX_SCORE));
}

function computeGrowthScore(input: ProsparitetInput): number {
  const riskFactor = RISK_APPETITE_FACTOR[input.riskAppetite];
  const raw =
    input.marginScore * 0.34 +
    input.disciplineScore * 0.24 +
    (100 - input.debtLoadScore) * 0.16 +
    OBJECTIVE_BASE_BOOST[input.objective] +
    HORIZON_BASE_SCORE[input.horizon] * 0.08;
  return round2(clamp(raw * riskFactor, PROSPARITET_MIN_SCORE, PROSPARITET_MAX_SCORE));
}

function computeResilienceScore(input: ProsparitetInput): number {
  const raw =
    input.liquidityScore * 0.42 +
    input.disciplineScore * 0.28 +
    (100 - input.debtLoadScore) * 0.22 +
    HORIZON_BASE_SCORE[input.horizon] * 0.08;
  return round2(clamp(raw, PROSPARITET_MIN_SCORE, PROSPARITET_MAX_SCORE));
}

function computeEfficiencyScore(input: ProsparitetInput): number {
  const raw =
    input.marginScore * 0.45 +
    input.revenueStabilityScore * 0.25 +
    input.disciplineScore * 0.2 +
    (100 - input.debtLoadScore) * 0.1;
  return round2(clamp(raw, PROSPARITET_MIN_SCORE, PROSPARITET_MAX_SCORE));
}

function resolveStatus(input: ProsparitetInput, overallScore: number): ProsparitetStatus {
  if (overallScore >= 82 && input.liquidityScore >= 70 && input.debtLoadScore <= 40) return 'PROSPER';
  if (overallScore >= 64) return 'GROWING';
  if (overallScore >= 42) return 'STABLE';
  return 'CRITICAL';
}

function resolveRecommendedAction(
  input: ProsparitetInput,
  status: ProsparitetStatus,
): ProsparitetResult['recommendedAction'] {
  if (status === 'CRITICAL') return 'STABILIZE_BASE';
  if (status === 'STABLE' || input.liquidityScore < 55) return 'BUILD_BUFFER';
  if (input.objective === 'EXPANSION' && input.riskAppetite === 'HIGH' && status === 'PROSPER') return 'SCALE_CONFIDENTLY';
  return 'OPTIMIZE_ALLOCATION';
}

function buildWarnings(
  input: ProsparitetInput,
  status: ProsparitetStatus,
  action: ProsparitetResult['recommendedAction'],
): string[] {
  const warnings: string[] = [];

  if (input.debtLoadScore >= 75) {
    warnings.push('Debt load is high and may block sustainable prosperity gains.');
  }

  if (input.liquidityScore < 35) {
    warnings.push('Liquidity is too low for resilient operating capacity.');
  }

  if (input.horizon === 'LONG' && input.disciplineScore < 45) {
    warnings.push('Long horizon with weak discipline usually increases execution drift.');
  }

  if (input.riskAppetite === 'HIGH' && input.marginScore < 45) {
    warnings.push('High risk appetite with weak margins can accelerate downside.');
  }

  if (status === 'CRITICAL' && action !== 'STABILIZE_BASE') {
    warnings.push('Critical status should prioritize base stabilization before expansion actions.');
  }

  if (input.objective === 'EXPANSION' && input.horizonMonths <= 6) {
    warnings.push('Expansion with a short horizon may compress execution quality.');
  }

  return warnings;
}

export function evaluateProsparitet(input: ProsparitetInput): ProsparitetResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_PROSPARITET_OBJECTIVES.join(', ')}`, start);
  }

  if (!isHorizon(input.horizon)) {
    return invalidResult(input.referenceId, `horizon must be one of: ${VALID_PROSPARITET_HORIZONS.join(', ')}`, start);
  }

  if (!isRiskAppetite(input.riskAppetite)) {
    return invalidResult(
      input.referenceId,
      `riskAppetite must be one of: ${VALID_PROSPARITET_RISK_APPETITES.join(', ')}`,
      start,
    );
  }

  if (!Number.isFinite(input.revenueStabilityScore) || input.revenueStabilityScore < 0 || input.revenueStabilityScore > 100) {
    return invalidResult(input.referenceId, 'revenueStabilityScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.marginScore) || input.marginScore < 0 || input.marginScore > 100) {
    return invalidResult(input.referenceId, 'marginScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.liquidityScore) || input.liquidityScore < 0 || input.liquidityScore > 100) {
    return invalidResult(input.referenceId, 'liquidityScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.debtLoadScore) || input.debtLoadScore < 0 || input.debtLoadScore > 100) {
    return invalidResult(input.referenceId, 'debtLoadScore must be within 0..100', start);
  }

  if (!Number.isFinite(input.disciplineScore) || input.disciplineScore < 0 || input.disciplineScore > 100) {
    return invalidResult(input.referenceId, 'disciplineScore must be within 0..100', start);
  }

  if (!Number.isInteger(input.horizonMonths) || input.horizonMonths <= 0 || input.horizonMonths > PROSPARITET_MAX_HORIZON_MONTHS) {
    return invalidResult(
      input.referenceId,
      `horizonMonths must be an integer within 1..${PROSPARITET_MAX_HORIZON_MONTHS}`,
      start,
    );
  }

  const stabilityScore = computeStabilityScore(input);
  const growthScore = computeGrowthScore(input);
  const resilienceScore = computeResilienceScore(input);
  const efficiencyScore = computeEfficiencyScore(input);

  const overallScore = round2(
    clamp(
      stabilityScore * 0.32 + growthScore * 0.26 + resilienceScore * 0.24 + efficiencyScore * 0.18,
      PROSPARITET_MIN_SCORE,
      PROSPARITET_MAX_SCORE,
    ),
  );

  const status = resolveStatus(input, overallScore);
  const recommendedAction = resolveRecommendedAction(input, status);
  const warnings = buildWarnings(input, status, recommendedAction);

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    horizon: input.horizon,
    riskAppetite: input.riskAppetite,
    stabilityScore,
    growthScore,
    resilienceScore,
    efficiencyScore,
    overallScore,
    status,
    recommendedAction,
    warnings,
    disclaimer: PROSPARITET_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getProsparitetHealthReport(): ProsparitetHealthReport {
  return {
    personaId: PROSPARITET_PERSONA_ID,
    displayName: PROSPARITET_DISPLAY_NAME,
    slug: PROSPARITET_SLUG,
    contractVersion: PROSPARITET_CONTRACT_VERSION,
    moduleVersion: PROSPARITET_MODULE_VERSION,
    linkedRepoImpact: PROSPARITET_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_PROSPARITET_OBJECTIVES],
    performanceMaxMs: PROSPARITET_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: PROSPARITET_API_RESPONSE_MAX_MS,
  };
}

export function _resetProsparitetMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
