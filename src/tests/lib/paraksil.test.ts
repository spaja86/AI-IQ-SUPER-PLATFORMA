// SpajaUltraOmegaCore -∞Ω+∞ — PARAKSIL Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetParaksilMetrics,
  evaluateParaksil,
  getParaksilHealthReport,
  PARAKSIL_CONTRACT_VERSION,
  PARAKSIL_COVERAGE_TARGET_PCT,
  PARAKSIL_LATENCY_BUDGET_MS,
  PARAKSIL_PERFORMANCE_MAX_MS,
  PARAKSIL_PERSONA_ID,
} from '../../lib/paraksil';

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
  _resetParaksilMetrics();

  console.log('\n🔎 [paraksil] constants');

  await test('contract version is non-empty', () => {
    assert(PARAKSIL_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(PARAKSIL_PERSONA_ID === 'paraksil-validator-core', `unexpected persona id: ${PARAKSIL_PERSONA_ID}`);
  });

  await test('coverage target is stable', () => {
    assert(PARAKSIL_COVERAGE_TARGET_PCT === 80, `expected 80, got ${PARAKSIL_COVERAGE_TARGET_PCT}`);
  });

  await test('suite latency budgets are stable', () => {
    assert(PARAKSIL_LATENCY_BUDGET_MS.UNIT === 50, 'UNIT budget mismatch');
    assert(PARAKSIL_LATENCY_BUDGET_MS.API === 200, 'API budget mismatch');
    assert(PARAKSIL_LATENCY_BUDGET_MS.INTEGRATION === 300, 'INTEGRATION budget mismatch');
    assert(PARAKSIL_LATENCY_BUDGET_MS.FULL === 500, 'FULL budget mismatch');
  });

  console.log('\n🔎 [paraksil] engine');

  await test('returns READY for a healthy module test run', () => {
    const result = evaluateParaksil({
      referenceId: 'ready-run',
      target: {
        moduleId: 'trenazer',
        moduleVersion: '1.0.0',
        suite: 'UNIT',
      },
      metrics: {
        totalChecks: 20,
        passedChecks: 20,
        failedChecks: 0,
        avgLatencyMs: 22,
        errorRatePct: 0,
        coveragePct: 98,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'READY', `expected READY, got ${result.status}`);
    assert(result.withinLatencyBudget, 'latency budget should pass');
    assert(result.passRate === 100, `expected 100, got ${result.passRate}`);
    assert(result.validationScore >= 95, `expected score >= 95, got ${result.validationScore}`);
  });

  await test('returns NEEDS_REVIEW for soft validation drift', () => {
    const result = evaluateParaksil({
      target: {
        moduleId: 'discount-telecom',
        suite: 'API',
      },
      metrics: {
        totalChecks: 100,
        passedChecks: 96,
        failedChecks: 4,
        avgLatencyMs: 240,
        errorRatePct: 4,
        coveragePct: 78,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'NEEDS_REVIEW', `expected NEEDS_REVIEW, got ${result.status}`);
    assert(result.warnings.some((warning) => warning.includes('coverage')), 'coverage warning missing');
    assert(result.warnings.some((warning) => warning.includes('latency')), 'latency warning missing');
    assert(result.warnings.some((warning) => warning.includes('failed checks')), 'failed checks warning missing');
  });

  await test('returns BLOCKED for severe validation failures', () => {
    const result = evaluateParaksil({
      target: {
        moduleId: 'critical-module',
        suite: 'FULL',
      },
      metrics: {
        totalChecks: 50,
        passedChecks: 30,
        failedChecks: 20,
        avgLatencyMs: 1300,
        errorRatePct: 25,
        coveragePct: 42,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'BLOCKED', `expected BLOCKED, got ${result.status}`);
    assert(result.warnings.some((warning) => warning.includes('blocked')), 'blocked warning missing');
  });

  await test('NaN metric is invalid', () => {
    const result = evaluateParaksil({
      target: {
        moduleId: 'nan-module',
        suite: 'UNIT',
      },
      metrics: {
        totalChecks: Number.NaN,
        passedChecks: 1,
        failedChecks: 0,
        avgLatencyMs: 10,
        errorRatePct: 0,
        coveragePct: 100,
      },
    });

    assert(!result.valid, 'NaN metric must be invalid');
  });

  await test('Infinity metric is invalid', () => {
    const result = evaluateParaksil({
      target: {
        moduleId: 'infinity-module',
        suite: 'UNIT',
      },
      metrics: {
        totalChecks: 10,
        passedChecks: 10,
        failedChecks: 0,
        avgLatencyMs: Number.POSITIVE_INFINITY,
        errorRatePct: 0,
        coveragePct: 100,
      },
    });

    assert(!result.valid, 'Infinity metric must be invalid');
  });

  await test('negative metric is invalid', () => {
    const result = evaluateParaksil({
      target: {
        moduleId: 'negative-module',
        suite: 'UNIT',
      },
      metrics: {
        totalChecks: 10,
        passedChecks: 10,
        failedChecks: 0,
        avgLatencyMs: -1,
        errorRatePct: 0,
        coveragePct: 100,
      },
    });

    assert(!result.valid, 'negative metric must be invalid');
  });

  await test('passed + failed above total is invalid', () => {
    const result = evaluateParaksil({
      target: {
        moduleId: 'shape-mismatch',
        suite: 'API',
      },
      metrics: {
        totalChecks: 5,
        passedChecks: 4,
        failedChecks: 2,
        avgLatencyMs: 90,
        errorRatePct: 10,
        coveragePct: 90,
      },
    });

    assert(!result.valid, 'totals mismatch must be invalid');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateParaksil({
      referenceId: 'health-run',
      target: {
        moduleId: 'health-check-module',
        suite: 'INTEGRATION',
      },
      metrics: {
        totalChecks: 40,
        passedChecks: 39,
        failedChecks: 1,
        avgLatencyMs: 250,
        errorRatePct: 2,
        coveragePct: 88,
      },
    });

    const health = getParaksilHealthReport();
    assert(health.evaluations >= 1, 'expected at least one evaluation');
    assert(health.lastModuleId === 'health-check-module', `unexpected lastModuleId: ${health.lastModuleId}`);
    assert(health.lastStatus === 'NEEDS_REVIEW', `unexpected lastStatus: ${health.lastStatus}`);
  });

  await test(`evaluateParaksil completes within ${PARAKSIL_PERFORMANCE_MAX_MS}ms`, () => {
    const started = performance.now();
    evaluateParaksil({
      target: {
        moduleId: 'perf-check-module',
        suite: 'UNIT',
      },
      metrics: {
        totalChecks: 250,
        passedChecks: 250,
        failedChecks: 0,
        avgLatencyMs: 14,
        errorRatePct: 0,
        coveragePct: 97,
      },
    });
    const duration = performance.now() - started;
    assert(duration <= PARAKSIL_PERFORMANCE_MAX_MS, `expected <= ${PARAKSIL_PERFORMANCE_MAX_MS}ms, got ${duration}`);
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
