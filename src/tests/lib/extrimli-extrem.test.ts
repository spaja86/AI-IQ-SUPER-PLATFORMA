import {
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
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

  await test('default report normalizes REZOLUCIJA/EKODOR/REKULITI PO RAULETU/DISCAN/KIBEN vocabulary', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.terminology.normalizedVocabulary.REZOLUCIJA.meaning === 'resolution-readiness-dimension', 'REZOLUCIJA meaning mismatch');
    assert(report.terminology.normalizedVocabulary.EKODOR.canonicalField === 'resolutionReadiness.ekodorState', 'EKODOR field mismatch');
    assert(report.terminology.normalizedVocabulary['REKULITI PO RAULETU'].meaning === 'resolution-routing-policy', 'REKULITI meaning mismatch');
    assert(report.terminology.normalizedVocabulary.DISCAN.canonicalField === 'resolutionInput.discanPressurePercent', 'DISCAN field mismatch');
    assert(report.terminology.normalizedVocabulary.KIBEN.canonicalField === 'resolutionReadiness.kibenLane', 'KIBEN field mismatch');
    assert(report.resolutionReadiness.kibenLane === 'KIBEN', 'KIBEN lane mismatch');
    assert(report.resolutionReadiness.rezolucijaScore >= EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY, 'default REZOLUCIJA should be ready');
    assert(report.resolutionReadiness.ekodorState === 'ALIGNED', 'default EKODOR should be aligned');
    assert(report.resolutionReadiness.discanInKibenState === 'CLEAR', 'default DISCAN in KIBEN should be clear');
    assert(report.resolutionReadiness.rekulitiPoRauletu === 'ALLOW', 'default REKULITI policy should allow progression');
  });

  await test('default report confirms canonical ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA formula', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.semaMuSemaFormula.canonicalExpression === EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION, 'canonical formula mismatch');
    assert(report.semaMuSemaFormula.formulaHolds, 'default formula should hold');
    assert(report.semaMuSemaFormula.status === 'PASSED', 'default formula status should be PASSED');
    assert(report.semaMuSemaFormula.inputSubstitutions.length === 0, 'default formula should not use substitutions');
    assert(report.semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_CONFIRMED', 'default MUŠEMA conclusion should be confirmed');
  });

  await test('invalid env values are clamped and flagged as degraded', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '120',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '-20',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: 'Infinity',
      EXTRIMLI_EXTREM_EKODOR_ALIGNMENT_PERCENT: '140',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.degraded, 'report should be degraded for invalid env values');
      assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT')), 'expected scene load degraded source');
      assert(report.profileInput.gpuContentionPercent === 100, 'gpu contention should be clamped to 100');
      assert(report.profileInput.cpuContentionPercent === 0, 'cpu contention should be clamped to 0');
      assert(report.resolutionInput.ekodorAlignmentPercent === 100, 'EKODOR alignment should be clamped to 100');
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

    await test('formula mismatch blocks MUŠEMA governance and WAWE promotion', async () => {
      await withEnv({
        EXTRIMLI_EXTREM_SHEMA_VALUE: '40',
        EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: '20',
        EXTRIMLI_EXTREM_MUSHEMA_VALUE: '70',
      }, () => {
        const report = getExtrimliExtremProfilerReport();
        assert(report.semaMuSemaFormula.formulaHolds === false, 'formula should fail');
        assert(report.semaMuSemaFormula.status === 'BLOCKED', 'formula status should be BLOCKED');
        assert(report.semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_BLOCKED', 'MUŠEMA conclusion should be blocked');
        assert(report.governanceSignal.freezeRequired, 'formula mismatch must freeze WAWE promotion');
        assert(report.governanceSignal.wawePromotionEligible === false, 'WAWE promotion should be blocked');
      });
    });

    await test('NaN/Infinity formula env values stay additive and degrade without payload break', async () => {
      await withEnv({
        EXTRIMLI_EXTREM_SHEMA_VALUE: 'NaN',
        EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: 'Infinity',
        EXTRIMLI_EXTREM_MUSHEMA_VALUE: 'Infinity',
      }, () => {
        const report = getExtrimliExtremProfilerReport();
        assert(report.degraded, 'report should be degraded for invalid formula env values');
        assert(report.semaMuSemaFormula.status === 'BLOCKED', 'fallback substitutions should block deterministic formula gate');
        assert(report.semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_BLOCKED', 'fallback substitutions should block MUŠEMA conclusion');
        assert(report.semaMuSemaFormula.inputSubstitutions.length === 3, 'all formula env values should be recorded as substitutions');
        assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_SHEMA_VALUE')), 'expected invalid ŠEMA source');
        assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_ALL_SHEMA_VALUE')), 'expected invalid ALL ŠEMA source');
        assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_MUSHEMA_VALUE')), 'expected invalid MUŠEMA source');
      });
    });

    await test('out-of-range formula env values are tracked as substitutions and block gate', async () => {
      await withEnv({
        EXTRIMLI_EXTREM_SHEMA_VALUE: '999',
        EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: '999',
        EXTRIMLI_EXTREM_MUSHEMA_VALUE: '9999',
      }, () => {
        const report = getExtrimliExtremProfilerReport();
        assert(report.semaMuSemaFormula.status === 'BLOCKED', 'out-of-range substitutions should block formula gate');
        assert(report.semaMuSemaFormula.inputSubstitutions.length === 3, 'all out-of-range formula inputs should be tracked');
        assert(report.semaMuSemaFormula.blockerReasons.some((reason) => reason.includes('clamped for out-of-range values')), 'out-of-range clamp blocker reason should be present');
        assert(report.governanceSignal.freezeRequired, 'out-of-range substitutions should freeze WAWE promotion');
      });
    });
  });

  await test('DISCAN in KIBEN blocker freezes progression even when DISKVIT conflict is low', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '10',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '10',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '10',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '10',
      EXTRIMLI_EXTREM_REZOLUCIJA_COMPLETENESS_PERCENT: '48',
      EXTRIMLI_EXTREM_EKODOR_ALIGNMENT_PERCENT: '40',
      EXTRIMLI_EXTREM_DISCAN_PRESSURE_PERCENT: '90',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.profile.conflictIntensity === 'LOW', 'expected low DISKVIT conflict');
      assert(report.resolutionReadiness.rezolucijaScore < EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY, 'REZOLUCIJA score should be below ready threshold');
      assert(report.resolutionReadiness.ekodorState !== 'ALIGNED', 'EKODOR should not be aligned');
      assert(report.resolutionReadiness.discanInKibenState === 'BLOCKED', 'DISCAN in KIBEN should block');
      assert(report.resolutionReadiness.rekulitiPoRauletu === 'FREEZE', 'REKULITI policy should freeze');
      assert(report.governanceSignal.freezeRequired, 'resolution blocker should require freeze');
      assert(report.optimization.maximumGraphicsUnlockEligible === false, 'maximum unlock should be blocked');
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
