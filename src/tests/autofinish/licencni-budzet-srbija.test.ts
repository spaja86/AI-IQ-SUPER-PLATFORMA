import { buildLicencniBudzetSrbija } from '../../lib/licencni-budzet-srbija';
import {
  APP_VERSION,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
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
  console.log('\n💰 Licencni Budžet Srbija — Unit Test Suite (#1264)\n');

  const r = buildLicencniBudzetSrbija('test-user');

  await test('Vraća status=aktivan i validan timestamp', () => {
    assertEqual(r.status, 'aktivan', 'status');
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Kontekst je zaključan na Srbiju i RSD', () => {
    assertEqual(r.kontekst.drzava, 'Srbija', 'drzava');
    assertEqual(r.kontekst.valuta, 'RSD', 'valuta');
    assertEqual(r.kontekst.rezimNabavke, 'kupujemo_sve_licence', 'rezimNabavke');
  });

  await test('Summary je konzistentan', () => {
    assertEqual(r.summary.ukupnoStavki, r.stavke.length, 'ukupnoStavki == stavke.length');
    const totalModeli =
      r.summary.godisnjeBudzet + r.summary.mesecnoBudzet + r.summary.jednokratnoBudzet;
    assertEqual(totalModeli, r.summary.ukupnoRSD, 'suma modela == ukupnoRSD');
  });

  await test('Svaka stavka ima validna polja', () => {
    for (const s of r.stavke) {
      assert(s.id.length > 0, `id prazno: ${s.id}`);
      assert(s.licencaCode.length > 0, `licencaCode prazno`);
      assert(s.valuta === 'RSD', `valuta nije RSD za ${s.licencaCode}`);
      assert(s.procenjeniTrosak >= 0, `negativni trošak za ${s.licencaCode}`);
    }
  });

  await test('Sumar po kategorijama zbrojeva == ukupnoRSD', () => {
    const sumaKat = r.sumarPoKategoriji.reduce((s, k) => s + k.ukupnoRSD, 0);
    assertEqual(sumaKat, r.summary.ukupnoRSD, 'sumaKat == ukupnoRSD');
  });

  await test('Kritične stavke tačno prebrojane', () => {
    const kriticnih = r.stavke.filter((s) => s.rizik === 'kriticno').length;
    assertEqual(r.summary.kriticneStavke, kriticnih, 'kriticneStavke');
  });

  await test('Preporuke nisu prazne', () => {
    assert(r.preporuke.length >= 3, 'preporuke >= 3');
  });

  await test('Konstante su ažurirane za #1264', () => {
    assertEqual(APP_VERSION, '53.3.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1129, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1215, 'TOTAL_ROUTES');
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
