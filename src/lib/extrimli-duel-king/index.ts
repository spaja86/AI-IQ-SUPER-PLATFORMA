import type {
  DuelKingDurGameSignalInput,
  DuelKingDurGameSignalResult,
  DuelKingDurSignalStatus,
  DuelKingGearRequirement,
  DuelKingKurGameSignalInput,
  DuelKingKurGameSignalResult,
  DuelKingKurSignalStatus,
  DuelKingInput,
  DuelKingMolGameSignalInput,
  DuelKingMolGameSignalResult,
  DuelKingMolSignalStatus,
  DuelKingMode,
  DuelKingResult,
  DuelKingTelemetryStatus,
  DuelKingTournamentState,
  RiskLevel,
} from '../extrimli/types';
import { clamp, round } from '../extrimli/utils';
import { runKurPetlja } from '../petlje';
import {
  EXTRIMLI_DUEL_KING_API_MAX_MS,
  EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_EVALUATION_MAX_MS,
  EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MODULE_VERSION,
  EXTRIMLI_DUEL_KING_PERSONA_ID,
  EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH,
} from './types';
import type { DuelKingHealthReport } from './types';

const DUEL_KING_MODES: DuelKingMode[] = ['ARENA', 'TACTICAL', 'SURVIVAL'];
const DUEL_KING_TOURNAMENT_STATES: DuelKingTournamentState[] = ['OPEN', 'LOCKED', 'ACTIVE', 'COMPLETED', 'DEGRADED'];

const DUEL_KING_GEAR_REQUIREMENTS: Record<DuelKingMode, DuelKingGearRequirement[]> = {
  ARENA: [
    { category: 'helmet', minimumSafetyRating: 4, required: true },
    { category: 'pads', minimumSafetyRating: 4, required: true },
    { category: 'boots', minimumSafetyRating: 3, required: true },
  ],
  TACTICAL: [
    { category: 'helmet', minimumSafetyRating: 4, required: true },
    { category: 'pads', minimumSafetyRating: 4, required: true },
    { category: 'boots', minimumSafetyRating: 4, required: true },
  ],
  SURVIVAL: [
    { category: 'helmet', minimumSafetyRating: 5, required: true },
    { category: 'pads', minimumSafetyRating: 4, required: true },
    { category: 'boots', minimumSafetyRating: 4, required: true },
  ],
};

const RISK_LEVEL_THRESHOLDS: { level: RiskLevel; min: number }[] = [
  { level: 'EXTREME', min: 75 },
  { level: 'HIGH', min: 50 },
  { level: 'MEDIUM', min: 25 },
  { level: 'LOW', min: 0 },
];

let evaluations = 0;
let telemetryStatus: DuelKingTelemetryStatus = 'BASELINE';
let lastReadinessScore = 50;
let lastDuelRiskScore = 50;
let kurEvaluations = 0;
let kurDegradedEvaluations = 0;
let durEvaluations = 0;
let durDegradedEvaluations = 0;
let molEvaluations = 0;
let molDegradedEvaluations = 0;
let lastKurEvaluationStatus: DuelKingKurSignalStatus = 'BASELINE';
let lastDurEvaluationStatus: DuelKingDurSignalStatus = 'BASELINE';
let lastMolEvaluationStatus: DuelKingMolSignalStatus = 'BASELINE';
let lastKurProgressionSignal = 50;
let lastDurProgressionSignal = 50;
let lastMolProgressionSignal = 50;
let lastKurImpactScore = 0;
let lastDurImpactScore = 0;
let lastMolImpactScore = 0;
let lastKurSignalStatus: DuelKingKurSignalStatus = 'BASELINE';
let lastDurSignalStatus: DuelKingDurSignalStatus = 'BASELINE';
let lastMolSignalStatus: DuelKingMolSignalStatus = 'BASELINE';
let lastTournamentState: DuelKingTournamentState | null = null;
const MAX_KUR_IMPACT_SCORE = 8;
const MAX_DUR_IMPACT_SCORE = 6;
const MAX_MOL_IMPACT_SCORE = 5;
export interface DuelKingCompositeReadinessWeights {
  kur: number;
  dur: number;
  mol: number;
}

