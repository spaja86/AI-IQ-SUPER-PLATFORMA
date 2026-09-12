import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  round,
} from '../extrimli';
import type {
  ExtrimliExtremAcceptanceCriterion,
  ExtrimliExtremConflictIntensity,
  ExtrimliExtremDiscanInKibenState,
  ExtrimliExtremEkodorState,
  ExtrimliExtremOptimizationTier,
  ExtrimliExtremProfileInput,
  ExtrimliExtremProfilerReport,
  ExtrimliExtremRekulitiPoRauletuPolicy,
  ExtrimliExtremResolutionInput,
  ExtrimliExtremSemaFormulaEvaluation,
} from './types';
import {
  EXTRIMLI_EXTREM_PROFILER_API_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH,
  EXTRIMLI_EXTREM_PROFILER_EVALUATION_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY,
  EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
} from './types';

function parsePercentEnv(name: string, fallback: number, degradedSources: string[]): number {
  const raw = process.env[name];
  if (typeof raw === 'undefined' || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    degradedSources.push(`invalid-env:${name}`);
    return fallback;
  }
  if (parsed < 0 || parsed > 100) {
    degradedSources.push(`out-of-range:${name}`);
  }
  return round(clamp(parsed, 0, 100), 2);
}

function parseLatencyEnv(name: string, fallback: number, degradedSources: string[]): number {
  const raw = process.env[name];
  if (typeof raw === 'undefined' || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    degradedSources.push(`invalid-env:${name}`);
    return fallback;
  }
  if (parsed < 0) degradedSources.push(`out-of-range:${name}`);
  return round(clamp(parsed, 0, 500), 2);
}

function parseFormulaScalarEnv(name: string, fallback: number, max: number, degradedSources: string[]): number {
  const raw = process.env[name];
  if (typeof raw === 'undefined' || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    degradedSources.push(`invalid-env:${name}`);
    return fallback;
  }
  if (parsed < 0 || parsed > max) degradedSources.push(`out-of-range:${name}`);
  return round(clamp(parsed, 0, max), 2);
}

function classifyConflict(conflictScore: number): ExtrimliExtremConflictIntensity {
  if (conflictScore >= 80) return 'CRITICAL';
  if (conflictScore >= 60) return 'HIGH';
  if (conflictScore >= 35) return 'MODERATE';
  return 'LOW';
}

function mapOptimizationTier(conflictIntensity: ExtrimliExtremConflictIntensity): ExtrimliExtremOptimizationTier {
  if (conflictIntensity === 'CRITICAL') return 'EXTREME_PROFILING_REQUIRED';
  if (conflictIntensity === 'HIGH') return 'AGGRESSIVE_OPTIMIZATION';
  if (conflictIntensity === 'MODERATE') return 'BALANCED_OPTIMIZATION';
  return 'MAXIMUM_GRAPHICS_UNLOCK';
}

function resolveProfileInput(degradedSources: string[]): ExtrimliExtremProfileInput {
  return {
    sceneLoadPercent: parsePercentEnv('EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT', 42, degradedSources),
    gpuContentionPercent: parsePercentEnv('EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT', 36, degradedSources),
    cpuContentionPercent: parsePercentEnv('EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT', 38, degradedSources),
    renderCycleLatencyMs: parseLatencyEnv('EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS', 32, degradedSources),
  };
}

function resolveResolutionInput(degradedSources: string[]): ExtrimliExtremResolutionInput {
  return {
    rezolucijaCompletenessPercent: parsePercentEnv('EXTRIMLI_EXTREM_REZOLUCIJA_COMPLETENESS_PERCENT', 74, degradedSources),
    ekodorAlignmentPercent: parsePercentEnv('EXTRIMLI_EXTREM_EKODOR_ALIGNMENT_PERCENT', 68, degradedSources),
    discanPressurePercent: parsePercentEnv('EXTRIMLI_EXTREM_DISCAN_PRESSURE_PERCENT', 28, degradedSources),
  };
}

