import {
  EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  EXTRIMLI_EXTREM_SPAJINO_PROPORCIONALNO_PROGRAMIRANJE_UNIVERZITET_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
  EXTRIMLI_EXTREM_ZELEZARA_PRETPLATA_IDENTITY_CONTRACT_VERSION,
  getExtrimliExtremProfilerReport,
} from '../../lib/extrimli-extrem';

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

async function withEnv(overrides: Record<string, string | undefined>, fn: () => Promise<void> | void): Promise<void> {
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
  console.log('\n🔗 [extrimli-extrem] profiler contract tests\n');

  await test('contract constants are stable', () => {
    assert(EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION === 'v1-extrem-profiler', `unexpected contract: ${EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION}`);
    assert(EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION === '1.0.0', `unexpected module: ${EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION}`);
    assert(EXTRIMLI_EXTREM_PROFILER_PERSONA_ID === 'extrimli-extrem-profiler-core', `unexpected persona: ${EXTRIMLI_EXTREM_PROFILER_PERSONA_ID}`);
    assert(EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH === '/api/extrimli/extrem', `unexpected source: ${EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH}`);
  });

  await test('default report exposes DISKVIT terminology and bounded conflict score', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.terminology.diskvitRole === 'browser-graphics-bottleneck-layer', 'DISKVIT role mismatch');
    assert(report.terminology.conflictModel === 'conflict-proportional', 'conflict model mismatch');
    assert(report.profile.bottleneckLayer === 'DISKVIT', 'bottleneck layer mismatch');
    assert(Number.isFinite(report.profile.conflictScore), 'conflict score must be finite');
    assert(report.profile.conflictScore >= 0 && report.profile.conflictScore <= 100, 'conflict score must be in [0,100]');
    assert(report.kpiObserved.withinTargets, 'default profile should be within KPI targets');
    assert(
      report.governanceSignal.freezeRequired === report.businessLicensingSignals.freezeRequired,
      'governance freeze should mirror business licensing freeze signal',
    );
    assert(report.businessLicensingSignals.activityCoverageScore >= 0, 'business activity coverage score should be bounded');
    assert(report.businessLicensingSignals.globalLicenseReadinessScore >= 0, 'business licensing readiness score should be bounded');
    assert(report.businessLicensingSignals.criticalGlobalGapCount >= 0, 'business licensing critical gap count should be available');
    assert(report.versionRoadmap.contractVersion === 'v1-7-roadmap', 'roadmap contract mismatch');
    assert(report.versionRoadmap.developerCreateLock.additiveOnly, 'developer/create lock must remain additive-only');
    assert(report.versionRoadmap.developerCreateLock.sourceProgramDoc === 'docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md', 'developer/create program doc mismatch');
    assert(report.roadmapAlignment.primaryVersion === 'Verzija 4', 'EXTREM should align to Verzija 4');
  });

  await test('default report exposes Developer/Create lock through the shared roadmap', () => {
    const report = getExtrimliExtremProfilerReport();
    const lock = report.versionRoadmap.developerCreateLock;
    assert(lock.sourceOfTruthRoutes.join(',') === '/api/extrimli/extrem,/api/extrimli/extrondol', 'developer/create source-of-truth routes mismatch');
    assert(lock.lockedCoreArtifacts.includes('src/lib/extrimli-extrem/**'), 'locked EXTREM core artifact missing');
    assert(lock.lockedCoreArtifacts.includes('src/tests/lib/extrimli-extrondol.test.ts'), 'locked EXTRONDOL test artifact missing');
    assert(lock.ownershipBoundary.extrimli === 'base-runtime-domain', 'EXTRIMLI ownership boundary mismatch');
    assert(lock.ownershipBoundary.extrem === 'technical-signal-and-profiler', 'EXTREM ownership boundary mismatch');
    assert(lock.ownershipBoundary.extrondol === 'wawe-orchestration-audit-freeze-promotion', 'EXTRONDOL ownership boundary mismatch');
    assert(lock.ownershipBoundary.dok === 'EXTREM' && lock.ownershipBoundary.dak === 'EXTRONDOL', 'DOK/DAK ownership split mismatch');
    assert(lock.driftZeroLayers.join(',') === 'docs,types,routes,tests,workflows', 'developer/create drift-zero layers mismatch');
    assert(lock.realizationSequence.join(',') === 'documentation-lock-and-roadmap,type-contract-alignment,route-and-health-outputs,test-and-governance-conformance,downstream-sync-and-public-summary', 'developer/create realization sequence mismatch');
    assert(lock.definitionOfDone.docsTypesRoutesTestsWorkflowsAligned, 'developer/create DoD alignment must be required');
    assert(lock.definitionOfDone.securityRequired && lock.definitionOfDone.rollbackRequired, 'developer/create DoD security/rollback requirements missing');
  });

  await test('default report normalizes REZOLUCIJA/EKODOR/REKULITI PO RAULETU/DISCAN/KIBEN vocabulary', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.terminology.normalizedVocabulary.REZOLUCIJA.meaning === 'resolution-readiness-dimension', 'REZOLUCIJA meaning mismatch');
    assert(report.terminology.normalizedVocabulary.EKODOR.canonicalField === 'resolutionReadiness.ekodorState', 'EKODOR field mismatch');
    assert(report.terminology.normalizedVocabulary['REKULITI PO RAULETU'].meaning === 'resolution-routing-policy', 'REKULITI meaning mismatch');
    assert(report.terminology.normalizedVocabulary.DISCAN.canonicalField === 'resolutionInput.discanPressurePercent', 'DISCAN field mismatch');
    assert(report.terminology.normalizedVocabulary.KIBEN.canonicalField === 'resolutionReadiness.kibenLane', 'KIBEN field mismatch');
    assert(report.resolutionReadiness.kibenLane === 'KIBEN', 'KIBEN lane mismatch');
    assert(report.resolutionReadiness.rezolucijaScore >= EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY, 'default REZOLUCIJA should be ready');
    assert(report.resolutionReadiness.ekodorState === 'ALIGNED', 'default EKODOR should be aligned');
    assert(report.resolutionReadiness.discanInKibenState === 'CLEAR', 'default DISCAN in KIBEN should be clear');
    assert(report.resolutionReadiness.rekulitiPoRauletu === 'ALLOW', 'default REKULITI policy should allow progression');
  });

  await test('default report exposes objektno orijentisana prongilacija as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.objektnoOrijentisanaProngilacija.term === 'Objektno orijentisana prongilacija', 'object-oriented prongilacija term mismatch');
    assert(report.objektnoOrijentisanaProngilacija.contractVersion === EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_PRONGILACIJA_CONTRACT_VERSION, 'object-oriented prongilacija contract mismatch');
    assert(report.objektnoOrijentisanaProngilacija.sourceOfTruth === '/api/extrimli/extrem', 'object-oriented prongilacija source mismatch');
    assert(report.objektnoOrijentisanaProngilacija.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD', 'scope lock mismatch');
    assert(report.objektnoOrijentisanaProngilacija.domainModel.domainObjects.length === 3, 'domain objects should be locked');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.objektnoOrijentisanaProngilacija.readiness.status), 'unexpected object-oriented prongilacija status');
    assert(Number.isFinite(report.objektnoOrijentisanaProngilacija.readiness.score), 'object-oriented prongilacija score must be finite');
  });

  await test('default report exposes FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.funkcinalnoProgramiranjeEnergetskogMisaonogToka;
    assert(signal.term === 'FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA', 'functional energy-flow term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_FUNKCINALNO_PROGRAMIRANJE_ENERGETSKOG_MISAONOG_TOKA_CONTRACT_VERSION, 'functional energy-flow contract mismatch');
    assert(signal.sourceOfTruth === '/api/extrimli/extrem', 'functional energy-flow source mismatch');
    assert(signal.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD', 'functional energy-flow scope lock mismatch');
    assert(signal.ownershipModel.extrem === 'technical-functional-energy-signal', 'functional energy-flow EXTREM ownership mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected functional energy-flow status');
    assert(Number.isFinite(signal.readiness.score), 'functional energy-flow score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'functional energy-flow score must be bounded');
  });

  await test('default report exposes exact-string locked FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.funkcionalnoProgramiranjeUzvisenogMisanogToka;
    assert(signal.term === 'FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA', 'elevated thought-flow term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_UZVISENOG_MISANOG_TOKA_CONTRACT_VERSION, 'elevated thought-flow contract mismatch');
    assert(signal.sourceOfTruth === '/api/extrimli/extrem', 'elevated thought-flow source mismatch');
    assert(signal.meaningLock.spellingDecision === 'exact-user-term-locked', 'elevated thought-flow spelling lock mismatch');
    assert(signal.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD', 'elevated thought-flow scope lock mismatch');
    assert(signal.ownershipModel.extrem === 'technical-elevated-thought-signal', 'elevated thought-flow EXTREM ownership mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected elevated thought-flow status');
    assert(Number.isFinite(signal.readiness.score), 'elevated thought-flow score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'elevated thought-flow score must be bounded');
  });

  await test('default report exposes FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.funkcionalnoProgramiranjeEksplicitnogMisaonogToka;
    assert(signal.term === 'FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA', 'explicit thought-flow term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_EKSPLICITNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'explicit thought-flow contract mismatch');
    assert(signal.sourceOfTruth === '/api/extrimli/extrem', 'explicit thought-flow source mismatch');
    assert(signal.meaningLock.spellingDecision === 'exact-user-term-locked', 'explicit thought-flow spelling lock mismatch');
    assert(signal.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD', 'explicit thought-flow scope lock mismatch');
    assert(signal.ownershipModel.extrem === 'technical-explicit-thought-signal', 'explicit thought-flow EXTREM ownership mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected explicit thought-flow status');
    assert(Number.isFinite(signal.readiness.score), 'explicit thought-flow score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'explicit thought-flow score must be bounded');
  });
  await test('default report exposes FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.funkcionalnoProgramiranjePravednogMisaonogToka;
    assert(signal.term === 'FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA', 'fair thought-flow term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_FUNKCIONALNO_PROGRAMIRANJE_PRAVEDNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'fair thought-flow contract mismatch');
    assert(signal.sourceOfTruth === '/api/extrimli/extrem', 'fair thought-flow source mismatch');
    assert(signal.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD', 'fair thought-flow scope lock mismatch');
    assert(signal.meaningLock.spellingDecision === 'exact-user-term-locked', 'fair thought-flow spelling lock mismatch');
    assert(signal.ownershipModel.extrem === 'technical-fair-thought-signal', 'fair thought-flow EXTREM ownership mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected fair thought-flow status');
    assert(Number.isFinite(signal.readiness.score), 'fair thought-flow score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'fair thought-flow score must be bounded');
  });

  await test('default report exposes FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.funkionalnoProgramiranjePravnogMisaonogToka;
    assert(signal.term === 'FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA', 'legal-functional term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_FUNKIONALNO_PROGRAMIRANJE_PRAVNOG_MISAONOG_TOKA_CONTRACT_VERSION, 'legal-functional contract mismatch');
    assert(signal.sourceOfTruth === '/api/extrimli/extrem', 'legal-functional source mismatch');
    assert(signal.scopeLock.join(',') === 'EXTRIMLI,EXTREM,EXTRONDOL,SPAJA KOD', 'legal-functional scope lock mismatch');
    assert(signal.meaningLock.spellingDecision === 'exact-user-term-locked', 'legal-functional spelling lock mismatch');
    assert(signal.ownershipModel.extrem === 'technical-legal-reasoning-signal', 'legal-functional EXTREM ownership mismatch');
    assert(signal.legalCoupling.sourceTrack === 'KRALJEVSKI PRAVNI UNIVERZITET', 'legal-functional legal track mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected legal-functional status');
    assert(Number.isFinite(signal.readiness.score), 'legal-functional score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'legal-functional score must be bounded');
  });

  await test('default report exposes METRIČKO PROGRAMIRANJE as additive EXTREM signal with DOK/DIK technical ownership', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.metrikoProgramiranje;
    assert(signal.term === 'METRIČKO PROGRAMIRANJE', 'metric programming term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_CONTRACT_VERSION, 'metric programming contract mismatch');
    assert(signal.sourceOfTruth === '/api/extrimli/extrem', 'metric programming source mismatch');
    assert(signal.declarationMatrix.dokEvidence.kind === 'DOK PETLJA', 'metric programming must bind DOK evidence');
    assert(signal.instancePositioning.dikEvidence.kind === 'DIK PETLJA', 'metric programming must bind DIK evidence');
    assert(signal.ownershipEvidence.dakDeferredToGovernance, 'metric programming must defer DAK to governance');
    assert(signal.ownershipEvidence.dukDeferredToGovernance, 'metric programming must defer DUK to governance');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected metric programming status');
    assert(Number.isFinite(signal.readiness.score), 'metric programming score must be finite');
    assert(report.acceptanceCriteria.some((item) => item.id === 'metriko-programiranje-track' && item.passed), 'metric programming acceptance criterion must pass');
  });

  await test('default report exposes PROPORCIONALNO PROGRAMIRANJE as additive language-innovation EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.proporcionalnoProgramiranje;
    assert(signal.term === 'PROPORCIONALNO PROGRAMIRANJE', 'proportional programming term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_PROPORCIONALNO_PROGRAMIRANJE_CONTRACT_VERSION, 'proportional programming contract mismatch');
    assert(signal.meaningLock.interpretation === 'INOVACIJA PROGRAMSKIH JEZIKA', 'proportional programming interpretation mismatch');
    assert(signal.ownershipModel.extrem === 'technical-paradigm-merge-signal', 'proportional programming EXTREM ownership mismatch');
    assert(signal.subSignals.protkrovFunkcija.term === 'PROTKROV FUNKCIJA', 'PROTKROV FUNKCIJA term mismatch');
    assert(signal.subSignals.objektneParadoksalneEtape.term === 'OBJEKTNE PARADOKSALNE ETAPE', 'OBJEKTNE PARADOKSALNE ETAPE term mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected proportional programming status');
    assert(Number.isFinite(signal.readiness.score), 'proportional programming score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'proportional programming score must be bounded');
  });

  await test('METRIČKO PROGRAMIRANJE degrades safely on invalid and low posture inputs', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_DECLARATION_MATRIX_PERCENT: '-10',
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_NEUTRAL_DECLARATION_POSTURE_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_INSTANCE_POSITIONING_PERCENT: '0',
      EXTRIMLI_EXTREM_METRICKO_PROGRAMIRANJE_ACCENT_COUPLING_PERCENT: 'Infinity',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.metrikoProgramiranje.readiness.status === 'BLOCKED', 'metric programming should block on degraded low posture');
      assert(report.metrikoProgramiranje.readiness.degraded, 'metric programming should mark degraded posture');
      assert(report.governanceSignal.freezeRequired, 'metric programming blocker should freeze governance progression');
      assert(report.degradedSources.some((source) => source.startsWith('metriko-programiranje:')), 'metric programming degraded source should be recorded');
    });
  });

  await test('default report exposes SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET as additive university sub-track', () => {
    const report = getExtrimliExtremProfilerReport();
    const signal = report.spajinoProporcionalnoProgramiranjeUniverzitet;
    assert(signal.term === 'SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET', 'university track term mismatch');
    assert(signal.contractVersion === EXTRIMLI_EXTREM_SPAJINO_PROPORCIONALNO_PROGRAMIRANJE_UNIVERZITET_CONTRACT_VERSION, 'university track contract mismatch');
    assert(signal.parentTrack === 'PROPORCIONALNO PROGRAMIRANJE', 'university parent track mismatch');
    assert(signal.canonicalNarrativeTitle === 'Spreg funkcionalnog i objektno programiranja sa mnoštvo novih petlji', 'university narrative title mismatch');
    assert(signal.parentCoupling.petljeContract === 'EXTRIMLI EXTRONDOL EXTREM PETLJE', 'university petlje coupling mismatch');
    assert(signal.parentCoupling.noNewPublicRoute === true, 'university track must not create a new route');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'unexpected university track status');
    assert(Number.isFinite(signal.readiness.score), 'university track score must be finite');
    assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'university track score must be bounded');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajino-proporcionalno-programiranje-univerzitet-lock' && item.passed), 'university track lock criterion must pass');
  });

  await test('default report exposes objektno orijentisana reprodukcija as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.objektnoOrijentisanaReprodukcija.term === 'Objektno orijentisana reprodukcija', 'object-oriented reproduction term mismatch');
    assert(report.objektnoOrijentisanaReprodukcija.contractVersion === EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTISANA_REPRODUKCIJA_CONTRACT_VERSION, 'object-oriented reproduction contract mismatch');
    assert(report.objektnoOrijentisanaReprodukcija.reproductionModel.checkpoints.length === 5, 'reproduction checkpoints should be locked');
    assert(report.objektnoOrijentisanaReprodukcija.reproductionModel.checkpoints.every((item) => item.auditSafe), 'reproduction checkpoints must stay audit-safe');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.objektnoOrijentisanaReprodukcija.readiness.status), 'unexpected object-oriented reproduction status');
    assert(Number.isFinite(report.objektnoOrijentisanaReprodukcija.readiness.score), 'object-oriented reproduction score must be finite');
  });

  await test('default report exposes objektno orijentusano uzdizanje epskih elikvadenata as additive EXTREM signal', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(
      report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.term === 'Objektno orijentusano uzdizanje epskih elikvadenata',
      'epic elikvadenti term mismatch',
    );
    assert(
      report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.contractVersion === EXTRIMLI_EXTREM_OBJEKTNO_ORIJENTUSANO_UZDIZANJE_EPSKIH_ELIKVADENATA_CONTRACT_VERSION,
      'epic elikvadenti contract mismatch',
    );
    assert(report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.controlledEquivalents.entities.length === 3, 'epic elikvadenti must expose 3 controlled equivalents');
    assert(report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.controlledEquivalents.entities.every((item) => item.auditSafe), 'epic elikvadenti entities must stay audit-safe');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status), 'unexpected epic elikvadenti status');
  });

  await test('default report exposes KRALJEVSKI PRAVNI UNIVERZITET track as additive legal-governance signal', () => {
    const report = getExtrimliExtremProfilerReport();
    const track = report.kraljevskiPravniUniverzitetTrack;
    assert(track.trackId === 'extrimli-kraljevski-pravni-univerzitet', 'track id mismatch');
    assert(track.classification === 'legal-governance-track', 'track classification mismatch');
    assert(track.technicalSourceOfTruth === '/api/extrimli/extrem', 'technical source mismatch');
    assert(track.governanceSourceOfTruth === '/api/extrimli/extrondol', 'governance source mismatch');
    assert(track.publicBoundary === '/api/extrimli/spaja-kod', 'public boundary mismatch');
    assert(track.documentationBoundary.sourceMaterialPolicy === 'documentation-only', 'source material policy mismatch');
    assert(track.documentationBoundary.primaryContentGap.topic === 'POVELJA O ZAKONODAVNOM PRAVU', 'primary content gap mismatch');
    assert(track.documentationBoundary.primaryContentGap.status === 'COMPLETED', 'primary content gap status mismatch');
    assert(track.vocabulary.length === 6, 'expected six canonical vocabulary entries');
    assert(
      track.vocabulary.map((entry) => entry.term).join(',') === 'KRALJEVSKI PRAVNI UNIVERZITET,KRALJEVSKA POLITIKA,NIKOLA SPAJIĆ,ZAKON SILNOG,POVELJA O ZAKONODAVNOM PRAVU,PRAVNI POREDAK PO PRAVU GRAĐANSTVA',
      'canonical vocabulary mismatch',
    );
    assert(track.structuredSignals.charterCompleteness.status === 'READY', 'charter completeness mismatch');
    assert(track.structuredSignals.legislativeAuthorityDefinition.status === 'READY', 'legislative authority mismatch');
    assert(track.structuredSignals.citizenshipOrderPrinciples.status === 'READY', 'citizenship-order principles mismatch');
    assert(track.neutralRuleSet.evidenceRequiredBeforeEscalation.length >= 3, 'evidence requirements must be defined');
    assert(track.neutralRuleSet.unlawfulCivicManeuvers.length >= 1, 'unlawful civic maneuvering rules must be defined');
    assert(track.readiness.status === 'READY', 'default track should be READY');
    assert(track.readiness.completenessScore === 100, 'default completeness score mismatch');
    assert(track.readiness.consistencyScore === 100, 'default consistency score mismatch');
    assert(track.readiness.conflictScore >= 0 && track.readiness.conflictScore <= 100, 'conflict score must be bounded');
    assert(report.acceptanceCriteria.some((item) => item.id === 'kraljevski-pravni-univerzitet-track-lock' && item.passed), 'track lock criterion must pass');
  });

  await test('default report exposes Železara pretplata identity track with locked alias and public-boundary rules', () => {
    const report = getExtrimliExtremProfilerReport();
    const track = report.zelezaraPretplataIdentityTrack;
    assert(track.trackId === 'extrimli-zelezara-pretplata-identity', 'Železara track id mismatch');
    assert(track.contractVersion === EXTRIMLI_EXTREM_ZELEZARA_PRETPLATA_IDENTITY_CONTRACT_VERSION, 'Železara track contract mismatch');
    assert(track.technicalSourceOfTruth === '/api/extrimli/extrem', 'Železara technical source mismatch');
    assert(track.governanceSourceOfTruth === '/api/extrimli/extrondol', 'Železara governance source mismatch');
    assert(track.publicBoundary === '/api/extrimli/spaja-kod', 'Železara public boundary mismatch');
    assert(track.subscriberIdentity.canonicalLegalName === 'Železara d.o.o. Smederevo', 'canonical legal name mismatch');
    assert(track.subscriberIdentity.legacyReturnName === 'Železara', 'legacy return name mismatch');
    assert(track.subscriberIdentity.allowedAliases.includes('HBIS') && track.subscriberIdentity.allowedAliases.includes('Hibis'), 'HBIS/Hibis aliases missing');
    assert(track.subscriberIdentity.singleClientInterpretation, 'single-client rule must stay enabled');
    assert(track.readiness.restoreOldNameRequired, 'restore-old-name requirement must stay enabled');
    assert(track.readiness.status === 'READY', 'default Železara track should be READY');
    assert(report.spajaKodEncapsulation.publicSignals.includes('zelezara-pretplata-identity-status'), 'SPAJA KOD signal missing');
    assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-pretplata-identity-track-lock' && item.passed), 'Železara track lock criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-pretplata-single-client-rule' && item.passed), 'Železara single-client criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-pretplata-legacy-return-rule' && item.passed), 'Železara legacy return criterion must pass');
  });

  await test('Železara pretplata identity track blocks when legacy return name is not restored', async () => {
    await withEnv({
      EXTRIMLI_ZELEZARA_RESTORE_OLD_NAME_COMPLETED: 'false',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      const track = report.zelezaraPretplataIdentityTrack;
      assert(track.readiness.status === 'BLOCKED', 'Železara track should block when legacy name is not restored');
      assert(track.readiness.blockerReasons.some((reason) => reason.includes('Železara is not restored')), 'restore-old-name blocker must be present');
      assert(report.degradedSources.includes('zelezara-pretplata-identity:blocked'), 'degraded source should include blocked Železara identity track');
      assert(report.acceptanceCriteria.some((item) => item.id === 'zelezara-pretplata-legacy-return-rule' && !item.passed), 'legacy return criterion should fail');
    });
  });

  await test('KRALJEVSKI PRAVNI UNIVERZITET track keeps locked EXTREM, EXTRONDOL, and SPAJA KOD boundaries', () => {
    const track = getExtrimliExtremProfilerReport().kraljevskiPravniUniverzitetTrack;
    assert(track.technicalSourceOfTruth === '/api/extrimli/extrem', 'technical source boundary drifted');
    assert(track.governanceSourceOfTruth === '/api/extrimli/extrondol', 'governance source boundary drifted');
    assert(track.publicBoundary === '/api/extrimli/spaja-kod', 'public boundary drifted');
  });

  await test('default report confirms canonical ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA formula', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.semaMuSemaFormula.canonicalExpression === EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION, 'canonical formula mismatch');
    assert(report.semaMuSemaFormula.formulaHolds, 'default formula should hold');
    assert(report.semaMuSemaFormula.status === 'PASSED', 'default formula status should be PASSED');
    assert(report.semaMuSemaFormula.inputSubstitutions.length === 0, 'default formula should not use substitutions');
    assert(report.semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_CONFIRMED', 'default MUŠEMA conclusion should be confirmed');
    assert(report.versionRoadmap.versions.length === 7, 'roadmap should publish seven versions');
    assert(report.versionRoadmap.sharedPrinciples.some((item) => item.id === 'additive-only-expansion'), 'additive-only roadmap principle missing');
  });

  await test('default report exposes additive PETLJE technical signals with locked ownership boundary', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.petljeSignals.term === 'EXTRIMLI EXTRONDOL EXTREM PETLJE', 'petlje term mismatch');
    assert(report.petljeSignals.sourceOfTruth === '/api/extrimli/extrem', 'petlje source mismatch');
    assert(report.petljeSignals.contractBoundary.standaloneDirektModulePreserved, 'standalone DIREKT module must remain preserved');
    assert(report.petljeSignals.contractBoundary.direktPetljaMode === 'separate-loop-contract', 'DIREKT PETLJA mode mismatch');
    assert(report.petljeSignals.signals.length === 19, 'expected nineteen petlje signals');
    assert(report.petljeSignals.signals.every((signal) => signal.runner === 'canonical-petlja'), 'petlje signals must stay on canonical runners');
    assert(report.petljeSignals.signals.every((signal) => signal.readinessScore >= 0 && signal.readinessScore <= 100), 'petlje readiness scores must be bounded');
    assert(report.petljeSignals.signals.every((signal) => signal.conflictScore >= 0 && signal.conflictScore <= 100), 'petlje conflict scores must be bounded');
    const expectedKinds = [
      'DJUPRE PETLJA',
      'DOMPRE PETLJA',
      'KRUMPE PETLJA',
      'DOMBRE PETLJA',
      'OMBA PETLJA',
      'DOKSI PETLJA',
      'DOMBRA PETLJA',
      'DOKON PETLJA',
      'DUMPIR PETLJA',
      'DOMBAR PETLJA',
      'ZUMBA PETLJA',
      'DONKI PETLJA',
      'DOMPOR PETLJA',
      'DOK PETLJA',
      'DIK PETLJA',
      'SAR PETLJA',
      'OKRED PETLJA',
      'DIREKT PETLJA',
      'INDIREKT PETLJA',
    ];
    assert(expectedKinds.every((kind) => report.petljeSignals.signals.some((signal) => signal.kind === kind)), 'all petlje kinds should be present');
    assert(report.acceptanceCriteria.some((item) => item.id === 'petlje-contract-boundary-lock' && item.passed), 'petlje contract criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'petlje-signal-normalization' && item.passed), 'petlje normalization criterion must pass');
  });

  await test('PETLJE sequence env degrades safely without breaking EXTREM payload', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PETLJE_INDIREKT_SEQUENCE: '1,NaN,3',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.petljeSignals.signals.find((signal) => signal.kind === 'INDIREKT PETLJA')?.input.sequence?.join(',') === '2,6,8,10', 'invalid sequence should fall back to canonical values');
      assert(report.degradedSources.includes('extrimli_extrem_petlje_indirekt_sequence-invalid'), 'invalid petlje env must be tracked as degraded');
    });
  });

  await test('SPAJA KOD encapsulation hides raw EXTREM pattern details and keeps public readiness stable', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.spajaKodEncapsulation.surfaceName === 'SPAJA KOD', 'SPAJA KOD surface mismatch');
    assert(report.spajaKodEncapsulation.contractVersion === 'v1-spaja-kod', 'SPAJA KOD contract mismatch');
    assert(report.spajaKodEncapsulation.rawPatternVisibility === 'HIDDEN', 'raw pattern must stay hidden');
    assert(report.spajaKodEncapsulation.exposurePolicy.exposesRawPatternModel === false, 'raw pattern exposure must be disabled');
    assert(report.spajaKodEncapsulation.exposurePolicy.exposesFormulaInternals === false, 'formula internals must be hidden');
    assert(report.spajaKodEncapsulation.exposurePolicy.exposesInternalSignalInputs === false, 'internal signal inputs must be hidden');
    assert(report.spajaKodEncapsulation.exposurePolicy.exposesOnlySystemSignals === true, 'public facade must expose only system signals');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.spajaKodEncapsulation.readiness.status), 'unexpected SPAJA KOD readiness status');
    assert(['ALLOW', 'WARN', 'FREEZE'].includes(report.spajaKodEncapsulation.readiness.governanceOutcome), 'unexpected SPAJA KOD governance outcome');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spaja-kod-encapsulation' && item.passed), 'SPAJA KOD acceptance criterion must pass');
  });

  await test('SPAJAPRO track stays additive, ordered, and EXTREM-controlled for freeze decisions', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.spajaproTrack.vocabulary.platformName === 'SPAJAPRO', 'SPAJAPRO platform name mismatch');
    assert(report.spajaproTrack.vocabulary.platformMode === 'platforma-umesto-chatgpt', 'SPAJAPRO mode mismatch');
    assert(report.spajaproTrack.vocabulary.layering === 'extends-existing-extrimli-stack', 'SPAJAPRO layering mismatch');
    assert(
      report.spajaproTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'ODIT,DEKER,DUNOR,SUMOR,OKET,DAKOR,EKSER,DOKER,DUKAR,DONAR,KODER',
      'SPAJAPRO token order mismatch',
    );
    assert(report.spajaproTrack.technicalSignalEngine === 'EXTREM', 'SPAJAPRO technical engine mismatch');
    assert(report.spajaproTrack.governanceConsumer === 'EXTRONDOL', 'SPAJAPRO governance consumer mismatch');
    assert(report.spajaproTrack.publicBoundary === 'SPAJA KOD', 'SPAJAPRO public boundary mismatch');
    assert(report.spajaproTrack.internalOnlyMapping, 'SPAJAPRO mapping should stay internal in EXTREM');
    assert(report.spajaproTrack.freezeControlledByExtrem === report.governanceSignal.freezeRequired, 'SPAJAPRO freeze control mismatch');
    assert(
      report.spajaproTrack.activeTokenStates.map((item) => item.token).join(',') === 'ODIT,DEKER,DUNOR,OKET',
      'SPAJAPRO EXTREM active tokens mismatch',
    );
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajapro-terminology-lock' && item.passed), 'SPAJAPRO terminology criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'spajapro-extrem-freeze-independence' && item.passed), 'SPAJAPRO freeze independence criterion must pass');
  });

  await test('DOKER/KURAT/IZEK/DOKAR track stays additive and EXTREM-owned', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(
      report.dokerKuratIzekDokarTrack.vocabulary.tokenSequence.map((item) => item.token).join(',') === 'DOKER,KURAT,IZEK,DOKAR',
      'quartet token order mismatch',
    );
    assert(report.dokerKuratIzekDokarTrack.vocabulary.tokenSequence[0].signalRole === 'downstream-sync', 'DOKER meaning changed');
    assert(report.dokerKuratIzekDokarTrack.technicalSignalEngine === 'EXTREM', 'quartet EXTREM ownership mismatch');
    assert(report.dokerKuratIzekDokarTrack.governanceConsumer === 'EXTRONDOL', 'quartet governance consumer mismatch');
    assert(report.dokerKuratIzekDokarTrack.freezeControlledByExtrem === report.governanceSignal.freezeRequired, 'quartet freeze mismatch');
    assert(report.acceptanceCriteria.some((item) => item.id === 'doker-kurat-izek-dokar-overlay-lock' && item.passed), 'quartet lock criterion must pass');
    assert(report.acceptanceCriteria.some((item) => item.id === 'doker-kurat-izek-dokar-extrem-freeze' && item.passed), 'quartet freeze criterion must pass');
  });

  await test('DOK/DIK/DAK/DUK consistency health preserves EXTREM vs EXTRONDOL ownership boundary', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.dokDikDakDukConsistencyHealth.sourceOfTruth === '/api/extrimli/extrem', 'consistency source mismatch');
    assert(report.dokDikDakDukConsistencyHealth.scopeLock.join(',') === 'DOK,DIK,DAK,DUK', 'scope lock mismatch');
    assert(report.dokDikDakDukConsistencyHealth.ownershipBoundary.dok === 'EXTREM', 'DOK ownership mismatch');
    assert(report.dokDikDakDukConsistencyHealth.ownershipBoundary.dik === 'EXTREM', 'DIK ownership mismatch');
    assert(report.dokDikDakDukConsistencyHealth.ownershipBoundary.dak === 'EXTRONDOL', 'DAK ownership mismatch');
    assert(report.dokDikDakDukConsistencyHealth.ownershipBoundary.duk === 'EXTRONDOL', 'DUK ownership mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dok.kind === 'DOK PETLJA', 'DOK signal kind mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dik.kind === 'DIK PETLJA', 'DIK signal kind mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.dak.token === 'DAKOR', 'DAK token mismatch');
    assert(report.dokDikDakDukConsistencyHealth.signals.duk.token === 'DUKAR', 'DUK token mismatch');
    const signalStatuses = [
      report.dokDikDakDukConsistencyHealth.signals.dok.status,
      report.dokDikDakDukConsistencyHealth.signals.dik.status,
      report.dokDikDakDukConsistencyHealth.signals.dak.status,
      report.dokDikDakDukConsistencyHealth.signals.duk.status,
    ];
    if (report.dokDikDakDukConsistencyHealth.status === 'READY') {
      assert(signalStatuses.filter((status): status is 'READY' | 'WATCH' | 'BLOCKED' => status !== null).every((status) => status === 'READY'), 'READY consistency status requires all resolved component signals to be READY');
    }
    assert(report.dokDikDakDukConsistencyHealth.consistent, 'consistency health should be consistent');
    assert(report.acceptanceCriteria.some((item) => item.id === 'dok-dik-dak-duk-consistency-health' && item.passed), 'consistency acceptance criterion must pass');
  });

  await test('Mobilna linija exposes mandatory installation messages and package hint', () => {
    const report = getExtrimliExtremProfilerReport();
    assert(report.mobilnaLinija.contractVersion === EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION, 'mobilna contract version mismatch');
    assert(report.mobilnaLinija.input.lineType === 'Mobilna linija', 'mobilna line type mismatch');
    assert(report.mobilnaLinija.installationMessages.required, 'mobilna installation messages must be required');
    assert(report.mobilnaLinija.installationMessages.messages.length >= 3, 'mobilna installation messages must contain guidance');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(report.mobilnaLinija.installationMessages.status), 'invalid installation status');
    assert(['BASIC', 'SMART', 'PRO', 'NONE'].includes(report.mobilnaLinija.packagePlanHint.recommendedPlanTier), 'invalid package hint tier');
    assert(report.acceptanceCriteria.some((item) => item.id === 'mobilna-linija-installation-contract' && item.passed), 'mobilna acceptance criterion must pass');
  });

  await test('Mobilna linija blocks installation when device is missing/unsupported', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: '',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: '',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: 'Infinity',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.mobilnaLinija.deviceCompatibility.compatible === false, 'unsupported device should be incompatible');
      assert(report.mobilnaLinija.deviceCompatibility.status === 'BLOCKED', 'device status should be BLOCKED');
      assert(report.mobilnaLinija.installationMessages.status === 'BLOCKED', 'installation status should be BLOCKED');
      assert(report.mobilnaLinija.installationMessages.missingFields.includes('deviceType'), 'missing deviceType must be reported');
      assert(report.mobilnaLinija.installationMessages.missingFields.includes('deviceModel'), 'missing deviceModel must be reported');
      assert(report.degradedSources.some((item) => item.includes('mobilna-linija')), 'mobilna degraded markers should be present');
      assert(report.governanceSignal.freezeRequired, 'mobilna installation block should freeze governance');
    });
  });

  await test('objektno orijentisana prongilacija degrades safely without forcing EXTREM freeze on invalid object-state inputs', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_OBJECT_STATE_INTEGRITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_METHOD_BEHAVIOR_COHESION_PERCENT: '10',
      EXTRIMLI_EXTREM_DELEGATION_COVERAGE_PERCENT: '20',
      EXTRIMLI_EXTREM_COMPOSITION_COVERAGE_PERCENT: '30',
      EXTRIMLI_EXTREM_INSTANCE_CLARITY_PERCENT: 'Infinity',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.objektnoOrijentisanaProngilacija.readiness.status === 'BLOCKED', 'object-oriented prongilacija should block on invalid/low inputs');
      assert(report.objektnoOrijentisanaProngilacija.readiness.degraded, 'invalid object-oriented prongilacija inputs should degrade safely');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_OBJECT_STATE_INTEGRITY_PERCENT'), 'invalid object state input should be tracked');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_INSTANCE_CLARITY_PERCENT'), 'invalid instance clarity input should be tracked');
      assert(
        report.objektnoOrijentisanaProngilacija.readiness.blockerReasons.length >= 1,
        'blocked object-oriented prongilacija should keep blocker reasons on the additive signal',
      );
      assert(report.acceptanceCriteria.some((item) => item.id === 'objektno-orijentisana-prongilacija-lock' && item.passed), 'object-oriented prongilacija lock criterion must pass');
    });
  });

  await test('objektno orijentisana reprodukcija degrades safely and blocks deterministic replay readiness on invalid inputs', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_OBJECT_STATE_REPRODUCIBILITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_METHOD_DETERMINISM_PERCENT: '10',
      EXTRIMLI_EXTREM_INSTANCE_REPLAY_CONSISTENCY_PERCENT: '20',
      EXTRIMLI_EXTREM_DELEGATION_STABILITY_PERCENT: '30',
      EXTRIMLI_EXTREM_COMPOSITION_SAFETY_PERCENT: 'Infinity',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.objektnoOrijentisanaReprodukcija.readiness.status === 'BLOCKED', 'object-oriented reproduction should block on invalid/low inputs');
      assert(report.objektnoOrijentisanaReprodukcija.readiness.degraded, 'invalid object-oriented reproduction inputs should degrade safely');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_OBJECT_STATE_REPRODUCIBILITY_PERCENT'), 'invalid reproduction input should be tracked');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_COMPOSITION_SAFETY_PERCENT'), 'invalid composition safety input should be tracked');
      assert(report.governanceSignal.freezeRequired, 'blocked reproduction readiness should freeze governance');
      assert(report.acceptanceCriteria.some((item) => item.id === 'objektno-orijentisana-reprodukcija-lock' && item.passed), 'object-oriented reproduction lock criterion must pass');
    });
  });

  await test('functional energy-flow signal degrades safely and blocks readiness on invalid energetic inputs', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_ENERGETIC_FLOW_STABILITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_FUNCTIONAL_TRANSFORMATION_COHESION_PERCENT: '-20',
      EXTRIMLI_EXTREM_THOUGHT_CHAIN_DETERMINISM_PERCENT: 'Infinity',
      EXTRIMLI_EXTREM_FUNCTIONAL_CONFLICT_PRESSURE_PERCENT: '999',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      const signal = report.funkcinalnoProgramiranjeEnergetskogMisaonogToka;
      assert(signal.readiness.status === 'BLOCKED', 'functional energy-flow signal should block on invalid/hostile inputs');
      assert(signal.readiness.degraded, 'functional energy-flow signal should degrade safely');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_ENERGETIC_FLOW_STABILITY_PERCENT'), 'invalid energetic stability input should be tracked');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_THOUGHT_CHAIN_DETERMINISM_PERCENT'), 'invalid thought-chain determinism input should be tracked');
      assert(signal.readiness.blockerReasons.length >= 1, 'blocked functional energy-flow signal should keep blocker reasons');
      assert(report.governanceSignal.freezeRequired, 'blocked functional energy-flow signal should freeze governance');
      assert(report.acceptanceCriteria.some((item) => item.id === 'funkcinalno-programiranje-energetskog-misaonog-toka-lock' && item.passed), 'functional energy-flow lock criterion must pass');
    });
  });

  await test('explicit thought-flow signal degrades safely with canonical fallback and bounded readiness', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_EKSPLICITNI_MISAONI_TOK_TRACEABILITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_EKSPLICITNA_FUNKCIONALNA_TRANSFORMACIJA_COHESION_PERCENT: 'Infinity',
      EXTRIMLI_EXTREM_EKSPLICITNO_REZONOVANJE_DETERMINISM_PERCENT: '-10',
      EXTRIMLI_EXTREM_EKSPLICITNI_VOCABULARY_ALIGNMENT_PERCENT: '200',
      EXTRIMLI_EXTREM_EKSPLICITNI_CONFLICT_PRESSURE_PERCENT: 'NaN',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      const signal = report.funkcionalnoProgramiranjeEksplicitnogMisaonogToka;
      assert(signal.readiness.degraded, 'explicit thought-flow signal should degrade safely');
      assert(signal.profileInput.explicitThoughtFlowTraceabilityPercent === 90, 'invalid explicit traceability should fallback to default');
      assert(signal.profileInput.functionalExplicitTransformationCohesionPercent === 86, 'invalid explicit transformation cohesion should fallback to default');
      assert(signal.profileInput.explicitReasoningDeterminismPercent === 0, 'negative explicit determinism should clamp to 0');
      assert(signal.profileInput.vocabularyAlignmentPercent === 100, 'out-of-range vocabulary alignment should clamp to 100');
      assert(signal.profileInput.conflictPressurePercent === 17, 'invalid conflict pressure should fallback to default');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_EKSPLICITNI_MISAONI_TOK_TRACEABILITY_PERCENT'), 'invalid explicit traceability input should be tracked');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_EKSPLICITNI_CONFLICT_PRESSURE_PERCENT'), 'invalid explicit conflict pressure input should be tracked');
      assert(signal.readiness.score >= 0 && signal.readiness.score <= 100, 'explicit thought-flow score must stay bounded');
    });
  });
  await test('fair thought-flow signal degrades safely and blocks readiness on invalid fairness-oriented inputs', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PRAVEDNI_MISAONI_TOK_STABILITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_FUNKCIONALNA_PRAVEDNOST_COHESION_PERCENT: '-20',
      EXTRIMLI_EXTREM_PRAVEDNO_REZONOVANJE_DETERMINISM_PERCENT: 'Infinity',
      EXTRIMLI_EXTREM_PRAVEDNA_EVIDENTIARY_COMPLETENESS_PERCENT: '10',
      EXTRIMLI_EXTREM_PRAVEDNI_CONFLICT_BIAS_PRESSURE_PERCENT: '999',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      const signal = report.funkcionalnoProgramiranjePravednogMisaonogToka;
      assert(signal.readiness.status === 'BLOCKED', 'fair thought-flow signal should block on invalid/hostile inputs');
      assert(signal.readiness.degraded, 'fair thought-flow signal should degrade safely');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_PRAVEDNI_MISAONI_TOK_STABILITY_PERCENT'), 'invalid fair thought-flow stability input should be tracked');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_PRAVEDNO_REZONOVANJE_DETERMINISM_PERCENT'), 'invalid fairness reasoning determinism input should be tracked');
      assert(signal.readiness.blockerReasons.length >= 1, 'blocked fair thought-flow signal should keep blocker reasons');
      assert(report.governanceSignal.freezeRequired, 'blocked fair thought-flow signal should freeze governance');
      assert(report.acceptanceCriteria.some((item) => item.id === 'funkcionalno-programiranje-pravednog-misaonog-toka-lock' && item.passed), 'fair thought-flow lock criterion must pass');
    });
  });

  await test('fair thought-flow blocker thresholds override high aggregate score', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PRAVEDNI_MISAONI_TOK_STABILITY_PERCENT: '100',
      EXTRIMLI_EXTREM_FUNKCIONALNA_PRAVEDNOST_COHESION_PERCENT: '100',
      EXTRIMLI_EXTREM_PRAVEDNO_REZONOVANJE_DETERMINISM_PERCENT: '100',
      EXTRIMLI_EXTREM_PRAVEDNA_EVIDENTIARY_COMPLETENESS_PERCENT: '40',
      EXTRIMLI_EXTREM_PRAVEDNI_CONFLICT_BIAS_PRESSURE_PERCENT: '20',
    }, () => {
      const signal = getExtrimliExtremProfilerReport().funkcionalnoProgramiranjePravednogMisaonogToka;
      assert(signal.readiness.status === 'BLOCKED', 'fairness evidentiary blocker must force BLOCKED even with high aggregate score');
      assert(signal.readiness.blockerReasons.some((reason) => reason.startsWith('fairness-evidentiary-completeness-blocked:40')), 'fairness evidentiary blocker reason must be retained');
    });
  });

  await test('legal-functional thought-flow signal degrades safely and blocks readiness on invalid legal-functional inputs', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PRAVNI_MISAONI_TOK_STABILITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_FUNKIONALNA_PRAVNA_TRANSFORMACIJA_COHESION_PERCENT: '-20',
      EXTRIMLI_EXTREM_PRAVNO_ZAKLJUCIVANJE_DETERMINISM_PERCENT: 'Infinity',
      EXTRIMLI_EXTREM_EVIDENTIARY_COMPLETENESS_PERCENT: '10',
      EXTRIMLI_EXTREM_PRAVNI_CONFLICT_ESCALATION_PRESSURE_PERCENT: '999',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      const signal = report.funkionalnoProgramiranjePravnogMisaonogToka;
      assert(signal.readiness.status === 'BLOCKED', 'legal-functional signal should block on invalid/hostile inputs');
      assert(signal.readiness.degraded, 'legal-functional signal should degrade safely');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_PRAVNI_MISAONI_TOK_STABILITY_PERCENT'), 'invalid legal thought-flow stability input should be tracked');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_PRAVNO_ZAKLJUCIVANJE_DETERMINISM_PERCENT'), 'invalid legal reasoning determinism input should be tracked');
      assert(signal.readiness.blockerReasons.length >= 1, 'blocked legal-functional signal should keep blocker reasons');
      assert(report.governanceSignal.freezeRequired, 'blocked legal-functional signal should freeze governance');
      assert(report.acceptanceCriteria.some((item) => item.id === 'funkionalno-programiranje-pravnog-misaonog-toka-lock' && item.passed), 'legal-functional lock criterion must pass');
    });
  });

  await test('legal-functional blocker thresholds override high aggregate score', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_PRAVNI_MISAONI_TOK_STABILITY_PERCENT: '100',
      EXTRIMLI_EXTREM_FUNKIONALNA_PRAVNA_TRANSFORMACIJA_COHESION_PERCENT: '100',
      EXTRIMLI_EXTREM_PRAVNO_ZAKLJUCIVANJE_DETERMINISM_PERCENT: '100',
      EXTRIMLI_EXTREM_EVIDENTIARY_COMPLETENESS_PERCENT: '40',
      EXTRIMLI_EXTREM_PRAVNI_CONFLICT_ESCALATION_PRESSURE_PERCENT: '20',
    }, () => {
      const signal = getExtrimliExtremProfilerReport().funkionalnoProgramiranjePravnogMisaonogToka;
      assert(signal.readiness.status === 'BLOCKED', 'evidentiary blocker must force BLOCKED even with high aggregate score');
      assert(signal.readiness.blockerReasons.some((reason) => reason.startsWith('evidentiary-completeness-blocked:40')), 'evidentiary blocker reason must be retained');
    });
  });

  await test('proportional programming degrades safely on invalid conditional facts without breaking additive readiness payload', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_USLOVNE_CINJENICE_READINESS_PERCENT: 'NaN',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      const signal = report.proporcionalnoProgramiranje;
      assert(signal.readiness.degraded, 'proportional programming should degrade safely');
      assert(['READY', 'WATCH', 'BLOCKED'].includes(signal.readiness.status), 'invalid conditional facts should preserve a valid readiness status');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_USLOVNE_CINJENICE_READINESS_PERCENT'), 'invalid conditional-facts env should be tracked');
      assert(signal.profileInput.conditionalFactReadinessPercent >= 0 && signal.profileInput.conditionalFactReadinessPercent <= 100, 'conditional facts fallback must stay bounded');
      assert(report.acceptanceCriteria.some((item) => item.id === 'proporcionalno-programiranje-lock' && item.passed), 'proportional programming lock criterion must pass');
    });
  });

  await test('epic elikvadenti degrade safely and block WAWE progression when readiness collapses', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_EPIC_OBJECT_ELEVATION_INTEGRITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_EPIC_EQUIVALENT_COVERAGE_PERCENT: '10',
      EXTRIMLI_EXTREM_EPIC_FUNCTIONAL_EQUIVALENCE_COHESION_PERCENT: '20',
      EXTRIMLI_EXTREM_EPIC_ASCENT_DELEGATION_PERCENT: '30',
      EXTRIMLI_EXTREM_EPIC_ENCAPSULATION_GUARD_PERCENT: 'Infinity',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.status === 'BLOCKED', 'epic elikvadenti should block on invalid/low inputs');
      assert(report.objektnoOrijentusanoUzdizanjeEpskihElikvadenata.readiness.degraded, 'epic elikvadenti should degrade safely');
      assert(report.governanceSignal.freezeRequired, 'blocked epic elikvadenti should freeze governance');
      assert(report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_EPIC_OBJECT_ELEVATION_INTEGRITY_PERCENT'), 'invalid epic object input should be tracked');
      assert(report.acceptanceCriteria.some((item) => item.id === 'objektno-orijentusano-uzdizanje-epskih-elikvadenata-lock' && item.passed), 'epic elikvadenti lock criterion must pass');
    });
  });

  await test('Mobilna linija accepts iPhone alias and flags invalid eSIM boolean as degraded fallback', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'iPhone',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'iPhone 15',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SUPPORTS_ESIM: 'maybe',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '70',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '17',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.mobilnaLinija.input.deviceType === 'IOS', 'iPhone alias should normalize to IOS');
      assert(report.mobilnaLinija.input.supportsEsim === true, 'invalid eSIM boolean should fallback to default true');
      assert(report.degradedSources.some((item) => item.includes('invalid-boolean:EXTRIMLI_EXTREM_MOBILNA_LINIJA_SUPPORTS_ESIM')), 'invalid boolean should be tracked in degraded sources');
    });
  });

  await test('Mobilna linija accepts router aliases with hyphen and space', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'router-4g',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'R4G',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '0',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.mobilnaLinija.input.deviceType === 'ROUTER_4G', 'router-4g alias should normalize to ROUTER_4G');
    });
  });

  await test('Mobilna linija preserves raw deviceType presence for invalid values', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'unknown-phone-class',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'X-INVALID',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '65',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '16',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.mobilnaLinija.input.deviceType === 'UNKNOWN', 'invalid device type should stay UNKNOWN');
      assert(report.mobilnaLinija.deviceCompatibility.deviceTypeProvided === true, 'raw deviceType presence should stay true');
      assert(report.mobilnaLinija.deviceCompatibility.compatible === false, 'invalid provided device type should be incompatible');
    });
  });

  await test('Mobilna linija treats iPad alias as unsupported device class', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'iPad',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'iPad Pro',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '72',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '17',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.mobilnaLinija.input.deviceType === 'UNKNOWN', 'iPad alias should remain unsupported');
      assert(report.mobilnaLinija.deviceCompatibility.status === 'BLOCKED', 'unsupported iPad should block compatibility');
      assert(report.mobilnaLinija.installationMessages.status === 'BLOCKED', 'unsupported iPad should block installation');
    });
  });

  await test('Mobilna linija keeps device compatibility ready while low signal blocks installation readiness', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_TYPE: 'ANDROID',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_DEVICE_MODEL: 'SPAJA-A1',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_OS_VERSION_MAJOR: '14',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '20',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.mobilnaLinija.deviceCompatibility.status === 'READY', 'device compatibility should stay READY for valid device');
      assert(report.mobilnaLinija.installationMessages.status === 'BLOCKED', 'installation should be blocked for low signal');
      assert(report.mobilnaLinija.packagePlanHint.recommendedPlanTier === 'NONE', 'low signal should not recommend a package tier');
    });
  });

  await test('invalid env values are clamped and flagged as degraded', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '120',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '-20',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: 'Infinity',
      EXTRIMLI_EXTREM_EKODOR_ALIGNMENT_PERCENT: '140',
      EXTRIMLI_EXTREM_UZVISENI_MISANI_TOK_STABILITY_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_UZVISENA_FUNKCIONALNA_TRANSFORMACIJA_COHESION_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_UZVISENO_REZONOVANJE_DETERMINISM_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '20',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.degraded, 'report should be degraded for invalid env values');
      assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT')), 'expected scene load degraded source');
      assert(report.profileInput.gpuContentionPercent === 100, 'gpu contention should be clamped to 100');
      assert(report.profileInput.cpuContentionPercent === 0, 'cpu contention should be clamped to 0');
      assert(report.resolutionInput.ekodorAlignmentPercent === 100, 'EKODOR alignment should be clamped to 100');
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.elevatedThoughtFlowStabilityPercent === 91,
        'invalid elevated thought-flow stability should fall back to default',
      );
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.functionalTransformationCohesionPercent === 87,
        'invalid elevated cohesion should fall back to default',
      );
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.reasoningDeterminismPercent === 88,
        'invalid elevated determinism should fall back to default',
      );
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.conflictDegradationPressurePercent === 16,
        'invalid elevated conflict pressure should fall back to default',
      );
      assert(report.mobilnaLinija.input.signalStrengthPercent <= EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY, 'mobilna signal override should apply');
    });
  });

  await test('elevated thought-flow accepts deprecated pressure alias while preserving canonical config', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT: undefined,
      EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT: '23',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.conflictDegradationPressurePercent === 23,
        'deprecated alias should still feed the conflict degradation pressure input',
      );
    });
  });

  await test('elevated thought-flow prefers canonical pressure env over deprecated alias when both are set', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT: '19',
      EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT: '23',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.conflictDegradationPressurePercent === 19,
        'canonical env should take precedence over deprecated alias',
      );
    });
  });

  await test('elevated thought-flow malformed canonical pressure env suppresses deprecated alias', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT: 'NaN',
      EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT: '23',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.conflictDegradationPressurePercent === 16,
        'malformed canonical env should fall back to canonical default instead of consuming deprecated alias',
      );
      assert(
        report.degradedSources.includes('invalid-env:EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT'),
        'malformed canonical env should still be reported as degraded',
      );
    });
  });

  await test('elevated thought-flow blank canonical pressure env suppresses deprecated alias', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT: '   ',
      EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT: '23',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(
        report.funkcionalnoProgramiranjeUzvisenogMisanogToka.profileInput.conflictDegradationPressurePercent === 16,
        'blank canonical env should fall back to canonical default instead of consuming deprecated alias',
      );
    });
  });

  await test('high conflict profile triggers freeze and aggressive optimization', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '98',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '95',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '94',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '160',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(['HIGH', 'CRITICAL'].includes(report.profile.conflictIntensity), 'expected high or critical conflict intensity');
      assert(report.profile.optimizationTier === 'EXTREME_PROFILING_REQUIRED', 'expected extreme profiling tier');
      assert(report.governanceSignal.freezeRequired, 'freeze should be required for extreme conflict');
      assert(report.governanceSignal.wawePromotionEligible === false, 'WAWE promotion should be blocked for extreme conflict');
      assert(report.spajaproTrack.freezeControlledByExtrem, 'SPAJAPRO freeze token should be EXTREM-controlled');
      assert(report.spajaproTrack.activeTokenStates.some((item) => item.token === 'OKET' && item.status === 'BLOCKED'), 'OKET should block under extreme conflict');
    });

    await test('formula mismatch blocks MUŠEMA governance and WAWE promotion', async () => {
      await withEnv({
        EXTRIMLI_EXTREM_SHEMA_VALUE: '40',
        EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: '20',
        EXTRIMLI_EXTREM_MUSHEMA_VALUE: '70',
      }, () => {
        const report = getExtrimliExtremProfilerReport();
        assert(report.semaMuSemaFormula.formulaHolds === false, 'formula should fail');
        assert(report.semaMuSemaFormula.status === 'BLOCKED', 'formula status should be BLOCKED');
        assert(report.semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_BLOCKED', 'MUŠEMA conclusion should be blocked');
        assert(report.governanceSignal.freezeRequired, 'formula mismatch must freeze WAWE promotion');
        assert(report.governanceSignal.wawePromotionEligible === false, 'WAWE promotion should be blocked');
      });
    });

    await test('NaN/Infinity formula env values stay additive and degrade without payload break', async () => {
      await withEnv({
        EXTRIMLI_EXTREM_SHEMA_VALUE: 'NaN',
        EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: 'Infinity',
        EXTRIMLI_EXTREM_MUSHEMA_VALUE: 'Infinity',
      }, () => {
        const report = getExtrimliExtremProfilerReport();
        assert(report.degraded, 'report should be degraded for invalid formula env values');
        assert(report.semaMuSemaFormula.status === 'BLOCKED', 'fallback substitutions should block deterministic formula gate');
        assert(report.semaMuSemaFormula.muSemaConclusion === 'MUŠEMA_BLOCKED', 'fallback substitutions should block MUŠEMA conclusion');
        assert(report.semaMuSemaFormula.inputSubstitutions.length === 3, 'all formula env values should be recorded as substitutions');
        assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_SHEMA_VALUE')), 'expected invalid ŠEMA source');
        assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_ALL_SHEMA_VALUE')), 'expected invalid ALL ŠEMA source');
        assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_MUSHEMA_VALUE')), 'expected invalid MUŠEMA source');
      });
    });

    await test('out-of-range formula env values are tracked as substitutions and block gate', async () => {
      await withEnv({
        EXTRIMLI_EXTREM_SHEMA_VALUE: '999',
        EXTRIMLI_EXTREM_ALL_SHEMA_VALUE: '999',
        EXTRIMLI_EXTREM_MUSHEMA_VALUE: '9999',
      }, () => {
        const report = getExtrimliExtremProfilerReport();
        assert(report.semaMuSemaFormula.status === 'BLOCKED', 'out-of-range substitutions should block formula gate');
        assert(report.semaMuSemaFormula.inputSubstitutions.length === 3, 'all out-of-range formula inputs should be tracked');
        assert(report.semaMuSemaFormula.blockerReasons.some((reason) => reason.includes('clamped for out-of-range values')), 'out-of-range clamp blocker reason should be present');
        assert(report.governanceSignal.freezeRequired, 'out-of-range substitutions should freeze WAWE promotion');
      });
    });
  });

  await test('DISCAN in KIBEN blocker freezes progression even when DISKVIT conflict is low', async () => {
    await withEnv({
      EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT: '10',
      EXTRIMLI_EXTREM_GPU_CONTENTION_PERCENT: '10',
      EXTRIMLI_EXTREM_CPU_CONTENTION_PERCENT: '10',
      EXTRIMLI_EXTREM_RENDER_CYCLE_LATENCY_MS: '10',
      EXTRIMLI_EXTREM_REZOLUCIJA_COMPLETENESS_PERCENT: '48',
      EXTRIMLI_EXTREM_EKODOR_ALIGNMENT_PERCENT: '40',
      EXTRIMLI_EXTREM_DISCAN_PRESSURE_PERCENT: '90',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.profile.conflictIntensity === 'LOW', 'expected low DISKVIT conflict');
      assert(report.resolutionReadiness.rezolucijaScore < EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY, 'REZOLUCIJA score should be below ready threshold');
      assert(report.resolutionReadiness.ekodorState !== 'ALIGNED', 'EKODOR should not be aligned');
      assert(report.resolutionReadiness.discanInKibenState === 'BLOCKED', 'DISCAN in KIBEN should block');
      assert(report.resolutionReadiness.rekulitiPoRauletu === 'FREEZE', 'REKULITI policy should freeze');
      assert(report.governanceSignal.freezeRequired, 'resolution blocker should require freeze');
      assert(report.optimization.maximumGraphicsUnlockEligible === false, 'maximum unlock should be blocked');
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
