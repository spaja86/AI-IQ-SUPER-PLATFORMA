// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  _resetPozadineSvihProjekcijaMetrics,
  evaluatePozadineSvihProjekcija,
  getPozadineSvihProjekcijaHealthReport,
  OFFICIAL_PROJECTION_SEQUENCE,
  POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION,
  POZADINE_SVIH_PROJEKCIJA_DISCLAIMER,
  POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS,
  POZADINE_SVIH_PROJEKCIJA_PERSONA_ID,
  POZADINE_SVIH_PROJEKCIJA_SLUG,
} from '../../lib/pozadine-svih-projekcija';

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
  _resetPozadineSvihProjekcijaMetrics();

  console.log('\n🔎 [pozadine-svih-projekcija] constants');

  await test('contract version is non-empty', () => {
    assert(POZADINE_SVIH_PROJEKCIJA_CONTRACT_VERSION.length > 0, 'contract version must be defined');
  });

  await test('persona id is stable', () => {
    assert(
      POZADINE_SVIH_PROJEKCIJA_PERSONA_ID === 'pozadine-svih-projekcija-core',
      `unexpected persona id: ${POZADINE_SVIH_PROJEKCIJA_PERSONA_ID}`,
    );
  });

  await test('slug is stable', () => {
    assert(POZADINE_SVIH_PROJEKCIJA_SLUG === 'pozadine-svih-projekcija', `unexpected slug: ${POZADINE_SVIH_PROJEKCIJA_SLUG}`);
  });

  await test('official sequence has 12 layers and NIKOS duplicated twice', () => {
    assert(OFFICIAL_PROJECTION_SEQUENCE.length === 12, `expected 12 layers, got ${OFFICIAL_PROJECTION_SEQUENCE.length}`);
    const nikosCount = OFFICIAL_PROJECTION_SEQUENCE.filter((layer) => layer === 'NIKOS').length;
    assert(nikosCount === 2, `expected NIKOS count 2, got ${nikosCount}`);
  });

  await test('disclaimer is always defined', () => {
    assert(POZADINE_SVIH_PROJEKCIJA_DISCLAIMER.length > 0, 'disclaimer must be defined');
  });

  console.log('\n🔎 [pozadine-svih-projekcija] engine');

  await test('exact official sequence is equivalent', () => {
    const result = evaluatePozadineSvihProjekcija({
      referenceId: 'eq-seq',
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
    });

    assert(result.valid, 'result should be valid');
    assert(result.equivalent, 'result should be equivalent');
    assert(result.status === 'EKVIVALENTNA', `expected EKVIVALENTNA, got ${result.status}`);
    assert(result.warnings.length === 0, 'equivalent result should have no warnings');
  });

  await test('equivalence remains deterministic for same input', () => {
    const input = {
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
      strictOrder: true,
    };

    const first = evaluatePozadineSvihProjekcija(input);
    const second = evaluatePozadineSvihProjekcija(input);

    assert(first.equivalent === second.equivalent, 'equivalence must be deterministic');
    assert(first.status === second.status, 'status must be deterministic');
    assert(first.matchRatio === second.matchRatio, 'matchRatio must be deterministic');
  });

  await test('missing duplicate NIKOS produces ODSTUPANJE', () => {
    const result = evaluatePozadineSvihProjekcija({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE JAKRE GIMBA',
    });

    assert(result.valid, 'result should remain valid');
    assert(!result.equivalent, 'result should not be equivalent');
    assert(result.status === 'ODSTUPANJE', `expected ODSTUPANJE, got ${result.status}`);
    assert(result.missingLayers.includes('NIKOS'), 'NIKOS should be reported as missing duplicate');
    assert(result.warnings.some((warning) => warning.includes('NIKOS')), 'warning should mention NIKOS duplicate rule');
  });

  await test('unknown layer produces NEPOZNATO and fallback action', () => {
    const result = evaluatePozadineSvihProjekcija({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA XENO',
    });

    assert(!result.valid, 'unknown layer should mark result invalid');
    assert(!result.equivalent, 'unknown layer cannot be equivalent');
    assert(result.status === 'NEPOZNATO', `expected NEPOZNATO, got ${result.status}`);
    assert(result.unknownLayers.includes('XENO'), 'unknown layer should be listed');
  });

  await test('empty payload fallback is INVALID', () => {
    const result = evaluatePozadineSvihProjekcija({});

    assert(!result.valid, 'empty payload should be invalid');
    assert(result.status === 'INVALID', `expected INVALID, got ${result.status}`);
    assert(result.recommendedAction === 'ISPRAVI_FORMAT', `unexpected action: ${result.recommendedAction}`);
  });

  await test('NaN signalStrength returns invalid result', () => {
    const result = evaluatePozadineSvihProjekcija({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
      signalStrength: NaN,
    });

    assert(!result.valid, 'NaN signalStrength must be invalid');
    assert(result.status === 'INVALID', `expected INVALID, got ${result.status}`);
  });

  await test('Infinity signalStrength returns invalid result', () => {
    const result = evaluatePozadineSvihProjekcija({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
      signalStrength: Infinity,
    });

    assert(!result.valid, 'Infinity signalStrength must be invalid');
    assert(result.status === 'INVALID', `expected INVALID, got ${result.status}`);
  });

  await test('performance gate: durationMs <= 50ms', () => {
    const result = evaluatePozadineSvihProjekcija({
      projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA',
    });

    assert(
      result.durationMs <= POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS,
      `duration ${result.durationMs} exceeds ${POZADINE_SVIH_PROJEKCIJA_PERFORMANCE_MAX_MS}ms`,
    );
  });

  await test('health report tracks evaluations and latest status', () => {
    _resetPozadineSvihProjekcijaMetrics();
    evaluatePozadineSvihProjekcija({ projectionExpression: 'DUKER NIKOS ZINGO NJUKER ZINGAN DISPO DJAMA FRIKO DJAPRE NIKOS JAKRE GIMBA' });
    evaluatePozadineSvihProjekcija({ projectionExpression: 'DUKER NIKOS ZINGO NJUKER' });

    const health = getPozadineSvihProjekcijaHealthReport();
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
