import { buildDigitalnaIndustrijaPozicije } from '../../lib/digitalna-industrija-pozicije';
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
  console.log('\n👥 Digitalna Industrija Pozicije — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaPozicije('test-user-id');

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
      r.kpi.ukupnoPlaniranoIzvrsilaca,
      r.pozicije.reduce((sum, p) => sum + p.brojIzvrsilaca, 0),
      'ukupnoPlaniranoIzvrsilaca',
    );
    assertEqual(
      r.kpi.ukupnoPopunjenoIzvrsilaca,
      r.pozicije.reduce((sum, p) => sum + p.popunjeno, 0),
      'ukupnoPopunjenoIzvrsilaca',
    );
    assertEqual(
      r.kpi.popunjenihPozicija,
      r.pozicije.filter((p) => p.status === 'popunjena').length,
      'popunjenihPozicija',
    );
    assertEqual(
      r.kpi.uZaposljavanju,
      r.pozicije.filter((p) => p.status === 'u-zaposljavanju').length,
      'uZaposljavanju',
    );
    assertEqual(
      r.kpi.planiranih,
      r.pozicije.filter((p) => p.status === 'planirana').length,
      'planiranih',
    );
  });

  await test('Pozicije imaju obavezna polja', () => {
    for (const p of r.pozicije) {
      assert(p.id.length > 0, 'id nije prazan');
      assert(p.nazivPozicije.length > 0, 'nazivPozicije nije prazan');
      assert(p.brojIzvrsilaca > 0, 'brojIzvrsilaca > 0');
      assert(p.popunjeno >= 0, 'popunjeno >= 0');
      assert(p.popunjeno <= p.brojIzvrsilaca, 'popunjeno <= brojIzvrsilaca');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '56.6.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1297, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n👥 Rezultat: ${passed} prošlo, ${failed} palo`);
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
