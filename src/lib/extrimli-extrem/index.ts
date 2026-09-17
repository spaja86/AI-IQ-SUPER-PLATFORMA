import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  round,
} from '../extrimli';
import { buildDokerKuratIzekDokarExtremTrack } from '../extrimli-doker-kurat-izek-dokar-track';
import {
  runDikPetlja,
  runDirektPetlja,
  runDokPetlja,
  runIndirektPetlja,
  runOkredPetlja,
  runSarPetlja,
} from '../petlje';
import { buildAIIQWorldBankLicencniRegistar } from '../aiiq-world-bank-licencni-registar';
import type {
  ExtrimliExtremAcceptanceCriterion,
  ExtrimliExtremBusinessLicensingSignals,
  ExtrimliExtremConflictIntensity,
  ExtrimliExtremDiscanInKibenState,
  ExtrimliExtremEkodorState,
  ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaProfileInput,
  ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal,
  ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus,
  ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaProfileInput,
  ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaSignal,
  ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaStatus,
  ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaProfileInput,
  ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaSignal,
  ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaStatus,
  ExtrimliExtremKraljevskiPravniTrack,
  ExtrimliExtremMobilnaLinijaDeviceType,
  ExtrimliExtremMobilnaLinijaInput,
  ExtrimliExtremMobilnaLinijaInstallationStatus,
  ExtrimliExtremMobilnaLinijaPackageTier,
  ExtrimliExtremEpicElikvadentEquivalent,
  ExtrimliExtremEpicElikvadentProfileInput,
  ExtrimliExtremEpicElikvadentSignal,
  ExtrimliExtremEpicElikvadentStatus,
  ExtrimliExtremPetljaSignalInput,
  ExtrimliExtremPetljaSignalName,
  ExtrimliExtremPetljaSignalResult,
  ExtrimliExtremPetljaSignalSection,
  ExtrimliExtremPetljaSignalStatus,
  ExtrimliExtremObjektnaProngilacijaDomainObject,
  ExtrimliExtremObjektnaProngilacijaProfileInput,
  ExtrimliExtremObjektnaProngilacijaSignal,
  ExtrimliExtremObjektnaProngilacijaStatus,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaProfileInput,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaSignal,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaStatus,
  ExtrimliExtremOptimizationTier,
  ExtrimliExtremProfileInput,
  ExtrimliExtremProfilerReport,
  ExtrimliExtremRekulitiPoRauletuPolicy,
  ExtrimliExtremResolutionInput,
  ExtrimliExtremSemaFormulaEvaluation,
  ExtrimliExtremSpajaKodEncapsulation,
  ExtrimliSpajaKodPublicStatus,
} from './types';
import {
  EXTRIMLI_EXTREM_PROFILER_API_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_PROFILER_EVALUATION_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  EXTRIMLI_EXTREM_PETLJE_READY_MIN_SCORE,
  EXTRIMLI_EXTREM_PETLJE_SIGNAL_TRIGGER_LABEL,
  EXTRIMLI_EXTREM_PETLJE_WATCH_MIN_SCORE,
  EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY,
  EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
} from './types';
import { buildSpajaproExtremTrack } from '../extrimli-spajapro-track';
import { getExtrimliVersionRoadmap } from '../extrimli-version-roadmap';

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

function parsePercentEnvWithInvalidFallback(
  name: string,
  fallback: number,
  invalidFallback: number,
  degradedSources: string[],
): number {
  const raw = process.env[name];
  if (typeof raw === 'undefined' || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    degradedSources.push(`invalid-env:${name}`);
    return invalidFallback;
  }
  if (parsed < 0 || parsed > 100) {
    degradedSources.push(`out-of-range:${name}`);
  }
  return round(clamp(parsed, 0, 100), 2);
}