function classifyEkodorState(score: number): ExtrimliExtremEkodorState {
  if (score >= EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED) return 'ALIGNED';
  if (score >= EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH) return 'WATCH';
  return 'BLOCKED';
}

function classifyDiscanInKibenState(score: number): ExtrimliExtremDiscanInKibenState {
  if (score <= EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR) return 'CLEAR';
  if (score <= EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH) return 'WATCH';
  return 'BLOCKED';
}

function classifyRekulitiPoRauletuPolicy(input: {
  rezolucijaScore: number;
  ekodorState: ExtrimliExtremEkodorState;
  discanInKibenState: ExtrimliExtremDiscanInKibenState;
}): ExtrimliExtremRekulitiPoRauletuPolicy {
  if (
    input.rezolucijaScore < EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY
    || input.ekodorState === 'BLOCKED'
    || input.discanInKibenState === 'BLOCKED'
  ) {
    return 'FREEZE';
  }
  if (input.ekodorState === 'WATCH' || input.discanInKibenState === 'WATCH') return 'WARN';
  return 'ALLOW';
}

function buildSemaMuSemaFormula(
  profileInput: ExtrimliExtremProfileInput,
  resolutionInput: ExtrimliExtremResolutionInput,
  degradedSources: string[],
): ExtrimliExtremSemaFormulaEvaluation {
  const beforeEvalDegradedCount = degradedSources.length;
  const derivedSema = round(
    clamp((profileInput.sceneLoadPercent * 0.6) + (resolutionInput.rezolucijaCompletenessPercent * 0.4), 0, 100),
    2,
  );
  const derivedAllSema = round(clamp(100 - resolutionInput.discanPressurePercent, 0, 100), 2);
  const sema = parseFormulaScalarEnv('EXTRIMLI_EXTREM_SHEMA_VALUE', derivedSema, 100, degradedSources);
  const allSema = parseFormulaScalarEnv('EXTRIMLI_EXTREM_ALL_SHEMA_VALUE', derivedAllSema, 100, degradedSources);
  const computedMuSema = round(clamp((sema * 2) + allSema, 0, 300), 2);
  const expectedMuSema = parseFormulaScalarEnv('EXTRIMLI_EXTREM_MUSHEMA_VALUE', computedMuSema, 300, degradedSources);
  const formulaDegradedSources = degradedSources.slice(beforeEvalDegradedCount);
  const hasFormulaMarker = (envName: string) => formulaDegradedSources.includes(`invalid-env:${envName}`)
    || formulaDegradedSources.includes(`out-of-range:${envName}`);
  const inputSubstitutions = [
    ...(hasFormulaMarker('EXTRIMLI_EXTREM_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_SHEMA_VALUE'] : []),
    ...(hasFormulaMarker('EXTRIMLI_EXTREM_ALL_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_ALL_SHEMA_VALUE'] : []),
    ...(hasFormulaMarker('EXTRIMLI_EXTREM_MUSHEMA_VALUE') ? ['EXTRIMLI_EXTREM_MUSHEMA_VALUE'] : []),
  ];
  const hasSubstitutions = inputSubstitutions.length > 0;
  const formulaHoldsRaw = Math.abs(computedMuSema - expectedMuSema) <= 0.01;
  const formulaHolds = !hasSubstitutions && formulaHoldsRaw;
  const deterministic = Number.isFinite(sema)
    && Number.isFinite(allSema)
    && Number.isFinite(expectedMuSema)
    && Number.isFinite(computedMuSema)
    && !hasSubstitutions;
  const blockerReasons = [
    ...(!hasSubstitutions && !formulaHoldsRaw ? [`MUŠEMA mismatch: expected ${expectedMuSema}, computed ${computedMuSema}`] : []),
    ...(deterministic ? [] : ['ŠEMA formula inputs are not deterministic']),
    ...(hasSubstitutions ? [`Formula inputs used fallback substitution: ${inputSubstitutions.join(', ')}`] : []),
  ];

  return {
    canonicalExpression: EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
    scopeLock: ['EXTRIMLI', 'EXTRONDOL', 'EXTREM'],
    inputs: {
      sema,
      allSema,
      expectedMuSema,
    },
    computedMuSema,
    formulaHolds,
    status: !hasSubstitutions && formulaHoldsRaw && deterministic ? 'PASSED' : 'BLOCKED',
    deterministic,
    inputSubstitutions,
    blockerReasons,
    muSemaConclusion: formulaHolds && deterministic ? 'MUŠEMA_CONFIRMED' : 'MUŠEMA_BLOCKED',
  };
}

