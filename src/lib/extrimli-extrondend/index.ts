import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  getExtrimliAggregateSignals,
  getExtrimliHealthReport,
  round,
} from '../extrimli';
import { getExtrimli3HealthReport } from '../extrimli-3';
import { getCuzHealthReport } from '../extrimli-cuz';
import { getDuelKingHealthReport } from '../extrimli-duel-king';
import { getExtrimliExtendolReport } from '../extrimli-extendol';
import { getExtrimliKoronHealthReport } from '../extrimli-koron';
import type { ExtrimliExtrondendAcceptanceCriterion, ExtrimliExtrondendReport } from './types';
import {
  EXTRONDEND_API_MAX_MS,
  EXTRONDEND_CONTRACT_VERSION,
  EXTRONDEND_EVALUATION_MAX_MS,
  EXTRONDEND_MODULE_VERSION,
  EXTRONDEND_PERSONA_ID,
  EXTRONDEND_SOURCE_OF_TRUTH,
} from './types';

const EXTRONDEND_WEIGHTS = {
  v1Safety: 0.18,
  v3Readiness: 0.17,
  duelKingReadiness: 0.15,
  extendolReadiness: 0.28,
  koronReadiness: 0.22,
  weightedSurfaceShare: 0.75,
  parityShare: 0.25,
} as const;

