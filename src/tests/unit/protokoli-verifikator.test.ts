// Unit Test — Protokoli Verifikator
// Pokretanje: npx tsx src/tests/unit/protokoli-verifikator.test.ts

import { runProtokolVerifikacija } from '../../lib/protokoli/verifikator';
import type { Protokol } from '../../lib/protokoli/types';

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

function buildSample(override?: Partial<Protokol>): Protokol {
  return {
    id: 'test-protokol',
    naziv: 'Test Auth Protokol',
    verzija: 'v1.0',
    kategorija: 'autentifikacioni',
    status: 'aktivan',
    opis: 'Token based auth i secure transport',
    kapacitet: '100 req/s',
    latency: '< 5ms',
    kreiran: new Date().toISOString(),
    azuriran: new Date().toISOString(),
    vlasnickiModul: 'unit-test',
    izvor: 'spaja-protokoli',
    ...override,
  };
}

async function runTests(): Promise<void> {
  console.log('\n🧪 Protokoli Verifikator Test Suite\n');

  await test('Verifikator vraća 6 provera', () => {
    const result = runProtokolVerifikacija(buildSample());
    assert(result.ukupnoProvera === 6, 'ukupnoProvera mora biti 6');
    assert(result.checks.length === 6, 'checks length mora biti 6');
  });

  await test('Validan protokol prolazi verifikaciju', () => {
    const result = runProtokolVerifikacija(buildSample());
    assert(result.uspesno === true, 'validan protokol mora biti uspesan');
    assert(result.neuspesneProvere === 0, 'ne sme imati neuspesne provere');
  });

  await test('Protokol sa velikim latency pada latency check', () => {
    const result = runProtokolVerifikacija(buildSample({ latency: '< 99ms' }));
    assert(result.uspesno === false, 'verifikacija mora pasti');
    assert(result.neuspesneProvere > 0, 'mora imati neuspesne provere');
    const latencyCheck = result.checks.find((check) => check.naziv === 'Latency Check');
    assert(Boolean(latencyCheck), 'Latency Check mora postojati');
    assert(latencyCheck?.prolaz === false, 'Latency Check mora pasti');
  });

  await test('Duration je prisutan za sve provere', () => {
    const result = runProtokolVerifikacija(buildSample());
    for (const check of result.checks) {
      assert(check.durationMs >= 1, 'durationMs mora biti >= 1');
    }
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
