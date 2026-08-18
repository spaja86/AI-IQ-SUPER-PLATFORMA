// SpajaUltraOmegaCore -∞Ω+∞ — DIREKT Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetDirektMetrics,
  evaluateDirekt,
  getDirektHealthReport,
  DIREKT_CONTRACT_VERSION,
  DIREKT_DEFAULT_MINIMUM_SCORE,
  DIREKT_DEFAULT_TARGET_SCORE,
  DIREKT_PERFORMANCE_MAX_MS,
  DIREKT_PERSONA_ID,
} from '../../lib/direkt';

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

function assertClose(actual: number, expected: number, tolerance = 0.001, label = ''): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

async function runTests(): Promise<void> {
  _resetDirektMetrics();

  console.log('\n🔎 [direkt] constants');

  await test('contract version is non-empty', () => {
    assert(DIREKT_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DIREKT_PERSONA_ID === 'direkt-communication-core', `unexpected persona id: ${DIREKT_PERSONA_ID}`);
  });

  await test('default minimum score is stable', () => {
    assert(DIREKT_DEFAULT_MINIMUM_SCORE === 65, `expected 65, got ${DIREKT_DEFAULT_MINIMUM_SCORE}`);
  });

  await test('default target score is stable', () => {
    assert(DIREKT_DEFAULT_TARGET_SCORE === 78, `expected 78, got ${DIREKT_DEFAULT_TARGET_SCORE}`);
  });

  console.log('\n🔎 [direkt] engine');

  await test('evaluates weighted directness quality', () => {
    const result = evaluateDirekt({
      referenceId: 'brief-1',
      signals: [
        { id: 'clarity', label: 'Clarity', score: 90, weight: 0.3, required: true, exampleCount: 2 },
        { id: 'specificity', label: 'Specificity', score: 84, weight: 0.25, required: true, exampleCount: 2 },
        { id: 'actionability', label: 'Actionability', score: 80, weight: 0.2, required: true, exampleCount: 1 },
        { id: 'transparency', label: 'Transparency', score: 76, weight: 0.15, exampleCount: 1 },
        { id: 'respect', label: 'Respect', score: 88, weight: 0.1, required: true, exampleCount: 1 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assertClose(result.overallScore, 84.2, 0.001, 'overallScore');
    assert(result.status === 'DIRECT', `expected DIRECT, got ${result.status}`);
    assert(result.coveragePct === 100, `expected 100, got ${result.coveragePct}`);
    assert(result.targetDelta === 6.2, `expected 6.2, got ${result.targetDelta}`);
  });

  await test('required signal below minimum score is invalid', () => {
    const result = evaluateDirekt({
      minimumScore: 70,
      signals: [
        { id: 'clarity', label: 'Clarity', score: 68, weight: 1, required: true, exampleCount: 1 },
      ],
    });

    assert(!result.valid, 'result should be invalid');
    assert(result.requiredSatisfied === false, 'requiredSatisfied should be false');
    assert(result.warnings.some((warning) => warning.includes('below minimumScore 70')), 'warning must mention threshold');
  });

  await test('missing examples creates warning but keeps optional signals valid', () => {
    const result = evaluateDirekt({
      signals: [
        { id: 'clarity', label: 'Clarity', score: 82, weight: 1, required: true, exampleCount: 1 },
        { id: 'transparency', label: 'Transparency', score: 74, weight: 1, exampleCount: 0 },
      ],
    });

    assert(result.valid, 'optional missing examples should remain valid');
    assert(result.coveragePct === 50, `expected 50, got ${result.coveragePct}`);
    assert(result.warnings.some((warning) => warning.includes('has no examples')), 'must warn about missing examples');
  });

  await test('target misalignment creates warning', () => {
    const result = evaluateDirekt({
      targetScore: 80,
      signals: [
        { id: 'clarity', label: 'Clarity', score: 35, weight: 1, required: true, exampleCount: 1 },
      ],
    });

    assert(result.warnings.some((warning) => warning.includes('far from targetScore 80')), 'must warn about target delta');
  });

  await test('score above 100 is invalid', () => {
    const result = evaluateDirekt({
      signals: [{ id: 'clarity', label: 'Clarity', score: 101, weight: 1 }],
    });
    assert(!result.valid, 'score above 100 must be invalid');
  });

  await test('division by zero guarded when total weight is zero', () => {
    const result = evaluateDirekt({
      signals: [
        { id: 'clarity', label: 'Clarity', score: 80, weight: 0 },
        { id: 'specificity', label: 'Specificity', score: 70, weight: 0 },
      ],
    });

    assert(!result.valid, 'zero total weight must be invalid');
    assert(result.warnings[0].includes('division-by-zero'), 'must include guard warning');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateDirekt({
      signals: [{ id: 'clarity', label: 'Clarity', score: 95, weight: 1, required: true, exampleCount: 1 }],
    });

    const health = getDirektHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastStatus === 'PRECISE', `expected PRECISE, got ${health.lastStatus}`);
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [direkt] performance');

  await test(`evaluateDirekt completes within ${DIREKT_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateDirekt({
        signals: [
          { id: 'clarity', label: 'Clarity', score: 70 + (i % 20), weight: 0.3, required: true, exampleCount: 2 },
          { id: 'specificity', label: 'Specificity', score: 65 + (i % 15), weight: 0.25, required: true, exampleCount: 1 },
          { id: 'actionability', label: 'Actionability', score: 60 + (i % 10), weight: 0.2, required: true, exampleCount: 1 },
          { id: 'transparency', label: 'Transparency', score: 68 + (i % 12), weight: 0.15, exampleCount: 1 },
          { id: 'respect', label: 'Respect', score: 72 + (i % 8), weight: 0.1, required: true, exampleCount: 1 },
        ],
      });
    }

    const average = (performance.now() - start) / samples;
    assert(average <= DIREKT_PERFORMANCE_MAX_MS, `average ${average.toFixed(2)}ms > ${DIREKT_PERFORMANCE_MAX_MS}ms`);
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
