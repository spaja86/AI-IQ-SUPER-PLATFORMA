import { buildDigitalnaIndustrijaBeneficije } from '../../lib/digitalna-industrija-beneficije';
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
  console.log('\n🎁 Digitalna Industrija Beneficije — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaBeneficije('test-user-id');

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

  await test('KPI je konzistentan sa beneficijama', () => {
    assertEqual(r.kpi.ukupnoBeneficija, r.beneficije.length, 'ukupnoBeneficija');
    assertEqual(
      r.kpi.ukupnoKorisnika,
      r.beneficije.reduce((sum, b) => sum + b.brojKorisnika, 0),
      'ukupnoKorisnika',
    );
    assertEqual(
      r.kpi.ukupnoTrosakRsd,
      r.beneficije.reduce((sum, b) => sum + b.ukupnoTrosak, 0),
      'ukupnoTrosakRsd',
    );
  });

  await test('Beneficije imaju obavezna polja', () => {
    for (const b of r.beneficije) {
      assert(b.id.length > 0, 'id nije prazan');
      assert(b.naziv.length > 0, 'naziv nije prazan');
      assert(b.vrednostRsdGodisnje > 0, 'vrednost > 0');
      assert(b.brojKorisnika > 0, 'korisnika > 0');
      assert(b.ukupnoTrosak === b.vrednostRsdGodisnje * b.brojKorisnika, 'ukupno = vrednost * korisnici');
      assert(b.pokrivenostPct >= 0 && b.pokrivenostPct <= 100, 'pokrivenost 0-100');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '57.3.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1304, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n🎁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
