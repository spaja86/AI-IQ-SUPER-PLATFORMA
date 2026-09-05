// SpajaUltraOmegaCore -∞Ω+∞ — DUET Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetDuetMetrics,
  DUET_CONTRACT_VERSION,
  DUET_MAX_SHARED_WINDOW_HOURS,
  DUET_PERFORMANCE_MAX_MS,
  DUET_PERSONA_ID,
  evaluateDuet,
  getDuetHealthReport,
} from '../../lib/duet';

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
  _resetDuetMetrics();

  console.log('\n🎼 [duet] constants');

  await test('contract version is stable', () => {
    assert(DUET_CONTRACT_VERSION === 'v1', `unexpected contract version: ${DUET_CONTRACT_VERSION}`);
  });

  await test('persona id is stable', () => {
    assert(DUET_PERSONA_ID === 'duet-sync-core', `unexpected persona id: ${DUET_PERSONA_ID}`);
  });

  await test('shared window cap is stable', () => {
    assert(DUET_MAX_SHARED_WINDOW_HOURS === 168, `expected 168, got ${DUET_MAX_SHARED_WINDOW_HOURS}`);
  });

  console.log('\n🎼 [duet] engine');

  await test('evaluates a harmonized duet', () => {
    const result = evaluateDuet({
      referenceId: 'harmonized',
      objective: 'CREATE',
      mode: 'HYBRID',
      energyMatch: 'HIGH',
      clarityScore: 82,
      reciprocityScore: 78,
      trustScore: 84,
      rhythmScore: 86,
      tensionLevel: 18,
      sharedWindowHours: 24,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'HARMONIZED', `expected HARMONIZED, got ${result.status}`);
    assert(result.recommendedAction === 'LOCK_DUET', `expected LOCK_DUET, got ${result.recommendedAction}`);
    assert(result.recommendedWindowHours === 48, `expected 48, got ${result.recommendedWindowHours}`);
  });

  await test('repair duet produces fragile result and warnings', () => {
    const result = evaluateDuet({
      objective: 'REPAIR',
      mode: 'LIVE',
      energyMatch: 'LOW',
      clarityScore: 58,
      reciprocityScore: 52,
      trustScore: 46,
      rhythmScore: 44,
      tensionLevel: 62,
      sharedWindowHours: 6,
    });

    assert(result.valid, 'result should stay valid');
    assert(result.status === 'FRAGILE', `expected FRAGILE, got ${result.status}`);
    assert(result.recommendedAction === 'RUN_CHECKIN', `expected RUN_CHECKIN, got ${result.recommendedAction}`);
    assert(result.warnings.some((warning) => warning.includes('steadier rhythm')), 'repair warning missing');
    assert(result.warnings.some((warning) => warning.includes('Low energy match')), 'energy warning missing');
  });

  await test('NaN score is invalid', () => {
    const result = evaluateDuet({
      objective: 'DELIVER',
      mode: 'ASYNC',
      energyMatch: 'MEDIUM',
      clarityScore: Number.NaN,
      reciprocityScore: 70,
      trustScore: 72,
      rhythmScore: 74,
      tensionLevel: 20,
      sharedWindowHours: 24,
    });

    assert(!result.valid, 'NaN score must be invalid');
  });

  await test('Infinity score is invalid', () => {
    const result = evaluateDuet({
      objective: 'DELIVER',
      mode: 'ASYNC',
      energyMatch: 'MEDIUM',
      clarityScore: Number.POSITIVE_INFINITY,
      reciprocityScore: 70,
      trustScore: 72,
      rhythmScore: 74,
      tensionLevel: 20,
      sharedWindowHours: 24,
    });

    assert(!result.valid, 'Infinity score must be invalid');
  });

  await test('negative score is invalid', () => {
    const result = evaluateDuet({
      objective: 'DELIVER',
      mode: 'ASYNC',
      energyMatch: 'MEDIUM',
      clarityScore: -1,
      reciprocityScore: 70,
      trustScore: 72,
      rhythmScore: 74,
      tensionLevel: 20,
      sharedWindowHours: 24,
    });

    assert(!result.valid, 'negative score must be invalid');
  });

  await test('sharedWindowHours above cap is invalid', () => {
    const result = evaluateDuet({
      objective: 'DELIVER',
      mode: 'ASYNC',
      energyMatch: 'MEDIUM',
      clarityScore: 70,
      reciprocityScore: 70,
      trustScore: 72,
      rhythmScore: 74,
      tensionLevel: 20,
      sharedWindowHours: 169,
    });

    assert(!result.valid, 'sharedWindowHours above cap must be invalid');
  });

  await test('tensionLevel above 100 is invalid', () => {
    const result = evaluateDuet({
      objective: 'CREATE',
      mode: 'LIVE',
      energyMatch: 'HIGH',
      clarityScore: 70,
      reciprocityScore: 70,
      trustScore: 72,
      rhythmScore: 74,
      tensionLevel: 101,
      sharedWindowHours: 24,
    });

    assert(!result.valid, 'tensionLevel above 100 must be invalid');
  });

  await test(`evaluation exposes non-negative durationMs within the ${DUET_PERFORMANCE_MAX_MS}ms target contract`, () => {
    const result = evaluateDuet({
      objective: 'CREATE',
      mode: 'HYBRID',
      energyMatch: 'HIGH',
      clarityScore: 82,
      reciprocityScore: 78,
      trustScore: 84,
      rhythmScore: 86,
      tensionLevel: 18,
      sharedWindowHours: 24,
    });
    assert(Number.isFinite(result.durationMs), 'durationMs must be finite');
    assert(result.durationMs >= 0, `durationMs must be non-negative, got ${result.durationMs}`);
    assert(result.durationMs <= DUET_PERFORMANCE_MAX_MS, `durationMs ${result.durationMs}ms > ${DUET_PERFORMANCE_MAX_MS}ms`);
  });

  await test('health report reflects latest evaluation', () => {
    evaluateDuet({
      referenceId: 'health-check',
      objective: 'PERFORM',
      mode: 'RITUAL',
      energyMatch: 'HIGH',
      clarityScore: 76,
      reciprocityScore: 80,
      trustScore: 78,
      rhythmScore: 88,
      tensionLevel: 24,
      sharedWindowHours: 6,
    });
    const report = getDuetHealthReport();
    assert(report.personaId === DUET_PERSONA_ID, `unexpected persona: ${report.personaId}`);
    assert(report.lastStatus === 'HARMONIZED', `unexpected lastStatus: ${report.lastStatus}`);
    assert(report.evaluations >= 2, `expected evaluations >= 2, got ${report.evaluations}`);
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
