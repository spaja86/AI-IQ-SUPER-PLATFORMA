import { buildDigitalnaIndustrijaHedzing } from '../../lib/digitalna-industrija-hedzing';
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
  console.log('\n🛡️ Digitalna Industrija Hedzing — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaHedzing('test-user-id');

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

  await test('KPI je konzistentan sa ugovorima', () => {
    assertEqual(r.kpi.ukupnoUgovora, r.ugovori.length, 'ukupnoUgovora');
    assertEqual(
      r.kpi.aktivnih,
      r.ugovori.filter((u) => u.status === 'aktivan').length,
      'aktivnih',
    );
    assertEqual(
      r.kpi.istek,
      r.ugovori.filter((u) => u.status === 'istekao').length,
      'istek',
    );
    assertEqual(
      r.kpi.zatvorenih,
      r.ugovori.filter((u) => u.status === 'zatvoren').length,
      'zatvorenih',
    );
  });

  await test('Ugovori imaju obavezna polja', () => {
    for (const u of r.ugovori) {
      assert(u.id.length > 0, 'id nije prazan');
      assert(u.valutaPar.length > 0, 'valutaPar nije prazan');
      assert(u.nominalnaVrednostRsd > 0, 'nominalnaVrednostRsd > 0');
      assert(u.stopa > 0, 'stopa > 0');
      assert(u.pokriveniRizikPct > 0, 'pokriveniRizikPct > 0');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '56.1.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1292, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n🛡️ Rezultat: ${passed} prošlo, ${failed} palo`);
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
