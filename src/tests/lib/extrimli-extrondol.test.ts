import {
  EXTRONDOL_BASE_ORCHESTRATION_SHARE,
  EXTRONDOL_CANONICAL_APEX_DOMAIN,
  EXTRONDOL_CANONICAL_WILDCARD_DOMAIN,
  EXTRONDOL_CONTRACT_VERSION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION,
  EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN,
  EXTRONDOL_DUET_STATUS_ADJUSTMENT,
  EXTRONDOL_DUET_INVALID_FALLBACK_SCORE,
  EXTRONDOL_DUET_WARNING_PENALTY_CAP,
  EXTRONDOL_DUET_WARNING_PENALTY_STEP,
  EXTRONDOL_DINKOS_PERSONA_ID,
  EXTRONDOL_DINKOS_TRIGGER_LABEL,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_NIVO_DUET_TRIGGER_LABEL,
  EXTRONDOL_NIVO_DUET_SHARE,
  EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_SOURCE_OF_TRUTH,
  getExtrimliExtrondolReport,
} from '../../lib/extrimli-extrondol';
import {
  EXPECTED_VERCEL_BILLING_OWNER,
  EXPECTED_VERCEL_INVOICE_AMOUNT,
  EXPECTED_VERCEL_INVOICE_NUMBER,
} from '../../lib/vercel-billing-governance';

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

