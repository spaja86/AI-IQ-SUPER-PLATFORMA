import {
  EXTRONDEND_CONTRACT_VERSION,
  EXTRONDEND_MODULE_VERSION,
  EXTRONDEND_PERSONA_ID,
  EXTRONDEND_SOURCE_OF_TRUTH,
  getExtrimliExtrondendReport,
} from '../../lib/extrimli-extrondend';

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

async function runTests(): Promise<void> {
  console.log('\n🔗 [extrimli-extrondend] aggregation contract tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRONDEND_CONTRACT_VERSION === 'v1-extrondend', `unexpected contract: ${EXTRONDEND_CONTRACT_VERSION}`);
    assert(EXTRONDEND_MODULE_VERSION === '1.0.0', `unexpected module: ${EXTRONDEND_MODULE_VERSION}`);
    assert(EXTRONDEND_PERSONA_ID === 'extrimli-extrondend-aggregator', `unexpected persona: ${EXTRONDEND_PERSONA_ID}`);
    assert(EXTRONDEND_SOURCE_OF_TRUTH === '/api/extrimli/extrondend', 'unexpected source of truth');
  });

  await test('report exposes naming lock and integration boundaries', () => {
    const report = getExtrimliExtrondendReport();
    assert(report.integrationBoundaries.aliasesOfExistingSurfaces === false, 'EXTRONDEND must not be alias');
    assert(report.acceptanceCriteria.some((item) => item.id === 'naming-lock' && item.passed), 'naming-lock criterion must pass');
    assert(report.integrationBoundaries.dependsOn.includes('/api/extrimli/extendol'), 'dependsOn should include extendol');
  });

  await test('report includes bounded aggregate metrics', () => {
    const report = getExtrimliExtrondendReport();
    assert(Number.isFinite(report.aggregationScore), 'aggregationScore must be finite');
    assert(report.aggregationScore >= 0 && report.aggregationScore <= 100, 'aggregationScore must be in [0, 100]');
    assert(report.readinessParityScore >= 0 && report.readinessParityScore <= 100, 'readinessParityScore must be in [0, 100]');
    assert(report.weightedSurfaceHealth >= 0 && report.weightedSurfaceHealth <= 100, 'weightedSurfaceHealth must be in [0, 100]');
  });

  await test('report includes required upstream surfaces', () => {
    const report = getExtrimliExtrondendReport();
    assert(report.surfaces.extendol.contractVersion === 'v1', 'extendol contract mismatch');
    assert(report.surfaces.koron.contractVersion === 'v1-koron', 'koron contract mismatch');
    assert(report.surfaces.v1.contractVersion === 'v1', 'v1 contract mismatch');
    assert(report.surfaces.v3.contractVersion === 'v3', 'v3 contract mismatch');
    assert(report.surfaces.cuz.contractVersion === 'v1', 'cuz contract mismatch');
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
