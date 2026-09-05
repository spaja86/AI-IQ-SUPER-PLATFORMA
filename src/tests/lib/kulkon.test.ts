// SpajaUltraOmegaCore -∞Ω+∞ — KULKON Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetKulkonMetrics,
  evaluateKulkon,
  getKulkonHealthReport,
  KULKON_CONTRACT_VERSION,
  KULKON_LINKED_REPO_IMPACT,
  KULKON_PERFORMANCE_MAX_MS,
  KULKON_PERSONA_ID,
  KULKON_SLUG,
} from '../../lib/kulkon';

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
  _resetKulkonMetrics();

  console.log('\n🔎 [kulkon] constants');

  await test('contract version is non-empty', () => {
    assert(KULKON_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(KULKON_PERSONA_ID === 'kulkon-core', `unexpected persona id: ${KULKON_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(KULKON_SLUG === 'kulkon', `unexpected slug: ${KULKON_SLUG}`);
  });

  await test('linked repo impact is repo-local', () => {
    assert(KULKON_LINKED_REPO_IMPACT === 'none', `unexpected linked repo impact: ${KULKON_LINKED_REPO_IMPACT}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getKulkonHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [kulkon] engine');

  await test('evaluates deterministic alignment pathway', () => {
    const input = {
      referenceId: 'align-1',
      objective: 'ALIGNMENT' as const,
      environment: 'HYBRID' as const,
      rhythm: 'WEEKLY' as const,
      clarityScore: 78,
      trustScore: 72,
      accountabilityScore: 69,
      communicationLoad: 45,
      conflictRate: 28,
      participantCount: 12,
      windowDays: 18,
    };

    const first = evaluateKulkon(input);
    const second = evaluateKulkon(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'COHESIVE', `expected COHESIVE, got ${first.status}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.durationMs <= KULKON_PERFORMANCE_MAX_MS, `duration ${first.durationMs} exceeds ${KULKON_PERFORMANCE_MAX_MS}ms`);
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('high trust retention can reach exemplary', () => {
    const result = evaluateKulkon({
      objective: 'RETENTION',
      environment: 'ONSITE',
      rhythm: 'DAILY',
      clarityScore: 90,
      trustScore: 90,
      accountabilityScore: 92,
      communicationLoad: 20,
      conflictRate: 10,
      participantCount: 15,
      windowDays: 30,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'EXEMPLARY', `expected EXEMPLARY, got ${result.status}`);
    assert(result.recommendedAction === 'SCALE_PLAYBOOK', `expected SCALE_PLAYBOOK, got ${result.recommendedAction}`);
  });

  await test('high-load ad-hoc setup emits warnings', () => {
    const result = evaluateKulkon({
      objective: 'ONBOARDING',
      environment: 'REMOTE',
      rhythm: 'ADHOC',
      clarityScore: 44,
      trustScore: 38,
      accountabilityScore: 42,
      communicationLoad: 90,
      conflictRate: 74,
      participantCount: 40,
      windowDays: 7,
    });

    assert(result.valid, 'result should still be valid');
    assert(result.warnings.length >= 3, 'expected multiple warnings');
    assert(result.status === 'FRAGILE' || result.status === 'STABLE', `unexpected status: ${result.status}`);
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateKulkon({
      objective: 'UNKNOWN' as never,
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 60,
      trustScore: 60,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: 20,
      participantCount: 8,
      windowDays: 15,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('negative trust score returns invalid result', () => {
    const result = evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 60,
      trustScore: -1,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: 20,
      participantCount: 8,
      windowDays: 15,
    });

    assert(!result.valid, 'negative trust score must be invalid');
  });

  await test('NaN clarity score returns invalid result', () => {
    const result = evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: NaN,
      trustScore: 50,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: 20,
      participantCount: 8,
      windowDays: 15,
    });

    assert(!result.valid, 'NaN clarity score must be invalid');
  });

  await test('Infinity conflict rate returns invalid result', () => {
    const result = evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 60,
      trustScore: 60,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: Infinity,
      participantCount: 8,
      windowDays: 15,
    });

    assert(!result.valid, 'Infinity conflict rate must be invalid');
  });

  await test('fractional participant count returns invalid result', () => {
    const result = evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 60,
      trustScore: 60,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: 20,
      participantCount: 8.5,
      windowDays: 15,
    });

    assert(!result.valid, 'fractional participant count must be invalid');
    assert(result.objective === null, 'invalid result objective should be null');
  });

  await test('zero window days returns invalid result', () => {
    const result = evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 60,
      trustScore: 60,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: 20,
      participantCount: 8,
      windowDays: 0,
    });

    assert(!result.valid, 'zero windowDays must be invalid');
  });

  await test('successful evaluations update health metrics', () => {
    _resetKulkonMetrics();
    evaluateKulkon({
      objective: 'RETENTION',
      environment: 'ONSITE',
      rhythm: 'DAILY',
      clarityScore: 90,
      trustScore: 90,
      accountabilityScore: 92,
      communicationLoad: 20,
      conflictRate: 10,
      participantCount: 15,
      windowDays: 30,
    });

    const health = getKulkonHealthReport();
    assert(health.evaluations === 1, `expected 1 evaluation, got ${health.evaluations}`);
    assert(health.lastStatus === 'EXEMPLARY', `expected EXEMPLARY, got ${health.lastStatus}`);
    assert(health.lastEvaluatedAt !== null, 'lastEvaluatedAt should be recorded');
  });

  await test('invalid evaluations do not mutate prior valid metrics', () => {
    _resetKulkonMetrics();
    evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 78,
      trustScore: 72,
      accountabilityScore: 69,
      communicationLoad: 45,
      conflictRate: 28,
      participantCount: 12,
      windowDays: 18,
    });
    evaluateKulkon({
      objective: 'ALIGNMENT',
      environment: 'HYBRID',
      rhythm: 'WEEKLY',
      clarityScore: 60,
      trustScore: 60,
      accountabilityScore: 60,
      communicationLoad: 30,
      conflictRate: 20,
      participantCount: -1,
      windowDays: 15,
    });

    const health = getKulkonHealthReport();
    assert(health.evaluations === 1, `expected 1 evaluation, got ${health.evaluations}`);
    assert(health.lastStatus === 'COHESIVE', `expected COHESIVE, got ${health.lastStatus}`);
    assert(health.lastEvaluatedAt !== null, 'lastEvaluatedAt should remain recorded');
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
