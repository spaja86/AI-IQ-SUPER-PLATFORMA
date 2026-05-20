import { buildDigitalnaIndustrijaKreditniRizik } from '../../lib/digitalna-industrija-kreditni-rizik';
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
  console.log('\n🏦 Digitalna Industrija Kreditni Rizik — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaKreditniRizik('test-user-id');

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

  await test('KPI je konzistentan sa izloženostima', () => {
    assertEqual(r.kpi.ukupnoIzlozenosti, r.izlozenosti.length, 'ukupnoIzlozenosti');
    assertEqual(
      r.kpi.aktivnih,
      r.izlozenosti.filter((i) => i.status === 'aktivan').length,
      'aktivnih',
    );
    assertEqual(
      r.kpi.kasnjenje,
      r.izlozenosti.filter((i) => i.status === 'kasnjenje').length,
      'kasnjenje',
    );
    assertEqual(
      r.kpi.restrukturiranih,
      r.izlozenosti.filter((i) => i.status === 'restrukturiran').length,
      'restrukturiranih',
    );
  });

  await test('Izloženosti imaju obavezna polja', () => {
    for (const i of r.izlozenosti) {
      assert(i.id.length > 0, 'id nije prazan');
      assert(i.klijent.length > 0, 'klijent nije prazan');
      assert(i.iznosRsd > 0, 'iznosRsd > 0');
      assert(i.rocnostMeseci > 0, 'rocnostMeseci > 0');
      assert(i.pdPct > 0, 'pdPct > 0');
      assert(i.lgdPct > 0, 'lgdPct > 0');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '57.4.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1305, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n🏦 Rezultat: ${passed} prošlo, ${failed} palo`);
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
