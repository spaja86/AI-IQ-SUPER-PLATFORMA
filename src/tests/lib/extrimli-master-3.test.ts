import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_MODULE_VERSION,
  getExtrimliHealthReport,
} from '../../lib/extrimli';
import {
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  getExtrimliExtremProfilerReport,
} from '../../lib/extrimli-extrem';
import {
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_MODULE_VERSION,
  getExtrimliExtrondolReport,
} from '../../lib/extrimli-extrondol';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function isWaweStage(value: string): boolean {
  return ['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(value);
}

function nextWawe(stage: string): string {
  if (stage === 'WAWE-1') return 'WAWE-2';
  if (stage === 'WAWE-2') return 'WAWE-3';
  if (stage === 'WAWE-3') return 'WAWE-4';
  if (stage === 'WAWE-4') return 'WAWE-5';
  return 'WAWE-5';
}

async function withEnv(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<void> | void,
): Promise<void> {
  const previousValues: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(overrides)) {
    previousValues[key] = process.env[key];
    if (typeof value === 'undefined') delete process.env[key];
    else process.env[key] = value;
  }
  try {
    await fn();
  } finally {
    for (const [key, value] of Object.entries(previousValues)) {
      if (typeof value === 'undefined') delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function runTests(): Promise<void> {
  console.log('\n🧭 [extrimli-master-3] coordinated release matrix tests\n');

  await test('MASTER 3 keeps coordinated release scope across EXTRIMLI, EXTREM, EXTRONDOL', () => {
    const health = getExtrimliHealthReport();
    const extrem = getExtrimliExtremProfilerReport();
    const extrondol = getExtrimliExtrondolReport();

    assert(health.contractVersion === EXTRIMLI_CONTRACT_VERSION, `unexpected EXTRIMLI contract: ${health.contractVersion}`);
    assert(health.moduleVersion === EXTRIMLI_MODULE_VERSION, `unexpected EXTRIMLI module: ${health.moduleVersion}`);
    assert(extrem.contractVersion === EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION, `unexpected EXTREM contract: ${extrem.contractVersion}`);
    assert(extrem.moduleVersion === EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION, `unexpected EXTREM module: ${extrem.moduleVersion}`);
    assert(extrondol.contractVersion === EXTRONDOL_CONTRACT_VERSION, `unexpected EXTRONDOL contract: ${extrondol.contractVersion}`);
    assert(extrondol.moduleVersion === EXTRONDOL_MODULE_VERSION, `unexpected EXTRONDOL module: ${extrondol.moduleVersion}`);

    assert(health.performanceMaxMs === 50, 'EXTRIMLI evaluation KPI target must remain 50ms');
    assert(health.apiResponseMaxMs === 200, 'EXTRIMLI API KPI target must remain 200ms');
    assert(extrem.sourceOfTruth === '/api/extrimli/extrem', 'EXTREM source-of-truth endpoint must remain stable');
    assert(extrondol.sourceOfTruth === '/api/extrimli/extrondol', 'EXTRONDOL source-of-truth endpoint must remain stable');
    assert(extrondol.surfaces.extremProfiler.sourceOfTruth === '/api/extrimli/extrem', 'EXTRONDOL must consume EXTREM profiler surface');
  });

  await test('MASTER 3 preserves WAWE sequencing and mandatory release audit summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(isWaweStage(report.rollout.currentWawe), 'current WAWE stage must be valid');
    assert(isWaweStage(report.rollout.eligibleNextWawe), 'eligible next WAWE stage must be valid');
    assert(report.rollout.eligibleNextWawe === nextWawe(report.rollout.currentWawe), 'eligible next WAWE must match deterministic progression');
    assert(report.releaseAuditSummary.required, 'releaseAuditSummary must be required');
    assert(report.releaseAuditSummary.rolloutSnapshot.currentWawe === report.rollout.currentWawe, 'releaseAuditSummary current WAWE mismatch');
    assert(report.releaseAuditSummary.rolloutSnapshot.eligibleNextWawe === report.rollout.eligibleNextWawe, 'releaseAuditSummary next WAWE mismatch');
    assert(report.releaseAuditSummary.rolloutSnapshot.promotionFreeze === report.rollout.promotionFreeze, 'releaseAuditSummary freeze mismatch');
    assert(report.releaseAuditSummary.humanReviewRequired, 'releaseAuditSummary must require human review');
    assert(report.releaseAuditSummary.rollbackPlanRequired, 'releaseAuditSummary must require rollback plan');
  });

  await test('MASTER 3 blocks rollout when B2B hard gates are unresolved', () => {
    const report = getExtrimliExtrondolReport({
      auditTrailComplete: true,
      downstreamSyncComplete: false,
      humanReviewComplete: false,
      onboardingComplete: false,
    });
    assert(report.rollout.promotionFreeze, 'promotionFreeze must be true when governance evidence is unresolved');
    assert(report.b2bReadiness.compliance.blockers.includes('onboarding-complete'), 'onboarding blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('downstream-sync-complete'), 'downstream sync blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('human-review-complete'), 'human review blocker must be present');
    assert(report.releaseAuditSummary.status === 'BLOCKED', 'releaseAuditSummary must be blocked while hard gates are unresolved');
  });

  await test('MASTER 3 verification matrix enforces bounded contract integrity and degraded behavior', () => {
    const extrem = getExtrimliExtremProfilerReport();
    const extrondol = getExtrimliExtrondolReport();

    assert(extrem.degradedMode === 'partial-payload-no-500', 'EXTREM degraded mode mismatch');
    assert(extrondol.degradedMode === 'partial-payload-no-500', 'EXTRONDOL degraded mode mismatch');
    assert(Number.isFinite(extrem.profile.conflictScore) && extrem.profile.conflictScore >= 0 && extrem.profile.conflictScore <= 100, 'EXTREM conflict score must be bounded');
    assert(Number.isFinite(extrondol.orchestrationReadinessScore) && extrondol.orchestrationReadinessScore >= 0 && extrondol.orchestrationReadinessScore <= 100, 'EXTRONDOL orchestration score must be bounded');
    assert(extrondol.kpiTargets.evaluationMaxMs === 50, 'EXTRONDOL evaluation KPI target mismatch');
    assert(extrondol.kpiTargets.apiResponseMaxMs === 200, 'EXTRONDOL API KPI target mismatch');
    assert(extrondol.kpiTargets.buildDurationMaxMin === 3, 'EXTRONDOL build KPI target mismatch');
    assert(extrondol.acceptanceCriteria.some((item) => item.id === 'release-governance-audit-summary' && item.passed), 'release governance audit acceptance criterion must pass');
    assert(extrondol.acceptanceCriteria.some((item) => item.id === 'diskvit-conflict-governance' && item.passed), 'EXTREM governance acceptance criterion must pass');
  });

  await test('MASTER 3 freezes promotion under extreme DISKVIT conflict pressure', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '100',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '100',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '100',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '500',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
      });
      assert(report.extremProfiler.governanceSignal.freezeRequired, 'EXTREM governance should require freeze under severe conflict');
      assert(report.rollout.promotionFreeze, 'EXTRONDOL must propagate EXTREM freeze into rollout');
      assert(report.releaseAuditSummary.status === 'BLOCKED', 'release audit must be blocked under EXTREM freeze');
    });
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