export function getExtrimliExtrondendReport(): ExtrimliExtrondendReport {
  const v1 = getExtrimliHealthReport();
  const v1Signals = getExtrimliAggregateSignals();
  const v3 = getExtrimli3HealthReport();
  const cuz = getCuzHealthReport();
  const duelKing = getDuelKingHealthReport();
  const extendol = getExtrimliExtendolReport();
  const koron = getExtrimliKoronHealthReport();

  const degradedSources: string[] = [];
  if (extendol.degraded) degradedSources.push('extendol:degraded');
  if (koron.degraded) degradedSources.push('koron:degraded');
  if (v1.performanceMaxMs > EXTRONDEND_EVALUATION_MAX_MS || v1.apiResponseMaxMs > EXTRONDEND_API_MAX_MS) {
    degradedSources.push('extrimli-v1-kpi');
  }
  if (v3.performanceMaxMs > EXTRONDEND_EVALUATION_MAX_MS || v3.apiResponseMaxMs > EXTRONDEND_API_MAX_MS) {
    degradedSources.push('extrimli-v3-kpi');
  }
  if (cuz.performanceMaxMs > EXTRONDEND_EVALUATION_MAX_MS || cuz.apiResponseMaxMs > EXTRONDEND_API_MAX_MS) {
    degradedSources.push('extrimli-cuz-kpi');
  }
  if (duelKing.performanceMaxMs > EXTRONDEND_EVALUATION_MAX_MS || duelKing.apiResponseMaxMs > EXTRONDEND_API_MAX_MS) {
    degradedSources.push('extrimli-duel-king-kpi');
  }
  if (duelKing.kurTelemetryStatus === 'LIVE' && duelKing.lastKurSignalStatus === 'DEGRADED') {
    degradedSources.push('extrimli-duel-king-kur-signal');
  }

  const v1Safety = clamp(v1Signals.safetySignal, 0, 100);
  const v3Readiness = clamp(v3.lastReadinessScore, 0, 100);
  const duelKingReadiness = clamp(duelKing.lastReadinessScore, 0, 100);
  const duelKingKurReadiness = clamp(duelKing.lastKurProgressionSignal, 0, 100);
  const duelKingCompositeReadiness = duelKing.kurTelemetryStatus === 'LIVE' && duelKing.lastKurSignalStatus === 'LIVE'
    ? round(clamp(duelKingReadiness * 0.8 + duelKingKurReadiness * 0.2, 0, 100), 2)
    : duelKingReadiness;
  const duelKingLive = duelKing.telemetryStatus === 'LIVE';
  const baselineWeightedSurfaceHealth = (
    v1Safety * 0.20
    + v3Readiness * 0.20
    + extendol.unifiedReadinessScore * 0.35
    + koron.readinessScore * 0.25
  );
  const weightedSurfaceHealth = round(
    clamp(
      duelKingLive
        ? (
          v1Safety * EXTRONDEND_WEIGHTS.v1Safety
          + v3Readiness * EXTRONDEND_WEIGHTS.v3Readiness
          + duelKingCompositeReadiness * EXTRONDEND_WEIGHTS.duelKingReadiness
          + extendol.unifiedReadinessScore * EXTRONDEND_WEIGHTS.extendolReadiness
          + koron.readinessScore * EXTRONDEND_WEIGHTS.koronReadiness
        )
        : baselineWeightedSurfaceHealth,
      0,
      100,
    ),
    2,
  );

  const readinessParityScore = round(
    clamp(100 - Math.abs(extendol.unifiedReadinessScore - koron.readinessScore), 0, 100),
    2,
  );

  const aggregationScore = round(
    clamp(weightedSurfaceHealth * EXTRONDEND_WEIGHTS.weightedSurfaceShare + readinessParityScore * EXTRONDEND_WEIGHTS.parityShare, 0, 100),
    2,
  );

  const acceptanceCriteria: ExtrimliExtrondendAcceptanceCriterion[] = [
    {
      id: 'naming-lock',
      description: 'EXTRONDEND is a dedicated aggregation module, not an alias of Extendol/KORON.',
      passed: true,
    },
    {
      id: 'stable-contract',
      description: 'Contract and module versions are stable and explicitly versioned.',
      passed: EXTRONDEND_CONTRACT_VERSION === 'v1-extrondend' && EXTRONDEND_MODULE_VERSION === '1.0.0',
    },
    {
      id: 'integration-boundary',
      description: 'Aggregation depends on v1, v3, DUEL KING, CUZ, Extendol and KORON without mutating those contracts.',
      passed: Boolean(extendol.contractVersion && koron.contractVersion && v1.contractVersion && v3.contractVersion && duelKing.contractVersion && cuz.contractVersion && v1Signals.sourceOfTruth === '/api/extrimli/health'),
    },
    {
      id: 'kpi-targets',
      description: 'All dependent surfaces satisfy evaluation ≤ 50ms and API ≤ 200ms budgets.',
      passed: degradedSources.length === 0,
    },
    {
      id: 'finite-aggregation-score',
      description: 'Aggregation score is finite and bounded in [0,100].',
      passed: Number.isFinite(aggregationScore) && aggregationScore >= 0 && aggregationScore <= 100,
    },
  ];

  return {
    personaId: EXTRONDEND_PERSONA_ID,
    contractVersion: EXTRONDEND_CONTRACT_VERSION,
    moduleVersion: EXTRONDEND_MODULE_VERSION,
    sourceOfTruth: EXTRONDEND_SOURCE_OF_TRUTH,
    statement: 'EXTRONDEND provides cross-surface EXTRIMLI aggregation and score locking.',
    ownership: '@spaja86',
    triggerLabel: 'extrondend:logic-change',
    pathScope: [
      'src/lib/extrimli-extrondend/**',
      'src/app/api/extrimli/extrondend/**',
      'src/tests/lib/extrimli-extrondend.test.ts',
    ],
    aggregationScore,
    readinessParityScore,
    weightedSurfaceHealth,
    degraded: degradedSources.length > 0,
    degradedMode: 'partial-payload-no-500',
    degradedSources,
    acceptanceCriteria,
    integrationBoundaries: {
      dependsOn: ['/api/extrimli/health', '/api/extrimli/duel-king', '/api/extrimli/extendol', '/api/extrimli/koron', '/api/extrimli-3/health', '/api/extrimli-cuz/health'],
      aliasesOfExistingSurfaces: false,
    },
    kpiTargets: {
      evaluationMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
      apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
    },
    surfaces: { v1, v3, duelKing, cuz, extendol, koron },
  };
}

export type { ExtrimliExtrondendAcceptanceCriterion, ExtrimliExtrondendReport } from './types';

export {
  EXTRONDEND_API_MAX_MS,
  EXTRONDEND_CONTRACT_VERSION,
  EXTRONDEND_EVALUATION_MAX_MS,
  EXTRONDEND_MODULE_VERSION,
  EXTRONDEND_PERSONA_ID,
  EXTRONDEND_SOURCE_OF_TRUTH,
} from './types';
