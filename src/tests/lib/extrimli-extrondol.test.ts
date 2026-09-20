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
  EXTRONDOL_EPIC_ELIKVADENTI_CONTRACT_VERSION,
  EXTRONDOL_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_BLOCKED_ADJUSTMENT,
  EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION,
  EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_READY_ADJUSTMENT,
  EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_WATCH_ADJUSTMENT,
  EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRONDOL_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRONDOL_METRICKO_PROGRAMIRANJE_CONTRACT_VERSION,
  EXTRONDOL_MODULE_VERSION,
  EXTRONDOL_NIVO_DUET_TRIGGER_LABEL,
  EXTRONDOL_NIVO_DUET_SHARE,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_BLOCKED_ADJUSTMENT,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_READY_ADJUSTMENT,
  EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_WATCH_ADJUSTMENT,
  EXTRONDOL_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION,
  EXTRONDOL_PROGRAMSKI_JEZIK_SPECIJALIZOVAN_ZA_IGRICE_CONTRACT_VERSION,
  EXTRONDOL_PROGRAMSKI_JEZIK_PARADIGMA_OBLIKOVANJE_TELA_CONTRACT_VERSION,
  EXTRONDOL_SPAJINO_PROPORCIONALNO_PROGRAMIRANJE_UNIVERZITET_CONTRACT_VERSION,
  EXTRONDOL_SINEMETRICKO_PROGRAMIRANJE_CONTRACT_VERSION,
  EXTRONDOL_VRH_PROGRAMSKOG_EKVILADENTA_CONTRACT_VERSION,
  EXTRONDOL_REQUESTED_DOMAIN_PATTERN,
  EXTRONDOL_PERSONA_ID,
  EXTRONDOL_SOURCE_OF_TRUTH,
  getEpicElikvadentiAdjustment,
  getObjektnaProngilacijaAdjustment,
  getObjektnoOrijentisanaReprodukcijaAdjustment,
  getFunkcionalnoProgramiranjePravednogMisaonogTokaAdjustment,
  getParadijogonalnoProgrimiranjeAdjustment,
  getFunkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment,
  getFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaAdjustment,
  getFunkionalnoProgramiranjePravnogMisaonogTokaAdjustment,
  getMetrickoProgramiranjeAdjustment,
  getProgramskiJezikInformacionihTokovaAdjustment,
  getProgramskiJezikDekoracijeObjektnihPrimesaAdjustment,
  getProgramskiJezikPoProsparitetuDeklasiraneMatriceUEkstaziAdjustment,
  getProgramskiJezikParadigmaOblikovanjeTelaAdjustment,
  getProgramskiJezikPretpostavkaAdjustment,
  getProgramskiJezikSpecijalizovanZaIgriceAdjustment,
  getRadniTaktMozgaMislilacAdjustment,
  getProporcionalnoProgramiranjeAdjustment,
  getSpajinoProporcionalnoProgramiranjeUniverzitetAdjustment,
  getSinemetrickoProgramiranjeAdjustment,
  getVrhProgramskogEkviladentaAdjustment,
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
    assert(report.versionRoadmap.contractVersion === 'v1-7-roadmap', 'roadmap contract mismatch');
    assert(report.versionRoadmap.developerCreateLock.additiveOnly, 'developer/create lock must remain additive-only');
  });

  await test('report exposes Developer/Create lock and downstream sync expectations', () => {
    const report = getExtrimliExtrondolReport();
    const lock = report.versionRoadmap.developerCreateLock;
    assert(lock.sourceProgramDoc === 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md', 'developer/create doc mismatch');
    assert(lock.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol', 'developer/create source routes mismatch');
    assert(lock.driftZeroLayers.join(',') === 'docs,types,routes,tests,workflows', 'developer/create drift-zero layers mismatch');
    assert(lock.ownershipBoundary.dik === 'EXTREM' && lock.ownershipBoundary.for === 'EXTREM' && lock.ownershipBoundary.duk === 'EXTRONDOL', 'DIK/FOR/DUK ownership split mismatch');
    assert(lock.prExecutionLock.singleRoadmapStagePerPr, 'single-roadmap-stage-per-PR lock must be enabled');
    assert(lock.prExecutionLock.measurableOutputRequired, 'measurable-output lock must be enabled');
    assert(lock.prExecutionLock.requiredFields.join(',') === 'roadmapStageId,measurableOutput,acceptanceEvidence', 'PR execution required fields mismatch');
    assert(lock.operationalAuditPackage.required, 'operational audit package must be required');
    assert(lock.operationalAuditPackage.standardizedPrDescription, 'operational audit package must standardize PR description');
    assert(lock.operationalAuditPackage.requiredFields.join(',') === 'rolloutPlan,rollbackPlan,kpiImpact,humanReviewStatus,downstreamReference', 'operational audit package required fields mismatch');
    assert(lock.mandatoryArtifacts.routes.includes('src/app/api/extrimli/extrem/route.ts'), 'EXTREM route mandatory artifact missing');
    assert(lock.mandatoryArtifacts.tests.includes('src/tests/api/extrimli-route.test.ts'), 'route test mandatory artifact missing');
    assert(lock.acceptanceLock.degradedPolicy === 'partial-payload-no-500', 'developer/create degraded policy mismatch');
    assert(report.startProject.mandatoryOutputs.includes('versionRoadmap.developerCreateLock'), 'developer/create lock must be a START mandatory output');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('versionRoadmap.developerCreateLock'), 'developer/create lock must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.developerCreateLock.driftZeroLayers'), 'developer/create drift-zero layers must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.developerCreateLock.definitionOfDone'), 'developer/create DoD must be synced downstream');
    assert(report.roadmapAlignment.primaryVersion === 'Verzija 5', 'EXTRONDOL should align to Verzija 5');
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
    assert(report.releaseAuditSummary.resolutionGovernance.sourceOfTruth === '/api/extrimli/extrem', 'release audit resolution source mismatch');
    assert(['ALLOW', 'WARN', 'FREEZE'].includes(report.releaseAuditSummary.resolutionGovernance.rekulitiPoRauletu), 'release audit resolution policy mismatch');
    assert(report.releaseAuditSummary.semaFormulaGovernance.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA', 'release audit formula expression mismatch');
    assert(['PASSED', 'BLOCKED'].includes(report.releaseAuditSummary.semaFormulaGovernance.status), 'release audit formula status mismatch');
    assert(['MUŠEMA_CONFIRMED', 'MUŠEMA_BLOCKED'].includes(report.releaseAuditSummary.semaFormulaGovernance.muSemaConclusion), 'release audit MUŠEMA conclusion mismatch');
    assert(report.releaseAuditSummary.humanReviewRequired, 'release audit must require human review');
    assert(report.releaseAuditSummary.rollbackPlanRequired, 'release audit must require rollback plan');
    assert(report.releaseAuditSummary.objektnoOrijentisanaReprodukcijaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'release audit reproduction source mismatch');
  });

  await test('report maps KRALJEVSKI PRAVNI UNIVERZITET governance into WAWE, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.kraljevskiPravniUniverzitetGovernance.term === 'KRALJEVSKI PRAVNI UNIVERZITET', 'track term mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.sourceOfTruth === '/api/extrimli/extrondol', 'track governance source mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.technicalSignalSource === '/api/extrimli/extrem', 'track technical source mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.legislativeBoundary.sourceMaterialPolicy === 'documentation-only', 'track source material policy mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.legislativeBoundary.primaryCharter === 'POVELJA O ZAKONODAVNOM PRAVU', 'primary charter mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.releaseChecklist.currentWawe === report.rollout.currentWawe, 'track current WAWE mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.releaseChecklist.eligibleNextWawe === report.rollout.eligibleNextWawe, 'track next WAWE mismatch');
    assert(report.kraljevskiPravniUniverzitetGovernance.releaseChecklist.promotionFreeze === report.rollout.promotionFreeze, 'track freeze mismatch');
    assert(report.releaseAuditSummary.kraljevskiPravniUniverzitetGovernance.sourceOfTruth === '/api/extrimli/extrem', 'release audit track source mismatch');
    assert(report.startProject.mandatoryOutputs.includes('kraljevskiPravniUniverzitetGovernance'), 'track must be mandatory output');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.kraljevskiPravniUniverzitetTrack.readiness.status'), 'track EXTREM status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('kraljevskiPravniUniverzitetGovernance.status'), 'track governance status must sync downstream');
    assert(report.spajaKod.publicSignals.kraljevskiPravniUniverzitetStatus === report.extremProfiler.kraljevskiPravniUniverzitetTrack.readiness.status, 'SPAJA KOD track summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'kraljevski-pravni-univerzitet-governance'), 'track scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'kraljevski-pravni-univerzitet-track' && item.passed), 'track acceptance criterion must pass');
  });

  await test('report maps Železara pretplata identity governance into WAWE, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.zelezaraPretplataGovernance.term === 'ŽELEZARA PRETPLATA IDENTITET', 'Železara governance term mismatch');
    assert(report.zelezaraPretplataGovernance.sourceOfTruth === '/api/extrimli/extrondol', 'Železara governance source mismatch');
    assert(report.zelezaraPretplataGovernance.technicalSignalSource === '/api/extrimli/extrem', 'Železara technical source mismatch');
    assert(report.zelezaraPretplataGovernance.identityStatus === report.extremProfiler.zelezaraPretplataIdentityTrack.readiness.status, 'Železara identity status mismatch');
    assert(report.zelezaraPretplataGovernance.subscriberIdentity.canonicalLegalName === 'Železara d.o.o. Smederevo', 'canonical legal name mismatch');
    assert(report.zelezaraPretplataGovernance.subscriberIdentity.legacyReturnName === 'Železara', 'legacy return name mismatch');
    assert(report.zelezaraPretplataGovernance.subscriberIdentity.allowedAliases.includes('HBIS'), 'HBIS alias missing');
    assert(report.releaseAuditSummary.zelezaraPretplataGovernance.sourceOfTruth === '/api/extrimli/extrem', 'release audit Železara source mismatch');
    assert(report.startProject.mandatoryOutputs.includes('zelezaraPretplataGovernance'), 'Železara governance must be mandatory output');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('zelezaraPretplataGovernance'), 'Železara governance must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.zelezaraPretplataIdentityTrack.readiness.status'), 'Železara EXTREM status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('spajaKod.publicSignals.zelezaraPretplataIdentityStatus'), 'Železara SPAJA KOD signal must sync downstream');
    assert(report.spajaKod.publicSignals.zelezaraPretplataIdentityStatus === report.extremProfiler.zelezaraPretplataIdentityTrack.readiness.status, 'SPAJA KOD Železara summary mismatch');
    assert(report.zelezaraPretplataGovernance.reasons.includes(`governance:wawe-context-${report.rollout.currentWawe}-to-${report.rollout.eligibleNextWawe}`), 'Železara governance should carry WAWE context');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'zelezara-pretplata-identity-governance'), 'Železara scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-pretplata-identity-track' && item.passed), 'Železara identity criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-contract-identity-gate' && item.passed), 'Železara contract identity gate must pass');
  });

  await test('Železara WATCH posture stays audit-safe and WAWE-aware without forcing a blocker', async () => {
    await withEnv({
      EXTRIMLI_ZELEZARA_ALIAS_COVERAGE_SCORE: '85',
      EXTRIMLI_ZELEZARA_CURRENT_OPERATING_NAME_CONFIRMED: 'true',
      EXTRIMLI_ZELEZARA_CANONICAL_IDENTITY_CONFIRMED: 'true',
      EXTRIMLI_ZELEZARA_RESTORE_OLD_NAME_COMPLETED: 'true',
      EXTRIMLI_ZELEZARA_NAMING_CONFLICT: 'false',
      EXTRIMLI_ZELEZARA_SPLIT_CLIENT_RISK: 'false',
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
      assert(report.zelezaraPretplataGovernance.status === 'WATCH', 'Železara governance should stay WATCH when review warnings remain');
      assert(report.zelezaraPretplataGovernance.identityStatus === 'WATCH', 'Železara identity status should stay WATCH');
      assert(report.zelezaraPretplataGovernance.blockerReasons.length === 0, 'WATCH posture should not add blockers');
      assert(report.zelezaraPretplataGovernance.activationGateReasons.length === 0, 'WATCH posture should not add activation blockers');
      assert(report.zelezaraPretplataGovernance.warnings.some((reason) => reason.includes('Allowed alias coverage remains incomplete')), 'WATCH posture should preserve alias coverage warning');
      assert(report.zelezaraPretplataGovernance.reasons.includes(`governance:wawe-context-${report.rollout.currentWawe}-to-${report.rollout.eligibleNextWawe}`), 'WATCH posture should retain WAWE context');
      assert(report.rollout.reasons.includes('zelezara-pretplata:watch'), 'rollout reasons should include Železara WATCH marker');
      assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.includes('Železara pretplata naming remains in WATCH posture and needs identity-review visibility before broader rollout.'), 'partner readiness warnings should include audit-safe WATCH messaging');
      assert(report.zelezaraPretplataGovernance.publicStatus === 'SAFE_SUMMARY_REVIEW', 'governance public status should remain review-only');
      assert(report.spajaKod.publicSignals.zelezaraPretplataIdentityStatus === 'WATCH', 'SPAJA KOD should expose WATCH summary');
    });
  });

  await test('report maps objektno orijentisana prongilacija into WAWE governance and downstream sync', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.objektnoOrijentisanaProngilacija.term === 'Objektno orijentisana prongilacija', 'object-oriented prongilacija term mismatch');
    assert(report.objektnoOrijentisanaProngilacija.contractVersion === EXTRONDOL_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION, 'object-oriented prongilacija contract mismatch');
    assert(report.objektnoOrijentisanaProngilacija.technicalSignalSource === '/api/extrimli/extrem', 'object-oriented prongilacija technical source mismatch');
    assert(report.objektnoOrijentisanaProngilacija.waweImpact.currentWawe === report.rollout.currentWawe, 'object-oriented prongilacija WAWE mismatch');
    assert(report.objektnoOrijentisanaProngilacija.auditCoupling.humanReviewRequired, 'human review must stay required');
    assert(report.objektnoOrijentisanaProngilacija.auditCoupling.rollbackPlanRequired, 'rollback must stay required');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.objektnoOrijentisanaProngilacija.readiness.status'), 'object-oriented prongilacija status must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('objektnoOrijentisanaProngilacija'), 'object-oriented prongilacija must be mandatory output');
  });

  await test('report maps FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA into WAWE governance, audit, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.funkcinalnoProgramiranjeEnergetskogMisaonogToka.term === 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA', 'functional energy-flow term mismatch');
    assert(report.funkcinalnoProgramiranjeEnergetskogMisaonogToka.contractVersion === EXTRONDOL_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION, 'functional energy-flow contract mismatch');
    assert(report.funkcinalnoProgramiranjeEnergetskogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'functional energy-flow technical source mismatch');
    assert(report.funkcinalnoProgramiranjeEnergetskogMisaonogToka.waweImpact.currentWawe === report.rollout.currentWawe, 'functional energy-flow WAWE mismatch');
    assert(report.releaseAuditSummary.funkcinalnoProgramiranjeEnergetskogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'functional energy-flow audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status'), 'functional energy-flow status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('funkcinalnoProgramiranjeEnergetskogMisaonogToka.waweImpact'), 'functional energy-flow WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('funkcinalnoProgramiranjeEnergetskogMisaonogToka'), 'functional energy-flow governance must be mandatory output');
    assert(report.spajaKod.publicSignals.funkcinalnoProgramiranjeEnergetskogMisaonogTokaStatus === report.extremProfiler.funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status, 'SPAJA KOD functional energy-flow summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'funkcinalno-programiranje-energetskog-misaonog-toka-governance'), 'functional energy-flow scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'funkcinalno-programiranje-energetskog-misaonog-toka-governance' && item.passed), 'functional energy-flow acceptance criterion must pass');
  });

  await test('report maps exact-string locked FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA into WAWE governance, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.funkcionalnoProgramiranjeUzvisenogMisanogToka.term === 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA', 'elevated thought-flow term mismatch');
    assert(report.funkcionalnoProgramiranjeUzvisenogMisanogToka.contractVersion === EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION, 'elevated thought-flow contract mismatch');
    assert(report.funkcionalnoProgramiranjeUzvisenogMisanogToka.technicalSignalSource === '/api/extrimli/extrem', 'elevated thought-flow technical source mismatch');
    assert(report.funkcionalnoProgramiranjeUzvisenogMisanogToka.governanceVisibility === 'audit-safe-readiness-only', 'elevated thought-flow visibility mismatch');
    assert(report.funkcionalnoProgramiranjeUzvisenogMisanogToka.waweImpact.currentWawe === report.rollout.currentWawe, 'elevated thought-flow WAWE mismatch');
    assert(report.releaseAuditSummary.funkcionalnoProgramiranjeUzvisenogMisanogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'elevated thought-flow audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.funkcionalnoProgramiranjeUzvisenogMisanogToka.readiness.status'), 'elevated thought-flow status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('funkcionalnoProgramiranjeUzvisenogMisanogToka.waweImpact'), 'elevated thought-flow WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('funkcionalnoProgramiranjeUzvisenogMisanogToka'), 'elevated thought-flow governance must be mandatory output');
    assert(report.spajaKod.publicSignals.funkcionalnoProgramiranjeUzvisenogMisanogTokaStatus === report.extremProfiler.funkcionalnoProgramiranjeUzvisenogMisanogToka.readiness.status, 'SPAJA KOD elevated thought-flow summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'funkcionalno-programiranje-uzvisenog-misanog-toka-governance'), 'elevated thought-flow scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'funkcionalno-programiranje-uzvisenog-misanog-toka-governance' && item.passed), 'elevated thought-flow acceptance criterion must pass');
  });

  await test('report maps FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA into WAWE governance, scorecard, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.term === 'FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA', 'explicit thought-flow term mismatch');
    assert(report.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.contractVersion === EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'explicit thought-flow contract mismatch');
    assert(report.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'explicit thought-flow technical source mismatch');
    assert(report.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.waweImpact.currentWawe === report.rollout.currentWawe, 'explicit thought-flow WAWE mismatch');
    assert(report.releaseAuditSummary.funkcionalnoProgramiranjeEksplicitnogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'explicit thought-flow audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.readiness.status'), 'explicit thought-flow status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('funkcionalnoProgramiranjeEksplicitnogMisaonogToka.waweImpact'), 'explicit thought-flow WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('funkcionalnoProgramiranjeEksplicitnogMisaonogToka'), 'explicit thought-flow governance must be mandatory output');
    assert(report.spajaKod.publicSignals.funkcionalnoProgramiranjeEksplicitnogMisaonogTokaStatus === report.extremProfiler.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.readiness.status, 'SPAJA KOD explicit thought-flow summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'funkcionalno-programiranje-eksplicitnog-misaonog-toka-governance'), 'explicit thought-flow scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'funkcionalno-programiranje-eksplicitnog-misaonog-toka-governance' && item.passed), 'explicit thought-flow acceptance criterion must pass');
  });
  await test('report maps FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA into WAWE governance, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.funkcionalnoProgramiranjePravednogMisaonogToka.term === 'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA', 'fair thought-flow term mismatch');
    assert(report.funkcionalnoProgramiranjePravednogMisaonogToka.contractVersion === EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'fair thought-flow contract mismatch');
    assert(report.funkcionalnoProgramiranjePravednogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'fair thought-flow technical source mismatch');
    assert(report.funkcionalnoProgramiranjePravednogMisaonogToka.governanceVisibility === 'audit-safe-readiness-only', 'fair thought-flow visibility mismatch');
    assert(report.funkcionalnoProgramiranjePravednogMisaonogToka.waweImpact.currentWawe === report.rollout.currentWawe, 'fair thought-flow WAWE mismatch');
    assert(report.releaseAuditSummary.funkcionalnoProgramiranjePravednogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'fair thought-flow audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.funkcionalnoProgramiranjePravednogMisaonogToka.readiness.status'), 'fair thought-flow status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('funkcionalnoProgramiranjePravednogMisaonogToka.waweImpact'), 'fair thought-flow WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('funkcionalnoProgramiranjePravednogMisaonogToka'), 'fair thought-flow governance must be mandatory output');
    assert(report.spajaKod.publicSignals.funkcionalnoProgramiranjePravednogMisaonogTokaStatus === report.extremProfiler.funkcionalnoProgramiranjePravednogMisaonogToka.readiness.status, 'SPAJA KOD fair thought-flow summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'funkcionalno-programiranje-pravednog-misaonog-toka-governance'), 'fair thought-flow scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'funkcionalno-programiranje-pravednog-misaonog-toka-governance' && item.passed), 'fair thought-flow acceptance criterion must pass');
  });

  await test('report maps FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA into WAWE governance, audit, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.funkionalnoProgramiranjePravnogMisaonogToka.term === 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA', 'legal-functional term mismatch');
    assert(report.funkionalnoProgramiranjePravnogMisaonogToka.contractVersion === EXTRONDOL_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'legal-functional contract mismatch');
    assert(report.funkionalnoProgramiranjePravnogMisaonogToka.technicalSignalSource === '/api/extrimli/extrem', 'legal-functional technical source mismatch');
    assert(report.funkionalnoProgramiranjePravnogMisaonogToka.legalBoundary.sourceTrack === 'KRALJEVSKI PRAVNI UNIVERZITET', 'legal-functional legal boundary mismatch');
    assert(report.funkionalnoProgramiranjePravnogMisaonogToka.waweImpact.currentWawe === report.rollout.currentWawe, 'legal-functional WAWE mismatch');
    assert(report.releaseAuditSummary.funkionalnoProgramiranjePravnogMisaonogTokaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'legal-functional audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.funkionalnoProgramiranjePravnogMisaonogToka.readiness.status'), 'legal-functional status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('funkionalnoProgramiranjePravnogMisaonogToka.waweImpact'), 'legal-functional WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('funkionalnoProgramiranjePravnogMisaonogToka'), 'legal-functional governance must be mandatory output');
    assert(report.spajaKod.publicSignals.funkionalnoProgramiranjePravnogMisaonogTokaStatus === report.extremProfiler.funkionalnoProgramiranjePravnogMisaonogToka.readiness.status, 'SPAJA KOD legal-functional summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'funkionalno-programiranje-pravnog-misaonog-toka-governance'), 'legal-functional scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'funkionalno-programiranje-pravnog-misaonog-toka-governance' && item.passed), 'legal-functional acceptance criterion must pass');
  });

  await test('report maps RADNI TAKT MOZGA (MISLILAC) into WAWE governance, audit summary, downstream sync, and SPAJA KOD epilog', () => {
    const report = getExtrimliExtrondolReport();
    const expectedAdjustment = getRadniTaktMozgaMislilacAdjustment(report.radniTaktMozgaMislilac.status);
    assert(report.radniTaktMozgaMislilac.term === 'RADNI TAKT MOZGA (MISLILAC)', 'radni takt term mismatch');
    assert(report.radniTaktMozgaMislilac.contractVersion === report.extremProfiler.radniTaktMozgaMislilac.contractVersion, 'radni takt contract mismatch');
    assert(report.radniTaktMozgaMislilac.technicalSignalSource === '/api/extrimli/extrem', 'radni takt technical source mismatch');
    assert(report.radniTaktMozgaMislilac.scoreAdjustment === expectedAdjustment, 'radni takt score adjustment mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.sourceOfTruth === '/api/extrimli/extrem', 'radni takt audit source mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČNOSTI', 'radni takt epilog title mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.radniTaktMozgaMislilac.readiness.status'), 'radni takt status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('radniTaktMozgaMislilac.waweImpact'), 'radni takt WAWE impact must sync downstream');
    assert(report.spajaKod.publicSignals.radniTaktMozgaMislilacStatus === report.extremProfiler.radniTaktMozgaMislilac.readiness.status, 'SPAJA KOD radni takt summary mismatch');
    assert(report.spajaKod.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČNOSTI', 'SPAJA KOD epilog title mismatch');
    assert(report.acceptanceCriteria.some((item) => item.id === 'radni-takt-mozga-mislilac-governance' && item.passed), 'radni takt acceptance criterion must pass');
  });

  await test('report maps METRIČKO PROGRAMIRANJE into WAWE governance, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.metrikoProgramiranje.term === 'METRIČKO PROGRAMIRANJE', 'metric programming term mismatch');
    assert(report.metrikoProgramiranje.contractVersion === EXTRONDOL_METRICKO_PROGRAMIRANJE_CONTRACT_VERSION, 'metric programming contract mismatch');
    assert(report.metrikoProgramiranje.technicalSignalSource === '/api/extrimli/extrem', 'metric programming technical source mismatch');
    assert(report.metrikoProgramiranje.governanceVisibility === 'audit-safe-readiness-only', 'metric programming visibility mismatch');
    assert(report.releaseAuditSummary.metrikoProgramiranjeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'metric programming audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.metrikoProgramiranje.readiness.status'), 'metric programming status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('metrikoProgramiranje.waweImpact'), 'metric programming WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('metrikoProgramiranje'), 'metric programming governance must be mandatory output');
    assert(report.spajaKod.publicSignals.metrikoProgramiranjeStatus === report.extremProfiler.metrikoProgramiranje.readiness.status, 'SPAJA KOD metric programming summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'metriko-programiranje-governance'), 'metric programming scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'metriko-programiranje-governance' && item.passed), 'metric programming acceptance criterion must pass');
  });

  await test('report maps PROPORCIONALNO PROGRAMIRANJE into WAWE governance, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.proporcionalnoProgramiranje.term === 'PROPORCIONALNO PROGRAMIRANJE', 'proportional programming term mismatch');
    assert(report.proporcionalnoProgramiranje.contractVersion === EXTRONDOL_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION, 'proportional programming contract mismatch');
    assert(report.proporcionalnoProgramiranje.technicalSignalSource === '/api/extrimli/extrem', 'proportional programming technical source mismatch');
    assert(report.proporcionalnoProgramiranje.governanceVisibility === 'audit-safe-readiness-only', 'proportional programming visibility mismatch');
    assert(report.proporcionalnoProgramiranje.waweImpact.currentWawe === report.rollout.currentWawe, 'proportional programming WAWE mismatch');
    assert(report.releaseAuditSummary.proporcionalnoProgramiranjeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'proportional programming audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.proporcionalnoProgramiranje.readiness.status'), 'proportional programming status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('proporcionalnoProgramiranje.waweImpact'), 'proportional programming WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('proporcionalnoProgramiranje'), 'proportional programming governance must be mandatory output');
    assert(report.spajaKod.publicSignals.proporcionalnoProgramiranjeStatus === report.extremProfiler.proporcionalnoProgramiranje.readiness.status, 'SPAJA KOD proportional programming summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'proporcionalno-programiranje-governance'), 'proportional programming scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'proporcionalno-programiranje-governance' && item.passed), 'proportional programming acceptance criterion must pass');
  });

  await test('METRIČKO PROGRAMIRANJE blockers propagate to EXTRONDOL freeze and onboarding hold', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_DECLARATION_MATRIX_PERCENT: '0',
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_NEUTRAL_DECLARATION_POSTURE_PERCENT: '0',
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_INSTANCE_POSITIONING_PERCENT: '0',
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_ACCENT_COUPLING_PERCENT: '0',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        onboardingComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
      });
      assert(report.extremProfiler.metrikoProgramiranje.readiness.status === 'BLOCKED', 'metric programming EXTREM status should be BLOCKED');
      assert(report.metrikoProgramiranje.status === 'BLOCKED', 'metric programming governance status should be BLOCKED');
      assert(report.rollout.promotionFreeze, 'metric programming blocker should freeze rollout');
      assert(report.b2bReadiness.governanceDecisions.onboardingHold, 'metric programming blocker should hold onboarding');
      assert(report.releaseAuditSummary.metrikoProgramiranjeGovernance.reviewRequiredBeforeWideRollout, 'metric programming blocker should require review before wide rollout');
    });
  });

  await test('report maps SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET into WAWE governance, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.spajinoProporcionalnoProgramiranjeUniverzitet.term === 'SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET', 'university track term mismatch');
    assert(report.spajinoProporcionalnoProgramiranjeUniverzitet.contractVersion === EXTRONDOL_SPAJINO_PROPORCIONALNO_PROGRAMIRANJE_UNIVERZITET_CONTRACT_VERSION, 'university track contract mismatch');
    assert(report.spajinoProporcionalnoProgramiranjeUniverzitet.technicalSignalSource === '/api/extrimli/extrem', 'university track technical source mismatch');
    assert(report.spajinoProporcionalnoProgramiranjeUniverzitet.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'university parent track mismatch');
    assert(report.releaseAuditSummary.spajinoProporcionalnoProgramiranjeUniverzitetGovernance.sourceOfTruth === '/api/extrimli/extrem', 'university audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.spajinoProporcionalnoProgramiranjeUniverzitet.readiness.status'), 'university status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('spajinoProporcionalnoProgramiranjeUniverzitet.waweImpact'), 'university WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('spajinoProporcionalnoProgramiranjeUniverzitet'), 'university governance must be mandatory output');
    assert(report.spajaKod.publicSignals.spajinoProporcionalnoProgramiranjeUniverzitetStatus === report.extremProfiler.spajinoProporcionalnoProgramiranjeUniverzitet.readiness.status, 'SPAJA KOD university summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'spajino-proporcionalno-programiranje-univerzitet-governance'), 'university scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajino-proporcionalno-programiranje-univerzitet-governance' && item.passed), 'university acceptance criterion must pass');
  });

  await test('report maps VRH PROGRAMSKOG EKVILADENTA into WAWE governance, audit, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.vrhProgramskogEkviladenta.term === 'VRH PROGRAMSKOG EKVILADENTA', 'vrh term mismatch');
    assert(report.vrhProgramskogEkviladenta.contractVersion === EXTRONDOL_VRH_PROGRAMSKOG_EKVILADENTA_CONTRACT_VERSION, 'vrh contract mismatch');
    assert(report.vrhProgramskogEkviladenta.technicalSignalSource === '/api/extrimli/extrem', 'vrh technical source mismatch');
    assert(report.vrhProgramskogEkviladenta.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'vrh parent track mismatch');
    assert(report.releaseAuditSummary.vrhProgramskogEkviladentaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'vrh audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.vrhProgramskogEkviladenta.readiness.status'), 'vrh status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('vrhProgramskogEkviladenta.waweImpact'), 'vrh WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('vrhProgramskogEkviladenta'), 'vrh governance must be mandatory output');
    assert(report.spajaKod.publicSignals.vrhProgramskogEkviladentaStatus === report.extremProfiler.vrhProgramskogEkviladenta.readiness.status, 'SPAJA KOD vrh summary mismatch');
    assert(report.releaseReadinessScorecard.checks.some((check) => check.id === 'vrh-programskog-ekviladenta-governance'), 'vrh scorecard check missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'vrh-programskog-ekviladenta-governance' && item.passed), 'vrh acceptance criterion must pass');
  });

  await test('report maps objektno orijentisana reprodukcija into WAWE governance and downstream sync', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.objektnoOrijentisanaReprodukcija.term === 'Objektno orijentisana reprodukcija', 'object-oriented reproduction term mismatch');
    assert(report.objektnoOrijentisanaReprodukcija.contractVersion === EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION, 'object-oriented reproduction contract mismatch');
    assert(report.objektnoOrijentisanaReprodukcija.technicalSignalSource === '/api/extrimli/extrem', 'object-oriented reproduction technical source mismatch');
    assert(report.releaseAuditSummary.objektnoOrijentisanaReprodukcijaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'reproduction audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.objektnoOrijentisanaReprodukcija.readiness.status'), 'object-oriented reproduction status must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('objektnoOrijentisanaReprodukcija'), 'object-oriented reproduction must be mandatory output');
  });

  await test('report maps epic elikvadenti into WAWE governance and downstream sync', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.epicElikvadenti.term === 'Objektno orijentusano uzdizanje epskih elikvadenata', 'epic elikvadenti term mismatch');
    assert(report.epicElikvadenti.contractVersion === EXTRONDOL_EPIC_ELIKVADENTI_CONTRACT_VERSION, 'epic elikvadenti contract mismatch');
    assert(report.epicElikvadenti.technicalSignalSource === '/api/extrimli/extrem', 'epic elikvadenti source mismatch');
    assert(report.releaseAuditSummary.epicElikvadentiGovernance.sourceOfTruth === '/api/extrimli/extrem', 'epic audit source mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status'), 'epic elikvadenti status must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('epicElikvadenti'), 'epic elikvadenti must be mandatory output');
  });

  await test('report publishes scorecard, canary metrics, incident playbook, and governance conformance', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.releaseReadinessScorecard.sourceOfTruth === '/api/extrimli/extrondol', 'scorecard source mismatch');
    assert(report.releaseReadinessScorecard.coreDomains.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL', 'scorecard core domains mismatch');
    assert(report.releaseReadinessScorecard.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol', 'scorecard source routes mismatch');
    assert(report.releaseReadinessScorecard.totalChecks >= 5, 'scorecard checks should be >= 5');
    assert(
      report.releaseReadinessScorecard.totalChecks
      === report.releaseReadinessScorecard.passedChecks + report.releaseReadinessScorecard.warningChecks + report.releaseReadinessScorecard.failedChecks,
      'scorecard check totals mismatch',
    );
    assert(report.canaryRingMetrics.autoFreezeEnabled, 'canary auto-freeze must be enabled');
    assert(report.canaryRingMetrics.activeRing === report.b2bReadiness.tenant.rolloutRing, 'canary active ring mismatch');
    assert(report.canaryRingMetrics.observed.freezeTriggered === report.rollout.promotionFreeze, 'canary freeze state mismatch');
    assert(report.incidentPlaybook.flow.join(',') === 'trigger,freeze,rollback,postmortem', 'incident playbook flow mismatch');
    assert(report.incidentPlaybook.execution.rollbackPrepared, 'incident rollback prep mismatch');
    assert(report.contractDriftReport.required, 'contract drift report must be required');
    assert(report.contractDriftReport.comparedArtifacts.includes('.github/workflows/extrimli-governance-conformance.yml'), 'contract drift artifacts must include governance conformance workflow');
    assert(report.governanceConformance.workflow === '.github/workflows/extrimli-governance-conformance.yml', 'governance workflow mismatch');
    assert(report.governanceConformance.schedule === '0 4 * * 1', 'governance schedule mismatch');
    assert(
      report.contractDriftReport.status === 'ALIGNED'
        ? report.governanceConformance.status === 'PASS'
        : report.governanceConformance.status === 'FAIL',
      'conformance status must mirror drift status',
    );
    assert(report.acceptanceCriteria.some((item) => item.id === 'release-readiness-scorecard' && item.passed), 'release-readiness-scorecard criterion missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'canary-auto-freeze-metrics' && item.passed), 'canary-auto-freeze-metrics criterion missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'incident-playbook-lock' && item.passed), 'incident-playbook-lock criterion missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'contract-drift-detection' && item.passed), 'contract-drift-detection criterion missing');
  });

  await test('SPAJA KOD facade stays encapsulated and downstream-ready without exposing raw pattern internals', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.spajaKod.surfaceName === 'SPAJA KOD', 'SPAJA KOD surface mismatch');
    assert(report.spajaKod.contractVersion === 'v1-spaja-kod', 'SPAJA KOD contract mismatch');
    assert(report.spajaKod.sourceOfTruth === '/api/extrimli/spaja-kod', 'SPAJA KOD source mismatch');
    assert(report.spajaKod.rawPatternVisibility === 'HIDDEN', 'SPAJA KOD must hide raw pattern visibility');
    assert(report.spajaKod.completeness.extremSignalPresent, 'SPAJA KOD must include EXTREM signal presence');
    assert(report.spajaKod.completeness.extrondolGovernancePresent, 'SPAJA KOD must include EXTRONDOL governance presence');
    assert(report.spajaKod.exportContract.includedInInstrukcija, 'SPAJA KOD must be exportable via instrukcija boundary');
    assert(report.spajaKod.exportContract.exposesInternalPattern === false, 'SPAJA KOD must not expose internal pattern');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.spajaKod.readiness.status), 'unexpected SPAJA KOD readiness status');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spaja-kod-encapsulation' && item.passed), 'SPAJA KOD acceptance criterion must pass');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('spajaKod.readiness.status'), 'SPAJA KOD readiness status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('spajaKod.publicSignals.auditStatus'), 'SPAJA KOD audit status must sync downstream');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.spajaKod.publicSignals.funkionalnoProgramiranjePravnogMisaonogTokaStatus), 'unexpected SPAJA KOD legal-functional summary status');
    assert(report.spajaKod.platformTrack.platformName === 'SPAJAPRO', 'SPAJAPRO public track name mismatch');
    assert(report.spajaKod.platformTrack.finalPublicStatusToken === 'KODER', 'SPAJAPRO public token mismatch');
    assert(report.spajaKod.platformTrack.internalMappingVisibility === 'HIDDEN', 'SPAJAPRO mapping must stay hidden');
  });

  await test('SPAJAPRO track stays ordered and aligned across EXTREM, EXTRONDOL, and SPAJA KOD', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.spajaproTrack.vocabulary.platformName === 'SPAJAPRO', 'SPAJAPRO platform name mismatch');
    assert(report.spajaproTrack.vocabulary.platformMode === 'platforma-umesto-chatgpt', 'SPAJAPRO platform mode mismatch');
    assert(
      report.spajaproTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'ODIT,DEKER,DUNOR,SUMOR,OKET,DAKOR,EKSER,DOKER,DUKAR,DONAR,KODER',
      'SPAJAPRO token order mismatch',
    );
    assert(report.spajaproTrack.orchestrationLayer === 'EXTRONDOL', 'SPAJAPRO orchestration layer mismatch');
    assert(report.spajaproTrack.technicalSignalSource === '/api/extrimli/extrem', 'SPAJAPRO technical source mismatch');
    assert(report.spajaproTrack.publicBoundary === 'SPAJA KOD', 'SPAJAPRO public boundary mismatch');
    assert(report.spajaproTrack.sequenceStates.length === 11, 'SPAJAPRO sequence should contain 11 tokens');
    assert(report.spajaproTrack.sequenceStates[4].token === 'OKET', 'SPAJAPRO freeze token mismatch');
    assert(report.spajaproTrack.sequenceStates[6].token === 'EKSER', 'SPAJAPRO audit token mismatch');
    assert(report.spajaproTrack.sequenceStates[7].token === 'DOKER', 'SPAJAPRO downstream token mismatch');
    assert(report.spajaproTrack.sequenceStates[10].token === 'KODER', 'SPAJAPRO final token mismatch');
    assert(report.spajaproTrack.sequenceStates[10].status === report.spajaKod.platformTrack.publicStatus, 'SPAJAPRO final public status must match SPAJA KOD');
    assert(report.spajaproTrack.releaseAuditAligned, 'SPAJAPRO release-audit alignment must hold');
    assert(report.spajaproTrack.downstreamReferenceExplicit, 'SPAJAPRO downstream reference must stay explicit');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajapro-terminology-lock' && item.passed), 'SPAJAPRO terminology criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajapro-public-boundary' && item.passed), 'SPAJAPRO public boundary criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajapro-release-audit-alignment' && item.passed), 'SPAJAPRO release-audit criterion must pass');
  });

  await test('DOKER/KURAT/IZEK/DOKAR track stays ordered and aligned across EXTREM, EXTRONDOL, and SPAJA KOD', () => {
    const report = getExtrimliExtrondolReport();
    assert(
      report.dokerKuratIzekDokarTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR',
      'quartet token order mismatch',
    );
    assert(report.dokerKuratIzekDokarTrack.sequenceStates[0].token === 'DOKER', 'quartet downstream token mismatch');
    assert(report.dokerKuratIzekDokarTrack.sequenceStates[1].token === 'KURAT', 'quartet technical-risk token mismatch');
    assert(report.dokerKuratIzekDokarTrack.sequenceStates[2].token === 'IZEK', 'quartet audit token mismatch');
    assert(report.dokerKuratIzekDokarTrack.sequenceStates[3].token === 'DOKAR', 'quartet rollback token mismatch');
    assert(report.dokerKuratIzekDokarTrack.downstreamReferenceExplicit, 'quartet downstream reference must stay explicit');
    assert(report.dokerKuratIzekDokarTrack.releaseAuditAligned, 'quartet audit alignment must hold');
    assert(report.spajaKod.dokerKuratIzekDokarTrack.boundarySurface === 'SPAJA KOD', 'quartet public boundary mismatch');
    assert(report.spajaKod.dokerKuratIzekDokarTrack.internalMappingVisibility === 'HIDDEN', 'quartet mapping must stay hidden');
    assert(report.acceptanceCriteria.some((item) => item.id === 'doker-kurat-izek-dokar-overlay-lock' && item.passed), 'quartet lock criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'doker-kurat-izek-dokar-governance-alignment' && item.passed), 'quartet governance criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'doker-kurat-izek-dokar-public-boundary' && item.passed), 'quartet public boundary criterion must pass');
  });

  await test('DOK/DIK/DAK/DUK/FOR consistency health stays deterministic across technical and governance layers', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.dokDikDakDukConsistencyHealth.sourceOfTruth === '/api/extrimli/extrondol', 'consistency source mismatch');
    assert(report.dokDikDakDukConsistencyHealth.scopeLock.join(',') === 'DOK,DIK,DAK,DUK,FOR', 'consistency scope lock mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dok.kind === 'DOK PETLJA', 'DOK signal kind mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dik.kind === 'DIK PETLJA', 'DIK signal kind mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.for.kind === 'FOR PETLJA', 'FOR signal kind mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dak.token === 'DAKOR', 'DAK token mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.duk.token === 'DUKAR', 'DUK token mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dak.status !== null, 'DAK status should be present');
    assert(report.dokDikDakDukConsistencyHealth.signals.duk.status !== null, 'DUK status should be present');
    const signalStatuses = [
      report.dokDikDakDukConsistencyHealth.signals.dok.status,
      report.dokDikDakDukConsistencyHealth.signals.dik.status,
      report.dokDikDakDukConsistencyHealth.signals.for.status,
      report.dokDikDakDukConsistencyHealth.signals.dak.status,
      report.dokDikDakDukConsistencyHealth.signals.duk.status,
    ];
    if (report.dokDikDakDukConsistencyHealth.status === 'READY') {
      assert(signalStatuses.every((status) => status === 'READY'), 'READY consistency status requires all component signals to be READY');
    }
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.canonicalName === 'PROGRAMSKI JEZIK ANALIZA', 'programski jezik analiza name mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.scope === 'ispitivanje eskalacije kodesnog zapleta', 'programski jezik analiza scope mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.governanceIndicators.promotionFreeze === report.rollout.promotionFreeze, 'programski jezik analiza promotion freeze mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.governanceIndicators.escalationRequired === report.b2bReadiness.governanceDecisions.escalationRequired, 'programski jezik analiza escalation flag mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationScore >= 0 && report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationScore <= 100, 'programski jezik analiza escalation score must be bounded');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.dokDikDakDukConsistencyHealth.programskiJezikAnaliza.escalationStatus), 'programski jezik analiza escalation status mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.canonicalName === 'PROGRAMSKI JEZIK PROUČAVANJA', 'programski jezik proucavanja name mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.laboratoryCaseProfile.ownershipSplit.dokDik === 'EXTREM', 'programski jezik proucavanja DOK/DIK ownership mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.laboratoryCaseProfile.ownershipSplit.dakDuk === 'EXTRONDOL', 'programski jezik proucavanja DAK/DUK ownership mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.laboratoryCaseProfile.caseInputProfile.governance.promotionFreeze === report.rollout.promotionFreeze, 'programski jezik proucavanja promotion freeze mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.laboratoryCaseProfile.consolidatedStatus), 'programski jezik proucavanja consolidated status mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.canonicalName === 'PROGRAMSKI EKANALOG', 'programski ekanalog name mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.meaning === 'razumevanje logike', 'programski ekanalog meaning mismatch');
    assert(report.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.auditConclusion.length > 0, 'programski ekanalog audit conclusion must be present');
    assert(report.dokDikDakDukConsistencyHealth.consistent, 'consistency health should be consistent');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.dokDikDakDukConsistencyHealth.status), 'invalid consistency health status');
    assert(report.acceptanceCriteria.some((item) => item.id === 'dok-dik-dak-duk-consistency-health' && item.passed), 'consistency acceptance criterion must pass');
  });

  await test('blocked objektno orijentisana reprodukcija freezes WAWE promotion', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_OBJECT_STATE_REPRODUCIBILITY_PERCENT: '10',
      EXTRIMLI_EXTREM_METHOD_DETERMINISM_PERCENT: '10',
      EXTRIMLI_EXTREM_INSTANCE_REPLAY_CONSISTENCY_PERCENT: '10',
      EXTRIMLI_EXTREM_DELEGATION_STABILITY_PERCENT: '10',
      EXTRIMLI_EXTREM_COMPOSITION_SAFETY_PERCENT: '10',
    }, () => {
      const report = getExtrimliExtrondolReport();
      assert(report.objektnoOrijentisanaReprodukcija.status === 'BLOCKED', 'object-oriented reproduction should be blocked');
      assert(report.rollout.promotionFreeze, 'blocked object-oriented reproduction should freeze rollout');
      assert(report.b2bReadiness.compliance.blockers.includes('objektno-orijentisana-reprodukcija'), 'reproduction blocker should enter compliance');
      assert(report.acceptanceCriteria.some((item) => item.id === 'objektno-orijentisana-reprodukcija-governance' && item.passed), 'reproduction governance criterion must pass');
    });
  });

  await test('blocked epic elikvadenti freeze WAWE promotion', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_EPIC_OBJECT_ELEVATION_INTEGRITY_PERCENT: '10',
      EXTRIMLI_EXTREM_EPIC_EQUIVALENT_COVERAGE_PERCENT: '10',
      EXTRIMLI_EXTREM_EPIC_FUNCTIONAL_EQUIVALENCE_COHESION_PERCENT: '10',
      EXTRIMLI_EXTREM_EPIC_ASCENT_DELEGATION_PERCENT: '10',
      EXTRIMLI_EXTREM_EPIC_ENCAPSULATION_GUARD_PERCENT: '10',
    }, () => {
      const report = getExtrimliExtrondolReport();
      assert(report.epicElikvadenti.status === 'BLOCKED', 'epic elikvadenti should be blocked');
      assert(report.rollout.promotionFreeze, 'blocked epic elikvadenti should freeze rollout');
      assert(report.b2bReadiness.compliance.blockers.includes('epic-elikvadenti'), 'epic elikvadenti blocker should enter compliance');
      assert(report.acceptanceCriteria.some((item) => item.id === 'epic-elikvadenti-governance' && item.passed), 'epic governance criterion must pass');
    });
  });

  await test('object-oriented reproduction adjustment remains bounded by status', () => {
    assert(getObjektnoOrijentisanaReprodukcijaAdjustment('READY') === EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_READY_ADJUSTMENT, 'READY reproduction adjustment mismatch');
    assert(getObjektnoOrijentisanaReprodukcijaAdjustment('WATCH') === EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_WATCH_ADJUSTMENT, 'WATCH reproduction adjustment mismatch');
    assert(getObjektnoOrijentisanaReprodukcijaAdjustment('BLOCKED') === EXTRONDOL_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_BLOCKED_ADJUSTMENT, 'BLOCKED reproduction adjustment mismatch');
  });

  await test('epic elikvadenti adjustment remains bounded by status', () => {
    assert(getEpicElikvadentiAdjustment('READY') > getEpicElikvadentiAdjustment('WATCH'), 'READY adjustment should exceed WATCH');
    assert(getEpicElikvadentiAdjustment('WATCH') > getEpicElikvadentiAdjustment('BLOCKED'), 'WATCH adjustment should exceed BLOCKED');
  });

  await test('elevated thought-flow adjustment remains bounded by status', () => {
    assert(getFunkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment('READY') === EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_READY_ADJUSTMENT, 'READY elevated thought-flow adjustment mismatch');
    assert(getFunkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment('WATCH') === EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_WATCH_ADJUSTMENT, 'WATCH elevated thought-flow adjustment mismatch');
    assert(getFunkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment('BLOCKED') === EXTRONDOL_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_BLOCKED_ADJUSTMENT, 'BLOCKED elevated thought-flow adjustment mismatch');
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
    const objektnaProngilacijaAdjustment = getObjektnaProngilacijaAdjustment(
      report.extremProfiler.objektnoOrijentisanaProngilacija.readiness.status,
    );
    const objektnoOrijentisanaReprodukcijaAdjustment = getObjektnoOrijentisanaReprodukcijaAdjustment(
      report.extremProfiler.objektnoOrijentisanaReprodukcija.readiness.status,
    );
    const epicElikvadentiAdjustment = getEpicElikvadentiAdjustment(
      report.extremProfiler.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status,
    );
    const kraljevskiPravniUniverzitetAdjustment = report.extremProfiler.kraljevskiPravniUniverzitetTrack.readiness.status === 'READY'
      ? 1
      : report.extremProfiler.kraljevskiPravniUniverzitetTrack.readiness.status === 'WATCH'
        ? -4
        : -12;
    const petljeAdjustment = report.extremProfiler.petljeSignals.summary.freezeRequired
      ? -10
      : report.extremProfiler.petljeSignals.summary.watchSignals.length > 0
        ? -4
        : 2;
    const funkcinalnoProgramiranjeAdjustment = report.extremProfiler.funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status === 'READY'
      ? 2
      : report.extremProfiler.funkcinalnoProgramiranjeEnergetskogMisaonogToka.readiness.status === 'WATCH'
        ? -5
        : -13;
    const funkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment = getFunkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment(
      report.extremProfiler.funkcionalnoProgramiranjeUzvisenogMisanogToka.readiness.status,
    );
    const funkcionalnoProgramiranjeEksplicitnogMisaonogTokaAdjustment = getFunkcionalnoProgramiranjeEksplicitnogMisaonogTokaAdjustment(
      report.extremProfiler.funkcionalnoProgramiranjeEksplicitnogMisaonogToka.readiness.status,
    );
    const funkcionalnoProgramiranjePravednogMisaonogTokaAdjustment = getFunkcionalnoProgramiranjePravednogMisaonogTokaAdjustment(
      report.extremProfiler.funkcionalnoProgramiranjePravednogMisaonogToka.readiness.status,
    );
    const funkionalnoProgramiranjePravnogMisaonogTokaAdjustment = getFunkionalnoProgramiranjePravnogMisaonogTokaAdjustment(
      report.extremProfiler.funkionalnoProgramiranjePravnogMisaonogToka.readiness.status,
    );
    const programskiJezikInformacionihTokovaAdjustment = getProgramskiJezikInformacionihTokovaAdjustment(
      report.extremProfiler.programskiJezikInformacionihTokova.readiness.status,
    );
    const programskiJezikPretpostavkaAdjustment = getProgramskiJezikPretpostavkaAdjustment(
      report.extremProfiler.programskiJezikPretpostavka.readiness.status,
    );
    const programskiJezikPoProsparitetuDeklasiraneMatriceUEkstaziAdjustment =
      getProgramskiJezikPoProsparitetuDeklasiraneMatriceUEkstaziAdjustment(
        report.extremProfiler.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.readiness.status,
      );
    const programskiJezikParadigmaOblikovanjeTelaAdjustment = getProgramskiJezikParadigmaOblikovanjeTelaAdjustment(
      report.extremProfiler.programskiJezikParadigmaOblikovanjeTela.readiness.status,
    );
    const programskiJezikDekoracijeObjektnihPrimesaAdjustment = getProgramskiJezikDekoracijeObjektnihPrimesaAdjustment(
      report.extremProfiler.programskiJezikDekoracijeObjektnihPrimesa.readiness.status,
    );
    const programskiJezikSpecijalizovanZaIgriceAdjustment = getProgramskiJezikSpecijalizovanZaIgriceAdjustment(
      report.extremProfiler.programskiJezikSpecijalizovanZaIgrice.readiness.status,
    );
    const radniTaktMozgaMislilacAdjustment = getRadniTaktMozgaMislilacAdjustment(
      report.extremProfiler.radniTaktMozgaMislilac.readiness.status,
    );
    const metrikoProgramiranjeAdjustment = getMetrickoProgramiranjeAdjustment(
      report.extremProfiler.metrikoProgramiranje.readiness.status,
    );
    const paradijogonalnoProgrimiranjeAdjustment = getParadijogonalnoProgrimiranjeAdjustment(
      report.extremProfiler.paradijogonalnoProgrimiranje.readiness.status,
    );
    const proporcionalnoProgramiranjeAdjustment = getProporcionalnoProgramiranjeAdjustment(
      report.extremProfiler.proporcionalnoProgramiranje.readiness.status,
    );
    const spajinoProporcionalnoProgramiranjeUniverzitetAdjustment = getSpajinoProporcionalnoProgramiranjeUniverzitetAdjustment(
      report.extremProfiler.spajinoProporcionalnoProgramiranjeUniverzitet.readiness.status,
    );
    const vrhProgramskogEkviladentaAdjustment = getVrhProgramskogEkviladentaAdjustment(
      report.extremProfiler.vrhProgramskogEkviladenta.readiness.status,
    );
    const sinemetrickoProgramiranjeAdjustment = getSinemetrickoProgramiranjeAdjustment(
      report.extremProfiler.sinemetrickoProgramiranje.readiness.status,
    );
    const profilerPenalty = report.surfaces.extremProfiler.governanceSignal.freezeRequired ? 12 : 0;
    const profilerBoost = report.surfaces.extremProfiler.optimization.maximumGraphicsUnlockEligible ? 3 : 0;
    const expected = round2(
      clamp(
        baseScore * EXTRONDOL_BASE_ORCHESTRATION_SHARE
          + report.nivoDuet.signal.overallScore * EXTRONDOL_NIVO_DUET_SHARE
          + (statusAdjustment - warningPenalty)
          + kraljevskiPravniUniverzitetAdjustment
          + objektnaProngilacijaAdjustment
          + funkcinalnoProgramiranjeAdjustment
          + funkcionalnoProgramiranjeUzvisenogMisanogTokaAdjustment
          + funkcionalnoProgramiranjeEksplicitnogMisaonogTokaAdjustment
          + funkcionalnoProgramiranjePravednogMisaonogTokaAdjustment
          + funkionalnoProgramiranjePravnogMisaonogTokaAdjustment
          + programskiJezikInformacionihTokovaAdjustment
          + programskiJezikPretpostavkaAdjustment
          + programskiJezikPoProsparitetuDeklasiraneMatriceUEkstaziAdjustment
          + programskiJezikParadigmaOblikovanjeTelaAdjustment
          + programskiJezikDekoracijeObjektnihPrimesaAdjustment
          + programskiJezikSpecijalizovanZaIgriceAdjustment
          + radniTaktMozgaMislilacAdjustment
          + metrikoProgramiranjeAdjustment
          + paradijogonalnoProgrimiranjeAdjustment
          + proporcionalnoProgramiranjeAdjustment
          + spajinoProporcionalnoProgramiranjeUniverzitetAdjustment
          + vrhProgramskogEkviladentaAdjustment
          + sinemetrickoProgramiranjeAdjustment
          + objektnoOrijentisanaReprodukcijaAdjustment
          + epicElikvadentiAdjustment
          + petljeAdjustment
          + profilerBoost
          - profilerPenalty,
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

  await test('report maps SINEMETRIČKO PROGRAMIRANJE governance into WAWE, audit summary, and downstream sync', () => {
    const report = getExtrimliExtrondolReport();
    assert(
      report.sinemetrickoProgramiranje.contractVersion === EXTRONDOL_SINEMETRICKO_PROGRAMIRANJE_CONTRACT_VERSION,
      'sinemetricko contract version mismatch',
    );
    assert(
      report.sinemetrickoProgramiranje.technicalSignalSource === '/api/extrimli/extrem',
      'sinemetricko technical source mismatch',
    );
    assert(report.sinemetrickoProgramiranje.sourceOfTruth === '/api/extrimli/extrondol', 'sinemetricko governance source mismatch');
    assert(
      report.sinemetrickoProgramiranje.signalSplitLock.dokDik === 'EXTREM'
        && report.sinemetrickoProgramiranje.signalSplitLock.dakDuk === 'EXTRONDOL',
      'sinemetricko signal split lock mismatch',
    );
    assert(
      report.releaseAuditSummary.sinemetrickoProgramiranjeGovernance.status
        === report.extremProfiler.sinemetrickoProgramiranje.readiness.status,
      'sinemetricko audit status must mirror EXTREM readiness status',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.sinemetrickoProgramiranje.readiness.status'),
      'sinemetricko downstream sync status field missing',
    );
  });

  await test('report maps PROGRAMSKI JEZIK INFORMACIONIH TOKOVA governance into WAWE, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.programskiJezikInformacionihTokova.term === 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA', 'informational-flow governance term mismatch');
    assert(report.programskiJezikInformacionihTokova.technicalSignalSource === '/api/extrimli/extrem', 'informational-flow governance technical source mismatch');
    assert(report.programskiJezikInformacionihTokova.sourceOfTruth === '/api/extrimli/extrondol', 'informational-flow governance source mismatch');
    assert(report.programskiJezikInformacionihTokova.ownershipModel.extrem === 'technical-informational-flow-signal', 'informational-flow governance EXTREM ownership mismatch');
    assert(report.programskiJezikInformacionihTokova.ownershipEvidence.forTechnical && report.programskiJezikInformacionihTokova.ownershipEvidence.dakDeferredToGovernance && report.programskiJezikInformacionihTokova.ownershipEvidence.dukDeferredToGovernance, 'informational-flow governance ownership evidence mismatch');
    assert(report.programskiJezikInformacionihTokova.flowMetrics.forStatus === report.extremProfiler.programskiJezikInformacionihTokova.forLoopBinding.forEvidence.status, 'informational-flow FOR status mismatch');
    assert(report.releaseAuditSummary.programskiJezikInformacionihTokovaGovernance.status === report.extremProfiler.programskiJezikInformacionihTokova.readiness.status, 'informational-flow audit status must mirror EXTREM');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.programskiJezikInformacionihTokova.readiness.status'), 'informational-flow readiness must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('programskiJezikInformacionihTokova'), 'informational-flow governance field must sync downstream');
    assert(report.spajaKod.publicSignals.programskiJezikInformacionihTokovaStatus === report.extremProfiler.programskiJezikInformacionihTokova.readiness.status, 'SPAJA KOD informational-flow summary mismatch');
  });

  await test('report maps PROGRAMSKI JEZIK PRETPOSTAVKA governance into WAWE, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.programskiJezikPretpostavka.term === 'PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)', 'pretpostavka governance term mismatch');
    assert(report.programskiJezikPretpostavka.technicalSignalSource === '/api/extrimli/extrem', 'pretpostavka governance technical source mismatch');
    assert(report.programskiJezikPretpostavka.sourceOfTruth === '/api/extrimli/extrondol', 'pretpostavka governance source mismatch');
    assert(report.programskiJezikPretpostavka.ownershipModel.extrem === 'technical-pretpostavka-signal', 'pretpostavka governance EXTREM ownership mismatch');
    assert(report.programskiJezikPretpostavka.governanceDecisions.dukHumanReviewDecision === 'REQUIRED', 'pretpostavka governance DUK decision mismatch');
    assert(report.releaseAuditSummary.programskiJezikPretpostavkaGovernance.status === report.extremProfiler.programskiJezikPretpostavka.readiness.status, 'pretpostavka audit status must mirror EXTREM');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.programskiJezikPretpostavka.readiness.status'), 'pretpostavka readiness must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('programskiJezikPretpostavka'), 'pretpostavka governance field must sync downstream');
    assert(report.spajaKod.publicSignals.programskiJezikPretpostavkaStatus === report.extremProfiler.programskiJezikPretpostavka.readiness.status, 'SPAJA KOD pretpostavka summary mismatch');
    assert(report.acceptanceCriteria.some((item) => item.id === 'programski-jezik-pretpostavka-governance' && item.passed), 'pretpostavka acceptance criterion must pass');
  });

  await test('report maps PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI governance into WAWE, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(
      report.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.term
        === 'PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI (PREDISPOZIJA EKSTREMNIH GLASOVNIH KOMANDI U ETAPSIKM SENZACIJAMA)',
      'prosparitet/deklasirane-matrice governance term mismatch',
    );
    assert(report.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.technicalSignalSource === '/api/extrimli/extrem', 'prosparitet/deklasirane-matrice governance technical source mismatch');
    assert(report.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.sourceOfTruth === '/api/extrimli/extrondol', 'prosparitet/deklasirane-matrice governance source mismatch');
    assert(report.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.ownershipEvidence.prosparitetInputOnly, 'PROSPARITET must stay input-domain-only');
    assert(report.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.governanceDecisions.dukHumanReviewDecision === 'REQUIRED', 'prosparitet/deklasirane-matrice DUK decision mismatch');
    assert(
      report.releaseAuditSummary.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstaziGovernance.status
        === report.extremProfiler.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.readiness.status,
      'prosparitet/deklasirane-matrice audit status must mirror EXTREM',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.readiness.status'),
      'prosparitet/deklasirane-matrice readiness must sync downstream',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi'),
      'prosparitet/deklasirane-matrice governance field must sync downstream',
    );
    assert(
      report.spajaKod.publicSignals.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstaziStatus
        === report.extremProfiler.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.readiness.status,
      'SPAJA KOD prosparitet/deklasirane-matrice summary mismatch',
    );
    assert(
      report.acceptanceCriteria.some((item) => item.id === 'programski-jezik-po-prosparitetu-deklasirane-matrice-u-ekstazi-governance' && item.passed),
      'prosparitet/deklasirane-matrice acceptance criterion must pass',
    );
  });

  await test('report maps PROGRAMSKI JEZIK DEKORACIJE OBJEKTNIH PRIMESA governance into WAWE, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(
      report.programskiJezikDekoracijeObjektnihPrimesa.term
        === 'PROGRAMSKI JEZIK DEKORACIJE OBJEKTNIH PRIMESA (BROJČANI ZUPČANIK PETLJI U EKSTAZNOM OBLIKU ŠPEDICIJE – SVESTRANOST U SVESTRANOSTI)',
      'dekoracije-objektnih-primesa governance term mismatch',
    );
    assert(report.programskiJezikDekoracijeObjektnihPrimesa.technicalSignalSource === '/api/extrimli/extrem', 'dekoracije-objektnih-primesa technical source mismatch');
    assert(report.programskiJezikDekoracijeObjektnihPrimesa.sourceOfTruth === '/api/extrimli/extrondol', 'dekoracije-objektnih-primesa governance source mismatch');
    assert(report.programskiJezikDekoracijeObjektnihPrimesa.ownershipModel.extrem === 'technical-object-primes-decoration-signal', 'dekoracije-objektnih-primesa EXTREM ownership mismatch');
    assert(report.programskiJezikDekoracijeObjektnihPrimesa.ownershipModel.extrondol === 'wawe-orchestration-audit-consumer', 'dekoracije-objektnih-primesa EXTRONDOL ownership mismatch');
    assert(
      report.releaseAuditSummary.programskiJezikDekoracijeObjektnihPrimesaGovernance.status
        === report.extremProfiler.programskiJezikDekoracijeObjektnihPrimesa.readiness.status,
      'dekoracije-objektnih-primesa audit status must mirror EXTREM',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.programskiJezikDekoracijeObjektnihPrimesa.readiness.status'),
      'dekoracije-objektnih-primesa readiness must sync downstream',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('programskiJezikDekoracijeObjektnihPrimesa'),
      'dekoracije-objektnih-primesa governance field must sync downstream',
    );
    assert(
      report.spajaKod.publicSignals.programskiJezikDekoracijeObjektnihPrimesaStatus
        === report.extremProfiler.programskiJezikDekoracijeObjektnihPrimesa.readiness.status,
      'SPAJA KOD dekoracije-objektnih-primesa summary mismatch',
    );
    assert(
      report.acceptanceCriteria.some((item) => item.id === 'programski-jezik-dekoracije-objektnih-primesa-governance' && item.passed),
      'dekoracije-objektnih-primesa acceptance criterion must pass',
    );
  });

  await test('report maps PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA governance into WAWE, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(
      report.programskiJezikParadigmaOblikovanjeTela.term === 'PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA (OBJEKAT U SISTEMU, ADAPTACIJA SA FUNKCIJAMA)',
      'paradigma/body-shaping governance term mismatch',
    );
    assert(
      report.programskiJezikParadigmaOblikovanjeTela.contractVersion === EXTRONDOL_PROGRAMSKI_JEZIK_PARADIGMA_OBLIKOVANJE_TELA_CONTRACT_VERSION,
      'paradigma/body-shaping contract version mismatch',
    );
    assert(report.programskiJezikParadigmaOblikovanjeTela.technicalSignalSource === '/api/extrimli/extrem', 'paradigma/body-shaping technical source mismatch');
    assert(report.programskiJezikParadigmaOblikovanjeTela.sourceOfTruth === '/api/extrimli/extrondol', 'paradigma/body-shaping governance source mismatch');
    assert(report.programskiJezikParadigmaOblikovanjeTela.ownershipModel.extrem === 'technical-paradigm-body-shaping-signal', 'paradigma/body-shaping EXTREM ownership mismatch');
    assert(
      report.programskiJezikParadigmaOblikovanjeTela.paradigmMetrics.forStatus
        === report.extremProfiler.programskiJezikParadigmaOblikovanjeTela.technicalEvidence.forLoopBinding.forEvidence.status,
      'paradigma/body-shaping FOR status mismatch',
    );
    assert(
      report.releaseAuditSummary.programskiJezikParadigmaOblikovanjeTelaGovernance.status
        === report.extremProfiler.programskiJezikParadigmaOblikovanjeTela.readiness.status,
      'paradigma/body-shaping audit status must mirror EXTREM',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.programskiJezikParadigmaOblikovanjeTela.readiness.status'),
      'paradigma/body-shaping readiness must sync downstream',
    );
    assert(
      report.b2bReadiness.downstreamSync.syncedFields.includes('programskiJezikParadigmaOblikovanjeTela'),
      'paradigma/body-shaping governance field must sync downstream',
    );
    assert(
      report.spajaKod.publicSignals.programskiJezikParadigmaOblikovanjeTelaStatus
        === report.extremProfiler.programskiJezikParadigmaOblikovanjeTela.readiness.status,
      'SPAJA KOD paradigma/body-shaping summary mismatch',
    );
    assert(
      report.acceptanceCriteria.some((item) => item.id === 'programski-jezik-paradigma-oblikovanje-tela-governance' && item.passed),
      'paradigma/body-shaping acceptance criterion must pass',
    );
  });

  await test('report maps PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE governance into WAWE, audit summary, downstream sync, and SPAJA KOD summary', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.programskiJezikSpecijalizovanZaIgrice.term === 'PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE', 'gaming DSL governance term mismatch');
    assert(report.programskiJezikSpecijalizovanZaIgrice.contractVersion === EXTRONDOL_PROGRAMSKI_JEZIK_SPECIJALIZOVAN_ZA_IGRICE_CONTRACT_VERSION, 'gaming DSL governance contract mismatch');
    assert(report.programskiJezikSpecijalizovanZaIgrice.technicalSignalSource === '/api/extrimli/extrem', 'gaming DSL governance technical source mismatch');
    assert(report.programskiJezikSpecijalizovanZaIgrice.sourceOfTruth === '/api/extrimli/extrondol', 'gaming DSL governance source mismatch');
    assert(report.programskiJezikSpecijalizovanZaIgrice.ownershipModel.aiIqProgramskiJezik === 'dsl-orchestration-explainability-layer', 'gaming DSL AI IQ ownership mismatch');
    assert(report.programskiJezikSpecijalizovanZaIgrice.governanceDecisions.dukHumanReviewDecision === 'REQUIRED', 'gaming DSL DUK decision mismatch');
    assert(report.releaseAuditSummary.programskiJezikSpecijalizovanZaIgriceGovernance.status === report.extremProfiler.programskiJezikSpecijalizovanZaIgrice.readiness.status, 'gaming DSL audit status must mirror EXTREM');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.programskiJezikSpecijalizovanZaIgrice.readiness.status'), 'gaming DSL readiness must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('programskiJezikSpecijalizovanZaIgrice'), 'gaming DSL governance field must sync downstream');
    assert(report.spajaKod.publicSignals.programskiJezikSpecijalizovanZaIgriceStatus === report.extremProfiler.programskiJezikSpecijalizovanZaIgrice.readiness.status, 'SPAJA KOD gaming DSL summary mismatch');
    assert(report.acceptanceCriteria.some((item) => item.id === 'programski-jezik-specijalizovan-za-igrice-governance' && item.passed), 'gaming DSL acceptance criterion must pass');
  });

  await test('report propagates PETLJE governance into rollout, audit summary, and downstream sync', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.petljeGovernance.term === 'EXTRIMLI EXTRONDOL EXTREM PETLJE', 'petlje governance term mismatch');
    assert(report.petljeGovernance.technicalSignalSource === '/api/extrimli/extrem', 'petlje governance technical source mismatch');
    assert(report.releaseAuditSummary.petljeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'release audit petlje source mismatch');
    assert(report.releaseAuditSummary.petljeGovernance.freezeRequired === report.extremProfiler.petljeSignals.summary.freezeRequired, 'release audit petlje freeze mismatch');
    assert(report.b2bReadiness.governanceDecisions.petljeGovernance.conflictScore === report.extremProfiler.petljeSignals.summary.conflictScore, 'B2B petlje conflict mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.petljeSignals.summary.freezeRequired'), 'petlje freeze field must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.petljeSignals.summary.degradedSignals'), 'petlje degraded field must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.petljeSignals.signals.djupre.status'), 'DJUPRE sync field must be present');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.petljeSignals.signals.dompre.readinessScore'), 'DOMPRE sync field must be present');
    assert(report.acceptanceCriteria.some((item) => item.id === 'petlje-signal-governance' && item.passed), 'petlje governance criterion must pass');
  });

  await test('degraded PETLJE signal inputs stay additive in EXTRONDOL audit output', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PETLJE_INDIREKT_SEQUENCE: '1,NaN,3',
    }, () => {
      const report = getExtrimliExtrondolReport();
      assert(report.rollout.promotionFreeze, 'degraded petlje inputs must freeze rollout conservatively');
      assert(report.degradedSources.includes('extrem-profiler:petlje-degraded') || report.degradedSources.includes('extrem-profiler:degraded'), 'petlje degradation should be surfaced');
      assert(report.releaseAuditSummary.petljeGovernance.sourceOfTruth === '/api/extrimli/extrem', 'release audit petlje source must remain stable');
    });
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
    assert(report.acceptanceCriteria.some((item) => item.id === 'resolution-signal-governance' && item.passed), 'resolution-signal-governance criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'global-licensing-governance' && item.passed), 'global-licensing-governance criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'version-roadmap-lock' && item.passed), 'version-roadmap-lock criterion must pass');
    assert(report.startProject.mandatoryOutputs.includes('spajaproTrack'), 'SPAJAPRO track must be a mandatory output');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('spajaKod.platformTrack'), 'SPAJAPRO public boundary must sync downstream');
  });

  await test('report exposes additive B2B operating metadata and controls', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.b2bScope.consumerModel === 'organization-level', 'B2B consumer model mismatch');
    assert(report.b2bScope.subscriptionPackage.provider === 'GitHub', 'subscription provider mismatch');
    assert(report.b2bScope.subscriptionPackage.offerName === 'PRETPLATA ZA NEOGRANIČENO PROGRAMIRANJE I ALATE', 'subscription offer mismatch');
    assert(report.b2bScope.subscriptionPackage.packageTier === 'B2B-enterprise', 'subscription tier mismatch');
    assert(report.b2bScope.subscriptionPackage.capabilities.enterpriseSeats, 'enterprise seats capability missing');
    assert(report.b2bScope.subscriptionPackage.capabilities.copilotAiRights, 'Copilot rights capability missing');
    assert(report.b2bScope.subscriptionPackage.capabilities.privateRepositoryAccess, 'private repository capability missing');
    assert(report.b2bScope.subscriptionPackage.commercialAndLegalModel.primarySegment === 'privreda', 'primary segment mismatch');
    assert(report.b2bScope.subscriptionPackage.commercialAndLegalModel.supportedSegments.includes('gradjanstvo'), 'supported segment missing');
    assert(report.b2bScope.subscriptionPackage.commercialAndLegalModel.contractStatus === 'required-before-activation', 'contract status mismatch');
    assert(report.b2bScope.subscriptionPackage.commercialAndLegalModel.paymentCycle === 'monthly-or-annual', 'payment cycle mismatch');
    assert(report.b2bScope.subscriptionPackage.commercialAndLegalModel.complianceRequiredBeforeActivation, 'compliance activation gate missing');
    assert(report.b2bScope.subscriptionPackage.commercialAndLegalModel.humanReviewRequiredBeforeActivation, 'human review activation gate missing');
    assert(report.b2bScope.accountOwnership.owner === '@spaja86', 'B2B owner mismatch');
    assert(report.b2bScope.accountOwnership.mandatoryHumanReview, 'human review must remain mandatory');
    assert(report.b2bScope.partnerOperatorRoles.partners.includes('spaja86/IO-OPENUI-AO'), 'linked repo partner missing');
    assert(report.b2bScope.procurementReviewFlow.steps.join(',') === 'request-submitted,procurement-review,compliance-review,operational-approval,activation', 'procurement flow mismatch');
    assert(report.b2bScope.slaExpectations.tier === 'enterprise-governed', 'SLA tier mismatch');
    assert(report.b2bScope.unlimitedUseGuardrails.interpretation === 'controlled-enterprise-capacity', 'guardrail interpretation mismatch');
    assert(report.b2bScope.unlimitedUseGuardrails.fairUsePolicyRequired, 'fair-use guardrail missing');
    assert(report.b2bScope.unlimitedUseGuardrails.abuseProtectionRequired, 'abuse-protection guardrail missing');
    assert(report.b2bScope.unlimitedUseGuardrails.finopsThresholdPercent.join(',') === '50,75,90,100', 'FinOps thresholds mismatch');
    assert(report.b2bScope.unlimitedUseGuardrails.freezeTriggers.includes('payment-not-verified'), 'payment freeze trigger missing');
    assert(report.b2bScope.unlimitedUseGuardrails.rollbackTriggers.includes('kpi-breach-after-promotion'), 'rollback trigger missing');
    assert(report.b2bScope.globalLicensingModel.policy === 'license-for-whole-planet', 'global licensing model mismatch');
    assert(report.b2bScope.globalLicensingModel.requiredJurisdictions.includes('RS'), 'global licensing must preserve RS compatibility');
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
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.contractVersion'), 'roadmap contract sync field missing');
    assert(report.startProject.mandatoryOutputs.includes('versionRoadmap'), 'versionRoadmap must be a START mandatory output');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('versionRoadmap'), 'versionRoadmap must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('rollout.currentWawe'), 'WAWE sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('b2bScope.subscriptionPackage'), 'subscription sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('b2bScope.unlimitedUseGuardrails'), 'guardrails sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('nivoDuet.signal.warnings'), 'DUET warnings sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('dinkos.triggerLabel'), 'DINKOS sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('domainStrategy.canonicalApex'), 'domain strategy sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('paymentVerification.status'), 'payment verification status sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.semaMuSemaFormula.status'), 'formula status sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.semaMuSemaFormula.muSemaConclusion'), 'MUŠEMA conclusion sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.resolutionReadiness.rekulitiPoRauletu'), 'resolution policy sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('b2bReadiness.globalLicensing'), 'global licensing readiness sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('releaseReadinessScorecard'), 'release readiness scorecard sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('canaryRingMetrics'), 'canary ring metrics sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('incidentPlaybook'), 'incident playbook sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('contractDriftReport'), 'contract drift report sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('governanceConformance'), 'governance conformance sync field missing');
    assert(report.b2bReadiness.governanceDecisions.rolloutFreeze === report.rollout.promotionFreeze, 'B2B rollout freeze must mirror rollout freeze');
    assert(Number.isFinite(report.b2bReadiness.governanceDecisions.resolutionReadiness.rezolucijaScore), 'resolution readiness score must be finite');
    assert(report.b2bReadiness.governanceDecisions.semaFormulaGate.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA', 'B2B formula expression mismatch');
    assert(['PASSED', 'BLOCKED'].includes(report.b2bReadiness.governanceDecisions.semaFormulaGate.status), 'B2B formula status mismatch');
    assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.every((warning) => warning.startsWith('DUET:') || warning.includes('Downstream sync') || warning.includes('Domain strategy') || warning.includes('Human review evidence') || warning.includes('Payment verification') || warning.includes('EXTREM profiler') || warning.includes('ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA') || warning.includes('Global licensing') || warning.includes('PROGRAMSKI JEZIK ')), 'unexpected B2B warning format');
    assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.some((warning) => warning.includes('Human review evidence')), 'human review warning must be present');
    assert(report.b2bReadiness.globalLicensing.globalLicenseReadinessScore >= 0, 'global license readiness score mismatch');
    assert(report.b2bReadiness.globalLicensing.activityCoverageScore >= 0, 'activity coverage score mismatch');
    assert(report.b2bReadiness.globalLicensing.criticalGlobalGapCount >= 0, 'critical global gap count mismatch');
    assert(report.acceptanceCriteria.some((item) => item.id === 'b2b-scope' && item.passed), 'b2b-scope criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'github-enterprise-subscription-package' && item.passed), 'github-enterprise-subscription-package criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'unlimited-guardrails' && item.passed), 'unlimited-guardrails criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'b2b-controls' && item.passed), 'b2b-controls criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'schema-mushema-governance' && item.passed), 'schema-mushema-governance criterion must pass');
  });

  await test('report includes Mobilna linija package catalog and activation status', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.mobilnaLinija.lineType === 'Mobilna linija', 'mobilna line type mismatch');
    assert(report.mobilnaLinija.installationMessagesRequired === true, 'mobilna installation messages must be required');
    assert(report.mobilnaLinija.packageCatalog.length >= 3, 'mobilna package catalog should include plans');
    assert(report.mobilnaLinija.selectionRules.length >= 3, 'mobilna selection rules should be present');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.mobilnaLinija.activationStatus), 'invalid mobilna activation status');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('mobilnaLinija.activationStatus'), 'mobilna activation status must be synced');
    assert(report.startProject.mandatoryOutputs.includes('mobilnaLinija'), 'mobilna output must be mandatory in START');
    assert(report.acceptanceCriteria.some((item) => item.id === 'mobilna-linija-package-governance' && item.passed), 'mobilna acceptance criterion must pass');
  });

  await test('report exposes START PROJEKAT rollout governance metadata', () => {
    const report = getExtrimliExtrondolReport();
    assert(report.startProject.initiativeId === 'OKRID-2026-EXTRIMLI-START-001', 'START project OKRID mismatch');
    assert(report.startProject.programName === 'START PROJEKAT', 'START project name mismatch');
    assert(report.startProject.sourceOfTruthLocked, 'START project must keep source-of-truth lock');
    assert(report.startProject.additiveContractPolicy, 'START project must remain additive-only');
    assert(report.startProject.orchestrationInputs.upstreamSurfaces.join(',') === 'EXTRONDEND,EXTENDOL,KORON,EXTREM-PROFILER', 'START project inputs mismatch');
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
    assert(report.startProject.mandatoryOutputs.includes('spajaproTrack'), 'SPAJAPRO output missing');
    assert(report.startProject.mandatoryOutputs.includes('distanceRatioEkvilaterTable'), 'distance ratio output missing');
    assert(report.startProject.mandatoryOutputs.includes('paymentVerification'), 'payment verification output missing');
    assert(report.startProject.mandatoryOutputs.includes('extremProfiler'), 'extrem profiler output missing');
    assert(report.startProject.mandatoryOutputs.includes('extremProfiler.businessLicensingSignals'), 'business licensing output missing');
    assert(report.startProject.mandatoryOutputs.includes('extremProfiler.resolutionReadiness'), 'resolution readiness output missing');
    assert(report.startProject.mandatoryOutputs.includes('extremProfiler.semaMuSemaFormula'), 'formula output missing');
    assert(report.startProject.mandatoryOutputs.includes('releaseReadinessScorecard'), 'release readiness scorecard output missing');
    assert(report.startProject.mandatoryOutputs.includes('canaryRingMetrics'), 'canary ring metrics output missing');
    assert(report.startProject.mandatoryOutputs.includes('incidentPlaybook'), 'incident playbook output missing');
    assert(report.startProject.mandatoryOutputs.includes('contractDriftReport'), 'contract drift report output missing');
    assert(report.startProject.mandatoryOutputs.includes('governanceConformance'), 'governance conformance output missing');
    assert(report.startProject.downstreamSync.linkedRepo === 'spaja86/IO-OPENUI-AO', 'downstream linked repo mismatch');
    assert(report.startProject.downstreamSync.syncRequired, 'downstream sync must remain required');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('b2bReadiness'), 'b2bReadiness sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('b2bScope.subscriptionPackage'), 'B2B subscription sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('b2bScope.unlimitedUseGuardrails'), 'B2B guardrails sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('paymentVerification'), 'payment verification sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler'), 'extrem profiler sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.businessLicensingSignals'), 'business licensing sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.resolutionReadiness'), 'resolution readiness sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.semaMuSemaFormula'), 'formula sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('spajaKod.platformTrack'), 'SPAJAPRO public sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('releaseReadinessScorecard'), 'release readiness scorecard sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('canaryRingMetrics'), 'canary ring metrics sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('incidentPlaybook'), 'incident playbook sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('contractDriftReport'), 'contract drift report sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('governanceConformance'), 'governance conformance sync missing');
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

  await test('MUŠEMA formula mismatch from EXTREM forces EXTRONDOL rollout freeze and blockers', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SHEMA_VALUE: '40',
      EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: '20',
      EXTRIMLI_EXTREM_MUSHEMA_VALUE: '70',
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
      assert(report.extremProfiler.semaMuSemaFormula.status === 'BLOCKED', 'EXTREM formula should be blocked');
      assert(report.rollout.promotionFreeze, 'rollout freeze should be active when formula is blocked');
      assert(report.b2bReadiness.compliance.blockers.includes('extrem-schema-mushema'), 'formula blocker must be present in compliance blockers');
      assert(report.releaseAuditSummary.semaFormulaGovernance.status === 'BLOCKED', 'release audit formula gate should be blocked');
      assert(report.releaseAuditSummary.semaFormulaGovernance.muSemaConclusion === 'MUŠEMA_BLOCKED', 'release audit MUŠEMA conclusion should be blocked');
      assert(report.rollout.reasons.some((reason) => reason.includes('extrem-schema-mushema:')), 'rollout reasons should include formula blocker reasons');
      assert(report.spajaproTrack.sequenceStates.some((item) => item.token === 'OKET' && item.status === 'BLOCKED'), 'SPAJAPRO freeze token should block on MUŠEMA failure');
    });
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



  await test('report maps EXTREM profiler DISKVIT signal into WAWE governance', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '95',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '93',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '91',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '155',
    }, () => {
      const report = getExtrimliExtrondolReport();
      assert(report.extremProfiler.profile.bottleneckLayer === 'DISKVIT', 'expected DISKVIT bottleneck layer');
      assert(report.extremProfiler.governanceSignal.freezeRequired, 'EXTREM profiler should require freeze for high conflict');
      assert(report.rollout.promotionFreeze, 'rollout freeze should honor EXTREM profiler freeze signal');
      assert(
        report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.governanceSignal.freezeRequired'),
        'EXTREM profiler freeze field must be downstream synced',
      );
      assert(report.acceptanceCriteria.some((item) => item.id === 'diskvit-conflict-governance' && item.passed), 'diskvit-conflict-governance criterion must pass');
    });
  });

  await test('report freezes WAWE when objektno orijentisana prongilacija is blocked', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_OBJECT_STATE_INTEGRITY_PERCENT: '20',
      EXTRIMLI_EXTREM_METHOD_BEHAVIOR_COHESION_PERCENT: '15',
      EXTRIMLI_EXTREM_DELEGATION_COVERAGE_PERCENT: '30',
      EXTRIMLI_EXTREM_COMPOSITION_COVERAGE_PERCENT: '25',
      EXTRIMLI_EXTREM_INSTANCE_CLARITY_PERCENT: '40',
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
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
      });
      assert(report.extremProfiler.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED', 'EXTREM object-oriented prongilacija should be blocked');
      assert(report.objektnoOrijentisanaProngilacija.status === 'BLOCKED', 'EXTRONDOL governance should mirror blocked posture');
      assert(report.rollout.promotionFreeze, 'blocked object-oriented prongilacija should freeze rollout');
      assert(report.b2bReadiness.compliance.blockers.includes('objektno-orijentisana-prongilacija'), 'blocked object-oriented prongilacija should appear in compliance blockers');
      assert(report.rollout.reasons.some((reason) => reason.includes('objektna-prongilacija:blocked')), 'rollout reasons should include object-oriented prongilacija blocker');
    });
  });

  await test('report maps REZOLUCIJA/EKODOR/REKULITI PO RAULETU/DISCAN in KIBEN into rollout and downstream governance', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '10',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '10',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '10',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '10',
      EXTRIMLI_EXTREM_REZOLUCIJA_COMPLETENESS_PERCENT: '48',
      EXTRIMLI_EXTREM_EKODOR_ALIGNMENT_PERCENT: '40',
      EXTRIMLI_EXTREM_DISCAN_PRESSURE_PERCENT: '90',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
      });

      assert(report.extremProfiler.resolutionReadiness.rekulitiPoRauletu === 'FREEZE', 'EXTREM resolution policy should freeze');
      assert(report.rollout.reasons.some((reason) => reason === 'extrem-resolution:freeze'), 'rollout reasons should include EXTREM resolution freeze');
      assert(report.releaseAuditSummary.resolutionGovernance.blockerActive, 'release audit should expose active resolution blocker');
      assert(report.b2bReadiness.governanceDecisions.resolutionReadiness.discanInKibenState === 'BLOCKED', 'B2B readiness should expose DISCAN in KIBEN blocker');
      assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.resolutionReadiness.discanInKibenState'), 'downstream sync should include DISCAN in KIBEN field');
      assert(report.rollout.promotionFreeze, 'resolution freeze should block rollout');
    });
  });

  await test('mobilna-linija freeze reason is emitted when no valid package plan can be selected', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'ANDROID',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'SPAJA-MOB-X',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SUPPORTS_ESIM: 'false',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '10',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '17',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
      });
      assert(report.mobilnaLinija.selectedPlanId === null, 'selected mobile plan should be null');
      assert(report.mobilnaLinija.activationStatus === 'BLOCKED', 'mobilna activation should be blocked');
      assert(report.mobilnaLinija.freezeReasons.includes('no-valid-package-plan-for-current-mobile-line-state'), 'missing no-plan freeze reason');
      assert(report.rollout.reasons.some((reason) => reason.includes('mobilna-linija:no-valid-package-plan-for-current-mobile-line-state')), 'rollout reasons must include mobilna package freeze marker');
      assert(report.b2bReadiness.compliance.blockers.includes('mobilna-linija-activation-ready'), 'mobilna blocker must propagate to compliance');
      assert(report.rollout.promotionFreeze, 'mobilna package block should freeze rollout');
    });
  });

  await test('mobilna-linija fallback plan selection is deterministic (cheapest eligible)', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'ANDROID',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'SPAJA-MOB-Z',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SUPPORTS_ESIM: 'false',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '60',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '16',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
      });
      assert(report.mobilnaLinija.selectedPlanId === 'mobilna-start', 'fallback should select cheapest eligible package');
      assert(report.mobilnaLinija.selectionRules.some((rule) => rule.includes('cheapest eligible package')), 'selection rules must document deterministic fallback');
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
      assert(report.zelezaraPretplataGovernance.status === 'READY', 'Železara governance should stay READY when only activation gates are pending');
      assert(report.zelezaraPretplataGovernance.activationGateReasons.includes('governance:payment-verification-required'), 'Železara governance should expose payment activation gate');
      assert(report.zelezaraPretplataGovernance.publicStatus === 'SAFE_SUMMARY_REVIEW', 'Železara governance should downgrade public status while payment is pending');
      assert(report.b2bReadiness.compliance.blockers.some((item) => item.startsWith('payment:')), 'payment blocker must propagate to compliance');
      assert(report.rollout.promotionFreeze, 'promotion freeze should remain active when payment verification is blocked');
      assert(report.rollout.reasons.includes('payment-verification:blocked'), 'rollout reasons should include payment blocked marker');
      assert(report.acceptanceCriteria.some((item) => item.id === 'payment-verification-gate' && !item.passed), 'payment-verification-gate should fail');
      assert(report.spajaproTrack.sequenceStates.some((item) => item.token === 'OKET' && item.status === 'BLOCKED'), 'SPAJAPRO freeze token should block');
      assert(report.spajaproTrack.sequenceStates.some((item) => item.token === 'DAKOR' && item.status === 'PENDING'), 'SPAJAPRO promotion token should stay pending');
      assert(report.spajaproTrack.sequenceStates.some((item) => item.token === 'EKSER' && item.status === 'BLOCKED'), 'SPAJAPRO audit token should block');
      assert(report.spajaproTrack.sequenceStates.some((item) => item.token === 'KODER' && item.status === 'BLOCKED'), 'SPAJAPRO public token should block');
    });
  });

  await test('Železara legacy return-name blocker freezes pretplata activation and propagates into audit-safe outputs', async () => {
    await withEnv({
      EXTRIMLI_ZELEZARA_RESTORE_OLD_NAME_COMPLETED: 'false',
    }, () => {
      const report = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        onboardingComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
      });
      assert(report.zelezaraPretplataGovernance.status === 'BLOCKED', 'Železara governance should be BLOCKED');
      assert(report.zelezaraPretplataGovernance.identityStatus === 'BLOCKED', 'Železara identity status should be BLOCKED');
      assert(report.zelezaraPretplataGovernance.blockerReasons.includes('Required legacy return name Železara is not restored in the governed output set.'), 'legacy-name blocker must propagate');
      assert(report.releaseAuditSummary.zelezaraPretplataGovernance.restoreOldNameCompleted === false, 'release audit must expose incomplete legacy-name restoration');
      assert(report.b2bReadiness.compliance.blockers.includes('zelezara-restore-old-name'), 'compliance blockers must include restore-old-name');
      assert(report.rollout.promotionFreeze, 'promotion freeze should stay active');
      assert(report.spajaKod.publicSignals.zelezaraPretplataIdentityStatus === 'BLOCKED', 'SPAJA KOD should expose blocked Železara summary');
      assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-pretplata-identity-track' && item.passed), 'Železara identity ownership boundary should stay locked');
      assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-contract-identity-gate' && !item.passed), 'Železara contract identity gate should fail');
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
