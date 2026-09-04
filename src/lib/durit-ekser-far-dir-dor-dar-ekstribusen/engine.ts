// SpajaUltraOmegaCore -∞Ω+∞ — DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN
// Kompanija SPAJA — Digitalna Industrija

import { getDistribucijaModel } from '../distribucija';
import { runDarPetlja, runDorPetlja } from '../petlje';
import type { PetljaResult } from '../petlje';
import type {
  DuritEkserFarDirDorDarEkstribusenHealthReport,
  DuritEkserFarDirDorDarEkstribusenInput,
  DuritEkserFarDirDorDarEkstribusenResult,
  DuritEkserFarDirDorDarEkstribusenStatus,
  DuritEkstribusenDistributionAlignment,
  DuritEkstribusenSignalResult,
} from './types';
import {
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_API_RESPONSE_MAX_MS,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_LABEL,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_MODULE_VERSION,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERSONA_ID,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG,
} from './types';

let evaluations = 0;
let lastScore = 0;
let lastStatus: DuritEkserFarDirDorDarEkstribusenStatus = 'BLOCKED';
let lastEvaluatedAt: string | null = null;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, round(value)));
}

function expectedIterations(start: number, end: number, step: number): number {
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step) || step === 0) return 0;
  if (start < end && step < 0) return 0;
  if (start > end && step > 0) return 0;
  const distance = Math.abs(end - start);
  return Math.floor(distance / Math.abs(step)) + 1;
}

function buildDistributionAlignment(): DuritEkstribusenDistributionAlignment {
  const model = getDistribucijaModel();
  const activeNodesPct = round((model.kpi.aktivnihCvorova / Math.max(model.kpi.ukupnoCvorova, 1)) * 100);
  const activeChannelsPct = round((model.kpi.aktivnihKanala / Math.max(model.kpi.ukupnoKanala, 1)) * 100);

  return {
    sourceOfTruth: '/api/distribucija',
    modelStatus: model.status,
    readinessStatus: model.readiness.status,
    readinessScore: model.readiness.score,
    activeNodesPct,
    activeChannelsPct,
    dailyTrafficTb: round(model.kpi.dnevniPrometTb),
  };
}

function durationSince(startTime: number): number {
  return round(performance.now() - startTime);
}

function recordMetrics(status: DuritEkserFarDirDorDarEkstribusenStatus, score: number): void {
  evaluations += 1;
  lastScore = score;
  lastStatus = status;
  lastEvaluatedAt = new Date().toISOString();
}

function placeholderPetlja(
  kind: PetljaResult['kind'],
  goal: string,
  input: DuritEkserFarDirDorDarEkstribusenInput,
  warning: string,
): PetljaResult {
  return {
    kind,
    goal,
    input: {
      start: input.start ?? 0,
      end: input.end ?? 0,
      step: input.step ?? 1,
      target: input.target ?? 0,
      sequence: [],
      maxIterations: Math.floor(input.maxIterations ?? 10_000),
      maxDurationMs: Math.floor(input.maxDurationMs ?? 50),
      status: 'DISABLED',
    },
    status: 'DISABLED',
    statusTrail: [],
    output: 0,
    iterations: 0,
    completed: false,
    reason: 'invalid-input',
    warnings: [warning],
    durationMs: 0,
    trace: [],
  };
}

function invalidResult(
  input: DuritEkserFarDirDorDarEkstribusenInput,
  warning: string,
  startTime: number,
): DuritEkserFarDirDorDarEkstribusenResult {
  const distribution = buildDistributionAlignment();
  const dor = placeholderPetlja(
    'DOR PETLJA',
    'Sabiranje apsolutnog odstupanja svake posećene vrednosti od target vrednosti.',
    input,
    warning,
  );
  const dar = placeholderPetlja(
    'DAR PETLJA',
    'Računanje aritmetičke sredine svih posećenih vrednosti u opsegu.',
    input,
    warning,
  );
  const result: DuritEkserFarDirDorDarEkstribusenResult = {
    referenceId: input.referenceId ?? 'n/a',
    slug: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG,
    label: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_LABEL,
    overallScore: 0,
    status: 'BLOCKED',
    valid: false,
    warnings: [warning],
    durationMs: durationSince(startTime),
    minimumScore: Number.isFinite(input.minimumScore) ? Number(input.minimumScore) : DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE,
    targetScore: Number.isFinite(input.targetScore) ? Number(input.targetScore) : DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE,
    targetDelta: round(0 - (Number.isFinite(input.targetScore) ? Number(input.targetScore) : DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE)),
    distribution,
    signals: [],
    dor,
    dar,
    audit: {
      expectedIterations: 0,
      completedPetlje: 0,
      degradedSources: ['input-validation'],
    },
  };

  recordMetrics(result.status, result.overallScore);
  return result;
}

