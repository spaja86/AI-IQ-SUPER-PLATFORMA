import { buildDigitalnaIndustrijaKursneRazlike } from '../../lib/digitalna-industrija-kursne-razlike';
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
  console.log('\n📉 Digitalna Industrija Kursne Razlike — Unit Test Suite\n');

  const r = buildDigitalnaIndustrijaKursneRazlike('test-user-id');

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

  await test('KPI je konzistentan sa kursnim razlikama', () => {
    assertEqual(r.kpi.ukupnoDokumenata, r.kursneRazlike.length, 'ukupnoDokumenata');
    assertEqual(
      r.kpi.knjizeno,
      r.kursneRazlike.filter((stavka) => stavka.status === 'knjizeno').length,
      'knjizeno',
    );
    assertEqual(
      r.kpi.naUsaglasavanju,
      r.kursneRazlike.filter((stavka) => stavka.status === 'na-usaglasavanju').length,
      'naUsaglasavanju',
    );
    assertEqual(
      r.kpi.netoRazlikaRsd,
      r.kursneRazlike.reduce((sum, stavka) => sum + stavka.kursnaRazlikaRsd, 0),
      'netoRazlikaRsd',
    );
  });

  await test('Stavke imaju obavezna polja i validne kurseve', () => {
    for (const stavka of r.kursneRazlike) {
      assert(stavka.dokument.length > 0, 'dokument nije prazan');
      assert(stavka.valuta.length > 0, 'valuta nije prazna');
      assert(stavka.iznosOsnovice > 0, 'osnovica > 0');
      assert(stavka.prethodniKurs > 0, 'prethodniKurs > 0');
      assert(stavka.tekuciKurs > 0, 'tekuciKurs > 0');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1337, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1159, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1260, 'TOTAL_ROUTES baseline');
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
