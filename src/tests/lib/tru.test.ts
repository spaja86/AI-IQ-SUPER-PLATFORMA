// SpajaUltraOmegaCore -∞Ω+∞ — TRU Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetTruMetrics,
  evaluateTru,
  getTruHealthReport,
  TRU_CONTRACT_VERSION,
  TRU_LINKED_REPO_IMPACT,
  TRU_PERFORMANCE_MAX_MS,
  TRU_PERSONA_ID,
  TRU_SLUG,
} from '../../lib/tru';

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
  _resetTruMetrics();

  console.log('\n🔎 [tru] constants');

  await test('contract version is non-empty', () => {
    assert(TRU_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(TRU_PERSONA_ID === 'tru-trust-core', `unexpected persona id: ${TRU_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(TRU_SLUG === 'tru', `unexpected slug: ${TRU_SLUG}`);
  });

  await test('linked repo impact is repo-local', () => {
    assert(TRU_LINKED_REPO_IMPACT === 'none', `unexpected linked repo impact: ${TRU_LINKED_REPO_IMPACT}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getTruHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [tru] engine');

  await test('evaluates deterministic trusted pathway', () => {
    const input = {
      referenceId: 'trusted-1',
      objective: 'COMMIT' as const,
      channel: 'MEETING' as const,
      evidenceLevel: 'STRONG' as const,
      transparencyScore: 90,
      reliabilityScore: 88,
      reciprocityScore: 82,
      riskLevel: 22,
      responseLatencyHours: 108,
      escalationCount: 1,
    };

    const first = evaluateTru(input);
    const second = evaluateTru(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'TRUSTED', `expected TRUSTED, got ${first.status}`);
    assert(first.recommendedAction === 'PROCEED', `expected PROCEED, got ${first.recommendedAction}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.durationMs <= TRU_PERFORMANCE_MAX_MS, `duration ${first.durationMs} exceeds ${TRU_PERFORMANCE_MAX_MS}ms`);
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('moderate profile returns caution with review action', () => {
    const result = evaluateTru({
      objective: 'ALIGN',
      channel: 'CALL',
      evidenceLevel: 'PARTIAL',
      transparencyScore: 58,
      reliabilityScore: 56,
      reciprocityScore: 52,
      riskLevel: 48,
      responseLatencyHours: 72,
      escalationCount: 2,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'CAUTION', `expected CAUTION, got ${result.status}`);
    assert(result.recommendedAction === 'SCHEDULE_REVIEW', `expected SCHEDULE_REVIEW, got ${result.recommendedAction}`);
  });

  await test('high-risk low-evidence profile returns warnings', () => {
    const result = evaluateTru({
      objective: 'NEGOTIATE',
      channel: 'ASYNC',
      evidenceLevel: 'NONE',
      transparencyScore: 28,
      reliabilityScore: 34,
      reciprocityScore: 30,
      riskLevel: 92,
      responseLatencyHours: 180,
      escalationCount: 7,
    });

    assert(result.valid, 'result should still be valid');
    assert(result.status === 'BLOCK', `expected BLOCK, got ${result.status}`);
    assert(result.warnings.length >= 4, 'expected multiple warnings');
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateTru({
      objective: 'PING' as never,
      channel: 'CALL',
      evidenceLevel: 'PARTIAL',
      transparencyScore: 60,
      reliabilityScore: 60,
      reciprocityScore: 60,
      riskLevel: 40,
      responseLatencyHours: 24,
      escalationCount: 1,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('NaN transparency score returns invalid result', () => {
    const result = evaluateTru({
      objective: 'VERIFY',
      channel: 'DOC_REVIEW',
      evidenceLevel: 'PARTIAL',
      transparencyScore: NaN,
      reliabilityScore: 65,
      reciprocityScore: 60,
      riskLevel: 25,
      responseLatencyHours: 36,
      escalationCount: 1,
    });

    assert(!result.valid, 'NaN transparency score must be invalid');
  });

  await test('fractional escalation count returns invalid result', () => {
    const result = evaluateTru({
      objective: 'ALIGN',
      channel: 'CALL',
      evidenceLevel: 'STRONG',
      transparencyScore: 72,
      reliabilityScore: 68,
      reciprocityScore: 64,
      riskLevel: 30,
      responseLatencyHours: 40,
      escalationCount: 1.5,
    });

    assert(!result.valid, 'fractional escalationCount must be invalid');
    assert(result.objective === null, 'invalid result objective should be null');
  });

  await test('Infinity risk level returns invalid result', () => {
    const result = evaluateTru({
      objective: 'VERIFY',
      channel: 'ASYNC',
      evidenceLevel: 'STRONG',
      transparencyScore: 60,
      reliabilityScore: 62,
      reciprocityScore: 58,
      riskLevel: Infinity,
      responseLatencyHours: 12,
      escalationCount: 0,
    });

    assert(!result.valid, 'Infinity risk level must be invalid');
  });

  await test('invalid evaluation still increments health metrics', () => {
    _resetTruMetrics();
    evaluateTru({
      objective: 'VERIFY',
      channel: 'DOC_REVIEW',
      evidenceLevel: 'PARTIAL',
      transparencyScore: 50,
      reliabilityScore: 50,
      reciprocityScore: 50,
      riskLevel: 50,
      responseLatencyHours: -1,
      escalationCount: 0,
    });

    const health = getTruHealthReport();
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
