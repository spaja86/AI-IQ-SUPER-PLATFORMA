import {
  aggregateReadinessStatus,
  readinessStatusScore,
  type ExtrimliReadinessStatus,
} from '../extrimli-readiness';

export const EXTRIMLI_RUNTIME_CORE_VERSION = 'v1' as const;

export interface ExtrimliRuntimeCoreInput {
  technical: readonly ExtrimliReadinessStatus[];
  governance: readonly ExtrimliReadinessStatus[];
}

export interface ExtrimliRuntimeCoreResult {
  version: typeof EXTRIMLI_RUNTIME_CORE_VERSION;
  readiness: {
    status: ExtrimliReadinessStatus;
    score: number;
  };
  governance: {
    status: ExtrimliReadinessStatus;
    promotionAllowed: boolean;
  };
  degraded: boolean;
}

function averageStatusScore(statuses: readonly ExtrimliReadinessStatus[]): number {
  return Math.round(
    (statuses.reduce((sum, status) => sum + readinessStatusScore(status), 0) / statuses.length) * 100,
  ) / 100;
}

/**
 * Minimal replacement core for future EXTRIMLI facades.
 * It deliberately owns only deterministic readiness and promotion posture;
 * existing routes remain the source of compatibility until migrated.
 */
export function evaluateExtrimliRuntimeCore(input: ExtrimliRuntimeCoreInput): ExtrimliRuntimeCoreResult {
  if (input.technical.length === 0 || input.governance.length === 0) {
    throw new Error('EXTRIMLI runtime core requires technical and governance signals');
  }

  const technicalStatus = aggregateReadinessStatus(input.technical);
  const governanceStatus = aggregateReadinessStatus(input.governance);
  const status = aggregateReadinessStatus([technicalStatus, governanceStatus]);

  return {
    version: EXTRIMLI_RUNTIME_CORE_VERSION,
    readiness: {
      status,
      score: averageStatusScore([...input.technical, ...input.governance]),
    },
    governance: {
      status: governanceStatus,
      promotionAllowed: status === 'READY',
    },
    degraded: status !== 'READY',
  };
}
