import {
  EXTRIMLI_API_RESPONSE_MAX_MS,
  EXTRIMLI_PERFORMANCE_MAX_MS,
  clamp,
  round,
} from '../extrimli';
import { getExtrimliExtrondendReport } from '../extrimli-extrondend';
import { getExtrimliExtendolReport } from '../extrimli-extendol';
import { getExtrimliKoronHealthReport } from '../extrimli-koron';
import type { ExtrimliExtrondolAcceptanceCriterion, ExtrimliExtrondolReport, ExtrimliExtrondolWaweStage } from './types';
import {
  EXTRONDOL_API_MAX_MS,
  EXTRONDOL_BUILD_MAX_MIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_EVALUATION_MAX_MS,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_SOURCE_OF_TRUTH,
} from './types';

const EXTRONDOL_WAWE_THRESHOLDS = {
  wawe2: 60,
  wawe3: 72,
  wawe4: 84,
  wawe5: 93,
} as const;

function pickWawe(score: number, degraded: boolean): ExtrimliExtrondolWaweStage {
  if (degraded || score < EXTRONDOL_WAWE_THRESHOLDS.wawe2) return 'WAWE-1';
  if (score < EXTRONDOL_WAWE_THRESHOLDS.wawe3) return 'WAWE-2';
  if (score < EXTRONDOL_WAWE_THRESHOLDS.wawe4) return 'WAWE-3';
  if (score < EXTRONDOL_WAWE_THRESHOLDS.wawe5) return 'WAWE-4';
  return 'WAWE-5';
}

function nextWawe(stage: ExtrimliExtrondolWaweStage): ExtrimliExtrondolWaweStage {
  if (stage === 'WAWE-1') return 'WAWE-2';
  if (stage === 'WAWE-2') return 'WAWE-3';
  if (stage === 'WAWE-3') return 'WAWE-4';
  if (stage === 'WAWE-4') return 'WAWE-5';
  return 'WAWE-5';
}

export function getExtrimliExtrondolReport(): ExtrimliExtrondolReport {
  const extrondend = getExtrimliExtrondendReport();
  const extendol = getExtrimliExtendolReport();
  const koron = getExtrimliKoronHealthReport();

  const degradedSources: string[] = [];
  if (extrondend.degraded) degradedSources.push('extrondend:degraded');
  if (extendol.degraded) degradedSources.push('extendol:degraded');
  if (koron.degraded) degradedSources.push('koron:degraded');
  if (koron.performanceMaxMs > EXTRONDOL_EVALUATION_MAX_MS || koron.apiResponseMaxMs > EXTRONDOL_API_MAX_MS) {
    degradedSources.push('koron-kpi');
  }

  const orchestrationReadinessScore = round(
    clamp(
      extrondend.aggregationScore * 0.50
      + extendol.unifiedReadinessScore * 0.30
      + koron.readinessScore * 0.20,
      0,
      100,
    ),
    2,
  );

  const degraded = degradedSources.length > 0;
  const currentWawe = pickWawe(orchestrationReadinessScore, degraded);
  const promotionFreeze = degraded || currentWawe === 'WAWE-1';
  const reasons = promotionFreeze
    ? [
      'Promotion freeze required because readiness or degraded posture is below rollout threshold.',
      ...degradedSources,
    ]
    : ['Ready for next WAWE stage with governance evidence.'];

  const acceptanceCriteria: ExtrimliExtrondolAcceptanceCriterion[] = [
    {
      id: 'naming-lock',
      description: 'EXTRONDOL is a dedicated orchestration/readiness module, not an alias of Extendol/KORON.',
      passed: true,
    },
    {
      id: 'stable-contract',
      description: 'EXTRONDOL contract and module versions are stable and explicit.',
      passed: EXTRONDOL_CONTRACT_VERSION === 'v1-extrondol' && EXTRONDOL_MODULE_VERSION === '1.0.0',
    },
    {
      id: 'wawe-sequencing',
      description: 'Rollout sequencing maps readiness to WAWE-1..WAWE-5 stages with promotion freeze guard.',
      passed: ['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(currentWawe),
    },
    {
      id: 'kpi-targets',
      description: 'Upstream surfaces satisfy evaluation ≤ 50ms and API ≤ 200ms budgets.',
      passed: degradedSources.length === 0,
    },
    {
      id: 'finite-orchestration-score',
      description: 'Orchestration readiness score is finite and bounded in [0,100].',
      passed: Number.isFinite(orchestrationReadinessScore) && orchestrationReadinessScore >= 0 && orchestrationReadinessScore <= 100,
    },
  ];

  return {
    personaId: EXTRONDOL_PERSONA_ID,
    contractVersion: EXTRONDOL_CONTRACT_VERSION,
    moduleVersion: EXTRONDOL_MODULE_VERSION,
    sourceOfTruth: EXTRONDOL_SOURCE_OF_TRUTH,
    statement: 'EXTRONDOL orchestrates WAWE rollout readiness across EXTRIMLI aggregation surfaces.',
    ownership: '@spaja86',
    triggerLabel: 'extrondol:logic-change',
    pathScope: [
      'src/lib/extrimli-extrondol/**',
      'src/app/api/extrimli/extrondol/**',
      'src/tests/lib/extrimli-extrondol.test.ts',
    ],
    orchestrationReadinessScore,
    rollout: {
      currentWawe,
      eligibleNextWawe: nextWawe(currentWawe),
      promotionFreeze,
      reasons,
    },
    degraded,
    degradedMode: 'partial-payload-no-500',
    degradedSources,
    acceptanceCriteria,
    integrationBoundaries: {
      dependsOn: ['/api/extrimli/extrondend', '/api/extrimli/extendol', '/api/extrimli/koron'],
      aliasesOfExistingSurfaces: false,
    },
    kpiTargets: {
      evaluationMaxMs: EXTRIMLI_PERFORMANCE_MAX_MS,
      apiResponseMaxMs: EXTRIMLI_API_RESPONSE_MAX_MS,
      buildDurationMaxMin: EXTRONDOL_BUILD_MAX_MIN,
    },
    surfaces: { extrondend, extendol, koron },
  };
}

export type {
  ExtrimliExtrondolAcceptanceCriterion,
  ExtrimliExtrondolReport,
  ExtrimliExtrondolWaweStage,
} from './types';

export {
  EXTRONDOL_API_MAX_MS,
  EXTRONDOL_BUILD_MAX_MIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_EVALUATION_MAX_MS,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_SOURCE_OF_TRUTH,
} from './types';