function resolveStatus(
  blocked: boolean,
  degraded: boolean,
  score: number,
  minimumScore: number,
  targetScore: number,
  readinessStatus: DuritEkstribusenDistributionAlignment['readinessStatus'],
): DuritEkserFarDirDorDarEkstribusenStatus {
  if (blocked) return 'BLOCKED';
  if (degraded || score < minimumScore) return 'DEGRADED';
  if (score >= targetScore && readinessStatus === 'spremno') return 'EKSTRIBUSEN';
  return 'READY';
}

function petljaExecutionScore(completed: boolean, reason: string, status: string): number {
  if (reason === 'invalid-input' || reason === 'blocked-status') return 0;
  if (!completed) return 45;
  if (status !== 'ACTIVATED') return 70;
  return 100;
}

export function evaluateDuritEkserFarDirDorDarEkstribusen(
  input: DuritEkserFarDirDorDarEkstribusenInput,
): DuritEkserFarDirDorDarEkstribusenResult {
  const startTime = performance.now();

  const minimumScore = input.minimumScore ?? DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE;
  if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 100) {
    return invalidResult(input, 'minimumScore must be between 0 and 100', startTime);
  }

  const targetScore = input.targetScore ?? DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE;
  if (!Number.isFinite(targetScore) || targetScore < 0 || targetScore > 100) {
    return invalidResult(input, 'targetScore must be between 0 and 100', startTime);
  }

  if (targetScore < minimumScore) {
    return invalidResult(input, 'targetScore must be greater than or equal to minimumScore', startTime);
  }

  for (const [name, value] of [
    ['start', input.start ?? 0],
    ['end', input.end ?? 0],
    ['step', input.step ?? 1],
    ['target', input.target ?? 0],
  ] as const) {
    if (!Number.isFinite(value)) {
      return invalidResult(input, `${name} must be a finite number`, startTime);
    }
  }

  const dor = runDorPetlja({
    start: input.start,
    end: input.end,
    step: input.step,
    target: input.target,
    maxIterations: input.maxIterations,
    maxDurationMs: input.maxDurationMs,
    status: input.status,
  });
  const dar = runDarPetlja({
    start: input.start,
    end: input.end,
    step: input.step,
    target: input.target,
    maxIterations: input.maxIterations,
    maxDurationMs: input.maxDurationMs,
    status: input.status,
  });

  const distribution = buildDistributionAlignment();
  const warnings = [
    ...dor.warnings,
    ...dar.warnings,
    ...(distribution.readinessStatus !== 'spremno'
      ? [`distribucija readiness je ${distribution.readinessStatus}`]
      : []),
  ];
  const degradedSources: string[] = [];
  const expected = expectedIterations(input.start ?? 0, input.end ?? 0, input.step ?? 1);
  const completedPetlje = Number(dor.completed) + Number(dar.completed);

  if (!expected) {
    degradedSources.push('range-shape');
  }
  if (dor.reason !== 'completed') degradedSources.push(`dor:${dor.reason}`);
  if (dar.reason !== 'completed') degradedSources.push(`dar:${dar.reason}`);
  if (distribution.readinessStatus !== 'spremno') degradedSources.push(`distribucija:${distribution.readinessStatus}`);

  const maxEdgeDistance = Math.max(
    Math.abs((input.start ?? 0) - (input.target ?? 0)),
    Math.abs((input.end ?? 0) - (input.target ?? 0)),
    1,
  );
  const stepMagnitude = Math.max(Math.abs(input.step ?? 1), 1);
  const normalizationDenominator = maxEdgeDistance + stepMagnitude;
  const averageDeviation = expected > 0 ? Math.abs(dor.output) / expected : Math.abs(dor.output);
  const duritScore = clampScore(100 - (averageDeviation / normalizationDenominator) * 100);
  const ekserScore = clampScore(100 - (Math.abs(dar.output - (input.target ?? 0)) / normalizationDenominator) * 100);
  const iterationCoveragePct = expected > 0
    ? clampScore((Math.min(dor.iterations, dar.iterations) / expected) * 100)
    : 0;
  const farScore = clampScore((iterationCoveragePct * 0.5) + (distribution.readinessScore * 0.5));
  const dirScore = clampScore((
    petljaExecutionScore(dor.completed, dor.reason, dor.status)
    + petljaExecutionScore(dar.completed, dar.reason, dar.status)
    + (distribution.readinessStatus === 'spremno' ? 100 : distribution.readinessStatus === 'oprez' ? 70 : 35)
  ) / 3);

  const signals: DuritEkstribusenSignalResult[] = [
    {
      id: 'DURIT',
      label: 'Durability of target stability across the traversed range',
      score: duritScore,
      weight: 0.35,
      contribution: round(duritScore * 0.35),
      description: 'Derived from DOR average deviation normalized by the traversed range budget.',
    },
    {
      id: 'EKSER',
      label: 'Anchor precision of the DAR average relative to the target',
      score: ekserScore,
      weight: 0.25,
      contribution: round(ekserScore * 0.25),
      description: 'Measures how tightly the DAR arithmetic mean stays pinned to the target.',
    },
    {
      id: 'FAR',
      label: 'Distribution reach aligned with iteration coverage and distribucija readiness',
      score: farScore,
      weight: 0.2,
      contribution: round(farScore * 0.2),
      description: 'Combines loop coverage with the shared distribucija readiness score.',
    },
    {
      id: 'DIR',
      label: 'Execution directness across child petlje and distribution readiness',
      score: dirScore,
      weight: 0.2,
      contribution: round(dirScore * 0.2),
      description: 'Rewards completed child petlje and healthy distribution execution state.',
    },
  ];

  const overallScore = clampScore(signals.reduce((sum, signal) => sum + signal.contribution, 0));
  const targetDelta = round(overallScore - targetScore);
  const belowMinimumScore = overallScore < minimumScore;
  const distributionHardBlocked = distribution.readinessStatus === 'blokirano';
  const distributionSoftDegraded = distribution.readinessStatus === 'oprez' || distribution.modelStatus !== 'aktivan';
  const blocked = dor.reason === 'invalid-input'
    || dar.reason === 'invalid-input'
    || dor.reason === 'blocked-status'
    || dar.reason === 'blocked-status'
    || distributionHardBlocked;
  const degraded = !blocked && (!dor.completed || !dar.completed || distributionSoftDegraded || belowMinimumScore);

  if (belowMinimumScore) {
    warnings.push(`overall ekstribusen score ${overallScore} is below minimumScore ${minimumScore}`);
    degradedSources.push('minimum-score');
  }
  if (Math.abs(targetDelta) > 15) {
    warnings.push(`overall ekstribusen score is far from targetScore ${targetScore} (delta ${targetDelta})`);
  }
  if (distribution.modelStatus !== 'aktivan') {
    warnings.push(`distribucija model status is ${distribution.modelStatus}`);
  }

  const status = resolveStatus(blocked, degraded, overallScore, minimumScore, targetScore, distribution.readinessStatus);
  const valid = !blocked
    && dor.completed
    && dar.completed
    && !belowMinimumScore
    && !distributionSoftDegraded;

  recordMetrics(status, overallScore);

  return {
    referenceId: input.referenceId ?? 'n/a',
    slug: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG,
    label: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_LABEL,
    overallScore,
    status,
    valid,
    warnings,
    durationMs: durationSince(startTime),
    minimumScore,
    targetScore,
    targetDelta,
    distribution,
    signals,
    dor,
    dar,
    audit: {
      expectedIterations: expected,
      completedPetlje,
      degradedSources,
    },
  };
}

export function getDuritEkserFarDirDorDarEkstribusenHealthReport(): DuritEkserFarDirDorDarEkstribusenHealthReport {
  return {
    personaId: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERSONA_ID,
    contractVersion: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION,
    moduleVersion: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_MODULE_VERSION,
    evaluations,
    lastScore,
    lastStatus,
    lastEvaluatedAt,
    performanceMaxMs: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_API_RESPONSE_MAX_MS,
    defaultMinimumScore: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE,
    defaultTargetScore: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE,
    slug: DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG,
    sourceOfTruth: '/api/durit-ekser-far-dir-dor-dar-ekstribusen/evaluate',
  };
}

export function _resetDuritEkserFarDirDorDarEkstribusenMetrics(): void {
  evaluations = 0;
  lastScore = 0;
  lastStatus = 'BLOCKED';
  lastEvaluatedAt = null;
}
