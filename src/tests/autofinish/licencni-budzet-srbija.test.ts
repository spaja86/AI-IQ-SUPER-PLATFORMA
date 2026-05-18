import { buildLicencniBudzetSrbija } from '../../lib/licencni-budzet-srbija';
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
  console.log('\n📜 Licencni Budzet Srbija — Unit Test Suite\n');

  const r = buildLicencniBudzetSrbija('test-user-id');

  await test('Vraća objekat i status=aktivan', () => {
    assert(typeof r === 'object' && r !== null, 'rezultat je objekat');
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('Timestamp je validan ISO string', () => {
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Jurisdikcija je Republika Srbija', () => {
    assertEqual(r.jurisdikcija, 'Republika Srbija', 'jurisdikcija');
  });

  await test('Budžet je konzistentan', () => {
    const suma = r.stavke.reduce((acc, s) => acc + s.godisnjiTrosakRSD, 0);
    assertEqual(r.rezervisanoRSD, suma, 'rezervisanoRSD');
    assertEqual(r.ukupanGodisnjiBudzetRSD - r.rezervisanoRSD, r.slobodnoRSD, 'slobodnoRSD');
    assert(r.slobodnoRSD >= 0, 'slobodnoRSD >= 0');
  });

  await test('KPI vrednosti su konzistentne', () => {
    assertEqual(r.kpi.ukupnoLicenci, r.stavke.length, 'ukupnoLicenci');
    assertEqual(
      r.kpi.aktivnaNabavka,
      r.stavke.filter((s) => s.status === 'aktivna-nabavka').length,
      'aktivnaNabavka',
    );
    assertEqual(
      r.kpi.visokiPrioritet,
      r.stavke.filter((s) => s.prioritet === 'visok').length,
      'visokiPrioritet',
    );
  });

  await test('Sve stavke imaju obavezna polja', () => {
    for (const s of r.stavke) {
      assert(s.id.length > 0, 'id');
      assert(s.naziv.length > 0, 'naziv');
      assert(s.regulator.length > 0, 'regulator');
      assert(s.rok.length > 0, 'rok');
      assert(s.godisnjiTrosakRSD > 0, 'godišnji trošak > 0');
    }
  });

  await test('Verzije i brojači su ažurirani', () => {
    assertEqual(APP_VERSION, '54.1.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1272, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1138, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1230, 'TOTAL_ROUTES');
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
