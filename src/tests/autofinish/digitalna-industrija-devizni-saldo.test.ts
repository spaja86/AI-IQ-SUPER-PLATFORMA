import { buildDigitalnaIndustrijaDevizniSaldo } from '../../lib/digitalna-industrija-devizni-saldo';
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
  console.log('\n⚖️ Digitalna Industrija Devizni Saldo — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaDevizniSaldo('test-user-id');

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

  await test('KPI je konzistentan sa stavkama', () => {
    assertEqual(r.kpi.ukupnoStavki, r.stavke.length, 'ukupnoStavki');
    assertEqual(
      r.kpi.prilivi,
      r.stavke.filter((stavka) => stavka.tok === 'priliv').length,
      'prilivi',
    );
    assertEqual(
      r.kpi.odlivi,
      r.stavke.filter((stavka) => stavka.tok === 'odliv').length,
      'odlivi',
    );
  });

  await test('Stavke imaju obavezna polja', () => {
    for (const stavka of r.stavke) {
      assert(stavka.entitet.length > 0, 'entitet nije prazan');
      assert(stavka.iznos > 0, 'iznos > 0');
      assert(stavka.tok === 'priliv' || stavka.tok === 'odliv', 'tok je validan');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '57.1.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1302, 'AUTOFINISH_COUNT');
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
