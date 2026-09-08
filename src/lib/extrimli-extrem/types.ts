export type ExtrimliExtremConflictIntensity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ExtrimliExtremOptimizationTier =
  | 'MAXIMUM_GRAPHICS_UNLOCK'
  | 'BALANCED_OPTIMIZATION'
  | 'AGGRESSIVE_OPTIMIZATION'
  | 'EXTREME_PROFILING_REQUIRED';

export type ExtrimliExtremEkodorState = 'ALIGNED' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremDiscanInKibenState = 'CLEAR' | 'WATCH' | 'BLOCKED';
export type ExtrimliExtremRekulitiPoRauletuPolicy = 'ALLOW' | 'WARN' | 'FREEZE';

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

export interface ExtrimliExtremAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
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
  profile: {
    bottleneckDetected: boolean;
    bottleneckLayer: 'DISKVIT';
    conflictScore: number;
    conflictIntensity: ExtrimliExtremConflictIntensity;
    optimizationTier: ExtrimliExtremOptimizationTier;
  };
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