export const DUEL_KING_COMPOSITE_READINESS_WEIGHTS: DuelKingCompositeReadinessWeights = {
  kur: 0.20,
  dur: 0.15,
  mol: 0.10,
} as const;
const DUEL_KING_KUR_DEFAULT_MAX_DURATION_MS = Math.min(20, EXTRIMLI_DUEL_KING_EVALUATION_MAX_MS);
const DUEL_KING_DUR_DEFAULT_MAX_DURATION_MS = Math.min(20, EXTRIMLI_DUEL_KING_EVALUATION_MAX_MS);
const DUEL_KING_MOL_DEFAULT_MAX_DURATION_MS = Math.min(20, EXTRIMLI_DUEL_KING_EVALUATION_MAX_MS);

function resolveRiskLevel(score: number): RiskLevel {
  for (const { level, min } of RISK_LEVEL_THRESHOLDS) {
    if (score >= min) return level;
  }
  return 'LOW';
}

function defaultRequirements(mode: DuelKingMode | null): DuelKingGearRequirement[] {
  if (!mode) return [];
  return DUEL_KING_GEAR_REQUIREMENTS[mode].map((item) => ({ ...item }));
}

function resolveCompositeReadinessWeights(
  weights: DuelKingCompositeReadinessWeights,
): DuelKingCompositeReadinessWeights {
  const allFinite = Number.isFinite(weights.kur) && Number.isFinite(weights.dur) && Number.isFinite(weights.mol);
  const allNonNegative = weights.kur >= 0 && weights.dur >= 0 && weights.mol >= 0;
  const total = weights.kur + weights.dur + weights.mol;
  if (!allFinite || !allNonNegative || total > 1) {
    return DUEL_KING_COMPOSITE_READINESS_WEIGHTS;
  }
  return weights;
}

export function computeDuelKingCompositeReadiness(
  report: DuelKingHealthReport,
  weights: DuelKingCompositeReadinessWeights = DUEL_KING_COMPOSITE_READINESS_WEIGHTS,
): number {
  const effectiveWeights = resolveCompositeReadinessWeights(weights);
  const duelKingReadiness = clamp(report.lastReadinessScore, 0, 100);
  const kurLive = report.kurTelemetryStatus === 'LIVE' && report.lastKurSignalStatus === 'LIVE';
  const durLive = report.durTelemetryStatus === 'LIVE' && report.lastDurSignalStatus === 'LIVE';
  const molLive = report.molTelemetryStatus === 'LIVE' && report.lastMolSignalStatus === 'LIVE';
  const kurSignal = clamp(report.lastKurProgressionSignal, 0, 100);
  const durSignal = clamp(report.lastDurProgressionSignal, 0, 100);
  const molSignal = clamp(report.lastMolProgressionSignal, 0, 100);

  return round(clamp(
    duelKingReadiness
    * (1 - (kurLive ? effectiveWeights.kur : 0) - (durLive ? effectiveWeights.dur : 0) - (molLive ? effectiveWeights.mol : 0))
    + (kurLive ? kurSignal * effectiveWeights.kur : 0)
    + (durLive ? durSignal * effectiveWeights.dur : 0)
    + (molLive ? molSignal * effectiveWeights.mol : 0),
    0,
    100,
  ), 2);
}

type DuelKingInGameSignalInput = DuelKingKurGameSignalInput | DuelKingDurGameSignalInput | DuelKingMolGameSignalInput;
type DuelKingInGameSignalResult = DuelKingKurGameSignalResult | DuelKingDurGameSignalResult | DuelKingMolGameSignalResult;
type DuelKingInGameSignalStatus = DuelKingKurSignalStatus | DuelKingDurSignalStatus | DuelKingMolSignalStatus;

