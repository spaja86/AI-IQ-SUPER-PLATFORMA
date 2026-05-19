import { buildDigitalnaIndustrijaKursnaLista } from '../../lib/digitalna-industrija-kursna-lista';
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
  console.log('\n💱 Digitalna Industrija Kursna Lista — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaKursnaLista('test-user-id');

  await test('Vraća objekat i status=aktivan', () => {
    assert(typeof r === 'object' && r !== null, 'rezultat je objekat');
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('Timestamp je validan ISO string', () => {
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Jurisdikcija i izvor su popunjeni', () => {
    assertEqual(r.jurisdikcija, 'Republika Srbija', 'jurisdikcija');
    assert(r.izvor.length > 0, 'izvor nije prazan');
  });

  await test('KPI je konzistentan sa kursnom listom', () => {
    assertEqual(r.kpi.ukupnoParova, r.kursnaLista.length, 'ukupnoParova');
    assertEqual(
      r.kpi.aktivniParovi,
      r.kursnaLista.filter((stavka) => stavka.status === 'aktivan').length,
      'aktivniParovi',
    );
    assertEqual(
      r.kpi.proveraParovi,
      r.kursnaLista.filter((stavka) => stavka.status === 'na-proveri').length,
      'proveraParovi',
    );
  });

  await test('Kursevi imaju obavezna polja i validan spread', () => {
    for (const stavka of r.kursnaLista) {
      assert(stavka.par.length > 0, 'par nije prazan');
      assert(stavka.kupovni > 0, 'kupovni > 0');
      assert(stavka.srednji > 0, 'srednji > 0');
      assert(stavka.prodajni > 0, 'prodajni > 0');
      assert(stavka.prodajni >= stavka.kupovni, 'prodajni >= kupovni');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '56.2.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1293, 'AUTOFINISH_COUNT');
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
