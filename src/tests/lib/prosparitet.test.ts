// SpajaUltraOmegaCore -∞Ω+∞ — PROSPARITET Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateProsparitet,
  getProsparitetHealthReport,
  PROSPARITET_CONTRACT_VERSION,
  PROSPARITET_LINKED_REPO_IMPACT,
  PROSPARITET_PERFORMANCE_MAX_MS,
  PROSPARITET_PERSONA_ID,
  PROSPARITET_SLUG,
} from '../../lib/prosparitet';
import { _resetProsparitetMetrics } from '../../lib/prosparitet/engine';

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
  _resetProsparitetMetrics();

  console.log('\n🔎 [prosparitet] constants');

  await test('contract version is non-empty', () => {
    assert(PROSPARITET_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(PROSPARITET_PERSONA_ID === 'prosparitet-core', `unexpected persona id: ${PROSPARITET_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(PROSPARITET_SLUG === 'prosparitet', `unexpected slug: ${PROSPARITET_SLUG}`);
  });

  await test('linked repo impact is repo-local', () => {
    assert(PROSPARITET_LINKED_REPO_IMPACT === 'none', `unexpected linked repo impact: ${PROSPARITET_LINKED_REPO_IMPACT}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getProsparitetHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [prosparitet] engine');

  await test('evaluates a deterministic prosperity pathway', () => {
    const input = {
      referenceId: 'ps-1',
      objective: 'INVESTMENT' as const,
      horizon: 'MEDIUM' as const,
      riskAppetite: 'MEDIUM' as const,
      revenueStabilityScore: 79,
      marginScore: 71,
      liquidityScore: 77,
      debtLoadScore: 34,
      disciplineScore: 70,
      horizonMonths: 24,
    };

    const first = evaluateProsparitet(input);
    const second = evaluateProsparitet(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'GROWING' || first.status === 'PROSPER', `unexpected status: ${first.status}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.durationMs <= PROSPARITET_PERFORMANCE_MAX_MS, `duration ${first.durationMs} exceeds ${PROSPARITET_PERFORMANCE_MAX_MS}ms`);
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('strong profile reaches prosper status', () => {
    const result = evaluateProsparitet({
      objective: 'EXPANSION',
      horizon: 'LONG',
      riskAppetite: 'HIGH',
      revenueStabilityScore: 92,
      marginScore: 86,
      liquidityScore: 84,
      debtLoadScore: 28,
      disciplineScore: 90,
      horizonMonths: 48,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'PROSPER', `expected PROSPER, got ${result.status}`);
  });

  await test('high debt and weak liquidity produce warnings', () => {
    const result = evaluateProsparitet({
      objective: 'EXPANSION',
      horizon: 'SHORT',
      riskAppetite: 'HIGH',
      revenueStabilityScore: 42,
      marginScore: 30,
      liquidityScore: 20,
      debtLoadScore: 82,
      disciplineScore: 39,
      horizonMonths: 4,
    });

    assert(result.valid, 'result should still be valid');
    assert(result.warnings.length >= 3, 'expected multiple warnings');
    assert(result.status === 'CRITICAL' || result.status === 'STABLE', `unexpected status: ${result.status}`);
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateProsparitet({
      objective: 'UNKNOWN' as never,
      horizon: 'MEDIUM',
      riskAppetite: 'MEDIUM',
      revenueStabilityScore: 60,
      marginScore: 60,
      liquidityScore: 60,
      debtLoadScore: 40,
      disciplineScore: 60,
      horizonMonths: 12,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('NaN score returns invalid result', () => {
    const result = evaluateProsparitet({
      objective: 'CASHFLOW',
      horizon: 'SHORT',
      riskAppetite: 'LOW',
      revenueStabilityScore: NaN,
      marginScore: 55,
      liquidityScore: 60,
      debtLoadScore: 30,
      disciplineScore: 65,
      horizonMonths: 6,
    });

    assert(!result.valid, 'NaN score must be invalid');
  });

  await test('Infinity score returns invalid result', () => {
    const result = evaluateProsparitet({
      objective: 'SAVINGS',
      horizon: 'MEDIUM',
      riskAppetite: 'LOW',
      revenueStabilityScore: 60,
      marginScore: Infinity,
      liquidityScore: 60,
      debtLoadScore: 30,
      disciplineScore: 65,
      horizonMonths: 6,
    });

    assert(!result.valid, 'Infinity score must be invalid');
  });

  await test('negative score returns invalid result', () => {
    const result = evaluateProsparitet({
      objective: 'SAVINGS',
      horizon: 'MEDIUM',
      riskAppetite: 'LOW',
      revenueStabilityScore: 60,
      marginScore: 58,
      liquidityScore: -1,
      debtLoadScore: 30,
      disciplineScore: 65,
      horizonMonths: 6,
    });

    assert(!result.valid, 'negative score must be invalid');
  });

  await test('zero horizon months returns invalid result', () => {
    const result = evaluateProsparitet({
      objective: 'INVESTMENT',
      horizon: 'LONG',
      riskAppetite: 'MEDIUM',
      revenueStabilityScore: 70,
      marginScore: 68,
      liquidityScore: 72,
      debtLoadScore: 35,
      disciplineScore: 74,
      horizonMonths: 0,
    });

    assert(!result.valid, 'zero horizon months must be invalid');
  });

  await test('invalid evaluation still increments health metrics', () => {
    _resetProsparitetMetrics();
    evaluateProsparitet({
      objective: 'CASHFLOW',
      horizon: 'SHORT',
      riskAppetite: 'LOW',
      revenueStabilityScore: 60,
      marginScore: 55,
      liquidityScore: 62,
      debtLoadScore: 34,
      disciplineScore: 66,
      horizonMonths: -1,
    });

    const health = getProsparitetHealthReport();
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
