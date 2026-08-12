// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 FX Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  getFxRate,
  convertCents,
  listFxRates,
  upsertFxRate,
  getFxRateCount,
} from '../../lib/madagaskar-2/fx';
import { _resetFxRates } from '../../lib/madagaskar-2/fx';

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

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTests(): Promise<void> {
  _resetFxRates();

  // ─── Same currency ─────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] Same currency');

  await test('getFxRate same currency returns rate 1', () => {
    const r = getFxRate('EUR', 'EUR');
    assert(r !== undefined, 'Should return a rate');
    assert(r!.rate === 1, `Expected rate 1, got ${r!.rate}`);
  });

  await test('convertCents same currency returns input unchanged', () => {
    assert(convertCents(10000, 'EUR', 'EUR') === 10000, 'Should return 10000');
  });

  // ─── Direct lookup ─────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] Direct lookup');

  await test('getFxRate EUR→USD returns direct rate', () => {
    const r = getFxRate('EUR', 'USD');
    assert(r !== undefined, 'EUR→USD rate should exist');
    assert(r!.from === 'EUR' && r!.to === 'USD', 'Direction mismatch');
    assert(r!.rate > 0, 'Rate must be positive');
  });

  await test('convertCents EUR→USD converts correctly', () => {
    const rate = getFxRate('EUR', 'USD')!.rate;
    const converted = convertCents(10000, 'EUR', 'USD');
    const expected = Math.round(10000 * rate);
    assert(converted === expected, `Expected ${expected}, got ${converted}`);
  });

  // ─── Inverse lookup ────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] Inverse lookup');

  await test('getFxRate USD→EUR uses inverse of EUR→USD', () => {
    const forward = getFxRate('EUR', 'USD')!;
    const inverse = getFxRate('USD', 'EUR');
    assert(inverse !== undefined, 'Inverse lookup should work');
    assert(Math.abs(inverse!.rate - 1 / forward.rate) < 0.0001, 'Inverse rate should be 1/forward');
  });

  await test('convertCents USD→EUR inverse lookup works', () => {
    const result = convertCents(10800, 'USD', 'EUR');
    assert(result > 0, 'Converted amount must be positive');
  });

  // ─── Missing pair ──────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] Missing pair');

  await test('getFxRate returns undefined for unknown pair', () => {
    const r = getFxRate('EUR', 'XYZ');
    assert(r === undefined, 'Unknown pair should return undefined');
  });

  await test('convertCents returns 0 for unknown pair', () => {
    assert(convertCents(10000, 'EUR', 'XYZ') === 0, 'Unknown pair should return 0');
  });

  // ─── Edge cases ────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] Edge cases');

  await test('convertCents returns 0 for NaN input', () => {
    assert(convertCents(NaN, 'EUR', 'USD') === 0, 'NaN input → 0');
  });

  await test('convertCents returns 0 for negative input', () => {
    assert(convertCents(-100, 'EUR', 'USD') === 0, 'Negative input → 0');
  });

  await test('convertCents returns 0 for Infinity input', () => {
    assert(convertCents(Infinity, 'EUR', 'USD') === 0, 'Infinity → 0');
  });

  // ─── upsertFxRate ──────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] upsertFxRate');

  await test('upsertFxRate inserts a new rate', () => {
    upsertFxRate({ from: 'EUR', to: 'TESTCOIN', rate: 42.5, asOf: '2026-01-01T00:00:00Z' });
    const r = getFxRate('EUR', 'TESTCOIN');
    assert(r !== undefined && r.rate === 42.5, 'Inserted rate should be retrievable');
  });

  await test('upsertFxRate updates an existing rate', () => {
    const original = getFxRate('EUR', 'USD')!.rate;
    upsertFxRate({ from: 'EUR', to: 'USD', rate: 1.10, asOf: '2026-08-11T00:00:00Z' });
    const updated = getFxRate('EUR', 'USD')!.rate;
    assert(updated === 1.10, `Expected 1.10, got ${updated}`);
    // Reset
    upsertFxRate({ from: 'EUR', to: 'USD', rate: original, asOf: '2026-08-01T00:00:00Z' });
  });

  // ─── listFxRates + count ───────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/fx] listFxRates');

  await test('listFxRates returns array with entries', () => {
    const rates = listFxRates();
    assert(Array.isArray(rates) && rates.length > 0, 'Should return non-empty array');
  });

  await test('getFxRateCount returns positive number', () => {
    assert(getFxRateCount() > 0, 'Count should be > 0');
  });
}

runTests().then(() => {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
});
