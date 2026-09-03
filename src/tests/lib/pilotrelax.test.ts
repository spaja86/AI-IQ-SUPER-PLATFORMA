// SpajaUltraOmegaCore -∞Ω+∞ — PILOTRELAX Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetPilotrelaxMetrics,
  evaluatePilotrelax,
  getPilotrelaxHealthReport,
  PILOTRELAX_CONTRACT_VERSION,
  PILOTRELAX_LINKED_REPO_IMPACT,
  PILOTRELAX_PERFORMANCE_MAX_MS,
  PILOTRELAX_PERSONA_ID,
  PILOTRELAX_SLUG,
} from '../../lib/pilotrelax';

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
  _resetPilotrelaxMetrics();

  console.log('\n🔎 [pilotrelax] constants');

  await test('contract version is non-empty', () => {
    assert(PILOTRELAX_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(PILOTRELAX_PERSONA_ID === 'pilotrelax-calm-core', `unexpected persona id: ${PILOTRELAX_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(PILOTRELAX_SLUG === 'pilotrelax', `unexpected slug: ${PILOTRELAX_SLUG}`);
  });

  await test('fresh health report starts without last status', () => {
    const health = getPilotrelaxHealthReport();
    assert(health.lastStatus === null, 'lastStatus should be null before first evaluation');
  });

  console.log('\n🔎 [pilotrelax] engine');

  await test('evaluates a deterministic focus reset protocol', () => {
    const input = {
      referenceId: 'focus-1',
      objective: 'FOCUS' as const,
      environment: 'LOUNGE' as const,
      phaseOfDay: 'AFTERNOON' as const,
      stressLoad: 48,
      availableMinutes: 18,
      breathingCycles: 8,
      noiseLevelDb: 46,
      screenMinutesBeforeBreak: 40,
    };

    const first = evaluatePilotrelax(input);
    const second = evaluatePilotrelax(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'CALM', `expected CALM, got ${first.status}`);
    assert(first.recommendedProtocol === 'SILENT_RESET', `expected SILENT_RESET, got ${first.recommendedProtocol}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.disclaimer.length > 0, 'disclaimer must be present');
  });

  await test('sleep wind-down in quiet home environment returns valid result', () => {
    const result = evaluatePilotrelax({
      objective: 'SLEEP',
      environment: 'HOME',
      phaseOfDay: 'NIGHT',
      stressLoad: 22,
      availableMinutes: 35,
      breathingCycles: 12,
      noiseLevelDb: 28,
      screenMinutesBeforeBreak: 20,
    });

    assert(result.valid, 'result should be valid');
    assert(result.recommendedProtocol === 'SLEEP_WINDDOWN', 'expected sleep protocol');
    assert(result.recommendedMinutes === 35 || result.recommendedMinutes === 30, 'unexpected recommended minutes');
  });

  await test('high-noise cockpit reset produces warnings', () => {
    const result = evaluatePilotrelax({
      objective: 'RESET',
      environment: 'COCKPIT',
      phaseOfDay: 'AFTERNOON',
      stressLoad: 88,
      availableMinutes: 8,
      breathingCycles: 2,
      noiseLevelDb: 82,
      screenMinutesBeforeBreak: 100,
    });

    assert(result.valid, 'result should still be valid');
    assert(result.warnings.length > 0, 'expected warnings');
    assert(result.status === 'GROUNDED' || result.status === 'STEADY', `unexpected status: ${result.status}`);
  });

  await test('unsupported objective returns invalid result', () => {
    const result = evaluatePilotrelax({
      objective: 'NAP' as never,
      environment: 'HOME',
      phaseOfDay: 'EVENING',
      stressLoad: 30,
      availableMinutes: 20,
      breathingCycles: 6,
      noiseLevelDb: 35,
      screenMinutesBeforeBreak: 25,
    });

    assert(!result.valid, 'unsupported objective must be invalid');
  });

  await test('negative stress load returns invalid result', () => {
    const result = evaluatePilotrelax({
      objective: 'RECOVERY',
      environment: 'OUTDOOR',
      phaseOfDay: 'MORNING',
      stressLoad: -1,
      availableMinutes: 20,
      breathingCycles: 4,
      noiseLevelDb: 32,
      screenMinutesBeforeBreak: 10,
    });

    assert(!result.valid, 'negative stress load must be invalid');
  });

  await test('NaN stress load returns invalid result', () => {
    const result = evaluatePilotrelax({
      objective: 'RECOVERY',
      environment: 'OUTDOOR',
      phaseOfDay: 'MORNING',
      stressLoad: NaN,
      availableMinutes: 20,
      breathingCycles: 4,
      noiseLevelDb: 32,
      screenMinutesBeforeBreak: 10,
    });

    assert(!result.valid, 'NaN stress load must be invalid');
  });

  await test('fractional available minutes returns invalid result', () => {
    const result = evaluatePilotrelax({
      objective: 'RECOVERY',
      environment: 'OUTDOOR',
      phaseOfDay: 'MORNING',
      stressLoad: 20,
      availableMinutes: 12.5,
      breathingCycles: 4,
      noiseLevelDb: 32,
      screenMinutesBeforeBreak: 10,
    });

    assert(!result.valid, 'fractional available minutes must be invalid');
    assert(result.objective === null, 'invalid result objective should be null');
  });

  await test('Infinity screen minutes returns invalid result', () => {
    const result = evaluatePilotrelax({
      objective: 'FOCUS',
      environment: 'LOUNGE',
      phaseOfDay: 'AFTERNOON',
      stressLoad: 40,
      availableMinutes: 12,
      breathingCycles: 4,
      noiseLevelDb: 40,
      screenMinutesBeforeBreak: Infinity,
    });

    assert(!result.valid, 'Infinity screen minutes must be invalid');
  });

  await test('fractional screen minutes returns invalid result', () => {
    const result = evaluatePilotrelax({
      objective: 'FOCUS',
      environment: 'LOUNGE',
      phaseOfDay: 'AFTERNOON',
      stressLoad: 40,
      availableMinutes: 12,
      breathingCycles: 4,
      noiseLevelDb: 40,
      screenMinutesBeforeBreak: 12.5,
    });

    assert(!result.valid, 'fractional screen minutes must be invalid');
  });

  await test('invalid evaluation still increments health metrics', () => {
    _resetPilotrelaxMetrics();
    evaluatePilotrelax({
      objective: 'RESET',
      environment: 'HOME',
      phaseOfDay: 'EVENING',
      stressLoad: 30,
      availableMinutes: 10,
      breathingCycles: -1,
      noiseLevelDb: 30,
      screenMinutesBeforeBreak: 10,
    });

    const health = getPilotrelaxHealthReport();
    assert(health.evaluations === 1, `expected 1 invalid evaluation, got ${health.evaluations}`);
    assert(health.lastStatus === null, 'lastStatus should remain null after invalid evaluation');
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'invalid evaluation should set lastEvaluatedAt');
  });

  await test('health report reflects latest evaluation', () => {
    evaluatePilotrelax({
      objective: 'RESET',
      environment: 'OUTDOOR',
      phaseOfDay: 'EVENING',
      stressLoad: 35,
      availableMinutes: 20,
      breathingCycles: 10,
      noiseLevelDb: 38,
      screenMinutesBeforeBreak: 25,
    });

    const health = getPilotrelaxHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.linkedRepoImpact === PILOTRELAX_LINKED_REPO_IMPACT, 'linked repo impact must match constant');
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [pilotrelax] performance');

  await test(`evaluatePilotrelax completes within ${PILOTRELAX_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;

    for (let i = 0; i < samples; i++) {
      evaluatePilotrelax({
        objective: i % 4 === 0 ? 'RESET' : i % 4 === 1 ? 'FOCUS' : i % 4 === 2 ? 'RECOVERY' : 'SLEEP',
        environment: i % 3 === 0 ? 'HOME' : i % 3 === 1 ? 'LOUNGE' : 'OUTDOOR',
        phaseOfDay: i % 4 === 0 ? 'MORNING' : i % 4 === 1 ? 'AFTERNOON' : i % 4 === 2 ? 'EVENING' : 'NIGHT',
        stressLoad: 20 + (i % 70),
        availableMinutes: 5 + (i % 45),
        breathingCycles: i % 16,
        noiseLevelDb: 20 + (i % 50),
        screenMinutesBeforeBreak: i % 120,
      });
    }

    const average = (performance.now() - start) / samples;
    assert(average <= PILOTRELAX_PERFORMANCE_MAX_MS, `average ${average.toFixed(2)}ms > ${PILOTRELAX_PERFORMANCE_MAX_MS}ms`);
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
