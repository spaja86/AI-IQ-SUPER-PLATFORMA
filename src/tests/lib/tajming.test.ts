// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateTajming,
  getTajmingHealthReport,
  _resetTajmingMetrics,
  TAJMING_CONTRACT_VERSION,
  TAJMING_PERFORMANCE_MAX_MS,
  TAJMING_PERSONA_ID,
} from '../../lib/tajming';

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
  _resetTajmingMetrics();

  console.log('\n🔎 [tajming] constants');

  await test('contract version is non-empty', () => {
    assert(TAJMING_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(TAJMING_PERSONA_ID === 'tajming-core', `unexpected persona id: ${TAJMING_PERSONA_ID}`);
  });

  await test('performance max is 50ms', () => {
    assert(TAJMING_PERFORMANCE_MAX_MS === 50, `expected 50, got ${TAJMING_PERFORMANCE_MAX_MS}`);
  });

  console.log('\n🔎 [tajming] engine — happy path');

  await test('physical activity at peak hour returns OPTIMAL_WINDOW', () => {
    const result = evaluateTajming({
      referenceId: 'test-1',
      activity: 'physical',
      timeOfDay: 17,
      energyLevel: 90,
    });
    assert(result.valid, `expected valid, got: ${result.warnings.join(', ')}`);
    assert(result.timingScore > 0, 'timingScore must be > 0');
    assert(
      result.status === 'OPTIMAL_WINDOW' || result.status === 'GOOD_WINDOW',
      `unexpected status: ${result.status}`,
    );
    assert(result.optimalWindow.length > 0, 'optimalWindow must be non-empty');
    assert(result.recommendation.length > 0, 'recommendation must be non-empty');
    assert(result.durationMs < TAJMING_PERFORMANCE_MAX_MS, `durationMs ${result.durationMs} exceeds ${TAJMING_PERFORMANCE_MAX_MS}ms`);
  });

  await test('cognitive activity at peak hour returns high score', () => {
    const result = evaluateTajming({ activity: 'cognitive', timeOfDay: 10, energyLevel: 80 });
    assert(result.valid, 'expected valid');
    assert(result.timingScore >= 60, `expected score >= 60, got ${result.timingScore}`);
  });

  await test('deadline urgency increases score', () => {
    const soonDeadline = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const r1 = evaluateTajming({ activity: 'administrative', timeOfDay: 9, energyLevel: 60, deadline: soonDeadline });
    const r2 = evaluateTajming({ activity: 'administrative', timeOfDay: 9, energyLevel: 60 });
    assert(r1.timingScore >= r2.timingScore, 'urgent deadline should not decrease score');
  });

  await test('health report increments evaluations', () => {
    _resetTajmingMetrics();
    evaluateTajming({ activity: 'social', timeOfDay: 14, energyLevel: 70 });
    evaluateTajming({ activity: 'creative', timeOfDay: 11, energyLevel: 75 });
    const report = getTajmingHealthReport();
    assert(report.evaluations === 2, `expected 2 evaluations, got ${report.evaluations}`);
    assert(report.personaId === TAJMING_PERSONA_ID, 'personaId mismatch');
  });

  console.log('\n🔎 [tajming] edge cases');

  await test('invalid activity returns invalid result', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = evaluateTajming({ activity: 'dancing' as any, timeOfDay: 10, energyLevel: 50 });
    assert(!result.valid, 'expected invalid');
    assert(result.timingScore === 0, 'timingScore must be 0 for invalid');
  });

  await test('timeOfDay = -1 returns invalid', () => {
    const result = evaluateTajming({ activity: 'physical', timeOfDay: -1, energyLevel: 50 });
    assert(!result.valid, 'expected invalid');
  });

  await test('timeOfDay = 24 returns invalid', () => {
    const result = evaluateTajming({ activity: 'physical', timeOfDay: 24, energyLevel: 50 });
    assert(!result.valid, 'expected invalid');
  });

  await test('energyLevel = -10 returns invalid', () => {
    const result = evaluateTajming({ activity: 'cognitive', timeOfDay: 10, energyLevel: -10 });
    assert(!result.valid, 'expected invalid');
  });

  await test('energyLevel = 101 returns invalid', () => {
    const result = evaluateTajming({ activity: 'cognitive', timeOfDay: 10, energyLevel: 101 });
    assert(!result.valid, 'expected invalid');
  });

  await test('NaN energyLevel returns invalid', () => {
    const result = evaluateTajming({ activity: 'cognitive', timeOfDay: 10, energyLevel: NaN });
    assert(!result.valid, 'expected invalid for NaN energyLevel');
  });

  await test('Infinity timeOfDay returns invalid', () => {
    const result = evaluateTajming({ activity: 'physical', timeOfDay: Infinity, energyLevel: 50 });
    assert(!result.valid, 'expected invalid for Infinity timeOfDay');
  });

  await test('past deadline adds warning but still valid', () => {
    const pastDeadline = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const result = evaluateTajming({ activity: 'administrative', timeOfDay: 9, energyLevel: 60, deadline: pastDeadline });
    assert(result.valid, 'should still be valid');
    assert(result.warnings.some((w) => w.includes('past')), 'should warn about past deadline');
  });

  await test('invalid deadline string adds warning but still valid', () => {
    const result = evaluateTajming({ activity: 'social', timeOfDay: 12, energyLevel: 70, deadline: 'not-a-date' });
    assert(result.valid, 'should be valid');
    assert(result.warnings.length > 0, 'should have warnings for invalid deadline');
  });
}

runTests().then(() => {
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failed tests:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
});
