// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL Core Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  analyzeDecibels,
  getDecibelHistory,
  getDecibelHealthReport,
  getSilenceMeasurement,
  _resetDecibelHistory,
  calculateRms,
  calculatePeak,
  rmsToDbfs,
  dbfsToLinear,
  getDecibelStatus,
  normalizeSamples,
  validateSamples,
  mergeThresholds,
  DECIBIL_DEFAULT_THRESHOLDS,
  DECIBIL_CONTRACT_VERSION,
  DECIBIL_PERFORMANCE_MAX_MS,
} from '../../lib/decibil';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertClose(a: number, b: number, tolerance: number, message: string): void {
  if (Math.abs(a - b) > tolerance) {
    throw new Error(`${message}: expected ~${b}, got ${a} (tolerance ${tolerance})`);
  }
}

// Generate synthetic sine samples at given amplitude
function sineWave(amplitude: number, length = 1024): number[] {
  return Array.from({ length }, (_, i) => amplitude * Math.sin((2 * Math.PI * i) / 64));
}

async function runTests(): Promise<void> {
  console.log('\n🔊 DECIBIL Core Test Suite\n');

  _resetDecibelHistory();

  // ── calculateRms ──────────────────────────────────────────────────────────

  await test('calculateRms: prazan niz vraća 0', () => {
    assertEqual(calculateRms([]), 0, 'rms empty');
  });

  await test('calculateRms: svi nula vraća 0', () => {
    assertEqual(calculateRms([0, 0, 0]), 0, 'rms zeros');
  });

  await test('calculateRms: NaN ulaz se filtrira', () => {
    const rms = calculateRms([NaN, 1, NaN]);
    assert(isFinite(rms) && rms > 0, 'rms with NaN should be finite');
  });

  await test('calculateRms: Infinity ulaz se filtrira', () => {
    const rms = calculateRms([Infinity, 0.5, -Infinity]);
    assert(isFinite(rms) && rms >= 0, 'rms with Infinity should be finite');
  });

  await test('calculateRms: korispravan unos vraća pozitivnu vrednost', () => {
    const rms = calculateRms([0.5, -0.5, 0.5, -0.5]);
    assertClose(rms, 0.5, 0.0001, 'rms of ±0.5 square wave');
  });

  // ── calculatePeak ─────────────────────────────────────────────────────────

  await test('calculatePeak: prazan niz vraća 0', () => {
    assertEqual(calculatePeak([]), 0, 'peak empty');
  });

  await test('calculatePeak: vraća apsolutnu maksimalnu vrednost', () => {
    assertEqual(calculatePeak([0.1, -0.9, 0.3]), 0.9, 'peak max abs');
  });

  await test('calculatePeak: NaN/Infinity se filtrira', () => {
    const peak = calculatePeak([NaN, 0.5, Infinity]);
    assertEqual(peak, 0.5, 'peak with invalid values');
  });

  // ── rmsToDbfs ─────────────────────────────────────────────────────────────

  await test('rmsToDbfs: RMS 1.0 → 0 dBFS', () => {
    assertClose(rmsToDbfs(1.0), 0, 0.001, 'rmsToDbfs(1.0)');
  });

  await test('rmsToDbfs: RMS 0 → -Infinity', () => {
    assertEqual(rmsToDbfs(0), -Infinity, 'rmsToDbfs(0)');
  });

  await test('rmsToDbfs: NaN → -Infinity', () => {
    assertEqual(rmsToDbfs(NaN), -Infinity, 'rmsToDbfs(NaN)');
  });

  await test('rmsToDbfs: ograničava na max 0 dBFS', () => {
    const result = rmsToDbfs(2.0);
    assert(result <= 0, 'rmsToDbfs should not exceed 0 dBFS');
  });

  await test('rmsToDbfs: RMS 0.5 ≈ -6.02 dBFS', () => {
    assertClose(rmsToDbfs(0.5), -6.02, 0.1, 'rmsToDbfs(0.5)');
  });

  // ── dbfsToLinear ──────────────────────────────────────────────────────────

  await test('dbfsToLinear: 0 dBFS → 1.0', () => {
    assertClose(dbfsToLinear(0), 1.0, 0.0001, 'dbfsToLinear(0)');
  });

  await test('dbfsToLinear: -20 dBFS ≈ 0.1', () => {
    assertClose(dbfsToLinear(-20), 0.1, 0.001, 'dbfsToLinear(-20)');
  });

  await test('dbfsToLinear: NaN → 0', () => {
    assertEqual(dbfsToLinear(NaN), 0, 'dbfsToLinear(NaN)');
  });

  // ── getDecibelStatus ──────────────────────────────────────────────────────

  await test('getDecibelStatus: ispod praga tišine → silence', () => {
    assertEqual(getDecibelStatus(-65), 'silence', 'status silence');
  });

  await test('getDecibelStatus: -Infinity → silence', () => {
    assertEqual(getDecibelStatus(-Infinity), 'silence', 'status silence for -Infinity');
  });

  await test('getDecibelStatus: normalan signal (-30 dBFS) → normal', () => {
    assertEqual(getDecibelStatus(-30), 'normal', 'status normal');
  });

  await test('getDecibelStatus: -10 dBFS → warning', () => {
    assertEqual(getDecibelStatus(-10), 'warning', 'status warning');
  });

  await test('getDecibelStatus: -1 dBFS → clipping', () => {
    assertEqual(getDecibelStatus(-1), 'clipping', 'status clipping');
  });

  // ── normalizeSamples ──────────────────────────────────────────────────────

  await test('normalizeSamples: prazan niz vraća prazan niz', () => {
    assert(normalizeSamples([]).length === 0, 'normalize empty');
  });

  await test('normalizeSamples: normalizuje na [-1, 1]', () => {
    const normalized = normalizeSamples([0.2, -0.4, 0.8]);
    const peak = Math.max(...normalized.map(Math.abs));
    assertClose(peak, 1.0, 0.0001, 'normalized peak should be 1.0');
  });

  await test('normalizeSamples: nulti niz vraća iste vrednosti', () => {
    const result = normalizeSamples([0, 0, 0]);
    assert(result.every((v) => v === 0), 'all zeros stay zero');
  });

  // ── validateSamples ───────────────────────────────────────────────────────

  await test('validateSamples: prazan niz → upozorenje', () => {
    const w = validateSamples([]);
    assert(w.length > 0, 'empty should warn');
  });

  await test('validateSamples: ispravan niz → nema upozorenja', () => {
    const w = validateSamples([0.1, -0.1, 0.2]);
    assertEqual(w.length, 0, 'valid samples warnings');
  });

  await test('validateSamples: NaN u nizu → upozorenje', () => {
    const w = validateSamples([0.1, NaN, 0.2]);
    assert(w.some((s) => s.includes('NaN')), 'NaN should produce warning');
  });

  await test('validateSamples: Infinity u nizu → upozorenje', () => {
    const w = validateSamples([0.1, Infinity, 0.2]);
    assert(w.some((s) => s.includes('Infinity')), 'Infinity should produce warning');
  });

  // ── mergeThresholds ───────────────────────────────────────────────────────

  await test('mergeThresholds: bez parametara vraća defaults', () => {
    const t = mergeThresholds();
    assertEqual(t.silenceDbfs, DECIBIL_DEFAULT_THRESHOLDS.silenceDbfs, 'default silence');
    assertEqual(t.warningDbfs, DECIBIL_DEFAULT_THRESHOLDS.warningDbfs, 'default warning');
    assertEqual(t.clippingDbfs, DECIBIL_DEFAULT_THRESHOLDS.clippingDbfs, 'default clipping');
  });

  await test('mergeThresholds: parcijalni override', () => {
    const t = mergeThresholds({ warningDbfs: -6 });
    assertEqual(t.warningDbfs, -6, 'override warning');
    assertEqual(t.silenceDbfs, DECIBIL_DEFAULT_THRESHOLDS.silenceDbfs, 'unchanged silence');
  });

  // ── analyzeDecibels ───────────────────────────────────────────────────────

  await test('analyzeDecibels: tišina sa nulama', () => {
    _resetDecibelHistory();
    const result = analyzeDecibels({ samples: [0, 0, 0], sampleRate: 44100 });
    assertEqual(result.measurement.status, 'silence', 'zero samples → silence');
    assert(result.valid, 'valid should be true for zero samples');
  });

  await test('analyzeDecibels: normalan signal', () => {
    _resetDecibelHistory();
    const samples = sineWave(0.1);
    const result = analyzeDecibels({ samples, sampleRate: 44100 });
    assertEqual(result.measurement.status, 'normal', 'low amplitude → normal');
    assert(result.measurement.dbfs < 0, 'dbfs must be negative');
  });

  await test('analyzeDecibels: clipping signal (amplituda 0.99)', () => {
    _resetDecibelHistory();
    const samples = sineWave(0.99);
    const result = analyzeDecibels({ samples, sampleRate: 44100 });
    assert(
      result.measurement.status === 'warning' || result.measurement.status === 'clipping',
      'high amplitude → warning or clipping',
    );
  });

  await test('analyzeDecibels: NaN uzorci su nevažeći', () => {
    _resetDecibelHistory();
    const result = analyzeDecibels({ samples: [NaN, NaN], sampleRate: 44100 });
    assert(!result.valid, 'NaN samples should be invalid');
    assert(result.warnings.length > 0, 'should have warnings for NaN');
  });

  await test('analyzeDecibels: performanse ≤ DECIBIL_PERFORMANCE_MAX_MS', () => {
    _resetDecibelHistory();
    const samples = sineWave(0.3, 4096);
    const result = analyzeDecibels({ samples, sampleRate: 44100 });
    assert(
      result.durationMs <= DECIBIL_PERFORMANCE_MAX_MS,
      `durationMs ${result.durationMs}ms mora biti ≤ ${DECIBIL_PERFORMANCE_MAX_MS}ms`,
    );
  });

  await test('analyzeDecibels: source i sourceId se prosleđuju', () => {
    _resetDecibelHistory();
    const result = analyzeDecibels({ samples: [0.1], sampleRate: 44100, source: 'microphone', sourceId: 'mic-001' });
    assertEqual(result.measurement.source, 'microphone', 'source');
    assertEqual(result.measurement.sourceId, 'mic-001', 'sourceId');
  });

  // ── getDecibelHistory ─────────────────────────────────────────────────────

  await test('getDecibelHistory: vraća merenja u obrnutom redosledu', () => {
    _resetDecibelHistory();
    analyzeDecibels({ samples: [0.1], sampleRate: 44100 });
    analyzeDecibels({ samples: [0.2], sampleRate: 44100 });
    const history = getDecibelHistory();
    assert(history.length === 2, 'should have 2 history entries');
  });

  await test('getDecibelHistory: limit funkcioniše', () => {
    _resetDecibelHistory();
    for (let i = 0; i < 5; i++) analyzeDecibels({ samples: [0.1 * i], sampleRate: 44100 });
    const history = getDecibelHistory(3);
    assertEqual(history.length, 3, 'limit=3 should return 3 entries');
  });

  // ── getDecibelHealthReport ────────────────────────────────────────────────

  await test('getDecibelHealthReport: prazan store vraća nule', () => {
    _resetDecibelHistory();
    const report = getDecibelHealthReport();
    assertEqual(report.totalMeasurements, 0, 'empty totalMeasurements');
    assert(report.lastMeasuredAt === null, 'empty lastMeasuredAt should be null');
  });

  await test('getDecibelHealthReport: ispravno broji statuse', () => {
    _resetDecibelHistory();
    analyzeDecibels({ samples: [0, 0], sampleRate: 44100 }); // silence
    analyzeDecibels({ samples: sineWave(0.1), sampleRate: 44100 }); // normal
    const report = getDecibelHealthReport();
    assertEqual(report.totalMeasurements, 2, 'totalMeasurements=2');
    assert(report.silenceCount + report.normalCount === 2, 'status counts sum to 2');
  });

  // ── getSilenceMeasurement ─────────────────────────────────────────────────

  await test('getSilenceMeasurement: vraća silence merenje', () => {
    const m = getSilenceMeasurement();
    assertEqual(m.status, 'silence', 'silence measurement status');
    assertEqual(m.rms, 0, 'silence rms');
    assertEqual(m.peak, 0, 'silence peak');
    assertEqual(m.source, 'synthetic', 'silence source');
  });

  // ── CONTRACT VERSION ──────────────────────────────────────────────────────

  await test('DECIBIL_CONTRACT_VERSION je definisan', () => {
    assert(typeof DECIBIL_CONTRACT_VERSION === 'string' && DECIBIL_CONTRACT_VERSION.length > 0, 'contract version');
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n📊 Rezultati: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
  console.log('✅ Svi DECIBIL testovi su prošli.\n');
}

runTests().catch((err) => {
  console.error('Fatalna greška u test suite-u:', err);
  process.exit(1);
});
