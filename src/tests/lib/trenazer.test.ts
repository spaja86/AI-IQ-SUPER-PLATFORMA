// SpajaUltraOmegaCore -∞Ω+∞ — TRENAZER Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateTrenazer,
  getTrenazerHealthReport,
  _resetTrenazerMetrics,
  TRENAZER_CONTRACT_VERSION,
  TRENAZER_MAX_AVAILABLE_MINUTES,
  TRENAZER_PERFORMANCE_MAX_MS,
  TRENAZER_PERSONA_ID,
} from '../../lib/trenazer';

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
  _resetTrenazerMetrics();

  console.log('\n🔎 [trenazer] constants');

  await test('contract version is non-empty', () => {
    assert(TRENAZER_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(TRENAZER_PERSONA_ID === 'trenazer-coach-core', `unexpected persona id: ${TRENAZER_PERSONA_ID}`);
  });

  await test('available minutes cap is stable', () => {
    assert(TRENAZER_MAX_AVAILABLE_MINUTES === 300, `expected 300, got ${TRENAZER_MAX_AVAILABLE_MINUTES}`);
  });

  console.log('\n🔎 [trenazer] engine');

  await test('calculates readiness, intensity, and duration', () => {
    const result = evaluateTrenazer({
      referenceId: 'baseline',
      profile: {
        traineeId: 'athlete-1',
        goal: 'STRENGTH',
        experienceLevel: 'INTERMEDIATE',
      },
      metrics: {
        energy: 82,
        focus: 76,
        soreness: 25,
        stress: 20,
        sleepHours: 7.5,
        availableMinutes: 70,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.readiness === 'INTENSIVE', `expected INTENSIVE, got ${result.readiness}`);
    assert(result.recommendedIntensity === 'HIGH', `expected HIGH, got ${result.recommendedIntensity}`);
    assert(result.recommendedDurationMinutes === 70, `expected 70, got ${result.recommendedDurationMinutes}`);
    assert(result.focusAreas.includes('compound-lifts'), 'strength focus area missing');
  });

  await test('moderate session is generated for middling readiness', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'BALANCE',
        experienceLevel: 'BEGINNER',
      },
      metrics: {
        energy: 55,
        focus: 50,
        soreness: 35,
        stress: 40,
        sleepHours: 6,
        availableMinutes: 60,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.readiness === 'MODERATE', `expected MODERATE, got ${result.readiness}`);
    assert(result.recommendedIntensity === 'MEDIUM', `expected MEDIUM, got ${result.recommendedIntensity}`);
    assert(result.recommendedDurationMinutes === 40, `expected 40, got ${result.recommendedDurationMinutes}`);
  });

  await test('low sleep and stress emit warnings', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'RECOVERY',
        experienceLevel: 'BEGINNER',
      },
      metrics: {
        energy: 30,
        focus: 25,
        soreness: 80,
        stress: 85,
        sleepHours: 4.5,
        availableMinutes: 15,
      },
    });

    assert(result.valid, 'result should remain valid');
    assert(result.readiness === 'RECOVERY', `expected RECOVERY, got ${result.readiness}`);
    assert(result.warnings.some((warning) => warning.includes('sleep')), 'sleep warning missing');
    assert(result.warnings.some((warning) => warning.includes('stress')), 'stress warning missing');
  });

  await test('NaN metric is invalid', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'ADVANCED',
      },
      metrics: {
        energy: Number.NaN,
        focus: 70,
        soreness: 20,
        stress: 20,
        sleepHours: 8,
        availableMinutes: 60,
      },
    });

    assert(!result.valid, 'NaN metric must be invalid');
  });

  await test('Infinity metric is invalid', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'ADVANCED',
      },
      metrics: {
        energy: Number.POSITIVE_INFINITY,
        focus: 70,
        soreness: 20,
        stress: 20,
        sleepHours: 8,
        availableMinutes: 60,
      },
    });

    assert(!result.valid, 'Infinity metric must be invalid');
  });

  await test('negative metric is invalid', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'ADVANCED',
      },
      metrics: {
        energy: -1,
        focus: 70,
        soreness: 20,
        stress: 20,
        sleepHours: 8,
        availableMinutes: 60,
      },
    });

    assert(!result.valid, 'negative metric must be invalid');
  });

  await test('availableMinutes above cap is invalid', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'ADVANCED',
      },
      metrics: {
        energy: 70,
        focus: 70,
        soreness: 20,
        stress: 20,
        sleepHours: 8,
        availableMinutes: 301,
      },
    });

    assert(!result.valid, 'availableMinutes above cap must be invalid');
  });

  await test('sleepHours above 24 is invalid', () => {
    const result = evaluateTrenazer({
      profile: {
        goal: 'ENDURANCE',
        experienceLevel: 'ADVANCED',
      },
      metrics: {
        energy: 70,
        focus: 70,
        soreness: 20,
        stress: 20,
        sleepHours: 25,
        availableMinutes: 60,
      },
    });

    assert(!result.valid, 'sleepHours above 24 must be invalid');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateTrenazer({
      profile: {
        goal: 'STRENGTH',
        experienceLevel: 'ADVANCED',
      },
      metrics: {
        energy: 90,
        focus: 90,
        soreness: 10,
        stress: 10,
        sleepHours: 8,
        availableMinutes: 80,
      },
    });

    const health = getTrenazerHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastReadiness === 'INTENSIVE', `expected INTENSIVE, got ${health.lastReadiness}`);
  });

  console.log('\n🔎 [trenazer] performance');

  await test(`evaluateTrenazer completes within ${TRENAZER_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateTrenazer({
        profile: {
          goal: 'ENDURANCE',
          experienceLevel: 'INTERMEDIATE',
        },
        metrics: {
          energy: 60 + (i % 25),
          focus: 55 + (i % 30),
          soreness: 15 + (i % 20),
          stress: 10 + (i % 25),
          sleepHours: 6 + ((i % 4) * 0.5),
          availableMinutes: 45 + (i % 20),
        },
      });
    }
    const avg = (performance.now() - start) / samples;
    assert(avg <= TRENAZER_PERFORMANCE_MAX_MS, `average ${avg.toFixed(2)}ms > ${TRENAZER_PERFORMANCE_MAX_MS}ms`);
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
