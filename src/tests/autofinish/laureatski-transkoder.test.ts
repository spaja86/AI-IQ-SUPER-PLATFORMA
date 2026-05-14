// Autofinish #1248 — Unit Testovi buildLaureatskiTranskoder()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-transkoder.test.ts

import { buildLaureatskiTranskoder } from '../../lib/laureatski-transkoder';
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
  console.log('\n🔄  LAUREATSKI TRANSKODER — Unit Test Suite (#1248)\n');

  const r = buildLaureatskiTranskoder('test-user-id');

  console.log('📦 Top-level schema (#1248)');
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

  console.log('\n📦 Transkoderski indikatori (#1248)');
  await test('transkoderskiIndeks je 0–1', () => {
    assert(r.transkoderskiIndeks >= 0 && r.transkoderskiIndeks <= 1, `transkoderskiIndeks: ${r.transkoderskiIndeks}`);
  });
  await test('transkoderskaStabilnost je 0–1', () => {
    assert(r.transkoderskaStabilnost >= 0 && r.transkoderskaStabilnost <= 1, `transkoderskaStabilnost: ${r.transkoderskaStabilnost}`);
  });
  await test('prosecniTranskoderHz > 0', () => {
    assert(r.prosecniTranskoderHz > 0, `prosecniTranskoderHz: ${r.prosecniTranskoderHz}`);
  });
  await test('maksimalniTranskoderHz >= minimalniTranskoderHz', () => {
    assert(r.maksimalniTranskoderHz >= r.minimalniTranskoderHz, `${r.maksimalniTranskoderHz} >= ${r.minimalniTranskoderHz}`);
  });
  await test('transkoderskiOpsegHz >= 0', () => {
    assert(r.transkoderskiOpsegHz >= 0, `transkoderskiOpsegHz: ${r.transkoderskiOpsegHz}`);
  });

  console.log('\n📦 Transkoderski impulsi (#1248)');
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
  await test('transkoderHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.transkoderHz > 0, `transkoderHz: ${i.transkoderHz}`);
    }
  });
  await test('transkoderskaVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.transkoderskaVeza >= 0 && i.transkoderskaVeza <= 1, `transkoderskaVeza: ${i.transkoderskaVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1248)');
  await test('AUTOFINISH_COUNT === 1251', () => {
    assertEqual(AUTOFINISH_COUNT, 1251, 'AUTOFINISH_COUNT=1251');
  });
  await test('APP_VERSION === "52.0.0"', () => {
    assertEqual(APP_VERSION, '52.0.0', 'APP_VERSION=52.0.0');
  });
  await test('TOTAL_API_ROUTES === 1120', () => {
    assertEqual(TOTAL_API_ROUTES, 1120, 'TOTAL_API_ROUTES=1120');
  });
  await test('TOTAL_ROUTES === 1201', () => {
    assertEqual(TOTAL_ROUTES, 1201, 'TOTAL_ROUTES=1201');
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
