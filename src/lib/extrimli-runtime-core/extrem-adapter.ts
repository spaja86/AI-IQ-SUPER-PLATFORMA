import type { ExtrimliExtremProfilerReport } from '../extrimli-extrem/types';
import { evaluateExtrimliRuntimeCore, type ExtrimliRuntimeCoreResult } from './index';

/**
 * Compatibility adapter for incremental migration from the existing EXTREM report.
 * It reads only summary-safe readiness fields and does not alter the report shape.
 */
export function evaluateExtrimliExtremRuntimeCore(
  report: ExtrimliExtremProfilerReport,
): ExtrimliRuntimeCoreResult {
  const reflection = report.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection;

  return evaluateExtrimliRuntimeCore({
    technical: [
      reflection.technicalReadinessProfile.radniTaktMozgaMislilac.status,
      reflection.technicalReadinessProfile.metrikoProgramiranje.status,
      reflection.technicalReadinessProfile.sinemetrickoProgramiranje.status,
      reflection.technicalReadinessProfile.paradijogonalnoProgramiranje.status,
      reflection.technicalReadinessProfile.vrhProgramskogEkviladenta.status,
    ],
    governance: [
      report.dokDikDakDukConsistencyHealth.status,
      reflection.readiness.status,
    ],
  });
}
