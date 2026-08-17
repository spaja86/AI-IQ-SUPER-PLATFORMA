// SpajaUltraOmegaCore -∞Ω+∞ — EPRINCIP Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetEPrincipMetrics,
  evaluateEPrincip,
  getEPrincipHealthReport,
  EPRINCIP_CONTRACT_VERSION,
  EPRINCIP_DEFAULT_MINIMUM_SCORE,
  EPRINCIP_PERFORMANCE_MAX_MS,
  EPRINCIP_PERSONA_ID,
} from '../../lib/eprincip';

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

function assertClose(actual: number, expected: number, tolerance = 0.001, label = ''): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

async function runTests(): Promise<void> {
  _resetEPrincipMetrics();

  console.log('\n🔎 [eprincip] constants');

  await test('contract version is non-empty', () => {
    assert(EPRINCIP_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(EPRINCIP_PERSONA_ID === 'eprincip-governance', `unexpected persona id: ${EPRINCIP_PERSONA_ID}`);
  });

  await test('default minimum score is stable', () => {
    assert(EPRINCIP_DEFAULT_MINIMUM_SCORE === 70, `expected 70, got ${EPRINCIP_DEFAULT_MINIMUM_SCORE}`);
  });

  console.log('\n🔎 [eprincip] engine');

  await test('evaluates weighted principle alignment', () => {
    const result = evaluateEPrincip({
      referenceId: 'baseline',
      principles: [
        { id: 'security', label: 'Security', score: 90, weight: 0.5, required: true, evidenceCount: 3 },
        { id: 'performance', label: 'Performance', score: 82, weight: 0.3, required: true, evidenceCount: 2 },
        { id: 'ux', label: 'UX', score: 70, weight: 0.2, evidenceCount: 1 },
      ],
    });

    assert(result.valid, 'result should be valid');
    assertClose(result.overallScore, 83.6, 0.001, 'overallScore');
    assert(result.status === 'ALIGNED', `expected ALIGNED, got ${result.status}`);
    assert(result.coveragePct === 100, `expected 100, got ${result.coveragePct}`);
  });

  await test('required principle below minimum score is invalid', () => {
    const result = evaluateEPrincip({
      minimumScore: 80,
      principles: [
        { id: 'security', label: 'Security', score: 79, weight: 1, required: true, evidenceCount: 1 },
      ],
    });

    assert(!result.valid, 'result should be invalid');
    assert(result.requiredSatisfied === false, 'requiredSatisfied should be false');
    assert(result.warnings.some((warning) => warning.includes('below minimumScore 80')), 'warning must mention threshold');
  });

  await test('missing evidence creates warning but keeps optional principles valid', () => {
    const result = evaluateEPrincip({
      principles: [
        { id: 'security', label: 'Security', score: 88, weight: 1, required: true, evidenceCount: 1 },
        { id: 'docs', label: 'Docs', score: 78, weight: 1, evidenceCount: 0 },
      ],
    });

    assert(result.valid, 'optional missing evidence should remain valid');
    assert(result.coveragePct === 50, `expected 50, got ${result.coveragePct}`);
    assert(result.warnings.some((warning) => warning.includes('has no evidence')), 'must warn about missing evidence');
  });

  await test('score above 100 is invalid', () => {
    const result = evaluateEPrincip({
      principles: [{ id: 'security', label: 'Security', score: 101, weight: 1 }],
    });
    assert(!result.valid, 'score above 100 must be invalid');
  });

  await test('division by zero guarded when total weight is zero', () => {
    const result = evaluateEPrincip({
      principles: [
        { id: 'security', label: 'Security', score: 80, weight: 0 },
        { id: 'performance', label: 'Performance', score: 70, weight: 0 },
      ],
    });

    assert(!result.valid, 'zero total weight must be invalid');
    assert(result.warnings[0].includes('division-by-zero'), 'must include guard warning');
  });

  await test('health report reflects latest evaluation', () => {
    evaluateEPrincip({
      principles: [{ id: 'security', label: 'Security', score: 95, weight: 1, required: true, evidenceCount: 1 }],
    });

    const health = getEPrincipHealthReport();
    assert(health.evaluations > 0, 'health.evaluations should be > 0');
    assert(health.lastStatus === 'EXEMPLARY', `expected EXEMPLARY, got ${health.lastStatus}`);
    assert(typeof health.lastEvaluatedAt === 'string' && health.lastEvaluatedAt.length > 0, 'lastEvaluatedAt must be set');
  });

  console.log('\n🔎 [eprincip] performance');

  await test(`evaluateEPrincip completes within ${EPRINCIP_PERFORMANCE_MAX_MS}ms`, () => {
    const start = performance.now();
    const samples = 150;
    for (let i = 0; i < samples; i++) {
      evaluateEPrincip({
        principles: [
          { id: 'security', label: 'Security', score: 75 + (i % 20), weight: 0.4, required: true, evidenceCount: 2 },
          { id: 'performance', label: 'Performance', score: 70 + (i % 15), weight: 0.35, required: true, evidenceCount: 1 },
          { id: 'ux', label: 'UX', score: 60 + (i % 10), weight: 0.25, evidenceCount: 1 },
        ],
      });
    }

    const average = (performance.now() - start) / samples;
    assert(average <= EPRINCIP_PERFORMANCE_MAX_MS, `average ${average.toFixed(2)}ms > ${EPRINCIP_PERFORMANCE_MAX_MS}ms`);
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
