import { buildGeneratorZaPoslovneRacune } from '../../lib/generator-za-poslovne-racune';
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
  console.log('\n🏦 Generator za Poslovne Račune — Unit Test Suite\n');

  const r = buildGeneratorZaPoslovneRacune('test-user');

  await test('Vraća status=aktivan i validan timestamp', () => {
    assertEqual(r.status, 'aktivan', 'status');
    assert(!Number.isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('Scope zaključan kao simulacioni model', () => {
    assertEqual(r.scopeV1.simulacioniModel, true, 'scope.simulacioniModel');
    assertEqual(r.kontekst.model, 'simulacioni-in-memory', 'kontekst.model');
    assertEqual(r.kontekst.trajnoCuvanje, false, 'kontekst.trajnoCuvanje');
  });

  await test('Generiše obavezne tipove i valute računa', () => {
    assertEqual(r.racuni.length, 3, 'racuni.length');
    assert(r.racuni.some((x) => x.tip === 'dinarski-poslovni' && x.valuta === 'RSD'), 'RSD račun');
    assert(r.racuni.some((x) => x.tip === 'devizni-eur' && x.valuta === 'EUR'), 'EUR račun');
    assert(r.racuni.some((x) => x.tip === 'devizni-usd' && x.valuta === 'USD'), 'USD račun');
  });

  await test('Output format ima broj računa, IBAN-like i metadata', () => {
    for (const racun of r.racuni) {
      assert(racun.brojRacuna.startsWith('AIIQ-'), 'brojRacuna format');
      assert(racun.ibanLike.startsWith('RS35AIIQ'), 'ibanLike format');
      assert(typeof racun.metadata.generator === 'string' && racun.metadata.generator.length > 0, 'metadata.generator');
      assert(!Number.isNaN(Date.parse(racun.metadata.timestamp)), 'metadata.timestamp');
    }
  });

  await test('Summary je konzistentan', () => {
    assertEqual(r.summary.ukupnoRacuna, r.racuni.length, 'summary.ukupnoRacuna');
    assertEqual(r.summary.aktivnihRacuna + r.summary.predloga, r.racuni.length, 'aktivni+predlozi');
  });

  await test('Audit i preporuke su popunjeni', () => {
    assert(r.audit.length >= 2, 'audit zapisi');
    assert(r.preporuke.length >= 2, 'preporuke');
  });

  await test('Verzija i brojači su ažurirani za novu rutu + API', () => {
    assertEqual(APP_VERSION, '54.2.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1139, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1232, 'TOTAL_ROUTES');
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
