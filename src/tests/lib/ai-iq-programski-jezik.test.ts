// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetAiiqLanguageMetrics,
  AIIQ_LANG_CONTRACT_VERSION,
  AIIQ_LANG_PERFORMANCE_MAX_MS,
  AIIQ_LANG_PERSONA_ID,
  evaluateAiiqLanguage,
  compileAiiqLanguage,
  getAiiqLanguageHealthReport,
} from '../../lib/ai-iq-programski-jezik';

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
  _resetAiiqLanguageMetrics();

  console.log('\n🧠 [ai-iq-programski-jezik] constants');

  await test('contract version is v1', () => {
    assert(AIIQ_LANG_CONTRACT_VERSION === 'v1', `unexpected contract version: ${AIIQ_LANG_CONTRACT_VERSION}`);
  });

  await test('persona id is stable', () => {
    assert(AIIQ_LANG_PERSONA_ID === 'ai-iq-programski-jezik-core', `unexpected persona id: ${AIIQ_LANG_PERSONA_ID}`);
  });

  console.log('\n🧠 [ai-iq-programski-jezik] evaluate');

  await test('deterministic evaluate returns stable status and score', () => {
    const input = {
      referenceId: 'eval-stable',
      goal: 'AI-native orkestracija prompta i pravila',
      mode: 'HYBRID' as const,
      promptComplexity: 84,
      ruleCoverage: 86,
      orchestrationReadiness: 82,
      autonomyLevel: 79,
      riskLevel: 28,
      explainabilityNeed: 90,
      securityPolicyScore: 88,
      fallbackConfigured: true,
    };

    const first = evaluateAiiqLanguage(input);
    const second = evaluateAiiqLanguage(input);

    assert(first.valid, 'result should be valid');
    assert(first.status === 'AI_NATIVE_READY', `expected AI_NATIVE_READY, got ${first.status}`);
    assert(first.overallScore === second.overallScore, 'overall score should be deterministic');
    assert(first.status === second.status, 'status should be deterministic');
    assert(first.integrationProfile.profileId === 'EXTRIMLI-EXTRONDOL-EXTREM', 'integration profile id mismatch');
    assert(first.integrationProfile.signalMapping.DOM.group.join(',') === 'DOMPRE PETLJA,DOMBRE PETLJA,DOMBRA PETLJA,DOMBAR PETLJA,DOMPOR PETLJA', 'DOM mapping mismatch');
    assert(first.integrationProfile.signalMapping.DIK.group.join(',') === 'DIK PETLJA', 'DIK mapping mismatch');
    assert(first.integrationProfile.signalMapping.DAK.group.join(',') === 'DAKOR', 'DAK mapping mismatch');
    assert(first.integrationProfile.signalMapping.DUK.group.join(',') === 'DUKAR', 'DUK mapping mismatch');
    assert(
      first.integrationProfile.signalMapping.FOR.group.join(',') === 'FOR PETLJA,PROGRAMSKI JEZIK INFORMACIONIH TOKOVA',
      'FOR mapping mismatch',
    );
    assert(
      first.integrationProfile.signalMapping.SINEMETRICKO.group.join(',') === 'SINEMETRIČKO PROGRAMIRANJE',
      'SINEMETRICKO mapping mismatch',
    );
    assert(
      first.integrationProfile.signalMapping.SINEMETRICKO.technicalSource === '/api/extrimli/extrem'
      && first.integrationProfile.signalMapping.SINEMETRICKO.governanceSource === '/api/extrimli/extrondol',
      'SINEMETRICKO sources mismatch',
    );
    assert(first.integrationProfile.unifiedSignalStatus.overall === second.integrationProfile.unifiedSignalStatus.overall, 'integration overall should be deterministic');
    assert(first.integrationProfile.unifiedSignalStatus.sinemetricko === second.integrationProfile.unifiedSignalStatus.sinemetricko, 'sinemetricko status should be deterministic');
    assert(first.integrationProfile.unifiedSignalStatus.forInformacioniTokovi === second.integrationProfile.unifiedSignalStatus.forInformacioniTokovi, 'informational-flow status should be deterministic');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.sourceOfTruth === '/api/extrimli/extrondol', 'consistency source mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.scopeLock.join(',') === 'DOK,DIK,DAK,DUK', 'consistency scope lock mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(first.integrationProfile.dokDikDakDukConsistencyHealth.escalationStatus), 'invalid consistency escalation status');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.escalationScore >= 0 && first.integrationProfile.dokDikDakDukConsistencyHealth.escalationScore <= 100, 'consistency escalation score must be bounded');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.downstreamReference === 'spaja86/IO-OPENUI-AO', 'consistency downstream reference mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.canonicalName === 'PROGRAMSKI JEZIK PROUČAVANJA', 'programski jezik proucavanja name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.ownershipSplit.dokDik === 'EXTREM', 'programski jezik proucavanja DOK/DIK ownership mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.ownershipSplit.dakDuk === 'EXTRONDOL', 'programski jezik proucavanja DAK/DUK ownership mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.canonicalName === 'PROGRAMSKI EKANALOG', 'programski ekanalog name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikProucavanja.programskiEkanalog.meaning === 'razumevanje logike', 'programski ekanalog meaning mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikInformacionihTokova.canonicalName === 'PROGRAMSKI JEZIK INFORMACIONIH TOKOVA', 'informational-flow canonical name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikInformacionihTokova.dslProfile === 'interpretacioni-orkestracioni-dsl', 'informational-flow DSL profile mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikPretpostavka.canonicalName === 'PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)', 'pretpostavka canonical name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikPretpostavka.dslProfile === 'interpretacioni-pretpostavka-dsl', 'pretpostavka DSL profile mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.canonicalName === 'PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI (PREDISPOZIJA EKSTREMNIH GLASOVNIH KOMANDI U ETAPSIKM SENZACIJAMA)', 'prosparitet/deklasirane-matrice canonical name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi.ownershipSplit.prosparitet === 'input-domain-only', 'PROSPARITET ownership split mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikSpecijalizovanZaIgrice.canonicalName === 'PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE', 'gaming DSL canonical name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikSpecijalizovanZaIgrice.dslProfile === 'gaming-specijalizovani-dsl', 'gaming DSL profile mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikSpecijalizovanZaIgrice.gamingDomain.consumerAnchors.join(',') === 'src/lib/igrice.ts,src/lib/gaming-endzin.ts', 'gaming DSL anchors mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.canonicalName === 'PROGRAMSKI JEZIK APSTRAKCIJA', 'apstrakcija canonical name mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.additiveOnly, 'apstrakcija must stay additive-only');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.signalOwnership.dokDik === 'EXTREM', 'apstrakcija DOK/DIK ownership mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.signalOwnership.dakDuk === 'EXTRONDOL', 'apstrakcija DAK/DUK ownership mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.governanceQualityGate.sequence.join(',') === 'lint,test,smoke,predeploy,security,human-review,audit-log', 'apstrakcija gate sequence mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.rolloutPlan.phase1 === 'documentation-lock-and-contract-model', 'apstrakcija rollout phase1 mismatch');
    assert(first.integrationProfile.dokDikDakDukConsistencyHealth.programskiJezikApstrakcija.rolloutPlan.phase4 === 'downstream-sync-and-audit-safe-summary', 'apstrakcija rollout phase4 mismatch');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(first.integrationProfile.unifiedSignalStatus.pretpostavka), 'pretpostavka status must be bounded');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(first.integrationProfile.unifiedSignalStatus.prosparitetDeklasiraneMatriceEkstaza), 'prosparitet/deklasirane-matrice status must be bounded');
    assert(['READY', 'WATCH', 'BLOCKED'].includes(first.integrationProfile.unifiedSignalStatus.programskiJezikSpecijalizovanZaIgrice), 'gaming DSL status must be bounded');
    assert(first.integrationProfile.acceptanceCriteria.preserveDokDikDakDukContract, 'DOK/DIK/DAK/DUK contract lock must stay enabled');
    assert(first.integrationProfile.acceptanceCriteria.sinemetrickoAdditiveInput, 'sinemetricko additive input lock must stay enabled');
    assert(first.integrationProfile.acceptanceCriteria.informacioniTokoviAdditiveInput, 'informational-flow additive input lock must stay enabled');
    assert(first.integrationProfile.acceptanceCriteria.pretpostavkaAdditiveInput, 'pretpostavka additive input lock must stay enabled');
    assert(first.integrationProfile.governanceLink.downstreamReference.linkedRepo === 'spaja86/IO-OPENUI-AO', 'downstream reference mismatch');
    assert(first.durationMs <= AIIQ_LANG_PERFORMANCE_MAX_MS, `duration ${first.durationMs} > ${AIIQ_LANG_PERFORMANCE_MAX_MS}`);
  });

  await test('NaN is rejected', () => {
    const result = evaluateAiiqLanguage({
      goal: 'test',
      mode: 'HYBRID',
      promptComplexity: Number.NaN,
      ruleCoverage: 80,
      orchestrationReadiness: 80,
      autonomyLevel: 80,
      riskLevel: 20,
      explainabilityNeed: 80,
      securityPolicyScore: 80,
      fallbackConfigured: true,
    });

    assert(!result.valid, 'NaN must be invalid');
  });

  await test('Infinity is rejected', () => {
    const result = evaluateAiiqLanguage({
      goal: 'test',
      mode: 'HYBRID',
      promptComplexity: Number.POSITIVE_INFINITY,
      ruleCoverage: 80,
      orchestrationReadiness: 80,
      autonomyLevel: 80,
      riskLevel: 20,
      explainabilityNeed: 80,
      securityPolicyScore: 80,
      fallbackConfigured: true,
    });

    assert(!result.valid, 'Infinity must be invalid');
  });

  await test('critical risk returns BLOCKED', () => {
    const result = evaluateAiiqLanguage({
      goal: 'test',
      mode: 'AI_NATIVE',
      promptComplexity: 88,
      ruleCoverage: 88,
      orchestrationReadiness: 88,
      autonomyLevel: 88,
      riskLevel: 95,
      explainabilityNeed: 88,
      securityPolicyScore: 90,
      fallbackConfigured: true,
    });

    assert(result.valid, 'result should remain valid');
    assert(result.status === 'BLOCKED', `expected BLOCKED, got ${result.status}`);
  });

  console.log('\n🧠 [ai-iq-programski-jezik] compile');

  await test('compile accepts valid v1 program', () => {
    const result = compileAiiqLanguage({
      referenceId: 'compile-ok',
      source: [
        'INTENT: AI-native orchestration',
        'RULE: NO_SECRET output',
        'RULE: ALLOWLIST tool=internal',
        'AI: expand prompt graph',
        'ORCHESTRATE: hybrid pipeline',
        'OUTPUT: status score warnings action',
      ].join('\n'),
      targetMode: 'AI_NATIVE',
      strictSecurity: true,
      featureFlagAiIqLanguage: true,
    });

    assert(result.valid, 'compile should be valid');
    assert(result.securityPass, 'security should pass');
    assert(result.executionMode === 'AI_NATIVE', `expected AI_NATIVE, got ${result.executionMode}`);
    assert(result.status === 'AI_NATIVE_READY', `expected AI_NATIVE_READY, got ${result.status}`);
    assert(result.compiledProgram.length > 0, 'compiled program must be present');
  });

  await test('compile blocks strict security when missing NO_SECRET rule', () => {
    const result = compileAiiqLanguage({
      source: [
        'INTENT: test',
        'RULE: ALLOWLIST api=internal',
        'AI: summarize',
        'OUTPUT: minimal',
      ].join('\n'),
      targetMode: 'AI_NATIVE',
      strictSecurity: true,
      featureFlagAiIqLanguage: true,
    });

    assert(result.valid, 'compile remains valid');
    assert(!result.securityPass, 'security must fail');
    assert(result.status === 'BLOCKED', `expected BLOCKED, got ${result.status}`);
    assert(result.integrationProfile.governanceLink.rolloutSnapshot.promotionFreeze, 'blocked compile must freeze promotion');
    assert(result.integrationProfile.dokDikDakDukConsistencyHealth.deterministicFallbackRequired, 'blocked consistency must require deterministic fallback');
    assert(result.executionMode === 'DETERMINISTIC_ONLY', 'blocked consistency must keep deterministic execution mode');
  });

  await test('compile flags invalid token syntax as warning but keeps additive profile', () => {
    const result = compileAiiqLanguage({
      source: [
        'INTENT: test',
        'RULE: NO_SECRET output',
        'RULE: ALLOWLIST api=internal',
        'DIK: unsupported keyword',
        'OUTPUT: status score warnings action',
      ].join('\n'),
      targetMode: 'HYBRID',
      strictSecurity: true,
      featureFlagAiIqLanguage: true,
    });

    assert(result.valid, 'compile should stay valid with partial AST');
    assert(result.warnings.some((warning) => warning.includes('unsupported keyword: DIK')), 'must warn on invalid DIK token');
    assert(result.integrationProfile.unifiedSignalStatus.dik === 'WATCH', 'DIK status should degrade on malformed token syntax');
    assert(result.integrationProfile.additiveOnly, 'integration must remain additive-only');
  });

  await test('health report tracks evaluations and compilations', () => {
    const report = getAiiqLanguageHealthReport();
    assert(report.evaluations >= 4, `expected evaluations >= 4, got ${report.evaluations}`);
    assert(report.compilations >= 2, `expected compilations >= 2, got ${report.compilations}`);
    assert(report.personaId === AIIQ_LANG_PERSONA_ID, `unexpected persona id: ${report.personaId}`);
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
