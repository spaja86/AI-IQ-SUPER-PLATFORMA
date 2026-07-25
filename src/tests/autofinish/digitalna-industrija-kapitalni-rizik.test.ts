import { buildDigitalnaIndustrijaKapitalniRizik } from '../../lib/digitalna-industrija-kapitalni-rizik';
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
  console.log('\n🏛️ Digitalna Industrija Kapitalni Rizik — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaKapitalniRizik('test-user-id');

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
      r.kpi.uskladjenih,
      r.pozicije.filter((p) => p.status === 'uskladjen').length,
      'uskladjenih',
    );
    assertEqual(
      r.kpi.upozorenja,
      r.pozicije.filter((p) => p.status === 'upozorenje').length,
      'upozorenja',
    );
    assertEqual(
      r.kpi.prekrsaja,
      r.pozicije.filter((p) => p.status === 'prekrsaj').length,
      'prekrsaja',
    );
  });

  await test('Pozicije imaju obavezna polja', () => {
    for (const p of r.pozicije) {
      assert(p.id.length > 0, 'id nije prazan');
      assert(p.entitet.length > 0, 'entitet nije prazan');
      assert(p.kapitalRsd > 0, 'kapitalRsd > 0');
      assert(p.rwaPonderisanaAktivaRsd > 0, 'rwaPonderisanaAktivaRsd > 0');
      assert(p.carPct > 0, 'carPct > 0');
      assert(p.minimalniCarPct > 0, 'minimalniCarPct > 0');
      assert(['uskladjen', 'upozorenje', 'prekrsaj'].includes(p.status), `status validan: ${p.status}`);
    }
  });

  await test('Verzija odgovara APP_VERSION', () => {
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1441, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1256, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1396, 'TOTAL_ROUTES baseline');
  });

  console.log(`\n🏛️ Rezultat: ${passed} prošlo, ${failed} palo`);
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