function evaluateInGameSignal(
  signalName: 'KUR' | 'DUR' | 'MOL',
  input: DuelKingInGameSignalInput | undefined,
  maxImpactScore: number,
  defaultMaxDurationMs: number,
): DuelKingInGameSignalResult {
  if (!input) {
    return {
      status: 'BASELINE',
      applied: false,
      progressionSignal: 50,
      impactScore: 0,
      completed: true,
      reason: 'not-provided',
      warnings: [],
      petlja: null,
    };
  }

  const warnings: string[] = [];
  const hasFiniteCoreFields = Number.isFinite(input.start) && Number.isFinite(input.target) && Number.isFinite(input.step);
  const hasValidStep = input.step !== 0;
  const hasValidMaxIterations = input.maxIterations === undefined || (Number.isFinite(input.maxIterations) && input.maxIterations >= 1);
  const hasValidMaxDuration = input.maxDurationMs === undefined || (Number.isFinite(input.maxDurationMs) && input.maxDurationMs >= 0);

  if (!hasFiniteCoreFields || !hasValidStep || !hasValidMaxIterations || !hasValidMaxDuration) {
    if (!hasFiniteCoreFields) warnings.push(`${signalName} signal requires finite start, target, and step values.`);
    if (!hasValidStep) warnings.push(`${signalName} signal step must not be 0.`);
    if (!hasValidMaxIterations) warnings.push(`${signalName} signal maxIterations must be >= 1 when provided.`);
    if (!hasValidMaxDuration) warnings.push(`${signalName} signal maxDurationMs must be >= 0 when provided.`);
    return {
      status: 'DEGRADED',
      applied: false,
      progressionSignal: 50,
      impactScore: 0,
      completed: false,
      reason: 'invalid-input',
      warnings,
      petlja: null,
    };
  }

  const kurResult = runKurPetlja({
    start: input.start,
    end: input.target,
    target: input.target,
    step: input.step,
    status: 'ACTIVATED',
    maxIterations: input.maxIterations ?? 128,
    maxDurationMs: input.maxDurationMs ?? defaultMaxDurationMs,
  });

  const pathSpan = Math.max(Math.abs(input.target - input.start), 1);
  const finalValue = kurResult.trace.length > 0
    ? kurResult.trace[kurResult.trace.length - 1].value
    : input.start;
  const distanceClosureRatio = clamp(
    (pathSpan - Math.abs(input.target - finalValue)) / pathSpan,
    0,
    1,
  );
  const executionEfficiency = clamp(
    pathSpan / Math.max(kurResult.iterations, pathSpan),
    0,
    1,
  );
  const progressionSignal = round(
    clamp(
      distanceClosureRatio * 70
      + executionEfficiency * 20
      + (kurResult.completed ? 10 : 0),
      0,
      100,
    ),
    2,
  );
  const impactScore = round(clamp((progressionSignal - 50) * 0.16, -maxImpactScore, maxImpactScore), 2);
  const isBoundedTermination = kurResult.reason === 'max-iterations' || kurResult.reason === 'time-limit';
  const isSignalFailure = kurResult.reason === 'invalid-input' || kurResult.reason === 'blocked-status';
  const status: DuelKingInGameSignalStatus = isSignalFailure ? 'DEGRADED' : 'LIVE';
  if (isBoundedTermination) {
    warnings.push(`${signalName} signal reached bounded termination (${kurResult.reason}) and was applied with limited impact.`);
  }
  if (status === 'DEGRADED') {
    warnings.push(`${signalName} signal entered degraded mode because petlja finished with reason=${kurResult.reason}.`);
  }

  return {
    status,
    applied: status === 'LIVE',
    progressionSignal,
    impactScore,
    completed: kurResult.completed,
    reason: kurResult.reason === 'blocked-status' ? 'blocked-status' : kurResult.reason,
    warnings,
    petlja: {
      output: kurResult.output,
      iterations: kurResult.iterations,
      status: kurResult.status,
      reason: kurResult.reason,
    },
  };
}

function evaluateKurGameSignal(input: DuelKingKurGameSignalInput | undefined): DuelKingKurGameSignalResult {
  return evaluateInGameSignal('KUR', input, MAX_KUR_IMPACT_SCORE, DUEL_KING_KUR_DEFAULT_MAX_DURATION_MS) as DuelKingKurGameSignalResult;
}

function evaluateDurGameSignal(input: DuelKingDurGameSignalInput | undefined): DuelKingDurGameSignalResult {
  return evaluateInGameSignal('DUR', input, MAX_DUR_IMPACT_SCORE, DUEL_KING_DUR_DEFAULT_MAX_DURATION_MS) as DuelKingDurGameSignalResult;
}

