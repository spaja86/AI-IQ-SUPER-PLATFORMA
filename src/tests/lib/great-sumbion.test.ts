// SpajaUltraOmegaCore -∞Ω+∞ — GREAT SUMBION Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  calculateGreatSumbion,
  getGreatSumbionHealthReport,
  _resetGreatSumbionMetrics,
  GREAT_SUMBION_CONTRACT_VERSION,
  GREAT_SUMBION_PERFORMANCE_MAX_MS,
  GREAT_SUMBION_PERSONA_ID,
} from '../../lib/great-sumbion';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
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
  _resetGreatSumbionMetrics();

  console.log('\n🔎 [great-sumbion] constants');

  await test('contract version is non-empty', () => {
    assert(GREAT_SUMBION_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(GREAT_SUMBION_PERSONA_ID === 'great-sumbion-core', `unexpected persona id: ${GREAT_SUMBION_PERSONA_ID}`);
  });

  await test('performance max is 50ms', () => {
    assert(GREAT_SUMBION_PERFORMANCE_MAX_MS === 50, `expected 50, got ${GREAT_SUMBION_PERFORMANCE_MAX_MS}`);
  });

  console.log('\n🔎 [great-sumbion] engine');

  await test('calculates weighted score and tier', () => {
    const result = calculateGreatSumbion({
      referenceId: 'baseline',
      signals: [
        { id: 'quality', value: 80, weight: 0.5 },
        { id: 'stability', value: 70, weight: 0.3 },
        { id: 'security', value: 90, weight: 0.2 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.score >= 0 && result.score <= 100, `score out of range: ${result.score}`);
    assert(result.tier === 'GROWTH', `expected GROWTH, got ${result.tier}`);
  });

  await test('zero value (non-zero weight) signal remains valid', () => {
    const result = calculateGreatSumbion({
      signals: [
        { id: 'quality', value: 0, weight: 1 },
        { id: 'stability', value: 10, weight: 1 },
      ],
    });

    assert(result.valid, 'zero value should remain valid');
    assertClose(result.score, 5, 0.001, 'score');
  });

  await test('NaN input is invalid', () => {
    const result = calculateGreatSumbion({
      signals: [{ id: 'quality', value: Number.NaN, weight: 1 }],
    });
    assert(!result.valid, 'NaN must be invalid');
  });

  await test('Infinity input is invalid', () => {
    const result = calculateGreatSumbion({
      signals: [{ id: 'quality', value: Number.POSITIVE_INFINITY, weight: 1 }],
    });
    assert(!result.valid, 'Infinity must be invalid');
  });

  await test('NaN weight is invalid', () => {
    const result = calculateGreatSumbion({
      signals: [{ id: 'quality', value: 25, weight: Number.NaN }],
    });
    assert(!result.valid, 'NaN weight must be invalid');
  });

  await test('negative input is invalid', () => {
    const result = calculateGreatSumbion({
      signals: [{ id: 'quality', value: -1, weight: 1 }],
    });
    assert(!result.valid, 'negative value must be invalid');
  });

  await test('division by zero guarded when total weight is zero', () => {
    const result = calculateGreatSumbion({
      signals: [
        { id: 'quality', value: 50, weight: 0 },
        { id: 'stability', value: 50, weight: 0 },
      ],
    });

    assert(!result.valid, 'zero total weight must be invalid');
    assert(result.warnings[0].includes('division-by-zero'), 'must include guard warning');
  });

  await test('health report reflects latest evaluation', () => {
    calculateGreatSumbion({
      signals: [{ id: 'quality', value: 85, weight: 1 }],
    });

    const health = getGreatSumbionHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastTier === 'APEX', `expected APEX, got ${health.lastTier}`);
  });

  console.log('\n🔎 [great-sumbion] performance');

  await test(`calculateGreatSumbion completes within ${GREAT_SUMBION_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      calculateGreatSumbion({
        signals: [
          { id: 'quality', value: 70 + (i % 20), weight: 0.4 },
          { id: 'stability', value: 65 + (i % 30), weight: 0.35 },
          { id: 'security', value: 80 + (i % 10), weight: 0.25 },
        ],
      });
    }
    const avg = (performance.now() - start) / samples;
    assert(avg <= GREAT_SUMBION_PERFORMANCE_MAX_MS, `average ${avg.toFixed(2)}ms > ${GREAT_SUMBION_PERFORMANCE_MAX_MS}ms`);
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
