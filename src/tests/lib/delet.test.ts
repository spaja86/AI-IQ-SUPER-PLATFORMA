// SpajaUltraOmegaCore -∞Ω+∞ — DELET Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetDeletMetrics,
  DELET_CONTRACT_VERSION,
  DELET_LINKED_REPO_IMPACT,
  DELET_PERFORMANCE_MAX_MS,
  DELET_PERSONA_ID,
  DELET_SLUG,
  evaluateDelet,
  getDeletHealthReport,
} from '../../lib/delet';

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
  _resetDeletMetrics();

  console.log('\n🔎 [delet] constants');

  await test('contract version is non-empty', () => {
    assert(DELET_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(DELET_PERSONA_ID === 'delet-governance-core', `unexpected persona id: ${DELET_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(DELET_SLUG === 'delet', `unexpected slug: ${DELET_SLUG}`);
  });

  await test('linked repo impact is repo-local', () => {
    assert(DELET_LINKED_REPO_IMPACT === 'none', `unexpected linked repo impact: ${DELET_LINKED_REPO_IMPACT}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getDeletHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [delet] engine');

  await test('evaluates deterministic safe soft-delete pathway', () => {
    const input = {
      referenceId: 'safe-1',
      objective: 'SOFT_DELETE' as const,
      scope: 'SINGLE_RECORD' as const,
      dataSensitivityScore: 30,
      retentionAgeDays: 920,
      recoveryWindowHours: 96,
      dependencyCount: 2,
      backupCoverageScore: 92,
      legalHoldActive: false,
    };

    const first = evaluateDelet(input);
    const second = evaluateDelet(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'AUTO_APPROVE', `expected AUTO_APPROVE, got ${first.status}`);
    assert(first.recommendedAction === 'EXECUTE', `expected EXECUTE, got ${first.recommendedAction}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.durationMs <= DELET_PERFORMANCE_MAX_MS, `duration ${first.durationMs} exceeds ${DELET_PERFORMANCE_MAX_MS}ms`);
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('hard-delete tenant profile deterministically blocks execution', () => {
    const result = evaluateDelet({
      objective: 'HARD_DELETE',
      scope: 'TENANT',
      dataSensitivityScore: 70,
      retentionAgeDays: 1200,
      recoveryWindowHours: 72,
      dependencyCount: 34,
      backupCoverageScore: 85,
      legalHoldActive: false,
    });

    assert(result.valid, 'result should be valid');
    assert(result.status === 'BLOCK', `expected BLOCK, got ${result.status}`);
    assert(result.recommendedAction === 'ABORT', `expected ABORT, got ${result.recommendedAction}`);
    assert(result.warnings.some((w) => w.includes('Hard delete')), 'hard delete warning expected');
  });

  await test('legal hold forces block status', () => {
    const result = evaluateDelet({
      objective: 'RETENTION_EXPIRE',
      scope: 'BATCH',
      dataSensitivityScore: 42,
      retentionAgeDays: 730,
      recoveryWindowHours: 48,
      dependencyCount: 8,
      backupCoverageScore: 78,
      legalHoldActive: true,
    });

    assert(result.valid, 'result should remain valid');
    assert(result.status === 'BLOCK', `expected BLOCK, got ${result.status}`);
    assert(result.recommendedAction === 'ABORT', `expected ABORT, got ${result.recommendedAction}`);
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'DELETE_NOW' as never,
      scope: 'BATCH',
      dataSensitivityScore: 40,
      retentionAgeDays: 300,
      recoveryWindowHours: 24,
      dependencyCount: 1,
      backupCoverageScore: 75,
      legalHoldActive: false,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('NaN sensitivity score returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: NaN,
      retentionAgeDays: 100,
      recoveryWindowHours: 24,
      dependencyCount: 1,
      backupCoverageScore: 80,
      legalHoldActive: false,
    });

    assert(!result.valid, 'NaN dataSensitivityScore must be invalid');
  });

  await test('Infinity backup coverage returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'ANONYMIZE',
      scope: 'BATCH',
      dataSensitivityScore: 55,
      retentionAgeDays: 240,
      recoveryWindowHours: 36,
      dependencyCount: 6,
      backupCoverageScore: Infinity,
      legalHoldActive: false,
    });

    assert(!result.valid, 'Infinity backupCoverageScore must be invalid');
  });

  await test('negative dependency count returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 22,
      retentionAgeDays: 120,
      recoveryWindowHours: 12,
      dependencyCount: -1,
      backupCoverageScore: 90,
      legalHoldActive: false,
    });

    assert(!result.valid, 'negative dependencyCount must be invalid');
  });

  await test('zero recovery window returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 22,
      retentionAgeDays: 120,
      recoveryWindowHours: 0,
      dependencyCount: 1,
      backupCoverageScore: 90,
      legalHoldActive: false,
    });

    assert(!result.valid, 'zero recoveryWindowHours must be invalid');
  });

  await test('fractional retention age returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'RETENTION_EXPIRE',
      scope: 'BATCH',
      dataSensitivityScore: 22,
      retentionAgeDays: 12.5,
      recoveryWindowHours: 24,
      dependencyCount: 1,
      backupCoverageScore: 90,
      legalHoldActive: false,
    });

    assert(!result.valid, 'fractional retentionAgeDays must be invalid');
    assert(result.objective === null, 'invalid result objective should be null');
  });

  await test('zero retention age returns invalid result', () => {
    const result = evaluateDelet({
      objective: 'RETENTION_EXPIRE',
      scope: 'BATCH',
      dataSensitivityScore: 22,
      retentionAgeDays: 0,
      recoveryWindowHours: 24,
      dependencyCount: 1,
      backupCoverageScore: 90,
      legalHoldActive: false,
    });

    assert(!result.valid, 'zero retentionAgeDays must be invalid');
  });

  await test('low-reversibility anonymize request is blocked', () => {
    const result = evaluateDelet({
      objective: 'ANONYMIZE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 82,
      retentionAgeDays: 320,
      recoveryWindowHours: 2,
      dependencyCount: 44,
      backupCoverageScore: 12,
      legalHoldActive: false,
    });

    assert(result.valid, 'result should remain valid');
    assert(result.status === 'BLOCK', `expected BLOCK, got ${result.status}`);
  });

  await test('invalid evaluation still increments health metrics', () => {
    _resetDeletMetrics();
    evaluateDelet({
      objective: 'SOFT_DELETE',
      scope: 'SINGLE_RECORD',
      dataSensitivityScore: 45,
      retentionAgeDays: 120,
      recoveryWindowHours: 24,
      dependencyCount: 1,
      backupCoverageScore: -1,
      legalHoldActive: false,
    });

    const health = getDeletHealthReport();
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
