// SpajaUltraOmegaCore -∞Ω+∞ — DINOSAURUS-Trexar Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetDinosaurusTrexarMetrics,
  DINOSAURUS_TREXAR_CONTRACT_VERSION,
  DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS,
  DINOSAURUS_TREXAR_PERSONA_ID,
  evaluateDinosaurusTrexar,
  getDinosaurusTrexarHealthReport,
} from '../../lib/dinosaurus-trexar';

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
  _resetDinosaurusTrexarMetrics();

  console.log('\n🔎 [dinosaurus-trexar] constants');

  await test('contract version is non-empty', () => {
    assert(DINOSAURUS_TREXAR_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DINOSAURUS_TREXAR_PERSONA_ID === 'dinosaurus-trexar-core', `unexpected persona id: ${DINOSAURUS_TREXAR_PERSONA_ID}`);
  });

  console.log('\n🔎 [dinosaurus-trexar] engine');

  await test('happy path returns valid result with status and tier', () => {
    const result = evaluateDinosaurusTrexar({
      referenceId: 'ok-1',
      profile: {
        specimenId: 'trex-001',
        ageCategory: 'ADULT',
        massKg: 7800,
      },
      signals: {
        stamina: 88,
        aggression: 75,
        focus: 82,
        threatLevel: 30,
        terrainFriction: 68,
        packSupport: 72,
        reactionMs: 210,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.trexarScore > 0, 'score should be > 0');
    assert(result.status === 'HUNT_READY' || result.status === 'APEX', `unexpected status ${result.status}`);
    assert(['S', 'A', 'B', 'C'].includes(result.tier), `unexpected tier ${result.tier}`);
    assert(result.recommendation.length > 0, 'recommendation must exist');
    assert(result.durationMs < DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS, `duration ${result.durationMs} exceeds max`);
  });

  await test('high threat and low pack support emit warning', () => {
    const result = evaluateDinosaurusTrexar({
      profile: {
        ageCategory: 'ADULT',
        massKg: 7000,
      },
      signals: {
        stamina: 60,
        aggression: 65,
        focus: 62,
        threatLevel: 96,
        terrainFriction: 70,
        packSupport: 10,
        reactionMs: 220,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.some((warning) => warning.includes('stability penalty')), 'expected stability penalty warning');
  });

  await test('NaN signal returns invalid', () => {
    const result = evaluateDinosaurusTrexar({
      profile: {
        ageCategory: 'ADULT',
        massKg: 7000,
      },
      signals: {
        stamina: Number.NaN,
        aggression: 65,
        focus: 62,
        threatLevel: 40,
        terrainFriction: 70,
        packSupport: 30,
        reactionMs: 220,
      },
    });

    assert(!result.valid, 'NaN must be invalid');
  });

  await test('Infinity signal returns invalid', () => {
    const result = evaluateDinosaurusTrexar({
      profile: {
        ageCategory: 'ADULT',
        massKg: 7000,
      },
      signals: {
        stamina: 70,
        aggression: 65,
        focus: 62,
        threatLevel: Number.POSITIVE_INFINITY,
        terrainFriction: 70,
        packSupport: 30,
        reactionMs: 220,
      },
    });

    assert(!result.valid, 'Infinity must be invalid');
  });

  await test('negative value returns invalid', () => {
    const result = evaluateDinosaurusTrexar({
      profile: {
        ageCategory: 'ADULT',
        massKg: -1,
      },
      signals: {
        stamina: 70,
        aggression: 65,
        focus: 62,
        threatLevel: 40,
        terrainFriction: 70,
        packSupport: 30,
        reactionMs: 220,
      },
    });

    assert(!result.valid, 'negative mass must be invalid');
  });

  await test('empty object input returns invalid', () => {
    const result = evaluateDinosaurusTrexar({} as never);
    assert(!result.valid, 'empty object should be invalid');
  });

  await test('invalid age category returns invalid', () => {
    const result = evaluateDinosaurusTrexar({
      profile: {
        ageCategory: 'MEGA' as never,
        massKg: 7000,
      },
      signals: {
        stamina: 70,
        aggression: 65,
        focus: 62,
        threatLevel: 40,
        terrainFriction: 70,
        packSupport: 30,
        reactionMs: 220,
      },
    });

    assert(!result.valid, 'invalid ageCategory should be invalid');
  });

  await test('health report reflects latest metrics', () => {
    _resetDinosaurusTrexarMetrics();
    evaluateDinosaurusTrexar({
      profile: {
        ageCategory: 'ADULT',
        massKg: 7000,
      },
      signals: {
        stamina: 82,
        aggression: 71,
        focus: 76,
        threatLevel: 35,
        terrainFriction: 66,
        packSupport: 70,
        reactionMs: 230,
      },
    });

    const report = getDinosaurusTrexarHealthReport();
    assert(report.evaluations === 1, `expected 1 evaluation, got ${report.evaluations}`);
    assert(report.personaId === DINOSAURUS_TREXAR_PERSONA_ID, 'persona mismatch');
  });

  await test(`average evaluation stays below ${DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS}ms`, () => {
    const samples = 150;
    const start = performance.now();
    for (let i = 0; i < samples; i++) {
      evaluateDinosaurusTrexar({
        profile: {
          ageCategory: i % 3 === 0 ? 'JUVENILE' : i % 3 === 1 ? 'ADULT' : 'ELDER',
          massKg: 5000 + (i % 4000),
        },
        signals: {
          stamina: 45 + (i % 55),
          aggression: 30 + (i % 70),
          focus: 40 + (i % 60),
          threatLevel: i % 100,
          terrainFriction: 35 + (i % 65),
          packSupport: 20 + (i % 80),
          reactionMs: 100 + (i % 400),
        },
      });
    }
    const avg = (performance.now() - start) / samples;
    assert(avg <= DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS, `average ${avg.toFixed(2)}ms > ${DINOSAURUS_TREXAR_PERFORMANCE_MAX_MS}ms`);
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
