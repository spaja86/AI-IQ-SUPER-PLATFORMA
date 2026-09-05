// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetTrikotMetrics,
  evaluateTrikot,
  getTrikotHealthReport,
  TRIKOT_CONTRACT_VERSION,
  TRIKOT_LINKED_REPO_IMPACT,
  TRIKOT_PERFORMANCE_MAX_MS,
  TRIKOT_PERSONA_ID,
  TRIKOT_SLUG,
} from '../../lib/trikot';

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
  _resetTrikotMetrics();

  console.log('\n🔎 [trikot] constants');

  await test('contract version is non-empty', () => {
    assert(TRIKOT_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(TRIKOT_PERSONA_ID === 'trikot-style-core', `unexpected persona id: ${TRIKOT_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(TRIKOT_SLUG === 'trikot', `unexpected slug: ${TRIKOT_SLUG}`);
  });

  await test('linked repo impact is repo-local', () => {
    assert(TRIKOT_LINKED_REPO_IMPACT === 'none', `unexpected linked repo impact: ${TRIKOT_LINKED_REPO_IMPACT}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getTrikotHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [trikot] engine');

  await test('evaluates deterministic prime pathway', () => {
    const input = {
      referenceId: 'prime-1',
      objective: 'FORMAL' as const,
      season: 'WINTER' as const,
      dressCode: 'STRICT' as const,
      comfortScore: 88,
      weatherFitScore: 90,
      budgetFitScore: 82,
      mobilityScore: 78,
      maintenanceRisk: 20,
      prepTimeHours: 8,
      accessoryComplexity: 3,
    };

    const first = evaluateTrikot(input);
    const second = evaluateTrikot(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'PRIME', `expected PRIME, got ${first.status}`);
    assert(first.recommendedAction === 'LOCK_COMBINATION', `expected LOCK_COMBINATION, got ${first.recommendedAction}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.durationMs <= TRIKOT_PERFORMANCE_MAX_MS, `duration ${first.durationMs} exceeds ${TRIKOT_PERFORMANCE_MAX_MS}ms`);
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('moderate profile returns adjust status', () => {
    const result = evaluateTrikot({
      objective: 'BUSINESS',
      season: 'AUTUMN',
      dressCode: 'SMART',
      comfortScore: 56,
      weatherFitScore: 50,
      budgetFitScore: 55,
      mobilityScore: 52,
      maintenanceRisk: 45,
      prepTimeHours: 2,
      accessoryComplexity: 6,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'ADJUST', `expected ADJUST, got ${result.status}`);
    assert(result.recommendedAction === 'VALIDATE_DETAILS', `expected VALIDATE_DETAILS, got ${result.recommendedAction}`);
  });

  await test('stable profile lands in ready status', () => {
    const result = evaluateTrikot({
      objective: 'BUSINESS',
      season: 'SPRING',
      dressCode: 'RELAXED',
      comfortScore: 74,
      weatherFitScore: 72,
      budgetFitScore: 70,
      mobilityScore: 68,
      maintenanceRisk: 35,
      prepTimeHours: 6,
      accessoryComplexity: 4,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'READY', `expected READY, got ${result.status}`);
    assert(result.recommendedAction === 'LOCK_COMBINATION', `expected LOCK_COMBINATION, got ${result.recommendedAction}`);
  });

  await test('high-maintenance profile returns rework with warnings', () => {
    const result = evaluateTrikot({
      objective: 'CASUAL',
      season: 'SUMMER',
      dressCode: 'RELAXED',
      comfortScore: 35,
      weatherFitScore: 28,
      budgetFitScore: 48,
      mobilityScore: 30,
      maintenanceRisk: 93,
      prepTimeHours: 60,
      accessoryComplexity: 9,
    });

    assert(result.valid, 'result should still be valid');
    assert(result.status === 'REWORK', `expected REWORK, got ${result.status}`);
    assert(result.warnings.length >= 3, 'expected multiple warnings');
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateTrikot({
      objective: 'EVENING' as never,
      season: 'SPRING',
      dressCode: 'SMART',
      comfortScore: 60,
      weatherFitScore: 64,
      budgetFitScore: 58,
      mobilityScore: 55,
      maintenanceRisk: 34,
      prepTimeHours: 4,
      accessoryComplexity: 3,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('NaN comfort score returns invalid result', () => {
    const result = evaluateTrikot({
      objective: 'SPORT',
      season: 'SPRING',
      dressCode: 'RELAXED',
      comfortScore: NaN,
      weatherFitScore: 65,
      budgetFitScore: 60,
      mobilityScore: 72,
      maintenanceRisk: 20,
      prepTimeHours: 3,
      accessoryComplexity: 2,
    });

    assert(!result.valid, 'NaN comfortScore must be invalid');
  });

  await test('Infinity weather score returns invalid result', () => {
    const result = evaluateTrikot({
      objective: 'SPORT',
      season: 'SUMMER',
      dressCode: 'RELAXED',
      comfortScore: 70,
      weatherFitScore: Infinity,
      budgetFitScore: 66,
      mobilityScore: 78,
      maintenanceRisk: 24,
      prepTimeHours: 3,
      accessoryComplexity: 2,
    });

    assert(!result.valid, 'Infinity weatherFitScore must be invalid');
  });

  await test('negative score returns invalid result', () => {
    const result = evaluateTrikot({
      objective: 'BUSINESS',
      season: 'WINTER',
      dressCode: 'SMART',
      comfortScore: 60,
      weatherFitScore: 62,
      budgetFitScore: -1,
      mobilityScore: 64,
      maintenanceRisk: 35,
      prepTimeHours: 5,
      accessoryComplexity: 4,
    });

    assert(!result.valid, 'negative budgetFitScore must be invalid');
  });

  await test('out-of-range and fractional integer fields return invalid result', () => {
    const overBound = evaluateTrikot({
      objective: 'FORMAL',
      season: 'WINTER',
      dressCode: 'STRICT',
      comfortScore: 70,
      weatherFitScore: 80,
      budgetFitScore: 72,
      mobilityScore: 60,
      maintenanceRisk: 22,
      prepTimeHours: 169,
      accessoryComplexity: 4,
    });
    const fractional = evaluateTrikot({
      objective: 'FORMAL',
      season: 'WINTER',
      dressCode: 'STRICT',
      comfortScore: 70,
      weatherFitScore: 80,
      budgetFitScore: 72,
      mobilityScore: 60,
      maintenanceRisk: 22,
      prepTimeHours: 8,
      accessoryComplexity: 2.5,
    });
    const fractionalPrep = evaluateTrikot({
      objective: 'FORMAL',
      season: 'WINTER',
      dressCode: 'STRICT',
      comfortScore: 70,
      weatherFitScore: 80,
      budgetFitScore: 72,
      mobilityScore: 60,
      maintenanceRisk: 22,
      prepTimeHours: 8.5,
      accessoryComplexity: 4,
    });

    assert(!overBound.valid, 'prepTimeHours > 168 must be invalid');
    assert(!fractional.valid, 'fractional accessoryComplexity must be invalid');
    assert(!fractionalPrep.valid, 'fractional prepTimeHours must be invalid');
  });

  await test('invalid evaluation still increments health metrics', () => {
    _resetTrikotMetrics();
    evaluateTrikot({
      objective: 'CASUAL',
      season: 'SPRING',
      dressCode: 'RELAXED',
      comfortScore: 50,
      weatherFitScore: 50,
      budgetFitScore: 50,
      mobilityScore: 50,
      maintenanceRisk: 101,
      prepTimeHours: 5,
      accessoryComplexity: 3,
    });

    const health = getTrikotHealthReport();
    assert(health.evaluations === 1, `expected 1 evaluation, got ${health.evaluations}`);
    assert(health.lastStatus === null, 'invalid evaluation should keep lastStatus null');
    assert(health.lastEvaluatedAt !== null, 'lastEvaluatedAt should be recorded');
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