function evaluateMolGameSignal(input: DuelKingMolGameSignalInput | undefined): DuelKingMolGameSignalResult {
  return evaluateInGameSignal('MOL', input, MAX_MOL_IMPACT_SCORE, DUEL_KING_MOL_DEFAULT_MAX_DURATION_MS) as DuelKingMolGameSignalResult;
}

function invalidResult(input: Partial<DuelKingInput>, warning: string, start: number): DuelKingResult {
  evaluations += 1;
  telemetryStatus = 'LIVE';
  lastReadinessScore = 0;
  lastDuelRiskScore = Math.max(lastDuelRiskScore, 50);
  lastTournamentState = DUEL_KING_TOURNAMENT_STATES.includes(input.tournamentState as DuelKingTournamentState)
    ? (input.tournamentState as DuelKingTournamentState)
    : null;
  return {
    referenceId: input.referenceId ?? 'n/a',
    sportId: 'duel-king',
    fighterId: typeof input.fighterId === 'string' ? input.fighterId : null,
    duelMode: DUEL_KING_MODES.includes(input.duelMode as DuelKingMode) ? (input.duelMode as DuelKingMode) : null,
    readinessScore: 0,
    duelRiskScore: 0,
    riskLevel: 'LOW',
    fighterProgressionScore: 0,
    gearCleared: false,
    requiredGear: defaultRequirements(DUEL_KING_MODES.includes(input.duelMode as DuelKingMode) ? (input.duelMode as DuelKingMode) : null),
    tournamentState: DUEL_KING_TOURNAMENT_STATES.includes(input.tournamentState as DuelKingTournamentState)
      ? (input.tournamentState as DuelKingTournamentState)
      : null,
    bracketStatus: 'HOLD',
    degraded: false,
    degradedMode: null,
    valid: false,
    warnings: [warning],
    kurGameSignal: {
      status: input.kurGameSignal ? 'DEGRADED' : 'BASELINE',
      applied: false,
      progressionSignal: 50,
      impactScore: 0,
      completed: false,
      reason: input.kurGameSignal ? 'invalid-input' : 'not-provided',
      warnings: input.kurGameSignal ? ['KUR signal ignored because DUEL KING core validation failed.'] : [],
      petlja: null,
    },
    durGameSignal: {
      status: input.durGameSignal ? 'DEGRADED' : 'BASELINE',
      applied: false,
      progressionSignal: 50,
      impactScore: 0,
      completed: false,
      reason: input.durGameSignal ? 'invalid-input' : 'not-provided',
      warnings: input.durGameSignal ? ['DUR signal ignored because DUEL KING core validation failed.'] : [],
      petlja: null,
    },
    molGameSignal: {
      status: input.molGameSignal ? 'DEGRADED' : 'BASELINE',
      applied: false,
      progressionSignal: 50,
      impactScore: 0,
      completed: false,
      reason: input.molGameSignal ? 'invalid-input' : 'not-provided',
      warnings: input.molGameSignal ? ['MOL signal ignored because DUEL KING core validation failed.'] : [],
      petlja: null,
    },
    recommendation: 'DUEL KING evaluation rejected until all required combat inputs are valid.',
    durationMs: Date.now() - start,
  };
}