async function withEnv(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<void> | void,
): Promise<void> {
  const previousValues: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(overrides)) {
    previousValues[key] = process.env[key];
    if (typeof value === 'undefined') delete process.env[key];
    else process.env[key] = value;
  }
  try {
    await fn();
  } finally {
    for (const [key, value] of Object.entries(previousValues)) {
      if (typeof value === 'undefined') delete process.env[key];
      else process.env[key] = value;
    }
  }
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
    assert(EXTRONDOL_DUET_INVALID_FALLBACK_SCORE === 50, 'unexpected DUET invalid fallback score');
  });

  await test('report exposes naming lock and WAWE sequencing', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.integrationBoundaries.aliasesOfExistingSurfaces === false, 'EXTRONDOL must not be alias');
    assert(report.acceptanceCriteria.some((item) => item.id === 'wawe-sequencing' && item.passed), 'wawe-sequencing criterion must pass');
    assert(['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(report.rollout.currentWawe), 'invalid currentWawe');
    assert(['WAWE-1', 'WAWE-2', 'WAWE-3', 'WAWE-4', 'WAWE-5'].includes(report.rollout.eligibleNextWawe), 'invalid eligibleNextWawe');
    assert(['RING-0-CONTRACT', 'RING-1-STAGING', 'RING-2-CANARY', 'RING-3-PRODUCTION', 'RING-4-RESILIENCE'].includes(report.b2bReadiness.tenant.rolloutRing), 'invalid B2B rollout ring');
  });

  await test('report includes bounded orchestration score and degraded policy', () => {
    const report = getExtrimliExtrondolReport();
    assert(Number.isFinite(report.orchestrationReadinessScore), 'orchestrationReadinessScore must be finite');
    assert(report.orchestrationReadinessScore >= 0 && report.orchestrationReadinessScore <= 100, 'orchestrationReadinessScore must be in [0, 100]');
    assert(report.degradedMode === 'partial-payload-no-500', 'unexpected degraded mode');
    assert(Array.isArray(report.rollout.reasons) && report.rollout.reasons.length >= 1, 'rollout reasons must be present');
    assert(report.releaseAuditSummary.required, 'release audit summary must be required');
    assert(report.releaseAuditSummary.rolloutSnapshot.currentWawe === report.rollout.currentWawe, 'release audit WAWE must match rollout');
    assert(report.releaseAuditSummary.rolloutSnapshot.eligibleNextWawe === report.rollout.eligibleNextWawe, 'release audit next WAWE must match rollout');
    assert(report.releaseAuditSummary.rolloutSnapshot.promotionFreeze === report.rollout.promotionFreeze, 'release audit freeze must match rollout');
    assert(report.releaseAuditSummary.rolloutSnapshot.reasons.join('|') === report.rollout.reasons.join('|'), 'release audit reasons must match rollout reasons');
    assert(report.releaseAuditSummary.kpiImpact.evaluationMaxMs === 50, 'release audit evaluation KPI mismatch');
    assert(report.releaseAuditSummary.kpiImpact.apiResponseMaxMs === 200, 'release audit API KPI mismatch');
    assert(report.releaseAuditSummary.kpiImpact.buildDurationMaxMin === 3, 'release audit build KPI mismatch');
    assert(report.releaseAuditSummary.downstreamReference.linkedRepo === 'spaja86/IO-OPENUI-AO', 'release audit linked repo mismatch');
    assert(report.releaseAuditSummary.humanReviewRequired, 'release audit must require human review');
    assert(report.releaseAuditSummary.rollbackPlanRequired, 'release audit must require rollback plan');
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
    assert(report.nivoDuet.triggerLabel === EXTRONDOL_NIVO_DUET_TRIGGER_LABEL, 'nivoDuet trigger label mismatch');
    assert(
      report.nivoDuet.mapping.fromDuet.join(',') === 'valid,status,overallScore,warnings',
      'nivoDuet fromDuet mapping mismatch',
    );
    assert(
      report.nivoDuet.mapping.toOrchestration.join(',') === 'rollout.currentWawe,rollout.eligibleNextWawe,rollout.promotionFreeze',
      'nivoDuet orchestration mapping mismatch',
    );
    assert(Number.isFinite(report.nivoDuet.signal.overallScore), 'nivoDuet score must be finite');
    assert(typeof report.nivoDuet.signal.valid === 'boolean', 'nivoDuet valid must be boolean');
    assert(['DISSONANT', 'FRAGILE', 'ALIGNED', 'HARMONIZED'].includes(report.nivoDuet.signal.status), 'invalid DUET status');
    assert(report.dinkos.domain === 'DINKOS', 'dinkos domain mismatch');
    assert(report.dinkos.classification === 'signal', 'dinkos classification mismatch');
    assert(report.dinkos.triggerLabel === 'dinkos:logic-change', 'dinkos trigger label mismatch');
    assert(report.dinkos.degradedMode === 'partial-payload-no-500', 'dinkos degraded mode mismatch');
    assert(report.b2bReadiness.governanceDecisions.dinkosSignalRequired, 'dinkos signal must remain mandatory for B2B governance');
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
    assert(report.acceptanceCriteria.some((item) => item.id === 'payment-verification-gate'), 'payment-verification-gate criterion must exist');
    assert(report.acceptanceCriteria.some((item) => item.id === 'b2b-downstream-sync' && item.passed), 'b2b-downstream-sync criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'distance-ratio-ekvilater-table' && item.passed), 'distance-ratio-ekvilater-table criterion must pass');
  });

  await test('report exposes additive B2B operating metadata and controls', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.b2bScope.consumerModel === 'organization-level', 'B2B consumer model mismatch');
    assert(report.b2bScope.accountOwnership.owner === '@spaja86', 'B2B owner mismatch');
    assert(report.b2bScope.accountOwnership.mandatoryHumanReview, 'human review must remain mandatory');
    assert(report.b2bScope.partnerOperatorRoles.partners.includes('spaja86/IO-OPENUI-AO'), 'linked repo partner missing');
    assert(report.b2bScope.procurementReviewFlow.steps.join(',') === 'request-submitted,procurement-review,compliance-review,operational-approval,activation', 'procurement flow mismatch');
    assert(report.b2bScope.slaExpectations.tier === 'enterprise-governed', 'SLA tier mismatch');
    assert(report.b2bScope.auditObligations.length >= 4, 'audit obligations must be present');
    assert(report.b2bReadiness.tenant.environmentTier === 'B2B', 'environment tier mismatch');
    assert(report.b2bReadiness.tenant.organizationId === 'spaja-digital-industrija-b2b', 'organization id mismatch');
    assert(report.b2bReadiness.compliance.secretsInGitAllowed === false, 'secrets must not be allowed in git');
    assert(report.b2bReadiness.compliance.onboardingComplete === false, 'onboarding must remain incomplete without explicit evidence');
    assert(report.b2bReadiness.compliance.humanReviewComplete === false, 'human review must remain incomplete without explicit evidence');
    assert(report.b2bReadiness.compliance.auditTrailComplete === true, 'audit trail should default to present governance evidence');
    assert(report.b2bReadiness.downstreamSync.status === 'FOLLOW_UP_REQUIRED', 'downstream sync must require explicit evidence');
    assert(report.b2bReadiness.compliance.blockers.includes('onboarding-complete'), 'onboarding blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('downstream-sync-complete'), 'downstream sync blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('human-review-complete'), 'human review blocker must be present');
    assert(!report.b2bReadiness.compliance.blockers.includes('audit-trail-complete'), 'audit blocker should not appear when audit evidence is present');
    assert(report.b2bReadiness.downstreamSync.linkedRepo === 'spaja86/IO-OPENUI-AO', 'linked repo mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('rollout.currentWawe'), 'WAWE sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('nivoDuet.signal.warnings'), 'DUET warnings sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('dinkos.triggerLabel'), 'DINKOS sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('domainStrategy.canonicalApex'), 'domain strategy sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('paymentVerification.status'), 'payment verification status sync field missing');
    assert(report.b2bReadiness.governanceDecisions.rolloutFreeze === report.rollout.promotionFreeze, 'B2B rollout freeze must mirror rollout freeze');
    assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.every((warning) => warning.startsWith('DUET:') || warning.includes('Downstream sync') || warning.includes('Domain strategy') || warning.includes('Human review evidence') || warning.includes('Payment verification')), 'unexpected B2B warning format');
    assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.some((warning) => warning.includes('Human review evidence')), 'human review warning must be present');
    assert(report.acceptanceCriteria.some((item) => item.id === 'b2b-scope' && item.passed), 'b2b-scope criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'b2b-controls' && item.passed), 'b2b-controls criterion must pass');
  });

  await test('report exposes START PROJEKAT rollout governance metadata', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.startProject.initiativeId === 'OKRID-2026-EXTRIMLI-START-001', 'START project OKRID mismatch');
    assert(report.startProject.programName === 'START PROJEKAT', 'START project name mismatch');
    assert(report.startProject.sourceOfTruthLocked, 'START project must keep source-of-truth lock');
    assert(report.startProject.additiveContractPolicy, 'START project must remain additive-only');
    assert(report.startProject.orchestrationInputs.upstreamSurfaces.join(',') === 'EXTRONDEND,EXTENDOL,KORON', 'START project inputs mismatch');
    assert(report.startProject.orchestrationInputs.duetRole === 'signal-only', 'DUET must remain signal-only in START project');
    assert(report.startProject.rolloutProgram.wawes.length === 5, 'START project must expose 5 WAWE stages');
    assert(report.startProject.rolloutProgram.wawes[0].freezeRequired === true, 'WAWE-1 must require freeze');
    assert(report.startProject.rolloutProgram.wawes[4].stage === 'WAWE-5', 'WAWE-5 stage missing');
    assert(report.startProject.rolloutProgram.releaseMode === 'governance-controlled', 'release mode mismatch');
    assert(report.startProject.governanceRequirements.consumerModel === 'organization-level', 'consumer model mismatch');
    assert(report.startProject.governanceRequirements.requiredEvidence.includes('human-review-complete'), 'human review evidence missing');
    assert(report.startProject.governanceRequirements.procurementReviewFlow.includes('activation'), 'activation step missing');
    assert(report.startProject.domainStrategyLock.requestedPattern === 'spaja.nivo*spaja', 'requested pattern mismatch');
    assert(report.startProject.domainStrategyLock.canonicalApex === EXTRONDOL_CANONICAL_APEX_DOMAIN, 'canonical apex mismatch');
    assert(report.startProject.domainStrategyLock.canonicalWildcard === EXTRONDOL_CANONICAL_WILDCARD_DOMAIN, 'canonical wildcard mismatch');
    assert(report.startProject.domainStrategyLock.rejectPatternsLike.includes('spaja.nivo*spaja'), 'reject pattern missing');
    assert(report.startProject.mandatoryOutputs.includes('distanceRatioEkvilaterTable'), 'distance ratio output missing');
    assert(report.startProject.mandatoryOutputs.includes('paymentVerification'), 'payment verification output missing');
    assert(report.startProject.downstreamSync.linkedRepo === 'spaja86/IO-OPENUI-AO', 'downstream linked repo mismatch');
    assert(report.startProject.downstreamSync.syncRequired, 'downstream sync must remain required');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('b2bReadiness'), 'b2bReadiness sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('paymentVerification'), 'payment verification sync missing');
    assert(report.startProject.qualityGates.validatorCoverage.includes('multi-repo-sync-agent'), 'multi-repo-sync-agent coverage missing');
    assert(report.startProject.qualityGates.kpiTargets.evaluationMaxMs === 50, 'evaluation KPI mismatch');
    assert(report.startProject.auditRelease.humanReviewRequired, 'human review must remain required');
    assert(report.startProject.auditRelease.rollbackRequired, 'rollback must remain required');
    assert(report.acceptanceCriteria.some((item) => item.id === 'start-project-governance' && item.passed), 'start-project-governance criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'release-governance-audit-summary' && item.passed), 'release-governance-audit-summary criterion must pass');
  });

  await test('report exposes DISTANCE RATIO EKVILATER as an additive derived readiness table', () => {
    const report = getExtrimliExtrondolReport();
    const table = report.distanceRatioEkvilaterTable;
    assert(table.requestedTableName === EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME, 'requested table name mismatch');
    assert(table.normalizedTableName === EXTRONDOL_DISTANCE_RATIO_EKVILATER_TABLE_NAME, 'normalized table name mismatch');
    assert(table.legacyRequestedTableNames.includes(EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES[0]), 'legacy alias mismatch');
    assert(table.contractField === EXTRONDOL_DISTANCE_RATIO_EKVILATER_CONTRACT_FIELD, 'contract field mismatch');
    assert(table.version === EXTRONDOL_DISTANCE_RATIO_EKVILATER_VERSION, 'table version mismatch');
    assert(table.interpretation === EXTRONDOL_DISTANCE_RATIO_EKVILATER_INTERPRETATION, 'table interpretation mismatch');
    assert(table.targetShape === EXTRONDOL_DISTANCE_RATIO_EKVILATER_TARGET_SHAPE, 'target shape mismatch');
    assert(table.scoringSource.join(',') === EXTRONDOL_DISTANCE_RATIO_EKVILATER_SCORING_SOURCE.join(','), 'table scoring source mismatch');
    assert(table.rows.length === 3, 'table must expose 3 pairwise rows');
    assert(table.summary.maxDistance >= table.summary.minDistance, 'distance summary ordering mismatch');
    assert(table.summary.equilateralConsistency >= 0 && table.summary.equilateralConsistency <= 100, 'equilateral consistency must be bounded');
    assert(['balanced', 'watch', 'skewed'].includes(table.summary.interpretation), 'unexpected table interpretation');
  });

  await test('DISTANCE RATIO EKVILATER rows are deterministic and bounded', () => {
    const report = getExtrimliExtrondolReport();
    const table = report.distanceRatioEkvilaterTable;
    const [rowA, rowB, rowC] = table.rows;
    assert(rowA.edgeId === 'extrondend-extendol', 'first edge mismatch');
    assert(rowB.edgeId === 'extrondend-koron', 'second edge mismatch');
    assert(rowC.edgeId === 'extendol-koron', 'third edge mismatch');
    for (const row of table.rows) {
      assert(row.distance >= 0, `distance must be non-negative for ${row.edgeId}`);
      assert(row.distanceRatio >= 0 && row.distanceRatio <= 1, `distanceRatio must be in [0,1] for ${row.edgeId}`);
      assert(row.equilateralAlignment >= 0 && row.equilateralAlignment <= 100, `equilateralAlignment must be in [0,100] for ${row.edgeId}`);
      assert(row.balanced === (row.equilateralAlignment >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN), `balanced flag mismatch for ${row.edgeId}`);
    }

    const rawAverageDistance = (rowA.distance + rowB.distance + rowC.distance) / 3;
    const rawMaxDistance = Math.max(rowA.distance, rowB.distance, rowC.distance);
    const rawMinDistance = Math.min(rowA.distance, rowB.distance, rowC.distance);
    const expectedAverageDistance = round2(rawAverageDistance);
    const expectedMaxDistance = round2(rawMaxDistance);
    const expectedMinDistance = round2(rawMinDistance);
    const denominator = rawAverageDistance === 0 ? 1 : rawAverageDistance;
    const expectedRows = [rowA, rowB, rowC].map((row) => ({
      edgeId: row.edgeId,
      distanceRatio: round2(rawMaxDistance === 0 ? 1 : clamp(row.distance / rawMaxDistance, 0, 1)),
      equilateralAlignment: round2(clamp(100 - (Math.abs(row.distance - rawAverageDistance) / denominator) * 100, 0, 100)),
    }));

    assert(table.summary.averageDistance === expectedAverageDistance, 'averageDistance mismatch');
    assert(table.summary.maxDistance === expectedMaxDistance, 'maxDistance mismatch');
    assert(table.summary.minDistance === expectedMinDistance, 'minDistance mismatch');
    for (const expected of expectedRows) {
      const actual = table.rows.find((row) => row.edgeId === expected.edgeId);
      assert(Boolean(actual), `missing row for ${expected.edgeId}`);
      assert(actual?.distanceRatio === expected.distanceRatio, `distanceRatio mismatch for ${expected.edgeId}`);
      assert(actual?.equilateralAlignment === expected.equilateralAlignment, `equilateralAlignment mismatch for ${expected.edgeId}`);
    }

    const expectedConsistency = round2(expectedRows.reduce((sum, row) => sum + row.equilateralAlignment, 0) / expectedRows.length);
    const expectedInterpretation = expectedConsistency >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_BALANCED_MIN
      ? 'balanced'
      : expectedConsistency >= EXTRONDOL_DISTANCE_RATIO_EKVILATER_WATCH_MIN
        ? 'watch'
        : 'skewed';
    assert(table.summary.equilateralConsistency === expectedConsistency, 'equilateralConsistency mismatch');
    assert(table.summary.interpretation === expectedInterpretation, 'table summary interpretation mismatch');
  });

  await test('DISTANCE RATIO EKVILATER keeps canonical naming with legacy alias compatibility', () => {
    const table = getExtrimliExtrondolReport().distanceRatioEkvilaterTable;
    assert(table.requestedTableName === table.normalizedTableName, 'canonical table naming must be normalized');
    assert(table.legacyRequestedTableNames.length >= 1, 'expected at least one legacy alias');
    assert(table.legacyRequestedTableNames.includes(EXTRONDOL_DISTANCE_RATIO_EKVILATER_COMPATIBILITY_ALIASES[0]), 'legacy misspelled alias must remain documented');
  });

  await test('report can consume explicit governance evidence for downstream sync and human review', () => {
    const report = getExtrimliExtrondolReport({
      auditTrailComplete: false,
      onboardingComplete: true,
      downstreamSyncComplete: true,
      humanReviewComplete: true,
    });
    assert(report.b2bReadiness.compliance.onboardingComplete === true, 'onboarding evidence override failed');
    assert(report.b2bReadiness.compliance.humanReviewComplete === true, 'human review evidence override failed');
    assert(report.b2bReadiness.downstreamSync.status === 'ALIGNED', 'downstream sync evidence override failed');
    assert(report.b2bReadiness.compliance.auditTrailComplete === false, 'audit evidence override failed');
    assert(report.b2bReadiness.compliance.blockers.includes('audit-trail-complete'), 'audit blocker should appear when audit evidence is missing');
    assert(!report.b2bReadiness.compliance.blockers.includes('onboarding-complete'), 'onboarding blocker should clear');
    assert(!report.b2bReadiness.compliance.blockers.includes('human-review-complete'), 'human review blocker should clear');
    assert(!report.b2bReadiness.compliance.blockers.includes('downstream-sync-complete'), 'downstream sync blocker should clear');
  });

  await test('payment verification success path (paid invoice) clears payment blockers', async () => {
    await withEnv({
      SPAJA_VERCEL_BILLING_OWNER: EXPECTED_VERCEL_BILLING_OWNER,
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: EXPECTED_VERCEL_INVOICE_NUMBER,
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: EXPECTED_VERCEL_INVOICE_AMOUNT,
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'false',
      SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED: 'false',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'internal-only',
      SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED: 'false',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'true',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: 'false',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        onboardingComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
      });
      assert(report.paymentVerification.status === 'VERIFIED', 'payment verification should be VERIFIED');
      assert(report.paymentVerification.invoiceResolutionPath === 'paid', 'payment resolution should be paid');
      assert(report.paymentVerification.blockers.length === 0, 'payment blockers should be empty');
      assert(
        !report.b2bReadiness.compliance.blockers.some((blocker) => blocker.startsWith('payment:')),
        'payment blockers should not appear in compliance blockers',
      );
      assert(
        !report.rollout.reasons.includes('payment-verification:blocked'),
        'rollout reasons should not include payment blocked marker',
      );
      assert(report.acceptanceCriteria.some((item) => item.id === 'payment-verification-gate' && item.passed), 'payment-verification-gate should pass');
    });
  });

  await test('payment verification correction path is accepted', async () => {
    await withEnv({
      SPAJA_VERCEL_BILLING_OWNER: EXPECTED_VERCEL_BILLING_OWNER,
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: EXPECTED_VERCEL_INVOICE_NUMBER,
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: EXPECTED_VERCEL_INVOICE_AMOUNT,
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'false',
      SPAJA_VERCEL_INVOICE_CORRECTION_REQUESTED: 'true',
      SPAJA_VERCEL_CORRECTED_INVOICE_RESOLVED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'public-safe',
      SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED: 'true',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'true',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: 'false',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        onboardingComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
      });
      assert(report.paymentVerification.status === 'VERIFIED', 'payment verification should be VERIFIED');
      assert(report.paymentVerification.invoiceResolutionPath === 'correction-resolved', 'payment resolution should be correction-resolved');
      assert(report.paymentVerification.blockers.length === 0, 'payment blockers should be empty');
    });
  });

  await test('payment verification blocked path adds compliance blockers', async () => {
    await withEnv({
      SPAJA_VERCEL_BILLING_OWNER: EXPECTED_VERCEL_BILLING_OWNER,
      SPAJA_VERCEL_BILLING_OWNER_LOCKED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_NUMBER: EXPECTED_VERCEL_INVOICE_NUMBER,
      SPAJA_VERCEL_CURRENT_INVOICE_AMOUNT: EXPECTED_VERCEL_INVOICE_AMOUNT,
      SPAJA_VERCEL_INVOICE_REQUESTED: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_PAID: 'true',
      SPAJA_VERCEL_CURRENT_INVOICE_EVIDENCE_CAPTURED: 'true',
      SPAJA_VERCEL_BANK_STATEMENT_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CAPTURED: 'true',
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'public-safe',
      SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED: 'false',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'false',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: 'false',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        onboardingComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
      });
      assert(report.paymentVerification.status === 'BLOCKED', 'payment verification should be BLOCKED');
      assert(report.paymentVerification.blockers.some((item) => item.includes('public-safe')), 'public-safe approval blocker must be present');
      assert(report.paymentVerification.blockers.some((item) => item.includes('redaction')), 'redaction blocker must be present');
      assert(report.b2bReadiness.compliance.blockers.some((item) => item.startsWith('payment:')), 'payment blocker must propagate to compliance');
      assert(report.rollout.promotionFreeze, 'promotion freeze should remain active when payment verification is blocked');
      assert(report.rollout.reasons.includes('payment-verification:blocked'), 'rollout reasons should include payment blocked marker');
      assert(report.acceptanceCriteria.some((item) => item.id === 'payment-verification-gate' && !item.passed), 'payment-verification-gate should fail');
    });
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
