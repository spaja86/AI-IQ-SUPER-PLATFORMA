import {
  _resetDuelKingMetrics,
  DUEL_KING_COMPOSITE_READINESS_WEIGHTS,
  computeDuelKingCompositeReadiness,
  DUEL_KING_GEAR_REQUIREMENTS,
  EXTRIMLI_DUEL_KING_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION,
  EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION,
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
    assert(EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION === 'v1-kur-game', `unexpected kur contract: ${EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION}`);
    assert(EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION === 'v1-dur-game', `unexpected dur contract: ${EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION}`);
    assert(EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION === 'v1-mol-game', `unexpected mol contract: ${EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION}`);
    assert(EXTRIMLI_DUEL_KING_PERSONA_ID === 'extrimli-duel-king', `unexpected persona: ${EXTRIMLI_DUEL_KING_PERSONA_ID}`);
    assert(EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH === '/api/extrimli/duel-king', `unexpected source: ${EXTRIMLI_DUEL_KING_SOURCE_OF_TRUTH}`);
  });

  await test('fresh health report exposes baseline telemetry state', () => {
    const report = getDuelKingHealthReport();
    assert(report.telemetryStatus === 'BASELINE', `unexpected telemetryStatus: ${report.telemetryStatus}`);
    assert(report.kurTelemetryStatus === 'BASELINE', `unexpected kurTelemetryStatus: ${report.kurTelemetryStatus}`);
    assert(report.durTelemetryStatus === 'BASELINE', `unexpected durTelemetryStatus: ${report.durTelemetryStatus}`);
    assert(report.molTelemetryStatus === 'BASELINE', `unexpected molTelemetryStatus: ${report.molTelemetryStatus}`);
    assert(report.lastReadinessScore === 50, `expected neutral readiness baseline, got ${report.lastReadinessScore}`);
  });

  await test('shared composite readiness helper applies KUR/DUR/MOL live weights deterministically', () => {
    const baseline = getDuelKingHealthReport();
    const allLiveScore = computeDuelKingCompositeReadiness({
      ...baseline,
      lastReadinessScore: 60,
      kurTelemetryStatus: 'LIVE',
      durTelemetryStatus: 'LIVE',
      molTelemetryStatus: 'LIVE',
      lastKurSignalStatus: 'LIVE',
      lastDurSignalStatus: 'LIVE',
      lastMolSignalStatus: 'LIVE',
      lastKurProgressionSignal: 80,
      lastDurProgressionSignal: 100,
      lastMolProgressionSignal: 40,
    });
    const kurOnlyScore = computeDuelKingCompositeReadiness({
      ...baseline,
      lastReadinessScore: 60,
      kurTelemetryStatus: 'LIVE',
      durTelemetryStatus: 'BASELINE',
      molTelemetryStatus: 'BASELINE',
      lastKurSignalStatus: 'LIVE',
      lastDurSignalStatus: 'BASELINE',
      lastMolSignalStatus: 'BASELINE',
      lastKurProgressionSignal: 80,
      lastDurProgressionSignal: 100,
      lastMolProgressionSignal: 40,
    });

    assert(allLiveScore === 68, `expected all-live composite score 68, got ${allLiveScore}`);
    assert(kurOnlyScore === 64, `expected kur-only composite score 64, got ${kurOnlyScore}`);
    assert(
      DUEL_KING_COMPOSITE_READINESS_WEIGHTS.kur + DUEL_KING_COMPOSITE_READINESS_WEIGHTS.dur + DUEL_KING_COMPOSITE_READINESS_WEIGHTS.mol <= 1,
      'composite readiness weights must remain bounded',
    );
    const invalidWeightsFallbackScore = computeDuelKingCompositeReadiness(
      {
        ...baseline,
        lastReadinessScore: 60,
        kurTelemetryStatus: 'LIVE',
        durTelemetryStatus: 'LIVE',
        molTelemetryStatus: 'LIVE',
        lastKurSignalStatus: 'LIVE',
        lastDurSignalStatus: 'LIVE',
        lastMolSignalStatus: 'LIVE',
        lastKurProgressionSignal: 80,
        lastDurProgressionSignal: 100,
        lastMolProgressionSignal: 40,
      },
      { kur: 0.9, dur: 0.9, mol: 0.9 },
    );
    assert(invalidWeightsFallbackScore === allLiveScore, 'invalid weight sets should fall back to default composite weights');
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
    assert(result.kurGameSignal.status === 'BASELINE', `expected BASELINE KUR status, got ${result.kurGameSignal.status}`);
    assert(result.durGameSignal.status === 'BASELINE', `expected BASELINE DUR status, got ${result.durGameSignal.status}`);
    assert(result.molGameSignal.status === 'BASELINE', `expected BASELINE MOL status, got ${result.molGameSignal.status}`);
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

  await test('valid KUR-in-GAME signal is applied with bounded impact', () => {
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
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      kurGameSignal: {
        start: 0,
        target: 8,
        step: 2,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.kurGameSignal.status === 'LIVE', `expected LIVE KUR status, got ${result.kurGameSignal.status}`);
    assert(result.kurGameSignal.applied === true, 'KUR signal should be applied');
    assert(result.kurGameSignal.impactScore >= -8 && result.kurGameSignal.impactScore <= 8, 'KUR impact should be bounded');
  });

  await test('valid DUR and MOL in-game signals are applied with bounded impact', () => {
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
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      durGameSignal: {
        start: 0,
        target: 10,
        step: 2,
      },
      molGameSignal: {
        start: 2,
        target: 8,
        step: 2,
      },
    });

    assert(result.valid, 'result should be valid');
    assert(result.durGameSignal.status === 'LIVE', `expected LIVE DUR status, got ${result.durGameSignal.status}`);
    assert(result.molGameSignal.status === 'LIVE', `expected LIVE MOL status, got ${result.molGameSignal.status}`);
    assert(result.durGameSignal.impactScore >= -6 && result.durGameSignal.impactScore <= 6, 'DUR impact should be bounded');
    assert(result.molGameSignal.impactScore >= -5 && result.molGameSignal.impactScore <= 5, 'MOL impact should be bounded');
  });

  await test('invalid KUR-in-GAME signal degrades response without invalidating core duel', () => {
    _resetDuelKingMetrics();
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
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      kurGameSignal: {
        start: NaN,
        target: 8,
        step: 0,
      },
    });

    assert(result.valid, 'core duel result should remain valid');
    assert(result.degraded === true, 'invalid KUR signal should degrade response');
    assert(result.kurGameSignal.status === 'DEGRADED', `expected DEGRADED KUR status, got ${result.kurGameSignal.status}`);
    const report = getDuelKingHealthReport();
    assert(report.kurTelemetryStatus === 'DEGRADED', `invalid KUR attempt should expose degraded telemetry, got ${report.kurTelemetryStatus}`);
  });

  await test('invalid DUR/MOL in-game signals degrade response without invalidating core duel', () => {
    _resetDuelKingMetrics();
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
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      durGameSignal: {
        start: NaN,
        target: 8,
        step: 0,
      },
      molGameSignal: {
        start: 4,
        target: Infinity,
        step: 1,
      },
    });

    assert(result.valid, 'core duel result should remain valid');
    assert(result.degraded === true, 'invalid DUR/MOL signals should degrade response');
    assert(result.durGameSignal.status === 'DEGRADED', `expected DEGRADED DUR status, got ${result.durGameSignal.status}`);
    assert(result.molGameSignal.status === 'DEGRADED', `expected DEGRADED MOL status, got ${result.molGameSignal.status}`);
    const report = getDuelKingHealthReport();
    assert(report.durTelemetryStatus === 'DEGRADED', `invalid DUR attempt should expose degraded telemetry, got ${report.durTelemetryStatus}`);
    assert(report.molTelemetryStatus === 'DEGRADED', `invalid MOL attempt should expose degraded telemetry, got ${report.molTelemetryStatus}`);
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
    assert(report.telemetryStatus === 'LIVE', 'telemetryStatus should switch to LIVE after evaluation');
    assert(report.kurContractVersion === 'v1-kur-game', `unexpected kur contract version: ${report.kurContractVersion}`);
    assert(report.durContractVersion === 'v1-dur-game', `unexpected dur contract version: ${report.durContractVersion}`);
    assert(report.molContractVersion === 'v1-mol-game', `unexpected mol contract version: ${report.molContractVersion}`);
  });

  await test('health report tracks DUR/MOL telemetry when signals are provided', () => {
    _resetDuelKingMetrics();
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'TACTICAL',
      fighterExperience: 7,
      opponentTier: 6,
      arenaHazard: 4,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 210,
      recentSessions: 5,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      durGameSignal: { start: 0, target: 8, step: 2 },
      molGameSignal: { start: 1, target: 7, step: 2 },
    });

    const report = getDuelKingHealthReport();
    assert(report.durTelemetryStatus === 'LIVE', `expected LIVE DUR telemetry, got ${report.durTelemetryStatus}`);
    assert(report.molTelemetryStatus === 'LIVE', `expected LIVE MOL telemetry, got ${report.molTelemetryStatus}`);
    assert(report.durEvaluations === 1, `expected 1 DUR evaluation, got ${report.durEvaluations}`);
    assert(report.molEvaluations === 1, `expected 1 MOL evaluation, got ${report.molEvaluations}`);
    assert(report.durSignalCoverageScore > 0, `expected DUR coverage score > 0, got ${report.durSignalCoverageScore}`);
    assert(report.molSignalCoverageScore > 0, `expected MOL coverage score > 0, got ${report.molSignalCoverageScore}`);
  });

  await test('health report tracks KUR telemetry when signal is provided', () => {
    _resetDuelKingMetrics();
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'TACTICAL',
      fighterExperience: 7,
      opponentTier: 6,
      arenaHazard: 4,
      staminaReserve: 7,
      gearQualityIndex: 8,
      reactionTimeMs: 210,
      recentSessions: 5,
      activeGearCategories: ['helmet', 'pads', 'boots'],
      tournamentState: 'ACTIVE',
      kurGameSignal: { start: 0, target: 6, step: 2 },
    });

    const report = getDuelKingHealthReport();
    assert(report.kurTelemetryStatus === 'LIVE', `expected LIVE KUR telemetry, got ${report.kurTelemetryStatus}`);
    assert(report.kurEvaluations === 1, `expected 1 KUR evaluation, got ${report.kurEvaluations}`);
    assert(report.kurSignalCoverageScore > 0, `expected KUR coverage score > 0, got ${report.kurSignalCoverageScore}`);
  });

  await test('successful KUR evaluation clears degraded telemetry state', () => {
    _resetDuelKingMetrics();
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 7,
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      kurGameSignal: { start: NaN, target: 8, step: 0 },
    });
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 7,
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      kurGameSignal: { start: 0, target: 8, step: 2 },
    });

    const report = getDuelKingHealthReport();
    assert(report.kurTelemetryStatus === 'LIVE', `expected LIVE telemetry after successful KUR eval, got ${report.kurTelemetryStatus}`);
  });

  await test('latest non-KUR evaluation resets KUR signal status to baseline', () => {
    _resetDuelKingMetrics();
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 7,
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
      kurGameSignal: { start: 0, target: 8, step: 2 },
    });
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'ARENA',
      fighterExperience: 8,
      opponentTier: 5,
      arenaHazard: 3,
      staminaReserve: 8,
      gearQualityIndex: 9,
      reactionTimeMs: 180,
      recentSessions: 7,
      tournamentState: 'ACTIVE',
      activeGearCategories: ['helmet', 'pads', 'boots'],
    });

    const report = getDuelKingHealthReport();
    assert(report.kurTelemetryStatus === 'BASELINE', `expected BASELINE KUR telemetry when latest evaluation has no KUR signal, got ${report.kurTelemetryStatus}`);
    assert(report.lastKurSignalStatus === 'BASELINE', `expected BASELINE after non-KUR eval, got ${report.lastKurSignalStatus}`);
    assert(report.lastKurProgressionSignal === 50, `expected reset KUR progression signal, got ${report.lastKurProgressionSignal}`);
  });

  await test('invalid evaluation updates health telemetry conservatively', () => {
    _resetDuelKingMetrics();
    evaluateDuelKing({
      sportId: 'duel-king',
      duelMode: 'TACTICAL',
      fighterExperience: 8,
      opponentTier: NaN,
      arenaHazard: 2,
      staminaReserve: 8,
      gearQualityIndex: 8,
      reactionTimeMs: 180,
    });

    const report = getDuelKingHealthReport();
    assert(report.evaluations === 1, `expected 1 evaluation after invalid input, got ${report.evaluations}`);
    assert(report.lastReadinessScore === 0, `expected 0 readiness after invalid input, got ${report.lastReadinessScore}`);
    assert(report.lastDuelRiskScore >= 50, `expected conservative risk after invalid input, got ${report.lastDuelRiskScore}`);
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
