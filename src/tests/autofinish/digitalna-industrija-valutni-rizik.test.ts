import { buildDigitalnaIndustrijaValutniRizik } from '../../lib/digitalna-industrija-valutni-rizik';
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
  console.log('\n📊 Digitalna Industrija Valutni Rizik — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaValutniRizik('test-user-id');

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
    assertEqual(r.kpi.ukupnoPortfolija, r.izlozenosti.length, 'ukupnoPortfolija');
    assertEqual(
      r.kpi.stabilni,
      r.izlozenosti.filter((stavka) => stavka.status === 'stabilan').length,
      'stabilni',
    );
    assertEqual(
      r.kpi.povecani,
      r.izlozenosti.filter((stavka) => stavka.status === 'povecan').length,
      'povecani',
    );
    assertEqual(
      r.kpi.kriticni,
      r.izlozenosti.filter((stavka) => stavka.status === 'kritican').length,
      'kriticni',
    );
  });

  await test('Stavke imaju obavezna polja i validne limite', () => {
    for (const stavka of r.izlozenosti) {
      assert(stavka.portfolio.length > 0, 'portfolio nije prazan');
      assert(stavka.valuta.length > 0, 'valuta nije prazna');
      assert(stavka.otvorenaPozicijaRsd > 0, 'otvorenaPozicijaRsd > 0');
      assert(stavka.limitRsd > 0, 'limitRsd > 0');
      assert(stavka.iskoriscenostLimitaPct > 0, 'iskoriscenostLimitaPct > 0');
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
