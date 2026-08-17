// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  evaluateEkzist,
  getEkzistHealthReport,
  _resetEkzistMetrics,
  EKZIST_CONTRACT_VERSION,
  EKZIST_DISCLAIMER,
  EKZIST_PERFORMANCE_MAX_MS,
  EKZIST_PERSONA_ID,
} from '../../lib/ekzist';

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
  _resetEkzistMetrics();

  console.log('\n🔎 [ekzist] constants');

  await test('contract version is non-empty', () => {
    assert(EKZIST_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(EKZIST_PERSONA_ID === 'ekzist-core', `unexpected persona id: ${EKZIST_PERSONA_ID}`);
  });

  await test('disclaimer is non-empty', () => {
    assert(EKZIST_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  console.log('\n🔎 [ekzist] engine — valid cases');

  await test('balanced high scores → ALIGNED or PEAK tier', () => {
    const result = evaluateEkzist({
      referenceId: 'balanced-test',
      domains: [
        { domain: 'MEANING', score: 80 },
        { domain: 'PURPOSE', score: 78 },
        { domain: 'IDENTITY', score: 75 },
        { domain: 'CONNECTION', score: 82 },
        { domain: 'AUTONOMY', score: 77 },
        { domain: 'LEGACY', score: 79 },
        { domain: 'TRANSCENDENCE', score: 76 },
        { domain: 'GROWTH', score: 80 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(['ALIGNED', 'PEAK'].includes(result.tier), `unexpected tier: ${result.tier}`);
    assert(result.disclaimer.length > 0, 'disclaimer must be present');
    assert(result.recommendations.length > 0, 'recommendations must be present');
  });

  await test('low scores → GROUNDED or SEARCHING tier', () => {
    const result = evaluateEkzist({
      referenceId: 'low-test',
      domains: [
        { domain: 'MEANING', score: 20 },
        { domain: 'PURPOSE', score: 18 },
        { domain: 'IDENTITY', score: 15 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(['GROUNDED', 'SEARCHING'].includes(result.tier), `unexpected tier: ${result.tier}`);
  });

  await test('dominant vector detection', () => {
    const result = evaluateEkzist({
      referenceId: 'dominant-test',
      domains: [
        { domain: 'MEANING', score: 30 },
        { domain: 'TRANSCENDENCE', score: 95 },
        { domain: 'GROWTH', score: 40 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.dominantVector === 'TRANSCENDENCE', `expected TRANSCENDENCE, got ${result.dominantVector}`);
  });

  await test('dimensionScores sorted descending by score', () => {
    const result = evaluateEkzist({
      referenceId: 'sorted-test',
      domains: [
        { domain: 'MEANING', score: 50 },
        { domain: 'LEGACY', score: 90 },
        { domain: 'GROWTH', score: 70 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.dimensionScores[0].domain === 'LEGACY', 'first domain should be highest');
    assert(result.dimensionScores[0].score >= result.dimensionScores[1].score, 'scores not sorted descending');
  });

  await test('imbalance warning for domain < 10', () => {
    const result = evaluateEkzist({
      referenceId: 'low-domain-test',
      domains: [
        { domain: 'MEANING', score: 5 },
        { domain: 'PURPOSE', score: 70 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.length > 0, 'should have imbalance warning');
    assert(result.warnings.some((w) => w.includes('MEANING')), 'warning should mention MEANING domain');
  });

  await test('imbalance warning for domain > 95', () => {
    const result = evaluateEkzist({
      referenceId: 'high-domain-test',
      domains: [
        { domain: 'AUTONOMY', score: 98 },
        { domain: 'GROWTH', score: 40 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assert(result.warnings.some((w) => w.includes('AUTONOMY')), 'warning should mention AUTONOMY domain');
  });

  await test('disclaimer always present in valid result', () => {
    const result = evaluateEkzist({
      domains: [{ domain: 'MEANING', score: 60 }],
    });

    assert(result.disclaimer.length > 0, 'disclaimer must always be present');
  });

  await test('disclaimer always present in invalid result', () => {
    const result = evaluateEkzist({
      domains: [],
    } as never);

    assert(result.disclaimer.length > 0, 'disclaimer must always be present in invalid result');
  });

  await test('performance gate: durationMs <= 50ms', () => {
    const result = evaluateEkzist({
      referenceId: 'perf-test',
      domains: [
        { domain: 'MEANING', score: 70 },
        { domain: 'PURPOSE', score: 65 },
        { domain: 'GROWTH', score: 80 },
      ],
    });

    assert(result.durationMs <= EKZIST_PERFORMANCE_MAX_MS, `durationMs ${result.durationMs}ms exceeds ${EKZIST_PERFORMANCE_MAX_MS}ms`);
  });

  console.log('\n🔎 [ekzist] engine — edge cases');

  await test('NaN score → invalid result', () => {
    const result = evaluateEkzist({
      domains: [{ domain: 'MEANING', score: NaN }],
    });

    assert(result.valid === false, 'NaN score should produce invalid result');
    assert(result.warnings.length > 0, 'should have warnings');
  });

  await test('Infinity score → invalid result', () => {
    const result = evaluateEkzist({
      domains: [{ domain: 'MEANING', score: Infinity }],
    });

    assert(result.valid === false, 'Infinity score should produce invalid result');
  });

  await test('negative score → invalid result', () => {
    const result = evaluateEkzist({
      domains: [{ domain: 'MEANING', score: -5 }],
    });

    assert(result.valid === false, 'negative score should produce invalid result');
  });

  await test('score > 100 → invalid result', () => {
    const result = evaluateEkzist({
      domains: [{ domain: 'MEANING', score: 150 }],
    });

    assert(result.valid === false, 'score > 100 should produce invalid result');
  });

  await test('empty domains array → invalid result', () => {
    const result = evaluateEkzist({ domains: [] });

    assert(result.valid === false, 'empty domains should produce invalid result');
  });

  await test('null input → invalid result', () => {
    const result = evaluateEkzist(null as never);

    assert(result.valid === false, 'null input should produce invalid result');
  });

  console.log('\n🔎 [ekzist] health report');

  await test('health report returns expected shape', () => {
    const report = getEkzistHealthReport();

    assert(report.personaId === EKZIST_PERSONA_ID, `unexpected personaId: ${report.personaId}`);
    assert(report.contractVersion === EKZIST_CONTRACT_VERSION, 'unexpected contract version');
    assert(typeof report.evaluations === 'number', 'evaluations must be a number');
    assert(report.performanceMaxMs === 50, `expected 50ms, got ${report.performanceMaxMs}`);
    assert(report.apiResponseMaxMs === 200, `expected 200ms, got ${report.apiResponseMaxMs}`);
  });

  await test('evaluations counter increments', () => {
    _resetEkzistMetrics();
    evaluateEkzist({ domains: [{ domain: 'MEANING', score: 60 }] });
    evaluateEkzist({ domains: [{ domain: 'GROWTH', score: 70 }] });

    const report = getEkzistHealthReport();
    assert(report.evaluations === 2, `expected 2 evaluations, got ${report.evaluations}`);
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
