import {
  _resetDuelKingMetrics,
  DUEL_KING_GEAR_REQUIREMENTS,
  EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_PERSONA_ID,
  EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH,
  evaluateDuelKing,
  getDuelKingHealthReport,
} from '../../lib/extrimli-duel-king';

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
  _resetDuelKingMetrics();

  console.log('\n👑 [extrimli-duel-king] contract tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRIMLI_DUEL_KING_CONTRACT_VERSION === 'v1-duel-king', `unexpected contract: ${EXTRIMLI_DUEL_KING_CONTRACT_VERSION}`);
    assert(EXTRIMLI_DUEL_KING_PERSONA_ID === 'extrimli-duel-king', `unexpected persona: ${EXTRIMLI_DUEL_KING_PERSONA_ID}`);
    assert(EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH === '/api/extrimli/duel-king', `unexpected source: ${EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH}`);
  });

  await test('valid arena duel returns ready posture', () => {
    const result = evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 7,
      fighterId: 'fighter-a',
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
    });

    assert(result.valid, 'result should be valid');
    assert(result.duelMode === 'ARENA', 'expected ARENA mode');
    assert(result.gearCleared === true, 'gear should clear');
    assert(result.bracketStatus === 'READY', `expected READY, got ${result.bracketStatus}`);
    assert(result.degraded === false, 'result should not be degraded');
  });

  await test('missing partial signals returns degraded but valid result', () => {
    const result = evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'TACTICAL',
      fighterExperience: 7,
      opponentTier: 6,
      arenaHazard: 4,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 240,
    });

    assert(result.valid, 'result should remain valid');
    assert(result.degraded === true, 'result should be degraded');
    assert(result.degradedMode === 'partial-payload-no-500', 'unexpected degraded mode');
    assert(result.tournamentState === 'DEGRADED', `expected DEGRADED tournament state, got ${result.tournamentState}`);
    assert(result.warnings.length >= 2, 'expected degraded warnings');
  });

  await test('unknown duel mode returns invalid result', () => {
    const result = evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'BOSS' as never,
      fighterExperience: 6,
      opponentTier: 6,
      arenaHazard: 3,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 200,
    });

    assert(!result.valid, 'result should be invalid');
  });

  await test('non-finite numeric input returns invalid result', () => {
    const result = evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'SURVIVAL',
      fighterExperience: 6,
      opponentTier: NaN,
      arenaHazard: 6,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 200,
    });

    assert(!result.valid, 'NaN input should be invalid');
  });

  await test('reaction time bounds are enforced', () => {
    const result = evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'SURVIVAL',
      fighterExperience: 6,
      opponentTier: 7,
      arenaHazard: 7,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 20,
    });

    assert(!result.valid, 'out-of-range reaction time should be invalid');
  });

  await test('gear requirements are published per duel mode', () => {
    assert(DUEL_KING_GEAR_REQUIREMENTS.ARENA.length >= 3, 'expected arena gear requirements');
    assert(DUEL_KING_GEAR_REQUIREMENTS.SURVIVAL.some((item) => item.category === 'helmet'), 'survival mode should require helmet');
  });

  await test('health report tracks last DUEL KING state', () => {
    _resetDuelKingMetrics();
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 4,
      arenaHazard: 2,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 170,
      recentSessions: 8,
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
    });

    const report = getDuelKingHealthReport();
    assert(report.evaluations === 1, `expected 1 evaluation, got ${report.evaluations}`);
    assert(report.lastTournamentState === 'ACTIVE', `unexpected tournament state: ${report.lastTournamentState}`);
    assert(report.lastReadinessScore >= 0 && report.lastReadinessScore <= 100, 'readiness score must be bounded');
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