export function evaluateDuelKing(input: DuelKingInput): DuelKingResult {
  const start = Date.now();

  if (input.sportId !== 'duel-king') {
    return invalidResult(input, 'sportId must be duel-king', start);
  }
  if (!DUEL_KING_MODES.includes(input.duelMode)) {
    return invalidResult(input, 'duelMode must be one of ARENA, TACTICAL, SURVIVAL', start);
  }

  const boundedFields: Array<[string, number, number]> = [
    ['fighterExperience', input.fighterExperience, 10],
    ['opponentTier', input.opponentTier, 10],
    ['arenaHazard', input.arenaHazard, 10],
    ['staminaReserve', input.staminaReserve, 10],
    ['gearQualityIndex', input.gearQualityIndex, 10],
  ];
  for (const [name, value, max] of boundedFields) {
    if (!Number.isFinite(value) || value < 0 || value > max) {
      return invalidResult(input, `${name} must be a finite number in [0, ${max}]`, start);
    }
  }
  if (!Number.isFinite(input.reactionTimeMs) || input.reactionTimeMs < 50 || input.reactionTimeMs > 1000) {
    return invalidResult(input, 'reactionTimeMs must be a finite number in [50, 1000]', start);
  }
  if (input.recentSessions !== undefined) {
    if (!Number.isInteger(input.recentSessions) || input.recentSessions < 0 || input.recentSessions > 100) {
      return invalidResult(input, 'recentSessions must be an integer in [0, 100]', start);
    }
  }
  if (input.tournamentState !== undefined && !DUEL_KING_TOURNAMENT_STATES.includes(input.tournamentState)) {
    return invalidResult(input, 'tournamentState must be a known DUEL KING tournament state', start);
  }
  if (input.activeGearCategories !== undefined) {
    if (!Array.isArray(input.activeGearCategories) || input.activeGearCategories.some((value) => typeof value !== 'string')) {
      return invalidResult(input, 'activeGearCategories must be an array of gear categories', start);
    }
  }

  const warnings: string[] = [];
  let degraded = false;
  let degradedByCoreSignals = false;
  const kurGameSignal = evaluateKurGameSignal(input.kurGameSignal);
  const durGameSignal = evaluateDurGameSignal(input.durGameSignal);
  const molGameSignal = evaluateMolGameSignal(input.molGameSignal);

  const recentSessions = input.recentSessions ?? 0;
  if (input.recentSessions === undefined) {
    degraded = true;
    degradedByCoreSignals = true;
    warnings.push('recentSessions missing; progression score degraded to conservative default');
  }

  const activeGearCategories = input.activeGearCategories ?? [];
  if (input.activeGearCategories === undefined) {
    degraded = true;
    degradedByCoreSignals = true;
    warnings.push('activeGearCategories missing; gear clearance downgraded to degraded mode');
  }

  const tournamentState = input.tournamentState ?? 'DEGRADED';
  if (input.tournamentState === undefined) {
    degraded = true;
    degradedByCoreSignals = true;
    warnings.push('tournamentState missing; tournament posture marked as DEGRADED');
  }

  const requiredGear = defaultRequirements(input.duelMode);
  const gearCleared = activeGearCategories.length > 0 && requiredGear.every((item) => activeGearCategories.includes(item.category));
  if (!gearCleared) {
    warnings.push('required DUEL KING gear set is incomplete for the selected duel mode');
  }
  if (input.kurGameSignal && kurGameSignal.status === 'DEGRADED') {
    degraded = true;
    warnings.push(...kurGameSignal.warnings);
  }
  if (input.durGameSignal && durGameSignal.status === 'DEGRADED') {
    degraded = true;
    warnings.push(...durGameSignal.warnings);
  }
  if (input.molGameSignal && molGameSignal.status === 'DEGRADED') {
    degraded = true;
    warnings.push(...molGameSignal.warnings);
  }

  const reactionPenalty = clamp(((input.reactionTimeMs - 50) / 950) * 10, 0, 10);
  let duelRiskScore = round(clamp((
    (10 - input.fighterExperience) * 0.24 +
    input.opponentTier * 0.22 +
    input.arenaHazard * 0.24 +
    (10 - input.staminaReserve) * 0.15 +
    (10 - input.gearQualityIndex) * 0.10 +
    reactionPenalty * 0.05
  ) * 10, 0, 100), 2);
  if (kurGameSignal.applied) {
    duelRiskScore = round(clamp(duelRiskScore - kurGameSignal.impactScore * 0.6, 0, 100), 2);
  }
  if (durGameSignal.applied) {
    duelRiskScore = round(clamp(duelRiskScore - durGameSignal.impactScore * 0.5, 0, 100), 2);
  }
  if (molGameSignal.applied) {
    duelRiskScore = round(clamp(duelRiskScore - molGameSignal.impactScore * 0.4, 0, 100), 2);
  }

  const fighterProgressionScore = round(clamp(
    input.fighterExperience * 5.4
    + clamp(recentSessions, 0, 20) * 2.1
    + input.staminaReserve * 3.1
    - Math.abs(input.opponentTier - input.fighterExperience) * 1.2,
    0,
    100,
  ), 2);

  const inGameSignalImpact = (kurGameSignal.applied ? kurGameSignal.impactScore : 0)
    + (durGameSignal.applied ? durGameSignal.impactScore : 0)
    + (molGameSignal.applied ? molGameSignal.impactScore : 0);
  let readinessScore = round(clamp(
    100 - duelRiskScore * 0.58 + fighterProgressionScore * 0.32 + input.gearQualityIndex * 1.1 + inGameSignalImpact,
    0,
    100,
  ), 2);

  if (!gearCleared) {
    readinessScore = round(clamp(readinessScore - 18, 0, 100), 2);
  }
  if (degraded && degradedByCoreSignals) {
    readinessScore = round(clamp(readinessScore - 8, 0, 100), 2);
  }
  if (input.kurGameSignal && kurGameSignal.status === 'DEGRADED') {
    readinessScore = round(clamp(readinessScore - 6, 0, 100), 2);
  }
  if (input.durGameSignal && durGameSignal.status === 'DEGRADED') {
    readinessScore = round(clamp(readinessScore - 5, 0, 100), 2);
  }
  if (input.molGameSignal && molGameSignal.status === 'DEGRADED') {
    readinessScore = round(clamp(readinessScore - 4, 0, 100), 2);
  }

  const riskLevel = resolveRiskLevel(duelRiskScore);
  const bracketStatus = degraded
    ? 'DEGRADED'
    : tournamentState === 'COMPLETED'
      ? 'HOLD'
      : readinessScore >= 70 && gearCleared
        ? 'READY'
        : 'HOLD';

  evaluations += 1;
  telemetryStatus = 'LIVE';
  lastReadinessScore = readinessScore;
  lastDuelRiskScore = duelRiskScore;
  lastTournamentState = tournamentState;
  if (input.kurGameSignal) {
    kurEvaluations += 1;
    lastKurEvaluationStatus = kurGameSignal.status;
    lastKurProgressionSignal = kurGameSignal.progressionSignal;
    lastKurImpactScore = kurGameSignal.impactScore;
    lastKurSignalStatus = kurGameSignal.status;
    if (kurGameSignal.status === 'DEGRADED') {
      kurDegradedEvaluations += 1;
    }
  } else {
    lastKurEvaluationStatus = 'BASELINE';
    lastKurProgressionSignal = 50;
    lastKurImpactScore = 0;
    lastKurSignalStatus = 'BASELINE';
  }
  if (input.durGameSignal) {
    durEvaluations += 1;
    lastDurEvaluationStatus = durGameSignal.status;
    lastDurProgressionSignal = durGameSignal.progressionSignal;
    lastDurImpactScore = durGameSignal.impactScore;
    lastDurSignalStatus = durGameSignal.status;
    if (durGameSignal.status === 'DEGRADED') {
      durDegradedEvaluations += 1;
    }
  } else {
    lastDurEvaluationStatus = 'BASELINE';
    lastDurProgressionSignal = 50;
    lastDurImpactScore = 0;
    lastDurSignalStatus = 'BASELINE';
  }
  if (input.molGameSignal) {
    molEvaluations += 1;
    lastMolEvaluationStatus = molGameSignal.status;
    lastMolProgressionSignal = molGameSignal.progressionSignal;
    lastMolImpactScore = molGameSignal.impactScore;
    lastMolSignalStatus = molGameSignal.status;
    if (molGameSignal.status === 'DEGRADED') {
      molDegradedEvaluations += 1;
    }
  } else {
    lastMolEvaluationStatus = 'BASELINE';
    lastMolProgressionSignal = 50;
    lastMolImpactScore = 0;
    lastMolSignalStatus = 'BASELINE';
  }

  return {
    referenceId: input.referenceId ?? 'n/a',
    sportId: 'duel-king',
    fighterId: typeof input.fighterId === 'string' ? input.fighterId : null,
    duelMode: input.duelMode,
    readinessScore,
    duelRiskScore,
    riskLevel,
    fighterProgressionScore,
    gearCleared,
    requiredGear,
    tournamentState,
    bracketStatus,
    degraded,
    degradedMode: degraded ? 'partial-payload-no-500' : null,
    valid: true,
    warnings,
    kurGameSignal,
    durGameSignal,
    molGameSignal,
    recommendation: bracketStatus === 'READY'
      ? 'DUEL KING readiness is stable. Proceed with bracket lock and monitored activation.'
      : degraded
        ? 'DUEL KING readiness degraded. Continue only after tournament state and gear telemetry are restored.'
        : 'DUEL KING readiness is below activation threshold. Improve progression, gear coverage, or stamina before the duel.',
    durationMs: Date.now() - start,
  };
}

