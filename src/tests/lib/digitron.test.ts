// SpajaUltraOmegaCore -∞Ω+∞ — DIGITRON Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  DIGITRON_API_RESPONSE_MAX_MS,
  DIGITRON_CONTRACT_VERSION,
  DIGITRON_LOOKUP_MAX_MS,
  DIGITRON_MAX_LATENCY_MS,
  DIGITRON_MODULE_VERSION,
  DIGITRON_PERFORMANCE_MAX_MS,
  DIGITRON_PERSONA_ID,
  DIGITRON_SUCCESSOR_OF,
  DIGITRON_REGISTRY,
  evaluateDigitron,
  getDigitronDescriptor,
  getDigitronHealthReport,
  listDigitronDescriptors,
  _resetDigitronMetrics,
} from '../../lib/digitron';

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
  _resetDigitronMetrics();

  console.log('\n🔎 [digitron] constants');
  await test('contract and module versions are set', () => {
    assert(DIGITRON_CONTRACT_VERSION === 'v1', 'contract version mismatch');
    assert(DIGITRON_MODULE_VERSION.length > 0, 'module version missing');
  });

  await test('successor and persona are locked', () => {
    assert(DIGITRON_SUCCESSOR_OF === 'digit-engine', `unexpected successor: ${DIGITRON_SUCCESSOR_OF}`);
    assert(DIGITRON_PERSONA_ID === 'digitron-core', `unexpected persona: ${DIGITRON_PERSONA_ID}`);
  });

  console.log('\n🔎 [digitron] registry');
  await test('registry includes all 10 digits', () => {
    assert(Object.keys(DIGITRON_REGISTRY).length === 10, 'registry size must be 10');
    for (let digit = 0; digit <= 9; digit++) {
      assert(getDigitronDescriptor(digit) !== undefined, `missing descriptor for digit ${digit}`);
    }
  });

  await test('lookup rejects invalid digits', () => {
    assert(getDigitronDescriptor(-1) === undefined, 'expected undefined for -1');
    assert(getDigitronDescriptor(10) === undefined, 'expected undefined for 10');
    assert(getDigitronDescriptor(NaN) === undefined, 'expected undefined for NaN');
    assert(getDigitronDescriptor(Infinity) === undefined, 'expected undefined for Infinity');
  });

  await test('list returns ordered 0..9 digits', () => {
    const list = listDigitronDescriptors();
    assert(list.length === 10, `expected 10 descriptors, got ${list.length}`);
    list.forEach((descriptor, index) => {
      assert(descriptor.id === index, `expected descriptor id ${index}, got ${descriptor.id}`);
    });
  });

  console.log('\n🔎 [digitron] evaluate');
  await test('evaluate returns deterministic valid result for stable input', () => {
    const payload = {
      referenceId: 'digitron-ok',
      digit: 9,
      mode: 'NATIVE' as const,
      signalStrength: 88,
      syncScore: 86,
      resilienceScore: 84,
      latencyMs: 24,
    };

    const first = evaluateDigitron(payload);
    const second = evaluateDigitron(payload);

    assert(first.valid === true, 'expected first result valid=true');
    assert(first.status === 'STELLAR', `expected STELLAR, got ${first.status}`);
    assert(first.recommendedAction === 'SCALE_NATIVE', `expected SCALE_NATIVE, got ${first.recommendedAction}`);
    assert(first.overallScore === second.overallScore, 'overall score must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
  });

  await test('evaluate returns invalid result for unsupported mode', () => {
    const result = evaluateDigitron({
      digit: 4,
      mode: 'TUNNEL' as never,
      signalStrength: 80,
      syncScore: 80,
      resilienceScore: 80,
      latencyMs: 20,
    });
    assert(result.valid === false, 'expected valid=false');
    assert(result.status === 'LEGACY_FALLBACK', `unexpected status ${result.status}`);
  });

  await test(`evaluate rejects latency above ${DIGITRON_MAX_LATENCY_MS}ms`, () => {
    const result = evaluateDigitron({
      digit: 4,
      mode: 'HYBRID',
      signalStrength: 80,
      syncScore: 80,
      resilienceScore: 80,
      latencyMs: DIGITRON_MAX_LATENCY_MS + 1,
    });
    assert(result.valid === false, 'expected valid=false for high latency');
  });

  console.log('\n🔎 [digitron] KPI checks');
  await test(`single lookup average <= ${DIGITRON_LOOKUP_MAX_MS}ms`, () => {
    const start = Date.now();
    for (let i = 0; i < 200; i++) getDigitronDescriptor(7);
    const avg = (Date.now() - start) / 200;
    assert(avg <= DIGITRON_LOOKUP_MAX_MS, `lookup avg ${avg.toFixed(2)}ms exceeds ${DIGITRON_LOOKUP_MAX_MS}ms`);
  });

  await test(`engine evaluation average <= ${DIGITRON_PERFORMANCE_MAX_MS}ms`, () => {
    const payload = {
      digit: 7,
      mode: 'HYBRID' as const,
      signalStrength: 70,
      syncScore: 75,
      resilienceScore: 73,
      latencyMs: 34,
    };
    const start = Date.now();
    for (let i = 0; i < 200; i++) evaluateDigitron(payload);
    const avg = (Date.now() - start) / 200;
    assert(avg <= DIGITRON_PERFORMANCE_MAX_MS, `evaluation avg ${avg.toFixed(2)}ms exceeds ${DIGITRON_PERFORMANCE_MAX_MS}ms`);
  });

  await test(`health report exposes KPI <= ${DIGITRON_API_RESPONSE_MAX_MS}ms target`, () => {
    const report = getDigitronHealthReport();
    assert(report.personaId === DIGITRON_PERSONA_ID, `unexpected persona ${report.personaId}`);
    assert(report.evaluationMaxMs === DIGITRON_PERFORMANCE_MAX_MS, 'evaluation KPI mismatch');
    assert(report.lookupMaxMs === DIGITRON_LOOKUP_MAX_MS, 'lookup KPI mismatch');
    assert(report.apiResponseMaxMs === DIGITRON_API_RESPONSE_MAX_MS, 'api KPI mismatch');
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
