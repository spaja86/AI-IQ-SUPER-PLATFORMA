// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetMrkliMrakMetrics,
  evaluateMrkliMrak,
  getMrkliMrakHealthReport,
  MRKLI_MRAK_CONTRACT_VERSION,
  MRKLI_MRAK_LINKED_REPO_IMPACT,
  MRKLI_MRAK_PERFORMANCE_MAX_MS,
  MRKLI_MRAK_PERSONA_ID,
  MRKLI_MRAK_SLUG,
} from '../../lib/mrkli-mrak';

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
  _resetMrkliMrakMetrics();

  console.log('\n🔎 [mrkli-mrak] constants');

  await test('contract version is non-empty', () => {
    assert(MRKLI_MRAK_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(MRKLI_MRAK_PERSONA_ID === 'mrkli-mrak-core', `unexpected persona id: ${MRKLI_MRAK_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(MRKLI_MRAK_SLUG === 'mrkli-mrak', `unexpected slug: ${MRKLI_MRAK_SLUG}`);
  });

  console.log('\n🔎 [mrkli-mrak] engine');

  await test('evaluates a valid exploration scenario', () => {
    const result = evaluateMrkliMrak({
      referenceId: 'mrak-ok',
      mode: 'EXPLORATION',
      riskTolerance: 'MEDIUM',
      ambientLightLux: 40,
      focusLevel: 78,
      sleepHours: 7,
      sessionMinutes: 45,
      supportTools: ['FLASHLIGHT', 'MAP'],
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'CAUTION' || result.status === 'CLEAR', `unexpected status: ${result.status}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('high darkness + high risk can produce blackout/dense state', () => {
    const result = evaluateMrkliMrak({
      mode: 'STEALTH',
      riskTolerance: 'HIGH',
      ambientLightLux: 0,
      focusLevel: 35,
      sleepHours: 3,
      sessionMinutes: 210,
      supportTools: ['MAP'],
    });

    assert(result.valid, 'result should be valid');
    assert(
      result.status === 'BLACKOUT' || result.status === 'DENSE',
      `expected BLACKOUT or DENSE, got ${result.status}`,
    );
    assert(result.warnings.length > 0, 'warnings should be present');
  });

  await test('empty object returns invalid result', () => {
    const result = evaluateMrkliMrak({} as never);
    assert(!result.valid, 'empty payload must be invalid');
  });

  await test('NaN ambientLightLux returns invalid result', () => {
    const result = evaluateMrkliMrak({
      mode: 'RECOVERY',
      riskTolerance: 'LOW',
      ambientLightLux: NaN,
      focusLevel: 70,
      sleepHours: 8,
      sessionMinutes: 30,
    });
    assert(!result.valid, 'NaN ambientLightLux must be invalid');
  });

  await test('Infinity sessionMinutes returns invalid result', () => {
    const result = evaluateMrkliMrak({
      mode: 'RECOVERY',
      riskTolerance: 'LOW',
      ambientLightLux: 120,
      focusLevel: 70,
      sleepHours: 8,
      sessionMinutes: Infinity,
    });
    assert(!result.valid, 'Infinity sessionMinutes must be invalid');
  });

  await test('out-of-range focus level returns invalid result', () => {
    const result = evaluateMrkliMrak({
      mode: 'RECOVERY',
      riskTolerance: 'LOW',
      ambientLightLux: 120,
      focusLevel: 101,
      sleepHours: 8,
      sessionMinutes: 30,
    });
    assert(!result.valid, 'focusLevel > 100 must be invalid');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateMrkliMrak({
      mode: 'RECOVERY',
      riskTolerance: 'LOW',
      ambientLightLux: 180,
      focusLevel: 88,
      sleepHours: 9,
      sessionMinutes: 25,
      supportTools: ['AUDIO_CUES'],
    });

    const health = getMrkliMrakHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.linkedRepoImpact === MRKLI_MRAK_LINKED_REPO_IMPACT, 'linked repo impact must match constant');
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [mrkli-mrak] performance');

  await test(`evaluateMrkliMrak completes within ${MRKLI_MRAK_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;

    for (let i = 0; i < samples; i++) {
      evaluateMrkliMrak({
        mode: i % 3 === 0 ? 'EXPLORATION' : i % 3 === 1 ? 'STEALTH' : 'RECOVERY',
        riskTolerance: i % 2 === 0 ? 'MEDIUM' : 'LOW',
        ambientLightLux: 20 + (i % 10) * 15,
        focusLevel: 55 + (i % 40),
        sleepHours: 4 + (i % 6),
        sessionMinutes: 20 + (i % 90),
        supportTools: i % 2 === 0 ? ['FLASHLIGHT', 'MAP'] : ['AUDIO_CUES'],
      });
    }

    const average = (performance.now() - start) / samples;
    assert(average <= MRKLI_MRAK_PERFORMANCE_MAX_MS, `average ${average.toFixed(2)}ms > ${MRKLI_MRAK_PERFORMANCE_MAX_MS}ms`);
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