export function getDuelKingHealthReport(): DuelKingHealthReport {
  const kurSignalCoverageScore = evaluations === 0 ? 0 : round(clamp((kurEvaluations / evaluations) * 100, 0, 100), 2);
  const durSignalCoverageScore = evaluations === 0 ? 0 : round(clamp((durEvaluations / evaluations) * 100, 0, 100), 2);
  const molSignalCoverageScore = evaluations === 0 ? 0 : round(clamp((molEvaluations / evaluations) * 100, 0, 100), 2);
  const kurTelemetryStatus: DuelKingKurSignalStatus = kurEvaluations === 0
    ? 'BASELINE'
    : lastKurEvaluationStatus;
  const durTelemetryStatus: DuelKingDurSignalStatus = durEvaluations === 0
    ? 'BASELINE'
    : lastDurEvaluationStatus;
  const molTelemetryStatus: DuelKingMolSignalStatus = molEvaluations === 0
    ? 'BASELINE'
    : lastMolEvaluationStatus;
  return {
    personaId: EXTRIMLI_DUEL_KING_PERSONA_ID,
    contractVersion: EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_DUEL_KING_MODULE_VERSION,
    sourceOfTruth: EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH,
    telemetryStatus,
    kurTelemetryStatus,
    durTelemetryStatus,
    molTelemetryStatus,
    kurContractVersion: EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION,
    durContractVersion: EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION,
    molContractVersion: EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION,
    evaluations,
    kurEvaluations,
    durEvaluations,
    molEvaluations,
    kurDegradedEvaluations,
    durDegradedEvaluations,
    molDegradedEvaluations,
    kurSignalCoverageScore,
    durSignalCoverageScore,
    molSignalCoverageScore,
    lastReadinessScore,
    lastDuelRiskScore,
    lastKurProgressionSignal,
    lastDurProgressionSignal,
    lastMolProgressionSignal,
    lastKurImpactScore,
    lastDurImpactScore,
    lastMolImpactScore,
    lastKurSignalStatus,
    lastDurSignalStatus,
    lastMolSignalStatus,
    lastTournamentState,
    performanceMaxMs: EXTRIMLI_DUEL_KING_EVALUATION_MAX_MS,
    apiResponseMaxMs: EXTRIMLI_DUEL_KING_API_MAX_MS,
  };
}

