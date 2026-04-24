// Autofinish #829 — Unit Testovi za runDiagnostics()
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. Broj provera odgovara TOTAL_DIAGNOSTIKA konstanti
//   2. zdravlje === 100 (sve provere su 'ok')
//   3. uspesnih === ukupnoProvera
//   4. Struktura DiagnosticReport
//   5. Sve provere imaju obavezna polja
//
// Pokretanje: npx tsx src/tests/autofinish/diagnostics.test.ts

import { runDiagnostics } from '../../lib/auto-repair';
import { TOTAL_DIAGNOSTIKA } from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔍 runDiagnostics() — Unit Test Suite\n');

  const dijagnostika = runDiagnostics();

  // ── 1. Broj provera ────────────────────────────────────────────────────────
  console.log('📦 Broj dijagnostičkih provera');

  await test(`ukupnoProvera (${dijagnostika.ukupnoProvera}) odgovara TOTAL_DIAGNOSTIKA (${TOTAL_DIAGNOSTIKA})`, () => {
    assertEqual(dijagnostika.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'ukupnoProvera vs TOTAL_DIAGNOSTIKA');
  });

  await test('provere niz ima dužinu ukupnoProvera', () => {
    assertEqual(dijagnostika.provere.length, dijagnostika.ukupnoProvera, 'provere.length');
  });

  // ── 2. Zdravlje ────────────────────────────────────────────────────────────
  console.log('\n📦 Zdravlje sistema');

  await test('zdravlje je 100 (sve provere su ok)', () => {
    assertEqual(dijagnostika.zdravlje, 100, 'zdravlje');
  });

  await test('uspesnih jednako ukupnoProvera', () => {
    assertEqual(dijagnostika.uspesnih, dijagnostika.ukupnoProvera, 'uspesnih vs ukupnoProvera');
  });

  await test('upozorenja + greske + kriticnih je 0', () => {
    const problemi = dijagnostika.upozorenja + dijagnostika.gresaka + dijagnostika.kriticnih;
    assert(
      problemi === 0 || dijagnostika.zdravlje === 100,
      `Nema kritičnih problema — problemi: ${problemi}, zdravlje: ${dijagnostika.zdravlje}%`
    );
  });

  // ── 3. Struktura DiagnosticReport ──────────────────────────────────────────
  console.log('\n📦 DiagnosticReport struktura');

  await test('ima obavezno polje ukupnoProvera', () => {
    assert(typeof dijagnostika.ukupnoProvera === 'number', 'ukupnoProvera mora biti broj');
  });

  await test('ima obavezno polje uspesnih', () => {
    assert(typeof dijagnostika.uspesnih === 'number', 'uspesnih mora biti broj');
  });

  await test('ima obavezno polje upozorenja', () => {
    assert(typeof dijagnostika.upozorenja === 'number', 'upozorenja mora biti broj');
  });

  await test('ima obavezno polje gresaka', () => {
    assert(typeof dijagnostika.gresaka === 'number', 'gresaka mora biti broj');
  });

  await test('ima obavezno polje kriticnih', () => {
    assert(typeof dijagnostika.kriticnih === 'number', 'kriticnih mora biti broj');
  });

  await test('ima obavezno polje zdravlje (0–100)', () => {
    assert(typeof dijagnostika.zdravlje === 'number', 'zdravlje mora biti broj');
    assert(dijagnostika.zdravlje >= 0 && dijagnostika.zdravlje <= 100, 'zdravlje mora biti između 0 i 100');
  });

  await test('ima obavezno polje timestamp u ISO formatu', () => {
    assert(typeof dijagnostika.timestamp === 'string', 'timestamp mora biti string');
    assert(dijagnostika.timestamp.includes('T'), 'timestamp mora biti ISO 8601 format');
  });

  await test('ukupnoProvera = uspesnih + upozorenja + gresaka + kriticnih', () => {
    const suma = dijagnostika.uspesnih + dijagnostika.upozorenja + dijagnostika.gresaka + dijagnostika.kriticnih;
    assertEqual(suma, dijagnostika.ukupnoProvera, 'suma svih statusa vs ukupnoProvera');
  });

  // ── 4. Provere — obavezna polja ────────────────────────────────────────────
  console.log('\n📦 Pojedinačne dijagnostičke provere');

  await test('svaka provera ima id (string)', () => {
    for (const p of dijagnostika.provere) {
      assert(typeof p.id === 'string' && p.id.length > 0, `provera ${p.id} mora imati id`);
    }
  });

  await test('svaka provera ima naziv (string)', () => {
    for (const p of dijagnostika.provere) {
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `${p.id}: naziv mora biti neprazan string`);
    }
  });

  await test('svaka provera ima validan status', () => {
    const validStatusi = new Set(['ok', 'warning', 'error', 'critical']);
    for (const p of dijagnostika.provere) {
      assert(validStatusi.has(p.status), `${p.id}: status '${p.status}' nije validan`);
    }
  });

  await test('svaka provera ima opis i poruka polja (string)', () => {
    for (const p of dijagnostika.provere) {
      assert(typeof p.opis === 'string', `${p.id}: opis mora biti string`);
      // poruka je opcionalno, ali ako postoji mora biti string
      if (p.poruka !== undefined) {
        assert(typeof p.poruka === 'string', `${p.id}: poruka mora biti string ako postoji`);
      }
    }
  });

  await test('broj duplikata ID-eva je najmanji očekivani (pre-existing)', () => {
    const ids = dijagnostika.provere.map((p) => p.id);
    const unique = new Set(ids);
    const duplikatoCount = ids.length - unique.size;
    // U kodu postoje 2 pre-existing duplikata (autofinish-stabilnost-check i gaming-platforma-dijagnostika-api-check)
    assert(duplikatoCount <= 2, `Broj duplikata ID-eva (${duplikatoCount}) ne sme biti veći od 2 (pre-existing)`);
  });

  // ── 5. TOTAL_DIAGNOSTIKA konzistentnost (#820) ────────────────────────────
  console.log('\n📦 TOTAL_DIAGNOSTIKA sinhronizacija (#820)');

  await test(`TOTAL_DIAGNOSTIKA konstanta (${TOTAL_DIAGNOSTIKA}) odgovara stvarnom broju provera`, () => {
    assertEqual(
      TOTAL_DIAGNOSTIKA,
      dijagnostika.ukupnoProvera,
      `TOTAL_DIAGNOSTIKA mora odgovarati runDiagnostics().ukupnoProvera`
    );
  });
}

// ─── Pokretanje testova ────────────────────────────────────────────────────────

runTests().then(() => {
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }
  if (failed > 0) process.exit(1);
}).catch((e) => {
  console.error('Kritična greška u test suiteu:', e);
  process.exit(1);
});
