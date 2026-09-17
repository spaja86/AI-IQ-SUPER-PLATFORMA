import type { ExtrimliVersionRoadmap, ExtrimliVersionRoadmapVersionId } from '../extrimli-version-roadmap';
import type { ExtrimliSpajaproExtremTrack } from '../extrimli-spajapro-track';

export type ExtrimliExtremConflictIntensity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ExtrimliExtremOptimizationTier =
  | 'MAXIMUM_GRAPHICS_UNLOCK'
  | 'BALANCED_OPTIMIZATION'
  | 'AGGRESSIVE_OPTIMIZATION'
  | 'EXTREME_PROFILING_REQUIRED';

export type ExtrimliExtremEkodorState = 'ALIGNED' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremDiscanInKibenState = 'CLEAR' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremRekulitiPoRauletuPolicy = 'ALLOW' | 'WARN' | 'FREEZE';
export type ExtrimliExtremMobilnaLinijaDeviceType = 'ANDROID' | 'IOS' | 'ROUTER_4G' | 'ROUTER_5G' | 'UNKNOWN';
export type ExtrimliExtremMobilnaLinijaInstallationStatus = 'READY' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremMobilnaLinijaPackageTier = 'BASIC' | 'SMART' | 'PRO' | 'NONE';
export type ExtrimliExtremObjektnaProngilacijaStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremObjektnaProngilacijaProfileInput {
  objectStateIntegrityPercent: number;
  methodBehaviorCohesionPercent: number;
  delegationCoveragePercent: number;
  compositionCoveragePercent: number;
  instanceClarityPercent: number;
}

export interface ExtrimliExtremObjektnaProngilacijaDomainObject {
  id: 'objekat-core' | 'instanca-flow' | 'metoda-bridge';
  title: string;
  role: 'objekat' | 'instanca' | 'metoda';
  responsibility: string;
  stateAttributes: readonly string[];
  methods: readonly string[];
  collaborationModel: 'enkapsulacija' | 'delegacija' | 'kompozicija';
}

export interface ExtrimliExtremObjektnaProngilacijaSignal {
  term: 'Objektno orijentisana prongilacija';
  contractVersion: 'v1-objektno-orijentisana-prongilacija';
  additiveOnly: true;
  sourceOfTruth: '/api/extrimli/extrem';
  triggerLabel: 'extrem:logic-change';
  scopeLock: readonly ['EXTRIMLI', 'EXTREM', 'EXTRONDOL', 'SPAJA KOD'];
  meaningLock: {
    canonicalName: 'Objektno orijentisana prongilacija';
    statement: string;
    existingContractBeforeThisChange: false;
  };
  ownershipModel: {
    extrem: 'technical-object-state-signal';
    extrondol: 'wawe-orchestration-audit-consumer';
    spajaKod: 'public-encapsulated-boundary';
  };
  profileInput: ExtrimliExtremObjektnaProngilacijaProfileInput;
  domainModel: {
    objectRole: string;
    instanceRole: string;
    attributeRole: string;
    methodRole: string;
    delegationRole: string;
    compositionRole: string;
    domainObjects: readonly [
      ExtrimliExtremObjektnaProngilacijaDomainObject,
      ExtrimliExtremObjektnaProngilacijaDomainObject,
      ExtrimliExtremObjektnaProngilacijaDomainObject
    ];
  };
  readiness: {
    score: number;
    status: ExtrimliExtremObjektnaProngilacijaStatus;
    readinessSignal: boolean;
    degraded: boolean;
    watchReasons: string[];
    blockerReasons: string[];
  };
}

export interface ExtrimliExtremProfileInput {
  sceneLoadPercent: number;
  gpuContentionPercent: number;
  cpuContentionPercent: number;
  renderCycleLatencyMs: number;
}

export interface ExtrimliExtremResolutionInput {
  rezolucijaCompletenessPercent: number;
  ekodorAlignmentPercent: number;
  discanPressurePercent: number;
}

export interface ExtrimliExtremMobilnaLinijaInput {
  lineType: 'Mobilna linija';
  deviceType: ExtrimliExtremMobilnaLinijaDeviceType;
  deviceModel: string;
  supportsEsim: boolean;
  osVersionMajor: number;
  signalStrengthPercent: number;
}

