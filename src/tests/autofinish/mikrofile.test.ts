import { buildMikrofile } from '../../lib/mikrofile';
import { mikrofileSekvence } from '../../lib/sekvence/mikrofile-page';

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
  console.log('\n📁 MIKROFILE — Unit Test Suite\n');

  const rezultat = buildMikrofile('test-user-id');

  await test('buildMikrofile vraća validan rezultat i stavke', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(rezultat.stavke.length > 0, 'stavke nisu prazne');
    assert(rezultat.kpi.ukupnoFajlova > 0, 'ukupnoFajlova > 0');
    assert(rezultat.kpi.ukupnaVelicina > 0, 'ukupnaVelicina > 0');
  });

  await test('KPI je konzistentan sa stavkama', () => {
    assertEqual(rezultat.kpi.ukupnoFajlova, rezultat.stavke.length, 'ukupnoFajlova');
    assertEqual(
      rezultat.kpi.ukupnaVelicina,
      rezultat.stavke.reduce((sum, stavka) => sum + stavka.velicina, 0),
      'ukupnaVelicina',
    );
    const zbirTipova = Object.values(rezultat.kpi.poTipu).reduce((sum, value) => sum + value, 0);
    const zbirStatusa = Object.values(rezultat.kpi.poStatusu).reduce((sum, value) => sum + value, 0);
    assertEqual(zbirTipova, rezultat.stavke.length, 'zbir tipova');
    assertEqual(zbirStatusa, rezultat.stavke.length, 'zbir statusa');
  });

  await test('MIKROFILE sekvence imaju očekivanu strukturu', () => {
    assert(mikrofileSekvence.length >= 4, 'mikrofile sekvence >= 4');
    assert(mikrofileSekvence.some((s) => s.tip === 'hero'), 'hero sekvenca postoji');
    assert(mikrofileSekvence.some((s) => s.tip === 'tabela'), 'tabela sekvenca postoji');
    assert(mikrofileSekvence.some((s) => s.tip === 'cta'), 'cta sekvenca postoji');
  });

  console.log(`\n📁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
