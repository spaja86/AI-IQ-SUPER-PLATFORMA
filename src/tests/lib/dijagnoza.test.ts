// SpajaUltraOmegaCore -∞Ω+∞ — DIJAGNOZA Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateDijagnoza,
  getDijagnozaHealthReport,
  _resetDijagnozaMetrics,
  DIJAGNOZA_CONTRACT_VERSION,
  DIJAGNOZA_DISCLAIMER,
  DIJAGNOZA_MAX_DURATION_DAYS,
  DIJAGNOZA_PERFORMANCE_MAX_MS,
  DIJAGNOZA_PERSONA_ID,
} from '../../lib/dijagnoza';

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
  _resetDijagnozaMetrics();

  console.log('\n🔎 [dijagnoza] constants');

  await test('contract version is non-empty', () => {
    assert(DIJAGNOZA_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DIJAGNOZA_PERSONA_ID === 'dijagnoza-core', `unexpected persona id: ${DIJAGNOZA_PERSONA_ID}`);
  });

  await test('max duration days is stable', () => {
    assert(DIJAGNOZA_MAX_DURATION_DAYS === 730, `expected 730, got ${DIJAGNOZA_MAX_DURATION_DAYS}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(DIJAGNOZA_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  console.log('\n🔎 [dijagnoza] engine — valid cases');

  await test('flu symptoms → MEDIUM urgency and DOCTOR or MONITORING nextStep', () => {
    const result = evaluateDijagnoza({
      referenceId: 'flu-test',
      profile: { patientId: 'p-001', ageYears: 30, gender: 'MALE' },
      symptoms: ['temperatura', 'kašalj', 'umor', 'grlobolja'],
      durationDays: 2,
    });

    assert(result.valid, 'result should be valid');
    assert(['MEDIUM', 'HIGH'].includes(result.urgency), `unexpected urgency: ${result.urgency}`);
    assert(['DOCTOR', 'MONITORING'].includes(result.nextStep), `unexpected nextStep: ${result.nextStep}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('critical symptoms → CRITICAL urgency and EMERGENCY nextStep', () => {
    const result = evaluateDijagnoza({
      referenceId: 'critical-test',
      profile: { patientId: 'p-002' },
      symptoms: ['bol u grudima', 'kratkoća daha', 'znojenje', 'muka'],
      vitals: { temperatureC: 40.5, spO2Percent: 88, pulseBpm: 155 },
      durationDays: 1,
    });

    assert(result.valid, 'result should be valid');
    assert(result.urgency === 'CRITICAL', `expected CRITICAL, got ${result.urgency}`);
    assert(result.nextStep === 'EMERGENCY', `expected EMERGENCY, got ${result.nextStep}`);
    assert(result.warnings.some((w) => w.includes('temperatura')), 'missing temperature warning');
    assert(result.warnings.some((w) => w.includes('SpO2')), 'missing SpO2 warning');
    assert(result.warnings.some((w) => w.includes('puls')), 'missing pulse warning');
  });

  await test('temperature > 40°C alone triggers warnings', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['temperatura'],
      vitals: { temperatureC: 41.0 },
      durationDays: 1,
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.some((w) => w.includes('temperatura')), 'missing temperature warning');
  });

  await test('SpO2 < 90% triggers warning', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['otežano disanje'],
      vitals: { spO2Percent: 88 },
      durationDays: 1,
    });

    assert(result.valid, 'result should be valid');
    assert(['HIGH', 'CRITICAL'].includes(result.urgency), `expected HIGH or CRITICAL, got ${result.urgency}`);
    assert(result.warnings.some((w) => w.includes('SpO2')), 'missing SpO2 warning');
  });

  await test('low urgency symptoms → LOW or MEDIUM, REST or MONITORING', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['umor'],
      durationDays: 1,
    });

    assert(result.valid, 'result should be valid');
    assert(['LOW', 'MEDIUM'].includes(result.urgency), `unexpected urgency: ${result.urgency}`);
  });

  await test('differentials are sorted by probability descending', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['temperatura', 'kašalj', 'umor', 'grlobolja', 'curenje nosa', 'drhtavica'],
      durationDays: 2,
    });

    assert(result.valid, 'result should be valid');
    assert(result.differentials.length > 0, 'differentials should not be empty');
    for (let i = 1; i < result.differentials.length; i++) {
      assert(
        result.differentials[i - 1].probability >= result.differentials[i].probability,
        'differentials must be sorted descending',
      );
    }
  });

  await test('durationDays > 14 adds chronic warning', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['umor', 'kašalj'],
      durationDays: 20,
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.some((w) => w.includes('2 nedelje')), 'missing chronic warning');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateDijagnoza({
      profile: {},
      symptoms: ['bol u grudima', 'kratkoća daha'],
      vitals: { spO2Percent: 85 },
      durationDays: 1,
    });

    const health = getDijagnozaHealthReport();
    assert(health.evaluations > 0, 'evaluations should be > 0');
    assert(health.personaId === DIJAGNOZA_PERSONA_ID, 'personaId mismatch');
    assert(['CRITICAL', 'HIGH'].includes(health.lastUrgency), `unexpected lastUrgency: ${health.lastUrgency}`);
  });

  console.log('\n🔎 [dijagnoza] engine — edge cases');

  await test('empty symptoms → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: [],
      durationDays: 1,
    });

    assert(!result.valid, 'empty symptoms must be invalid');
  });

  await test('NaN durationDays → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['kašalj'],
      durationDays: Number.NaN,
    });

    assert(!result.valid, 'NaN durationDays must be invalid');
  });

  await test('Infinity durationDays → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['kašalj'],
      durationDays: Number.POSITIVE_INFINITY,
    });

    assert(!result.valid, 'Infinity durationDays must be invalid');
  });

  await test('negative durationDays → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['kašalj'],
      durationDays: -1,
    });

    assert(!result.valid, 'negative durationDays must be invalid');
  });

  await test(`durationDays > ${DIJAGNOZA_MAX_DURATION_DAYS} → invalid`, () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['kašalj'],
      durationDays: DIJAGNOZA_MAX_DURATION_DAYS + 1,
    });

    assert(!result.valid, 'durationDays above cap must be invalid');
  });

  await test('NaN temperature → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['temperatura'],
      vitals: { temperatureC: Number.NaN },
      durationDays: 1,
    });

    assert(!result.valid, 'NaN temperature must be invalid');
  });

  await test('temperature out of range → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['temperatura'],
      vitals: { temperatureC: 20 },
      durationDays: 1,
    });

    assert(!result.valid, 'temperature out of range must be invalid');
  });

  await test('negative pulseBpm → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['vrtoglavica'],
      vitals: { pulseBpm: -10 },
      durationDays: 1,
    });

    assert(!result.valid, 'negative pulseBpm must be invalid');
  });

  await test('spO2 > 100 → invalid', () => {
    const result = evaluateDijagnoza({
      profile: {},
      symptoms: ['kašalj'],
      vitals: { spO2Percent: 101 },
      durationDays: 1,
    });

    assert(!result.valid, 'spO2Percent > 100 must be invalid');
  });

  await test('result always contains disclaimer', () => {
    const valid = evaluateDijagnoza({
      profile: {},
      symptoms: ['kašalj'],
      durationDays: 1,
    });
    const invalid = evaluateDijagnoza({
      profile: {},
      symptoms: [],
      durationDays: 1,
    });
    assert(valid.disclaimer.length > 0, 'valid result must have disclaimer');
    assert(invalid.disclaimer.length > 0, 'invalid result must have disclaimer');
  });

  console.log('\n🔎 [dijagnoza] performance');

  await test(`evaluateDijagnoza completes within ${DIJAGNOZA_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateDijagnoza({
        profile: { ageYears: 30 + (i % 30) },
        symptoms: ['temperatura', 'kašalj', 'umor'],
        vitals: { temperatureC: 37 + (i % 4) * 0.5 },
        durationDays: 1 + (i % 10),
      });
    }
    const avg = (performance.now() - start) / samples;
    assert(avg <= DIJAGNOZA_PERFORMANCE_MAX_MS, `average ${avg.toFixed(2)}ms > ${DIJAGNOZA_PERFORMANCE_MAX_MS}ms`);
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
