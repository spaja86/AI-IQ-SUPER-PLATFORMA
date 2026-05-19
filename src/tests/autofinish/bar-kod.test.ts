import {
  buildBarKod,
  generateJedinicaFunkcije,
  generatePlatformBarKod,
} from '../../lib/bar-kod';
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
  console.log('\n🔢 BAR KOD — Unit Test Suite\n');

  const rezultat = buildBarKod('test-user-id');
  const prvi = rezultat.stavke[0];

  await test('Vraća aktivan rezultat sa stavkama', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(rezultat.stavke.length > 0, 'stavke nisu prazne');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('BAR KOD generator je determinističan i daje 13 cifara', () => {
    const a = generatePlatformBarKod('platforma-demo');
    const b = generatePlatformBarKod('platforma-demo');
    assertEqual(a, b, 'determinističan bar kod');
    assert(String(a).length === 13, 'bar kod ima 13 cifara');
  });

  await test('Jedinica funkcije je deterministična po ID-u i rednom broju', () => {
    const a = generateJedinicaFunkcije('platforma-demo', 1);
    const b = generateJedinicaFunkcije('platforma-demo', 1);
    const c = generateJedinicaFunkcije('platforma-demo', 2);
    assertEqual(a, b, 'deterministična jedinica');
    assert(a !== c, 'različit redni broj daje različitu vrednost');
  });

  await test('KPI je konzistentan sa generisanim stavkama', () => {
    assertEqual(rezultat.kpi.ukupnoBarKodova, rezultat.stavke.length, 'ukupnoBarKodova');
    assertEqual(
      rezultat.kpi.sumaJedinicaFunkcije,
      rezultat.stavke.reduce((sum, stavka) => sum + stavka.jedinicaFunkcije, 0),
      'sumaJedinicaFunkcije',
    );
    assertEqual(
      rezultat.kpi.minBarKod,
      Math.min(...rezultat.stavke.map((stavka) => stavka.barKod)),
      'minBarKod',
    );
    assertEqual(
      rezultat.kpi.maxBarKod,
      Math.max(...rezultat.stavke.map((stavka) => stavka.barKod)),
      'maxBarKod',
    );
  });

  await test('Prva stavka ima očekivana polja i vrednosti', () => {
    assert(prvi.platformaId.length > 0, 'platformaId nije prazan');
    assert(prvi.naziv.length > 0, 'naziv nije prazan');
    assert(prvi.kategorija.length > 0, 'kategorija nije prazna');
    assert(String(prvi.barKod).length === 13, 'stavka bar kod ima 13 cifara');
    assert(prvi.jedinicaFunkcije >= 0, 'jedinica funkcije nije negativna');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '56.8.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1299, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n🔢 Rezultat: ${passed} prošlo, ${failed} palo`);
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
