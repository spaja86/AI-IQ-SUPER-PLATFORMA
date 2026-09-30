import type { ExtrimliExtrondolReport } from '../extrimli-extrondol/types';
import { evaluateExtrimliRuntimeCore, type ExtrimliRuntimeCoreResult } from './index';

/**
 * Compatibility adapter for incremental migration from the existing EXTRONDOL report.
 * It preserves EXTRONDOL's promotion-freeze boundary and does not alter route output.
 */
export function evaluateExtrimliExtrondolRuntimeCore(
  report: ExtrimliExtrondolReport,
): ExtrimliRuntimeCoreResult {
  const reflection = report.developerAndCreateRepoWideReflection;

  return evaluateExtrimliRuntimeCore({
    technical: [
      reflection.status,
      report.extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status,
    ],
    governance: [
      reflection.status,
      report.rollout.promotionFreeze ? 'BLOCKED' : 'READY',
    ],
  });
}
