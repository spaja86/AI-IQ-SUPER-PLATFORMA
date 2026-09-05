import {
  EXTRONDOL_BASE_ORCHESTRATION_SHARE,
  EXTRONDOL_CANONICAL_APEX_DOMAIN,
  EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_DUET_STATUS_ADJUSTMENT,
  EXTRONDOL_DUET_WARNING_PENALTY_CAP,
  EXTRONDOL_DUET_WARNING_PENALTY_STEP,
  EXTRONDOL_DINKOS_PERSONA_ID,
  EXTRONDOL_DINKOS_TRIGGER_LABEL,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_NIVO_DUET_SHARE,
  EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_SOURCE_OF_TRUTH,
  getExtrimliExtrondolReport,
} from '../../lib/extrimli-extrondol';

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function duetStatusAdjustment(status: string): number {
  if (status === 'HARMONIZED') return EXTRONDOL_DUET_STATUS_ADJUSTMENT.HARMONIZED;
  if (status === 'ALIGNED') return EXTRONDOL_DUET_STATUS_ADJUSTMENT.ALIGNED;
  if (status === 'FRAGILE') return EXTRONDOL_DUET_STATUS_ADJUSTMENT.FRAGILE;
  return EXTRONDOL_DUET_STATUS_ADJUSTMENT.DISSONANT;
}

