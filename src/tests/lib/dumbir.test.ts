// SpajaUltraOmegaCore -∞Ω+∞ — ÐUMBIR Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetDumbirMetrics,
  evaluateDumbir,
  getDumbirHealthReport,
  DUMBIR_CONTRACT_VERSION,
  DUMBIR_LINKED_REPO_IMPACT,
  DUMBIR_PERFORMANCE_MAX_MS,
  DUMBIR_PERSONA_ID,
  DUMBIR_SLUG,
} from '../../lib/dumbir';

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
  _resetDumbirMetrics();

  console.log('\n🔎 [dumbir] constants');

  await test('contract version is non-empty', () => {
    assert(DUMBIR_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DUMBIR_PERSONA_ID === 'dumbir-wellness-core', `unexpected persona id: ${DUMBIR_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(DUMBIR_SLUG === 'dumbir', `unexpected slug: ${DUMBIR_SLUG}`);
  });

  console.log('\n🔎 [dumbir] engine');

  await test('evaluates a balanced digestion tea', () => {
    const result = evaluateDumbir({
      referenceId: 'tea-1',
      goal: 'DIGESTION',
      sensitivity: 'MEDIUM',
      preparation: 'TEA',
      gingerGrams: 12,
      waterMl: 320,
      steepMinutes: 8,
      servings: 2,
      addons: ['LEMON', 'MINT'],
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'BOOSTED', `expected BOOSTED, got ${result.status}`);
    assertClose(result.potencyScore, 56.6, 0.001, 'potencyScore');
    assertClose(result.balanceScore, 97.08, 0.01, 'balanceScore');
    assert(result.recommendedAddons.length === 0, 'all recommended addons already applied');
  });

  await test('high-sensitivity shot becomes intense', () => {
    const result = evaluateDumbir({
      goal: 'IMMUNITY',
      sensitivity: 'HIGH',
      preparation: 'SHOT',
      gingerGrams: 18,
      waterMl: 120,
      steepMinutes: 4,
      servings: 1,
      addons: ['TURMERIC'],
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'INTENSE', `expected INTENSE, got ${result.status}`);
    assert(result.warnings.some((warning) => warning.includes('High sensitivity + SHOT')), 'must warn about high sensitivity shot');
  });

  await test('unsupported addon returns invalid result', () => {
    const result = evaluateDumbir({
      goal: 'FOCUS',
      sensitivity: 'LOW',
      preparation: 'TONIC',
      gingerGrams: 10,
      waterMl: 250,
      steepMinutes: 5,
      addons: ['PEPPER' as never],
    });

    assert(!result.valid, 'unsupported addon must be invalid');
  });

  await test('negative ginger grams returns invalid result', () => {
    const result = evaluateDumbir({
      goal: 'RECOVERY',
      sensitivity: 'LOW',
      preparation: 'MEAL',
      gingerGrams: -5,
      waterMl: 200,
      steepMinutes: 0,
    });

    assert(!result.valid, 'negative ginger grams must be invalid');
  });

  await test('NaN ginger grams returns invalid result', () => {
    const result = evaluateDumbir({
      goal: 'RECOVERY',
      sensitivity: 'LOW',
      preparation: 'MEAL',
      gingerGrams: NaN,
      waterMl: 200,
      steepMinutes: 0,
    });

    assert(!result.valid, 'NaN ginger grams must be invalid');
  });

  await test('Infinity waterMl returns invalid result', () => {
    const result = evaluateDumbir({
      goal: 'RECOVERY',
      sensitivity: 'LOW',
      preparation: 'MEAL',
      gingerGrams: 6,
      waterMl: Infinity,
      steepMinutes: 0,
    });

    assert(!result.valid, 'Infinity waterMl must be invalid');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateDumbir({
      goal: 'FOCUS',
      sensitivity: 'MEDIUM',
      preparation: 'TONIC',
      gingerGrams: 8,
      waterMl: 240,
      steepMinutes: 4,
      addons: ['LEMON'],
    });

    const health = getDumbirHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastStatus === 'BOOSTED', `expected BOOSTED, got ${health.lastStatus}`);
    assert(health.linkedRepoImpact === DUMBIR_LINKED_REPO_IMPACT, 'linked repo impact must match constant');
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [dumbir] performance');

  await test(`evaluateDumbir completes within ${DUMBIR_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateDumbir({
        goal: i % 2 === 0 ? 'DIGESTION' : 'IMMUNITY',
        sensitivity: i % 3 === 0 ? 'HIGH' : 'MEDIUM',
        preparation: i % 4 === 0 ? 'TEA' : 'TONIC',
        gingerGrams: 6 + (i % 10),
        waterMl: 180 + (i % 5) * 30,
        steepMinutes: i % 12,
        servings: 1 + (i % 3),
        addons: i % 2 === 0 ? ['LEMON', 'HONEY'] : ['MINT'],
      });
    }

    const average = (performance.now() - start) / samples;
    assert(average <= DUMBIR_PERFORMANCE_MAX_MS, `average ${average.toFixed(2)}ms > ${DUMBIR_PERFORMANCE_MAX_MS}ms`);
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
