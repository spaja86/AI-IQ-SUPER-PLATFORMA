import {
  EXTRIMLI_KORON_CONTRACT_VERSION,
  EXTRIMLI_KORON_MODULE_VERSION,
  EXTRIMLI_KORON_PERSONA_ID,
  EXTRIMLI_KORON_SOURCE_OF_TRUTH,
  getExtrimliKoronHealthReport,
} from '../../lib/extrimli-koron';

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
  console.log('\n👑 [extrimli-koron] readiness overlay tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRIMLI_KORON_CONTRACT_VERSION === 'v1-koron', `unexpected contract: ${EXTRIMLI_KORON_CONTRACT_VERSION}`);
    assert(EXTRIMLI_KORON_MODULE_VERSION === '1.0.0', `unexpected module: ${EXTRIMLI_KORON_MODULE_VERSION}`);
    assert(EXTRIMLI_KORON_PERSONA_ID === 'extrimli-koron-overlay', `unexpected persona: ${EXTRIMLI_KORON_PERSONA_ID}`);
    assert(EXTRIMLI_KORON_SOURCE_OF_TRUTH === '/api/extrimli/koron', `unexpected source: ${EXTRIMLI_KORON_SOURCE_OF_TRUTH}`);
  });

  await test('health report exposes bounded readiness signals', () => {
    const report = getExtrimliKoronHealthReport();
    assert(report.readinessScore >= 0 && report.readinessScore <= 100, 'readiness score must be in range');
    assert(report.riskBalanceScore >= 0 && report.riskBalanceScore <= 100, 'risk balance score must be in range');
    assert(report.communitySignalScore >= 0 && report.communitySignalScore <= 100, 'community signal score must be in range');
    assert(report.destructionRecoveryScore >= 0 && report.destructionRecoveryScore <= 100, 'destruction recovery score must be in range');
    assert(report.syncCoverageScore >= 0 && report.syncCoverageScore <= 100, 'sync coverage score must be in range');
  });

  await test('health report includes upstream EXTRIMLI surfaces', () => {
    const report = getExtrimliKoronHealthReport();
    assert(report.surfaces.v1.contractVersion === 'v1', 'expected v1 surface');
    assert(report.surfaces.v3.contractVersion === 'v3', 'expected v3 surface');
    assert(report.surfaces.cuz.contractVersion === 'v1', 'expected CUZ surface');
  });

  await test('health report exposes deterministic status and degraded policy', () => {
    const report = getExtrimliKoronHealthReport();
    assert(['ACTIVE', 'WATCH', 'DEGRADED'].includes(report.status), 'invalid status');
    assert(report.degradedMode === 'partial-payload-no-500', 'unexpected degraded mode');
    assert(Array.isArray(report.degradedSources), 'degradedSources must be an array');
    assert(Array.isArray(report.warnings), 'warnings must be an array');
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
