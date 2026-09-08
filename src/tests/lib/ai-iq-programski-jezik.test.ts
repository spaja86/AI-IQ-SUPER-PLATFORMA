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
