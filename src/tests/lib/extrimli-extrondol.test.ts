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
    assert(lock.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol,/api/extrimli/spaja-kod', 'developer/create source routes mismatch');
    assert(lock.driftZeroLayers.join(',') === 'docs,types,routes,tests,workflows', 'developer/create drift-zero layers mismatch');
    assert(lock.ownershipBoundary.dik === 'EXTREM' && lock.ownershipBoundary.for === 'EXTREM' && lock.ownershipBoundary.duk === 'EXTRONDOL', 'DIK/FOR/DUK ownership split mismatch');
    assert(lock.prExecutionLock.singleRoadmapStagePerPr, 'single-roadmap-stage-per-PR lock must be enabled');
    assert(lock.prExecutionLock.measurableOutputRequired, 'measurable-output lock must be enabled');
    assert(lock.prExecutionLock.requiredFields.join(',') === 'roadmapStageId,measurableOutput,acceptanceEvidence', 'PR execution required fields mismatch');
    assert(lock.dailyOperationalCadence.cadenceBlocks.join(',') === 'morning-startup,deep-focus-block,midday-checkpoint,end-of-day-closeout', 'daily cadence blocks mismatch');
    assert(lock.dailyOperationalCadence.taskPriorities.join(',') === '1,2,3', 'daily cadence priorities mismatch');
    assert(lock.dailyOperationalCadence.endOfDayStatuses.join(',') === 'completed,carried-over,blocked', 'daily cadence closeout statuses mismatch');
    assert(lock.operationalAuditPackage.required, 'operational audit package must be required');
    assert(lock.operationalAuditPackage.standardizedPrDescription, 'operational audit package must standardize PR description');
    assert(lock.operationalAuditPackage.requiredFields.join(',') === 'rolloutPlan,rollbackPlan,kpiImpact,humanReviewStatus,downstreamReference', 'operational audit package required fields mismatch');
    assert(lock.mandatoryArtifacts.docs.includes('docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md'), 'VRH mandatory doc artifact missing');
    assert(lock.mandatoryArtifacts.docs.includes('docs/EXTRIMLI-EXTERNAL-GITHUB.md'), 'external GitHub mandatory doc artifact missing');
    assert(lock.mandatoryArtifacts.docs.includes('docs/AI-IQ-WORLD-BANK-AI-IDENTITY-FINANCE-GOVERNANCE.md'), 'AI identity-finance mandatory doc artifact missing');
    assert(lock.mandatoryArtifacts.routes.includes('src/app/api/extrimli/extrem/route.ts'), 'EXTREM route mandatory artifact missing');
    assert(lock.mandatoryArtifacts.routes.includes('src/app/api/extrimli/spaja-kod/route.ts'), 'SPAJA KOD route mandatory artifact missing');
    assert(lock.mandatoryArtifacts.tests.includes('src/tests/api/extrimli-route.test.ts'), 'route test mandatory artifact missing');
    assert(lock.acceptanceLock.degradedPolicy === 'partial-payload-no-500', 'developer/create degraded policy mismatch');
    assert(report.startProject.mandatoryOutputs.includes('versionRoadmap.developerCreateLock'), 'developer/create lock must be a START mandatory output');
    assert(report.startProject.mandatoryOutputs.includes('extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.dailyOperationalCadence'), 'developer/create cadence must be a START mandatory output');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('versionRoadmap.developerCreateLock'), 'developer/create lock must be synced downstream');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.dailyOperationalCadence'), 'developer/create cadence must sync downstream');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance'), 'AI identity-finance governance must sync in START project contract');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance'), 'AI identity-finance release audit governance must sync in START project contract');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.developerCreateLock.driftZeroLayers'), 'developer/create drift-zero layers must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.developerCreateLock.dailyOperationalCadence'), 'developer/create cadence lock must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.developerCreateLock.definitionOfDone'), 'developer/create DoD must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.aiIdentityFinanceGovernance'), 'AI identity-finance EXTREM package must sync downstream');
    assert(report.roadmapAlignment.primaryVersion === 'Verzija 5', 'EXTRONDOL should align to Verzija 5');
    const implementationPackage = report.developerAndCreateRepoWideReflection.implementationPackage;
    const audioVisualKontrabasPackage = report.developerAndCreateRepoWideReflection.audioVisualKontrabasPackage;
    const eksperimentProgramskiJezikTrack = report.developerAndCreateRepoWideReflection.eksperimentProgramskiJezikTrack;
    const sarkazamPrivrednaGranaDigitalizmaTrack = report.developerAndCreateRepoWideReflection.sarkazamPrivrednaGranaDigitalizmaTrack;
    const napoleonDiskaveriSelectionTrack = report.developerAndCreateRepoWideReflection.napoleonDiskaveriSelectionTrack;
    assert(implementationPackage.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol,/api/extrimli/spaja-kod', 'developer/create governance implementation package source routes mismatch');
    assert(implementationPackage.currentWawe === report.rollout.currentWawe, 'developer/create governance implementation package current WAWE mismatch');
    assert(implementationPackage.eligibleNextWawe === report.rollout.eligibleNextWawe, 'developer/create governance implementation package next WAWE mismatch');
    assert(implementationPackage.canonicalOwnershipSplit.spajaKod === 'audit-safe-summary-only', 'developer/create governance implementation package SPAJA KOD boundary mismatch');
    assert(implementationPackage.smartProgramskiJezikPackage.scopeLock === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA', 'developer/create governance smart language scope mismatch');
    assert(implementationPackage.smartProgramskiJezikPackage.governanceMirror.waweProgressionRequired, 'developer/create governance smart language WAWE requirement mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(implementationPackage.smartProgramskiJezikPackage.technicalProfile.status), 'developer/create governance smart language status mismatch');
    assert(implementationPackage.eksperimentProgramskiJezikBoundary.trackRole === 'bounded-film-audio-experiment-alias-track', 'developer/create governance implementation package Eksperiment Programski Jezik boundary role mismatch');
    assert(implementationPackage.eksperimentProgramskiJezikBoundary.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == EKSPERIMENT PROGRAMSKI JEZIK (PRODUKCIJA FILMSKOG I AUDIO REPERTOARA)', 'developer/create governance implementation package Eksperiment Programski Jezik alias mismatch');
    assert(implementationPackage.eksperimentProgramskiJezikBoundary.extremPublishes === 'readiness-blocker-watch-deterministic-fallback-signal-only', 'developer/create governance implementation package Eksperiment Programski Jezik EXTREM publish contract mismatch');
    assert(implementationPackage.eksperimentProgramskiJezikBoundary.extrondolPublishes === 'wawe-freeze-promotion-review-rollback-audit-summary-only', 'developer/create governance implementation package Eksperiment Programski Jezik EXTRONDOL publish contract mismatch');
    assert(implementationPackage.eksperimentProgramskiJezikBoundary.spajaKodPublishes === 'status-blocker-watch-review-and-downstream-reference-only', 'developer/create governance implementation package Eksperiment Programski Jezik SPAJA KOD publish contract mismatch');
    assert(implementationPackage.eksperimentProgramskiJezikBoundary.rawInternalsExposed === false, 'developer/create governance implementation package Eksperiment Programski Jezik must hide internals');
    assert(implementationPackage.sarkazamPrivrednaGranaDigitalizmaBoundary.trackRole === 'bounded-sarkazam-digitalizam-alias-track', 'developer/create governance implementation package Sarkazam boundary role mismatch');
    assert(implementationPackage.sarkazamPrivrednaGranaDigitalizmaBoundary.spajaKodPublishes === 'status-blocker-review-and-downstream-reference-only', 'developer/create governance implementation package Sarkazam SPAJA KOD publish contract mismatch');
    assert(implementationPackage.kraljevskiProgramskiUneverzitetBoundary.boundedFacultyDomains.join(',') === 'POLJOPRIVREDNI FAKULTET,GRAĐEVINSKI FAKULTET,MATEMATIČKI FAKULTET', 'developer/create governance implementation package bounded faculty domains mismatch');
    assert(implementationPackage.covecanstvuEpilogBoundary.publicOutput === 'summary-only', 'developer/create governance implementation package ČOVEČANSTVU output mismatch');
    assert(implementationPackage.validationLock.driftZeroLayers.join(',') === 'docs,types,routes,tests,workflows', 'developer/create governance implementation package drift-zero mismatch');
    assert(implementationPackage.napoleonDiskaveriSelectionBoundary.trackRole === 'bounded-discovery-selection-alias-track', 'developer/create governance implementation package Napoleon Diskaveri boundary role mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.canonicalName === 'KRALJEVSKI DRUŠTVENI POREDAK', 'developer/create governance social-order canonical name mismatch');
    assert(
      report.developerAndCreateRepoWideReflection.canonicalMapeUmaScopeLock
        === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA',
      'developer/create governance MAPE UMA canonical scope lock mismatch',
    );
    assert(
      report.developerAndCreateRepoWideReflection.globalPageExplanationContract.boundedThematicSignals.join(',')
        === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir',
      'developer/create governance global explanation thematic signals mismatch',
    );
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.sourceOfTruth === '/api/extrimli/extrondol', 'developer/create governance social-order source mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.beneficiaryGovernance.eligibleCategories.join(',') === 'nezbrinuti,nezaposleni', 'developer/create governance social-order beneficiary categories mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskaDopuna.approvalPosture.payoutReadinessStatus === report.developerAndCreateRepoWideReflection.privredniAkt.readiness.status, 'developer/create governance kraljevska dopuna payout posture mismatch');
    assert(audioVisualKontrabasPackage.acceptanceEvidence.join(',') === 'developerAndCreateRepoWideReflection.audioVisualKontrabasPackage,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage,spajaKod.publicSignals.developerAndCreateAudioVisualStatus,spajaKod.developerAndCreateVisualReflection.audioVisualKontrabasPackage', 'developer/create governance audio-visual package acceptance evidence mismatch');
    assert(napoleonDiskaveriSelectionTrack.canonicalAlias === 'SELEKCIONIRANJE U SELEKCIJAMA PREMA AKTIVNOM NADMAŠAJU / NAPOLEON DISKAVERI', 'developer/create governance Napoleon Diskaveri canonical alias mismatch');
    assert(napoleonDiskaveriSelectionTrack.sourceOfTruth === '/api/extrimli/extrem', 'developer/create governance Napoleon Diskaveri source mismatch');
    assert(napoleonDiskaveriSelectionTrack.reviewPosture === napoleonDiskaveriSelectionTrack.humanReviewPosture, 'developer/create governance Napoleon Diskaveri review posture mismatch');
    assert(napoleonDiskaveriSelectionTrack.acceptanceEvidence.join(',') === 'developerAndCreateRepoWideReflection.napoleonDiskaveriSelectionTrack,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.napoleonDiskaveriSelectionTrack,spajaKod.publicSignals.napoleonDiskaveriStatus,spajaKod.developerAndCreateImplementationPackage.napoleonDiskaveriSummary', 'developer/create governance Napoleon Diskaveri acceptance evidence mismatch');
    assert(eksperimentProgramskiJezikTrack.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == EKSPERIMENT PROGRAMSKI JEZIK (PRODUKCIJA FILMSKOG I AUDIO REPERTOARA)', 'developer/create governance Eksperiment Programski Jezik alias mismatch');
    assert(eksperimentProgramskiJezikTrack.sourceOfTruth === '/api/extrimli/extrem', 'developer/create governance Eksperiment Programski Jezik source mismatch');
    assert(eksperimentProgramskiJezikTrack.acceptanceEvidence.join(',') === 'developerAndCreateRepoWideReflection.eksperimentProgramskiJezikTrack,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.eksperimentProgramskiJezikTrack,spajaKod.publicSignals.eksperimentProgramskiJezikStatus,spajaKod.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary', 'developer/create governance Eksperiment Programski Jezik acceptance evidence mismatch');
    assert(sarkazamPrivrednaGranaDigitalizmaTrack.canonicalAlias === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == SARKAZAM / PRIVREDNA GRANA DIGITALIZMA / PROJEKTI ENTUZIJAZMA PO ČINU OBLASTIMA', 'developer/create governance Sarkazam alias mismatch');
    assert(sarkazamPrivrednaGranaDigitalizmaTrack.sourceOfTruth === '/api/extrimli/extrem', 'developer/create governance Sarkazam source mismatch');
    assert(sarkazamPrivrednaGranaDigitalizmaTrack.acceptanceEvidence.join(',') === 'developerAndCreateRepoWideReflection.sarkazamPrivrednaGranaDigitalizmaTrack,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.sarkazamPrivrednaGranaDigitalizmaTrack,spajaKod.publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus,spajaKod.developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary', 'developer/create governance Sarkazam acceptance evidence mismatch');
    assert(audioVisualKontrabasPackage.acceptanceEvidence.join(',') === 'developerAndCreateRepoWideReflection.audioVisualKontrabasPackage,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage,spajaKod.publicSignals.developerAndCreateAudioVisualStatus,spajaKod.developerAndCreateVisualReflection.audioVisualKontrabasPackage', 'developer/create governance audio-visual package acceptance evidence mismatch');
    assert(['ALIGNED', 'WATCH', 'REVIEW_REQUIRED'].includes(audioVisualKontrabasPackage.reviewPosture), 'developer/create governance audio-visual review posture mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.canonicalName === 'KRALJEVSKI AKT BEZBEDNOSTI', 'developer/create governance security-act canonical name mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.civilReadinessScope.publicSafetyReviewPosture === report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.readiness.status || ['READY', 'WATCH', 'BLOCKED'].includes(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.civilReadinessScope.publicSafetyReviewPosture), 'developer/create governance security-act review posture mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaPlataPolicy.requiredGovernanceGates.includes('rollback-plan'), 'developer/create governance security-act salary rollback gate mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaVojnaIPolicijskaOprema.canonicalName === 'KRALJEVSKA VOJNA I POLICIJSKA OPREMA', 'developer/create governance equipment sub-track canonical name mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaVojnaIPolicijskaOprema.qualityCriteria.standard === 'najbolja-savremena-oprema-auditabilno-neoperativno', 'developer/create governance equipment sub-track quality standard mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaVojnaIPolicijskaOprema.requiredGovernanceGates.includes('downstream-sync'), 'developer/create governance equipment sub-track downstream-sync gate mismatch');
    assert(report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaVojnaIPolicijskaOprema.forbiddenEvidence.includes('weaponization-details'), 'developer/create governance equipment sub-track forbidden evidence mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityLifecycle.reviewRequiredBeforePayout, 'developer/create university lifecycle must require review before payout');
    assert(report.developerAndCreateRepoWideReflection.certificationGovernance.certificationWindowPercent.join(',') === '80,100', 'developer/create certification governance score window mismatch');
    assert(report.developerAndCreateRepoWideReflection.payoutGovernance.allowedArtifacts.join(',') === 'payout-status,approval-status,payment-verification,audit-evidence', 'developer/create payout governance artifacts mismatch');
    assert(report.developerAndCreateRepoWideReflection.payoutGovernance.kraljevstvoPlataPolicy === 'pod-pokroviteljstvom-ai-iq-world-bank-governance-only', 'developer/create payout governance kraljevstvo plata policy mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.developerAndCreateRepoWideReflection.payoutGovernance.privredniAktQuarterlyMarketStatus), 'developer/create payout governance privredni akt quarterly market status mismatch');
    assert(report.developerAndCreateRepoWideReflection.zadrugaGovernance.additiveOnly, 'developer/create zadruga governance must remain additive-only');
    assert(report.developerAndCreateRepoWideReflection.zadrugaGovernance.ownershipLockValidated, 'developer/create zadruga governance ownership lock must be validated');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.developerAndCreateRepoWideReflection.zadrugaGovernance.instrumentTablaOperationalStatus), 'developer/create zadruga governance instrument tabla status mismatch');
    assert(typeof report.developerAndCreateRepoWideReflection.zadrugaGovernance.freezeRequired === 'boolean', 'developer/create zadruga governance freeze flag mismatch');
    assert(report.developerAndCreateRepoWideReflection.privredniAkt.canonicalName === 'PRIVREDNI AKT', 'developer/create privredni akt canonical name mismatch');
    assert(report.developerAndCreateRepoWideReflection.privredniAkt.beneficiarySegments.join(',') === 'poljoprivrednici-sa-gostoprimstvom,poljoprivrednici', 'developer/create privredni akt beneficiary segment mismatch');
    assert(report.developerAndCreateRepoWideReflection.privredniAkt.kvartalniTrzisniModel.signalName === 'cene-privrednika-po-kvartalu', 'developer/create privredni akt signal name mismatch');
    assert(report.developerAndCreateRepoWideReflection.rewardApproval.hardGates.includes('rollback-plan'), 'developer/create reward approval must include rollback plan');
    assert(report.developerAndCreateRepoWideReflection.rewardApproval.hardGates.includes('duplicate-attempt-review'), 'developer/create reward approval must include duplicate attempt review');
    assert(typeof report.developerAndCreateRepoWideReflection.universityPublicSummary.passedAreasCount === 'number', 'developer/create public summary passed areas count mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityPublicSummary.additiveFacultyAndAgricultureTracks.stocarstvoStatus === report.developerAndCreateRepoWideReflection.kraljevskiEkonomskiUneverzitet.boundedPrivredniDomains.stocarstvo.readiness.status, 'developer/create public summary STOČARSTVO readiness mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityPublicSummary.additiveFacultyAndAgricultureTracks.gradjevinskiFakultetStatus === report.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.gradjevinskiFakultet.readiness.status, 'developer/create public summary GRAĐEVINSKI FAKULTET readiness mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityPublicSummary.additiveFacultyAndAgricultureTracks.matematickiFakultetStatus === report.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.matematickiFakultet.readiness.status, 'developer/create public summary MATEMATIČKI FAKULTET readiness mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityPublicSummary.additiveFacultyAndAgricultureTracks.pedagoskiFakultetStatus === report.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.pedagoskiFakultet.readiness.status, 'developer/create public summary PEDAGOŠKI FAKULTET readiness mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityPublicSummary.additiveFacultyAndAgricultureTracks.psiholoskiFakultetStatus === report.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.boundedFacultyDomains.psiholoskiFakultet.readiness.status, 'developer/create public summary PSIHOLOŠKI FAKULTET readiness mismatch');
    assert(report.developerAndCreateRepoWideReflection.universityPublicSummary.additiveFacultyAndAgricultureTracks.rolloutFreezeRequired === report.developerAndCreateRepoWideReflection.zadrugaGovernance.freezeRequired, 'developer/create public summary bounded-track freeze mismatch');
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
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.sourceOfTruth === '/api/extrimli/extrem', 'developer/create release audit source mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.readinessScore >= 0 && report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.readinessScore <= 100, 'developer/create release audit readiness score must be bounded');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.reviewRequiredBeforeWideRollout === (report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status !== 'READY'), 'developer/create release audit review requirement mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.extremExtrimliExtrondol === 'EXTRIMLI EXTRONDOL EXTREM', 'developer/create release audit canonical EXTRIMLI EXTRONDOL EXTREM vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.dokDikDakDukFor === 'DOK DIK DAK DUK FOR', 'developer/create release audit canonical DOK/DIK/DAK/DUK/FOR vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.kraljevskiPravniUniverzitet === 'KRALJEVSKI PRAVNI UNIVERZITET', 'developer/create release audit canonical KRALJEVSKI PRAVNI UNIVERZITET vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.kraljevskiProgramskiUneverzitet === 'KRALJEVSKI PROGRAMSKI UNEVERZITET', 'developer/create release audit canonical KRALJEVSKI PROGRAMSKI UNEVERZITET vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.kraljevskiEkonomskiUneverzitet === 'KRALJEVSKI EKONOMSKI UNEVERZITET', 'developer/create release audit canonical KRALJEVSKI EKONOMSKI UNEVERZITET vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.kraljevskiBastaUneverzite === 'KRALJEVSKI BAŠTA UNEVERZITE', 'developer/create release audit canonical KRALJEVSKI BAŠTA UNEVERZITE vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.privredniAkt === 'PRIVREDNI AKT', 'developer/create release audit canonical PRIVREDNI AKT vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.zadruga === 'ZADRUGA', 'developer/create release audit canonical ZADRUGA vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.instrumentTabla === 'INSTRUMENT TABLA', 'developer/create release audit canonical INSTRUMENT TABLA vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.canonicalGovernanceVocabulary.vlastelaRequest === 'VLASTELA REQUEST', 'developer/create release audit canonical VLASTELA REQUEST vocabulary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.arhimedisTrzisniOdnosInterpretation.modelName === 'Arhimedisov princip matematike + tržišni odnos', 'developer/create release audit economic interpretation model mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.arhimedisTrzisniOdnosInterpretation.valueExchangeModes.join(',') === 'roba↔roba,novac↔roba', 'developer/create release audit economic interpretation exchange modes mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.arhimedisTrzisniOdnosInterpretation.scalingOperations.join(',') === 'množenje,deljenje', 'developer/create release audit economic interpretation scaling operations mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.osnoveRispektProtocol.title === 'OSNOVE / RISPEKT', 'developer/create release audit OSNOVE/RISPEKT title mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.osnoveRispektProtocol.executionDomain === 'documentation-and-governance-evidence-only', 'developer/create release audit OSNOVE/RISPEKT execution domain mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.osnoveRispektProtocol.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit OSNOVE/RISPEKT readiness status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.dailyOperationalCadence.cadenceBlocks.join(',') === 'morning-startup,deep-focus-block,midday-checkpoint,end-of-day-closeout', 'developer/create release audit cadence blocks mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.dailyOperationalCadence.taskPriorities.join(',') === '1,2,3', 'developer/create release audit priorities mismatch');
    assert(new Set(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.dailyOperationalCadence.dailyTasks.map((task) => task.roadmapStageId)).size === 1, 'developer/create release audit daily tasks must bind to one roadmap stage');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.dailyOperationalCadence.dailyTasks.every((task) => task.acceptanceEvidence.length > 0), 'developer/create release audit daily tasks must include acceptance evidence');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.technicalReadinessProfile.consolidatedRhythmStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit profile mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.canonicalName === 'KRALJEVSKI EKONOMSKI UNEVERZITET', 'developer/create release audit economic track name mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.unifiedNarrative === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == KRALJEVSKI PROGRAMSKI UNEVERZITET', 'developer/create release audit economic unified narrative mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.pravniPoredakPolicyGate.policyOnly, 'developer/create release audit economic legal-order policy gate mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.readiness.status === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit economic track status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiProgramskiUneverzitet.canonicalName === 'KRALJEVSKI PROGRAMSKI UNEVERZITET', 'developer/create release audit programmatic track name mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiProgramskiUneverzitet.parentTrack === 'VRH PROGRAMSKOG EKVILADENTA', 'developer/create release audit programmatic parent track mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiProgramskiUneverzitet.boundedTerminology.technicalOwnership === 'DOK+DIK+FOR->EXTREM', 'developer/create release audit programmatic technical ownership mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiProgramskiUneverzitet.boundedTerminology.governanceOwnership === 'DAK+DUK->EXTRONDOL', 'developer/create release audit programmatic governance ownership mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiProgramskiUneverzitet.readiness.status === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit programmatic track status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.stocarstvoStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiEkonomskiUneverzitet.boundedPrivredniDomains.stocarstvo.readiness.status, 'developer/create release audit STOČARSTVO track mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.vinogradarstvoStatus), 'developer/create release audit VINOGRADARSTVO status mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.matematickiFakultetStatus), 'developer/create release audit MATEMATIČKI FAKULTET status mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.pedagoskiFakultetStatus), 'developer/create release audit PEDAGOŠKI FAKULTET status mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.psiholoskiFakultetStatus), 'developer/create release audit PSIHOLOŠKI FAKULTET status mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.workforcePosture), 'developer/create release audit workforce posture mismatch');
    assert(typeof report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.additiveFacultyAndAgricultureTracks.rolloutFreezeRequired === 'boolean', 'developer/create release audit bounded-track freeze signal mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.universityLifecycle.reviewRequiredBeforePayout, 'developer/create release audit university lifecycle review lock mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.universityRolloutPhases.map((phase) => phase.phaseId).join(',') === 'faza-1,faza-2,faza-3,faza-4,faza-5', 'developer/create release audit rollout phase mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.certificationGovernance.reviewRequiredBeforeCertification, 'developer/create release audit certification review lock mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.payoutGovernance.paymentVerificationRequired, 'developer/create release audit payout verification lock mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.rewardApproval.hardGates.includes('audit-trail'), 'developer/create release audit reward approval hard gates mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.universityPublicSummary.payoutReadinessStatus), 'developer/create release audit payout readiness mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiBastaUneverzite.canonicalName === 'KRALJEVSKI BAŠTA UNEVERZITE', 'developer/create release audit basta track name mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiBastaUneverzite.canonicalNarrativeId === 'kraljevski-basta-uneverzite-prirodne-maticne-celije-covecanstvu', 'developer/create release audit basta narrative id mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiBastaUneverzite.readiness.status === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit basta track status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.canonicalNarrativeId === 'covecnost-developer-create-vrh-radni-takt', 'developer/create release audit ČOVEČNOST narrative id mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.visualReference.includes('4790f4ea-4271-4d2a-ae0a-d9bec5bc8b8a'), 'developer/create release audit ČOVEČNOST visual reference mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit ČOVEČNOST readiness status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences[0].canonicalNarrativeId === 'covecanstvo-zivot-je-najveca-igra', 'developer/create release audit supplemental narrative id mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences[0].visualReference.includes('27ef7575-9ef6-425e-bdbf-75feb722bad2'), 'developer/create release audit supplemental visual reference mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences[0].imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit supplemental readiness status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.canonicalName === 'AI LIČNA KARTA + AI BANKARSKI RAČUN', 'developer/create release audit AI identity-finance name mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.sourceOfTruth === '/api/extrimli/extrem', 'developer/create release audit AI identity-finance source mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.paymentVerificationManagedBy === '/api/extrimli/extrondol', 'developer/create release audit AI identity-finance payment verification owner mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.bankAccountGovernance.realBankAccountStoredInGit === false, 'developer/create release audit AI identity-finance must forbid real bank data in Git');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.monthlyPrimanjaGovernance.provider === 'AI IQ WORLD BANK', 'developer/create release audit AI monthly primanja provider mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.monthlyPrimanjaGovernance.requiredGates.includes('payment-verification'), 'developer/create release audit AI monthly primanja payment-verification gate mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.minorProtectionSafeguards.guardianLegalReviewRequired, 'developer/create release audit AI minor protection guardian review lock mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.aiIqWorldBankPrepiska.canonicalName === 'AI IQ WORLD BANK PREPISKA', 'developer/create release audit AI IQ WORLD BANK prepiska name mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.aiIqWorldBankPrepiska.sourceMaterialPolicy === 'documentation-only', 'developer/create release audit AI IQ WORLD BANK prepiska must remain documentation-only');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.aiIqWorldBankPrepiska.allowedEvidence.includes('downstream-sync-status'), 'developer/create release audit AI IQ WORLD BANK prepiska allowed evidence mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.bezpovratneSubvencijeGovernance.governanceOnlyModel, 'developer/create release audit bezpovratne subvencije governance mode mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.bezpovratneSubvencijeGovernance.allowedEvidence.includes('payout-readiness'), 'developer/create release audit bezpovratne subvencije allowed evidence mismatch');
    const releaseAuditSviPripadajuSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create');
    assert(Boolean(releaseAuditSviPripadajuSupplemental), 'developer/create release audit SVI KOJI POSTOJE supplemental narrative id mismatch');
    assert(releaseAuditSviPripadajuSupplemental?.visualReference.includes('c9509bbe-4083-4ba0-9802-3598f826a32b'), 'developer/create release audit SVI KOJI POSTOJE supplemental visual reference mismatch');
    assert(releaseAuditSviPripadajuSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit SVI KOJI POSTOJE supplemental readiness status mismatch');
    const releaseAuditEntizujazamSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create');
    assert(Boolean(releaseAuditEntizujazamSupplemental), 'developer/create release audit ENTIZUJAŽAM supplemental narrative id mismatch');
    assert(releaseAuditEntizujazamSupplemental?.visualReference.includes('f7b3e102-e0a0-4885-a93e-040f09454737'), 'developer/create release audit ENTIZUJAŽAM supplemental visual reference mismatch');
    assert(releaseAuditEntizujazamSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit ENTIZUJAŽAM supplemental readiness status mismatch');
    const releaseAuditEpilogSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-rad-energija-stvaranja-developer-create');
    assert(Boolean(releaseAuditEpilogSupplemental), 'developer/create release audit EPILOG supplemental narrative id mismatch');
    assert(releaseAuditEpilogSupplemental?.visualReference.includes('36ce7570-103e-4097-b903-fbe0efaf4026'), 'developer/create release audit EPILOG supplemental visual reference mismatch');
    assert(releaseAuditEpilogSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit EPILOG supplemental readiness status mismatch');
    const releaseAuditPostojatiEpilogSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create');
    assert(Boolean(releaseAuditPostojatiEpilogSupplemental), 'developer/create release audit EPILOG (POSTOJATI) supplemental narrative id mismatch');
    assert(releaseAuditPostojatiEpilogSupplemental?.visualReference.includes('429b7479-7be9-41d3-9e9d-3531b1e9e596'), 'developer/create release audit EPILOG (POSTOJATI) supplemental visual reference mismatch');
    assert(releaseAuditPostojatiEpilogSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create', 'developer/create release audit EPILOG (POSTOJATI) supplemental scenario id mismatch');
    assert(releaseAuditPostojatiEpilogSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit EPILOG (POSTOJATI) supplemental readiness status mismatch');
    const releaseAuditMapeUmaEpilogSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create');
    assert(Boolean(releaseAuditMapeUmaEpilogSupplemental), 'developer/create release audit EPILOG (MAPE UMA) supplemental narrative id mismatch');
    assert(releaseAuditMapeUmaEpilogSupplemental?.visualReference.includes('f857f0fd-c29d-4749-aecd-f42745646e69'), 'developer/create release audit EPILOG (MAPE UMA) supplemental visual reference mismatch');
    assert(releaseAuditMapeUmaEpilogSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create', 'developer/create release audit EPILOG (MAPE UMA) supplemental scenario id mismatch');
    assert(releaseAuditMapeUmaEpilogSupplemental?.thematicSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir,covecanstvo-epilog', 'developer/create release audit EPILOG (MAPE UMA) thematic signals mismatch');
    assert(releaseAuditMapeUmaEpilogSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit EPILOG (MAPE UMA) supplemental readiness status mismatch');
    const releaseAuditMaticneCelijeSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create');
    assert(Boolean(releaseAuditMaticneCelijeSupplemental), 'developer/create release audit MATIČNE ĆELIJE supplemental narrative id mismatch');
    assert(releaseAuditMaticneCelijeSupplemental?.visualReference.includes('ca803ee2-f56e-4aa1-bd7f-18df213228d6'), 'developer/create release audit MATIČNE ĆELIJE supplemental visual reference mismatch');
    assert(releaseAuditMaticneCelijeSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit MATIČNE ĆELIJE supplemental readiness status mismatch');
    const releaseAuditKukuruzSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-prirodne-maticne-celije-kukuruz-developer-create');
    assert(Boolean(releaseAuditKukuruzSupplemental), 'developer/create release audit KUKURUZ supplemental narrative id mismatch');
    assert(releaseAuditKukuruzSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create', 'developer/create release audit KUKURUZ scenario id mismatch');
    assert(releaseAuditKukuruzSupplemental?.visualReference.includes('f92e1ae5-ff97-4b81-a7f1-d3df6c8283cf'), 'developer/create release audit KUKURUZ supplemental visual reference mismatch');
    assert(releaseAuditKukuruzSupplemental?.thematicSignals.join(',') === 'kukuruz-priroda,garden-stewardship,bounded-transformation-narrative,documentation-only-health-metaphor,covecanstvo-epilog,no-medical-runtime-claims', 'developer/create release audit KUKURUZ thematic signals mismatch');
    const releaseAuditCistaVodaSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-cista-voda-h2o-vodonik-buducnost-developer-create');
    assert(Boolean(releaseAuditCistaVodaSupplemental), 'developer/create release audit ČISTA VODA supplemental narrative id mismatch');
    assert(releaseAuditCistaVodaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-cista-voda-h2o-vodonik-epilog-developer-create', 'developer/create release audit ČISTA VODA scenario id mismatch');
    assert(releaseAuditCistaVodaSupplemental?.visualReference.includes('2aae1845-0b3d-49c1-918b-a200cc48ad1d'), 'developer/create release audit ČISTA VODA supplemental visual reference mismatch');
    const releaseAuditUrlLockedAd9Supplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-ad9aff82-developer-create');
    assert(Boolean(releaseAuditUrlLockedAd9Supplemental), 'developer/create release audit URL-locked ad9aff82 supplemental narrative id mismatch');
    assert(releaseAuditUrlLockedAd9Supplemental?.visualReference.includes('ad9aff82-4790-49c2-9224-3b250d0090d1'), 'developer/create release audit URL-locked ad9aff82 visual reference mismatch');
    assert(releaseAuditUrlLockedAd9Supplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit URL-locked ad9aff82 readiness status mismatch');
    const releaseAuditUrlLocked164Supplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-164e82a7-developer-create');
    assert(Boolean(releaseAuditUrlLocked164Supplemental), 'developer/create release audit URL-locked 164e82a7 supplemental narrative id mismatch');
    assert(releaseAuditUrlLocked164Supplemental?.visualReference.includes('164e82a7-bf62-4397-959b-bf24953d0183'), 'developer/create release audit URL-locked 164e82a7 visual reference mismatch');
    const releaseAuditSnoviPrirodeSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-snovi-prirode-inovacije-developer-create');
    assert(Boolean(releaseAuditSnoviPrirodeSupplemental), 'developer/create release audit SNOVI PRIRODE supplemental narrative id mismatch');
    assert(releaseAuditSnoviPrirodeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-snovi-prirode-inovacije-developer-create', 'developer/create release audit SNOVI PRIRODE supplemental scenario id mismatch');
    assert(releaseAuditSnoviPrirodeSupplemental?.visualReference.includes('92ae3dd8-75b3-4611-a8d3-27e9a0b3a9e3'), 'developer/create release audit SNOVI PRIRODE supplemental visual reference mismatch');
    assert(releaseAuditSnoviPrirodeSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit SNOVI PRIRODE supplemental readiness status mismatch');
    const releaseAuditZivotURavnoteziSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-zivot-u-ravnotezi-developer-create');
    assert(Boolean(releaseAuditZivotURavnoteziSupplemental), 'developer/create release audit ŽIVOT U RAVNOTEŽI supplemental narrative id mismatch');
    assert(releaseAuditZivotURavnoteziSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-zivot-u-ravnotezi-developer-create', 'developer/create release audit ŽIVOT U RAVNOTEŽI supplemental scenario id mismatch');
    assert(releaseAuditZivotURavnoteziSupplemental?.visualReference.includes('76d61045-6f27-4614-97d2-f96fc84173eb'), 'developer/create release audit ŽIVOT U RAVNOTEŽI supplemental visual reference mismatch');
    assert(releaseAuditZivotURavnoteziSupplemental?.thematicSignals.join(',') === 'balance,life-chain,compassion,higher-human-development', 'developer/create release audit ŽIVOT U RAVNOTEŽI thematic signals mismatch');
    assert(releaseAuditZivotURavnoteziSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit ŽIVOT U RAVNOTEŽI supplemental readiness status mismatch');
    const releaseAuditTrijologijaSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-trijologija-davo-u-ruci-lisica-u-kavezu-developer-create');
    assert(Boolean(releaseAuditTrijologijaSupplemental), 'developer/create release audit TRIJOLOGIJA supplemental narrative id mismatch');
    assert(releaseAuditTrijologijaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-trijologija-davo-u-ruci-lisica-u-kavezu-developer-create', 'developer/create release audit TRIJOLOGIJA supplemental scenario id mismatch');
    assert(releaseAuditTrijologijaSupplemental?.visualReference.includes('e2df2e51-efdf-4171-a356-b7848a04249d'), 'developer/create release audit TRIJOLOGIJA supplemental visual reference mismatch');
    assert(releaseAuditTrijologijaSupplemental?.thematicSignals.join(',') === 'trijologija-framework,davo-u-ruci-voda-u-ruci,lisica-u-kavezu-risk,freedom-with-responsibility,covecanstvo-epilog', 'developer/create release audit TRIJOLOGIJA thematic signals mismatch');
    assert(releaseAuditTrijologijaSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit TRIJOLOGIJA supplemental readiness status mismatch');
    const releaseAuditBlagoslovBogpatijuSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-blagoslov-darivati-bogpatiju-developer-create');
    assert(Boolean(releaseAuditBlagoslovBogpatijuSupplemental), 'developer/create release audit BLAGOSLOV DARIVATI / BOGPATIJU supplemental narrative id mismatch');
    assert(releaseAuditBlagoslovBogpatijuSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-blagoslov-darivati-bogpatiju-epilog-developer-create', 'developer/create release audit BLAGOSLOV DARIVATI / BOGPATIJU supplemental scenario id mismatch');
    assert(releaseAuditBlagoslovBogpatijuSupplemental?.visualReference.includes('dbf91173-c940-4994-b223-b5438feff4a3'), 'developer/create release audit BLAGOSLOV DARIVATI / BOGPATIJU supplemental visual reference mismatch');
    assert(releaseAuditBlagoslovBogpatijuSupplemental?.thematicSignals.join(',') === 'blagoslov,darivanje,bogpatiju,zajednicko-covecanstvo', 'developer/create release audit BLAGOSLOV DARIVATI / BOGPATIJU thematic signals mismatch');
    const releaseAuditMjuziklKraljevskogCinaSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create');
    assert(Boolean(releaseAuditMjuziklKraljevskogCinaSupplemental), 'developer/create release audit MUZIČKI ČIN supplemental narrative id mismatch');
    assert(releaseAuditMjuziklKraljevskogCinaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create', 'developer/create release audit MUZIČKI ČIN supplemental scenario id mismatch');
    assert(releaseAuditMjuziklKraljevskogCinaSupplemental?.visualReference.includes('213b2738-35b1-4dab-b6ab-ae292afc8e91'), 'developer/create release audit MUZIČKI ČIN supplemental visual reference mismatch');
    assert(releaseAuditMjuziklKraljevskogCinaSupplemental?.thematicSignals.join(',') === 'muzicki-cin,epilog,covecanstvo,zajednicki-ritam,jedan-svet', 'developer/create release audit MUZIČKI ČIN thematic signals mismatch');
    const releaseAuditKraljevskaMuzickaPoveljaSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create');
    assert(Boolean(releaseAuditKraljevskaMuzickaPoveljaSupplemental), 'developer/create release audit KRALJEVSKA MUZIČKA POVELJA supplemental narrative id mismatch');
    assert(releaseAuditKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create', 'developer/create release audit KRALJEVSKA MUZIČKA POVELJA supplemental scenario id mismatch');
    assert(releaseAuditKraljevskaMuzickaPoveljaSupplemental?.visualReference.includes('980557d1-6912-4e8c-9e8b-3f22e19f5c36'), 'developer/create release audit KRALJEVSKA MUZIČKA POVELJA supplemental visual reference mismatch');
    assert(releaseAuditKraljevskaMuzickaPoveljaSupplemental?.thematicSignals.join(',') === 'kraljevska-muzicka-povelja,epilog-u-covecanstvo,shared-world,shared-rhythm,spiritual-release,bounded-symbolic-governance', 'developer/create release audit KRALJEVSKA MUZIČKA POVELJA thematic signals mismatch');
    assert(releaseAuditBlagoslovBogpatijuSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit BLAGOSLOV DARIVATI / BOGPATIJU supplemental readiness status mismatch');
    const releaseAuditBozijiEpitetiSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create');
    assert(Boolean(releaseAuditBozijiEpitetiSupplemental), 'developer/create release audit BOŽIJI EPITETI supplemental narrative id mismatch');
    assert(releaseAuditBozijiEpitetiSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create', 'developer/create release audit BOŽIJI EPITETI supplemental scenario id mismatch');
    assert(releaseAuditBozijiEpitetiSupplemental?.visualReference.includes('e7846b38-1a56-4321-a7d7-8acfc1328bf9'), 'developer/create release audit BOŽIJI EPITETI supplemental visual reference mismatch');
    assert(releaseAuditBozijiEpitetiSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-justice-civil-law,metric-astral-testimony,kralj-nad-kraljevima,jedan-zakon-jedna-etika-jedno-covecanstvo-jedan-bog', 'developer/create release audit BOŽIJI EPITETI thematic signals mismatch');
    assert(releaseAuditBozijiEpitetiSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit BOŽIJI EPITETI supplemental readiness status mismatch');
    const releaseAuditKraljevskaVodicaSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-vodica-zakon-silnog-developer-create');
    assert(Boolean(releaseAuditKraljevskaVodicaSupplemental), 'developer/create release audit KRALJEVSKA VODICA supplemental narrative id mismatch');
    assert(releaseAuditKraljevskaVodicaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-vodica-pravo-etika-mir-developer-create', 'developer/create release audit KRALJEVSKA VODICA supplemental scenario id mismatch');
    assert(releaseAuditKraljevskaVodicaSupplemental?.visualReference.includes('e1d0a813-ed72-43ff-a943-112af972872d'), 'developer/create release audit KRALJEVSKA VODICA supplemental visual reference mismatch');
    assert(releaseAuditKraljevskaVodicaSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-and-justice,nenarusavaj-mir,civic-order,bounded-non-enforcement', 'developer/create release audit KRALJEVSKA VODICA thematic signals mismatch');
    assert(releaseAuditKraljevskaVodicaSupplemental?.citation.includes('source-text-only'), 'developer/create release audit KRALJEVSKA VODICA citation must keep raw poster text bounded');
    assert(releaseAuditKraljevskaVodicaSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSKA VODICA supplemental readiness status mismatch');
    const releaseAuditPravoslavljeAktRevolucijeSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-pravoslavlje-akt-revolucije-nad-hriscanstvom-developer-create');
    assert(Boolean(releaseAuditPravoslavljeAktRevolucijeSupplemental), 'developer/create release audit PRAVOSLAVLJE supplemental narrative id mismatch');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pravoslavlje-akt-revolucije-zrtva-pravo-etika-kontinuitet-developer-create', 'developer/create release audit PRAVOSLAVLJE supplemental scenario id mismatch');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.visualReference.includes('749fac80-2a31-438b-ab05-190d2421f191'), 'developer/create release audit PRAVOSLAVLJE supplemental visual reference mismatch');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.thematicSignals.join(',') === 'right-and-law,ethics-and-justice,sacrifice-and-renewal,civilizational-continuity,right-to-exist-and-belong', 'developer/create release audit PRAVOSLAVLJE thematic signals mismatch');
    assert(releaseAuditPravoslavljeAktRevolucijeSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit PRAVOSLAVLJE supplemental readiness status mismatch');
    const releaseAuditKraljevskaProduktivnostSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create');
    assert(Boolean(releaseAuditKraljevskaProduktivnostSupplemental), 'developer/create release audit KRALJEVSKA PRODUKTIVNOST supplemental narrative id mismatch');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create', 'developer/create release audit KRALJEVSKA PRODUKTIVNOST supplemental scenario id mismatch');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.visualReference.includes('b02ac97f-d0ec-44b6-aadb-8ae3981127ea'), 'developer/create release audit KRALJEVSKA PRODUKTIVNOST supplemental visual reference mismatch');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.thematicSignals.join(',') === 'legal-citizenship,garden-productivity,family-self-sufficiency,earth-stewardship,humanity-epilog,small-work-large-change', 'developer/create release audit KRALJEVSKA PRODUKTIVNOST thematic signals mismatch');
    assert(releaseAuditKraljevskaProduktivnostSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSKA PRODUKTIVNOST supplemental readiness status mismatch');
    const releaseAuditKraljevstvoSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevstvo-ljudi-znanje-priroda-tehnologija-buducnost-developer-create');
    assert(Boolean(releaseAuditKraljevstvoSupplemental), 'developer/create release audit KRALJEVSTVO supplemental narrative id mismatch');
    assert(releaseAuditKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zajedno-gradimo-kraljevstvo-za-sve-generacije-developer-create', 'developer/create release audit KRALJEVSTVO supplemental scenario id mismatch');
    assert(releaseAuditKraljevstvoSupplemental?.visualReference.includes('6b037ede-14ed-4f02-8939-c112bae773be'), 'developer/create release audit KRALJEVSTVO supplemental visual reference mismatch');
    assert(releaseAuditKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,zajednistvo,buducnost,znanje,humanost,tehnologija-u-sluzbi-zivota', 'developer/create release audit KRALJEVSTVO thematic signals mismatch');
    assert(releaseAuditKraljevstvoSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSTVO supplemental readiness status mismatch');
    const releaseAuditKraljevstvoZvanicnoPravoLiceSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevstvo-zvanicno-moje-pravo-lice-developer-create');
    assert(Boolean(releaseAuditKraljevstvoZvanicnoPravoLiceSupplemental), 'developer/create release audit KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) supplemental narrative id mismatch');
    assert(releaseAuditKraljevstvoZvanicnoPravoLiceSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zvanicno-moje-pravo-lice-developer-create', 'developer/create release audit KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) supplemental scenario id mismatch');
    assert(releaseAuditKraljevstvoZvanicnoPravoLiceSupplemental?.visualReference.includes('dd446127-c462-47de-ba22-501800f3ccbc'), 'developer/create release audit KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) supplemental visual reference mismatch');
    assert(releaseAuditKraljevstvoZvanicnoPravoLiceSupplemental?.thematicSignals.join(',') === 'kraljevstvo,znanje,pravda,ljubav,sloboda,razvoj,humanost,zajednicko-covecanstvo', 'developer/create release audit KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) thematic signals mismatch');
    assert(releaseAuditKraljevstvoZvanicnoPravoLiceSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSTVO (ZVANIČNO MOJE PRAVO LICE) supplemental readiness status mismatch');
    const releaseAuditKraljevskaKucaSmederevoSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevska-kuca-srbija-smederevo-epicentricna-tacka-planete-developer-create');
    assert(Boolean(releaseAuditKraljevskaKucaSmederevoSupplemental), 'developer/create release audit KRALJEVSKA KUĆA supplemental narrative id mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevska-kuca-srbija-smederevo-jedan-planet-jedan-narod-jedna-buducnost-developer-create', 'developer/create release audit KRALJEVSKA KUĆA supplemental scenario id mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.visualReference.includes('7b6cfca4-d61f-4974-b06f-299be5626282'), 'developer/create release audit KRALJEVSKA KUĆA supplemental visual reference mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.thematicSignals.join(',') === 'kraljevska-kuca,srbija-smederevo,epicentricna-tacka-planete,jedan-planet-jedan-narod-jedna-buducnost,legal-governance-epilog,bounded-non-enforcement', 'developer/create release audit KRALJEVSKA KUĆA thematic signals mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'developer/create release audit KRALJEVSKA KUĆA EXTREM ownership mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'developer/create release audit KRALJEVSKA KUĆA EXTRONDOL ownership mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'developer/create release audit KRALJEVSKA KUĆA SPAJA KOD boundary mismatch');
    assert(releaseAuditKraljevskaKucaSmederevoSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSKA KUĆA supplemental readiness status mismatch');
    const releaseAuditKraljevskiPoduhvatVukoviSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'projekat-srbija-beli-vuk-crni-vuk-developer-create');
    assert(Boolean(releaseAuditKraljevskiPoduhvatVukoviSupplemental), 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental narrative id mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.scenarioId === 'kraljevski-poduhvat-vukovi-projekat-srbija-beli-vuk-crni-vuk-developer-create', 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental scenario id mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.visualReference.includes('b8ba7d39-2f0b-4016-a60d-0cdd6ac41bcf'), 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental visual reference mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.thematicSignals.join(',') === 'kraljevski-poduhvat,projekat-srbija,vukovi,beli-vuk,crni-vuk,bounded-governance-symbolics', 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK thematic signals mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK EXTREM ownership mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.ownershipLock.dakDuk === 'EXTRONDOL', 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK EXTRONDOL ownership mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK SPAJA KOD boundary mismatch');
    assert(releaseAuditKraljevskiPoduhvatVukoviSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit PROJEKAT SRBIJA — BELI VUK CRNI VUK supplemental readiness status mismatch');
    const releaseAuditCarnevaleMasknbaleSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'carnevale-masknbale-prirodni-portret-lica-developer-create');
    assert(Boolean(releaseAuditCarnevaleMasknbaleSupplemental), 'developer/create release audit Carnevale Masknbale supplemental narrative id mismatch');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.imageToSignalProfile.scenarioId === 'carnevale-masknbale-umetnost-lica-dostojanstvo-identitet-developer-create', 'developer/create release audit Carnevale Masknbale supplemental scenario id mismatch');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.visualReference.includes('carnevale-masknbale-prirodni-portret-lica'), 'developer/create release audit Carnevale Masknbale supplemental visual reference mismatch');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.citation.includes('Lice je prirodni portret bića'), 'developer/create release audit Carnevale Masknbale citation mismatch');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.thematicSignals.join(',') === 'umetnost-lica,svecanost,dostojanstvo,originalnost,licni-identitet,prirodni-portret', 'developer/create release audit Carnevale Masknbale thematic signals mismatch');
    assert(releaseAuditCarnevaleMasknbaleSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit Carnevale Masknbale supplemental readiness status mismatch');
    const releaseAuditAiIdentityCardSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'licna-karta-artificial-intelligence-identity-card-developer-create');
    assert(Boolean(releaseAuditAiIdentityCardSupplemental), 'developer/create release audit AI identity card supplemental narrative id mismatch');
    assert(releaseAuditAiIdentityCardSupplemental?.imageToSignalProfile.scenarioId === 'licna-karta-ai-identitet-odgovorna-vestacka-inteligencija-developer-create', 'developer/create release audit AI identity card supplemental scenario id mismatch');
    assert(releaseAuditAiIdentityCardSupplemental?.visualReference.includes('aee19f4e-dede-47d9-83ca-1b080cf9b38b'), 'developer/create release audit AI identity card supplemental visual reference mismatch');
    assert(releaseAuditAiIdentityCardSupplemental?.thematicSignals.join(',') === 'ai-identitet,odgovorna-vestacka-inteligencija,globalno-znanje,podrska-edukacija-kreativnost,resavanje-problema,documentation-only-activation-cues', 'developer/create release audit AI identity card thematic signals mismatch');
    assert(releaseAuditAiIdentityCardSupplemental?.citation.includes('nikada runtime identitet, auth ili security credential'), 'developer/create release audit AI identity card citation mismatch');
    assert(releaseAuditAiIdentityCardSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit AI identity card supplemental readiness status mismatch');
    const releaseAuditVisionSunriseSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-pontcerima-svima-ako-zele-da-poprave-vid-developer-create');
    assert(Boolean(releaseAuditVisionSunriseSupplemental), 'developer/create release audit sunrise vision supplemental narrative id mismatch');
    assert(releaseAuditVisionSunriseSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pontcerima-jutarnje-sunce-poprave-vid-developer-create', 'developer/create release audit sunrise vision supplemental scenario id mismatch');
    assert(releaseAuditVisionSunriseSupplemental?.visualReference.includes('446f2155-2c59-4420-826b-e248844943a8'), 'developer/create release audit sunrise vision supplemental visual reference mismatch');
    assert(releaseAuditVisionSunriseSupplemental?.thematicSignals.join(',') === 'vid,jutarnje-sunce,licno-iskustvo,epilog-covecanstvu,disciplina-posmatranja,documentation-only-guidance', 'developer/create release audit sunrise vision thematic signals mismatch');
    assert(releaseAuditVisionSunriseSupplemental?.citation.includes('preporuka 17 minuta'), 'developer/create release audit sunrise vision citation mismatch');
    assert(releaseAuditVisionSunriseSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit sunrise vision supplemental readiness status mismatch');
    const releaseAuditSemeSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-seme-malo-seme-velika-promena-developer-create');
    assert(Boolean(releaseAuditSemeSupplemental), 'developer/create release audit SEME supplemental narrative id mismatch');
    assert(releaseAuditSemeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create', 'developer/create release audit SEME supplemental scenario id mismatch');
    assert(releaseAuditSemeSupplemental?.visualReference.includes('9267f560-0b94-4911-9ac4-783c7c7deb3f'), 'developer/create release audit SEME supplemental visual reference mismatch');
    assert(releaseAuditSemeSupplemental?.thematicSignals.join(',') === 'seed-growth,clean-input,planetary-stewardship,shared-world,small-change-large-impact,better-tomorrow', 'developer/create release audit SEME thematic signals mismatch');
    assert(releaseAuditSemeSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit SEME supplemental readiness status mismatch');
    const releaseAuditKrvotokSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-krvotok-zdrava-krv-bolji-zivot-developer-create');
    assert(Boolean(releaseAuditKrvotokSupplemental), 'developer/create release audit KRVOTOK supplemental narrative id mismatch');
    assert(releaseAuditKrvotokSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-krvotok-zdrava-krv-bolji-zivot-developer-create', 'developer/create release audit KRVOTOK supplemental scenario id mismatch');
    assert(releaseAuditKrvotokSupplemental?.visualReference.includes('824084e5-fff7-4a86-b96e-6d7d20b163b3'), 'developer/create release audit KRVOTOK supplemental visual reference mismatch');
    assert(releaseAuditKrvotokSupplemental?.thematicSignals.join(',') === 'zdravlje-krvotok,voda-hidratacija,voce-i-povrce-cisti-input,pre-posle-transformacija,covecanstvo-bolja-buducnost,documentation-only-health-epilog', 'developer/create release audit KRVOTOK thematic signals mismatch');
    assert(releaseAuditKrvotokSupplemental?.citation.includes('13 dana'), 'developer/create release audit KRVOTOK citation mismatch');
    assert(releaseAuditKrvotokSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRVOTOK supplemental readiness status mismatch');
    const releaseAuditZdravijiUmSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-zdraviji-um-snazniji-ljudi-bolji-svet-developer-create');
    assert(Boolean(releaseAuditZdravijiUmSupplemental), 'developer/create release audit ZDRAVIJI UM supplemental narrative id mismatch');
    assert(releaseAuditZdravijiUmSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create', 'developer/create release audit ZDRAVIJI UM supplemental scenario id mismatch');
    assert(releaseAuditZdravijiUmSupplemental?.visualReference.includes('81ebf11b-d1a5-451b-880a-8670fe240041'), 'developer/create release audit ZDRAVIJI UM supplemental visual reference mismatch');
    assert(releaseAuditZdravijiUmSupplemental?.thematicSignals.join(',') === 'mental-reflection,understanding-thoughts,empathetic-humanity,shared-healing-metaphor,stronger-people-better-world,documentation-only-mind-epilog', 'developer/create release audit ZDRAVIJI UM thematic signals mismatch');
    assert(releaseAuditZdravijiUmSupplemental?.citation.includes('bez nove formule, dijagnostike, terapije, medicinskog runtime subsistema'), 'developer/create release audit ZDRAVIJI UM citation mismatch');
    assert(releaseAuditZdravijiUmSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit ZDRAVIJI UM supplemental readiness status mismatch');
    const releaseAuditSvitakBozanstvaSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-developer-create');
    assert(Boolean(releaseAuditSvitakBozanstvaSupplemental), 'developer/create release audit SVITAK BOŽANSTVA supplemental narrative id mismatch');
    assert(releaseAuditSvitakBozanstvaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create', 'developer/create release audit SVITAK BOŽANSTVA supplemental scenario id mismatch');
    assert(releaseAuditSvitakBozanstvaSupplemental?.visualReference.includes('752ba75d-86b3-4d65-a6d7-e4f126c303ae'), 'developer/create release audit SVITAK BOŽANSTVA supplemental visual reference mismatch');
    assert(releaseAuditSvitakBozanstvaSupplemental?.thematicSignals.join(',') === 'bozanstvo-nad-svim,pravoslavlje-vecna-svetlost,vera-znanje-ljubav,narod-zemlja-covecanstvo,jedan-bog-jedan-narod-jedna-zemlja-jedno-covecanstvo', 'developer/create release audit SVITAK BOŽANSTVA thematic signals mismatch');
    assert(releaseAuditSvitakBozanstvaSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit SVITAK BOŽANSTVA supplemental readiness status mismatch');
    const releaseAuditPravedanSvetKraljevstvoSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create');
    assert(Boolean(releaseAuditPravedanSvetKraljevstvoSupplemental), 'developer/create release audit KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental narrative id mismatch');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create', 'developer/create release audit KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental scenario id mismatch');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.visualReference.includes('527e2ce4-7bfe-4ab0-b5a3-caceb75b24c0'), 'developer/create release audit KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental visual reference mismatch');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,pravoslavlje,znanje,priroda,covecanstvo,jedan-svet-jedna-porodica,vecnost', 'developer/create release audit KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE thematic signals mismatch');
    assert(releaseAuditPravedanSvetKraljevstvoSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental readiness status mismatch');
    const releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevstvo-profesionalna-globalna-kampanja-nikola-spajic-developer-create');
    assert(Boolean(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental), 'developer/create release audit KRALJEVSTVO professional global campaign supplemental narrative id mismatch');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-profesionalna-globalna-kampanja-medijska-strategija-developer-create', 'developer/create release audit KRALJEVSTVO professional global campaign supplemental scenario id mismatch');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.visualReference.includes('c9414c36-7876-43ee-ae39-fad8cd2622ed'), 'developer/create release audit KRALJEVSTVO professional global campaign supplemental visual reference mismatch');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.thematicSignals.join(',') === 'nikola-spajic-public-presentation,covecanstvo,znanje-i-obrazovanje,priroda-i-zivot,tehnologija,porodica-drustvo-zdravlje,pravda-buducnost-razvoj,profesionalni-gejming,ai-iq-world-bank-governance,audit-safe-media-strategy', 'developer/create release audit KRALJEVSTVO professional global campaign thematic signals mismatch');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.citation.includes('TV/radio/social distribucija ostaje samo audit-safe media-distribution strategy'), 'developer/create release audit KRALJEVSTVO professional global campaign citation mismatch');
    assert(releaseAuditProfesionalnaGlobalnaKampanjaKraljevstvoSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit KRALJEVSTVO professional global campaign supplemental readiness status mismatch');
    const releaseAuditGilskultureKraljevstvoSupplemental = report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-kraljevstvo-gilskulture-developer-create');
    assert(Boolean(releaseAuditGilskultureKraljevstvoSupplemental), 'developer/create release audit GILSKULTURE supplemental narrative id mismatch');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-kraljevstvo-gilskulture-znanje-mir-odgovornost-developer-create', 'developer/create release audit GILSKULTURE supplemental scenario id mismatch');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.visualReference.includes('50cb9759-5ce2-490f-bcb2-8a3b73fed39f'), 'developer/create release audit GILSKULTURE supplemental visual reference mismatch');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,covecanstvo-epilog,znanje-citanje,deca-buduci-narastaji,priroda-covek-tehnologija-u-ravnotezi,mir-pravda-odgovornost', 'developer/create release audit GILSKULTURE thematic signals mismatch');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.citation.includes('source-text-only documentation/evidence'), 'developer/create release audit GILSKULTURE citation must preserve source-text-only boundary');
    assert(releaseAuditGilskultureKraljevstvoSupplemental?.imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit GILSKULTURE supplemental readiness status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences[0].canonicalNarrativeId === 'covecanstvo-osecaj-osebenosti-developer-create-vrh-radni-takt', 'developer/create release audit companion narrative id mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences[0].visualReference.includes('9273c07f-5c03-4db4-a469-d22d456596f9'), 'developer/create release audit companion visual reference mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences[0].imageToSignalProfile.signalOutputs.readinessStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.status, 'developer/create release audit companion readiness status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.roadmapStageId === 'v5-extrondol-release-audit-and-orchestration', 'developer/create release audit roadmap stage mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.acceptanceEvidence.includes('developerAndCreateRepoWideReflection'), 'developer/create release audit acceptance evidence must include reflection');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.acceptanceEvidence.includes('releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance'), 'developer/create release audit acceptance evidence must include AI identity-finance governance');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.acceptanceEvidence.includes('spajaKod.publicSignals.aiPlateStatus'), 'developer/create release audit acceptance evidence must include SPAJA KOD AI PLATE status');
    assert(
      report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.roadmapExecution.acceptanceEvidence.join(',') ===
        'releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage,developerAndCreateRepoWideReflection,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiProgramskiUneverzitet,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiDrustveniPoredak,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.kraljevskiBastaUneverzite,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.supplementalVisualReferences,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualReference.companionAuditVisualReferences,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.osnoveRispektProtocol,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiPlateGovernance,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.napoleonDiskaveriSelectionTrack,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.eksperimentProgramskiJezikTrack,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.sarkazamPrivrednaGranaDigitalizmaTrack,spajaKod.publicSignals.developerAndCreateStatus,spajaKod.publicSignals.developerAndCreateAudioVisualStatus,spajaKod.publicSignals.developerAndCreateImplementationStatus,spajaKod.publicSignals.napoleonDiskaveriStatus,spajaKod.publicSignals.eksperimentProgramskiJezikStatus,spajaKod.publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus,spajaKod.publicSignals.aiPlateStatus',
      'developer/create release audit acceptance evidence mismatch',
    );
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.auditVisibility === 'audit-safe-readiness-only', 'developer/create release audit visual governance visibility mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.covecnostAuditVisualGovernance.downstreamSync === 'follow-up-only-until-io-openui-ao-adopts-audit-safe-summary', 'developer/create release audit visual governance downstream mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.sourceOfTruth === '/api/extrimli/extrondol', 'AI PLATE release audit source mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.canonicalName === 'DEVELOPER AND CREATE / VRH PROGRAMSKOG EKVILADENTA / AI PLATE', 'AI PLATE canonical name mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.weeklyPriceEur === 12000, 'AI PLATE weekly price mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.weeklyCadenceDecision === 'premium-rollout-regime', 'AI PLATE cadence decision mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.masterBillingCycle === 'monthly-or-annual', 'AI PLATE master billing cycle mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.roadmapStageId === 'Verzija 7', 'AI PLATE roadmap stage mismatch');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.reviewRequiredBeforeActivation, 'AI PLATE must require review before activation');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.paymentVerificationRequired, 'AI PLATE must require payment verification');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.downstreamSyncRequired, 'AI PLATE must require downstream sync');
    assert(report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.rollbackPlanRequired, 'AI PLATE must require rollback plan');
    assert(report.spajaKod.publicSignals.aiPlateEnterprisePackageStatus === report.releaseAuditSummary.aiPlateEnterprisePackageGovernance.status, 'AI PLATE SPAJA KOD status mismatch');
    assert(report.spajaKod.publicSignals.kraljevskiPravniAktStatus === report.extremProfiler.kraljevskiPravniUniverzitetTrack.structuredSignals.kraljevskiPravniAktChildRightsPolicy.status, 'SPAJA KOD KRALJEVSKI PRAVNI AKT summary mismatch');
    assert(report.spajaKod.publicSignals.aiIdentityMonthlyPrimanjaStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.monthlyPrimanjaGovernance.payoutReadinessStatus, 'SPAJA KOD AI monthly primanja summary mismatch');
    assert(report.spajaKod.publicSignals.aiIdentityMinorProtectionStatus === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiIdentityFinanceGovernance.minorProtectionSafeguards.status, 'SPAJA KOD AI minor protection summary mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.visualReference.includes('4790f4ea-4271-4d2a-ae0a-d9bec5bc8b8a'), 'SPAJA KOD developer/create ČOVEČNOST visual reference mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'SPAJA KOD developer/create ČOVEČNOST boundary mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences[0].visualReference.includes('27ef7575-9ef6-425e-bdbf-75feb722bad2'), 'SPAJA KOD developer/create supplemental visual reference mismatch');
    const spajaKodSviPripadajuSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create');
    assert(spajaKodSviPripadajuSupplemental?.visualReference.includes('c9509bbe-4083-4ba0-9802-3598f826a32b'), 'SPAJA KOD developer/create SVI KOJI POSTOJE supplemental visual reference mismatch');
    const spajaKodEntizujazamSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create');
    assert(spajaKodEntizujazamSupplemental?.visualReference.includes('f7b3e102-e0a0-4885-a93e-040f09454737'), 'SPAJA KOD developer/create ENTIZUJAŽAM supplemental visual reference mismatch');
    const spajaKodEpilogSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-rad-energija-stvaranja-developer-create');
    assert(spajaKodEpilogSupplemental?.visualReference.includes('36ce7570-103e-4097-b903-fbe0efaf4026'), 'SPAJA KOD developer/create EPILOG supplemental visual reference mismatch');
    const spajaKodPostojatiEpilogSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create');
    assert(spajaKodPostojatiEpilogSupplemental?.visualReference.includes('429b7479-7be9-41d3-9e9d-3531b1e9e596'), 'SPAJA KOD developer/create EPILOG (POSTOJATI) supplemental visual reference mismatch');
    const spajaKodMapeUmaEpilogSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-mape-uma-slike-znacenje-developer-create');
    assert(spajaKodMapeUmaEpilogSupplemental?.visualReference.includes('f857f0fd-c29d-4749-aecd-f42745646e69'), 'SPAJA KOD developer/create EPILOG (MAPE UMA) supplemental visual reference mismatch');
    assert(spajaKodMapeUmaEpilogSupplemental?.thematicSignals.join(',') === 'mape-uma,slike-plus-znacenje,ucenje,znanje,kreativnost,saradnja,odrzivost,mir,covecanstvo-epilog', 'SPAJA KOD developer/create EPILOG (MAPE UMA) thematic signals mismatch');
    const spajaKodMaticneCelijeSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create');
    assert(spajaKodMaticneCelijeSupplemental?.visualReference.includes('ca803ee2-f56e-4aa1-bd7f-18df213228d6'), 'SPAJA KOD developer/create MATIČNE ĆELIJE supplemental visual reference mismatch');
    const spajaKodKukuruzSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-prirodne-maticne-celije-kukuruz-developer-create');
    assert(spajaKodKukuruzSupplemental?.visualReference.includes('f92e1ae5-ff97-4b81-a7f1-d3df6c8283cf'), 'SPAJA KOD developer/create KUKURUZ supplemental visual reference mismatch');
    assert(spajaKodKukuruzSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create', 'SPAJA KOD developer/create KUKURUZ supplemental scenario id mismatch');
    assert(spajaKodKukuruzSupplemental?.thematicSignals.join(',') === 'kukuruz-priroda,garden-stewardship,bounded-transformation-narrative,documentation-only-health-metaphor,covecanstvo-epilog,no-medical-runtime-claims', 'SPAJA KOD developer/create KUKURUZ thematic signals mismatch');
    const spajaKodUrlLockedAd9Supplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-ad9aff82-developer-create');
    assert(spajaKodUrlLockedAd9Supplemental?.visualReference.includes('ad9aff82-4790-49c2-9224-3b250d0090d1'), 'SPAJA KOD developer/create URL-locked ad9aff82 supplemental visual reference mismatch');
    const spajaKodCistaVodaSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-cista-voda-h2o-vodonik-buducnost-developer-create');
    assert(spajaKodCistaVodaSupplemental?.visualReference.includes('2aae1845-0b3d-49c1-918b-a200cc48ad1d'), 'SPAJA KOD developer/create ČISTA VODA supplemental visual reference mismatch');
    const spajaKodUrlLocked164Supplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-164e82a7-developer-create');
    assert(spajaKodUrlLocked164Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-164e82a7-supplemental-visual-developer-create', 'SPAJA KOD developer/create URL-locked 164e82a7 supplemental scenario id mismatch');
    const spajaKodUrlLocked854Supplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-85463ed4-developer-create');
    assert(spajaKodUrlLocked854Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-85463ed4-supplemental-visual-developer-create', 'SPAJA KOD developer/create URL-locked 85463ed4 supplemental scenario id mismatch');
    const spajaKodUrlLockedA508Supplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-url-locked-a508472d-developer-create');
    assert(spajaKodUrlLockedA508Supplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-url-locked-a508472d-supplemental-visual-developer-create', 'SPAJA KOD developer/create URL-locked a508472d supplemental scenario id mismatch');
    const spajaKodSnoviPrirodeSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-snovi-prirode-inovacije-developer-create');
    assert(spajaKodSnoviPrirodeSupplemental?.visualReference.includes('92ae3dd8-75b3-4611-a8d3-27e9a0b3a9e3'), 'SPAJA KOD developer/create SNOVI PRIRODE supplemental visual reference mismatch');
    const spajaKodZivotURavnoteziSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-zivot-u-ravnotezi-developer-create');
    assert(spajaKodZivotURavnoteziSupplemental?.visualReference.includes('76d61045-6f27-4614-97d2-f96fc84173eb'), 'SPAJA KOD developer/create ŽIVOT U RAVNOTEŽI supplemental visual reference mismatch');
    assert(spajaKodZivotURavnoteziSupplemental?.thematicSignals.join(',') === 'balance,life-chain,compassion,higher-human-development', 'SPAJA KOD developer/create ŽIVOT U RAVNOTEŽI thematic signals mismatch');
    const spajaKodTrijologijaSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-trijologija-davo-u-ruci-lisica-u-kavezu-developer-create');
    assert(spajaKodTrijologijaSupplemental?.visualReference.includes('e2df2e51-efdf-4171-a356-b7848a04249d'), 'SPAJA KOD developer/create TRIJOLOGIJA supplemental visual reference mismatch');
    const spajaKodBlagoslovBogpatijuSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-blagoslov-darivati-bogpatiju-developer-create');
    assert(spajaKodBlagoslovBogpatijuSupplemental?.visualReference.includes('dbf91173-c940-4994-b223-b5438feff4a3'), 'SPAJA KOD developer/create BLAGOSLOV DARIVATI / BOGPATIJU supplemental visual reference mismatch');
    assert(spajaKodBlagoslovBogpatijuSupplemental?.thematicSignals.join(',') === 'blagoslov,darivanje,bogpatiju,zajednicko-covecanstvo', 'SPAJA KOD developer/create BLAGOSLOV DARIVATI / BOGPATIJU thematic signals mismatch');
    const spajaKodMjuziklKraljevskogCinaSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create');
    assert(spajaKodMjuziklKraljevskogCinaSupplemental?.visualReference.includes('213b2738-35b1-4dab-b6ab-ae292afc8e91'), 'SPAJA KOD developer/create MUZIČKI ČIN supplemental visual reference mismatch');
    assert(spajaKodMjuziklKraljevskogCinaSupplemental?.thematicSignals.join(',') === 'muzicki-cin,epilog,covecanstvo,zajednicki-ritam,jedan-svet', 'SPAJA KOD developer/create MUZIČKI ČIN thematic signals mismatch');
    const spajaKodKraljevskaMuzickaPoveljaSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.visualReference.includes('980557d1-6912-4e8c-9e8b-3f22e19f5c36'), 'SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA supplemental visual reference mismatch');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-muzicka-povelja-epilog-u-covecanstvo-developer-create', 'SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA supplemental scenario id mismatch');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.thematicSignals.join(',') === 'kraljevska-muzicka-povelja,epilog-u-covecanstvo,shared-world,shared-rhythm,spiritual-release,bounded-symbolic-governance', 'SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA thematic signals mismatch');
    assert(spajaKodKraljevskaMuzickaPoveljaSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'SPAJA KOD developer/create KRALJEVSKA MUZIČKA POVELJA boundary mismatch');
    const spajaKodBozijiEpitetiSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create');
    assert(spajaKodBozijiEpitetiSupplemental?.visualReference.includes('e7846b38-1a56-4321-a7d7-8acfc1328bf9'), 'SPAJA KOD developer/create BOŽIJI EPITETI supplemental visual reference mismatch');
    assert(spajaKodBozijiEpitetiSupplemental?.thematicSignals.join(',') === 'legal-governance-epilog,ethics-justice-civil-law,metric-astral-testimony,kralj-nad-kraljevima,jedan-zakon-jedna-etika-jedno-covecanstvo-jedan-bog', 'SPAJA KOD developer/create BOŽIJI EPITETI thematic signals mismatch');
    const spajaKodSemeSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-seme-malo-seme-velika-promena-developer-create');
    assert(spajaKodSemeSupplemental?.visualReference.includes('9267f560-0b94-4911-9ac4-783c7c7deb3f'), 'SPAJA KOD developer/create SEME supplemental visual reference mismatch');
    assert(spajaKodSemeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create', 'SPAJA KOD developer/create SEME supplemental scenario id mismatch');
    assert(spajaKodSemeSupplemental?.thematicSignals.join(',') === 'seed-growth,clean-input,planetary-stewardship,shared-world,small-change-large-impact,better-tomorrow', 'SPAJA KOD developer/create SEME thematic signals mismatch');
    assert(spajaKodSemeSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'SPAJA KOD developer/create SEME boundary mismatch');
    const spajaKodZdravijiUmSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-zdraviji-um-snazniji-ljudi-bolji-svet-developer-create');
    assert(spajaKodZdravijiUmSupplemental?.visualReference.includes('81ebf11b-d1a5-451b-880a-8670fe240041'), 'SPAJA KOD developer/create ZDRAVIJI UM supplemental visual reference mismatch');
    assert(spajaKodZdravijiUmSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create', 'SPAJA KOD developer/create ZDRAVIJI UM supplemental scenario id mismatch');
    assert(spajaKodZdravijiUmSupplemental?.thematicSignals.join(',') === 'mental-reflection,understanding-thoughts,empathetic-humanity,shared-healing-metaphor,stronger-people-better-world,documentation-only-mind-epilog', 'SPAJA KOD developer/create ZDRAVIJI UM thematic signals mismatch');
    assert(spajaKodZdravijiUmSupplemental?.imageToSignalProfile.ownershipLock.spajaKod === 'audit-safe-summary-only', 'SPAJA KOD developer/create ZDRAVIJI UM boundary mismatch');
    const spajaKodPravoslavljeAktRevolucijeSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-pravoslavlje-akt-revolucije-nad-hriscanstvom-developer-create');
    assert(spajaKodPravoslavljeAktRevolucijeSupplemental?.visualReference.includes('749fac80-2a31-438b-ab05-190d2421f191'), 'SPAJA KOD developer/create PRAVOSLAVLJE supplemental visual reference mismatch');
    assert(spajaKodPravoslavljeAktRevolucijeSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-pravoslavlje-akt-revolucije-zrtva-pravo-etika-kontinuitet-developer-create', 'SPAJA KOD developer/create PRAVOSLAVLJE supplemental scenario id mismatch');
    assert(spajaKodPravoslavljeAktRevolucijeSupplemental?.thematicSignals.join(',') === 'right-and-law,ethics-and-justice,sacrifice-and-renewal,civilizational-continuity,right-to-exist-and-belong', 'SPAJA KOD developer/create PRAVOSLAVLJE thematic signals mismatch');
    const spajaKodKraljevskaProduktivnostSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create');
    assert(spajaKodKraljevskaProduktivnostSupplemental?.visualReference.includes('b02ac97f-d0ec-44b6-aadb-8ae3981127ea'), 'SPAJA KOD developer/create KRALJEVSKA PRODUKTIVNOST supplemental visual reference mismatch');
    assert(spajaKodKraljevskaProduktivnostSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create', 'SPAJA KOD developer/create KRALJEVSKA PRODUKTIVNOST supplemental scenario id mismatch');
    assert(spajaKodKraljevskaProduktivnostSupplemental?.thematicSignals.join(',') === 'legal-citizenship,garden-productivity,family-self-sufficiency,earth-stewardship,humanity-epilog,small-work-large-change', 'SPAJA KOD developer/create KRALJEVSKA PRODUKTIVNOST thematic signals mismatch');
    const spajaKodKraljevstvoSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevstvo-ljudi-znanje-priroda-tehnologija-buducnost-developer-create');
    assert(spajaKodKraljevstvoSupplemental?.visualReference.includes('6b037ede-14ed-4f02-8939-c112bae773be'), 'SPAJA KOD developer/create KRALJEVSTVO supplemental visual reference mismatch');
    assert(spajaKodKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-zajedno-gradimo-kraljevstvo-za-sve-generacije-developer-create', 'SPAJA KOD developer/create KRALJEVSTVO supplemental scenario id mismatch');
    assert(spajaKodKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,zajednistvo,buducnost,znanje,humanost,tehnologija-u-sluzbi-zivota', 'SPAJA KOD developer/create KRALJEVSTVO thematic signals mismatch');
    const spajaKodKraljevskaKucaSmederevoSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevska-kuca-srbija-smederevo-epicentricna-tacka-planete-developer-create');
    assert(spajaKodKraljevskaKucaSmederevoSupplemental?.visualReference.includes('7b6cfca4-d61f-4974-b06f-299be5626282'), 'SPAJA KOD developer/create KRALJEVSKA KUĆA supplemental visual reference mismatch');
    assert(spajaKodKraljevskaKucaSmederevoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevska-kuca-srbija-smederevo-jedan-planet-jedan-narod-jedna-buducnost-developer-create', 'SPAJA KOD developer/create KRALJEVSKA KUĆA supplemental scenario id mismatch');
    assert(spajaKodKraljevskaKucaSmederevoSupplemental?.thematicSignals.join(',') === 'kraljevska-kuca,srbija-smederevo,epicentricna-tacka-planete,jedan-planet-jedan-narod-jedna-buducnost,legal-governance-epilog,bounded-non-enforcement', 'SPAJA KOD developer/create KRALJEVSKA KUĆA thematic signals mismatch');
    const spajaKodSvitakBozanstvaSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-developer-create');
    assert(spajaKodSvitakBozanstvaSupplemental?.visualReference.includes('752ba75d-86b3-4d65-a6d7-e4f126c303ae'), 'SPAJA KOD developer/create SVITAK BOŽANSTVA supplemental visual reference mismatch');
    assert(spajaKodSvitakBozanstvaSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create', 'SPAJA KOD developer/create SVITAK BOŽANSTVA supplemental scenario id mismatch');
    assert(spajaKodSvitakBozanstvaSupplemental?.thematicSignals.join(',') === 'bozanstvo-nad-svim,pravoslavlje-vecna-svetlost,vera-znanje-ljubav,narod-zemlja-covecanstvo,jedan-bog-jedan-narod-jedna-zemlja-jedno-covecanstvo', 'SPAJA KOD developer/create SVITAK BOŽANSTVA thematic signals mismatch');
    const spajaKodPravedanSvetKraljevstvoSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create');
    assert(spajaKodPravedanSvetKraljevstvoSupplemental?.visualReference.includes('527e2ce4-7bfe-4ab0-b5a3-caceb75b24c0'), 'SPAJA KOD developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental visual reference mismatch');
    const spajaKodGilskultureKraljevstvoSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-epilog-kraljevstvo-gilskulture-developer-create');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.visualReference.includes('50cb9759-5ce2-490f-bcb2-8a3b73fed39f'), 'SPAJA KOD developer/create GILSKULTURE supplemental visual reference mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.kraljevskiBastaUneverzite.canonicalNarrativeId === 'kraljevski-basta-uneverzite-prirodne-maticne-celije-covecanstvu', 'SPAJA KOD developer/create basta narrative id mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.kraljevskiBastaUneverzite.supportingNarratives.join(',') === 'covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create,covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create,covecanstvo-prirodne-maticne-celije-kukuruz-developer-create', 'SPAJA KOD developer/create basta supporting narratives mismatch');
    const spajaKodAiIdentityCardSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'licna-karta-artificial-intelligence-identity-card-developer-create');
    assert(spajaKodAiIdentityCardSupplemental?.visualReference.includes('aee19f4e-dede-47d9-83ca-1b080cf9b38b'), 'SPAJA KOD developer/create AI identity card supplemental visual reference mismatch');
    assert(spajaKodAiIdentityCardSupplemental?.thematicSignals.join(',') === 'ai-identitet,odgovorna-vestacka-inteligencija,globalno-znanje,podrska-edukacija-kreativnost,resavanje-problema,documentation-only-activation-cues', 'SPAJA KOD developer/create AI identity card thematic signals mismatch');
    const spajaKodVisionSunriseSupplemental = report.spajaKod.developerAndCreateVisualReflection.supplementalVisualReferences.find((reference) => reference.canonicalNarrativeId === 'covecanstvo-pontcerima-svima-ako-zele-da-poprave-vid-developer-create');
    assert(spajaKodVisionSunriseSupplemental?.visualReference.includes('446f2155-2c59-4420-826b-e248844943a8'), 'SPAJA KOD developer/create sunrise vision supplemental visual reference mismatch');
    assert(spajaKodVisionSunriseSupplemental?.thematicSignals.join(',') === 'vid,jutarnje-sunce,licno-iskustvo,epilog-covecanstvu,disciplina-posmatranja,documentation-only-guidance', 'SPAJA KOD developer/create sunrise vision thematic signals mismatch');
    assert(spajaKodPravedanSvetKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create', 'SPAJA KOD developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE supplemental scenario id mismatch');
    assert(spajaKodPravedanSvetKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,pravoslavlje,znanje,priroda,covecanstvo,jedan-svet-jedna-porodica,vecnost', 'SPAJA KOD developer/create KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE thematic signals mismatch');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.imageToSignalProfile.scenarioId === 'covecanstvo-epilog-kraljevstvo-gilskulture-znanje-mir-odgovornost-developer-create', 'SPAJA KOD developer/create GILSKULTURE supplemental scenario id mismatch');
    assert(spajaKodGilskultureKraljevstvoSupplemental?.thematicSignals.join(',') === 'kraljevstvo,covecanstvo-epilog,znanje-citanje,deca-buduci-narastaji,priroda-covek-tehnologija-u-ravnotezi,mir-pravda-odgovornost', 'SPAJA KOD developer/create GILSKULTURE thematic signals mismatch');
    assert(spajaKodTrijologijaSupplemental?.thematicSignals.join(',') === 'trijologija-framework,davo-u-ruci-voda-u-ruci,lisica-u-kavezu-risk,freedom-with-responsibility,covecanstvo-epilog', 'SPAJA KOD developer/create TRIJOLOGIJA thematic signals mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.companionAuditVisualReferences[0].visualReference.includes('9273c07f-5c03-4db4-a469-d22d456596f9'), 'SPAJA KOD developer/create companion visual reference mismatch');
    assert(!('technicalReadinessBinding' in report.spajaKod.developerAndCreateVisualReflection), 'SPAJA KOD developer/create visual must not expose internal technical binding');
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
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČANSTVA', 'radni takt epilog title mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.canonicalNarrativeId === 'priroda-zdrav-zivot-covecanstvo', 'radni takt canonical narrative id mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.citation.includes('Priroda izum samoživost'), 'radni takt audit epilog citation mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.visualReference.includes('b485b700-f670-4f71-9f54-47b29a4155ec'), 'radni takt audit epilog visual reference mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.imageToSignalProfile.scenarioId === 'priroda-zdrav-zivot-covecanstvo', 'radni takt audit image profile scenario mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.imageToSignalProfile.signalOutputs.readinessScore === report.extremProfiler.radniTaktMozgaMislilac.readiness.score, 'radni takt audit image profile readiness score mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.imageToSignalProfile.signalOutputs.conflictPressurePercent === report.extremProfiler.radniTaktMozgaMislilac.profileInput.conflictPressurePercent, 'radni takt audit image profile conflict pressure mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.imageToSignalProfile.signalOutputs.deterministicFallbackRequired === (report.extremProfiler.radniTaktMozgaMislilac.readiness.status === 'BLOCKED'), 'radni takt audit image profile deterministic fallback mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.flowLock.sequence.join(' -> ') === 'image -> spajanje -> posledica -> epilog', 'radni takt audit flow lock mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.packageOutputs.masterEpilog.includes('Priroda i zdrav život'), 'radni takt audit master epilog mismatch');
    assert(report.releaseAuditSummary.radniTaktMozgaMislilacGovernance.epilogijaCovecnosti.packageOutputs.governanceChecklistStatus.includes('IZEK review checkpoint required'), 'radni takt audit governance checklist mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.radniTaktMozgaMislilac.readiness.status'), 'radni takt status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('radniTaktMozgaMislilac.waweImpact'), 'radni takt WAWE impact must sync downstream');
    assert(report.spajaKod.publicSignals.radniTaktMozgaMislilacStatus === report.extremProfiler.radniTaktMozgaMislilac.readiness.status, 'SPAJA KOD radni takt summary mismatch');
    assert(report.spajaKod.epilogijaCovecnosti.title === 'EPILOGIJA ČOVEČANSTVA', 'SPAJA KOD epilog title mismatch');
    assert(report.spajaKod.epilogijaCovecnosti.visualReference.includes('b485b700-f670-4f71-9f54-47b29a4155ec'), 'SPAJA KOD epilog visual reference mismatch');
    assert(report.spajaKod.epilogijaCovecnosti.packageOutputs.posterSummary.includes('Obogaćuj se prirodom'), 'SPAJA KOD poster summary mismatch');
    assert(report.spajaKod.epilogijaCovecnosti.imageToSignalProfile.ownershipLock.dokDikFor === 'EXTREM', 'SPAJA KOD image profile ownership mismatch');
    assert(report.spajaKod.epilogijaCovecnosti.dokerKuratIzekDokarOverlay.KURAT.includes('public-safe'), 'SPAJA KOD KURAT overlay mismatch');
    assert(report.radniTaktMozgaMislilac.reasons.includes('epilog:canonical-priroda-zdrav-zivot-covecanstvo'), 'radni takt canonical epilog governance reason missing');
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
    const scorecardCheck = report.releaseReadinessScorecard.checks.find((check) => check.id === 'vrh-programskog-ekviladenta-governance');
    assert(report.vrhProgramskogEkviladenta.term === 'VRH PROGRAMSKOG EKVILADENTA', 'vrh term mismatch');
    assert(report.vrhProgramskogEkviladenta.contractVersion === EXTRONDOL_VRH_PROGRAMSKOG_EKVILADENTA_CONTRACT_VERSION, 'vrh contract mismatch');
    assert(report.vrhProgramskogEkviladenta.technicalSignalSource === '/api/extrimli/extrem', 'vrh technical source mismatch');
    assert(report.vrhProgramskogEkviladenta.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'vrh parent track mismatch');
    assert(report.releaseAuditSummary.vrhProgramskogEkviladentaGovernance.sourceOfTruth === '/api/extrimli/extrem', 'vrh audit source mismatch');
    assert(
      report.vrhProgramskogEkviladenta.documentationOnlyReferences.some(
        (reference) =>
          reference.url === 'https://chatgpt.com/share/6ab2f88d-23b0-83eb-b708-b880bdb7fc11?ogimg=plain'
          && reference.runtimeInputAllowed === false,
      ),
      'vrh governance must preserve first documentation-only share reference',
    );
    assert(
      report.vrhProgramskogEkviladenta.documentationOnlyReferences.some(
        (reference) =>
          reference.url === 'https://chatgpt.com/share/6ab3c696-e9d0-83ed-ab2a-977fd811c82d?ogimg=plain'
          && reference.runtimeInputAllowed === false,
      ),
      'vrh governance must preserve second documentation-only share reference',
    );
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('extremProfiler.vrhProgramskogEkviladenta.readiness.status'), 'vrh status must sync downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('vrhProgramskogEkviladenta.waweImpact'), 'vrh WAWE impact must sync downstream');
    assert(report.startProject.mandatoryOutputs.includes('vrhProgramskogEkviladenta'), 'vrh governance must be mandatory output');
    assert(report.spajaKod.publicSignals.vrhProgramskogEkviladentaStatus === report.extremProfiler.vrhProgramskogEkviladenta.readiness.status, 'SPAJA KOD vrh summary mismatch');
    assert(report.vrhProgramskogEkviladenta.canonicalUniversityTracks.kraljevskaMehanikaUniverzitetStatus === report.vrhProgramskogEkviladenta.canonicalUniversityTracks.kraljevskiMasinskiUniverzitetStatus, 'vrh mehanika/mašinski mapping mismatch');
    assert(scorecardCheck != null, 'vrh scorecard check missing');
    assert(
      scorecardCheck.status === (
        report.vrhProgramskogEkviladenta.status === 'READY'
          ? 'PASS'
          : report.vrhProgramskogEkviladenta.status === 'WATCH'
            ? 'WARN'
            : 'FAIL'
      ),
      'vrh scorecard status mismatch',
    );
    assert(scorecardCheck.details === report.vrhProgramskogEkviladenta.reasons.join('; '), 'vrh scorecard details mismatch');
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
    assert(report.releaseReadinessScorecard.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol,/api/extrimli/spaja-kod', 'scorecard source routes mismatch');
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
    assert(report.developerAndCreateRepoWideReflection.term === 'DEVELOPER AND CREATE', 'developer/create governance term mismatch');
    assert(report.developerAndCreateRepoWideReflection.equalityLock === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)', 'developer/create governance equality lock mismatch');
    assert(report.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == DIJALIZA POGONSKOG OMOTAČA'), 'developer/create governance DIJALIZA POGONSKOG OMOTAČA alias mismatch');
    assert(report.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPA UMA'), 'developer/create governance MAPA UMA alias mismatch');
    assert(report.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.interpretationAliases.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == ŽIVOPIS U DIGITALIZMU'), 'developer/create governance ŽIVOPIS U DIGITALIZMU alias mismatch');
    assert(report.developerAndCreateRepoWideReflection.publicBoundary === '/api/extrimli/spaja-kod', 'developer/create public boundary mismatch');
    assert(report.developerAndCreateRepoWideReflection.technicalReadinessProfile.radniTaktMozgaMislilac.status === report.extremProfiler.radniTaktMozgaMislilac.readiness.status, 'developer/create governance radni takt profile mismatch');
    assert(report.developerAndCreateRepoWideReflection.aiPlateGovernance.canonicalName === 'AI PLATE', 'AI PLATE governance canonical name mismatch');
    assert(report.developerAndCreateRepoWideReflection.aiPlateGovernance.runtimeProvider === 'Vercel', 'AI PLATE governance runtime provider mismatch');
    assert(report.developerAndCreateRepoWideReflection.aiPlateGovernance.businessTarget.amountEur === 12000, 'AI PLATE governance weekly target mismatch');
    assert(
      report.developerAndCreateRepoWideReflection.aiPlateGovernance.currentWave
        === report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiPlateGovernance.currentWave,
      'AI PLATE governance wave mismatch',
    );
    assert(report.developerAndCreateRepoWideReflection.roadmapExecution.roadmapStageId === 'v5-extrondol-release-audit-and-orchestration', 'developer/create governance roadmap stage mismatch');
    assert(report.developerAndCreateRepoWideReflection.canonicalScopeLock === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA', 'developer/create governance canonical scope lock mismatch');
    assert(report.developerAndCreateRepoWideReflection.priorityExecutionOrder.join(',') === 'terminology-and-scope-lock,extrem-technical-readiness-profile,extrondol-release-audit-and-governance-mirror,spaja-kod-public-safe-summary,kompanija-spaja-digitalna-industrija-business-mapping,drift-zero-validation', 'developer/create governance priority order mismatch');
    assert(report.developerAndCreateRepoWideReflection.fourTrackProgramPackage.businessTrack.canonicalName === 'Kompanija SPAJA / Digitalna Industrija', 'developer/create governance business track mismatch');
    assert(report.developerAndCreateRepoWideReflection.roadmapExecution.downstreamSync === 'follow-up-only-until-io-openui-ao-adopts-audit-safe-summary', 'developer/create governance downstream boundary mismatch');
    assert(report.developerAndCreateRepoWideReflection.roadmapExecution.rolloutPlan.length > 0, 'developer/create governance rollout plan mismatch');
    assert(report.developerAndCreateRepoWideReflection.roadmapExecution.rollbackPlan.length > 0, 'developer/create governance rollback plan mismatch');
    assert(report.developerAndCreateRepoWideReflection.roadmapExecution.humanReviewStatus === 'required-before-promotion', 'developer/create governance human review status mismatch');
    assert(report.developerAndCreateRepoWideReflection.roadmapExecution.downstreamReference === 'docs/MULTI-REPO-LINKS.md -> spaja86/IO-OPENUI-AO (summary-only)', 'developer/create governance downstream reference mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.currentWawe === report.rollout.currentWawe, 'developer/create release-audit implementation package current WAWE mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.eligibleNextWawe === report.rollout.eligibleNextWawe, 'developer/create release-audit implementation package next WAWE mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.canonicalTerminologyMapping.phrase === 'EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR', 'developer/create release-audit implementation package terminology mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.kraljevskiEkonomskiUneverzitetBoundary.arhimedisModelBounded, 'developer/create release-audit implementation package Arhimedis boundary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.kraljevskiEkonomskiUneverzitetBoundary.noNewRuntimeModule, 'developer/create release-audit implementation package economic boundary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.kraljevskiProgramskiUneverzitetBoundary.parentTrack === 'VRH PROGRAMSKOG EKVILADENTA', 'developer/create release-audit implementation package programmatic parent mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.kraljevskiProgramskiUneverzitetBoundary.noNewRuntimeModule, 'developer/create release-audit implementation package programmatic runtime boundary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.kraljevskiProgramskiUneverzitetBoundary.noParallelSourceOfTruth, 'developer/create release-audit implementation package programmatic source boundary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.implementationPackage.roadmapStages.v7 === 'enterprise-organizational-operating-model', 'developer/create release-audit implementation package V7 mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateStatus === report.developerAndCreateRepoWideReflection.status, 'SPAJA KOD developer/create status mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.spajaKod.publicSignals.developerAndCreateImplementationStatus), 'SPAJA KOD developer/create implementation status mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.validationStatus === report.spajaKod.publicSignals.developerAndCreateImplementationStatus, 'SPAJA KOD implementation package validation status mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.canonicalScopeLock === 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA', 'SPAJA KOD implementation package canonical scope lock mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.fourTrackSummary.business.canonicalName === 'Kompanija SPAJA / Digitalna Industrija', 'SPAJA KOD implementation package business summary mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kompanijaSpajaDigitalnaIndustrijaSummary.umbrellaModel === 'DIGITALNA INDUSTRIJA', 'SPAJA KOD implementation package business umbrella mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kompanijaSpajaDigitalnaIndustrijaSummary.noNewFinancialRuntimeFormulas, 'SPAJA KOD implementation package business runtime boundary mismatch');
    assert(report.spajaKod.publicSignals.aiPlateStatus === report.developerAndCreateRepoWideReflection.aiPlateGovernance.status, 'SPAJA KOD AI PLATE status mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.aiPlateGovernance.packageOutputs.auditShortSummary.includes('AI PLATE'), 'AI PLATE release-audit summary mismatch');
    assert(report.spajaKod.publicSignals.kraljevskiProgramskiUneverzitetStatus === report.extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiProgramskiUneverzitet.readiness.status, 'SPAJA KOD programmatic summary mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.inspektori.parentLegalTrack === 'KRALJEVSKI PRAVNI UNIVERZITET', 'developer/create release-audit INSPEKTORI parent mismatch');
    assert(report.spajaKod.publicSignals.inspektoriStatus === report.extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.inspektori.readiness.status, 'SPAJA KOD INSPEKTORI status mismatch');
    assert(report.spajaKod.publicSignals.inspektoriSummary.activeUniversityCount === report.developerAndCreateRepoWideReflection.inspektori.universityCatalog.activeCount, 'SPAJA KOD INSPEKTORI university count mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.inspektori.reviewRequiredBeforeWideRollout, 'developer/create release-audit INSPEKTORI must require review before wide rollout');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.inspektori.escalatedReviewRequiredBeforeWideRollout, 'developer/create release-audit INSPEKTORI escalated rollout-review flag should stay true when the justice path is blocked');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage.acceptanceEvidence.join(',') === 'developerAndCreateRepoWideReflection.audioVisualKontrabasPackage,releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage,spajaKod.publicSignals.developerAndCreateAudioVisualStatus,spajaKod.developerAndCreateVisualReflection.audioVisualKontrabasPackage', 'developer/create release-audit audio-visual acceptance evidence mismatch');
    assert(report.releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance.audioVisualKontrabasPackage.downstreamReference === 'docs/MULTI-REPO-LINKS.md -> spaja86/IO-OPENUI-AO (summary-only)', 'developer/create release-audit audio-visual downstream reference mismatch');
    assert(report.developerAndCreateRepoWideReflection.inspektori.justicePath.evidentiaryCompletenessStatus === 'WATCH', 'developer/create INSPEKTORI justice-path evidentiary completeness should stay bounded when evidence inputs degrade without hard blockers');
    assert(report.developerAndCreateRepoWideReflection.inspektori.justicePath.justicePathConsistency === 'BLOCKED', 'developer/create INSPEKTORI justice path should still block on deterministic fallback');
    assert(report.developerAndCreateRepoWideReflection.inspektori.justicePath.reviewPosture === 'REVIEW_REQUIRED', 'developer/create INSPEKTORI justice-path posture should escalate when the justice path is blocked');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.passedAreasCount === report.developerAndCreateRepoWideReflection.universityPublicSummary.passedAreasCount, 'SPAJA KOD university passed area count mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.certificationStatus === report.developerAndCreateRepoWideReflection.universityPublicSummary.certificationStatus, 'SPAJA KOD university certification summary mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.privredniAktQuarterlyMarketStatus === report.developerAndCreateRepoWideReflection.universityPublicSummary.privredniAktQuarterlyMarketStatus, 'SPAJA KOD privredni akt quarterly market status summary mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.zadrugaOperationalStatus === report.developerAndCreateRepoWideReflection.universityPublicSummary.zadrugaOperationalStatus, 'SPAJA KOD zadruga operational summary mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.instrumentTablaStatus === report.developerAndCreateRepoWideReflection.universityPublicSummary.instrumentTablaStatus, 'SPAJA KOD instrument tabla summary mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.payoutGovernancePosture === report.developerAndCreateRepoWideReflection.universityPublicSummary.payoutGovernancePosture, 'SPAJA KOD payout governance posture summary mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateUniversitySummary.privredniAktBeneficiarySegments.join(',') === 'poljoprivrednici-sa-gostoprimstvom,poljoprivrednici', 'SPAJA KOD privredni akt beneficiary segment summary mismatch');
    assert(report.spajaKod.publicSignals.developerAndCreateAudioVisualStatus === report.developerAndCreateRepoWideReflection.audioVisualKontrabasPackage.readinessStatus, 'SPAJA KOD developer/create audio-visual status mismatch');
    assert(report.spajaKod.publicSignals.napoleonDiskaveriStatus === report.developerAndCreateRepoWideReflection.napoleonDiskaveriSelectionTrack.discoverySelectionSignal.selectionStatus, 'SPAJA KOD developer/create Napoleon Diskaveri status mismatch');
    assert(report.spajaKod.developerAndCreateVisualReflection.audioVisualKontrabasPackage.summarySafeFields.join(',') === 'readinessStatus,blockerReason,reviewPosture,downstreamReference,videoStoryboardSummary', 'SPAJA KOD developer/create audio-visual summary-safe fields mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.napoleonDiskaveriSummary.canonicalAlias === 'SELEKCIONIRANJE U SELEKCIJAMA PREMA AKTIVNOM NADMAŠAJU / NAPOLEON DISKAVERI', 'SPAJA KOD developer/create Napoleon Diskaveri summary alias mismatch');
    assert(report.spajaKod.publicSignals.smartProgramskiJezikStatus === report.developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.technicalProfile.status, 'SPAJA KOD smart language status mismatch');
    assert(report.spajaKod.publicSignals.immersiveVisualization3dStatus === report.developerAndCreateRepoWideReflection.technicalReadinessProfile.immersiveVisualization3dTrack.status, 'SPAJA KOD immersive visualization status mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.smartProgramskiJezikSummary.canonicalName === report.developerAndCreateRepoWideReflection.implementationPackage.smartProgramskiJezikPackage.canonicalName, 'SPAJA KOD smart language canonical name mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.smartProgramskiJezikSummary.immersiveVisualizationStatus === report.developerAndCreateRepoWideReflection.technicalReadinessProfile.immersiveVisualization3dTrack.status, 'SPAJA KOD smart language immersive summary mismatch');
    assert(report.spajaKod.publicSignals.eksperimentProgramskiJezikStatus === report.developerAndCreateRepoWideReflection.eksperimentProgramskiJezikTrack.readinessSignal.status, 'SPAJA KOD Eksperiment Programski Jezik status mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary.canonicalAlias === report.developerAndCreateRepoWideReflection.eksperimentProgramskiJezikTrack.canonicalAlias, 'SPAJA KOD Eksperiment Programski Jezik canonical alias mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary.immersiveVisualizationStatus === report.developerAndCreateRepoWideReflection.technicalReadinessProfile.immersiveVisualization3dTrack.status, 'SPAJA KOD Eksperiment Programski Jezik immersive summary mismatch');
    assert(report.spajaKod.publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus === report.developerAndCreateRepoWideReflection.sarkazamPrivrednaGranaDigitalizmaTrack.reflectionSignal.status, 'SPAJA KOD Sarkazam status mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary.canonicalAlias === report.developerAndCreateRepoWideReflection.sarkazamPrivrednaGranaDigitalizmaTrack.canonicalAlias, 'SPAJA KOD Sarkazam canonical alias mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.routeSummaryFields.join(',') === 'publicSignals.developerAndCreateStatus,publicSignals.developerAndCreateImplementationStatus,publicSignals.developerAndCreateAudioVisualStatus,publicSignals.smartProgramskiJezikStatus,publicSignals.immersiveVisualization3dStatus,publicSignals.eksperimentProgramskiJezikStatus,publicSignals.sarkazamPrivrednaGranaDigitalizmaStatus,publicSignals.napoleonDiskaveriStatus,publicSignals.kraljevskiPravniUniverzitetStatus,publicSignals.kraljevskiPravniAktStatus,publicSignals.kraljevskiAktBezbednostiStatus,publicSignals.kraljevskiProgramskiUneverzitetStatus,publicSignals.inspektoriStatus,publicSignals.inspektoriSummary,publicSignals.aiIdentityMonthlyPrimanjaStatus,publicSignals.aiIdentityMinorProtectionStatus,publicSignals.developerAndCreateUniversitySummary,developerAndCreateVisualReflection.audioVisualKontrabasPackage,developerAndCreateVisualReflection.kraljevskiBastaUneverzite,developerAndCreateVisualReflection.packageOutputs,developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary,developerAndCreateImplementationPackage.kraljevskiDrustveniPoredakSummary,developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary,developerAndCreateImplementationPackage.smartProgramskiJezikSummary,developerAndCreateImplementationPackage.eksperimentProgramskiJezikSummary,developerAndCreateImplementationPackage.sarkazamPrivrednaGranaDigitalizmaSummary,developerAndCreateImplementationPackage.napoleonDiskaveriSummary,epilogijaCovecnosti.packageOutputs', 'SPAJA KOD implementation package route summary fields mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.canonicalName === 'AI IQ WORLD BANK PREPISKA', 'SPAJA KOD AI IQ WORLD BANK prepiska summary name mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.aiIqWorldBankPrepiskaSummary.sourceMaterialPolicy === 'documentation-only', 'SPAJA KOD AI IQ WORLD BANK prepiska summary must remain documentation-only');
    assert(report.spajaKod.publicSignals.kraljevskiAktBezbednostiStatus === report.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.readiness.status, 'SPAJA KOD security-act public signal mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.domainCatalog.join(',') === 'KRALJEVSKI,GARDISTI,VOJNI,POLICIJSKI,SPECIJALNE JEDINICE', 'SPAJA KOD security-act summary domain catalog mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.interpretativeOnly, 'SPAJA KOD security-act alias catalog must stay interpretative-only');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.nonOperational, 'SPAJA KOD security-act alias catalog must stay non-operational');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.GARDISTI.alias === 'VUKOVI', 'SPAJA KOD security-act GARDISTI alias mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog['SPECIJALNE JEDINICE'].aliases.join(',') === 'BIA,UDBA,ŽANDERMERIJA (OKLOPNJAČE)', 'SPAJA KOD security-act SPECIJALNE JEDINICE aliases mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.auditSafeAliasCatalog.forbiddenOperationalEvidence.includes('operational-identity'), 'SPAJA KOD security-act alias catalog forbidden evidence mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.canonicalName === 'KRALJEVSKA PLATA', 'SPAJA KOD salary summary canonical name mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.paymentVerificationRequired, 'SPAJA KOD salary summary must require payment verification');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.paymentVerificationStatus === report.paymentVerification.status, 'SPAJA KOD salary summary payment verification status mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.payoutReadinessStatus === report.extremProfiler.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.kraljevskiDrustveniPoredak.kraljevskiAktBezbednosti.kraljevskaPlataPolicy.payoutReadinessStatus, 'SPAJA KOD salary summary payout readiness mismatch');
    assert(['string', 'object'].includes(typeof report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary.blockerReason), 'SPAJA KOD salary summary blocker reason type mismatch');
    assert(!('forbiddenArtifacts' in report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary), 'SPAJA KOD salary summary must not expose forbidden-artifact internals');
    assert(!('requiredGovernanceGates' in report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaPlataSummary), 'SPAJA KOD salary summary must not expose governance-gate internals');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaVojnaIPolicijskaOpremaSummary.categoryCatalog.join(',') === 'KRALJEVSKI,VOJNI,POLICIJSKI', 'SPAJA KOD equipment sub-track summary category catalog mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaVojnaIPolicijskaOpremaSummary.qualityCriteria.standard === 'najbolja-savremena-oprema-auditabilno-neoperativno', 'SPAJA KOD equipment sub-track summary quality standard mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaVojnaIPolicijskaOpremaSummary.requiredGovernanceGates.includes('human-review'), 'SPAJA KOD equipment sub-track summary governance gates mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.kraljevskaVojnaIPolicijskaOpremaSummary.readinessStatus === report.spajaKod.publicSignals.kraljevskiAktBezbednostiStatus, 'SPAJA KOD equipment sub-track summary readiness mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.kraljevskiAktBezbednostiSummary.forbiddenEvidence.includes('tactical-plan'), 'SPAJA KOD security-act summary forbidden evidence mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.inspektoriSummary.forbiddenEvidence.includes('repressive-detail'), 'SPAJA KOD INSPEKTORI forbidden evidence mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.inspektoriSummary.publicBoundary === 'audit-safe-summary-only', 'SPAJA KOD INSPEKTORI public boundary mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.covecanstvuPublicOutput === 'summary-only', 'SPAJA KOD implementation package ČOVEČANSTVU output mismatch');
    assert(report.spajaKod.developerAndCreateImplementationPackage.downstreamAuditFields.join(',') === 'masterEpilog,posterSummary,videoStoryboardSummary,auditShortSummary,governanceChecklistStatus', 'SPAJA KOD implementation package downstream audit fields mismatch');
    assert(report.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.readiness.status === report.developerAndCreateRepoWideReflection.status, 'developer/create consistency mismatch');
    assert(report.developerAndCreateRepoWideReflection.dailyOperationalCadence.status === report.developerAndCreateRepoWideReflection.status, 'developer/create cadence status mismatch');
    assert(report.developerAndCreateRepoWideReflection.dailyOperationalCadence.activeRoadmapStagePolicy === 'single-active-roadmap-stage-per-day', 'developer/create cadence roadmap policy mismatch');
    assert(report.developerAndCreateRepoWideReflection.dailyOperationalCadence.cadenceBlocks.join(',') === 'morning-startup,deep-focus-block,midday-checkpoint,end-of-day-closeout', 'developer/create cadence blocks mismatch');
    assert(report.developerAndCreateRepoWideReflection.dailyOperationalCadence.endOfDayStatuses.join(',') === 'completed,carried-over,blocked', 'developer/create cadence closeout statuses mismatch');
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
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.canonicalName === 'DEVELOPER AND CREATE / VRH PROGRAMSKOG EKVILADENTA / AI PLATE', 'AI PLATE package name mismatch');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.pricing.amountEur === 12000, 'AI PLATE price mismatch');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.pricing.cadence === 'weekly', 'AI PLATE cadence mismatch');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.weeklyCadenceDecision.decisionMode === 'premium-rollout-regime', 'AI PLATE decision mode mismatch');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.weeklyCadenceDecision.masterBillingCycle === 'monthly-or-annual', 'AI PLATE billing lock mismatch');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.seats, 'AI PLATE seats scope missing');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.copilotAiRights, 'AI PLATE Copilot scope missing');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.privateRepositoryAccess, 'AI PLATE private repo scope missing');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.governance, 'AI PLATE governance scope missing');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.supportSla, 'AI PLATE SLA scope missing');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.humanReview, 'AI PLATE human review scope missing');
    assert(report.b2bScope.subscriptionPackage.aiPlateEnterprisePackage.scopeLock.compliance, 'AI PLATE compliance scope missing');
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
    assert(report.b2bReadiness.compliance.auditTrailComplete === false, 'audit trail should require explicit governance evidence');
    assert(report.b2bReadiness.downstreamSync.status === 'FOLLOW_UP_REQUIRED', 'downstream sync must require explicit evidence');
    assert(report.b2bReadiness.compliance.blockers.includes('onboarding-complete'), 'onboarding blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('downstream-sync-complete'), 'downstream sync blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('human-review-complete'), 'human review blocker must be present');
    assert(report.b2bReadiness.compliance.blockers.includes('audit-trail-complete'), 'audit blocker should appear without explicit evidence');
    assert(report.b2bReadiness.downstreamSync.linkedRepo === 'spaja86/IO-OPENUI-AO', 'linked repo mismatch');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('versionRoadmap.contractVersion'), 'roadmap contract sync field missing');
    assert(report.startProject.mandatoryOutputs.includes('versionRoadmap'), 'versionRoadmap must be a START mandatory output');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('versionRoadmap'), 'versionRoadmap must be synced downstream');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('rollout.currentWawe'), 'canonical currentWawe sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('b2bScope.subscriptionPackage'), 'subscription sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('b2bScope.subscriptionPackage.aiPlateEnterprisePackage'), 'AI PLATE subscription sync field missing');
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
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('releaseAuditSummary.aiPlateEnterprisePackageGovernance'), 'AI PLATE release audit sync field missing');
    assert(report.b2bReadiness.downstreamSync.syncedFields.includes('spajaKod.publicSignals.aiPlateEnterprisePackageStatus'), 'AI PLATE SPAJA KOD sync field missing');
    assert(report.b2bReadiness.governanceDecisions.rolloutFreeze === report.rollout.promotionFreeze, 'B2B rollout freeze must mirror rollout freeze');
    assert(['READY', 'BLOCKED'].includes(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.status), 'AI PLATE readiness status mismatch');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.decisionMode === 'premium-rollout-regime', 'AI PLATE readiness decision mode mismatch');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.contractApprovalRequired, 'AI PLATE contract approval must be required');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.complianceReviewRequired, 'AI PLATE compliance review must be required');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.humanReviewRequired, 'AI PLATE human review must be required');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.paymentVerificationRequired, 'AI PLATE payment verification must be required');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.downstreamSyncRequired, 'AI PLATE downstream sync must be required');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.rollbackPlanRequired, 'AI PLATE rollback plan must be required');
    assert(report.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.finopsGuardrailsRequired, 'AI PLATE FinOps guardrails must be required');
    assert(Number.isFinite(report.b2bReadiness.governanceDecisions.resolutionReadiness.rezolucijaScore), 'resolution readiness score must be finite');
    assert(report.b2bReadiness.governanceDecisions.semaFormulaGate.canonicalExpression === 'ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA', 'B2B formula expression mismatch');
    assert(['PASSED', 'BLOCKED'].includes(report.b2bReadiness.governanceDecisions.semaFormulaGate.status), 'B2B formula status mismatch');
    assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.every((warning) => warning.startsWith('DUET:') || warning.includes('Downstream sync') || warning.includes('Domain strategy') || warning.includes('Human review evidence') || warning.includes('Payment verification') || warning.includes('EXTREM profiler') || warning.includes('ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA') || warning.includes('Global licensing') || warning.includes('PROGRAMSKI JEZIK ') || warning.includes('VRH PROGRAMSKOG EKVILADENTA')), 'unexpected B2B warning format');
    assert(report.b2bReadiness.governanceDecisions.partnerReadinessWarnings.some((warning) => warning.includes('Human review evidence')), 'human review warning must be present');
    assert(report.b2bReadiness.globalLicensing.globalLicenseReadinessScore >= 0, 'global license readiness score mismatch');
    assert(report.b2bReadiness.globalLicensing.activityCoverageScore >= 0, 'activity coverage score mismatch');
    assert(report.b2bReadiness.globalLicensing.criticalGlobalGapCount >= 0, 'critical global gap count mismatch');
    assert(report.acceptanceCriteria.some((item) => item.id === 'b2b-scope' && item.passed), 'b2b-scope criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'github-enterprise-subscription-package' && item.passed), 'github-enterprise-subscription-package criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'ai-plate-enterprise-package' && item.passed), 'ai-plate-enterprise-package criterion must pass');
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

  await test('AI PLATE governance status follows evidence and payment gates', async () => {
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
      SPAJA_VERCEL_PAYMENT_REFERENCE_CLASSIFICATION: 'internal-only',
      SPAJA_VERCEL_PAYMENT_REFERENCE_PUBLIC_SAFE_APPROVED: 'false',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_REDACTED: 'true',
      SPAJA_VERCEL_PUBLIC_ANNOUNCEMENT_PUBLISHED: 'false',
    }, () => {
      const blockedReport = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        complianceReviewComplete: false,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
        rollbackPlanComplete: true,
      });
      assert(blockedReport.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.status === 'BLOCKED', 'AI PLATE should stay BLOCKED without compliance review evidence');
      assert(blockedReport.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.blockers.includes('compliance-review-complete'), 'AI PLATE compliance blocker missing');

      const rollbackBlockedReport = getExtrimliExtrondolReport({
        auditTrailComplete: true,
        complianceReviewComplete: true,
        downstreamSyncComplete: true,
        humanReviewComplete: true,
        onboardingComplete: true,
        rollbackPlanComplete: false,
      });
      assert(rollbackBlockedReport.paymentVerification.status === 'VERIFIED', 'AI PLATE rollback test requires verified payment');
      assert(rollbackBlockedReport.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.status === 'BLOCKED', 'AI PLATE should stay BLOCKED without rollback evidence');
      assert(rollbackBlockedReport.b2bReadiness.governanceDecisions.aiPlateEnterprisePackage.blockers.includes('rollback-plan-complete'), 'AI PLATE rollback blocker missing');
    });
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
    assert(report.startProject.mandatoryOutputs.includes('releaseAuditSummary.aiPlateEnterprisePackageGovernance'), 'AI PLATE release audit output missing');
    assert(report.startProject.mandatoryOutputs.includes('spajaKod.publicSignals.aiPlateEnterprisePackageStatus'), 'AI PLATE SPAJA KOD output missing');
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
    assert(report.startProject.downstreamSync.syncedContractFields.includes('b2bScope.subscriptionPackage.aiPlateEnterprisePackage'), 'AI PLATE subscription sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('b2bScope.unlimitedUseGuardrails'), 'B2B guardrails sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('paymentVerification'), 'payment verification sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler'), 'extrem profiler sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.businessLicensingSignals'), 'business licensing sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.resolutionReadiness'), 'resolution readiness sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('extremProfiler.semaMuSemaFormula'), 'formula sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('spajaKod.platformTrack'), 'SPAJAPRO public sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('releaseAuditSummary.aiPlateEnterprisePackageGovernance'), 'AI PLATE release audit sync missing');
    assert(report.startProject.downstreamSync.syncedContractFields.includes('spajaKod.publicSignals.aiPlateEnterprisePackageStatus'), 'AI PLATE SPAJA KOD sync missing');
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

  await test('privredni akt and missing governance evidence block payout readiness', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PRIVREDNI_AKT_Q1_PRICE_INDEX: 'NaN',
      EXTRIMLI_EXTREM_PRIVREDNI_AKT_Q2_PRICE_INDEX: 'Infinity',
      EXTRIMLI_EXTREM_PRIVREDNI_AKT_Q3_PRICE_INDEX: '-5',
      EXTRIMLI_EXTREM_PRIVREDNI_AKT_Q4_PRICE_INDEX: '10',
      EXTRONDOL_ROLLBACK_PLAN_COMPLETE: 'false',
      EXTRONDOL_HUMAN_REVIEW_COMPLETE: 'false',
      EXTRONDOL_COMPLIANCE_REVIEW_COMPLETE: 'false',
      EXTRONDOL_AUDIT_TRAIL_COMPLETE: 'false',
      EXTRONDOL_DOWNSTREAM_SYNC_COMPLETE: 'false',
      EXTRONDOL_PAYMENT_VERIFICATION_STATUS: 'PENDING',
    }, () => {
      const report = getExtrimliExtrondolReport();
      assert(report.developerAndCreateRepoWideReflection.payoutGovernance.payoutReadinessStatus === 'BLOCKED', 'blocked privredni akt quarterly signal and missing governance evidence must block payout readiness');
      assert(report.developerAndCreateRepoWideReflection.payoutGovernance.privredniAktQuarterlyMarketStatus === 'BLOCKED', 'blocked privredni akt quarterly signal must be reflected in payout governance');
      assert(report.developerAndCreateRepoWideReflection.payoutGovernance.blockerReasons.includes('privredni-akt-quarterly-market-blocked'), 'privredni akt quarterly market blocker must propagate');
      assert(report.developerAndCreateRepoWideReflection.payoutGovernance.blockerReasons.includes('rollback-plan-required'), 'rollback-plan blocker must propagate');
      assert(report.developerAndCreateRepoWideReflection.payoutGovernance.blockerReasons.includes('payment-verification-required'), 'payment-verification blocker must propagate');
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
