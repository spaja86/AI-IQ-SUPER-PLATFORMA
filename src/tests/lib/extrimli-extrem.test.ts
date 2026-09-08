import {
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  getExtrimliExtremProfilerReport,
} from '../../lib/extrimli-extrem';

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

async function withEnv(overrides: Record<string, string | undefined>, fn: () => Promise<void> | void): Promise<void> {
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
  console.log('\n🔗 [extrimli-extrem] profiler contract tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION === 'v1-extrem-profiler', `unexpected contract: ${EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION}`);
    assert(EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION === '1.0.0', `unexpected module: ${EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION}`);
    assert(EXTRIMLI_EXTREM_PROFILER_PERSONA_ID === 'extrimli-extrem-profiler-core', `unexpected persona: ${EXTRIMLI_EXTREM_PROFILER_PERSONA_ID}`);
    assert(EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH === '/api/extrimli/extrem', `unexpected source: ${EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH}`);
  });

  await test('default report exposes DISKVIT terminology and bounded conflict score', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.terminology.diskvitRole === 'browser-graphics-bottleneck-layer', 'DISKVIT role mismatch');
    assert(report.terminology.conflictModel === 'conflict-proportional', 'conflict model mismatch');
    assert(report.profile.bottleneckLayer === 'DISKVIT', 'bottleneck layer mismatch');
    assert(Number.isFinite(report.profile.conflictScore), 'conflict score must be finite');
    assert(report.profile.conflictScore >= 0 && report.profile.conflictScore <= 100, 'conflict score must be in [0,100]');
    assert(report.kpiObserved.withinTargets, 'default profile should be within KPI targets');
    assert(report.governanceSignal.freezeRequired === false, 'default profile should not freeze WAWE promotion');
  });

  await test('invalid env values are clamped and flagged as degraded', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '120',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '-20',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: 'Infinity',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.degraded, 'report should be degraded for invalid env values');
      assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT')), 'expected scene load degraded source');
      assert(report.profileInput.gpuContentionPercent === 100, 'gpu contention should be clamped to 100');
      assert(report.profileInput.cpuContentionPercent === 0, 'cpu contention should be clamped to 0');
    });
  });

  await test('high conflict profile triggers freeze and aggressive optimization', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '98',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '95',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '94',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '160',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(['HIGH', 'CRITICAL'].includes(report.profile.conflictIntensity), 'expected high or critical conflict intensity');
      assert(report.profile.optimizationTier === 'EXTREME_PROFILING_REQUIRED', 'expected extreme profiling tier');
      assert(report.governanceSignal.freezeRequired, 'freeze should be required for extreme conflict');
      assert(report.governanceSignal.wawePromotionEligible === false, 'WAWE promotion should be blocked for extreme conflict');
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
