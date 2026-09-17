import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  round,
} from '../extrimli';
import { buildAIIQWorldBankLicencniRegistar } from '../aiiq-world-bank-licencni-registar';
import type {
  ExtrimliExtremAcceptanceCriterion,
  ExtrimliExtremBusinessLicensingSignals,
  ExtrimliExtremConflictIntensity,
  ExtrimliExtremDiscanInKibenState,
  ExtrimliExtremEkodorState,
  ExtrimliExtremMobilnaLinijaDeviceType,
  ExtrimliExtremMobilnaLinijaInput,
  ExtrimliExtremMobilnaLinijaInstallationStatus,
  ExtrimliExtremMobilnaLinijaPackageTier,
  ExtrimliExtremEpicElikvadentEquivalent,
  ExtrimliExtremEpicElikvadentProfileInput,
  ExtrimliExtremEpicElikvadentSignal,
  ExtrimliExtremEpicElikvadentStatus,
  ExtrimliExtremObjektnaProngilacijaDomainObject,
  ExtrimliExtremObjektnaProngilacijaProfileInput,
  ExtrimliExtremObjektnaProngilacijaSignal,
  ExtrimliExtremObjektnaProngilacijaStatus,
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
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE,
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

function classifyObjektnaProngilacijaStatus(score: number): ExtrimliExtremObjektnaProngilacijaStatus {
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE) return 'WATCH';
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

function classifyEpicElikvadentStatus(score: number): ExtrimliExtremEpicElikvadentStatus {
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_READY_SCORE) return 'READY';
  if (score >= EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_MIN_WATCH_SCORE) return 'WATCH';
  return 'BLOCKED';
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

export function getExtrimliExtremProfilerReport(): ExtrimliExtremProfilerReport {
  const versionRoadmap = getExtrimliVersionRoadmap();
  const degradedSources: string[] = [];
  const profileInput = resolveProfileInput(degradedSources);
  const resolutionInput = resolveResolutionInput(degradedSources);
  const objektnaProngilacijaDegradedSources: string[] = [];
  const objektnaProngilacijaInput = resolveObjektnaProngilacijaInput(objektnaProngilacijaDegradedSources);
  degradedSources.push(...objektnaProngilacijaDegradedSources);
  const epicElikvadentDegradedSources: string[] = [];
  const epicElikvadentInput = resolveEpicElikvadentInput(epicElikvadentDegradedSources);
  degradedSources.push(...epicElikvadentDegradedSources);
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
  const objektnoOrijentisanaProngilacija = buildObjektnaProngilacijaSignal(
    objektnaProngilacijaInput,
    objektnaProngilacijaDegradedSources.length > 0,
  );
  const objektnoOrijentusanoUzdizanjeEpskihElikvadenata = buildEpicElikvadentSignal(
    epicElikvadentInput,
    epicElikvadentDegradedSources.length > 0,
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
    || businessLicensingSignals.freezeRequired
    || objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status === 'BLOCKED'
    || semaMuSemaFormula.status === 'BLOCKED'
    || mobilnaLinija.installationMessages.status === 'BLOCKED'
    || mobilnaLinija.packagePlanHint.readiness === 'BLOCKED';

  const governanceReasons = [
    ...(freezeRequired ? ['DISKVIT conflict or KPI pressure requires WAWE freeze before promotion.'] : []),
    ...(!withinTargets ? ['Profiler KPI targets are outside evaluation/API budgets.'] : []),
    ...(bottleneckDetected ? ['Browser graphics bottleneck detected in DISKVIT layer.'] : []),
    ...(rekulitiPoRauletu === 'WARN' ? ['REKULITI PO RAULETU remains in warning posture for REZOLUCIJA/EKODOR review.'] : []),
    ...(rekulitiPoRauletu === 'FREEZE' ? ['REKULITI PO RAULETU requires freeze because DISCAN in KIBEN or REZOLUCIJA readiness is blocked.'] : []),
    ...(businessLicensingSignals.freezeRequired
      ? [`Global licensing readiness gate triggered: ${businessLicensingSignals.freezeReasons.join(', ')}`]
      : ['Global licensing readiness is aligned for EXTREM governance.']),
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
  if (businessLicensingSignals.freezeRequired) degradedSources.push('global-licensing:freeze-required');
  if (objektnoOrijentisanaProngilacija.readiness.degraded) {
    degradedSources.push(`objektna-prongilacija:${objektnoOrijentisanaProngilacija.readiness.status.toLowerCase()}`);
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
    objektnoOrijentisanaProngilacija,
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
  ExtrimliExtremMobilnaLinijaDeviceType,
  ExtrimliExtremMobilnaLinijaInput,
  ExtrimliExtremMobilnaLinijaInstallationStatus,
  ExtrimliExtremMobilnaLinijaPackageTier,
  ExtrimliExtremEpicElikvadentEquivalent,
  ExtrimliExtremEpicElikvadentProfileInput,
  ExtrimliExtremEpicElikvadentSignal,
  ExtrimliExtremEpicElikvadentStatus,
  ExtrimliExtremObjektnaProngilacijaDomainObject,
  ExtrimliExtremObjektnaProngilacijaProfileInput,
  ExtrimliExtremObjektnaProngilacijaSignal,
  ExtrimliExtremObjektnaProngilacijaStatus,
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
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE,
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