function parsePercentEnvWithAliases(
  names: readonly string[],
  fallback: number,
  invalidFallback: number,
  degradedSources: string[],
): number {
  const selectedName = names.find((name) => {
    const raw = process.env[name];
    return typeof raw !== 'undefined' && raw.trim() !== '';
  });

  if (selectedName) {
    return parsePercentEnvWithInvalidFallback(selectedName, fallback, invalidFallback, degradedSources);
  }

  return fallback;
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

function parseIntegerEnv(name: string, fallback: number, min: number, max: number, degradedSources: string[]): number {
  const raw = process.env[name];
  if (typeof raw === 'undefined' || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    degradedSources.push(`invalid-env:${name}`);
    return fallback;
  }
  if (!Number.isInteger(parsed)) degradedSources.push(`non-integer:${name}`);
  if (parsed < min || parsed > max) degradedSources.push(`out-of-range:${name}`);
  return Math.trunc(clamp(parsed, min, max));
}

function parseBooleanEnv(name: string, fallback: boolean, degradedSources: string[]): boolean {
  const raw = process.env[name];
  if (typeof raw === 'undefined' || raw.trim() === '') return fallback;
  const normalized = raw.trim().toLowerCase();
  if (['1', 'true', 'yes'].includes(normalized)) return true;
  if (['0', 'false', 'no'].includes(normalized)) return false;
  degradedSources.push(`invalid-boolean:${name}`);
  return fallback;
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

function resolveObjektnaProngilacijaInput(
  degradedSources: string[],
): ExtrimliExtremObjektnaProngilacijaProfileInput {
  return {
    objectStateIntegrityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_OBJECT_STATE_INTEGRITY_PERCENT', 82, 0, degradedSources),
    methodBehaviorCohesionPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_METHOD_BEHAVIOR_COHESION_PERCENT', 80, 0, degradedSources),
    delegationCoveragePercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_DELEGATION_COVERAGE_PERCENT', 74, 0, degradedSources),
    compositionCoveragePercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_COMPOSITION_COVERAGE_PERCENT', 72, 0, degradedSources),
    instanceClarityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_INSTANCE_CLARITY_PERCENT', 78, 0, degradedSources),
  };
}

function resolveFunkcinalnoProgramiranjeEnergetskogMisaonogTokaInput(
  degradedSources: string[],
): ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaProfileInput {
  return {
    energeticFlowStabilityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_ENERGETIC_FLOW_STABILITY_PERCENT', 88, 0, degradedSources),
    functionalTransformationCohesionPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_FUNCTIONAL_TRANSFORMATION_COHESION_PERCENT', 84, 0, degradedSources),
    thoughtChainDeterminismPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_THOUGHT_CHAIN_DETERMINISM_PERCENT', 86, 0, degradedSources),
    conflictPressurePercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_FUNCTIONAL_CONFLICT_PRESSURE_PERCENT', 22, 100, degradedSources),
  };
}

function resolveFunkionalnoProgramiranjePravnogMisaonogTokaInput(
  degradedSources: string[],
): ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaProfileInput {
  return {
    legalThoughtFlowStabilityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_PRAVNI_MISAONI_TOK_STABILITY_PERCENT', 89, 0, degradedSources),
    functionalLegalTransformationCohesionPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_FUNKIONALNA_PRAVNA_TRANSFORMACIJA_COHESION_PERCENT', 86, 0, degradedSources),
    legalReasoningDeterminismPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_PRAVNO_ZAKLJUCIVANJE_DETERMINISM_PERCENT', 88, 0, degradedSources),
    evidentiaryCompletenessPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_EVIDENTIARY_COMPLETENESS_PERCENT', 92, 0, degradedSources),
    conflictEscalationPressurePercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_PRAVNI_CONFLICT_ESCALATION_PRESSURE_PERCENT', 18, 100, degradedSources),
  };
}

function resolveFunkcionalnoProgramiranjeUzvisenogMisanogTokaInput(
  degradedSources: string[],
): ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaProfileInput {
  return {
    elevatedThoughtFlowStabilityPercent: parsePercentEnvWithAliases(['EXTRIMLI_EXTREM_UZVISENI_MISANI_TOK_STABILITY_PERCENT'], 91, 0, degradedSources),
    functionalTransformationCohesionPercent: parsePercentEnvWithAliases(['EXTRIMLI_EXTREM_UZVISENA_FUNKCIONALNA_TRANSFORMACIJA_COHESION_PERCENT'], 87, 0, degradedSources),
    reasoningDeterminismPercent: parsePercentEnvWithAliases(['EXTRIMLI_EXTREM_UZVISENO_REZONOVANJE_DETERMINISM_PERCENT'], 88, 0, degradedSources),
    conflictDegradationPressurePercent: parsePercentEnvWithAliases(
      [
        'EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT',
        'EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT',
      ],
      16,
      100,
      degradedSources,
    ),
  };
}

function resolveEpicElikvadentInput(
  degradedSources: string[],
): ExtrimliExtremEpicElikvadentProfileInput {
  return {
    objectElevationIntegrityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_EPIC_OBJECT_ELEVATION_INTEGRITY_PERCENT', 84, 0, degradedSources),
    epicEquivalentCoveragePercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_EPIC_EQUIVALENT_COVERAGE_PERCENT', 81, 0, degradedSources),
    functionalEquivalenceCohesionPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_EPIC_FUNCTIONAL_EQUIVALENCE_COHESION_PERCENT', 79, 0, degradedSources),
    ascentDelegationPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_EPIC_ASCENT_DELEGATION_PERCENT', 76, 0, degradedSources),
    encapsulationGuardPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_EPIC_ENCAPSULATION_GUARD_PERCENT', 88, 0, degradedSources),
  };
}

function resolveObjektnoOrijentisanaReprodukcijaInput(
  degradedSources: string[],
): ExtrimliExtremObjektnoOrijentisanaReprodukcijaProfileInput {
  return {
    objectStateReproducibilityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_OBJECT_STATE_REPRODUCIBILITY_PERCENT', 86, 0, degradedSources),
    methodDeterminismPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_METHOD_DETERMINISM_PERCENT', 84, 0, degradedSources),
    instanceReplayConsistencyPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_INSTANCE_REPLAY_CONSISTENCY_PERCENT', 82, 0, degradedSources),
    delegationStabilityPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_DELEGATION_STABILITY_PERCENT', 80, 0, degradedSources),
    compositionSafetyPercent: parsePercentEnvWithInvalidFallback('EXTRIMLI_EXTREM_COMPOSITION_SAFETY_PERCENT', 85, 0, degradedSources),
  };
}

function classifyObjektnaProngilacijaStatus(score: number): ExtrimliExtremObjektnaProngilacijaStatus {
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
}

function classifyFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus(
  score: number,
): ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus {
  if (score >= EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
}

function classifyFunkionalnoProgramiranjePravnogMisaonogTokaStatus(
  score: number,
): ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaStatus {
  if (score >= EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
}

function classifyFunkcionalnoProgramiranjeUzvisenogMisanogTokaStatus(
  score: number,
): ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaStatus {
  if (score >= EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
}

function buildObjektnaProngilacijaSignal(
  profileInput: ExtrimliExtremObjektnaProngilacijaProfileInput,
  degraded: boolean,
): ExtrimliExtremObjektnaProngilacijaSignal {
  const score = round(
    clamp(
      (profileInput.objectStateIntegrityPercent * 0.28)
      + (profileInput.methodBehaviorCohesionPercent * 0.24)
      + (profileInput.delegationCoveragePercent * 0.16)
      + (profileInput.compositionCoveragePercent * 0.16)
      + (profileInput.instanceClarityPercent * 0.16),
      0,
      100,
    ),
    2,
  );
  const status = classifyObjektnaProngilacijaStatus(score);
  const watchReasons = [
    ...(profileInput.objectStateIntegrityPercent < 80 ? [`state-integrity-watch:${profileInput.objectStateIntegrityPercent}`] : []),
    ...(profileInput.methodBehaviorCohesionPercent < 78 ? [`method-cohesion-watch:${profileInput.methodBehaviorCohesionPercent}`] : []),
    ...(profileInput.delegationCoveragePercent < 70 ? [`delegation-coverage-watch:${profileInput.delegationCoveragePercent}`] : []),
    ...(profileInput.compositionCoveragePercent < 68 ? [`composition-coverage-watch:${profileInput.compositionCoveragePercent}`] : []),
    ...(profileInput.instanceClarityPercent < 72 ? [`instance-clarity-watch:${profileInput.instanceClarityPercent}`] : []),
  ];
  const blockerReasons = [
    ...(profileInput.objectStateIntegrityPercent < 55 ? [`state-integrity-blocked:${profileInput.objectStateIntegrityPercent}`] : []),
    ...(profileInput.methodBehaviorCohesionPercent < 50 ? [`method-cohesion-blocked:${profileInput.methodBehaviorCohesionPercent}`] : []),
    ...(profileInput.delegationCoveragePercent < 45 ? [`delegation-coverage-blocked:${profileInput.delegationCoveragePercent}`] : []),
    ...(profileInput.compositionCoveragePercent < 45 ? [`composition-coverage-blocked:${profileInput.compositionCoveragePercent}`] : []),
    ...(profileInput.instanceClarityPercent < 45 ? [`instance-clarity-blocked:${profileInput.instanceClarityPercent}`] : []),
  ];
  const resolvedWatchReasons = status === 'WATCH' && watchReasons.length === 0
    ? [`aggregate-watch-score:${score}`]
    : watchReasons;
  const resolvedBlockerReasons = status === 'BLOCKED' && blockerReasons.length === 0
    ? [`aggregate-blocked-score:${score}`]
    : blockerReasons;
  const domainObjects: readonly [
    ExtrimliExtremObjektnaProngilacijaDomainObject,
    ExtrimliExtremObjektnaProngilacijaDomainObject,
    ExtrimliExtremObjektnaProngilacijaDomainObject,
  ] = [
    {
      id: 'objekat-core',
      title: 'Objekat jezgro',
      role: 'objekat',
      responsibility: 'Čuva kanonsko stanje domena i ograničava pristup stanju kroz eksplicitne metode.',
      stateAttributes: ['status', 'readinessScore', 'degradedSources'],
      methods: ['validateStateIntegrity', 'publishReadiness', 'lockSourceOfTruth'],
      collaborationModel: 'enkapsulacija',
    },
    {
      id: 'instanca-flow',
      title: 'Instanca toka',
      role: 'instanca',
      responsibility: 'Predstavlja konkretan lifecycle prolaz kroz readiness, watch i blocked stanja.',
      stateAttributes: ['instanceId', 'stateAttributes', 'currentPosture'],
      methods: ['evaluateInstanceClarity', 'promoteState', 'degradeSafely'],
      collaborationModel: 'kompozicija',
    },
    {
      id: 'metoda-bridge',
      title: 'Metoda most',
      role: 'metoda',
      responsibility: 'Delegira ponašanje između objekta jezgra i governance potrošača bez izlaganja internih detalja.',
      stateAttributes: ['delegationCoverage', 'compositionCoverage'],
      methods: ['delegateBehavior', 'composeOutputs', 'exposeAuditSafeSignal'],
      collaborationModel: 'delegacija',
    },
  ];

  return {
    term: 'Objektno orijentisana prongilacija',
    contractVersion: EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
    additiveOnly: true,
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: 'extrem:logic-change',
    scopeLock: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
    meaningLock: {
      canonicalName: 'Objektno orijentisana prongilacija',
      statement: 'Objekat nosi stanje, metode nose ponašanje, a delegacija i kompozicija određuju audit-safe saradnju u EXTRIMLI governance toku.',
      existingContractBeforeThisChange: false,
    },
    ownershipModel: {
      extrem: 'technical-object-state-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    profileInput,
    domainModel: {
      objectRole: 'Objekat je nosilac stanja i source-of-truth pravila.',
      instanceRole: 'Instanca predstavlja konkretan prolaz kroz readiness lifecycle.',
      attributeRole: 'Atributi modeluju stanje koje metode čuvaju i transformišu.',
      methodRole: 'Metode realizuju ponašanje vezano za stanje objekta.',
      delegationRole: 'Delegacija usmerava specijalizovane odgovornosti bez rasipanja poslovnih pravila.',
      compositionRole: 'Kompozicija sklapa više manjih objekata u auditabilan signal.',
      domainObjects,
    },
    readiness: {
      score,
      status,
      readinessSignal: status === 'READY',
      degraded,
      watchReasons: resolvedWatchReasons,
      blockerReasons: resolvedBlockerReasons,
    },
  };
}

function buildFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal(
  profileInput: ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaProfileInput,
  degraded: boolean,
): ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal {
  const score = round(
    clamp(
      (profileInput.energeticFlowStabilityPercent * 0.32)
      + (profileInput.functionalTransformationCohesionPercent * 0.28)
      + (profileInput.thoughtChainDeterminismPercent * 0.24)
      + ((100 - profileInput.conflictPressurePercent) * 0.16),
      0,
      100,
    ),
    2,
  );
  const status = classifyFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus(score);
  const watchReasons = [
    ...(profileInput.energeticFlowStabilityPercent < 82 ? [`energetic-flow-watch:${profileInput.energeticFlowStabilityPercent}`] : []),
    ...(profileInput.functionalTransformationCohesionPercent < 78 ? [`functional-transformation-watch:${profileInput.functionalTransformationCohesionPercent}`] : []),
    ...(profileInput.thoughtChainDeterminismPercent < 80 ? [`thought-chain-watch:${profileInput.thoughtChainDeterminismPercent}`] : []),
    ...(profileInput.conflictPressurePercent > 35 ? [`conflict-pressure-watch:${profileInput.conflictPressurePercent}`] : []),
  ];
  const blockerReasons = [
    ...(profileInput.energeticFlowStabilityPercent < 58 ? [`energetic-flow-blocked:${profileInput.energeticFlowStabilityPercent}`] : []),
    ...(profileInput.functionalTransformationCohesionPercent < 55 ? [`functional-transformation-blocked:${profileInput.functionalTransformationCohesionPercent}`] : []),
    ...(profileInput.thoughtChainDeterminismPercent < 55 ? [`thought-chain-blocked:${profileInput.thoughtChainDeterminismPercent}`] : []),
    ...(profileInput.conflictPressurePercent > 65 ? [`conflict-pressure-blocked:${profileInput.conflictPressurePercent}`] : []),
  ];
  const resolvedWatchReasons = status === 'WATCH' && watchReasons.length === 0
    ? [`aggregate-watch-score:${score}`]
    : watchReasons;
  const resolvedBlockerReasons = status === 'BLOCKED' && blockerReasons.length === 0
    ? [`aggregate-blocked-score:${score}`]
    : blockerReasons;

  return {
    term: 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA',
    contractVersion: EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION,
    additiveOnly: true,
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: 'extrem:logic-change',
    scopeLock: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
    meaningLock: {
      canonicalName: 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA',
      statement: 'Additive EXTREM signal that profiles energetic flow stability, functional transformation cohesion, deterministic thought-chain behavior, and bounded conflict pressure for WAWE governance.',
      interpretationLayer: 'technical-signal',
      existingContractBeforeThisChange: false,
      aliasesOfExistingSurfaces: false,
    },
    ownershipModel: {
      extrem: 'technical-functional-energy-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    canonicalVocabulary: {
      energeticFlowStability: {
        canonicalField: 'profileInput.energeticFlowStabilityPercent',
        meaning: 'energetska-stabilnost-toka',
      },
      functionalTransformationCohesion: {
        canonicalField: 'profileInput.functionalTransformationCohesionPercent',
        meaning: 'kohezija-funkcionalnih-transformacija',
      },
      thoughtChainDeterminism: {
        canonicalField: 'profileInput.thoughtChainDeterminismPercent',
        meaning: 'deterministicki-misaoni-lanac',
      },
      conflictPressure: {
        canonicalField: 'profileInput.conflictPressurePercent',
        meaning: 'konfliktni-pritisak',
      },
      readinessStatus: {
        canonicalField: 'readiness.status',
        meaning: 'wawe-readiness-posture',
      },
    },
    profileInput,
    processingModel: {
      energeticFlowRole: 'Meri da li energetski misaoni tok ostaje stabilan i bounded pod opterećenjem.',
      transformationRole: 'Potvrđuje da funkcionalne transformacije ostaju kohezivne bez rasipanja odgovornosti.',
      determinismRole: 'Meri da isti misaoni ulaz zadržava isti transformacioni izlaz kroz tok.',
      conflictRole: 'Prati konfliktni pritisak i aktivira watch/block posture pre WAWE promocije.',
      publicBoundaryRole: 'Zadržava sirove funkcionalne detalje u EXTREM/EXTRONDOL sloju dok SPAJA KOD izlaže samo audit-safe status.',
    },
    readiness: {
      score,
      status,
      readyForWaweProgression: status === 'READY',
      degraded,
      watchReasons: resolvedWatchReasons,
      blockerReasons: resolvedBlockerReasons,
    },
  };
}

function buildFunkcionalnoProgramiranjeUzvisenogMisanogTokaSignal(
  profileInput: ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaProfileInput,
  degraded: boolean,
): ExtrimliExtremFunkcionalnoProgramiranjeUzvisenogMisanogTokaSignal {
  const score = round(
    clamp(
      (profileInput.elevatedThoughtFlowStabilityPercent * 0.34)
      + (profileInput.functionalTransformationCohesionPercent * 0.28)
      + (profileInput.reasoningDeterminismPercent * 0.24)
      + ((100 - profileInput.conflictDegradationPressurePercent) * 0.14),
      0,
      100,
    ),
    2,
  );
  const status = classifyFunkcionalnoProgramiranjeUzvisenogMisanogTokaStatus(score);
  const watchReasons = [
    ...(profileInput.elevatedThoughtFlowStabilityPercent < 84 ? [`elevated-thought-flow-watch:${profileInput.elevatedThoughtFlowStabilityPercent}`] : []),
    ...(profileInput.functionalTransformationCohesionPercent < 80 ? [`functional-transformation-watch:${profileInput.functionalTransformationCohesionPercent}`] : []),
    ...(profileInput.reasoningDeterminismPercent < 81 ? [`reasoning-determinism-watch:${profileInput.reasoningDeterminismPercent}`] : []),
    ...(profileInput.conflictDegradationPressurePercent > 32 ? [`conflict-degradation-watch:${profileInput.conflictDegradationPressurePercent}`] : []),
  ];
  const blockerReasons = [
    ...(profileInput.elevatedThoughtFlowStabilityPercent < 60 ? [`elevated-thought-flow-blocked:${profileInput.elevatedThoughtFlowStabilityPercent}`] : []),
    ...(profileInput.functionalTransformationCohesionPercent < 56 ? [`functional-transformation-blocked:${profileInput.functionalTransformationCohesionPercent}`] : []),
    ...(profileInput.reasoningDeterminismPercent < 58 ? [`reasoning-determinism-blocked:${profileInput.reasoningDeterminismPercent}`] : []),
    ...(profileInput.conflictDegradationPressurePercent > 62 ? [`conflict-degradation-blocked:${profileInput.conflictDegradationPressurePercent}`] : []),
  ];
  const resolvedWatchReasons = status === 'WATCH' && watchReasons.length === 0
    ? [`aggregate-watch-score:${score}`]
    : watchReasons;
  const resolvedBlockerReasons = status === 'BLOCKED' && blockerReasons.length === 0
    ? [`aggregate-blocked-score:${score}`]
    : blockerReasons;

  return {
    term: 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA',
    contractVersion: EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION,
    additiveOnly: true,
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: 'extrem:logic-change',
    scopeLock: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
    meaningLock: {
      canonicalName: 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA',
      spellingDecision: 'exact-user-term-locked',
      statement: 'Additive EXTREM signal that keeps the exact user-requested term locked while profiling elevated thought-flow stability, functional transformation cohesion, deterministic reasoning, and bounded conflict/degradation pressure.',
      interpretationLayer: 'technical-elevated-thought-signal',
      existingContractBeforeThisChange: false,
      aliasesOfExistingSurfaces: false,
    },
    ownershipModel: {
      extrem: 'technical-elevated-thought-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    canonicalVocabulary: {
      elevatedThoughtFlowStability: {
        canonicalField: 'profileInput.elevatedThoughtFlowStabilityPercent',
        meaning: 'stabilnost-uzvisenog-misanog-toka',
      },
      functionalTransformationCohesion: {
        canonicalField: 'profileInput.functionalTransformationCohesionPercent',
        meaning: 'kohezija-funkcionalnih-transformacija',
      },
      reasoningDeterminism: {
        canonicalField: 'profileInput.reasoningDeterminismPercent',
        meaning: 'deterministickost-rezonovanja',
      },
      conflictDegradationPressure: {
        canonicalField: 'profileInput.conflictDegradationPressurePercent',
        meaning: 'pritisak-konflikta-i-degradacije',
      },
      readinessStatus: {
        canonicalField: 'readiness.status',
        meaning: 'wawe-readiness-posture',
      },
    },
    profileInput,
    processingModel: {
      elevatedThoughtFlowRole: 'Meri da li uzvišeni misani tok ostaje stabilan i bounded pod kompleksnim transformacijama.',
      transformationRole: 'Potvrđuje da funkcionalne transformacije ostaju kohezivne i additive-only kroz isti signalni tok.',
      determinismRole: 'Meri da isti misaoni ulaz i ista funkcionalna pravila daju isti rezonovani izlaz.',
      conflictRole: 'Prati pritisak konflikta i degradacije i aktivira watch/block posture pre WAWE promocije.',
      publicBoundaryRole: 'Zadržava sirove signalne detalje u EXTREM/EXTRONDOL sloju dok SPAJA KOD izlaže samo audit-safe status.',
    },
    readiness: {
      score,
      status,
      readyForWaweProgression: status === 'READY',
      degraded,
      watchReasons: resolvedWatchReasons,
      blockerReasons: resolvedBlockerReasons,
    },
  };
}

function buildFunkionalnoProgramiranjePravnogMisaonogTokaSignal(
  profileInput: ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaProfileInput,
  degraded: boolean,
  legalTrack: ExtrimliExtremKraljevskiPravniTrack,
): ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaSignal {
  const score = round(
    clamp(
      (profileInput.legalThoughtFlowStabilityPercent * 0.24)
      + (profileInput.functionalLegalTransformationCohesionPercent * 0.22)
      + (profileInput.legalReasoningDeterminismPercent * 0.22)
      + (profileInput.evidentiaryCompletenessPercent * 0.2)
      + ((100 - profileInput.conflictEscalationPressurePercent) * 0.12),
      0,
      100,
    ),
    2,
  );
  const watchReasons = [
    ...(profileInput.legalThoughtFlowStabilityPercent < 84 ? [`legal-thought-flow-watch:${profileInput.legalThoughtFlowStabilityPercent}`] : []),
    ...(profileInput.functionalLegalTransformationCohesionPercent < 80 ? [`functional-legal-transformation-watch:${profileInput.functionalLegalTransformationCohesionPercent}`] : []),
    ...(profileInput.legalReasoningDeterminismPercent < 82 ? [`legal-reasoning-watch:${profileInput.legalReasoningDeterminismPercent}`] : []),
    ...(profileInput.evidentiaryCompletenessPercent < 88 ? [`evidentiary-completeness-watch:${profileInput.evidentiaryCompletenessPercent}`] : []),
    ...(profileInput.conflictEscalationPressurePercent > 28 ? [`conflict-escalation-watch:${profileInput.conflictEscalationPressurePercent}`] : []),
  ];
  const blockerReasons = [
    ...(profileInput.legalThoughtFlowStabilityPercent < 60 ? [`legal-thought-flow-blocked:${profileInput.legalThoughtFlowStabilityPercent}`] : []),
    ...(profileInput.functionalLegalTransformationCohesionPercent < 56 ? [`functional-legal-transformation-blocked:${profileInput.functionalLegalTransformationCohesionPercent}`] : []),
    ...(profileInput.legalReasoningDeterminismPercent < 58 ? [`legal-reasoning-blocked:${profileInput.legalReasoningDeterminismPercent}`] : []),
    ...(profileInput.evidentiaryCompletenessPercent < 62 ? [`evidentiary-completeness-blocked:${profileInput.evidentiaryCompletenessPercent}`] : []),
    ...(profileInput.conflictEscalationPressurePercent > 60 ? [`conflict-escalation-blocked:${profileInput.conflictEscalationPressurePercent}`] : []),
  ];
  const aggregateStatus = classifyFunkionalnoProgramiranjePravnogMisaonogTokaStatus(score);
  const status: ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaStatus = blockerReasons.length > 0
    ? 'BLOCKED'
    : watchReasons.length > 0
      ? 'WATCH'
      : aggregateStatus;
  const resolvedWatchReasons = status === 'WATCH' && watchReasons.length === 0
    ? [`aggregate-watch-score:${score}`]
    : watchReasons;
  const resolvedBlockerReasons = status === 'BLOCKED' && blockerReasons.length === 0
    ? [`aggregate-blocked-score:${score}`]
    : blockerReasons;

  return {
    term: 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA',
    contractVersion: EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION,
    additiveOnly: true,
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: 'extrem:logic-change',
    scopeLock: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
    meaningLock: {
      canonicalName: 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA',
      spellingDecision: 'exact-user-term-locked',
      statement: 'Additive EXTREM signal that keeps the user-requested FUNKIONALNO spelling locked while profiling legal thought-flow stability, functional legal transformations, deterministic legal reasoning, evidentiary completeness, and bounded conflict-escalation pressure.',
      interpretationLayer: 'technical-legal-reasoning-signal',
      existingContractBeforeThisChange: false,
      aliasesOfExistingSurfaces: false,
    },
    ownershipModel: {
      extrem: 'technical-legal-reasoning-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    canonicalVocabulary: {
      legalThoughtFlowStability: {
        canonicalField: 'profileInput.legalThoughtFlowStabilityPercent',
        meaning: 'stabilnost-pravnog-misaonog-toka',
      },
      functionalLegalTransformationCohesion: {
        canonicalField: 'profileInput.functionalLegalTransformationCohesionPercent',
        meaning: 'kohezija-funkcionalnih-pravnih-transformacija',
      },
      legalReasoningDeterminism: {
        canonicalField: 'profileInput.legalReasoningDeterminismPercent',
        meaning: 'deterministicko-pravno-zakljucivanje',
      },
      evidentiaryCompleteness: {
        canonicalField: 'profileInput.evidentiaryCompletenessPercent',
        meaning: 'evidentiary-completeness',
      },
      conflictEscalationPressure: {
        canonicalField: 'profileInput.conflictEscalationPressurePercent',
        meaning: 'konfliktno-eskalacioni-pritisak',
      },
      readinessStatus: {
        canonicalField: 'readiness.status',
        meaning: 'wawe-readiness-posture',
      },
    },
    legalCoupling: {
      sourceTrack: 'KRALJEVSKI PRAVNI UNIVERZITET',
      primaryCharter: 'POVELJA O ZAKONODAVNOM PRAVU',
      citizenshipOrder: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA',
      sourceMaterialPolicy: legalTrack.documentationBoundary.sourceMaterialPolicy,
      ownershipBoundary: 'NIKOLA SPAJIĆ',
      reviewRequirements: {
        humanReviewRequired: legalTrack.structuredSignals.reviewRequirements.humanReviewRequired,
        rollbackPlanRequired: legalTrack.structuredSignals.reviewRequirements.rollbackPlanRequired,
        downstreamReferenceRequired: legalTrack.structuredSignals.reviewRequirements.downstreamReferenceRequired,
        publicBoundaryRequired: legalTrack.structuredSignals.reviewRequirements.publicBoundaryRequired,
      },
    },
    profileInput,
    processingModel: {
      legalThoughtFlowRole: 'Meri da li pravni misaoni tok ostaje stabilan i bounded kroz charter i citizenship-order okvir.',
      transformationRole: 'Potvrđuje da funkcionalne pravne transformacije ostaju kohezivne bez razbijanja odgovornosti između policy i charter slojeva.',
      determinismRole: 'Meri da isti pravni ulaz i ista evidencija daju isti zaključak kroz funkcionalni tok.',
      evidenceRole: 'Vezuje funkcionalni pravni tok za dokumentovanu evidentiary completeness granicu unutar KRALJEVSKI PRAVNI UNIVERZITET track-a.',
      conflictRole: 'Prati konfliktno-eskalacioni pritisak i aktivira watch/block posture pre WAWE promocije.',
      publicBoundaryRole: 'Zadržava sirove pravne formulacije i scoring u EXTREM/EXTRONDOL sloju dok SPAJA KOD objavljuje samo audit-safe status.',
    },
    readiness: {
      score,
      status,
      readyForWaweProgression: status === 'READY',
      degraded,
      watchReasons: resolvedWatchReasons,
      blockerReasons: resolvedBlockerReasons,
    },
  };
}

function classifyEpicElikvadentStatus(score: number): ExtrimliExtremEpicElikvadentStatus {
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
}

function classifyObjektnoOrijentisanaReprodukcijaStatus(score: number): ExtrimliExtremObjektnoOrijentisanaReprodukcijaStatus {
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
}

function buildObjektnoOrijentisanaReprodukcijaSignal(
  profileInput: ExtrimliExtremObjektnoOrijentisanaReprodukcijaProfileInput,
  degraded: boolean,
): ExtrimliExtremObjektnoOrijentisanaReprodukcijaSignal {
  const score = round(
    clamp(
      (profileInput.objectStateReproducibilityPercent * 0.26)
      + (profileInput.methodDeterminismPercent * 0.24)
      + (profileInput.instanceReplayConsistencyPercent * 0.2)
      + (profileInput.delegationStabilityPercent * 0.14)
      + (profileInput.compositionSafetyPercent * 0.16),
      0,
      100,
    ),
    2,
  );
  const status = classifyObjektnoOrijentisanaReprodukcijaStatus(score);
  const watchReasons = [
    ...(profileInput.objectStateReproducibilityPercent < 82 ? [`state-reproducibility-watch:${profileInput.objectStateReproducibilityPercent}`] : []),
    ...(profileInput.methodDeterminismPercent < 80 ? [`method-determinism-watch:${profileInput.methodDeterminismPercent}`] : []),
    ...(profileInput.instanceReplayConsistencyPercent < 78 ? [`instance-replay-watch:${profileInput.instanceReplayConsistencyPercent}`] : []),
    ...(profileInput.delegationStabilityPercent < 72 ? [`delegation-stability-watch:${profileInput.delegationStabilityPercent}`] : []),
    ...(profileInput.compositionSafetyPercent < 80 ? [`composition-safety-watch:${profileInput.compositionSafetyPercent}`] : []),
  ];
  const blockerReasons = [
    ...(profileInput.objectStateReproducibilityPercent < 58 ? [`state-reproducibility-blocked:${profileInput.objectStateReproducibilityPercent}`] : []),
    ...(profileInput.methodDeterminismPercent < 55 ? [`method-determinism-blocked:${profileInput.methodDeterminismPercent}`] : []),
    ...(profileInput.instanceReplayConsistencyPercent < 50 ? [`instance-replay-blocked:${profileInput.instanceReplayConsistencyPercent}`] : []),
    ...(profileInput.delegationStabilityPercent < 48 ? [`delegation-stability-blocked:${profileInput.delegationStabilityPercent}`] : []),
    ...(profileInput.compositionSafetyPercent < 55 ? [`composition-safety-blocked:${profileInput.compositionSafetyPercent}`] : []),
  ];
  const resolvedWatchReasons = status === 'WATCH' && watchReasons.length == 0 ? [`aggregate-watch-score:${score}`] : watchReasons;
  const resolvedBlockerReasons = status === 'BLOCKED' && blockerReasons.length == 0 ? [`aggregate-blocked-score:${score}`] : blockerReasons;
  const checkpoints: readonly [
    ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
    ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
    ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
    ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
    ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
  ] = [
    { id: 'state-snapshot', label: 'State snapshot', responsibility: 'Zaključava audit-safe prikaz stanja pre i posle reprodukcije.', auditSafe: true },
    { id: 'method-replay', label: 'Method replay', responsibility: 'Potvrđuje da ista metoda nad istim ulazima daje isti izlaz.', auditSafe: true },
    { id: 'instance-replay', label: 'Instance replay', responsibility: 'Meri konzistentnost lifecycle prolaza kroz ponovljene evaluacije instance.', auditSafe: true },
    { id: 'delegation-trace', label: 'Delegation trace', responsibility: 'Proverava da delegirani koraci ostaju dosledni i auditabilni.', auditSafe: true },
    { id: 'composition-guard', label: 'Composition guard', responsibility: 'Osigurava da kompozicija zadržava bounded i bezbedan izlaz.', auditSafe: true },
  ];

  return {
    term: 'Objektno orijentisana reprodukcija',
    contractVersion: EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION,
    additiveOnly: true,
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: 'extrem:logic-change',
    scopeLock: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
    meaningLock: {
      canonicalName: 'Objektno orijentisana reprodukcija',
      statement: 'Additive EXTREM signal that verifies deterministic replay of object state, methods, instances, delegation, and composition without exposing raw internals.',
      existingContractBeforeThisChange: false,
    },
    ownershipModel: {
      extrem: 'technical-reproduction-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    profileInput,
    reproductionModel: {
      stateRole: 'Reproduktivno stanje čuva audit-safe snapshot objekta.',
      behaviorRole: 'Metodska determinističnost potvrđuje isto ponašanje nad istim ulazima.',
      replayRole: 'Replay konzistentnost instance drži lifecycle prolaz stabilnim kroz ponovljene evaluacije.',
      delegationRole: 'Delegaciona stabilnost sprečava rasipanje odgovornosti i nedeterminističke skokove.',
      compositionRole: 'Kompoziciona bezbednost čuva bounded izlaz složenih objekata.',
      checkpoints,
    },
    readiness: {
      score,
      status,
      readyForWaweProgression: status === 'READY',
      degraded,
      watchReasons: resolvedWatchReasons,
      blockerReasons: resolvedBlockerReasons,
    },
  };
}

function buildEpicElikvadentSignal(
  profileInput: ExtrimliExtremEpicElikvadentProfileInput,
  degraded: boolean,
): ExtrimliExtremEpicElikvadentSignal {
  const score = round(
    clamp(
      (profileInput.objectElevationIntegrityPercent * 0.26)
      + (profileInput.epicEquivalentCoveragePercent * 0.24)
      + (profileInput.functionalEquivalenceCohesionPercent * 0.2)
      + (profileInput.ascentDelegationPercent * 0.14)
      + (profileInput.encapsulationGuardPercent * 0.16),
      0,
      100,
    ),
    2,
  );
  const status = classifyEpicElikvadentStatus(score);
  const watchReasons = [
    ...(profileInput.objectElevationIntegrityPercent < 82 ? [`epic-object-elevation-watch:${profileInput.objectElevationIntegrityPercent}`] : []),
    ...(profileInput.epicEquivalentCoveragePercent < 78 ? [`epic-equivalent-coverage-watch:${profileInput.epicEquivalentCoveragePercent}`] : []),
    ...(profileInput.functionalEquivalenceCohesionPercent < 76 ? [`functional-equivalence-cohesion-watch:${profileInput.functionalEquivalenceCohesionPercent}`] : []),
    ...(profileInput.ascentDelegationPercent < 70 ? [`epic-ascent-delegation-watch:${profileInput.ascentDelegationPercent}`] : []),
    ...(profileInput.encapsulationGuardPercent < 80 ? [`epic-encapsulation-guard-watch:${profileInput.encapsulationGuardPercent}`] : []),
  ];
  const blockerReasons = [
    ...(profileInput.objectElevationIntegrityPercent < 55 ? [`epic-object-elevation-blocked:${profileInput.objectElevationIntegrityPercent}`] : []),
    ...(profileInput.epicEquivalentCoveragePercent < 50 ? [`epic-equivalent-coverage-blocked:${profileInput.epicEquivalentCoveragePercent}`] : []),
    ...(profileInput.functionalEquivalenceCohesionPercent < 48 ? [`functional-equivalence-cohesion-blocked:${profileInput.functionalEquivalenceCohesionPercent}`] : []),
    ...(profileInput.ascentDelegationPercent < 45 ? [`epic-ascent-delegation-blocked:${profileInput.ascentDelegationPercent}`] : []),
    ...(profileInput.encapsulationGuardPercent < 55 ? [`epic-encapsulation-guard-blocked:${profileInput.encapsulationGuardPercent}`] : []),
  ];
  const resolveEpicState = (value: number) => value >= 76 ? 'EPIC' as const : value >= 58 ? 'WATCH' as const : 'BLOCKED' as const;
  const entities: readonly [
    ExtrimliExtremEpicElikvadentEquivalent,
    ExtrimliExtremEpicElikvadentEquivalent,
    ExtrimliExtremEpicElikvadentEquivalent,
  ] = [
    {
      id: 'epic-objekat-core',
      label: 'Epic objekat jezgro',
      domain: 'MODULE',
      relationType: 'FULL',
      epicState: resolveEpicState(profileInput.objectElevationIntegrityPercent),
      equivalenceScore: round(clamp((profileInput.objectElevationIntegrityPercent + profileInput.encapsulationGuardPercent) / 2, 0, 100), 2),
      auditSafe: true,
      rationale: 'Canonical module equivalent keeps object-state uplift audit-safe and bounded.',
    },
    {
      id: 'epic-instanca-flow',
      label: 'Epic instanca tok',
      domain: 'KNOWLEDGE',
      relationType: 'FUNCTIONAL',
      epicState: resolveEpicState(profileInput.epicEquivalentCoveragePercent),
      equivalenceScore: round(clamp((profileInput.epicEquivalentCoveragePercent + profileInput.functionalEquivalenceCohesionPercent) / 2, 0, 100), 2),
      auditSafe: true,
      rationale: 'Functional equivalent tracks whether the uplift remains reusable across controlled epic knowledge flows.',
    },
    {
      id: 'epic-metoda-bridge',
      label: 'Epic metoda most',
      domain: 'PERSONA',
      relationType: 'SUBSTITUTABLE',
      epicState: resolveEpicState(profileInput.ascentDelegationPercent),
      equivalenceScore: round(clamp((profileInput.ascentDelegationPercent + profileInput.functionalEquivalenceCohesionPercent) / 2, 0, 100), 2),
      auditSafe: true,
      rationale: 'Substitutable persona-level bridge remains valid only when delegation and cohesion stay bounded.',
    },
  ];

  return {
    term: 'Objektno orijentusano uzdizanje epskih elikvadenata',
    contractVersion: EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
    additiveOnly: true,
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: 'extrem:logic-change',
    scopeLock: ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'],
    meaningLock: {
      canonicalName: 'Objektno orijentusano uzdizanje epskih elikvadenata',
      statement: 'Additive EXTREM signal that measures whether controlled epic equivalents can be elevated through object-state, cohesion, delegation, and encapsulation rules.',
      interpretationLayer: 'technical-signal',
      existingContractBeforeThisChange: false,
    },
    ownershipModel: {
      extrem: 'technical-epic-equivalent-signal',
      extrondol: 'wawe-orchestration-audit-consumer',
      spajaKod: 'public-encapsulated-boundary',
    },
    profileInput,
    controlledEquivalents: {
      sourceDomain: 'EKVIVALENT NETWORK',
      supportedDomains: ['MODULE', 'KNOWLEDGE', 'PERSONA'],
      epicRelationTypes: ['FULL', 'FUNCTIONAL', 'SUBSTITUTABLE'],
      watchRelationTypes: ['PARTIAL', 'CONTEXTUAL'],
      entities,
    },
    readiness: {
      score,
      status,
      readyForWaweProgression: status === 'READY',
      degraded,
      watchReasons: status === 'WATCH' && watchReasons.length === 0 ? [`aggregate-epic-watch-score:${score}`] : watchReasons,
      blockerReasons: status === 'BLOCKED' && blockerReasons.length === 0 ? [`aggregate-epic-blocked-score:${score}`] : blockerReasons,
    },
  };
}

function normalizeMobilnaDeviceType(value: string | undefined): ExtrimliExtremMobilnaLinijaDeviceType {
  const normalized = (value ?? '').trim().toUpperCase();
  if (normalized === 'ANDROID' || normalized === 'ANDROID_PHONE' || normalized === 'ANDROID-PHONE') return 'ANDROID';
  if (normalized === 'IOS' || normalized === 'IPHONE' || normalized === 'I-OS') return 'IOS';
  if (normalized === 'ROUTER_4G' || normalized === 'ROUTER-4G' || normalized === 'ROUTER 4G') return 'ROUTER_4G';
  if (normalized === 'ROUTER_5G' || normalized === 'ROUTER-5G' || normalized === 'ROUTER 5G') return 'ROUTER_5G';
  return 'UNKNOWN';
}

function resolveMobilnaLinijaInput(degradedSources: string[]): ExtrimliExtremMobilnaLinijaInput {
  const rawDeviceType = process.env.EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE;
  const deviceType = typeof rawDeviceType === 'undefined'
    ? 'ANDROID'
    : normalizeMobilnaDeviceType(rawDeviceType);
  const deviceModel = (process.env.EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL ?? 'SPAJA-MOB-DEFAULT').trim();
  const signalStrengthPercent = parsePercentEnv('EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT', 62, degradedSources);
  const osVersionMajor = parseIntegerEnv('EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR', 16, 0, 30, degradedSources);
  const supportsEsim = parseBooleanEnv('EXTRIMLI_EXTREM_MOBILNA_LINIJA_SUPPORTS_ESIM', true, degradedSources);

  if (typeof rawDeviceType !== 'undefined' && deviceType === 'UNKNOWN') {
    degradedSources.push('mobilna-linija:unsupported-device-type');
  }
  if (deviceModel.length === 0) degradedSources.push('mobilna-linija:missing-device-model');

  return {
    lineType: 'Mobilna linija',
    deviceType,
    deviceModel,
    supportsEsim,
    osVersionMajor,
    signalStrengthPercent,
  };
}

function buildMobilnaLinijaSection(
  input: ExtrimliExtremMobilnaLinijaInput,
  deviceTypeProvided: boolean,
): ExtrimliExtremProfilerReport['mobilnaLinija'] {
  const missingFields = [
    ...(input.deviceType === 'UNKNOWN' ? ['deviceType'] : []),
    ...(input.deviceModel.trim().length === 0 ? ['deviceModel'] : []),
    ...(!Number.isFinite(input.signalStrengthPercent) ? ['signalStrengthPercent'] : []),
    ...(!Number.isFinite(input.osVersionMajor) ? ['osVersionMajor'] : []),
  ];
  const compatibilityReasons = [
    ...(input.deviceType === 'UNKNOWN' ? ['Unsupported device type for Mobilna linija.'] : []),
    ...(input.deviceModel.trim().length === 0 ? ['Device model is required for installation messages.'] : []),
    ...(input.deviceType === 'ANDROID' && input.osVersionMajor < EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR
      ? [`Android version must be >= ${EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR}.`]
      : []),
    ...(input.deviceType === 'IOS' && input.osVersionMajor < EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR
      ? [`iOS version must be >= ${EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR}.`]
      : []),
  ];
  const compatible = compatibilityReasons.length === 0;
  const deviceStatus: ExtrimliExtremMobilnaLinijaInstallationStatus = compatible ? 'READY' : 'BLOCKED';
  const installationStatus: ExtrimliExtremMobilnaLinijaInstallationStatus = !compatible
    ? 'BLOCKED'
    : input.signalStrengthPercent < EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH
      ? 'BLOCKED'
    : input.signalStrengthPercent < EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY
      ? 'WATCH'
      : 'READY';
  const recommendedPlanTier: ExtrimliExtremMobilnaLinijaPackageTier = input.signalStrengthPercent >= 80
    ? 'PRO'
    : input.signalStrengthPercent >= EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY
      ? 'SMART'
      : input.signalStrengthPercent >= EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH
        ? 'BASIC'
        : 'NONE';

  const installationMessages = installationStatus === 'BLOCKED'
    ? [
      'Mobilna linija: instalacija je blokirana dok uređaj nije kompatibilan.',
      'Proverite tip uređaja, model i minimalnu verziju sistema.',
      'Nakon validacije uređaja ponovo pokrenite instalaciju poruka.',
    ]
    : installationStatus === 'WATCH'
      ? [
        'Mobilna linija: instalacija poruka je dostupna uz monitoring signala.',
        'Aktivirajte osnovni paket i pratite stabilnost mreže na uređaju.',
        'Po stabilizaciji signala izvršite potvrdu finalne konfiguracije.',
      ]
      : [
        'Mobilna linija: uređaj je kompatibilan i spreman za instalaciju poruka.',
        'Instalirajte profil linije i potvrdite mrežna podešavanja.',
        'Aktivirajte paketni plan i završite onboarding poruke.',
      ];

  return {
    contractVersion: EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
    input,
    deviceCompatibility: {
      deviceTypeProvided,
      compatible,
      status: deviceStatus,
      reasons: compatibilityReasons,
    },
    installationMessages: {
      required: true,
      status: installationStatus,
      messages: installationMessages,
      missingFields,
    },
    packagePlanHint: {
      recommendedPlanTier,
      readiness: installationStatus,
      reason: recommendedPlanTier === 'NONE'
        ? 'Signal strength is too low for any package recommendation.'
        : `Recommended package tier ${recommendedPlanTier} based on device compatibility and signal strength.`,
    },
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
  const invalidFormulaInputs = [
    ...(formulaDegradedSources.includes('invalid-env:EXTRIMLI_EXTREM_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_SHEMA_VALUE'] : []),
    ...(formulaDegradedSources.includes('invalid-env:EXTRIMLI_EXTREM_ALL_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_ALL_SHEMA_VALUE'] : []),
    ...(formulaDegradedSources.includes('invalid-env:EXTRIMLI_EXTREM_MUSHEMA_VALUE') ? ['EXTRIMLI_EXTREM_MUSHEMA_VALUE'] : []),
  ];
  const outOfRangeFormulaInputs = [
    ...(formulaDegradedSources.includes('out-of-range:EXTRIMLI_EXTREM_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_SHEMA_VALUE'] : []),
    ...(formulaDegradedSources.includes('out-of-range:EXTRIMLI_EXTREM_ALL_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_ALL_SHEMA_VALUE'] : []),
    ...(formulaDegradedSources.includes('out-of-range:EXTRIMLI_EXTREM_MUSHEMA_VALUE') ? ['EXTRIMLI_EXTREM_MUSHEMA_VALUE'] : []),
  ];
  const inputSubstitutions = [
    ...(hasFormulaMarker('EXTRIMLI_EXTREM_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_SHEMA_VALUE'] : []),
    ...(hasFormulaMarker('EXTRIMLI_EXTREM_ALL_SHEMA_VALUE') ? ['EXTRIMLI_EXTREM_ALL_SHEMA_VALUE'] : []),
    ...(hasFormulaMarker('EXTRIMLI_EXTREM_MUSHEMA_VALUE') ? ['EXTRIMLI_EXTREM_MUSHEMA_VALUE'] : []),
  ];
  const hasSubstitutions = inputSubstitutions.length > 0;
  const formulaHolds = Math.abs(computedMuSema - expectedMuSema) <= 0.01;
  const deterministic = Number.isFinite(sema)
    && Number.isFinite(allSema)
    && Number.isFinite(expectedMuSema)
    && Number.isFinite(computedMuSema)
    && !hasSubstitutions;
  const blockerReasons = [
    ...(!hasSubstitutions && !formulaHolds ? [`MUŠEMA mismatch: expected ${expectedMuSema}, computed ${computedMuSema}`] : []),
    ...(deterministic ? [] : ['ŠEMA formula inputs are not deterministic']),
    ...(invalidFormulaInputs.length > 0 ? [`Formula inputs used fallback for invalid env values: ${invalidFormulaInputs.join(', ')}`] : []),
    ...(outOfRangeFormulaInputs.length > 0 ? [`Formula inputs were clamped for out-of-range values: ${outOfRangeFormulaInputs.join(', ')}`] : []),
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
    status: !hasSubstitutions && formulaHolds && deterministic ? 'PASSED' : 'BLOCKED',
    deterministic,
    inputSubstitutions,
    blockerReasons,
    muSemaConclusion: formulaHolds && deterministic ? 'MUŠEMA_CONFIRMED' : 'MUŠEMA_BLOCKED',
  };
}

function buildSpajaKodEncapsulation(params: {
  freezeRequired: boolean;
  rekulitiPoRauletu: ExtrimliExtremRekulitiPoRauletuPolicy;
  blockerActive: boolean;
  withinTargets: boolean;
  semaMuSemaFormula: ExtrimliExtremSemaFormulaEvaluation;
}): ExtrimliExtremSpajaKodEncapsulation {
  const blockers = [
    ...(params.freezeRequired ? ['governance-freeze'] : []),
    ...(params.blockerActive ? ['resolution-blocker'] : []),
    ...(!params.withinTargets ? ['kpi-budget-breach'] : []),
    ...(params.semaMuSemaFormula.status === 'BLOCKED' ? ['audit-formula-blocked'] : []),
  ];
  const status: ExtrimliSpajaKodPublicStatus = params.freezeRequired
    ? 'BLOCKED'
    : params.rekulitiPoRauletu === 'WARN'
      ? 'WATCH'
      : 'READY';

  return {
    surfaceName: 'SPAJA KOD',
    contractVersion: 'v1-spaja-kod',
    representationMode: 'system-encapsulation',
    encapsulationStatus: 'ACTIVE',
    rawPatternVisibility: 'HIDDEN',
    exposurePolicy: {
      exposesRawPatternModel: false,
      exposesFormulaInternals: false,
      exposesInternalSignalInputs: false,
      exposesOnlySystemSignals: true,
    },
    publicInterpretation: params.freezeRequired
      ? 'SPAJA KOD keeps the internal EXTREM pattern encapsulated and exposes only the blockers required for audit and promotion control.'
      : params.rekulitiPoRauletu === 'WARN'
        ? 'SPAJA KOD keeps the internal EXTREM pattern hidden while surfacing a bounded watch posture for downstream review.'
        : 'SPAJA KOD keeps the internal EXTREM pattern hidden and exposes a stable readiness signal for downstream orchestration.',
    readiness: {
      status,
      governanceOutcome: params.rekulitiPoRauletu,
      blockerCount: blockers.length,
    },
    publicSignals: [
      'readiness-status',
      'governance-outcome',
      'promotion-freeze',
      'audit-blockers',
    ],
    blockers,
  };
}

const PETLJA_SIGNAL_CATEGORY_MAP = {
  RANGE: ['SAR PETLJA', 'OKRED PETLJA'],
  TARGET: ['DOK PETLJA', 'DIREKT PETLJA'],
  SEQUENCE: ['DIK PETLJA', 'INDIREKT PETLJA'],
} as const;

function parseSequenceFromEnv(
  envName: string,
  fallback: number[],
  degradedSources: string[],
): number[] {
  const rawValue = process.env[envName];
  if (typeof rawValue === 'undefined' || rawValue.trim().length === 0) {
    return fallback;
  }

  const values = rawValue
    .split(',')
    .map((part) => Number(part.trim()));
  const invalid = values.some((value) => !Number.isFinite(value));
  if (invalid) {
    degradedSources.push(`${envName.toLowerCase()}-invalid`);
    return fallback;
  }

  return values;
}

function classifyPetljaSignalStatus(readinessScore: number): ExtrimliExtremPetljaSignalStatus {
  if (readinessScore >= EXTRIMLI_EXTREM_PETLJE_READY_MIN_SCORE) {
    return 'READY';
  }

  if (readinessScore >= EXTRIMLI_EXTREM_PETLJE_WATCH_MIN_SCORE) {
    return 'WATCH';
  }

  return 'BLOCKED';
}

function toPetljaSignalIdentifier(kind: ExtrimliExtremPetljaSignalName): string {
  return kind.replace(' PETLJA', '').toLowerCase().replaceAll(' ', '_');
}

function buildPetljaSignalSection(degradedSources: string[]): ExtrimliExtremPetljaSignalSection {
  const sequenceOverride = parseSequenceFromEnv(
    'EXTRIMLI_EXTREM_PETLJE_INDIREKT_SEQUENCE',
    [2, 6, 8, 10],
    degradedSources,
  );

  const definitions: ExtrimliExtremPetljaSignalInput[] = [
    {
      kind: 'DOK PETLJA',
      category: 'TARGET',
      input: { start: 0, target: 12, step: 3, maxIterations: 8, maxDurationMs: 100, status: 'ACTIVATED' },
    },
    {
      kind: 'DIK PETLJA',
      category: 'SEQUENCE',
      input: { target: 9, sequence: [3, 7, 8, 9], maxIterations: 8, maxDurationMs: 100, status: 'ACTIVATED' },
    },
    {
      kind: 'SAR PETLJA',
      category: 'RANGE',
      input: { start: 1, end: 5, target: 4, step: 1, maxIterations: 8, maxDurationMs: 100, status: 'ACTIVATED' },
    },
    {
      kind: 'OKRED PETLJA',
      category: 'RANGE',
      input: { start: 2, end: 10, target: 7, step: 2, maxIterations: 8, maxDurationMs: 100, status: 'ACTIVATED' },
    },
    {
      kind: 'DIREKT PETLJA',
      category: 'TARGET',
      input: { start: 2, target: 11, step: 3, maxIterations: 8, maxDurationMs: 100, status: 'ACTIVATED' },
    },
    {
      kind: 'INDIREKT PETLJA',
      category: 'SEQUENCE',
      input: { start: 1, target: 10, sequence: sequenceOverride, maxIterations: 8, maxDurationMs: 100, status: 'ACTIVATED' },
    },
  ];

  const signalResults = [
    { definition: definitions[0], result: runDokPetlja(definitions[0].input) },
    { definition: definitions[1], result: runDikPetlja(definitions[1].input) },
    { definition: definitions[2], result: runSarPetlja(definitions[2].input) },
    { definition: definitions[3], result: runOkredPetlja(definitions[3].input) },
    { definition: definitions[4], result: runDirektPetlja(definitions[4].input) },
    { definition: definitions[5], result: runIndirektPetlja(definitions[5].input) },
  ].map<ExtrimliExtremPetljaSignalResult>(({ definition, result }) => {
    const warnings = [...result.warnings];
    const degraded = result.reason !== 'completed' || warnings.length > 0;
    const invalidInput = result.reason === 'invalid-input';
    const readinessScore = round(
      clamp(
        (invalidInput ? 0 : result.completed ? 82 : 28)
          + Math.max(0, 12 - result.iterations) * 1.5
          - warnings.length * 6
          - (result.reason === 'blocked-status' ? 35 : 0)
          - (invalidInput ? 24 : 0)
          - (result.reason === 'max-iterations' ? 22 : 0)
          - (result.reason === 'time-limit' ? 18 : 0),
        0,
        100,
      ),
      2,
    );
    const conflictScore = round(
      clamp(
        (invalidInput ? 88 : (100 - readinessScore) * 0.75)
          + warnings.length * 8
          + (result.reason === 'blocked-status' ? 22 : 0),
        0,
        100,
      ),
      2,
    );
    const status = classifyPetljaSignalStatus(readinessScore);

    return {
      kind: definition.kind,
      category: definition.category,
      runner: 'canonical-petlja',
      preservedStandaloneDirektModule: true,
      input: definition.input,
      petljaStatus: result.status,
      reason: result.reason,
      output: result.output,
      iterations: result.iterations,
      completed: result.completed,
      readinessScore,
      conflictScore,
      status,
      degraded,
      warnings,
    };
  });

  const blockedSignals = signalResults.filter((signal) => signal.status === 'BLOCKED').map((signal) => signal.kind);
  const watchSignals = signalResults.filter((signal) => signal.status === 'WATCH').map((signal) => signal.kind);
  const degradedSignals = signalResults.filter((signal) => signal.degraded).map((signal) => signal.kind);

  for (const signal of degradedSignals) {
    const degradedSource = `extrimli_extrem_petlje_${toPetljaSignalIdentifier(signal)}-degraded`;
    if (!degradedSources.includes(degradedSource)) {
      degradedSources.push(degradedSource);
    }
  }

  return {
    term: 'EXTRIMLI EXTRONDOL EXTREM PETLJE',
    sourceOfTruth: '/api/extrimli/extrem',
    triggerLabel: EXTRIMLI_EXTREM_PETLJE_SIGNAL_TRIGGER_LABEL,
    additiveOnly: true,
    ownershipModel: {
      extrem: 'technical-petlja-signal-layer',
      extrondol: 'wawe-orchestration-audit-consumer',
      direktModule: 'standalone-direct-communication-module-preserved',
    },
    contractBoundary: {
      existingSourceOfTruthRoutes: ['/api/extrimli/extrem', '/api/extrimli/extrondol'],
      standaloneDirektModulePreserved: true,
      direktPetljaMode: 'separate-loop-contract',
      indirektPetljaMode: 'separate-loop-contract',
    },
    categoryMap: PETLJA_SIGNAL_CATEGORY_MAP,
    signals: signalResults,
    summary: {
      readinessScore: round(
        clamp(signalResults.reduce((sum, signal) => sum + signal.readinessScore, 0) / signalResults.length, 0, 100),
        2,
      ),
      conflictScore: round(
        clamp(signalResults.reduce((sum, signal) => sum + signal.conflictScore, 0) / signalResults.length, 0, 100),
        2,
      ),
      freezeRequired: blockedSignals.length > 0,
      blockedSignals,
      watchSignals,
      degradedSignals,
    },
  };
}

function buildBusinessLicensingSignals(): ExtrimliExtremBusinessLicensingSignals {
  const registar = buildAIIQWorldBankLicencniRegistar();
  const activityCoverageScore = round(
    clamp(
      registar.coveragePoDelatnosti.length === 0
        ? 0
        : registar.coveragePoDelatnosti.reduce((sum, item) => sum + item.procenat, 0) / registar.coveragePoDelatnosti.length,
      0,
      100,
    ),
    2,
  );
  const globalLicenseReadinessScore = round(clamp(registar.globalniCoverage.coverageProcenat, 0, 100), 2);
  const criticalGlobalGapCount = registar.globalniCoverage.kriticniGlobalniGapovi;
  const freezeReasons = [
    ...(activityCoverageScore < 55 ? [`activity-coverage-low:${activityCoverageScore}`] : []),
    ...(globalLicenseReadinessScore < 65 ? [`global-license-readiness-low:${globalLicenseReadinessScore}`] : []),
    ...(criticalGlobalGapCount > 0 ? [`critical-global-gaps:${criticalGlobalGapCount}`] : []),
  ];
  return {
    sourceOfTruth: '/api/aiiq-world-bank-licencni-registar',
    activityCoverageScore,
    globalLicenseReadinessScore,
    criticalGlobalGapCount,
    freezeRequired: freezeReasons.length > 0,
    freezeReasons,
  };
}

function buildKraljevskiPravniUniverzitetTrack(): ExtrimliExtremKraljevskiPravniTrack {
  const vocabulary: ExtrimliExtremKraljevskiPravniTrack['vocabulary'] = [
    {
      term: 'KRALJEVSKI PRAVNI UNIVERZITET',
      meaning: 'Canonical legal-authority surface that defines vocabulary, scope boundaries, and legislative legitimacy for the track.',
      scope: 'Terminology, authority definition, charter hierarchy, and legal interpretation within the additive EXTRIMLI governance track.',
      owner: 'NIKOLA SPAJIĆ',
      allowedRelationships: [
        { to: 'KRALJEVSKA POLITIKA', relation: 'governs-policy' },
        { to: 'POVELJA O ZAKONODAVNOM PRAVU', relation: 'anchored-to-charter' },
        { to: 'ZAKON SILNOG', relation: 'permits-reviewed-enforcement' },
      ],
    },
    {
      term: 'KRALJEVSKA POLITIKA',
      meaning: 'Policy bridge that translates legal authority into bounded governance decisions and public ordering rules.',
      scope: 'Governance interpretation, public policy posture, and civic-boundary application inside EXTRONDOL orchestration.',
      owner: 'KRALJEVSKI PRAVNI UNIVERZITET',
      allowedRelationships: [
        { to: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA', relation: 'constrains-citizenship-order' },
        { to: 'ZAKON SILNOG', relation: 'permits-reviewed-enforcement' },
      ],
    },
    {
      term: 'NIKOLA SPAJIĆ',
      meaning: 'Named custodian for authorship, stewardship, and review accountability across the track.',
      scope: 'Ownership, review responsibility, and declared track custody.',
      owner: '@spaja86',
      allowedRelationships: [
        { to: 'KRALJEVSKI PRAVNI UNIVERZITET', relation: 'defines-authority' },
        { to: 'POVELJA O ZAKONODAVNOM PRAVU', relation: 'names-custodian' },
      ],
    },
    {
      term: 'ZAKON SILNOG',
      meaning: 'Bounded enforcement doctrine that may operate only through explicit charter, evidence, and review controls.',
      scope: 'Escalation limits, enforcement constraints, and blocker conditions.',
      owner: 'KRALJEVSKI PRAVNI UNIVERZITET',
      allowedRelationships: [
        { to: 'POVELJA O ZAKONODAVNOM PRAVU', relation: 'codifies-legislative-right' },
        { to: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA', relation: 'constrains-citizenship-order' },
      ],
    },
    {
      term: 'POVELJA O ZAKONODAVNOM PRAVU',
      meaning: 'Primary legislative charter that defines proposal, review, ratification, publication, and amendment rights.',
      scope: 'Legislative process, authority channel, ratification gates, publication, and amendment control.',
      owner: 'KRALJEVSKI PRAVNI UNIVERZITET',
      allowedRelationships: [
        { to: 'NIKOLA SPAJIĆ', relation: 'names-custodian' },
        { to: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA', relation: 'constrains-citizenship-order' },
      ],
    },
    {
      term: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA',
      meaning: 'Neutral civic-order rule set that separates lawful participation from unacceptable or blocked conduct against the declared framework.',
      scope: 'Citizenship rights, civic conduct, unacceptable maneuvering, and escalation boundaries.',
      owner: 'KRALJEVSKA POLITIKA',
      allowedRelationships: [
        { to: 'KRALJEVSKA POLITIKA', relation: 'reviewed-under-policy' },
        { to: 'ZAKON SILNOG', relation: 'permits-reviewed-enforcement' },
      ],
    },
  ];

  const warningTriggers = [
    'Ambiguous authorship or custody for a proposed legal act.',
    'Missing publication trail for a charter interpretation or civic-order update.',
    'Policy wording that expands authority beyond the declared charter without explicit review evidence.',
  ] as const;
  const blockTriggers = [
    'Any attempt to bypass Povelja o zakonodavnom pravu for legislative authority claims.',
    'Calls for enforcement against citizenship order without documented evidence and review.',
    'Any civic maneuver explicitly aimed at destabilizing the declared kingdom framework outside lawful review channels.',
  ] as const;
  const evidenceRequiredBeforeEscalation = [
    'Published charter reference naming the applicable legislative clause.',
    'Review record tying the interpretation to KRALJEVSKI PRAVNI UNIVERZITET ownership.',
    'Audit-safe evidence describing the civic-order breach and the proportional response.',
  ] as const;
  const unlawfulParticipation = [
    'Fabricating authority, charter text, or review outcomes.',
    'Using coercive or extra-charter pressure to override lawful civic participation.',
    'Suppressing publication, appeal, or review rights guaranteed by the declared order.',
  ] as const;

  return {
    trackId: 'extrimli-kraljevski-pravni-univerzitet',
    contractVersion: 'v1-kraljevski-pravni-univerzitet',
    additiveOnly: true,
    classification: 'legal-governance-track',
    technicalSourceOfTruth: '/api/extrimli/extrem',
    governanceSourceOfTruth: '/api/extrimli/extrondol',
    publicBoundary: '/api/extrimli/spaja-kod',
    vocabulary,
    documentationBoundary: {
      sourceMaterialPolicy: 'documentation-only',
      sourceReferences: [
        {
          label: 'docs/EXTRIMLI.md#kraljevski-pravni-univerzitet',
          usage: 'repo-doc-reference',
        },
      ],
      completedTopics: [
        'KRALJEVSKI PRAVNI UNIVERZITET',
        'KRALJEVSKA POLITIKA',
        'NIKOLA SPAJIĆ',
        'ZAKON SILNOG',
        'PRAVNI POREDAK PO PRAVU GRAĐANSTVA',
      ],
      primaryContentGap: {
        topic: 'POVELJA O ZAKONODAVNOM PRAVU',
        status: 'COMPLETED',
        summary: 'The charter now defines proposal, review, ratification, publication, amendment, and evidence gates for legislative authority.',
      },
    },
    structuredSignals: {
      charterCompleteness: {
        requiredSections: ['authority', 'ratification', 'publication', 'review', 'citizenship-boundary', 'enforcement-limit'],
        completedSections: ['authority', 'ratification', 'publication', 'review', 'citizenship-boundary', 'enforcement-limit'],
        completenessScore: 100,
        status: 'READY',
      },
      legislativeAuthorityDefinition: {
        authorityHolder: 'KRALJEVSKI PRAVNI UNIVERZITET',
        policyBridge: 'KRALJEVSKA POLITIKA',
        namedCustodian: 'NIKOLA SPAJIĆ',
        legislativeCharter: 'POVELJA O ZAKONODAVNOM PRAVU',
        enforcementDoctrine: 'ZAKON SILNOG',
        status: 'READY',
      },
      citizenshipOrderPrinciples: {
        canonicalOrder: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA',
        principles: [
          'Citizenship order protects publication, review, proportionality, and lawful appeal.',
          'Legislative authority must remain traceable to the charter and named custody.',
          'Enforcement may never outrun the documented charter scope or review outcome.',
        ],
        lawfulParticipation: [
          'Submit proposals through the declared charter path.',
          'Request review, clarification, or amendment through documented channels.',
          'Challenge interpretations with evidence while preserving publication and appeal rights.',
        ],
        unlawfulParticipation,
        status: 'READY',
      },
      conflictEscalation: {
        warningTriggers,
        blockTriggers,
        evidenceRequiredBeforeEscalation,
        activeWarnings: [],
        activeBlocks: [],
        status: 'READY',
      },
      reviewRequirements: {
        humanReviewRequired: true,
        rollbackPlanRequired: true,
        downstreamReferenceRequired: true,
        publicBoundaryRequired: true,
        status: 'READY',
      },
      blockedActionsAgainstDeclaredOrder: {
        actions: [
          'Publishing extra-charter legal commands as if they were ratified law.',
          'Escalating to enforcement without review evidence and a documented civic-order breach.',
          'Framing citizens as unlawful solely for requesting review, appeal, or publication traceability.',
        ],
        enforcementMode: 'neutral-governance-boundary',
        status: 'READY',
      },
    },
    neutralRuleSet: {
      unacceptableConduct: [
        'Concealing authority, authorship, or ratification status for a claimed legal act.',
        'Removing lawful appeal, publication, or review rights from citizenship-order decisions.',
        'Using the declared kingdom framework to justify undocumented coercion or civic exclusion.',
      ],
      warningTriggers: [...warningTriggers],
      blockTriggers: [...blockTriggers],
      evidenceRequiredBeforeEscalation: [...evidenceRequiredBeforeEscalation],
      lawfulCivicManeuvers: [
        'Petitioning for clarification, amendment, or review under the charter.',
        'Documenting conflicts and requesting proportional governance intervention.',
        'Participating in civic-order debate without denying the declared review boundary.',
      ],
      unlawfulCivicManeuvers: [...unlawfulParticipation],
    },
    readiness: {
      completenessScore: 100,
      consistencyScore: 100,
      conflictScore: 8,
      status: 'READY',
      watchReasons: [],
      blockerReasons: [],
    },
  };
}

export function getExtrimliExtremProfilerReport(): ExtrimliExtremProfilerReport {
  const versionRoadmap = getExtrimliVersionRoadmap();
  const degradedSources: string[] = [];
  const profileInput = resolveProfileInput(degradedSources);
  const resolutionInput = resolveResolutionInput(degradedSources);
  const objektnaProngilacijaDegradedSources: string[] = [];
  const objektnaProngilacijaInput = resolveObjektnaProngilacijaInput(objektnaProngilacijaDegradedSources);
  degradedSources.push(...objektnaProngilacijaDegradedSources);
  const funkcinalnoProgramiranjeDegradedSources: string[] = [];
  const funkcinalnoProgramiranjeInput = resolveFunkcinalnoProgramiranjeEnergetskogMisaonogTokaInput(funkcinalnoProgramiranjeDegradedSources);
  degradedSources.push(...funkcinalnoProgramiranjeDegradedSources);
  const funkcionalnoProgramiranjeUzvisenogMisanogTokaDegradedSources: string[] = [];
  const funkcionalnoProgramiranjeUzvisenogMisanogTokaInput = resolveFunkcionalnoProgramiranjeUzvisenogMisanogTokaInput(funkcionalnoProgramiranjeUzvisenogMisanogTokaDegradedSources);
  degradedSources.push(...funkcionalnoProgramiranjeUzvisenogMisanogTokaDegradedSources);
  const funkionalnoProgramiranjePravnogMisaonogTokaDegradedSources: string[] = [];
  const funkionalnoProgramiranjePravnogMisaonogTokaInput = resolveFunkionalnoProgramiranjePravnogMisaonogTokaInput(funkionalnoProgramiranjePravnogMisaonogTokaDegradedSources);
  degradedSources.push(...funkionalnoProgramiranjePravnogMisaonogTokaDegradedSources);
  const epicElikvadentDegradedSources: string[] = [];
  const epicElikvadentInput = resolveEpicElikvadentInput(epicElikvadentDegradedSources);
  degradedSources.push(...epicElikvadentDegradedSources);
  const objektnoOrijentisanaReprodukcijaDegradedSources: string[] = [];
  const objektnoOrijentisanaReprodukcijaInput = resolveObjektnoOrijentisanaReprodukcijaInput(objektnoOrijentisanaReprodukcijaDegradedSources);
  degradedSources.push(...objektnoOrijentisanaReprodukcijaDegradedSources);
  const mobilnaLinijaInput = resolveMobilnaLinijaInput(degradedSources);
  const mobilnaLinija = buildMobilnaLinijaSection(
    mobilnaLinijaInput,
    typeof process.env.EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE !== 'undefined'
      && process.env.EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE.trim().length > 0,
  );
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
  const businessLicensingSignals = buildBusinessLicensingSignals();
  const kraljevskiPravniUniverzitetTrack = buildKraljevskiPravniUniverzitetTrack();
  const petljeSignals = buildPetljaSignalSection(degradedSources);
  const objektnoOrijentisanaProngilacija = buildObjektnaProngilacijaSignal(
    objektnaProngilacijaInput,
    objektnaProngilacijaDegradedSources.length > 0,
  );
  const funkcinalnoProgramiranjeEnergetskogMisaonogToka = buildFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal(
    funkcinalnoProgramiranjeInput,
    funkcinalnoProgramiranjeDegradedSources.length > 0,
  );
  const funkcionalnoProgramiranjeUzvisenogMisanogToka = buildFunkcionalnoProgramiranjeUzvisenogMisanogTokaSignal(
    funkcionalnoProgramiranjeUzvisenogMisanogTokaInput,
    funkcionalnoProgramiranjeUzvisenogMisanogTokaDegradedSources.length > 0,
  );
  const funkionalnoProgramiranjePravnogMisaonogToka = buildFunkionalnoProgramiranjePravnogMisaonogTokaSignal(
    funkionalnoProgramiranjePravnogMisaonogTokaInput,
    funkionalnoProgramiranjePravnogMisaonogTokaDegradedSources.length > 0,
    kraljevskiPravniUniverzitetTrack,
  );
  const objektnoOrijentusanoUzdizanjeEpskihElikvadenata = buildEpicElikvadentSignal(
    epicElikvadentInput,
    epicElikvadentDegradedSources.length > 0,
  );
  const objektnoOrijentisanaReprodukcija = buildObjektnoOrijentisanaReprodukcijaSignal(
    objektnoOrijentisanaReprodukcijaInput,
    objektnoOrijentisanaReprodukcijaDegradedSources.length > 0,
  );
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
    || petljeSignals.summary.freezeRequired
    || businessLicensingSignals.freezeRequired
    || kraljevskiPravniUniverzitetTrack.readiness.status === 'BLOCKED'
    || funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status === 'BLOCKED'
    || objektnoOrijentisanaReprodukcija.readiness.status === 'BLOCKED'
    || objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status === 'BLOCKED'
    || semaMuSemaFormula.status === 'BLOCKED'
    || mobilnaLinija.installationMessages.status === 'BLOCKED'
    || mobilnaLinija.packagePlanHint.readiness === 'BLOCKED';
  const kraljevskiPravniUniverzitetBlockedMessage = kraljevskiPravniUniverzitetTrack.readiness.status !== 'BLOCKED'
    ? null
    : (() => {
      const blockerSummary = kraljevskiPravniUniverzitetTrack.readiness.blockerReasons.join('; ');
      return blockerSummary.length > 0
        ? `KRALJEVSKI PRAVNI UNIVERZITET track blocked WAWE progression: ${blockerSummary}`
        : 'KRALJEVSKI PRAVNI UNIVERZITET track blocked WAWE progression because legal-governance readiness failed.';
    })();

  const governanceReasons = [
    ...(freezeRequired ? ['DISKVIT conflict or KPI pressure requires WAWE freeze before promotion.'] : []),
    ...(!withinTargets ? ['Profiler KPI targets are outside evaluation/API budgets.'] : []),
    ...(bottleneckDetected ? ['Browser graphics bottleneck detected in DISKVIT layer.'] : []),
    ...(rekulitiPoRauletu === 'WARN' ? ['REKULITI PO RAULETU remains in warning posture for REZOLUCIJA/EKODOR review.'] : []),
    ...(rekulitiPoRauletu === 'FREEZE' ? ['REKULITI PO RAULETU requires freeze because DISCAN in KIBEN or REZOLUCIJA readiness is blocked.'] : []),
    ...(petljeSignals.summary.freezeRequired
      ? [`EXTREM PETLJE blocked WAWE progression: ${petljeSignals.summary.blockedSignals.join(', ')}`]
      : ['EXTREM PETLJE signals are additive and technically bounded at the EXTREM layer.']),
    ...(petljeSignals.summary.watchSignals.length > 0
      ? [`EXTREM PETLJE watch signals remain under review: ${petljeSignals.summary.watchSignals.join(', ')}`]
      : []),
    ...(businessLicensingSignals.freezeRequired
      ? [`Global licensing readiness gate triggered: ${businessLicensingSignals.freezeReasons.join(', ')}`]
      : ['Global licensing readiness is aligned for EXTREM governance.']),
    ...(kraljevskiPravniUniverzitetTrack.readiness.status === 'WATCH'
      ? ['KRALJEVSKI PRAVNI UNIVERZITET track remains in WATCH posture and requires legal-governance review before broader promotion.']
      : []),
    ...(kraljevskiPravniUniverzitetBlockedMessage ? [kraljevskiPravniUniverzitetBlockedMessage] : []),
    ...(funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status === 'WATCH'
      ? ['FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA requires review before wider WAWE progression.']
      : []),
    ...(funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status === 'BLOCKED'
      ? [`FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA blocked WAWE progression: ${funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.blockerReasons.join('; ') || 'functional energy readiness failed.'}`]
      : []),
    ...(objektnoOrijentisanaReprodukcija.readiness.status === 'WATCH'
      ? ['Objektno orijentisana reprodukcija requires review before wider WAWE progression.']
      : []),
    ...(objektnoOrijentisanaReprodukcija.readiness.status === 'BLOCKED'
      ? [`Objektno orijentisana reprodukcija blocked WAWE progression: ${objektnoOrijentisanaReprodukcija.readiness.blockerReasons.join('; ') || 'reproduction readiness failed.'}`]
      : []),
    ...(objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status === 'WATCH'
      ? ['Objektno orijentusano uzdizanje epskih elikvadenata requires bounded review before wider WAWE progression.']
      : []),
    ...(objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status === 'BLOCKED'
      ? [`Objektno orijentusano uzdizanje epskih elikvadenata blocked WAWE progression: ${objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.blockerReasons.join('; ') || 'epic elikvadent readiness failed.'}`]
      : []),
    ...(semaMuSemaFormula.status === 'BLOCKED'
      ? [`ŠEMA formula gate blocked: ${semaMuSemaFormula.blockerReasons.join('; ') || 'MUŠEMA validation failed.'}`]
      : ['ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA gate is confirmed.']),
    ...(mobilnaLinija.installationMessages.status === 'BLOCKED'
      ? ['Mobilna linija installation messages are blocked due to device compatibility or missing fields.']
      : []),
    ...(mobilnaLinija.packagePlanHint.readiness === 'BLOCKED'
      ? ['Mobilna linija package hint is blocked because no valid package tier can be recommended.']
      : []),
    ...(maximumGraphicsUnlockEligible ? ['Maximum graphics unlock is eligible under current profile.'] : []),
  ];

  if (!withinTargets) {
    degradedSources.push('profiler-kpi-breach');
  }
  if (petljeSignals.summary.freezeRequired) degradedSources.push('petlje-signals:freeze-required');
  if (businessLicensingSignals.freezeRequired) degradedSources.push('global-licensing:freeze-required');
  if (kraljevskiPravniUniverzitetTrack.readiness.status !== 'READY') {
    degradedSources.push(`kraljevski-pravni-univerzitet:${kraljevskiPravniUniverzitetTrack.readiness.status.toLowerCase()}`);
  }
  if (objektnoOrijentisanaProngilacija.readiness.degraded) {
    degradedSources.push(`objektna-prongilacija:${objektnoOrijentisanaProngilacija.readiness.status.toLowerCase()}`);
  }
  if (funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.degraded) {
    degradedSources.push(`funkcinalno-programiranje-energetskog-misaonog-toka:${funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status.toLowerCase()}`);
  }
  if (objektnoOrijentisanaReprodukcija.readiness.degraded) {
    degradedSources.push(`objektno-orijentisana-reprodukcija:${objektnoOrijentisanaReprodukcija.readiness.status.toLowerCase()}`);
  }
  if (objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.degraded) {
    degradedSources.push(`epic-elikvadenti:${objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status.toLowerCase()}`);
  }
  if (semaMuSemaFormula.status === 'BLOCKED') degradedSources.push('schema-mushema:blocked');
  if (mobilnaLinija.installationMessages.status === 'BLOCKED') degradedSources.push('mobilna-linija:installation-blocked');
  if (mobilnaLinija.packagePlanHint.readiness === 'BLOCKED') degradedSources.push('mobilna-linija:package-hint-blocked');
  const spajaKodEncapsulation = buildSpajaKodEncapsulation({
    freezeRequired,
    rekulitiPoRauletu,
    blockerActive,
    withinTargets,
    semaMuSemaFormula,
  });
  const spajaproTrack = buildSpajaproExtremTrack({
    freezeRequired,
    conflictIntensity,
    rekulitiPoRauletu,
  });
  const dokerKuratIzekDokarTrack = buildDokerKuratIzekDokarExtremTrack({
    freezeRequired,
    conflictIntensity,
  });

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
      id: 'petlje-contract-boundary-lock',
      description: 'DOK, DIK, SAR, OKRED, DIREKT, and INDIREKT are modeled as canonical PETLJE signals while the standalone DIREKT module remains preserved.',
      passed: petljeSignals.contractBoundary.existingSourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol'
        && petljeSignals.contractBoundary.standaloneDirektModulePreserved
        && petljeSignals.contractBoundary.direktPetljaMode === 'separate-loop-contract'
        && petljeSignals.contractBoundary.indirektPetljaMode === 'separate-loop-contract',
    },
    {
      id: 'petlje-signal-normalization',
      description: 'All new PETLJE signals publish bounded readiness/conflict outputs with additive degraded-safe semantics.',
      passed: petljeSignals.signals.length === 6
        && petljeSignals.signals.every((signal) =>
          Number.isFinite(signal.readinessScore)
          && signal.readinessScore >= 0
          && signal.readinessScore <= 100
          && Number.isFinite(signal.conflictScore)
          && signal.conflictScore >= 0
          && signal.conflictScore <= 100),
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
    {
      id: 'business-licensing-global-gate',
      description: 'EXTREM includes additive business-licensing signals for activity coverage and global license readiness with freeze indicators on critical gaps.',
      passed: Number.isFinite(businessLicensingSignals.activityCoverageScore)
        && Number.isFinite(businessLicensingSignals.globalLicenseReadinessScore)
        && businessLicensingSignals.activityCoverageScore >= 0
        && businessLicensingSignals.activityCoverageScore <= 100
        && businessLicensingSignals.globalLicenseReadinessScore >= 0
        && businessLicensingSignals.globalLicenseReadinessScore <= 100,
    },
    {
      id: 'kraljevski-pravni-univerzitet-track-lock',
      description: 'KRALJEVSKI PRAVNI UNIVERZITET keeps invariant additive contract wiring across EXTREM, EXTRONDOL, and SPAJA KOD boundaries.',
      passed: kraljevskiPravniUniverzitetTrack.additiveOnly
        && kraljevskiPravniUniverzitetTrack.technicalSourceOfTruth === '/api/extrimli/extrem'
        && kraljevskiPravniUniverzitetTrack.governanceSourceOfTruth === '/api/extrimli/extrondol'
        && kraljevskiPravniUniverzitetTrack.publicBoundary === '/api/extrimli/spaja-kod',
    },
    {
      id: 'kraljevski-pravni-univerzitet-vocabulary',
      description: 'The legal-governance track defines the canonical vocabulary, exact meanings, scopes, owners, and allowed relationships for all declared terms.',
      passed: kraljevskiPravniUniverzitetTrack.vocabulary.length === 6
        && kraljevskiPravniUniverzitetTrack.vocabulary.every((entry) => entry.allowedRelationships.length > 0 && entry.scope.length > 0 && entry.owner.length > 0),
    },
    {
      id: 'povelja-o-zakonodavnom-pravu-defined',
      description: 'POVELJA O ZAKONODAVNOM PRAVU is completed as the primary legislative-authority charter and no longer remains an undefined content gap.',
      passed: kraljevskiPravniUniverzitetTrack.documentationBoundary.primaryContentGap.topic === 'POVELJA O ZAKONODAVNOM PRAVU'
        && kraljevskiPravniUniverzitetTrack.documentationBoundary.primaryContentGap.status === 'COMPLETED'
        && kraljevskiPravniUniverzitetTrack.structuredSignals.charterCompleteness.completenessScore === 100,
    },
    {
      id: 'citizenship-order-neutral-boundary',
      description: 'PRAVNI POREDAK PO PRAVU GRAĐANSTVA is converted into a neutral civic-rule set with explicit unacceptable conduct, warning/block triggers, and escalation evidence.',
      passed: kraljevskiPravniUniverzitetTrack.neutralRuleSet.unacceptableConduct.length >= 3
        && kraljevskiPravniUniverzitetTrack.neutralRuleSet.warningTriggers.length >= 3
        && kraljevskiPravniUniverzitetTrack.neutralRuleSet.blockTriggers.length >= 3
        && kraljevskiPravniUniverzitetTrack.neutralRuleSet.evidenceRequiredBeforeEscalation.length >= 3,
    },
    {
      id: 'legal-track-public-boundary',
      description: 'The legal-governance track stays internal to EXTREM/EXTRONDOL while SPAJA KOD exposes only safe summarized status.',
      passed: kraljevskiPravniUniverzitetTrack.documentationBoundary.sourceMaterialPolicy === 'documentation-only'
        && spajaKodEncapsulation.rawPatternVisibility === 'HIDDEN'
        && spajaKodEncapsulation.exposurePolicy.exposesInternalSignalInputs === false,
    },
    {
      id: 'objektno-orijentisana-prongilacija-lock',
      description: 'Objektno orijentisana prongilacija is locked as an additive-only EXTREM object-state signal with explicit ownership split across EXTREM, EXTRONDOL, and SPAJA KOD.',
      passed: objektnoOrijentisanaProngilacija.contractVersion === 'v1-objektno-orijentisana-prongilacija'
        && objektnoOrijentisanaProngilacija.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD'
        && objektnoOrijentisanaProngilacija.ownershipModel.extrem === 'technical-object-state-signal',
    },
    {
      id: 'objektno-orijentisana-prongilacija-domain-model',
      description: 'Objektno orijentisana prongilacija defines object, instance, method, delegation, composition, readiness, blocker, and degraded semantics.',
      passed: objektnoOrijentisanaProngilacija.domainModel.domainObjects.length === 3
        && objektnoOrijentisanaProngilacija.domainModel.domainObjects.some((item) => item.role === 'objekat')
        && objektnoOrijentisanaProngilacija.domainModel.domainObjects.some((item) => item.role === 'instanca')
        && objektnoOrijentisanaProngilacija.domainModel.domainObjects.some((item) => item.role === 'metoda')
        && Number.isFinite(objektnoOrijentisanaProngilacija.readiness.score),
    },
    {
      id: 'funkcinalno-programiranje-energetskog-misaonog-toka-lock',
      description: 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA is locked as an additive EXTREM technical signal with explicit EXTREM/EXTRONDOL/SPAJA KOD ownership split.',
      passed: funkcinalnoProgramiranjeEnergetskogMisaonogToka.contractVersion === EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION
        && funkcinalnoProgramiranjeEnergetskogMisaonogToka.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD'
        && funkcinalnoProgramiranjeEnergetskogMisaonogToka.ownershipModel.extrem === 'technical-functional-energy-signal',
    },
    {
      id: 'funkcinalno-programiranje-energetskog-misaonog-toka-vocabulary',
      description: 'The functional energy-flow track defines canonical vocabulary, bounded readiness scoring, and audit-safe public-boundary semantics.',
      passed: funkcinalnoProgramiranjeEnergetskogMisaonogToka.canonicalVocabulary.energeticFlowStability.canonicalField === 'profileInput.energeticFlowStabilityPercent'
        && funkcinalnoProgramiranjeEnergetskogMisaonogToka.canonicalVocabulary.functionalTransformationCohesion.canonicalField === 'profileInput.functionalTransformationCohesionPercent'
        && funkcinalnoProgramiranjeEnergetskogMisaonogToka.canonicalVocabulary.thoughtChainDeterminism.canonicalField === 'profileInput.thoughtChainDeterminismPercent'
        && funkcinalnoProgramiranjeEnergetskogMisaonogToka.canonicalVocabulary.conflictPressure.canonicalField === 'profileInput.conflictPressurePercent'
        && Number.isFinite(funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.score),
    },
    {
      id: 'funkcionalno-programiranje-uzvisenog-misanog-toka-lock',
      description: 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA is locked as an additive EXTREM signal with exact user-requested spelling and explicit EXTREM/EXTRONDOL/SPAJA KOD ownership.',
      passed: funkcionalnoProgramiranjeUzvisenogMisanogToka.contractVersion === EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION
        && funkcionalnoProgramiranjeUzvisenogMisanogToka.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD'
        && funkcionalnoProgramiranjeUzvisenogMisanogToka.meaningLock.spellingDecision === 'exact-user-term-locked'
        && funkcionalnoProgramiranjeUzvisenogMisanogToka.ownershipModel.extrem === 'technical-elevated-thought-signal',
    },
    {
      id: 'funkcionalno-programiranje-uzvisenog-misanog-toka-model',
      description: 'The elevated thought-flow track defines canonical vocabulary, bounded readiness scoring, deterministic reasoning, and audit-safe public-boundary semantics.',
      passed: funkcionalnoProgramiranjeUzvisenogMisanogToka.canonicalVocabulary.elevatedThoughtFlowStability.canonicalField === 'profileInput.elevatedThoughtFlowStabilityPercent'
        && funkcionalnoProgramiranjeUzvisenogMisanogToka.canonicalVocabulary.functionalTransformationCohesion.canonicalField === 'profileInput.functionalTransformationCohesionPercent'
        && funkcionalnoProgramiranjeUzvisenogMisanogToka.canonicalVocabulary.reasoningDeterminism.canonicalField === 'profileInput.reasoningDeterminismPercent'
        && funkcionalnoProgramiranjeUzvisenogMisanogToka.canonicalVocabulary.conflictDegradationPressure.canonicalField === 'profileInput.conflictDegradationPressurePercent'
        && Number.isFinite(funkcionalnoProgramiranjeUzvisenogMisanogToka.readiness.score),
    },
    {
      id: 'funkionalno-programiranje-pravnog-misaonog-toka-lock',
      description: 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA is locked as an additive EXTREM legal-reasoning signal with exact user-requested spelling, legal-track coupling, and explicit EXTREM/EXTRONDOL/SPAJA KOD ownership.',
      passed: funkionalnoProgramiranjePravnogMisaonogToka.contractVersion === EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION
        && funkionalnoProgramiranjePravnogMisaonogToka.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD'
        && funkionalnoProgramiranjePravnogMisaonogToka.meaningLock.spellingDecision === 'exact-user-term-locked'
        && funkionalnoProgramiranjePravnogMisaonogToka.ownershipModel.extrem === 'technical-legal-reasoning-signal',
    },
    {
      id: 'funkionalno-programiranje-pravnog-misaonog-toka-legal-coupling',
      description: 'The legal functional-thought track stays bounded by KRALJEVSKI PRAVNI UNIVERZITET vocabulary, charter, citizenship-order, review requirements, and audit-safe public exposure.',
      passed: funkionalnoProgramiranjePravnogMisaonogToka.canonicalVocabulary.legalThoughtFlowStability.canonicalField === 'profileInput.legalThoughtFlowStabilityPercent'
        && funkionalnoProgramiranjePravnogMisaonogToka.canonicalVocabulary.functionalLegalTransformationCohesion.canonicalField === 'profileInput.functionalLegalTransformationCohesionPercent'
        && funkionalnoProgramiranjePravnogMisaonogToka.canonicalVocabulary.legalReasoningDeterminism.canonicalField === 'profileInput.legalReasoningDeterminismPercent'
        && funkionalnoProgramiranjePravnogMisaonogToka.canonicalVocabulary.evidentiaryCompleteness.canonicalField === 'profileInput.evidentiaryCompletenessPercent'
        && funkionalnoProgramiranjePravnogMisaonogToka.legalCoupling.sourceTrack === 'KRALJEVSKI PRAVNI UNIVERZITET'
        && funkionalnoProgramiranjePravnogMisaonogToka.legalCoupling.primaryCharter === 'POVELJA O ZAKONODAVNOM PRAVU'
        && Number.isFinite(funkionalnoProgramiranjePravnogMisaonogToka.readiness.score),
    },
    {
      id: 'objektno-orijentisana-reprodukcija-lock',
      description: 'Objektno orijentisana reprodukcija is locked as an additive-only EXTREM reproducibility signal with explicit ownership split across EXTREM, EXTRONDOL, and SPAJA KOD.',
      passed: objektnoOrijentisanaReprodukcija.contractVersion === 'v1-objektno-orijentisana-reprodukcija'
        && objektnoOrijentisanaReprodukcija.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD'
        && objektnoOrijentisanaReprodukcija.ownershipModel.extrem === 'technical-reproduction-signal',
    },
    {
      id: 'objektno-orijentisana-reprodukcija-model',
      description: 'Objektno orijentisana reprodukcija defines deterministic state/method replay, instance consistency, delegation stability, composition safety, and bounded readiness semantics.',
      passed: objektnoOrijentisanaReprodukcija.reproductionModel.checkpoints.length === 5
        && objektnoOrijentisanaReprodukcija.reproductionModel.checkpoints.every((item) => item.auditSafe)
        && Number.isFinite(objektnoOrijentisanaReprodukcija.readiness.score),
    },
    {
      id: 'objektno-orijentusano-uzdizanje-epskih-elikvadenata-lock',
      description: 'Objektno orijentusano uzdizanje epskih elikvadenata is locked as an additive EXTREM technical signal and remains inside the existing EXTRIMLI/EXTREM/EXTRONDOL boundary.',
      passed: objektnoOrijentusanoUzdizanjeEpskihElikvadenata.contractVersion === 'v1-objektno-orijentusano-uzdizanje-epskih-elikvadenata'
        && objektnoOrijentusanoUzdizanjeEpskihElikvadenata.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD'
        && objektnoOrijentusanoUzdizanjeEpskihElikvadenata.ownershipModel.extrem === 'technical-epic-equivalent-signal',
    },
    {
      id: 'objektno-orijentusano-uzdizanje-epskih-elikvadenata-controlled-equivalents',
      description: 'Epic elikvadenti are modeled as audit-safe controlled equivalents with bounded domains, relation types, and readiness semantics.',
      passed: objektnoOrijentusanoUzdizanjeEpskihElikvadenata.controlledEquivalents.entities.length === 3
        && objektnoOrijentusanoUzdizanjeEpskihElikvadenata.controlledEquivalents.supportedDomains.join(',') === 'MODULE,KNOWLEDGE,PERSONA'
        && objektnoOrijentusanoUzdizanjeEpskihElikvadenata.controlledEquivalents.epicRelationTypes.join(',') === 'FULL,FUNCTIONAL,SUBSTITUTABLE'
        && objektnoOrijentusanoUzdizanjeEpskihElikvadenata.controlledEquivalents.entities.every((item) => item.auditSafe)
        && Number.isFinite(objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.score),
    },
    {
      id: 'version-roadmap-lock',
      description: 'EXTREM remains locked to Verzija 4 in the shared EXTRIMLI EXTRONDOL EXTREM phased roadmap.',
      passed: versionRoadmap.contractVersion === 'v1-7-roadmap'
        && versionRoadmap.versions[3].id === 'Verzija 4'
        && versionRoadmap.sharedPrinciples.some((principle) => principle.id === 'additive-only-expansion'),
    },
    {
      id: 'spaja-kod-encapsulation',
      description: 'SPAJA KOD exposes only encapsulated readiness/governance output and hides raw EXTREM pattern inputs and formula internals.',
      passed: spajaKodEncapsulation.rawPatternVisibility === 'HIDDEN'
        && spajaKodEncapsulation.exposurePolicy.exposesRawPatternModel === false
        && spajaKodEncapsulation.exposurePolicy.exposesFormulaInternals === false
        && spajaKodEncapsulation.exposurePolicy.exposesInternalSignalInputs === false,
    },
    {
      id: 'doker-kurat-izek-dokar-overlay-lock',
      description: 'DOKER/KURAT/IZEK/DOKAR stays additive, ordered, mandatory, and keeps DOKER bound to downstream-sync semantics.',
      passed: dokerKuratIzekDokarTrack.vocabulary.additiveOnly
        && dokerKuratIzekDokarTrack.vocabulary.ordered
        && dokerKuratIzekDokarTrack.vocabulary.mandatoryTokens
        && dokerKuratIzekDokarTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR'
        && dokerKuratIzekDokarTrack.vocabulary.tokenSequence[0].signalRole === 'downstream-sync',
    },
    {
      id: 'doker-kurat-izek-dokar-extrem-freeze',
      description: 'EXTREM owns the technical quartet signal and independently controls freeze-sensitive statuses before EXTRONDOL governance.',
      passed: dokerKuratIzekDokarTrack.technicalSignalEngine === 'EXTREM'
        && dokerKuratIzekDokarTrack.governanceConsumer === 'EXTRONDOL'
        && dokerKuratIzekDokarTrack.freezeControlledByExtrem === freezeRequired
        && dokerKuratIzekDokarTrack.sequenceStates[1].signalRole === 'technical-risk',
    },
    {
      id: 'spajapro-terminology-lock',
      description: 'SPAJAPRO uses the locked ODIT → KODER token sequence as an additive interpretation track on top of EXTRIMLI.',
      passed: spajaproTrack.vocabulary.layering === 'extends-existing-extrimli-stack'
        && spajaproTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'ODIT,DEKER,DUNOR,SUMOR,OKET,DAKOR,EKSER,DOKER,DUKAR,DONAR,KODER',
    },
    {
      id: 'spajapro-extrem-freeze-independence',
      description: 'EXTREM independently controls the SPAJAPRO freeze token before EXTRONDOL promotion decisions are made.',
      passed: spajaproTrack.freezeControlledByExtrem === freezeRequired
        && spajaproTrack.activeTokenStates.some((item) => item.token === 'OKET' && item.status === (freezeRequired ? 'BLOCKED' : 'READY')),
    },
    {
      id: 'mobilna-linija-installation-contract',
      description: 'Mobilna linija publishes mandatory installation messages and package-plan hint with additive device compatibility validation.',
      passed: mobilnaLinija.contractVersion === 'v1-mobilna-linija-installation'
        && mobilnaLinija.installationMessages.required
        && mobilnaLinija.installationMessages.messages.length >= 3,
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
    mobilnaLinija,
    profile: {
      bottleneckDetected,
      bottleneckLayer: 'DISKVIT',
      conflictScore,
      conflictIntensity,
      optimizationTier,
    },
    businessLicensingSignals,
    kraljevskiPravniUniverzitetTrack,
    petljeSignals,
    objektnoOrijentisanaProngilacija,
    funkcinalnoProgramiranjeEnergetskogMisaonogToka,
    funkcionalnoProgramiranjeUzvisenogMisanogToka,
    funkionalnoProgramiranjePravnogMisaonogToka,
    objektnoOrijentisanaReprodukcija,
    objektnoOrijentusanoUzdizanjeEpskihElikvadenata,
    semaMuSemaFormula,
    spajaKodEncapsulation,
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
    dokerKuratIzekDokarTrack,
    spajaproTrack,
    roadmapAlignment: {
      sourceProgram: versionRoadmap.programName,
      primaryVersion: 'Verzija 4',
      predecessorVersions: ['Verzija 1', 'Verzija 2', 'Verzija 3'],
      unlocksVersions: ['Verzija 5', 'Verzija 6', 'Verzija 7'],
      mandatoryGate: true,
    },
    versionRoadmap,
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
  ExtrimliExtremBusinessLicensingSignals,
  ExtrimliExtremConflictIntensity,
  ExtrimliExtremDiscanInKibenState,
  ExtrimliExtremEkodorState,
  ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaProfileInput,
  ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaSignal,
  ExtrimliExtremFunkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus,
  ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaProfileInput,
  ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaSignal,
  ExtrimliExtremFunkionalnoProgramiranjePravnogMisaonogTokaStatus,
  ExtrimliExtremMobilnaLinijaDeviceType,
  ExtrimliExtremMobilnaLinijaInput,
  ExtrimliExtremMobilnaLinijaInstallationStatus,
  ExtrimliExtremMobilnaLinijaPackageTier,
  ExtrimliExtremEpicElikvadentEquivalent,
  ExtrimliExtremEpicElikvadentProfileInput,
  ExtrimliExtremEpicElikvadentSignal,
  ExtrimliExtremEpicElikvadentStatus,
  ExtrimliExtremPetljaSignalInput,
  ExtrimliExtremPetljaSignalName,
  ExtrimliExtremPetljaSignalResult,
  ExtrimliExtremPetljaSignalSection,
  ExtrimliExtremPetljaSignalStatus,
  ExtrimliExtremObjektnaProngilacijaDomainObject,
  ExtrimliExtremObjektnaProngilacijaProfileInput,
  ExtrimliExtremObjektnaProngilacijaSignal,
  ExtrimliExtremObjektnaProngilacijaStatus,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaCheckpoint,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaProfileInput,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaSignal,
  ExtrimliExtremObjektnoOrijentisanaReprodukcijaStatus,
  ExtrimliExtremOptimizationTier,
  ExtrimliExtremProfileInput,
  ExtrimliExtremProfilerReport,
  ExtrimliExtremRekulitiPoRauletuPolicy,
  ExtrimliExtremResolutionInput,
  ExtrimliExtremSemaFormulaEvaluation,
  ExtrimliExtremSpajaKodEncapsulation,
  ExtrimliSpajaKodPublicStatus,
} from './types';

export {
  EXTRIMLI_EXTREM_PROFILER_API_MAX_MS,
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR,
  EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED,
  EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_MIN_WATCH_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_WATCH_SCORE,
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
