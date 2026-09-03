import type { Extrimli3HealthReport } from '../extrimli-3';
import type { CuzHealthReport } from '../extrimli-cuz';
import type { ExtrimliHealthReport } from '../extrimli';

export type ExtrimliKoronStatus = 'ACTIVE' | 'WATCH' | 'DEGRADED';

export interface ExtrimliKoronHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  sourceOfTruth: string;
  status: ExtrimliKoronStatus;
  readinessScore: number;
  riskBalanceScore: number;
  communitySignalScore: number;
  destructionRecoveryScore: number;
  syncCoverageScore: number;
  degraded: boolean;
  degradedMode: 'partial-payload-no-500';
  degradedSources: string[];
  warnings: string[];
  performanceMaxMs: number;
  apiResponseMaxMs: number;
  surfaces: {
    v1: ExtrimliHealthReport;
    v3: Extrimli3HealthReport;
    cuz: CuzHealthReport;
  };
}

export const EXTRIMLI_KORON_CONTRACT_VERSION = 'v1-koron';
export const EXTRIMLI_KORON_MODULE_VERSION = '1.0.0';
export const EXTRIMLI_KORON_PERSONA_ID = 'extrimli-koron-overlay';
export const EXTRIMLI_KORON_SOURCE_OF_TRUTH = '/api/extrimli/koron';
export const EXTRIMLI_KORON_EVALUATION_MAX_MS = 50;
export const EXTRIMLI_KORON_API_MAX_MS = 200;
