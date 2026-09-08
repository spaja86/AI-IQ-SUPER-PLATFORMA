// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetGeografijaRealnaMetrics,
  evaluateGeografijaRealna,
  GEOGRAFIJA_REALNA_CONTRACT_VERSION,
  GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS,
  GEOGRAFIJA_REALNA_PERSONA_ID,
  GEOGRAFIJA_REALNA_SLUG,
  getGeografijaRealnaHealthReport,
} from '../../lib/geografija-realna';

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
  _resetGeografijaRealnaMetrics();

  console.log('\n🔎 [geografija-realna] constants');

  await test('contract version is non-empty', () => {
    assert(
      GEOGRAFIJA_REALNA_CONTRACT_VERSION.length > 0,
      'contract version must be defined',
    );
  });

  await test('persona id is stable', () => {
    assert(
      GEOGRAFIJA_REALNA_PERSONA_ID === 'geografija-realna-core',
      `unexpected persona id: ${GEOGRAFIJA_REALNA_PERSONA_ID}`,
    );
  });

  await test('slug is stable', () => {
    assert(
      GEOGRAFIJA_REALNA_SLUG === 'geografija-realna',
      `unexpected slug: ${GEOGRAFIJA_REALNA_SLUG}`,
    );
  });

  console.log('\n🔎 [geografija-realna] engine');

  await test('deterministic valid evaluation returns PRECISE', () => {
    const input = {
      referenceId: 'geo-1',
      objective: 'ANALYSIS' as const,
      regionScale: 'REGIONAL' as const,
      terrainComplexity: 'MEDIUM' as const,
      accuracyScore: 82,
      contextScore: 77,
      dataFreshnessScore: 79,
      riskScore: 28,
      timeWindowHours: 48,
      constraintsCount: 4,
    };

    const first = evaluateGeografijaRealna(input);
    const second = evaluateGeografijaRealna(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'PRECISE', `expected PRECISE, got ${first.status}`);
    assert(
      first.overallScore === second.overallScore,
      'overall score must be deterministic',
    );
    assert(first.status === second.status, 'status must be deterministic');
    assert(
      first.durationMs <= GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS,
      `duration ${first.durationMs} exceeds ${GEOGRAFIJA_REALNA_PERFORMANCE_MAX_MS}ms`,
    );
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('high-quality profile reaches ATLAS_READY', () => {
    const result = evaluateGeografijaRealna({
      objective: 'NAVIGATION',
      regionScale: 'LOCAL',
      terrainComplexity: 'LOW',
      accuracyScore: 100,
      contextScore: 100,
      dataFreshnessScore: 100,
      riskScore: 0,
      timeWindowHours: 12,
      constraintsCount: 0,
    });

    assert(result.valid, 'result should be valid');
    assert(
      result.status === 'ATLAS_READY',
      `expected ATLAS_READY, got ${result.status}`,
    );
    assert(
      result.recommendedAction === 'EXECUTE_PLAN',
      `expected EXECUTE_PLAN, got ${result.recommendedAction}`,
    );
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateGeografijaRealna({
      objective: 'UNKNOWN' as never,
      regionScale: 'REGIONAL',
      terrainComplexity: 'MEDIUM',
      accuracyScore: 60,
      contextScore: 60,
      dataFreshnessScore: 60,
      riskScore: 30,
      timeWindowHours: 48,
      constraintsCount: 2,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('negative score is invalid', () => {
    const result = evaluateGeografijaRealna({
      objective: 'LEARNING',
      regionScale: 'REGIONAL',
      terrainComplexity: 'MEDIUM',
      accuracyScore: -1,
      contextScore: 60,
      dataFreshnessScore: 60,
      riskScore: 30,
      timeWindowHours: 48,
      constraintsCount: 2,
    });

    assert(!result.valid, 'negative score must be invalid');
  });

  await test('NaN field is invalid', () => {
    const result = evaluateGeografijaRealna({
      objective: 'LEARNING',
      regionScale: 'REGIONAL',
      terrainComplexity: 'MEDIUM',
      accuracyScore: 60,
      contextScore: NaN,
      dataFreshnessScore: 60,
      riskScore: 30,
      timeWindowHours: 48,
      constraintsCount: 2,
    });

    assert(!result.valid, 'NaN must be invalid');
  });

  await test('Infinity field is invalid', () => {
    const result = evaluateGeografijaRealna({
      objective: 'LEARNING',
      regionScale: 'REGIONAL',
      terrainComplexity: 'MEDIUM',
      accuracyScore: 60,
      contextScore: 60,
      dataFreshnessScore: Infinity,
      riskScore: 30,
      timeWindowHours: 48,
      constraintsCount: 2,
    });

    assert(!result.valid, 'Infinity must be invalid');
  });

  await test('fractional constraintsCount is invalid', () => {
    const result = evaluateGeografijaRealna({
      objective: 'PLANNING',
      regionScale: 'GLOBAL',
      terrainComplexity: 'HIGH',
      accuracyScore: 68,
      contextScore: 65,
      dataFreshnessScore: 66,
      riskScore: 35,
      timeWindowHours: 96,
      constraintsCount: 2.5,
    });

    assert(!result.valid, 'fractional constraintsCount must be invalid');
    assert(result.objective === null, 'invalid result objective should be null');
  });

  await test('timeWindowHours = 0 is invalid', () => {
    const result = evaluateGeografijaRealna({
      objective: 'LEARNING',
      regionScale: 'LOCAL',
      terrainComplexity: 'LOW',
      accuracyScore: 70,
      contextScore: 70,
      dataFreshnessScore: 70,
      riskScore: 30,
      timeWindowHours: 0,
      constraintsCount: 0,
    });

    assert(!result.valid, 'zero timeWindowHours must be invalid');
  });

  await test('health metrics update only on valid evaluations', () => {
    _resetGeografijaRealnaMetrics();
    evaluateGeografijaRealna({
      objective: 'ANALYSIS',
      regionScale: 'REGIONAL',
      terrainComplexity: 'MEDIUM',
      accuracyScore: 82,
      contextScore: 77,
      dataFreshnessScore: 79,
      riskScore: 28,
      timeWindowHours: 48,
      constraintsCount: 4,
    });
    evaluateGeografijaRealna({
      objective: 'ANALYSIS',
      regionScale: 'REGIONAL',
      terrainComplexity: 'MEDIUM',
      accuracyScore: 82,
      contextScore: 77,
      dataFreshnessScore: 79,
      riskScore: 28,
      timeWindowHours: -1,
      constraintsCount: 4,
    });

    const health = getGeografijaRealnaHealthReport();
    assert(health.evaluations === 1, `expected 1 evaluation, got ${health.evaluations}`);
    assert(health.lastStatus === 'PRECISE', `expected PRECISE, got ${health.lastStatus}`);
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
