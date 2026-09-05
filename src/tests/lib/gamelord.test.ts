import {
  _resetGamelordMetrics,
  evaluateGamelord,
  getGamelordHealthReport,
  GAMELORD_CONTRACT_VERSION,
  GAMELORD_DISPLAY_NAME,
  GAMELORD_PERFORMANCE_MAX_MS,
  GAMELORD_SLUG,
} from '../../lib/gamelord';

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
  _resetGamelordMetrics();

  await test('constants are stable', () => {
    assert(GAMELORD_SLUG === 'gamelord', 'slug mismatch');
    assert(GAMELORD_DISPLAY_NAME === 'GAMES (GAMELORD)', 'display mismatch');
    assert(GAMELORD_CONTRACT_VERSION === 'v1', 'contract mismatch');
  });

  await test('deterministic evaluation gives same dominance score', () => {
    const input = {
      referenceId: 'same-input',
      mode: 'DUO' as const,
      strategyScore: 82,
      executionScore: 76,
      consistencyScore: 74,
      riskControlScore: 81,
      penaltyPoints: 12,
      anomalyCount: 1,
      matchDurationMs: 420000,
    };

    const first = evaluateGamelord(input);
    const second = evaluateGamelord(input);
    assert(first.valid && second.valid, 'both evaluations should be valid');
    assert(first.dominanceScore === second.dominanceScore, 'dominance score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
  });

  await test('NaN score fails validation', () => {
    const result = evaluateGamelord({
      mode: 'SOLO',
      strategyScore: Number.NaN,
      executionScore: 60,
      consistencyScore: 60,
      riskControlScore: 60,
      penaltyPoints: 5,
      anomalyCount: 0,
      matchDurationMs: 120000,
    });
    assert(!result.valid, 'NaN input must be invalid');
  });

  await test('Infinity score fails validation', () => {
    const result = evaluateGamelord({
      mode: 'SOLO',
      strategyScore: Number.POSITIVE_INFINITY,
      executionScore: 60,
      consistencyScore: 60,
      riskControlScore: 60,
      penaltyPoints: 5,
      anomalyCount: 0,
      matchDurationMs: 120000,
    });
    assert(!result.valid, 'Infinity input must be invalid');
  });

  await test('negative values fail validation', () => {
    const result = evaluateGamelord({
      mode: 'SOLO',
      strategyScore: 50,
      executionScore: 50,
      consistencyScore: 50,
      riskControlScore: 50,
      penaltyPoints: -1,
      anomalyCount: 0,
      matchDurationMs: 120000,
    });
    assert(!result.valid, 'negative input must be invalid');
  });

  await test('out-of-bounds values fail validation', () => {
    const result = evaluateGamelord({
      mode: 'SQUAD',
      strategyScore: 101,
      executionScore: 70,
      consistencyScore: 70,
      riskControlScore: 70,
      penaltyPoints: 10,
      anomalyCount: 0,
      matchDurationMs: 120000,
    });
    assert(!result.valid, 'score above 100 must be invalid');
  });

  await test('health report tracks latest evaluation', () => {
    evaluateGamelord({
      mode: 'SQUAD',
      strategyScore: 95,
      executionScore: 94,
      consistencyScore: 93,
      riskControlScore: 96,
      penaltyPoints: 2,
      anomalyCount: 0,
      matchDurationMs: 180000,
    });
    const health = getGamelordHealthReport();
    assert(health.evaluations > 0, 'evaluations should increment');
    assert(health.lastStatus === 'GAMELORD', 'expected GAMELORD status');
    assert(typeof health.lastEvaluatedAt === 'string', 'lastEvaluatedAt must exist');
  });

  await test(`evaluateGamelord completes within ${GAMELORD_PERFORMANCE_MAX_MS}ms`, () => {
    const samples = 150;
    const start = performance.now();
    for (let i = 0; i < samples; i++) {
      evaluateGamelord({
        mode: 'DUO',
        strategyScore: 60 + (i % 30),
        executionScore: 55 + (i % 30),
        consistencyScore: 50 + (i % 30),
        riskControlScore: 50 + (i % 30),
        penaltyPoints: i % 15,
        anomalyCount: i % 4,
        matchDurationMs: 60000 + i * 10,
      });
    }
    const avg = (performance.now() - start) / samples;
    assert(avg <= GAMELORD_PERFORMANCE_MAX_MS, `avg ${avg.toFixed(2)}ms > ${GAMELORD_PERFORMANCE_MAX_MS}ms`);
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
