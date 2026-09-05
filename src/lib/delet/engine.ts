// SpajaUltraOmegaCore -∞Ω+∞ — DELET Engine
// Kompanija SPAJA — Digitalna Industrija

import {
  DELET_API_RESPONSE_MAX_MS,
  DELET_CONTRACT_VERSION,
  DELET_DISCLAIMER,
  DELET_DISPLAY_NAME,
  DELET_LINKED_REPO_IMPACT,
  DELET_MAX_DEPENDENCY_COUNT,
  DELET_MAX_RECOVERY_WINDOW_HOURS,
  DELET_MAX_RETENTION_AGE_DAYS,
  DELET_MAX_SCORE,
  DELET_MIN_SCORE,
  DELET_MODULE_VERSION,
  DELET_PERFORMANCE_MAX_MS,
  DELET_PERSONA_ID,
  DELET_SLUG,
} from './types';
import {
  ACTION_TARGET_WINDOW_HOURS,
  OBJECTIVE_BASE_REVERSIBILITY,
  OBJECTIVE_BASE_RISK,
  SCOPE_RISK_MULTIPLIER,
  VALID_DELET_OBJECTIVES,
  VALID_DELET_SCOPES,
} from './registry';
import type {
  DeletHealthReport,
  DeletInput,
  DeletObjective,
  DeletResult,
  DeletScope,
  DeletStatus,
} from './types';

let evaluations = 0;
let lastStatus: DeletStatus | null = null;
let lastEvaluatedAt: string | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function isObjective(value: unknown): value is DeletObjective {
  return typeof value === 'string' && VALID_DELET_OBJECTIVES.includes(value as DeletObjective);
}

function isScope(value: unknown): value is DeletScope {
  return typeof value === 'string' && VALID_DELET_SCOPES.includes(value as DeletScope);
}

