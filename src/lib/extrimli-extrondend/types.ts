import type { Extrimli3HealthReport } from '../extrimli-3';
import type { CuzHealthReport } from '../extrimli-cuz';
import type { ExtrimliHealthReport } from '../extrimli';
import type { ExtrimliExtendolReport } from '../extrimli-extendol';
import type { ExtrimliKoronHealthReport } from '../extrimli-koron';

export interface ExtrimliExtrondendAcceptanceCriterion {
  id: string;
  description: string;
  passed: boolean;
}

export interface ExtrimliExtrondendReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: string;
  statement: string;
  ownership: string;
  triggerLabel: string;
  pathScope: string[];
  aggregationScore: number;
  readinessParityScore: number;
  weightedSurfaceHealth: number;
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  acceptanceCriteria: ExtrimliExtrondendAcceptanceCriterion[];
  integrationBoundaries: {
    dependsOn: string[];
    aliasesOfExistingSurfaces: false;
  };
  kpiTargets: {
    evaluationMaxMs: number;
    apiResponseMaxMs: number;
  };
  surfaces: {
    v1: ExtrimliHealthReport;
    v3: Extrimli3HealthReport;
    cuz: CuzHealthReport;
    extendol: ExtrimliExtendolReport;
    koron: ExtrimliKoronHealthReport;
  };
}

export const EXTRONDEND_CONTRACT_VERSION = 'v1-extrondend';
export const EXTRONDEND_MODULE_VERSION = '1.0.0';
export const EXTRONDEND_PERSONA_ID = 'extrimli-extrondend-aggregator';
export const EXTRONDEND_SOURCE_OF_TRUTH = '/api/extrimli/extrondend';
export const EXTRONDEND_EVALUATION_MAX_MS = 50;
export const EXTRONDEND_API_MAX_MS = 200;
