import { buildDigitalnaIndustrijaDevizniOdlivi } from '../../lib/digitalna-industrija-devizni-odlivi';
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
  console.log('\n💸 Digitalna Industrija Devizni Odlivi — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaDevizniOdlivi('test-user-id');

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

  await test('KPI je konzistentan sa odlivima', () => {
    assertEqual(r.kpi.ukupnoOdliva, r.odlivi.length, 'ukupnoOdliva');
    assertEqual(
      r.kpi.odobreno,
      r.odlivi.filter((stavka) => stavka.status === 'odobreno').length,
      'odobreno',
    );
    assertEqual(
      r.kpi.naProveri,
      r.odlivi.filter((stavka) => stavka.status === 'na-proveri').length,
      'naProveri',
    );
    assertEqual(
      r.kpi.zadrzano,
      r.odlivi.filter((stavka) => stavka.status === 'zadrzano').length,
      'zadrzano',
    );
  });

  await test('Odlivi imaju obavezna polja', () => {
    for (const stavka of r.odlivi) {
      assert(stavka.entitet.length > 0, 'entitet nije prazan');
      assert(stavka.namena.length > 0, 'namena nije prazna');
      assert(stavka.iznos > 0, 'iznos > 0');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '56.9.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1300, 'AUTOFINISH_COUNT');
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
