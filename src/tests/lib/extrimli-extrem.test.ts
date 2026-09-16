import {
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_INSTALLATION_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY,
  EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION,
  EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION,
  EXTRIMLI_EXTREM_PROFILER_PERSONA_ID,
  EXTRIMLI_EXTREM_REZOLUCIJA_MIN_FOR_READY,
  EXTRIMLI_EXTREM_PROFILER_SOURCE_OF_TRUTH,
  EXTRIMLI_EXTREM_SHEMA_MUSHEMA_CANONICAL_EXPRESSION,
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
    assert(report.roadmapAlignment.primaryVersion === 'Verzija 4', 'EXTREM should align to Verzija 4');
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
      EXTRIMLI_EXTREM_MOBILNA_LINIJA_SIGNAL_STRENGTH_PERCENT: '20',
    }, () => {
      const report = getExtrimliExtremProfilerReport();
      assert(report.degraded, 'report should be degraded for invalid env values');
      assert(report.degradedSources.some((item) => item.includes('EXTRIMLI_EXTREM_SCENE_LOAD_PERCENT')), 'expected scene load degraded source');
      assert(report.profileInput.gpuContentionPercent === 100, 'gpu contention should be clamped to 100');
      assert(report.profileInput.cpuContentionPercent === 0, 'cpu contention should be clamped to 0');
      assert(report.resolutionInput.ekodorAlignmentPercent === 100, 'EKODOR alignment should be clamped to 100');
      assert(report.mobilnaLinija.input.signalStrengthPercent <= EXTRIMLI_EXTREM_MOBILNA_LINIJA_MIN_SIGNAL_FOR_READY, 'mobilna signal override should apply');
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