export function _resetDuelKingMetrics(): void {
  evaluations = 0;
  telemetryStatus = 'BASELINE';
  kurEvaluations = 0;
  durEvaluations = 0;
  molEvaluations = 0;
  kurDegradedEvaluations = 0;
  durDegradedEvaluations = 0;
  molDegradedEvaluations = 0;
  lastKurEvaluationStatus = 'BASELINE';
  lastDurEvaluationStatus = 'BASELINE';
  lastMolEvaluationStatus = 'BASELINE';
  lastReadinessScore = 50;
  lastDuelRiskScore = 50;
  lastKurProgressionSignal = 50;
  lastDurProgressionSignal = 50;
  lastMolProgressionSignal = 50;
  lastKurImpactScore = 0;
  lastDurImpactScore = 0;
  lastMolImpactScore = 0;
  lastKurSignalStatus = 'BASELINE';
  lastDurSignalStatus = 'BASELINE';
  lastMolSignalStatus = 'BASELINE';
  lastTournamentState = null;
}

export type {
  DuelKingHealthReport,
  DuelKingInput,
  DuelKingMode,
  DuelKingResult,
  DuelKingTournamentState,
};

export {
  DUEL_KING_GEAR_REQUIREMENTS,
  DUEL_KING_MODES,
  DUEL_KING_TOURNAMENT_STATES,
  EXTRIMLI_DUEL_KING_API_MAX_MS,
  EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_EVALUATION_MAX_MS,
  EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MODULE_VERSION,
  EXTRIMLI_DUEL_KING_PERSONA_ID,
  EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH,
};