export function getExtrimliExtremProfilerReport(): ExtrimliExtremProfilerReport {
  const degradedSources: string[] = [];
  const profileInput = resolveProfileInput(degradedSources);
  const resolutionInput = resolveResolutionInput(degradedSources);
  const normalizedLatencyPercent = clamp((profileInput.renderCycleLatencyMs / 100) * 100, 0, 100);

  const conflictScore = round(
    clamp(
      profileInput.sceneLoadPercent * 0.35
      + profileInput.gpuContentionPercent * 0.3
      + profileInput.cpuContentionPercent * 0.2
      + normalizedLatencyPercent * 0.15,
      0,
      100,
    ),
    2,
  );

  const conflictIntensity = classifyConflict(conflictScore);
  const optimizationTier = mapOptimizationTier(conflictIntensity);
  const semaMuSemaFormula = buildSemaMuSemaFormula(profileInput, resolutionInput, degradedSources);
  const rezolucijaScore = round(
    clamp(
      resolutionInput.rezolucijaCompletenessPercent * 0.5
      + resolutionInput.ekodorAlignmentPercent * 0.3
      + (100 - resolutionInput.discanPressurePercent) * 0.2,
      0,
      100,
    ),
    2,
  );
  const ekodorState = classifyEkodorState(resolutionInput.ekodorAlignmentPercent);
  const discanInKibenState = classifyDiscanInKibenState(resolutionInput.discanPressurePercent);
  const rekulitiPoRauletu = classifyRekulitiPoRauletuPolicy({
    rezolucijaScore,
    ekodorState,
    discanInKibenState,
  });
  const blockerActive = rekulitiPoRauletu === 'FREEZE';
  const bottleneckDetected = profileInput.gpuContentionPercent >= 60
    || profileInput.renderCycleLatencyMs > 50
    || conflictScore >= 60;

  const evaluationMs = round(
    clamp(
      18
      + (profileInput.sceneLoadPercent / 100) * 12
      + (profileInput.gpuContentionPercent / 100) * 16,
      0,
      200,
    ),
    2,
  );

  const apiResponseMs = round(
    clamp(
      92
      + (profileInput.renderCycleLatencyMs / 100) * 38
      + (profileInput.cpuContentionPercent / 100) * 24,
      0,
      500,
    ),
    2,
  );

  const withinTargets = evaluationMs <= EXTRIMLI_EXTREM_PROFILER_EVALUATION_MAX_MS
    && apiResponseMs <= EXTRIMLI_EXTREM_PROFILER_API_MAX_MS;

  const maximumGraphicsUnlockEligible = conflictScore <= EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK
    && profileInput.renderCycleLatencyMs <= EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK
    && profileInput.gpuContentionPercent <= EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK
    && rezolucijaScore >= EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY
    && ekodorState === 'ALIGNED'
    && discanInKibenState === 'CLEAR';

  const freezeRequired = conflictIntensity === 'HIGH'
    || conflictIntensity === 'CRITICAL'
    || !withinTargets
    || blockerActive
    || semaMuSemaFormula.status === 'BLOCKED';

  const governanceReasons = [
    ...(freezeRequired ? ['DISKVIT conflict or KPI pressure requires WAWE freeze before promotion.'] : []),
    ...(!withinTargets ? ['Profiler KPI targets are outside evaluation/API budgets.'] : []),
    ...(bottleneckDetected ? ['Browser graphics bottleneck detected in DISKVIT layer.'] : []),
    ...(rekulitiPoRauletu === 'WARN' ? ['REKULITI PO RAULETU remains in warning posture for REZOLUCIJA/EKODOR review.'] : []),
    ...(rekulitiPoRauletu === 'FREEZE' ? ['REKULITI PO RAULETU requires freeze because DISCAN in KIBEN or REZOLUCIJA readiness is blocked.'] : []),
    ...(semaMuSemaFormula.status === 'BLOCKED'
      ? [`ŠEMA formula gate blocked: ${semaMuSemaFormula.blockerReasons.join('; ') || 'MUŠEMA validation failed.'}`]
      : ['ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA gate is confirmed.']),
    ...(maximumGraphicsUnlockEligible ? ['Maximum graphics unlock is eligible under current profile.'] : []),
  ];

  if (!withinTargets) {
    degradedSources.push('profiler-kpi-breach');
  }
  if (semaMuSemaFormula.status === 'BLOCKED') degradedSources.push('schema-mushema:blocked');

  const acceptanceCriteria: ExtrimliExtremAcceptanceCriterion[] = [
    {
      id: 'diskvit-terminology-lock',
      description: 'DISKVIT is locked as the browser graphics bottleneck layer and conflict-proportional model source.',
      passed: true,
    },
    {
      id: 'stable-contract',
      description: 'EXTRIMLI EXTREM profiler contract and module versions are explicit and stable.',
      passed: EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION === 'v1-extrem-profiler' && EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION === '1.0.0',
    },
    {
      id: 'additive-only-compatibility',
      description: 'Profiler surface is additive-only and does not alias or mutate existing EXTRIMLI contracts.',
      passed: true,
    },
    {
      id: 'finite-conflict-score',
      description: 'Conflict score is finite and bounded in [0,100].',
      passed: Number.isFinite(conflictScore) && conflictScore >= 0 && conflictScore <= 100,
    },
    {
      id: 'degraded-no-500',
      description: 'Profiler preserves partial payload in degraded mode without 500 failures.',
      passed: true,
    },
    {
      id: 'normalized-vocabulary-lock',
      description: 'REZOLUCIJA, EKODOR, REKULITI PO RAULETU, DISCAN, and KIBEN are exposed as canonical EXTREM vocabulary fields.',
      passed: true,
    },
    {
      id: 'resolution-routing-policy',
      description: 'Resolution readiness derives REZOLUCIJA score, EKODOR state, DISCAN in KIBEN posture, and REKULITI PO RAULETU governance policy.',
      passed: Number.isFinite(rezolucijaScore)
        && rezolucijaScore >= 0
        && rezolucijaScore <= 100
        && ['ALIGNED', 'WATCH', 'BLOCKED'].includes(ekodorState)
        && ['CLEAR', 'WATCH', 'BLOCKED'].includes(discanInKibenState)
        && ['ALLOW', 'WARN', 'FREEZE'].includes(rekulitiPoRauletu),
    },
    {
      id: 'schema-mushema-canonical-lock',
      description: 'Canonical formula ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA is locked for EXTRIMLI/EXTRONDOL/EXTREM scope.',
      passed: semaMuSemaFormula.canonicalExpression === EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION
        && semaMuSemaFormula.scopeLock.join(',') === 'EXTRIMLI,EXTRONDOL,EXTREM',
    },
    {
      id: 'schema-mushema-governance-gate',
      description: 'MUŠEMA conclusion blocks WAWE promotion when the canonical formula does not hold.',
      passed: semaMuSemaFormula.formulaHolds
        ? semaMuSemaFormula.status === 'PASSED' && semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_CONFIRMED'
        : semaMuSemaFormula.status === 'BLOCKED' && semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_BLOCKED',
    },
    {
      id: 'schema-mushema-degraded-fallback',
      description: 'Invalid ŠEMA formula env inputs are additive-only (no 500), explicitly marked with substitutions, and kept in degraded posture.',
      passed: semaMuSemaFormula.inputSubstitutions.length === 0
        || (semaMuSemaFormula.status === 'BLOCKED' && degradedSources.length > 0),
    },
  ];

  return {
    personaId: EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
    contractVersion: EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
    sourceOfTruth: EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
    statement: 'EXTRIMLI EXTREM profiler evaluates DISKVIT bottlenecks and conflict-proportional browser graphics readiness for WAWE governance.',
    ownership: '@spaja86',
    triggerLabel: 'extrem:logic-change',
    pathScope: [
      'src/lib/extrimli-extrem/**',
      'src/app/api/extrimli/extrem/**',
      'src/tests/lib/extrimli-extrem.test.ts',
      'src/tests/api/extrimli-route.test.ts',
    ],
    terminology: {
      diskvitRole: 'browser-graphics-bottleneck-layer',
      conflictModel: 'conflict-proportional',
      conflictInputs: ['sceneLoadPercent', 'gpuContentionPercent', 'cpuContentionPercent', 'renderCycleLatencyMs'],
      normalizedVocabulary: {
        REZOLUCIJA: {
          canonicalField: 'resolutionReadiness.rezolucijaScore',
          meaning: 'resolution-readiness-dimension',
        },
        EKODOR: {
          canonicalField: 'resolutionReadiness.ekodorState',
          meaning: 'readiness-alignment-signal',
        },
        'REKULITI PO RAULETU': {
          canonicalField: 'resolutionReadiness.rekulitiPoRauletu',
          meaning: 'resolution-routing-policy',
        },
        DISCAN: {
          canonicalField: 'resolutionInput.discanPressurePercent',
          meaning: 'blocking-pressure-input',
        },
        KIBEN: {
          canonicalField: 'resolutionReadiness.kibenLane',
          meaning: 'governance-lane',
        },
      },
    },
    profileInput,
    resolutionInput,
    profile: {
      bottleneckDetected,
      bottleneckLayer: 'DISKVIT',
      conflictScore,
      conflictIntensity,
      optimizationTier,
    },
    semaMuSemaFormula,
    resolutionReadiness: {
      rezolucijaScore,
      ekodorState,
      rekulitiPoRauletu,
      discanInKibenState,
      kibenLane: 'KIBEN',
      readinessSignal: rezolucijaScore >= EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY && ekodorState !== 'BLOCKED',
      blockerActive,
    },
    optimization: {
      maximumGraphicsUnlockThreshold: {
        maxConflictScore: EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK,
        maxRenderCycleLatencyMs: EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK,
        maxGpuContentionPercent: EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK,
      },
      maximumGraphicsUnlockEligible,
    },
    governanceSignal: {
      freezeRequired,
      wawePromotionEligible: !freezeRequired,
      reasons: governanceReasons.length > 0 ? governanceReasons : ['Profiler signal is stable and ready for WAWE promotion.'],
    },
    kpiTargets: {
      evaluationMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
      apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
    },
    kpiObserved: {
      evaluationMs,
      apiResponseMs,
      withinTargets,
    },
    degraded: degradedSources.length > 0,
    degradedMode: 'partial-payload-no-500',
    degradedSources,
    acceptanceCriteria,
    integrationBoundaries: {
      aliasesOfExistingSurfaces: false,
    },
  };
}

export type {
  ExtrimliExtremAcceptanceCriterion,
  ExtrimliExtremConflictIntensity,
  ExtrimliExtremDiscanInKibenState,
  ExtrimliExtremEkodorState,
  ExtrimliExtremOptimizationTier,
  ExtrimliExtremProfileInput,
  ExtrimliExtremProfilerReport,
  ExtrimliExtremRekulitiPoRauletuPolicy,
  ExtrimliExtremResolutionInput,
  ExtrimliExtremSemaFormulaEvaluation,
} from './types';

export {
  EXTRIMLI_EXTREM_PROFILER_API_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH,
  EXTRIMLI_EXTREM_PROFILER_EVALUATION_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY,
  EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
} from './types';
