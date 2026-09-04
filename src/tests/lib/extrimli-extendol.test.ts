import {
  EXTRIMLI_EXTENDOL_CONTRACT_VERSION,
  EXTRIMLI_EXTENDOL_MODULE_VERSION,
  EXTRIMLI_EXTENDOL_PERSONA_ID,
  EXTRIMLI_EXTENDOL_SOURCE_OF_TRUTH,
  getExtrimliExtendolReport,
} from '../../lib/extrimli-extendol';

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
  console.log('\n🔗 [extrimli-extendol] unified contract tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRIMLI_EXTENDOL_CONTRACT_VERSION === 'v1', `unexpected contract: ${EXTRIMLI_EXTENDOL_CONTRACT_VERSION}`);
    assert(EXTRIMLI_EXTENDOL_MODULE_VERSION === '1.0.0', `unexpected module: ${EXTRIMLI_EXTENDOL_MODULE_VERSION}`);
    assert(EXTRIMLI_EXTENDOL_PERSONA_ID === 'extrimli-extendol-unified', `unexpected persona: ${EXTRIMLI_EXTENDOL_PERSONA_ID}`);
    assert(EXTRIMLI_EXTENDOL_SOURCE_OF_TRUTH === '/api/extrimli/extendol', 'unexpected source of truth');
  });

  await test('report covers all required functionality paths', () => {
    const report = getExtrimliExtendolReport();
    assert(report.coverage.sportRiskEvaluation, 'sportRiskEvaluation must be covered');
    assert(report.coverage.gearAndSafetyReadiness, 'gearAndSafetyReadiness must be covered');
    assert(report.coverage.eventLifecycleAndRegistration, 'eventLifecycleAndRegistration must be covered');
    assert(report.coverage.destructionSafetyFlows, 'destructionSafetyFlows must be covered');
    assert(report.coverage.athleteProgressAndReadiness, 'athleteProgressAndReadiness must be covered');
    assert(report.coverage.duelKingCompetition, 'duelKingCompetition must be covered');
    assert(report.coverage.kurInGameSignal, 'kurInGameSignal must be covered');
    assert(report.coverage.durInGameSignal, 'durInGameSignal must be covered');
    assert(report.coverage.molInGameSignal, 'molInGameSignal must be covered');
    assert(report.coverage.communityReputationAndMentorship, 'communityReputationAndMentorship must be covered');
    assert(report.coverage.koronReadinessOverlay, 'koronReadinessOverlay must be covered');
  });

  await test('report exposes acceptance criteria and unified readiness signal', () => {
    const report = getExtrimliExtendolReport();
    assert(Array.isArray(report.acceptanceCriteria) && report.acceptanceCriteria.length >= 5, 'acceptance criteria must be populated');
    assert(Number.isFinite(report.unifiedReadinessScore), 'unifiedReadinessScore must be finite');
    assert(report.unifiedReadinessScore >= 0 && report.unifiedReadinessScore <= 100, 'unifiedReadinessScore must be in [0, 100]');
    assert(report.statement.includes('MAKSIMUM FOR ALL'), 'statement must include maximum-for-all contract intent');
  });

  await test('report includes DUEL KING and all upstream EXTRIMLI surfaces', () => {
    const report = getExtrimliExtendolReport();
    assert(report.surfaces.v1.contractVersion === 'v1', 'v1 contract mismatch');
    assert(report.surfaces.v3.contractVersion === 'v3', 'v3 contract mismatch');
    assert(report.surfaces.duelKing.contractVersion === 'v1-duel-king', 'duelKing contract mismatch');
    assert(report.surfaces.cuz.contractVersion === 'v1', 'cuz contract mismatch');
    assert(report.surfaces.koron.contractVersion === 'v1-koron', 'koron contract mismatch');
    assert(report.surfaces.koron.sourceOfTruth === '/api/extrimli/koron', 'koron source of truth mismatch');
  });

  await test('report exposes KORON acceptance and no-500 degraded handling', () => {
    const report = getExtrimliExtendolReport();
    assert(report.acceptanceCriteria.some((item) => item.id === 'koron-overlay-covered'), 'KORON acceptance criterion missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'kur-in-game-covered'), 'KUR in GAME acceptance criterion missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'dur-in-game-covered'), 'DUR in GAME acceptance criterion missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'mol-in-game-covered'), 'MOL in GAME acceptance criterion missing');
    assert(report.surfaces.koron.degradedMode === 'partial-payload-no-500', 'KORON degraded mode mismatch');
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