export interface ExtrimliExtremSemaFormulaInput {
  sema: number;
  allSema: number;
  expectedMuSema: number;
}

export type ExtrimliExtremSemaFormulaStatus = 'PASSED' | 'BLOCKED';
export type ExtrimliSpajaKodPublicStatus = 'READY' | 'WATCH' | 'BLOCKED';

export interface ExtrimliExtremSemaFormulaEvaluation {
  canonicalExpression: 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA';
  scopeLock: readonly ['EXTRIMLI', 'EXTRONDOL', 'EXTREM'];
  inputs: ExtrimliExtremSemaFormulaInput;
  computedMuSema: number;
  formulaHolds: boolean;
  status: ExtrimliExtremSemaFormulaStatus;
  deterministic: boolean;
  inputSubstitutions: string[];
  blockerReasons: string[];
  muSemaConclusion: 'MUŠEMA_CONFIRMED' | 'MUŠEMA_BLOCKED';
}

export interface ExtrimliExtremSpajaKodEncapsulation {
  surfaceName: 'SPAJA KOD';
  contractVersion: 'v1-spaja-kod';
  representationMode: 'system-encapsulation';
  encapsulationStatus: 'ACTIVE';
  rawPatternVisibility: 'HIDDEN';
  exposurePolicy: {
    exposesRawPatternModel: false;
    exposesFormulaInternals: false;
    exposesInternalSignalInputs: false;
    exposesOnlySystemSignals: true;
  };
  publicInterpretation: string;
  readiness: {
    status: ExtrimliSpajaKodPublicStatus;
    governanceOutcome: ExtrimliExtremRekulitiPoRauletuPolicy;
    blockerCount: number;
  };
  publicSignals: readonly [
    'readiness-status',
    'governance-outcome',
    'promotion-freeze',
    'audit-blockers'
  ];
  blockers: string[];
}

export interface ExtrimliExtremAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExtrimliExtremBusinessLicensingSignals {
  sourceOfTruth: '/api/aiiq-world-bank-licencni-registar';
  activityCoverageScore: number;
  globalLicenseReadinessScore: number;
  criticalGlobalGapCount: number;
  freezeRequired: boolean;
  freezeReasons: string[];
}

export interface ExtrimliExtremProfilerReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: string;
  statement: string;
  ownership: string;
  triggerLabel: string;
  pathScope: string[];
  terminology: {
    diskvitRole: 'browser-graphics-bottleneck-layer';
    conflictModel: 'conflict-proportional';
    conflictInputs: readonly ['sceneLoadPercent', 'gpuContentionPercent', 'cpuContentionPercent', 'renderCycleLatencyMs'];
    normalizedVocabulary: {
      REZOLUCIJA: {
        canonicalField: 'resolutionReadiness.rezolucijaScore';
        meaning: 'resolution-readiness-dimension';
      };
      EKODOR: {
        canonicalField: 'resolutionReadiness.ekodorState';
        meaning: 'readiness-alignment-signal';
      };
      'REKULITI PO RAULETU': {
        canonicalField: 'resolutionReadiness.rekulitiPoRauletu';
        meaning: 'resolution-routing-policy';
      };
      DISCAN: {
        canonicalField: 'resolutionInput.discanPressurePercent';
        meaning: 'blocking-pressure-input';
      };
      KIBEN: {
        canonicalField: 'resolutionReadiness.kibenLane';
        meaning: 'governance-lane';
      };
    };
  };
  profileInput: ExtrimliExtremProfileInput;
  resolutionInput: ExtrimliExtremResolutionInput;
  mobilnaLinija: {
    contractVersion: 'v1-mobilna-linija-installation';
    input: ExtrimliExtremMobilnaLinijaInput;
    deviceCompatibility: {
      deviceTypeProvided: boolean;
      compatible: boolean;
      status: ExtrimliExtremMobilnaLinijaInstallationStatus;
      reasons: string[];
    };
    installationMessages: {
      required: true;
      status: ExtrimliExtremMobilnaLinijaInstallationStatus;
      messages: string[];
      missingFields: string[];
    };
    packagePlanHint: {
      recommendedPlanTier: ExtrimliExtremMobilnaLinijaPackageTier;
      readiness: ExtrimliExtremMobilnaLinijaInstallationStatus;
      reason: string;
    };
  };
  profile: {
    bottleneckDetected: boolean;
    bottleneckLayer: 'DISKVIT';
    conflictScore: number;
    conflictIntensity: ExtrimliExtremConflictIntensity;
    optimizationTier: ExtrimliExtremOptimizationTier;
  };
  businessLicensingSignals: ExtrimliExtremBusinessLicensingSignals;
  semaMuSemaFormula: ExtrimliExtremSemaFormulaEvaluation;
  spajaKodEncapsulation: ExtrimliExtremSpajaKodEncapsulation;
  objektnoOrijentisanaProngilacija: ExtrimliExtremObjektnaProngilacijaSignal;
  resolutionReadiness: {
    rezolucijaScore: number;
    ekodorState: ExtrimliExtremEkodorState;
    rekulitiPoRauletu: ExtrimliExtremRekulitiPoRauletuPolicy;
    discanInKibenState: ExtrimliExtremDiscanInKibenState;
    kibenLane: 'KIBEN';
    readinessSignal: boolean;
    blockerActive: boolean;
  };
  optimization: {
    maximumGraphicsUnlockThreshold: {
      maxConflictScore: number;
      maxRenderCycleLatencyMs: number;
      maxGpuContentionPercent: number;
    };
    maximumGraphicsUnlockEligible: boolean;
  };
  governanceSignal: {
    freezeRequired: boolean;
    wawePromotionEligible: boolean;
    reasons: string[];
  };
  spajaproTrack: ExtrimliSpajaproExtremTrack;
  roadmapAlignment: {
    sourceProgram: string;
    primaryVersion: ExtrimliVersionRoadmapVersionId;
    predecessorVersions: readonly ExtrimliVersionRoadmapVersionId[];
    unlocksVersions: readonly ExtrimliVersionRoadmapVersionId[];
    mandatoryGate: true;
  };
  versionRoadmap: ExtrimliVersionRoadmap;
  kpiTargets: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
  };
  kpiObserved: {
    evaluationMs: number;
    apiResponseMs: number;
    withinTargets: boolean;
  };
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  acceptanceCriteria: ExtrimliExtremAcceptanceCriterion[];
  integrationBoundaries: {
    aliasesOfExistingSurfaces: false;
  };
}

export const EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION = 'v1-extrem-profiler';
export const EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_EXTREM_PROFILER_PERSONA_ID = 'extrimli-extrem-profiler-core';
export const EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH = '/api/extrimli/extrem';
export const EXTRIMLI_EXTREM_PROFILER_EVALUATION_MAX_MS = 50;
export const EXTRIMLI_EXTREM_PROFILER_API_MAX_MS = 200;
export const EXTRIMLI_EXTREM_PROFILER_MAX_CONFLICT_FOR_UNLOCK = 35;
export const EXTRIMLI_EXTREM_PROFILER_MAX_LATENCY_FOR_UNLOCK = 45;
export const EXTRIMLI_EXTREM_PROFILER_MAX_GPU_CONTENTION_FOR_UNLOCK = 40;
export const EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY = 70;
export const EXTRIMLI_EXTREM_EKODOR_MIN_FOR_ALIGNED = 65;
export const EXTRIMLI_EXTREM_EKODOR_MIN_FOR_WATCH = 45;
export const EXTRIMLI_EXTREM_DISCAN_MAX_FOR_CLEAR = 35;
export const EXTRIMLI_EXTREM_DISCAN_MAX_FOR_WATCH = 60;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION = 'v1-mobilna-linija-installation';
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY = 55;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_WATCH = 35;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_ANDROID_MAJOR = 10;
export const EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_IOS_MAJOR = 15;
export const EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION = 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA';
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION = 'v1-objektno-orijentisana-prongilacija';
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_READY_SCORE = 75;
export const EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_MIN_WATCH_SCORE = 55;
