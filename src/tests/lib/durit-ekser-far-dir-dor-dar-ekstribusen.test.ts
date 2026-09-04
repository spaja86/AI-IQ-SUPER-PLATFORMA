// SpajaUltraOmegaCore -∞Ω+∞ — DURIT EKSER FAR DIR DOR DAR EKSTRIBUŠEN Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetDuritEkserFarDirDorDarEkstribusenMetrics,
  evaluateDuritEkserFarDirDorDarEkstribusen,
  getDuritEkserFarDirDorDarEkstribusenHealthReport,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERSONA_ID,
  DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG,
} from '../../lib/durit-ekser-far-dir-dor-dar-ekstribusen';

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

function assertClose(actual: number, expected: number, tolerance = 0.01, label = ''): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

async function runTests(): Promise<void> {
  _resetDuritEkserFarDirDorDarEkstribusenMetrics();

  console.log('\n🔎 [durit-ekser-far-dir-dor-dar-ekstribusen] constants');

  await test('contract version is non-empty', () => {
    assert(DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(
      DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERSONA_ID === 'durit-ekser-ekstribusen-core',
      `unexpected persona id: ${DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERSONA_ID}`,
    );
  });

  await test('slug is stable', () => {
    assert(
      DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG === 'durit-ekser-far-dir-dor-dar-ekstribusen',
      `unexpected slug: ${DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_SLUG}`,
    );
  });

  await test('default thresholds are stable', () => {
    assert(DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_MINIMUM_SCORE === 70, 'minimum score changed unexpectedly');
    assert(DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_DEFAULT_TARGET_SCORE === 85, 'target score changed unexpectedly');
  });

  console.log('\n🔎 [durit-ekser-far-dir-dor-dar-ekstribusen] engine');

  await test('evaluates composed DOR/DAR orchestration into EKSTRIBUSEN', () => {
    const result = evaluateDuritEkserFarDirDorDarEkstribusen({
      referenceId: 'ekstribusen-1',
      start: 2,
      end: 8,
      step: 2,
      target: 5,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'EKSTRIBUSEN', `expected EKSTRIBUSEN, got ${result.status}`);
    assertClose(result.overallScore, 86, 0.01, 'overallScore');
    assert(result.dor.output === 8, `expected DOR output 8, got ${result.dor.output}`);
    assert(result.dar.output === 5, `expected DAR output 5, got ${result.dar.output}`);
    assert(result.distribution.readinessStatus === 'spremno', `unexpected distribucija readiness: ${result.distribution.readinessStatus}`);
  });

  await test('contradictory thresholds are blocked', () => {
    const result = evaluateDuritEkserFarDirDorDarEkstribusen({
      start: 1,
      end: 3,
      step: 1,
      target: 2,
      minimumScore: 90,
      targetScore: 80,
    });

    assert(!result.valid, 'result should be invalid');
    assert(result.status === 'BLOCKED', `expected BLOCKED, got ${result.status}`);
    assert(result.warnings.some((warning) => warning.includes('targetScore must be greater than or equal to minimumScore')), 'expected threshold warning');
  });

  await test('guard stop degrades the orchestration', () => {
    const result = evaluateDuritEkserFarDirDorDarEkstribusen({
      start: 0,
      end: 50,
      step: 1,
      target: 25,
      maxIterations: 5,
      maxDurationMs: 50,
    });

    assert(!result.valid, 'guard-stopped result should be invalid');
    assert(result.status === 'DEGRADED', `expected DEGRADED, got ${result.status}`);
    assert(result.audit.degradedSources.some((source) => source === 'dor:max-iterations' || source === 'dar:max-iterations'), 'expected max-iterations degraded source');
  });

  await test('blocked petlja status is surfaced', () => {
    const result = evaluateDuritEkserFarDirDorDarEkstribusen({
      start: 0,
      end: 10,
      step: 1,
      target: 5,
      status: 'DEAD',
    });

    assert(!result.valid, 'blocked status should be invalid');
    assert(result.status === 'BLOCKED', `expected BLOCKED, got ${result.status}`);
    assert(result.dor.reason === 'blocked-status', `unexpected dor reason: ${result.dor.reason}`);
    assert(result.dar.reason === 'blocked-status', `unexpected dar reason: ${result.dar.reason}`);
  });

  await test('health report reflects latest evaluation', () => {
    evaluateDuritEkserFarDirDorDarEkstribusen({ start: 2, end: 8, step: 2, target: 5 });

    const health = getDuritEkserFarDirDorDarEkstribusenHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastStatus === 'EKSTRIBUSEN', `expected EKSTRIBUSEN, got ${health.lastStatus}`);
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [durit-ekser-far-dir-dor-dar-ekstribusen] performance');

  await test(`evaluate completes within ${DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateDuritEkserFarDirDorDarEkstribusen({
        start: 1,
        end: 9,
        step: 2,
        target: 5 + (i % 2),
      });
    }

    const average = (performance.now() - start) / samples;
    assert(
      average <= DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS,
      `average ${average.toFixed(2)}ms > ${DURIT_EKSER_FAR_DIR_DOR_DAR_EKSTRIBUSEN_PERFORMANCE_MAX_MS}ms`,
    );
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
