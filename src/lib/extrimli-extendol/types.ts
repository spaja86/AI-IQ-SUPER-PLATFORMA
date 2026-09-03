import type { Extrimli3HealthReport } from '../extrimli-3';
import type { CuzHealthReport } from '../extrimli-cuz';
import type { ExtrimliHealthReport } from '../extrimli';

export interface ExtrimliExtendolCoverage {
  sportRiskEvaluation: boolean;
  gearAndSafetyReadiness: boolean;
  eventLifecycleAndRegistration: boolean;
  destructionSafetyFlows: boolean;
  athleteProgressAndReadiness: boolean;
  communityReputationAndMentorship: boolean;
}

export interface ExtrimliExtendolAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExtrimliExtendolReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  statement: string;
  sourceOfTruth: string;
  maxFunctionalityForAll: boolean;
  unifiedReadinessScore: number;
  coverage: ExtrimliExtendolCoverage;
  acceptanceCriteria: ExtrimliExtendolAcceptanceCriterion[];
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  kpiTargets: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
  };
  surfaces: {
    v1: ExtrimliHealthReport;
    v3: Extrimli3HealthReport;
    cuz: CuzHealthReport;
  };
}

export const EXTRIMLI_EXTENDOL_CONTRACT_VERSION = 'v1';
export const EXTRIMLI_EXTENDOL_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_EXTENDOL_PERSONA_ID = 'extrimli-extendol-unified';
export const EXTRIMLI_EXTENDOL_SOURCE_OF_TRUTH = '/api/extrimli/extendol';
export const EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS = 50;
export const EXTRIMLI_EXTENDOL_API_MAX_MS = 200;
