import { buildDigitalnaIndustrijaPibMb } from '../../lib/digitalna-industrija-pib-mb';
import { companies } from '../../lib/companies';
import { platforms } from '../../lib/platforms';
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
  console.log('\n🧾 Digitalna Industrija PIB/M/B — Unit Test Suite (#1265)\n');

  const r = buildDigitalnaIndustrijaPibMb('test-user');

  await test('Vraća status=aktivan i validan timestamp', () => {
    assertEqual(r.status, 'aktivan', 'status');
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Krovni identitet ima hitnu proceduru', () => {
    assertEqual(r.digitalnaIndustrija.statusZahteva, 'hitna_procedura', 'digitalnaIndustrija.statusZahteva');
    assert(r.digitalnaIndustrija.pib.includes('ZAHTEV_U_TOKU'), 'krovni PIB placeholder');
    assert(r.digitalnaIndustrija.maticniBroj.includes('ZAHTEV_U_TOKU'), 'krovni MB placeholder');
  });

  await test('Registar pokriva sve kompanije i sve platforme', () => {
    assertEqual(r.registar.kompanije.length, companies.length, 'registar kompanije count');
    assertEqual(r.registar.platforme.length, platforms.length, 'registar platforme count');
  });

  await test('Entiteti sadrže krovni + kompanije + platforme', () => {
    assertEqual(
      r.entiteti.length,
      1 + companies.length + platforms.length,
      'entiteti count',
    );
  });

  await test('Za svaki entitet postoje APR i Poreska zahtevi', () => {
    assertEqual(r.zahtevi.length, r.entiteti.length * 2, 'zahtevi count');
    assert(r.zahtevi.every((z) => z.statusZahteva === 'hitna_procedura'), 'statusZahteva hitna_procedura');
    assert(r.zahtevi.every((z) => z.status === 'spreman_za_slanje'), 'status spreman_za_slanje');
  });

  await test('Konstante su ažurirane za #1265', () => {
    assertEqual(APP_VERSION, '53.4.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1130, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1216, 'TOTAL_ROUTES');
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
