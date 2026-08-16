// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateDnevnaSvetlost,
  getDnevnaSvetlostHealthReport,
  _resetDnevnaSvetlostMetrics,
  DNEVNA_SVETLOST_CONTRACT_VERSION,
  DNEVNA_SVETLOST_MAX_AMBIENT_LUX,
  DNEVNA_SVETLOST_PERFORMANCE_MAX_MS,
  DNEVNA_SVETLOST_PERSONA_ID,
} from '../../lib/dnevna-svetlost';

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
  _resetDnevnaSvetlostMetrics();

  console.log('\n🔎 [dnevna-svetlost] constants');

  await test('contract version is non-empty', () => {
    assert(DNEVNA_SVETLOST_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DNEVNA_SVETLOST_PERSONA_ID === 'dnevna-svetlost-core', `unexpected persona id: ${DNEVNA_SVETLOST_PERSONA_ID}`);
  });

  await test('max ambient lux is stable', () => {
    assert(DNEVNA_SVETLOST_MAX_AMBIENT_LUX === 100000, `expected 100000, got ${DNEVNA_SVETLOST_MAX_AMBIENT_LUX}`);
  });

  console.log('\n🔎 [dnevna-svetlost] engine — happy path');

  await test('MORNING low-exposure SPF_30 → OPTIMAL', () => {
    const result = evaluateDnevnaSvetlost({
      referenceId: 'morning-optimal',
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 8000,
      uvIndex: 3,
      focusLevel: 80,
      sleepHours: 8,
      exposureMinutes: 30,
      supportTools: ['SUNGLASSES'],
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'OPTIMAL', `expected OPTIMAL, got ${result.status}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.durationMs >= 0, 'durationMs must be non-negative');
  });

  await test('MIDDAY high UV no protection → OVEREXPOSURE + warnings', () => {
    const result = evaluateDnevnaSvetlost({
      referenceId: 'midday-danger',
      mode: 'MIDDAY',
      uvProtection: 'NONE',
      ambientLightLux: 80000,
      uvIndex: 10,
      focusLevel: 60,
      sleepHours: 7,
      exposureMinutes: 180,
      supportTools: [],
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'OVEREXPOSURE', `expected OVEREXPOSURE, got ${result.status}`);
    assert(result.warnings.length > 0, 'warnings should be generated');
  });

  await test('AFTERNOON moderate conditions → MODERATE or CAUTION', () => {
    const result = evaluateDnevnaSvetlost({
      referenceId: 'afternoon-mod',
      mode: 'AFTERNOON',
      uvProtection: 'SPF_15',
      ambientLightLux: 30000,
      uvIndex: 5,
      focusLevel: 65,
      sleepHours: 6,
      exposureMinutes: 90,
      supportTools: ['HAT'],
    });

    assert(result.valid, 'result should be valid');
    assert(
      result.status === 'MODERATE' || result.status === 'CAUTION',
      `expected MODERATE or CAUTION, got ${result.status}`,
    );
  });

  await test('EVENING low UV full shade → OPTIMAL', () => {
    const result = evaluateDnevnaSvetlost({
      referenceId: 'evening-optimal',
      mode: 'EVENING',
      uvProtection: 'FULL_SHADE',
      ambientLightLux: 500,
      uvIndex: 0,
      focusLevel: 90,
      sleepHours: 8,
      exposureMinutes: 60,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'OPTIMAL', `expected OPTIMAL, got ${result.status}`);
    assert(result.warnings.length === 0, 'no warnings expected for safe evening conditions');
  });

  await test('wellbeingScore is composite of brightness, comfort, productivity', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 2,
      focusLevel: 75,
      sleepHours: 7,
      exposureMinutes: 45,
    });

    assert(result.valid, 'result should be valid');
    assert(result.wellbeingScore >= 0 && result.wellbeingScore <= 100, 'wellbeingScore out of range');
    assert(result.brightnessScore >= 0 && result.brightnessScore <= 100, 'brightnessScore out of range');
    assert(result.comfortScore >= 0 && result.comfortScore <= 100, 'comfortScore out of range');
    assert(result.productivityScore >= 0 && result.productivityScore <= 100, 'productivityScore out of range');
  });

  await test('warning: low focus + low sleep', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_15',
      ambientLightLux: 4000,
      uvIndex: 2,
      focusLevel: 30,
      sleepHours: 4,
      exposureMinutes: 60,
    });

    assert(result.valid, 'result should be valid');
    assert(
      result.warnings.some((w) => w.includes('sleep')),
      'expected sleep warning',
    );
  });

  await test('warning: bright morning without sunglasses', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 15000,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 40,
      supportTools: [],
    });

    assert(result.valid, 'result should be valid');
    assert(
      result.warnings.some((w) => w.includes('SUNGLASSES')),
      'expected SUNGLASSES warning',
    );
  });

  await test('recommendedToolset excludes already-carried tools', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MIDDAY',
      uvProtection: 'SPF_50',
      ambientLightLux: 50000,
      uvIndex: 6,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 60,
      supportTools: ['SUNGLASSES', 'HAT'],
    });

    assert(result.valid, 'result should be valid');
    assert(!result.recommendedToolset.includes('SUNGLASSES'), 'SUNGLASSES already carried; should not be in recommended');
    assert(!result.recommendedToolset.includes('HAT'), 'HAT already carried; should not be in recommended');
  });

  console.log('\n🔎 [dnevna-svetlost] engine — edge cases');

  await test('NaN ambientLightLux → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: NaN,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    assert(!result.valid, 'expected invalid for NaN ambientLightLux');
  });

  await test('Infinity uvIndex → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: Infinity,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    assert(!result.valid, 'expected invalid for Infinity uvIndex');
  });

  await test('negative focusLevel → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 3,
      focusLevel: -10,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    assert(!result.valid, 'expected invalid for negative focusLevel');
  });

  await test('exposureMinutes = 0 → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 0,
    });
    assert(!result.valid, 'expected invalid for 0 exposureMinutes');
  });

  await test('ambientLightLux = 0 boundary → valid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'EVENING',
      uvProtection: 'NONE',
      ambientLightLux: 0,
      uvIndex: 0,
      focusLevel: 60,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    assert(result.valid, 'expected valid for zero ambientLightLux');
  });

  await test('ambientLightLux = 100000 boundary → valid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MIDDAY',
      uvProtection: 'FULL_SHADE',
      ambientLightLux: 100000,
      uvIndex: 8,
      focusLevel: 60,
      sleepHours: 7,
      exposureMinutes: 60,
    });
    assert(result.valid, 'expected valid for max ambientLightLux with full shade');
  });

  await test('negative uvIndex → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: -1,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    assert(!result.valid, 'expected invalid for negative uvIndex');
  });

  await test('uvIndex > 11 → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MIDDAY',
      uvProtection: 'SPF_50',
      ambientLightLux: 50000,
      uvIndex: 12,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 60,
    });
    assert(!result.valid, 'expected invalid for uvIndex > 11');
  });

  await test('unsupported supportTool → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
      supportTools: ['LASER_VISOR' as never],
    });
    assert(!result.valid, 'expected invalid for unsupported tool');
  });

  await test('invalid mode → invalid', () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MIDNIGHT' as never,
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 3,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    assert(!result.valid, 'expected invalid for unknown mode');
  });

  console.log('\n🔎 [dnevna-svetlost] performance');

  await test(`evaluation completes within ${DNEVNA_SVETLOST_PERFORMANCE_MAX_MS}ms`, () => {
    const result = evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 8000,
      uvIndex: 3,
      focusLevel: 80,
      sleepHours: 8,
      exposureMinutes: 30,
    });
    assert(
      result.durationMs < DNEVNA_SVETLOST_PERFORMANCE_MAX_MS,
      `evaluation took ${result.durationMs}ms, expected < ${DNEVNA_SVETLOST_PERFORMANCE_MAX_MS}ms`,
    );
  });

  console.log('\n🔎 [dnevna-svetlost] health report & metrics');

  await test('health report reflects evaluation count', () => {
    _resetDnevnaSvetlostMetrics();
    evaluateDnevnaSvetlost({
      mode: 'MORNING',
      uvProtection: 'SPF_30',
      ambientLightLux: 5000,
      uvIndex: 2,
      focusLevel: 70,
      sleepHours: 7,
      exposureMinutes: 30,
    });
    evaluateDnevnaSvetlost({
      mode: 'MIDDAY',
      uvProtection: 'SPF_50',
      ambientLightLux: 60000,
      uvIndex: 8,
      focusLevel: 65,
      sleepHours: 7,
      exposureMinutes: 60,
    });
    const report = getDnevnaSvetlostHealthReport();
    assert(report.evaluations === 2, `expected 2 evaluations, got ${report.evaluations}`);
    assert(report.lastEvaluatedAt !== null, 'lastEvaluatedAt should be set');
  });

  await test('_resetDnevnaSvetlostMetrics resets counters', () => {
    _resetDnevnaSvetlostMetrics();
    const report = getDnevnaSvetlostHealthReport();
    assert(report.evaluations === 0, 'evaluations should be 0 after reset');
    assert(report.lastEvaluatedAt === null, 'lastEvaluatedAt should be null after reset');
    assert(report.lastStatus === 'OPTIMAL', `lastStatus should be OPTIMAL after reset, got ${report.lastStatus}`);
  });

  await test('health report has all required fields', () => {
    const report = getDnevnaSvetlostHealthReport();
    assert(report.personaId === 'dnevna-svetlost-core', 'wrong personaId');
    assert(report.displayName === 'DNEVNA SVETLOST', 'wrong displayName');
    assert(report.slug === 'dnevna-svetlost', 'wrong slug');
    assert(report.contractVersion === 'v1', 'wrong contractVersion');
    assert(report.moduleVersion === '1.0.0', 'wrong moduleVersion');
    assert(Array.isArray(report.supportedModes) && report.supportedModes.length === 4, 'expected 4 modes');
    assert(Array.isArray(report.supportedTools) && report.supportedTools.length === 4, 'expected 4 tools');
  });

  // Summary
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ passed: ${passed}   ❌ failed: ${failed}`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected test runner error:', err);
  process.exit(1);
});
