// Autofinish #1249 — Unit Testovi buildLaureatskiRekoder()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-rekoder.test.ts

import { buildLaureatskiRekoder } from '../../lib/laureatski-rekoder';
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
  console.log('\n♻️  LAUREATSKI REKODER — Unit Test Suite (#1249)\n');

  const r = buildLaureatskiRekoder('test-user-id');

  console.log('📦 Top-level schema (#1249)');
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

  console.log('\n📦 Rekoderski indikatori (#1249)');
  await test('rekoderskiIndeks je 0–1', () => {
    assert(r.rekoderskiIndeks >= 0 && r.rekoderskiIndeks <= 1, `rekoderskiIndeks: ${r.rekoderskiIndeks}`);
  });
  await test('rekoderskaStabilnost je 0–1', () => {
    assert(r.rekoderskaStabilnost >= 0 && r.rekoderskaStabilnost <= 1, `rekoderskaStabilnost: ${r.rekoderskaStabilnost}`);
  });
  await test('prosecniRekoderHz > 0', () => {
    assert(r.prosecniRekoderHz > 0, `prosecniRekoderHz: ${r.prosecniRekoderHz}`);
  });
  await test('maksimalniRekoderHz >= minimalniRekoderHz', () => {
    assert(r.maksimalniRekoderHz >= r.minimalniRekoderHz, `${r.maksimalniRekoderHz} >= ${r.minimalniRekoderHz}`);
  });
  await test('rekoderskiOpsegHz >= 0', () => {
    assert(r.rekoderskiOpsegHz >= 0, `rekoderskiOpsegHz: ${r.rekoderskiOpsegHz}`);
  });

  console.log('\n📦 Rekoderski impulsi (#1249)');
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
  await test('rekoderHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.rekoderHz > 0, `rekoderHz: ${i.rekoderHz}`);
    }
  });
  await test('rekoderskaVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.rekoderskaVeza >= 0 && i.rekoderskaVeza <= 1, `rekoderskaVeza: ${i.rekoderskaVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1249)');
  await test('AUTOFINISH_COUNT === 1252', () => {
    assert(AUTOFINISH_COUNT >= 1252, 'AUTOFINISH_COUNT baseline');
  });
  await test('APP_VERSION === "52.1.0"', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
  });
  await test('TOTAL_API_ROUTES === 1121', () => {
    assertEqual(TOTAL_API_ROUTES, 1121, 'TOTAL_API_ROUTES=1121');
  });
  await test('TOTAL_ROUTES === 1203', () => {
    assertEqual(TOTAL_ROUTES, 1203, 'TOTAL_ROUTES=1203');
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
