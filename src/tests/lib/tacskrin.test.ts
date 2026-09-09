// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetTacskrinMetrics,
  evaluateTacskrin,
  getTacskrinHealthReport,
  OFFICIAL_TACSKRIN_SEQUENCE,
  TACSKRIN_CONTRACT_VERSION,
  TACSKRIN_DISCLAIMER,
  TACSKRIN_PERFORMANCE_MAX_MS,
  TACSKRIN_PERSONA_ID,
  TACSKRIN_SLUG,
} from '../../lib/tacskrin';

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
  _resetTacskrinMetrics();

  console.log('\n🔎 [tacskrin] constants');

  await test('contract version is non-empty', () => {
    assert(TACSKRIN_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(TACSKRIN_PERSONA_ID === 'tacskrin-core', `unexpected persona id: ${TACSKRIN_PERSONA_ID}`);
  });

  await test('slug is stable', () => {
    assert(TACSKRIN_SLUG === 'tacskrin', `unexpected slug: ${TACSKRIN_SLUG}`);
  });

  await test('official sequence has 15 layers', () => {
    assert(OFFICIAL_TACSKRIN_SEQUENCE.length === 15, `expected 15 layers, got ${OFFICIAL_TACSKRIN_SEQUENCE.length}`);
  });

  await test('disclaimer is always defined', () => {
    assert(TACSKRIN_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  console.log('\n🔎 [tacskrin] engine');

  await test('exact official sequence is equivalent', () => {
    const result = evaluateTacskrin({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE',
    });

    assert(result.valid, 'result should be valid');
    assert(result.equivalent, 'result should be equivalent');
    assert(result.status === 'EKVIVALENTNA', `expected EKVIVALENTNA, got ${result.status}`);
    assert(result.warnings.length === 0, 'equivalent result should have no warnings');
  });

  await test('wrong order with strict mode produces ODSTUPANJE', () => {
    const result = evaluateTacskrin({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN APAR GOKON DJUNDRE',
    });

    assert(result.valid, 'result should remain valid');
    assert(!result.equivalent, 'result should not be equivalent');
    assert(result.status === 'ODSTUPANJE', `expected ODSTUPANJE, got ${result.status}`);
    assert(result.orderMatch === false, 'orderMatch should be false');
  });

  await test('unknown layer produces NEPOZNATO', () => {
    const result = evaluateTacskrin({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE XENO',
    });

    assert(!result.valid, 'unknown layer should mark result invalid');
    assert(!result.equivalent, 'unknown layer cannot be equivalent');
    assert(result.status === 'NEPOZNATO', `expected NEPOZNATO, got ${result.status}`);
    assert(result.unknownLayers.includes('XENO'), 'unknown layer should be listed');
  });

  await test('empty payload fallback is INVALID', () => {
    const result = evaluateTacskrin({});

    assert(!result.valid, 'empty payload should be invalid');
    assert(result.status === 'INVALID', `expected INVALID, got ${result.status}`);
    assert(result.recommendedAction === 'ISPRAVI_FORMAT', `unexpected action: ${result.recommendedAction}`);
  });

  await test('NaN signalStrength returns invalid result', () => {
    const result = evaluateTacskrin({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE',
      signalStrength: NaN,
    });

    assert(!result.valid, 'NaN signalStrength must be invalid');
    assert(result.status === 'INVALID', `expected INVALID, got ${result.status}`);
  });

  await test('Infinity signalStrength returns invalid result', () => {
    const result = evaluateTacskrin({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE',
      signalStrength: Infinity,
    });

    assert(!result.valid, 'Infinity signalStrength must be invalid');
    assert(result.status === 'INVALID', `expected INVALID, got ${result.status}`);
  });

  await test('performance gate: durationMs <= 50ms', () => {
    const result = evaluateTacskrin({
      projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE',
    });

    assert(
      result.durationMs <= TACSKRIN_PERFORMANCE_MAX_MS,
      `duration ${result.durationMs} exceeds ${TACSKRIN_PERFORMANCE_MAX_MS}ms`,
    );
  });

  await test('health report tracks evaluations and latest status', () => {
    _resetTacskrinMetrics();
    evaluateTacskrin({ projectionExpression: 'REAL NIKOS DIKOS FRANKEN DEMBA GAKU REKO NAKUS GOMBLE GEPI NAU JUN GOKON APAR DJUNDRE' });
    evaluateTacskrin({ projectionExpression: 'REAL NIKOS DIKOS FRANKEN' });

    const health = getTacskrinHealthReport();
    assert(health.evaluations === 2, `expected 2 evaluations, got ${health.evaluations}`);
    assert(health.lastStatus === 'ODSTUPANJE', `expected last status ODSTUPANJE, got ${health.lastStatus}`);
    assert(health.lastEvaluatedAt !== null, 'lastEvaluatedAt must be set');
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
