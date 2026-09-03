// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetAktivitiAllMetrics,
  AKTIVITI_ALL_CONTRACT_VERSION,
  AKTIVITI_ALL_DISCLAIMER,
  AKTIVITI_ALL_MAX_DURATION_MINUTES,
  AKTIVITI_ALL_PERFORMANCE_MAX_MS,
  AKTIVITI_ALL_PERSONA_ID,
  evaluateAktivitiAll,
  getAktivitiAllHealthReport,
} from '../../lib/aktiviti-all';

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
  _resetAktivitiAllMetrics();

  console.log('\n🔎 [aktiviti-all] constants');

  await test('contract version is non-empty', () => {
    assert(AKTIVITI_ALL_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(AKTIVITI_ALL_PERSONA_ID === 'aktiviti-all-core', `unexpected persona id: ${AKTIVITI_ALL_PERSONA_ID}`);
  });

  await test('max duration is stable', () => {
    assert(AKTIVITI_ALL_MAX_DURATION_MINUTES === 300, `unexpected max duration: ${AKTIVITI_ALL_MAX_DURATION_MINUTES}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(AKTIVITI_ALL_DISCLAIMER.length > 0, 'disclaimer must be present');
  });

  console.log('\n🔎 [aktiviti-all] engine');

  await test('valid focus input returns deterministic valid result', () => {
    const input = {
      referenceId: 'a1',
      activity: 'FOCUS' as const,
      durationMinutes: 90,
      energyLevel: 80,
      focusLevel: 88,
      stressLevel: 20,
      completionRate: 70,
    };
    const r1 = evaluateAktivitiAll(input);
    const r2 = evaluateAktivitiAll(input);

    assert(r1.valid, 'expected valid result');
    assert(r1.activity === 'FOCUS', 'expected FOCUS activity');
    assert(r1.readinessScore === r2.readinessScore, 'score must be deterministic');
    assert(r1.status === r2.status, 'status must be deterministic');
    assert(r1.disclaimer === AKTIVITI_ALL_DISCLAIMER, 'disclaimer mismatch');
  });

  await test('zero duration adds warning but remains valid', () => {
    const result = evaluateAktivitiAll({
      activity: 'RECOVERY',
      durationMinutes: 0,
      energyLevel: 40,
      focusLevel: 45,
      stressLevel: 60,
      completionRate: 30,
    });

    assert(result.valid, 'expected valid');
    assert(result.warnings.length > 0, 'expected warnings for zero duration');
  });

  await test('stress and completion warnings are emitted', () => {
    const result = evaluateAktivitiAll({
      activity: 'SOCIAL',
      durationMinutes: 30,
      energyLevel: 50,
      focusLevel: 45,
      stressLevel: 90,
      completionRate: 10,
    });

    assert(result.valid, 'expected valid');
    assert(result.warnings.length >= 2, 'expected high-stress and low-completion warnings');
  });

  await test('invalid activity returns invalid result', () => {
    const result = evaluateAktivitiAll({
      activity: 'DANCING' as never,
      durationMinutes: 30,
      energyLevel: 60,
      focusLevel: 60,
      stressLevel: 20,
      completionRate: 70,
    });
    assert(!result.valid, 'expected invalid');
    assert(result.activity === null, 'invalid result activity should be null');
  });

  await test('negative duration returns invalid result', () => {
    const result = evaluateAktivitiAll({
      activity: 'FITNESS',
      durationMinutes: -1,
      energyLevel: 70,
      focusLevel: 50,
      stressLevel: 30,
      completionRate: 80,
    });
    assert(!result.valid, 'expected invalid');
  });

  await test('out-of-range values return invalid result', () => {
    const result = evaluateAktivitiAll({
      activity: 'LEARNING',
      durationMinutes: 20,
      energyLevel: 120,
      focusLevel: 50,
      stressLevel: 30,
      completionRate: 80,
    });
    assert(!result.valid, 'expected invalid for out-of-range energy');
  });

  await test('NaN and Infinity return invalid results', () => {
    const nanResult = evaluateAktivitiAll({
      activity: 'LEARNING',
      durationMinutes: 20,
      energyLevel: NaN,
      focusLevel: 50,
      stressLevel: 30,
      completionRate: 80,
    });
    const infResult = evaluateAktivitiAll({
      activity: 'LEARNING',
      durationMinutes: Infinity,
      energyLevel: 50,
      focusLevel: 50,
      stressLevel: 30,
      completionRate: 80,
    });

    assert(!nanResult.valid, 'NaN should be invalid');
    assert(!infResult.valid, 'Infinity should be invalid');
  });

  await test('health report increments evaluations and tracks last result', () => {
    _resetAktivitiAllMetrics();
    evaluateAktivitiAll({ activity: 'FOCUS', durationMinutes: 60, energyLevel: 70, focusLevel: 75, stressLevel: 25, completionRate: 65 });
    evaluateAktivitiAll({ activity: 'RECOVERY', durationMinutes: 20, energyLevel: 45, focusLevel: 40, stressLevel: 70, completionRate: 50 });
    const health = getAktivitiAllHealthReport();

    assert(health.evaluations === 2, `expected 2 evaluations, got ${health.evaluations}`);
    assert(health.personaId === AKTIVITI_ALL_PERSONA_ID, 'persona mismatch');
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt should be set');
  });

  await test('invalid evaluation still increments metrics and records BLOCKED status', () => {
    _resetAktivitiAllMetrics();
    evaluateAktivitiAll({
      activity: 'FOCUS',
      durationMinutes: -5,
      energyLevel: 70,
      focusLevel: 75,
      stressLevel: 25,
      completionRate: 65,
    });
    const health = getAktivitiAllHealthReport();
    assert(health.evaluations === 1, `expected 1 evaluation, got ${health.evaluations}`);
    assert(health.lastStatus === 'BLOCKED', `expected BLOCKED status, got ${String(health.lastStatus)}`);
    assert(health.lastReadinessScore === 0, `expected score 0, got ${health.lastReadinessScore}`);
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt should be set');
  });

  console.log('\n🔎 [aktiviti-all] performance');

  await test(`evaluateAktivitiAll average under ${AKTIVITI_ALL_PERFORMANCE_MAX_MS}ms`, () => {
    const samples = 160;
    const start = performance.now();

    for (let i = 0; i < samples; i++) {
      evaluateAktivitiAll({
        activity: i % 5 === 0 ? 'FOCUS' : i % 5 === 1 ? 'FITNESS' : i % 5 === 2 ? 'LEARNING' : i % 5 === 3 ? 'SOCIAL' : 'RECOVERY',
        durationMinutes: i % 120,
        energyLevel: 20 + (i % 70),
        focusLevel: 25 + (i % 65),
        stressLevel: i % 80,
        completionRate: i % 100,
      });
    }

    const avg = (performance.now() - start) / samples;
    assert(avg <= AKTIVITI_ALL_PERFORMANCE_MAX_MS, `average ${avg.toFixed(2)}ms > ${AKTIVITI_ALL_PERFORMANCE_MAX_MS}ms`);
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failed tests:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
