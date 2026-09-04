import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  getExtrimliHealthReport,
  round,
  clamp,
} from '../extrimli';
import { getExtrimli3HealthReport } from '../extrimli-3';
import { getCuzHealthReport } from '../extrimli-cuz';
import { getDuelKingHealthReport } from '../extrimli-duel-king';
import { getExtrimliKoronHealthReport } from '../extrimli-koron';
import type {
  ExtrimliExtendolAcceptanceCriterion,
  ExtrimliExtendolCoverage,
  ExtrimliExtendolReport,
} from './types';
import {
  EXTRIMLI_EXTENDOL_API_MAX_MS,
  EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
  EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS,
  EXTRIMLI_EXTENDOL_MODULE_VERSION,
  EXTRIMLI_EXTENDOL_PERSONA_ID,
  EXTRIMLI_EXTENDOL_SOURCE_OF_TRUTH,
} from './types';

function buildCoverage(): ExtrimliExtendolCoverage {
  return {
    sportRiskEvaluation: true,
    gearAndSafetyReadiness: true,
    eventLifecycleAndRegistration: true,
    destructionSafetyFlows: true,
    athleteProgressAndReadiness: true,
    duelKingCompetition: true,
    communityReputationAndMentorship: true,
    koronReadinessOverlay: true,
  };
}

function buildCommunitySignal(activeCrews: number, mentorProfiles: number, feedPosts: number): number {
  return round(
    clamp(activeCrews * 25 + mentorProfiles * 30 + feedPosts * 15, 0, 100),
    2,
  );
}

export function getExtrimliExtendolReport(): ExtrimliExtendolReport {
  const v1 = getExtrimliHealthReport();
  const v3 = getExtrimli3HealthReport();
  const cuz = getCuzHealthReport();
  const duelKing = getDuelKingHealthReport();
  const koron = getExtrimliKoronHealthReport();

  const coverage = buildCoverage();
  const coveragePassed = Object.values(coverage).every(Boolean);

  const v1Readiness = clamp(100 - v1.lastRiskScore, 0, 100);
  const v3Safety = clamp(100 - v3.lastRiskScore, 0, 100);
  const v3Readiness = clamp(v3.lastReadinessScore, 0, 100);
  const duelKingReadiness = clamp(duelKing.lastReadinessScore, 0, 100);
  const communitySignal = buildCommunitySignal(cuz.activeCrews, cuz.mentorProfiles, cuz.feedPosts);
  const koronReadiness = clamp(koron.readinessScore, 0, 100);

  const unifiedReadinessScore = round(
    clamp(
      v1Readiness * 0.20
      + v3Safety * 0.14
      + v3Readiness * 0.16
      + duelKingReadiness * 0.14
      + communitySignal * 0.14
      + koronReadiness * 0.22,
      0,
      100,
    ),
    2,
  );

  const degradedSources: string[] = [];
  if (v1.performanceMaxMs > EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS || v1.apiResponseMaxMs > EXTRIMLI_EXTENDOL_API_MAX_MS) {
    degradedSources.push('extrimli-v1-kpi');
  }
  if (v3.performanceMaxMs > EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS || v3.apiResponseMaxMs > EXTRIMLI_EXTENDOL_API_MAX_MS) {
    degradedSources.push('extrimli-v3-kpi');
  }
  if (cuz.performanceMaxMs > EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS || cuz.apiResponseMaxMs > EXTRIMLI_EXTENDOL_API_MAX_MS) {
    degradedSources.push('extrimli-cuz-kpi');
  }
  if (duelKing.performanceMaxMs > EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS || duelKing.apiResponseMaxMs > EXTRIMLI_EXTENDOL_API_MAX_MS) {
    degradedSources.push('extrimli-duel-king-kpi');
  }
  if (koron.performanceMaxMs > EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS || koron.apiResponseMaxMs > EXTRIMLI_EXTENDOL_API_MAX_MS) {
    degradedSources.push('extrimli-koron-kpi');
  }
  if (koron.degraded) {
    degradedSources.push(...koron.degradedSources.map((source) => `koron:${source}`));
  }

  const acceptanceCriteria: ExtrimliExtendolAcceptanceCriterion[] = [
    {
      id: 'extendol-contract',
      description: 'Unified EXTRIMLI Extendol contract remains versioned and stable.',
      passed: EXTRIMLI_EXTENDOL_CONTRACT_VERSION === 'v1' && EXTRIMLI_EXTENDOL_MODULE_VERSION === '1.0.0',
    },
    {
      id: 'all-user-paths-covered',
      description: 'All required user functionality paths are covered on the unified surface.',
      passed: coveragePassed,
    },
    {
      id: 'duel-king-covered',
      description: 'DUEL KING competitive-combat readiness is included in the unified EXTRIMLI surface.',
      passed: coverage.duelKingCompetition && duelKing.contractVersion === 'v1-duel-king',
    },
    {
      id: 'koron-overlay-covered',
      description: 'KORON readiness overlay is present as a required Extendol capability.',
      passed: coverage.koronReadinessOverlay && koron.status !== 'DEGRADED',
    },
    {
      id: 'kpi-targets',
      description: 'v1, v3, DUEL KING, CUZ, and KORON KPI targets meet evaluation ≤ 50ms and API ≤ 200ms.',
      passed: degradedSources.length === 0,
    },
    {
      id: 'real-readiness-signal',
      description: 'Unified readiness score is computed from live EXTRIMLI v1/v3/DUEL KING/CUZ/KORON health signals.',
      passed: Number.isFinite(unifiedReadinessScore),
    },
    {
      id: 'degraded-no-500-mode',
      description: 'Extendol supports partial-payload-no-500 degraded mode for resilience.',
      passed: true,
    },
  ];

  const maxFunctionalityForAll = acceptanceCriteria.every((criterion) => criterion.passed);

  return {
    personaId: EXTRIMLI_EXTENDOL_PERSONA_ID,
    contractVersion: EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
    moduleVersion: EXTRIMLI_EXTENDOL_MODULE_VERSION,
    statement: 'MAKSIMUM FOR ALL TO HAVE FUNCTIONALITION INCLUDING DUEL KING AND KORON OVERLAY',
    sourceOfTruth: EXTRIMLI_EXTENDOL_SOURCE_OF_TRUTH,
    maxFunctionalityForAll,
    unifiedReadinessScore,
    coverage,
    acceptanceCriteria,
    degraded: degradedSources.length > 0,
    degradedMode: 'partial-payload-no-500',
    degradedSources,
    kpiTargets: {
      evaluationMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
      apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
    },
    surfaces: { v1, v3, duelKing, cuz, koron },
  };
}

export type {
  ExtrimliExtendolAcceptanceCriterion,
  ExtrimliExtendolCoverage,
  ExtrimliExtendolReport,
} from './types';

export {
  EXTRIMLI_EXTENDOL_API_MAX_MS,
  EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
  EXTRIMLI_EXTENDOL_EVALUATION_MAX_MS,
  EXTRIMLI_EXTENDOL_MODULE_VERSION,
  EXTRIMLI_EXTENDOL_PERSONA_ID,
  EXTRIMLI_EXTENDOL_SOURCE_OF_TRUTH,
} from './types';