function recordEvaluation(status: DeletStatus | null): void {
  evaluations += 1;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function invalidResult(referenceId: string | undefined, warning: string, start: number): DeletResult {
  recordEvaluation(null);
  return {
    referenceId: referenceId ?? 'n/a',
    objective: null,
    scope: null,
    safetyScore: 0,
    complianceScore: 0,
    reversibilityScore: 0,
    riskScore: 0,
    overallScore: 0,
    status: null,
    recommendedAction: null,
    recommendedWindowHours: 0,
    warnings: [warning],
    disclaimer: DELET_DISCLAIMER,
    valid: false,
    durationMs: round2(performance.now() - start),
  };
}

function computeRiskScore(input: DeletInput): number {
  const objectiveRisk = OBJECTIVE_BASE_RISK[input.objective];
  const scopeMultiplier = SCOPE_RISK_MULTIPLIER[input.scope];
  const sensitivityRisk = input.dataSensitivityScore * 0.45;
  const dependencyRisk = Math.min(input.dependencyCount, 80) * 0.38;
  const holdRisk = input.legalHoldActive ? 34 : 0;
  const backupRiskOffset = (100 - input.backupCoverageScore) * 0.22;
  const raw = (objectiveRisk + sensitivityRisk + dependencyRisk + holdRisk + backupRiskOffset) * scopeMultiplier;
  return round2(clamp(raw, DELET_MIN_SCORE, DELET_MAX_SCORE));
}

function computeSafetyScore(input: DeletInput, riskScore: number): number {
  const backupBonus = input.backupCoverageScore * 0.42;
  const retentionBonus = clamp(input.retentionAgeDays / DELET_MAX_RETENTION_AGE_DAYS * 100, 0, 100) * 0.24;
  const windowBonus = input.recoveryWindowHours / DELET_MAX_RECOVERY_WINDOW_HOURS * 20;
  const raw = 100 - riskScore * 0.54 + backupBonus + retentionBonus + windowBonus;
  return round2(clamp(raw, DELET_MIN_SCORE, DELET_MAX_SCORE));
}

function computeComplianceScore(input: DeletInput): number {
  const holdPenalty = input.legalHoldActive ? 95 : 0;
  const sensitivityPenalty = input.dataSensitivityScore * 0.28;
  const dependencyPenalty = Math.min(input.dependencyCount, 100) * 0.26;
  const retentionBonus = clamp(input.retentionAgeDays / DELET_MAX_RETENTION_AGE_DAYS * 100, 0, 100) * 0.38;
  const backupBonus = input.backupCoverageScore * 0.18;
  const raw = 100 - holdPenalty - sensitivityPenalty - dependencyPenalty + retentionBonus + backupBonus;
  return round2(clamp(raw, DELET_MIN_SCORE, DELET_MAX_SCORE));
}

function computeReversibilityScore(input: DeletInput): number {
  const base = OBJECTIVE_BASE_REVERSIBILITY[input.objective];
  const recoveryBonus = input.recoveryWindowHours / DELET_MAX_RECOVERY_WINDOW_HOURS * 62;
  const backupBonus = input.backupCoverageScore * 0.3;
  const scopePenalty = input.scope === 'TENANT' ? 26 : input.scope === 'BATCH' ? 14 : 0;
  const raw = base + recoveryBonus + backupBonus - scopePenalty;
  return round2(clamp(raw, DELET_MIN_SCORE, DELET_MAX_SCORE));
}

function resolveStatus(
  input: DeletInput,
  riskScore: number,
  complianceScore: number,
  reversibilityScore: number,
  overallScore: number,
): DeletStatus {
  if (input.scope === 'TENANT' && input.objective === 'HARD_DELETE') return 'BLOCK';
  if (input.legalHoldActive || complianceScore < 30 || riskScore >= 85) return 'BLOCK';
  if ((input.objective === 'HARD_DELETE' || input.objective === 'ANONYMIZE') && reversibilityScore < 35) return 'BLOCK';
  const scoredStatus: DeletStatus =
    overallScore >= 82 && riskScore < 35 && input.objective !== 'HARD_DELETE'
      ? 'AUTO_APPROVE'
      : overallScore >= 60
        ? 'APPROVE'
        : 'REVIEW';

  if (input.scope === 'TENANT' && scoredStatus !== 'BLOCK') return 'REVIEW';
  return scoredStatus;
}

function resolveRecommendedAction(status: DeletStatus): NonNullable<DeletResult['recommendedAction']> {
  if (status === 'BLOCK') return 'ABORT';
  if (status === 'REVIEW') return 'REQUEST_REVIEW';
  if (status === 'APPROVE') return 'SCHEDULE_WINDOW';
  return 'EXECUTE';
}

function resolveRecommendedWindowHours(
  action: NonNullable<DeletResult['recommendedAction']>,
  status: DeletStatus,
): number {
  if (action === 'ABORT') return 0;
  const statusAdjustment =
    status === 'AUTO_APPROVE' ? -6 :
    status === 'REVIEW' ? 24 :
    0;

  const target = clamp(
    ACTION_TARGET_WINDOW_HOURS[action] + statusAdjustment,
    1,
    DELET_MAX_RECOVERY_WINDOW_HOURS,
  );

  return target;
}

function buildWarnings(input: DeletInput, status: DeletStatus, riskScore: number, complianceScore: number): string[] {
  const warnings: string[] = [];

  if (input.legalHoldActive) warnings.push('Legal hold is active; deletion must remain blocked.');
  if (input.objective === 'HARD_DELETE') warnings.push('Hard delete reduces recovery options and requires stronger controls.');
  if (input.backupCoverageScore < 40) warnings.push('Low backup coverage increases irreversible-loss risk.');
  if (input.dataSensitivityScore >= 80) warnings.push('High data sensitivity requires elevated privacy/compliance review.');
  if (input.dependencyCount >= 80) warnings.push('High dependency count increases blast radius for deletion.');
  if (input.scope === 'TENANT') warnings.push('Tenant-wide scope affects shared records and downstream services.');
  if (status === 'BLOCK' && complianceScore < 30) warnings.push('Compliance readiness is below safe execution threshold.');
  if (status !== 'BLOCK' && riskScore >= 65) warnings.push('Risk remains elevated; execute only within a controlled window.');

  return warnings;
}

export function evaluateDelet(input: DeletInput): DeletResult {
  const start = performance.now();

  if (!input || typeof input !== 'object') {
    return invalidResult(undefined, 'input must be an object', start);
  }

  if (!isObjective(input.objective)) {
    return invalidResult(input.referenceId, `objective must be one of: ${VALID_DELET_OBJECTIVES.join(', ')}`, start);
  }

  if (!isScope(input.scope)) {
    return invalidResult(input.referenceId, `scope must be one of: ${VALID_DELET_SCOPES.join(', ')}`, start);
  }

  if (!Number.isFinite(input.dataSensitivityScore) || input.dataSensitivityScore < 0 || input.dataSensitivityScore > 100) {
    return invalidResult(input.referenceId, 'dataSensitivityScore must be within 0..100', start);
  }

  if (!Number.isInteger(input.retentionAgeDays) || input.retentionAgeDays < 1 || input.retentionAgeDays > DELET_MAX_RETENTION_AGE_DAYS) {
    return invalidResult(
      input.referenceId,
      `retentionAgeDays must be an integer within 1..${DELET_MAX_RETENTION_AGE_DAYS}`,
      start,
    );
  }

  if (!Number.isInteger(input.recoveryWindowHours) || input.recoveryWindowHours < 1 || input.recoveryWindowHours > DELET_MAX_RECOVERY_WINDOW_HOURS) {
    return invalidResult(
      input.referenceId,
      `recoveryWindowHours must be an integer within 1..${DELET_MAX_RECOVERY_WINDOW_HOURS}`,
      start,
    );
  }

  if (!Number.isInteger(input.dependencyCount) || input.dependencyCount < 0 || input.dependencyCount > DELET_MAX_DEPENDENCY_COUNT) {
    return invalidResult(
      input.referenceId,
      `dependencyCount must be an integer within 0..${DELET_MAX_DEPENDENCY_COUNT}`,
      start,
    );
  }

  if (!Number.isFinite(input.backupCoverageScore) || input.backupCoverageScore < 0 || input.backupCoverageScore > 100) {
    return invalidResult(input.referenceId, 'backupCoverageScore must be within 0..100', start);
  }

  if (typeof input.legalHoldActive !== 'boolean') {
    return invalidResult(input.referenceId, 'legalHoldActive must be a boolean', start);
  }

  const riskScore = computeRiskScore(input);
  const safetyScore = computeSafetyScore(input, riskScore);
  const complianceScore = computeComplianceScore(input);
  const reversibilityScore = computeReversibilityScore(input);

  const overallScore = round2(
    clamp(
      safetyScore * 0.32 + complianceScore * 0.28 + reversibilityScore * 0.2 + (100 - riskScore) * 0.2,
      DELET_MIN_SCORE,
      DELET_MAX_SCORE,
    ),
  );

  const status = resolveStatus(input, riskScore, complianceScore, reversibilityScore, overallScore);
  const recommendedAction = resolveRecommendedAction(status);
  const recommendedWindowHours = resolveRecommendedWindowHours(recommendedAction, status);
  const warnings = buildWarnings(input, status, riskScore, complianceScore);

  recordEvaluation(status);

  return {
    referenceId: input.referenceId ?? 'n/a',
    objective: input.objective,
    scope: input.scope,
    safetyScore,
    complianceScore,
    reversibilityScore,
    riskScore,
    overallScore,
    status,
    recommendedAction,
    recommendedWindowHours,
    warnings,
    disclaimer: DELET_DISCLAIMER,
    valid: true,
    durationMs: round2(performance.now() - start),
  };
}

export function getDeletHealthReport(): DeletHealthReport {
  return {
    personaId: DELET_PERSONA_ID,
    displayName: DELET_DISPLAY_NAME,
    slug: DELET_SLUG,
    contractVersion: DELET_CONTRACT_VERSION,
    moduleVersion: DELET_MODULE_VERSION,
    linkedRepoImpact: DELET_LINKED_REPO_IMPACT,
    evaluations,
    lastStatus,
    lastEvaluatedAt,
    supportedObjectives: [...VALID_DELET_OBJECTIVES],
    performanceMaxMs: DELET_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DELET_API_RESPONSE_MAX_MS,
  };
}

export function _resetDeletMetrics(): void {
  evaluations = 0;
  lastStatus = null;
  lastEvaluatedAt = null;
}
