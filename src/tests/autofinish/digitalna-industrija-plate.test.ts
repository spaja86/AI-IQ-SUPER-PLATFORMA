import { buildDigitalnaIndustrijaPlate } from '../../lib/digitalna-industrija-plate';
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
  console.log('\n💰 Digitalna Industrija Plate — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaPlate('test-user-id');

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

  await test('KPI je konzistentan sa platama', () => {
    assertEqual(r.kpi.ukupnoPozicija, r.plate.length, 'ukupnoPozicija');
    assertEqual(
      r.kpi.ukupnoZaposlenih,
      r.plate.reduce((sum, p) => sum + p.brojZaposlenih, 0),
      'ukupnoZaposlenih',
    );
    assertEqual(
      r.kpi.ukupnoFondRsd,
      r.plate.reduce((sum, p) => sum + p.ukupnoFondRsd, 0),
      'ukupnoFondRsd',
    );
  });

  await test('Plate imaju obavezna polja', () => {
    for (const p of r.plate) {
      assert(p.id.length > 0, 'id nije prazan');
      assert(p.nazivPozicije.length > 0, 'nazivPozicije nije prazan');
      assert(p.brutoRsd > 0, 'brutoRsd > 0');
      assert(p.netoRsd > 0, 'netoRsd > 0');
      assert(p.netoRsd < p.brutoRsd, 'neto < bruto');
      assert(p.brojZaposlenih > 0, 'brojZaposlenih > 0');
      assert(p.ukupnoFondRsd === p.brutoRsd * p.brojZaposlenih, 'fond = bruto * broj');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '57.6.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1307, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n💰 Rezultat: ${passed} prošlo, ${failed} palo`);
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
