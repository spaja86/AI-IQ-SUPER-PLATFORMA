// Autofinish #1235 — Unit Testovi buildLaureatskiPuls()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-puls.test.ts

import { buildLaureatskiPuls } from '../../lib/laureatski-puls';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
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
  console.log('\n🫀  LAUREATSKI PULS — Unit Test Suite (#1235)\n');

  const r = buildLaureatskiPuls('test-user-id');

  console.log('📦 Top-level schema (#1235)');
  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });
  await test('status === "aktivan"', () => {
    assertEqual(r.status, 'aktivan', 'status');
  });
  await test('otkucaji je niz', () => {
    assert(Array.isArray(r.otkucaji), 'otkucaji niz');
  });
  await test('otkucaji ima 32 elementa (8×4)', () => {
    assertEqual(r.otkucaji.length, 32, 'otkucaji.length');
  });

  console.log('\n📦 Pulsni indikatori (#1235)');
  await test('pulsniKoeficijent je 0–1', () => {
    assert(r.pulsniKoeficijent >= 0 && r.pulsniKoeficijent <= 1, `pulsniKoeficijent: ${r.pulsniKoeficijent}`);
  });
  await test('pulsnaStabilnost je 0–1', () => {
    assert(r.pulsnaStabilnost >= 0 && r.pulsnaStabilnost <= 1, `pulsnaStabilnost: ${r.pulsnaStabilnost}`);
  });
  await test('prosecanPulsHz > 0', () => {
    assert(r.prosecanPulsHz > 0, `prosecanPulsHz: ${r.prosecanPulsHz}`);
  });
  await test('maksimalniPulsHz >= minimalniPulsHz', () => {
    assert(r.maksimalniPulsHz >= r.minimalniPulsHz, `${r.maksimalniPulsHz} >= ${r.minimalniPulsHz}`);
  });
  await test('pulsniOpsegHz >= 0', () => {
    assert(r.pulsniOpsegHz >= 0, `pulsniOpsegHz: ${r.pulsniOpsegHz}`);
  });

  console.log('\n📦 Otkucaji (#1235)');
  await test('svaki otkucaj ima validan sloj 1–4', () => {
    for (const o of r.otkucaji) {
      assert(o.sloj >= 1 && o.sloj <= 4, `sloj: ${o.sloj}`);
    }
  });
  await test('svaki otkucaj ima validan t 0–7', () => {
    for (const o of r.otkucaji) {
      assert(o.t >= 0 && o.t <= 7, `t: ${o.t}`);
    }
  });
  await test('svaki otkucaj ima harmonik 1–4', () => {
    for (const o of r.otkucaji) {
      assert(o.harmonik >= 1 && o.harmonik <= 4, `harmonik: ${o.harmonik}`);
    }
  });
  await test('frekvencija > 0', () => {
    for (const o of r.otkucaji) {
      assert(o.frekvencija > 0, `frekvencija: ${o.frekvencija}`);
    }
  });
  await test('intenzitet je 0–1', () => {
    for (const o of r.otkucaji) {
      assert(o.intenzitet >= 0 && o.intenzitet <= 1, `intenzitet: ${o.intenzitet}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const o of r.otkucaji) {
      assert(o.normalizovano >= 0 && o.normalizovano <= 1, `normalizovano: ${o.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1235)');
  await test('AUTOFINISH_COUNT === 1243', () => {
    assertEqual(AUTOFINISH_COUNT, 1243, 'AUTOFINISH_COUNT=1243');
  });
  await test('APP_VERSION === "51.2.0"', () => {
    assertEqual(APP_VERSION, '51.2.0', 'APP_VERSION=51.2.0');
  });
  await test('TOTAL_API_ROUTES === 1112', () => {
    assertEqual(TOTAL_API_ROUTES, 1112, 'TOTAL_API_ROUTES=1112');
  });
  await test('TOTAL_ROUTES === 1185', () => {
    assertEqual(TOTAL_ROUTES, 1185, 'TOTAL_ROUTES=1185');
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