async function runTests(): Promise<void> {
  console.log('\n🔗 [extrimli-extrondol] orchestration contract tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRONDOL_CONTRACT_VERSION === 'v1-extrondol', `unexpected contract: ${EXTRONDOL_CONTRACT_VERSION}`);
    assert(EXTRONDOL_MODULE_VERSION === '1.0.0', `unexpected module: ${EXTRONDOL_MODULE_VERSION}`);
    assert(EXTRONDOL_PERSONA_ID === 'extrimli-extrondol-orchestrator', `unexpected persona: ${EXTRONDOL_PERSONA_ID}`);
    assert(EXTRONDOL_SOURCE_OF_TRUTH === '/api/extrimli/extrondol', 'unexpected source of truth');
    assert(EXTRONDOL_REQUESTED_DOMAIN_PATTERN === 'spaja.nivo*spaja', 'unexpected requested domain pattern');
    assert(EXTRONDOL_CANONICAL_APEX_DOMAIN === 'spaja.nivo-spaja', 'unexpected canonical apex domain');
    assert(EXTRONDOL_CANONICAL_WILDCARD_DOMAIN === '*.spaja.nivo-spaja', 'unexpected canonical wildcard domain');
    assert(EXTRONDOL_DINKOS_TRIGGER_LABEL === 'dinkos:logic-change', 'unexpected DINKOS trigger label');
    assert(EXTRONDOL_DINKOS_PERSONA_ID === 'extrimli-dinkos-signal-core', 'unexpected DINKOS persona');
  });

  await test('report exposes naming lock and WAWE sequencing', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.integrationBoundaries.aliasesOfExistingSurfaces === false, 'EXTRONDOL must not be alias');
    assert(report.acceptanceCriteria.some((item) => item.id === 'wawe-sequencing' && item.passed), 'wawe-sequencing criterion must pass');
    assert(['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(report.rollout.currentWawe), 'invalid currentWawe');
    assert(['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(report.rollout.eligibleNextWawe), 'invalid eligibleNextWawe');
  });

  await test('report includes bounded orchestration score and degraded policy', () => {
    const report = getExtrimliExtrondolReport();
    assert(Number.isFinite(report.orchestrationReadinessScore), 'orchestrationReadinessScore must be finite');
    assert(report.orchestrationReadinessScore >= 0 && report.orchestrationReadinessScore <= 100, 'orchestrationReadinessScore must be in [0, 100]');
    assert(report.degradedMode === 'partial-payload-no-500', 'unexpected degraded mode');
    assert(Array.isArray(report.rollout.reasons) && report.rollout.reasons.length >= 1, 'rollout reasons must be present');
  });

  await test('report enforces domain strategy lock', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.domainStrategy.requestedPattern === 'spaja.nivo*spaja', 'requested pattern mismatch');
    assert(report.domainStrategy.canonicalApex === 'spaja.nivo-spaja', 'canonical apex mismatch');
    assert(report.domainStrategy.canonicalWildcard === '*.spaja.nivo-spaja', 'canonical wildcard mismatch');
    assert(report.domainStrategy.valid, 'canonical domain strategy must be valid');
    assert(report.domainStrategy.requestedPatternRejected, 'requested pattern must be rejected');
    assert(
      typeof report.domainStrategy.invalidReason === 'string' && report.domainStrategy.invalidReason.includes('spaja.nivo*spaja'),
      'invalid requested pattern reason must be present',
    );
  });

  await test('report exposes NIVO DUET mapping and DINKOS signal contract', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.nivoDuet.sourceOfTruth === '/api/duet/evaluate', 'nivoDuet source mismatch');
    assert(
      report.nivoDuet.mapping.fromDuet.join(',') === 'status,overallScore,warnings',
      'nivoDuet fromDuet mapping mismatch',
    );
    assert(
      report.nivoDuet.mapping.toOrchestration.join(',') === 'rollout.currentWawe,rollout.eligibleNextWawe,rollout.promotionFreeze',
      'nivoDuet orchestration mapping mismatch',
    );
    assert(Number.isFinite(report.nivoDuet.signal.overallScore), 'nivoDuet score must be finite');
    assert(['DISSONANT', 'FRAGILE', 'ALIGNED', 'HARMONIZED'].includes(report.nivoDuet.signal.status), 'invalid DUET status');
    assert(report.dinkos.domain === 'DINKOS', 'dinkos domain mismatch');
    assert(report.dinkos.classification === 'signal', 'dinkos classification mismatch');
    assert(report.dinkos.triggerLabel === 'dinkos:logic-change', 'dinkos trigger label mismatch');
    assert(report.dinkos.degradedMode === 'partial-payload-no-500', 'dinkos degraded mode mismatch');
  });

  await test('NIVO DUET warning penalty and status adjustment are applied to orchestration score', () => {
    const report = getExtrimliExtrondolReport();
    const baseScore = round2(
      clamp(
        report.surfaces.extrondend.aggregationScore * 0.5
          + report.surfaces.extendol.unifiedReadinessScore * 0.3
          + report.surfaces.koron.readinessScore * 0.2,
        0,
        100,
      ),
    );
    const statusAdjustment = duetStatusAdjustment(report.nivoDuet.signal.status);
    const warningPenalty = Math.min(EXTRONDOL_DUET_WARNING_PENALTY_CAP, report.nivoDuet.signal.warnings.length * EXTRONDOL_DUET_WARNING_PENALTY_STEP);
    const expected = round2(
      clamp(
        baseScore * EXTRONDOL_BASE_ORCHESTRATION_SHARE + report.nivoDuet.signal.overallScore * EXTRONDOL_NIVO_DUET_SHARE + (statusAdjustment - warningPenalty),
        0,
        100,
      ),
    );
    assert(report.orchestrationReadinessScore === expected, 'orchestration score must include DUET status adjustment and warning penalty');
    assert(report.nivoDuet.signal.warnings.length >= 1, 'expected at least one DUET warning for penalty coverage');
    assert(
      report.nivoDuet.signal.warnings.some((warning) => warning.includes('Very narrow shared window')),
      'expected narrow shared window warning for penalty coverage',
    );
  });

  await test('report includes required upstream surfaces', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.surfaces.extrondend.contractVersion === 'v1-extrondend', 'extrondend contract mismatch');
    assert(report.surfaces.extendol.contractVersion === 'v1', 'extendol contract mismatch');
    assert(report.surfaces.koron.contractVersion === 'v1-koron', 'koron contract mismatch');
    assert(report.surfaces.extrondend.surfaces.duelKing.durContractVersion === 'v1-dur-game', 'dur contract mismatch');
    assert(report.surfaces.extrondend.surfaces.duelKing.molContractVersion === 'v1-mol-game', 'mol contract mismatch');
    assert(report.integrationBoundaries.dependsOn.includes('/api/duet/evaluate'), 'duet dependency must be present');
    assert(report.acceptanceCriteria.some((item) => item.id === 'nivo-duet-mapping' && item.passed), 'nivo-duet-mapping criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'dinkos-contract' && item.passed), 'dinkos-contract criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'domain-strategy-lock' && item.passed), 'domain-strategy-lock criterion must pass');
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
