// Autofinish #1250 — Unit Testovi buildLaureatskiKoder()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-koder.test.ts

import { buildLaureatskiKoder } from '../../lib/laureatski-koder';
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
  console.log('\n🧬  LAUREATSKI KODER — Unit Test Suite (#1250)\n');

  const r = buildLaureatskiKoder('test-user-id');

  console.log('📦 Top-level schema (#1250)');
  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });
  await test('status === "aktivan"', () => {
    assertEqual(r.status, 'aktivan', 'status');
  });
  await test('impulsi je niz', () => {
    assert(Array.isArray(r.impulsi), 'impulsi niz');
  });
  await test('impulsi ima 32 elementa', () => {
    assertEqual(r.impulsi.length, 32, 'impulsi.length');
  });

  console.log('\n📦 Koderski indikatori (#1250)');
  await test('koderskiIndeks je 0–1', () => {
    assert(r.koderskiIndeks >= 0 && r.koderskiIndeks <= 1, `koderskiIndeks: ${r.koderskiIndeks}`);
  });
  await test('koderskaStabilnost je 0–1', () => {
    assert(r.koderskaStabilnost >= 0 && r.koderskaStabilnost <= 1, `koderskaStabilnost: ${r.koderskaStabilnost}`);
  });
  await test('prosecniKoderHz > 0', () => {
    assert(r.prosecniKoderHz > 0, `prosecniKoderHz: ${r.prosecniKoderHz}`);
  });
  await test('maksimalniKoderHz >= minimalniKoderHz', () => {
    assert(r.maksimalniKoderHz >= r.minimalniKoderHz, `${r.maksimalniKoderHz} >= ${r.minimalniKoderHz}`);
  });
  await test('koderskiOpsegHz >= 0', () => {
    assert(r.koderskiOpsegHz >= 0, `koderskiOpsegHz: ${r.koderskiOpsegHz}`);
  });

  console.log('\n📦 Koderski impulsi (#1250)');
  await test('svaki impuls ima validan sloj 1–4', () => {
    for (const i of r.impulsi) {
      assert(i.sloj >= 1 && i.sloj <= 4, `sloj: ${i.sloj}`);
    }
  });
  await test('svaki impuls ima validan t 0–7', () => {
    for (const i of r.impulsi) {
      assert(i.t >= 0 && i.t <= 7, `t: ${i.t}`);
    }
  });
  await test('svaki impuls ima harmonik 1–4', () => {
    for (const i of r.impulsi) {
      assert(i.harmonik >= 1 && i.harmonik <= 4, `harmonik: ${i.harmonik}`);
    }
  });
  await test('metar je 0–2', () => {
    for (const i of r.impulsi) {
      assert(i.metar >= 0 && i.metar <= 2, `metar: ${i.metar}`);
    }
  });
  await test('faza je 0–2', () => {
    for (const i of r.impulsi) {
      assert(i.faza >= 0 && i.faza <= 2, `faza: ${i.faza}`);
    }
  });
  await test('koderHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.koderHz > 0, `koderHz: ${i.koderHz}`);
    }
  });
  await test('koderskaVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.koderskaVeza >= 0 && i.koderskaVeza <= 1, `koderskaVeza: ${i.koderskaVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1250)');
  await test('AUTOFINISH_COUNT === 1250', () => {
    assertEqual(AUTOFINISH_COUNT, 1250, 'AUTOFINISH_COUNT=1250');
  });
  await test('APP_VERSION === "51.9.0"', () => {
    assertEqual(APP_VERSION, '51.9.0', 'APP_VERSION=51.9.0');
  });
  await test('TOTAL_API_ROUTES === 1119', () => {
    assertEqual(TOTAL_API_ROUTES, 1119, 'TOTAL_API_ROUTES=1119');
  });
  await test('TOTAL_ROUTES === 1199', () => {
    assertEqual(TOTAL_ROUTES, 1199, 'TOTAL_ROUTES=1199');
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
