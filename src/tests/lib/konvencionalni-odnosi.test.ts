// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetKonvencionalniOdnosiMetrics,
  evaluateKonvencionalniOdnosi,
  getKonvencionalniOdnosiHealthReport,
  KONVENCIONALNI_ODNOSI_CONTRACT_VERSION,
  KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS,
  KONVENCIONALNI_ODNOSI_PERSONA_ID,
} from '../../lib/konvencionalni-odnosi';

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
  _resetKonvencionalniOdnosiMetrics();

  console.log('\n🔎 [konvencionalni-odnosi] constants');

  await test('contract version is non-empty', () => {
    assert(KONVENCIONALNI_ODNOSI_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(
      KONVENCIONALNI_ODNOSI_PERSONA_ID === 'konvencionalni-odnosi-core',
      `unexpected persona id: ${KONVENCIONALNI_ODNOSI_PERSONA_ID}`,
    );
  });

  await test('performance max is 50ms', () => {
    assert(
      KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS === 50,
      `expected 50, got ${KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS}`,
    );
  });

  console.log('\n🔎 [konvencionalni-odnosi] engine');

  await test('balanced high dimensions resolve to SKLADNO', () => {
    const result = evaluateKonvencionalniOdnosi({
      referenceId: 'balanced',
      relationType: 'PARTNERSKI',
      dimensions: [
        { dimension: 'POVERENJE', score: 82 },
        { dimension: 'KOMUNIKACIJA', score: 78 },
        { dimension: 'POSTOVANJE', score: 80 },
        { dimension: 'RECIPROCITET', score: 76 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assertClose(result.score, 79, 0.001, 'score');
    assert(result.tier === 'SKLADNO', `expected SKLADNO, got ${result.tier}`);
    assert(result.dominantStrength === 'POVERENJE', `expected dominant strength POVERENJE, got ${result.dominantStrength}`);
    assert(result.focusArea === 'RECIPROCITET', `expected focus RECIPROCITET, got ${result.focusArea}`);
  });

  await test('deterministic output for same input', () => {
    const input = {
      referenceId: 'deterministic',
      relationType: 'TIMSKI' as const,
      dimensions: [
        { dimension: 'POVERENJE' as const, score: 68 },
        { dimension: 'KOMUNIKACIJA' as const, score: 63 },
        { dimension: 'POSTOVANJE' as const, score: 74 },
      ],
    };
    const first = evaluateKonvencionalniOdnosi(input);
    const second = evaluateKonvencionalniOdnosi(input);

    assert(first.score === second.score, 'score should be deterministic');
    assert(first.tier === second.tier, 'tier should be deterministic');
    assert(first.focusArea === second.focusArea, 'focusArea should be deterministic');
  });

  await test('critical low dimension emits warnings', () => {
    const result = evaluateKonvencionalniOdnosi({
      dimensions: [
        { dimension: 'POVERENJE', score: 18 },
        { dimension: 'KOMUNIKACIJA', score: 72 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.some((warning) => warning.includes('kritično niska')), 'expected critical warning');
  });

  await test('inconsistent combination emits warning', () => {
    const result = evaluateKonvencionalniOdnosi({
      relationType: 'POSLOVNI',
      dimensions: [
        { dimension: 'POVERENJE', score: 82 },
        { dimension: 'POSTOVANJE', score: 30 },
        { dimension: 'KOMUNIKACIJA', score: 61 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(
      result.warnings.some((warning) => warning.includes('nekonzistentan odnosni obrazac')),
      'expected inconsistency warning',
    );
  });

  await test('NaN score is invalid', () => {
    const result = evaluateKonvencionalniOdnosi({
      dimensions: [{ dimension: 'POVERENJE', score: Number.NaN }],
    });

    assert(!result.valid, 'NaN must be invalid');
  });

  await test('Infinity score is invalid', () => {
    const result = evaluateKonvencionalniOdnosi({
      dimensions: [{ dimension: 'POVERENJE', score: Number.POSITIVE_INFINITY }],
    });

    assert(!result.valid, 'Infinity must be invalid');
  });

  await test('negative score is invalid', () => {
    const result = evaluateKonvencionalniOdnosi({
      dimensions: [{ dimension: 'POVERENJE', score: -1 }],
    });

    assert(!result.valid, 'negative score must be invalid');
  });

  await test('empty dimensions array is invalid', () => {
    const result = evaluateKonvencionalniOdnosi({ dimensions: [] });
    assert(!result.valid, 'empty dimensions should be invalid');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateKonvencionalniOdnosi({
      dimensions: [{ dimension: 'POVERENJE', score: 91 }],
    });

    const health = getKonvencionalniOdnosiHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastTier === 'UZORNO', `expected UZORNO, got ${health.lastTier}`);
  });

  console.log('\n🔎 [konvencionalni-odnosi] performance');

  await test(`evaluateKonvencionalniOdnosi completes within ${KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateKonvencionalniOdnosi({
        relationType: 'PRIJATELJSKI',
        dimensions: [
          { dimension: 'POVERENJE', score: 60 + (i % 25) },
          { dimension: 'KOMUNIKACIJA', score: 55 + (i % 15) },
          { dimension: 'POSTOVANJE', score: 65 + (i % 20) },
          { dimension: 'RECIPROCITET', score: 58 + (i % 18) },
        ],
      });
    }
    const avg = (performance.now() - start) / samples;
    assert(avg <= KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS, `average ${avg.toFixed(2)}ms > ${KONVENCIONALNI_ODNOSI_PERFORMANCE_MAX_MS}ms`);
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
