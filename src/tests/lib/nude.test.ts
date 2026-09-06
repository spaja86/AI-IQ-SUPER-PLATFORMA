// SpajaUltraOmegaCore -∞Ω+∞ — NUDE Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetNudeMetrics,
  evaluateNude,
  getNudeHealthReport,
  NUDE_CONTRACT_VERSION,
  NUDE_LINKED_REPO_IMPACT,
  NUDE_PERFORMANCE_MAX_MS,
  NUDE_PERSONA_ID,
  NUDE_SLUG,
} from '../../lib/nude';

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
  _resetNudeMetrics();

  console.log('\n🔎 [nude] constants');

  await test('contract version is non-empty', () => {
    assert(NUDE_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(NUDE_PERSONA_ID === 'nude-balance-core', `unexpected persona id: ${NUDE_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(NUDE_SLUG === 'nude', `unexpected slug: ${NUDE_SLUG}`);
  });

  console.log('\n🔎 [nude] engine');

  await test('evaluates deterministic balanced payload', () => {
    const input = {
      referenceId: 'nude-balanced-1',
      mode: 'FOCUS' as const,
      environment: 'WORK' as const,
      priority: 'MEDIUM' as const,
      stressLevel: 42,
      contextLoad: 58,
      sessionMinutes: 75,
      breaksTaken: 2,
    };

    const resultA = evaluateNude(input);
    const resultB = evaluateNude(input);

    assert(resultA.valid, 'first result must be valid');
    assert(resultB.valid, 'second result must be valid');
    assert(resultA.readinessScore === resultB.readinessScore, 'readinessScore must be deterministic');
    assert(resultA.status === resultB.status, 'status must be deterministic');
    assert(resultA.status === 'BALANCED', `expected BALANCED, got ${resultA.status}`);
  });

  await test('zero-input boundaries remain valid', () => {
    const result = evaluateNude({
      mode: 'RESET',
      environment: 'HOME',
      priority: 'LOW',
      stressLevel: 0,
      contextLoad: 0,
      sessionMinutes: 0,
      breaksTaken: 0,
    });

    assert(result.valid, 'zero-input case should be valid');
    assert(Number.isFinite(result.readinessScore), 'readinessScore must be finite');
  });

  await test('negative stress level returns invalid result', () => {
    const result = evaluateNude({
      mode: 'RECOVERY',
      environment: 'HOME',
      priority: 'LOW',
      stressLevel: -1,
      contextLoad: 20,
      sessionMinutes: 30,
    });

    assert(!result.valid, 'negative stressLevel must be invalid');
  });

  await test('NaN contextLoad returns invalid result', () => {
    const result = evaluateNude({
      mode: 'SOCIAL',
      environment: 'OUTDOOR',
      priority: 'LOW',
      stressLevel: 30,
      contextLoad: Number.NaN,
      sessionMinutes: 30,
    });

    assert(!result.valid, 'NaN contextLoad must be invalid');
  });

  await test('Infinity sessionMinutes returns invalid result', () => {
    const result = evaluateNude({
      mode: 'SOCIAL',
      environment: 'OUTDOOR',
      priority: 'LOW',
      stressLevel: 30,
      contextLoad: 20,
      sessionMinutes: Number.POSITIVE_INFINITY,
    });

    assert(!result.valid, 'Infinity sessionMinutes must be invalid');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateNude({
      mode: 'RECOVERY',
      environment: 'HOME',
      priority: 'HIGH',
      stressLevel: 80,
      contextLoad: 66,
      sessionMinutes: 120,
      breaksTaken: 1,
    });

    const health = getNudeHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.linkedRepoImpact === NUDE_LINKED_REPO_IMPACT, 'linked repo impact must match constant');
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [nude] performance');

  await test(`evaluateNude completes within ${NUDE_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateNude({
        mode: i % 2 === 0 ? 'FOCUS' : 'RESET',
        environment: i % 3 === 0 ? 'WORK' : 'HOME',
        priority: i % 4 === 0 ? 'HIGH' : 'MEDIUM',
        stressLevel: i % 101,
        contextLoad: (i * 3) % 101,
        sessionMinutes: (i * 2) % 241,
        breaksTaken: i % 5,
      });
    }

    const average = (performance.now() - start) / samples;
    assert(average <= NUDE_PERFORMANCE_MAX_MS, `average ${average.toFixed(2)}ms > ${NUDE_PERFORMANCE_MAX_MS}ms`);
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
