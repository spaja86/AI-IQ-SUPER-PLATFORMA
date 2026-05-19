import { buildValidatorPoslovnihRacuna } from '../../lib/validator-poslovnih-racuna';
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
  console.log('\n✅ Validator Poslovnih Računa — Unit Test Suite\n');

  const r = buildValidatorPoslovnihRacuna('test-user');

  await test('Vraća status=aktivan i validan timestamp', () => {
    assertEqual(r.status, 'aktivan', 'status');
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Summary je konzistentan', () => {
    assertEqual(r.summary.ukupnoRacuna, r.validacije.length, 'ukupnoRacuna');
    assertEqual(r.summary.prolaza + r.summary.upozorenja, r.summary.ukupnoProvera, 'prolaz+upozorenja');
  });

  await test('Svaki račun ima format/compliance/operativa provere', () => {
    for (const validacija of r.validacije) {
      const nivoi = new Set(validacija.stavke.map((s) => s.nivo));
      assert(nivoi.has('format'), `${validacija.racunId} nema format nivo`);
      assert(nivoi.has('compliance'), `${validacija.racunId} nema compliance nivo`);
      assert(nivoi.has('operativa'), `${validacija.racunId} nema operativa nivo`);
    }
  });

  await test('Verzija i brojači su ažurirani za novu rutu + API', () => {
    assertEqual(APP_VERSION, '56.3.0', 'APP_VERSION');
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
