// SpajaUltraOmegaCore -∞Ω+∞ — OPKONGO Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetOpkongoMetrics,
  evaluateOpkongo,
  getOpkongoHealthReport,
  OPKONGO_CONTRACT_VERSION,
  OPKONGO_LINKED_REPO_IMPACT,
  OPKONGO_PERFORMANCE_MAX_MS,
  OPKONGO_PERSONA_ID,
  OPKONGO_SLUG,
} from '../../lib/opkongo';

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
  _resetOpkongoMetrics();

  console.log('\n🔎 [opkongo] constants');

  await test('contract version is non-empty', () => {
    assert(OPKONGO_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(OPKONGO_PERSONA_ID === 'opkongo-commit-core', `unexpected persona id: ${OPKONGO_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(OPKONGO_SLUG === 'opkongo', `unexpected slug: ${OPKONGO_SLUG}`);
  });

  await test('linked repo impact is repo-local', () => {
    assert(OPKONGO_LINKED_REPO_IMPACT === 'none', `unexpected linked repo impact: ${OPKONGO_LINKED_REPO_IMPACT}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getOpkongoHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [opkongo] engine');

  await test('evaluates a deterministic negotiation pathway', () => {
    const input = {
      referenceId: 'neg-1',
      objective: 'NEGOTIATION' as const,
      channel: 'MEETING' as const,
      relationshipTemperature: 'WARM' as const,
      clarityScore: 78,
      leverageScore: 66,
      trustScore: 74,
      urgencyLevel: 52,
      followUpCount: 2,
      timeWindowHours: 36,
    };

    const first = evaluateOpkongo(input);
    const second = evaluateOpkongo(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'ENGAGE', `expected ENGAGE, got ${first.status}`);
    assert(first.recommendedAction === 'BOOK_CALL', `expected BOOK_CALL, got ${first.recommendedAction}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.durationMs <= OPKONGO_PERFORMANCE_MAX_MS, `duration ${first.durationMs} exceeds ${OPKONGO_PERFORMANCE_MAX_MS}ms`);
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('closing with hot relationship reaches commit status', () => {
    const result = evaluateOpkongo({
      objective: 'CLOSING',
      channel: 'CALL',
      relationshipTemperature: 'HOT',
      clarityScore: 88,
      leverageScore: 72,
      trustScore: 84,
      urgencyLevel: 64,
      followUpCount: 3,
      timeWindowHours: 60,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'COMMIT', `expected COMMIT, got ${result.status}`);
    assert(result.recommendedAction === 'CLOSE_NEXT_STEP', `expected CLOSE_NEXT_STEP, got ${result.recommendedAction}`);
  });

  await test('high-pressure cold closing produces warnings', () => {
    const result = evaluateOpkongo({
      objective: 'CLOSING',
      channel: 'EMAIL',
      relationshipTemperature: 'COLD',
      clarityScore: 38,
      leverageScore: 32,
      trustScore: 24,
      urgencyLevel: 91,
      followUpCount: 6,
      timeWindowHours: 5,
    });

    assert(result.valid, 'result should still be valid');
    assert(result.warnings.length >= 3, 'expected multiple warnings');
    assert(result.status === 'HOLD' || result.status === 'PREP', `unexpected status: ${result.status}`);
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateOpkongo({
      objective: 'PING' as never,
      channel: 'EMAIL',
      relationshipTemperature: 'WARM',
      clarityScore: 60,
      leverageScore: 55,
      trustScore: 55,
      urgencyLevel: 30,
      followUpCount: 1,
      timeWindowHours: 12,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('negative trust score returns invalid result', () => {
    const result = evaluateOpkongo({
      objective: 'FOLLOW_UP',
      channel: 'ASYNC',
      relationshipTemperature: 'WARM',
      clarityScore: 55,
      leverageScore: 44,
      trustScore: -1,
      urgencyLevel: 20,
      followUpCount: 0,
      timeWindowHours: 20,
    });

    assert(!result.valid, 'negative trust score must be invalid');
  });

  await test('NaN clarity score returns invalid result', () => {
    const result = evaluateOpkongo({
      objective: 'OUTREACH',
      channel: 'EMAIL',
      relationshipTemperature: 'COLD',
      clarityScore: NaN,
      leverageScore: 50,
      trustScore: 40,
      urgencyLevel: 20,
      followUpCount: 0,
      timeWindowHours: 8,
    });

    assert(!result.valid, 'NaN clarity score must be invalid');
  });

  await test('fractional follow-up count returns invalid result', () => {
    const result = evaluateOpkongo({
      objective: 'FOLLOW_UP',
      channel: 'CALL',
      relationshipTemperature: 'WARM',
      clarityScore: 65,
      leverageScore: 60,
      trustScore: 61,
      urgencyLevel: 41,
      followUpCount: 1.5,
      timeWindowHours: 18,
    });

    assert(!result.valid, 'fractional followUpCount must be invalid');
    assert(result.objective === null, 'invalid result objective should be null');
  });

  await test('zero time window returns invalid result', () => {
    const result = evaluateOpkongo({
      objective: 'NEGOTIATION',
      channel: 'MEETING',
      relationshipTemperature: 'HOT',
      clarityScore: 70,
      leverageScore: 68,
      trustScore: 75,
      urgencyLevel: 48,
      followUpCount: 1,
      timeWindowHours: 0,
    });

    assert(!result.valid, 'zero time window must be invalid');
  });

  await test('invalid evaluation still increments health metrics', () => {
    _resetOpkongoMetrics();
    evaluateOpkongo({
      objective: 'OUTREACH',
      channel: 'EMAIL',
      relationshipTemperature: 'COLD',
      clarityScore: 50,
      leverageScore: 44,
      trustScore: 40,
      urgencyLevel: 20,
      followUpCount: -1,
      timeWindowHours: 12,
    });

    const health = getOpkongoHealthReport();
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
