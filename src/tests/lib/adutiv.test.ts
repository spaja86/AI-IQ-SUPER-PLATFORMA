// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateAdutiv,
  getAdutivHealthReport,
  _resetAdutivMetrics,
  upsertAdutivSession,
  getSessionById,
  _resetRegistry,
  ADUTIV_CONTRACT_VERSION,
  ADUTIV_DISCLAIMER,
  ADUTIV_PERFORMANCE_MAX_MS,
  ADUTIV_PERSONA_ID,
} from '../../lib/adutiv';

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
  _resetAdutivMetrics();
  _resetRegistry();

  console.log('\n🔎 [adutiv] constants');

  await test('contract version is non-empty', () => {
    assert(ADUTIV_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(ADUTIV_PERSONA_ID === 'adutiv-core', `unexpected persona id: ${ADUTIV_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(ADUTIV_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  console.log('\n🔎 [adutiv] engine — valid cases');

  await test('high scores → APEX or DOMINANT tier', () => {
    const result = evaluateAdutiv({
      referenceId: 'high-test',
      advantages: [
        { domain: 'SKILL', score: 90 },
        { domain: 'KNOWLEDGE', score: 85 },
        { domain: 'NETWORK', score: 88 },
        { domain: 'REPUTATION', score: 82 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(['APEX', 'DOMINANT'].includes(result.tier), `unexpected tier: ${result.tier}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.activationPlan.length > 0, 'activationPlan must be present');
  });

  await test('low scores → LATENT or EMERGING tier', () => {
    const result = evaluateAdutiv({
      referenceId: 'low-test',
      advantages: [
        { domain: 'SKILL', score: 10 },
        { domain: 'KNOWLEDGE', score: 8 },
        { domain: 'NETWORK', score: 12 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(['LATENT', 'EMERGING'].includes(result.tier), `unexpected tier: ${result.tier}`);
  });

  await test('apex adut detection', () => {
    const result = evaluateAdutiv({
      referenceId: 'apex-test',
      advantages: [
        { domain: 'SKILL', score: 30 },
        { domain: 'CREATIVITY', score: 95 },
        { domain: 'TIMING', score: 40 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.apexAdut === 'CREATIVITY', `expected CREATIVITY, got ${result.apexAdut}`);
  });

  await test('strengthMap sorted descending by score', () => {
    const result = evaluateAdutiv({
      referenceId: 'sorted-test',
      advantages: [
        { domain: 'SKILL', score: 50 },
        { domain: 'RESILIENCE', score: 90 },
        { domain: 'NETWORK', score: 70 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.strengthMap[0].domain === 'RESILIENCE', 'first domain should be highest');
    assert(result.strengthMap[0].score >= result.strengthMap[1].score, 'scores not sorted descending');
  });

  await test('blind spot warning for domain < 15', () => {
    const result = evaluateAdutiv({
      referenceId: 'blindspot-test',
      advantages: [
        { domain: 'SKILL', score: 10 },
        { domain: 'KNOWLEDGE', score: 70 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.length > 0, 'should have blind spot warning');
    assert(result.warnings.some((w) => w.includes('SKILL')), 'warning should mention SKILL domain');
  });

  await test('no blind spot warning when all scores >= 15', () => {
    const result = evaluateAdutiv({
      referenceId: 'no-blindspot-test',
      advantages: [
        { domain: 'SKILL', score: 20 },
        { domain: 'KNOWLEDGE', score: 55 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.length === 0, 'should have no blind spot warnings');
  });

  await test('disclaimer always present in valid result', () => {
    const result = evaluateAdutiv({
      advantages: [{ domain: 'SKILL', score: 60 }],
    });

    assert(result.disclaimer.length > 0, 'disclaimer must always be present');
  });

  await test('disclaimer always present in invalid result', () => {
    const result = evaluateAdutiv({
      advantages: [],
    } as never);

    assert(result.disclaimer.length > 0, 'disclaimer must always be present in invalid result');
  });

  await test('activationPlan has 4 items (3 tier + 1 domain)', () => {
    const result = evaluateAdutiv({
      advantages: [
        { domain: 'SKILL', score: 75 },
        { domain: 'KNOWLEDGE', score: 65 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.activationPlan.length === 4, `expected 4 plan items, got ${result.activationPlan.length}`);
  });

  await test('performance gate: durationMs <= 50ms', () => {
    const result = evaluateAdutiv({
      referenceId: 'perf-test',
      advantages: [
        { domain: 'SKILL', score: 70 },
        { domain: 'KNOWLEDGE', score: 65 },
        { domain: 'NETWORK', score: 80 },
      ],
    });

    assert(result.durationMs <= ADUTIV_PERFORMANCE_MAX_MS, `durationMs ${result.durationMs}ms exceeds ${ADUTIV_PERFORMANCE_MAX_MS}ms`);
  });

  await test('all 8 domains accepted', () => {
    const result = evaluateAdutiv({
      referenceId: 'all-domains',
      advantages: [
        { domain: 'SKILL', score: 50 },
        { domain: 'KNOWLEDGE', score: 55 },
        { domain: 'NETWORK', score: 60 },
        { domain: 'RESOURCE', score: 45 },
        { domain: 'REPUTATION', score: 70 },
        { domain: 'CREATIVITY', score: 65 },
        { domain: 'RESILIENCE', score: 72 },
        { domain: 'TIMING', score: 48 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.strengthMap.length === 8, `expected 8 entries in strengthMap, got ${result.strengthMap.length}`);
  });

  console.log('\n🔎 [adutiv] engine — edge cases');

  await test('NaN score → invalid result', () => {
    const result = evaluateAdutiv({
      advantages: [{ domain: 'SKILL', score: NaN }],
    });

    assert(result.valid === false, 'NaN score should produce invalid result');
    assert(result.warnings.length > 0, 'should have warnings');
  });

  await test('Infinity score → invalid result', () => {
    const result = evaluateAdutiv({
      advantages: [{ domain: 'SKILL', score: Infinity }],
    });

    assert(result.valid === false, 'Infinity score should produce invalid result');
  });

  await test('negative score → invalid result', () => {
    const result = evaluateAdutiv({
      advantages: [{ domain: 'SKILL', score: -5 }],
    });

    assert(result.valid === false, 'negative score should produce invalid result');
  });

  await test('score > 100 → invalid result', () => {
    const result = evaluateAdutiv({
      advantages: [{ domain: 'SKILL', score: 150 }],
    });

    assert(result.valid === false, 'score > 100 should produce invalid result');
  });

  await test('empty advantages array → invalid result', () => {
    const result = evaluateAdutiv({ advantages: [] });

    assert(result.valid === false, 'empty advantages should produce invalid result');
  });

  await test('null input → invalid result', () => {
    const result = evaluateAdutiv(null as never);

    assert(result.valid === false, 'null input should produce invalid result');
  });

  await test('invalid domain string → invalid result', () => {
    const result = evaluateAdutiv({
      advantages: [{ domain: 'INJECTED_DOMAIN' as never, score: 80 }],
    });

    assert(result.valid === false, 'invalid domain should produce invalid result');
  });

  console.log('\n🔎 [adutiv] health report');

  await test('health report returns expected shape', () => {
    const report = getAdutivHealthReport();

    assert(report.personaId === ADUTIV_PERSONA_ID, `unexpected personaId: ${report.personaId}`);
    assert(report.contractVersion === ADUTIV_CONTRACT_VERSION, 'unexpected contract version');
    assert(typeof report.evaluations === 'number', 'evaluations must be a number');
    assert(report.performanceMaxMs === 50, `expected 50ms, got ${report.performanceMaxMs}`);
    assert(report.apiResponseMaxMs === 200, `expected 200ms, got ${report.apiResponseMaxMs}`);
  });

  await test('evaluations counter increments', () => {
    _resetAdutivMetrics();
    evaluateAdutiv({ advantages: [{ domain: 'SKILL', score: 60 }] });
    evaluateAdutiv({ advantages: [{ domain: 'KNOWLEDGE', score: 70 }] });

    const report = getAdutivHealthReport();
    assert(report.evaluations === 2, `expected 2 evaluations, got ${report.evaluations}`);
  });

  console.log('\n🔎 [adutiv] registry');

  await test('upsert and retrieve session', () => {
    _resetRegistry();
    const result = evaluateAdutiv({
      referenceId: 'reg-test',
      advantages: [{ domain: 'SKILL', score: 60 }],
    });
    upsertAdutivSession(result);
    const retrieved = getSessionById('reg-test');
    assert(retrieved !== undefined, 'should retrieve session');
    assert(retrieved?.referenceId === 'reg-test', 'referenceId should match');
  });

  await test('getSessionById returns undefined for missing id', () => {
    _resetRegistry();
    const result = getSessionById('nonexistent');
    assert(result === undefined, 'should return undefined for missing id');
  });

  // ─── Summary ──────────────────────────────────────────────────────────────

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Unexpected test runner error:', error);
  process.exit(1);
});
