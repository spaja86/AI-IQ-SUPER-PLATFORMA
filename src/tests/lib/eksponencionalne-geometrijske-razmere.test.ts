import { dimenzije } from '../../lib/dimenzije';
import { getEksponencionalneGeometrijskeRazmere } from '../../lib/eksponencionalne-geometrijske-razmere';
import { eksponencijalneFunkcije } from '../../lib/oktavne-eksponencijalne-funkcije';

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

async function runTests(): Promise<void> {
  console.log('\n📐 Eksponencionalne Geometrijske Razmere — Domain Test Suite\n');

  const razmere = getEksponencionalneGeometrijskeRazmere();

  await test('Scope i model su zaključani', () => {
    assertEqual(razmere.scope, 'kombinovano', 'scope');
    assertEqual(razmere.oktavniModel, '12-oktava', 'oktavniModel');
  });

  await test('Broj oktava prati eksponencijalni model', () => {
    assertEqual(razmere.oktavneRazmere.brojOktava, eksponencijalneFunkcije.length, 'brojOktava');
    assertEqual(razmere.oktavneRazmere.ratioMatrica.length, eksponencijalneFunkcije.length, 'ratioMatrica redovi');
    assert(razmere.oktavneRazmere.ratioMatrica.every((red) => red.length === eksponencijalneFunkcije.length), 'ratioMatrica kolone');
  });

  await test('Dijagonala ratio matrice je ~1', () => {
    razmere.oktavneRazmere.ratioMatrica.forEach((red, i) => {
      assert(Math.abs(red[i] - 1) < 0.0001, `dijagonala [${i},${i}] mora biti 1`);
    });
  });

  await test('Dimenzionalni prelazi su konzistentni', () => {
    assertEqual(razmere.dimenzionalneRazmere.brojNivoa, dimenzije.length, 'brojNivoa');
    assertEqual(razmere.dimenzionalneRazmere.prelazi.length, Math.max(0, dimenzije.length - 1), 'broj prelaza');
    razmere.dimenzionalneRazmere.prelazi.forEach((p) => {
      assert(p.stepeniRazmera > 1, 'stepeniRazmera mora biti > 1');
      assert(Number.isFinite(p.snagaRazmera), 'snagaRazmera mora biti finite');
    });
  });

  await test('Kombinovani indeks je finite i pozitivan', () => {
    assert(Number.isFinite(razmere.agregati.kombinovaniIndeks), 'kombinovaniIndeks finite');
    assert(razmere.agregati.kombinovaniIndeks > 0, 'kombinovaniIndeks > 0');
  });

  await test('Validacija ne prijavljuje nevalidan model', () => {
    assert(razmere.validacija.status !== 'nevalidno', 'status validacije ne sme biti nevalidno');
    assert(razmere.validacija.finite, 'validacija finite = true');
    assert(razmere.validacija.invalidInputCount === 0, 'invalidInputCount = 0');
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
