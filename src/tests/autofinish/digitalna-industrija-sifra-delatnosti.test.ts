import { buildDigitalnaIndustrijaSifraDelatnosti } from '../../lib/digitalna-industrija-sifra-delatnosti';
import {
  APP_VERSION,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  AUTOFINISH_COUNT,
} from '../../lib/constants';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

async function runTests(): Promise<void> {
  console.log('\n🏷️ Digitalna Industrija Šifra Delatnosti — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaSifraDelatnosti('test-user-id');

  await test('Vraća objekat i status=aktivan', () => {
    assert(typeof r === 'object' && r !== null, 'rezultat je objekat');
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('Timestamp je validan ISO string', () => {
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Jurisdikcija i nosilac registra su popunjeni', () => {
    assertEqual(r.jurisdikcija, 'Republika Srbija', 'jurisdikcija');
    assert(r.registarNosioc.length > 0, 'registarNosioc');
  });

  await test('KPI je konzistentan sa delatnostima', () => {
    assertEqual(r.kpi.ukupnoDelatnosti, r.delatnosti.length, 'ukupnoDelatnosti');
    assertEqual(
      r.kpi.primarnih,
      r.delatnosti.filter((stavka) => stavka.status === 'primarna').length,
      'primarnih',
    );
    assertEqual(
      r.kpi.sekundarnih,
      r.delatnosti.filter((stavka) => stavka.status === 'sekundarna').length,
      'sekundarnih',
    );
  });

  await test('Delatnosti imaju šifru i naziv', () => {
    for (const stavka of r.delatnosti) {
      assert(stavka.sifraDelatnosti.length >= 4, 'šifra delatnosti je validna');
      assert(stavka.nazivDelatnosti.length > 0, 'naziv delatnosti nije prazan');
      assert(stavka.entitet.length > 0, 'entitet nije prazan');
      assert(stavka.opis.length > 0, 'opis nije prazan');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '56.3.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1294, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
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
