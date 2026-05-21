import { buildDigitalnaIndustrijaPibMb } from '../../lib/digitalna-industrija-pib-mb';
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
  console.log('\n🧾 Digitalna Industrija PIB/MB — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaPibMb('test-user-id');

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

  await test('KPI je konzistentan sa entitetima', () => {
    assertEqual(r.kpi.ukupnoEntiteta, r.entiteti.length, 'ukupnoEntiteta');
    assertEqual(
      r.kpi.aktivnih,
      r.entiteti.filter((entitet) => entitet.status === 'aktivan').length,
      'aktivnih',
    );
    assertEqual(
      r.kpi.uPripremi,
      r.entiteti.filter((entitet) => entitet.status === 'u-pripremi').length,
      'uPripremi',
    );
  });

  await test('Entiteti imaju PIB i matični broj', () => {
    for (const entitet of r.entiteti) {
      assert(entitet.pib.length >= 8, 'PIB je validan format');
      assert(entitet.maticniBroj.length >= 8, 'matični broj je validan format');
      assert(entitet.naziv.length > 0, 'naziv nije prazan');
      assert(entitet.sediste.length > 0, 'sedište nije prazno');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '59.16.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1337, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1159, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1260, 'TOTAL_ROUTES');
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
