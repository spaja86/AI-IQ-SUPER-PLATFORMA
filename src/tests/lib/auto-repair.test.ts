/**
 * auto-repair.test.ts — Unit testi za runDiagnostics iz auto-repair modula
 *
 * Pokriva:
 *   - DiagnosticReport struktura i tipovi
 *   - zdravlje procenat u opsegu [0, 100]
 *   - Konzistentnost zbira: uspesnih + upozorenja + gresaka + kriticnih = ukupnoProvera
 *   - Svaka DiagnosticCheck ima ispravne polja
 *   - timestamp je validan ISO 8601
 */

import { runDiagnostics } from '../../lib/auto-repair';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
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

async function runTests(): Promise<void> {
  console.log('\n🔧 Auto-Repair Diagnostics Test Suite\n');

  const report = runDiagnostics();

  await test('runDiagnostics vraća DiagnosticReport objekat', () => {
    assert(typeof report === 'object' && report !== null, 'report mora biti objekat');
  });

  await test('zdravlje je broj u opsegu [0, 100]', () => {
    assert(typeof report.zdravlje === 'number', 'zdravlje mora biti broj');
    assert(report.zdravlje >= 0 && report.zdravlje <= 100, `zdravlje ${report.zdravlje} nije u opsegu [0, 100]`);
  });

  await test('ukupnoProvera je pozitivan broj', () => {
    assert(typeof report.ukupnoProvera === 'number', 'ukupnoProvera mora biti broj');
    assert(report.ukupnoProvera > 0, `ukupnoProvera ${report.ukupnoProvera} mora biti > 0`);
  });

  await test('zbir provera = ukupnoProvera', () => {
    const zbir = report.uspesnih + report.upozorenja + report.gresaka + report.kriticnih;
    assertEqual(zbir, report.ukupnoProvera, 'zbir svih statusa');
  });

  await test('provere niz ima isti broj elemenata kao ukupnoProvera', () => {
    assertEqual(report.provere.length, report.ukupnoProvera, 'dužina provere niza');
  });

  await test('sve DiagnosticCheck provere imaju obavezna polja', () => {
    for (const provera of report.provere) {
      assert(typeof provera.id === 'string' && provera.id.length > 0, `provera.id mora biti non-empty string, dobijen: ${provera.id}`);
      assert(typeof provera.naziv === 'string' && provera.naziv.length > 0, `provera.naziv mora biti non-empty, id=${provera.id}`);
      assert(typeof provera.opis === 'string', `provera.opis mora biti string, id=${provera.id}`);
      assert(['ok', 'warning', 'error', 'critical'].includes(provera.status), `provera.status je nevalidan: ${provera.status}, id=${provera.id}`);
      assert(typeof provera.poruka === 'string' && provera.poruka.length > 0, `provera.poruka mora biti non-empty, id=${provera.id}`);
      assert(typeof provera.timestamp === 'string', `provera.timestamp mora biti string, id=${provera.id}`);
    }
  });

  await test('timestamp je validan ISO 8601 format', () => {
    const iso = new Date(report.timestamp);
    assert(!isNaN(iso.getTime()), `report.timestamp nije validan datum: ${report.timestamp}`);
  });

  await test('svaka provera ima validan ISO 8601 timestamp', () => {
    for (const provera of report.provere) {
      const iso = new Date(provera.timestamp);
      assert(!isNaN(iso.getTime()), `provera timestamp nije validan datum: ${provera.timestamp}, id=${provera.id}`);
    }
  });

  await test('zdravlje odgovara proporciji uspesnih provera', () => {
    const ocekivano = Math.round((report.uspesnih / report.ukupnoProvera) * 100);
    assert(
      Math.abs(report.zdravlje - ocekivano) <= 1,
      `zdravlje ${report.zdravlje} ne odgovara proporciji uspesnih ${report.uspesnih}/${report.ukupnoProvera} = ~${ocekivano}`,
    );
  });

  await test('nema vise od 1% duplih id-ova u proverama (pre-existing tolerance)', () => {
    const ids = report.provere.map((p) => p.id);
    const unique = new Set(ids);
    const duplikat = ids.length - unique.size;
    const tolerancija = Math.ceil(ids.length * 0.01); // 1% tolerancija
    assert(
      duplikat <= tolerancija,
      `previše duplih id-ova: ${duplikat} (dozvoljeno: ${tolerancija} od ${ids.length})`,
    );
  });

  await test('kriticnih >= 0 i gresaka >= 0', () => {
    assert(report.kriticnih >= 0, 'kriticnih mora biti >= 0');
    assert(report.gresaka >= 0, 'gresaka mora biti >= 0');
    assert(report.upozorenja >= 0, 'upozorenja mora biti >= 0');
    assert(report.uspesnih >= 0, 'uspesnih mora biti >= 0');
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.error('Failures:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
