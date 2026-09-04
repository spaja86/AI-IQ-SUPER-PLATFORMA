import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  getExtrimliHealthReport,
  round,
} from '../extrimli';
import { getExtrimli3HealthReport } from '../extrimli-3';
import { getCuzHealthReport } from '../extrimli-cuz';
import { getDuelKingHealthReport } from '../extrimli-duel-king';
import type { ExtrimliKoronHealthReport, ExtrimliKoronStatus } from './types';
import {
  EXTRIMLI_KORON_API_MAX_MS,
  EXTRIMLI_KORON_CONTRACT_VERSION,
  EXTRIMLI_KORON_EVALUATION_MAX_MS,
  EXTRIMLI_KORON_MODULE_VERSION,
  EXTRIMLI_KORON_PERSONA_ID,
  EXTRIMLI_KORON_SOURCE_OF_TRUTH,
} from './types';

function getSyncCoverageScore(hasDegradedSources: boolean): number {
  return hasDegradedSources ? 72 : 100;
}

function getStatus(readinessScore: number, degraded: boolean): ExtrimliKoronStatus {
  if (degraded || readinessScore < 60) return 'DEGRADED';
  if (readinessScore < 80) return 'WATCH';
  return 'ACTIVE';
}

export function getExtrimliKoronHealthReport(): ExtrimliKoronHealthReport {
  const v1 = getExtrimliHealthReport();
  const v3 = getExtrimli3HealthReport();
  const cuz = getCuzHealthReport();
  const duelKing = getDuelKingHealthReport();

  const degradedSources: string[] = [];
  if (v1.performanceMaxMs > EXTRIMLI_KORON_EVALUATION_MAX_MS || v1.apiResponseMaxMs > EXTRIMLI_KORON_API_MAX_MS) {
    degradedSources.push('extrimli-v1-kpi');
  }
  if (v3.performanceMaxMs > EXTRIMLI_KORON_EVALUATION_MAX_MS || v3.apiResponseMaxMs > EXTRIMLI_KORON_API_MAX_MS) {
    degradedSources.push('extrimli-v3-kpi');
  }
  if (cuz.performanceMaxMs > EXTRIMLI_KORON_EVALUATION_MAX_MS || cuz.apiResponseMaxMs > EXTRIMLI_KORON_API_MAX_MS) {
    degradedSources.push('extrimli-cuz-kpi');
  }
  if (duelKing.performanceMaxMs > EXTRIMLI_KORON_EVALUATION_MAX_MS || duelKing.apiResponseMaxMs > EXTRIMLI_KORON_API_MAX_MS) {
    degradedSources.push('extrimli-duel-king-kpi');
  }

  const riskBalanceScore = round(clamp(100 - ((v1.lastRiskScore + v3.lastRiskScore) / 2), 0, 100), 2);
  const duelKingReadinessScore = duelKing.evaluations > 0
    ? round(clamp(duelKing.lastReadinessScore, 0, 100), 2)
    : 0;
  const communitySignalScore = round(
    clamp(cuz.activeCrews * 20 + cuz.mentorProfiles * 25 + cuz.feedPosts * 10, 0, 100),
    2,
  );
  const destructionRecoveryScore = round(clamp(100 - v1.lastDestructionSeverityScore, 0, 100), 2);
  const syncCoverageScore = getSyncCoverageScore(degradedSources.length > 0);

  const readinessInputs = [
    { score: riskBalanceScore, weight: 0.30 },
    { score: clamp(v3.lastReadinessScore, 0, 100), weight: 0.25 },
    { score: communitySignalScore, weight: 0.15 },
    { score: destructionRecoveryScore, weight: 0.15 },
  ];
  if (duelKing.evaluations > 0) {
    readinessInputs.push({ score: duelKingReadinessScore, weight: 0.15 });
  }
  const totalWeight = readinessInputs.reduce((sum, item) => sum + item.weight, 0);
  const readinessScore = round(
    clamp(
      readinessInputs.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight,
      0,
      100,
    ),
    2,
  );

  const degraded = degradedSources.length > 0;
  const status = getStatus(readinessScore, degraded);
  const warnings = degraded
    ? [`KORON overlay entered degraded mode due to: ${degradedSources.join(', ')}`]
    : status === 'WATCH'
      ? ['KORON overlay is active but should be monitored for readiness drift.']
      : [];

  return {
    personaId: EXTRIMLI_KORON_PERSONA_ID,
    contractVersion: EXTRIMLI_KORON_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_KORON_MODULE_VERSION,
    sourceOfTruth: EXTRIMLI_KORON_SOURCE_OF_TRUTH,
    status,
    readinessScore,
    riskBalanceScore,
    communitySignalScore,
    destructionRecoveryScore,
    syncCoverageScore,
    degraded,
    degradedMode: 'partial-payload-no-500',
    degradedSources,
    warnings,
    performanceMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
    surfaces: { v1, v3, duelKing, cuz },
  };
}

export type { ExtrimliKoronHealthReport, ExtrimliKoronStatus } from './types';

export {
  EXTRIMLI_KORON_API_MAX_MS,
  EXTRIMLI_KORON_CONTRACT_VERSION,
  EXTRIMLI_KORON_EVALUATION_MAX_MS,
  EXTRIMLI_KORON_MODULE_VERSION,
  EXTRIMLI_KORON_PERSONA_ID,
  EXTRIMLI_KORON_SOURCE_OF_TRUTH,
} from './types';
