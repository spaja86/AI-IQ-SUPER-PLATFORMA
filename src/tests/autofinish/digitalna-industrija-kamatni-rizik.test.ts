import { buildDigitalnaIndustrijaKamatniRizik } from '../../lib/digitalna-industrija-kamatni-rizik';
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
  console.log('\n📊 Digitalna Industrija Kamatni Rizik — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaKamatniRizik('test-user-id');

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

  await test('KPI je konzistentan sa pozicijama', () => {
    assertEqual(r.kpi.ukupnoPozicija, r.pozicije.length, 'ukupnoPozicija');
    assertEqual(
      r.kpi.aktivnih,
      r.pozicije.filter((p) => p.status === 'aktivan').length,
      'aktivnih',
    );
    assertEqual(
      r.kpi.zatvorenih,
      r.pozicije.filter((p) => p.status === 'zatvoren').length,
      'zatvorenih',
    );
  });

  await test('Pozicije imaju obavezna polja', () => {
    for (const p of r.pozicije) {
      assert(p.id.length > 0, 'id nije prazan');
      assert(p.instrument.length > 0, 'instrument nije prazan');
      assert(p.nominalnaVrednostRsd > 0, 'nominalnaVrednostRsd > 0');
      assert(p.kamatnaStopaGodisnjaPct > 0, 'kamatnaStopaGodisnjaPct > 0');
      assert(p.trajanjeMeseci > 0, 'trajanjeMeseci > 0');
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
