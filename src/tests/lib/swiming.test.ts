// SpajaUltraOmegaCore -∞Ω+∞ — SWIMING Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateSwiming,
  getSwimingHealthReport,
  _resetSwimingMetrics,
  SWIMING_CONTRACT_VERSION,
  SWIMING_DISCLAIMER,
  SWIMING_MAX_DURATION_MIN,
  SWIMING_PERFORMANCE_MAX_MS,
  SWIMING_PERSONA_ID,
} from '../../lib/swiming';

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
  _resetSwimingMetrics();

  console.log('\n🔎 [swiming] constants');

  await test('contract version is non-empty', () => {
    assert(SWIMING_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(SWIMING_PERSONA_ID === 'swiming-core', `unexpected persona id: ${SWIMING_PERSONA_ID}`);
  });

  await test('max duration is 180', () => {
    assert(SWIMING_MAX_DURATION_MIN === 180, `expected 180, got ${SWIMING_MAX_DURATION_MIN}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(SWIMING_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  console.log('\n🔎 [swiming] engine — happy path');

  await test('baseline freestyle session returns valid result', () => {
    const result = evaluateSwiming({
      referenceId: 'swim-1',
      strokeType: 'freestyle',
      sessionDurationMin: 45,
      poolLengthM: 25,
      restingHeartRate: 65,
      waterTempC: 27,
      fitnessLevel: 'INTERMEDIATE',
    });
    assert(result.valid, `expected valid, got: ${result.warnings.join(', ')}`);
    assert(result.readinessScore > 0, 'readinessScore must be > 0');
    assert(result.estimatedCalories > 0, 'estimatedCalories must be > 0');
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.durationMs < SWIMING_PERFORMANCE_MAX_MS, `durationMs exceeds ${SWIMING_PERFORMANCE_MAX_MS}ms`);
  });

  await test('butterfly has higher calorie burn than backstroke for same duration', () => {
    const butterfly = evaluateSwiming({
      strokeType: 'butterfly', sessionDurationMin: 60, poolLengthM: 25,
      restingHeartRate: 60, waterTempC: 27, fitnessLevel: 'ADVANCED',
    });
    const backstroke = evaluateSwiming({
      strokeType: 'backstroke', sessionDurationMin: 60, poolLengthM: 25,
      restingHeartRate: 60, waterTempC: 27, fitnessLevel: 'ADVANCED',
    });
    assert(butterfly.estimatedCalories > backstroke.estimatedCalories, 'butterfly should burn more calories');
  });

  await test('session >= 45 min triggers hydrationAlert', () => {
    const result = evaluateSwiming({
      strokeType: 'freestyle', sessionDurationMin: 60, poolLengthM: 50,
      restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'INTERMEDIATE',
    });
    assert(result.hydrationAlert === true, 'expected hydrationAlert for 60-min session');
  });

  await test('session < 45 min does not trigger hydrationAlert', () => {
    const result = evaluateSwiming({
      strokeType: 'backstroke', sessionDurationMin: 30, poolLengthM: 25,
      restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'BEGINNER',
    });
    assert(result.hydrationAlert === false, 'expected no hydrationAlert for 30-min session');
  });

  await test('health report increments evaluations', () => {
    _resetSwimingMetrics();
    evaluateSwiming({ strokeType: 'medley', sessionDurationMin: 40, poolLengthM: 25, restingHeartRate: 70, waterTempC: 26, fitnessLevel: 'INTERMEDIATE' });
    evaluateSwiming({ strokeType: 'freestyle', sessionDurationMin: 30, poolLengthM: 25, restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'BEGINNER' });
    const report = getSwimingHealthReport();
    assert(report.evaluations === 2, `expected 2, got ${report.evaluations}`);
  });

  console.log('\n🔎 [swiming] edge cases');

  await test('session > 180 min is capped with warning', () => {
    const result = evaluateSwiming({
      strokeType: 'freestyle', sessionDurationMin: 250, poolLengthM: 25,
      restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'ADVANCED',
    });
    assert(result.valid, 'expected valid');
    assert(result.warnings.some((w) => w.includes('capped')), 'expected capped warning');
    const capped = evaluateSwiming({
      strokeType: 'freestyle', sessionDurationMin: 180, poolLengthM: 25,
      restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'ADVANCED',
    });
    assert(result.estimatedCalories === capped.estimatedCalories, 'calories should be same as 180-min session');
  });

  await test('waterTemp < 18 triggers safety alert', () => {
    const result = evaluateSwiming({
      strokeType: 'freestyle', sessionDurationMin: 30, poolLengthM: 25,
      restingHeartRate: 65, waterTempC: 15, fitnessLevel: 'INTERMEDIATE',
    });
    assert(result.valid, 'expected valid');
    assert(result.safetyAlerts.some((a) => a.includes('cold') || a.includes('cold') || a.includes('18°C') || a.includes('too cold')), 'expected cold water alert');
  });

  await test('waterTemp > 32 triggers safety alert', () => {
    const result = evaluateSwiming({
      strokeType: 'freestyle', sessionDurationMin: 30, poolLengthM: 25,
      restingHeartRate: 65, waterTempC: 35, fitnessLevel: 'INTERMEDIATE',
    });
    assert(result.valid, 'expected valid');
    assert(result.safetyAlerts.length > 0, 'expected safety alert for hot water');
  });

  await test('restingHR > 100 triggers safety alert', () => {
    const result = evaluateSwiming({
      strokeType: 'freestyle', sessionDurationMin: 30, poolLengthM: 25,
      restingHeartRate: 110, waterTempC: 27, fitnessLevel: 'BEGINNER',
    });
    assert(result.valid, 'expected valid');
    assert(result.safetyAlerts.length > 0, 'expected safety alert for high HR');
  });

  await test('invalid strokeType returns invalid', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = evaluateSwiming({ strokeType: 'doggy-paddle' as any, sessionDurationMin: 30, poolLengthM: 25, restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'BEGINNER' });
    assert(!result.valid, 'expected invalid');
  });

  await test('negative sessionDurationMin returns invalid', () => {
    const result = evaluateSwiming({ strokeType: 'freestyle', sessionDurationMin: -10, poolLengthM: 25, restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'BEGINNER' });
    assert(!result.valid, 'expected invalid for negative duration');
  });

  await test('NaN waterTempC returns invalid', () => {
    const result = evaluateSwiming({ strokeType: 'freestyle', sessionDurationMin: 30, poolLengthM: 25, restingHeartRate: 65, waterTempC: NaN, fitnessLevel: 'BEGINNER' });
    assert(!result.valid, 'expected invalid for NaN waterTempC');
  });

  await test('Infinity sessionDurationMin returns invalid', () => {
    const result = evaluateSwiming({ strokeType: 'freestyle', sessionDurationMin: Infinity, poolLengthM: 25, restingHeartRate: 65, waterTempC: 27, fitnessLevel: 'BEGINNER' });
    assert(!result.valid, 'expected invalid for Infinity duration');
  });
}

runTests().then(() => {
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failed tests:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
});
