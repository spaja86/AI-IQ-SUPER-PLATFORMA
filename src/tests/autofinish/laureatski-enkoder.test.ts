// Autofinish #1247 — Unit Testovi buildLaureatskiEnkoder()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-enkoder.test.ts

import { buildLaureatskiEnkoder } from '../../lib/laureatski-enkoder';
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
  console.log('\n🔐  LAUREATSKI ENKODER — Unit Test Suite (#1247)\n');

  const r = buildLaureatskiEnkoder('test-user-id');

  console.log('📦 Top-level schema (#1247)');
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

  console.log('\n📦 Enkoderski indikatori (#1247)');
  await test('enkoderskiIndeks je 0–1', () => {
    assert(r.enkoderskiIndeks >= 0 && r.enkoderskiIndeks <= 1, `enkoderskiIndeks: ${r.enkoderskiIndeks}`);
  });
  await test('enkoderskaStabilnost je 0–1', () => {
    assert(r.enkoderskaStabilnost >= 0 && r.enkoderskaStabilnost <= 1, `enkoderskaStabilnost: ${r.enkoderskaStabilnost}`);
  });
  await test('prosecniEnkoderskiHz > 0', () => {
    assert(r.prosecniEnkoderskiHz > 0, `prosecniEnkoderskiHz: ${r.prosecniEnkoderskiHz}`);
  });
  await test('maksimalniEnkoderskiHz >= minimalniEnkoderskiHz', () => {
    assert(r.maksimalniEnkoderskiHz >= r.minimalniEnkoderskiHz, `${r.maksimalniEnkoderskiHz} >= ${r.minimalniEnkoderskiHz}`);
  });
  await test('enkoderskiOpsegHz >= 0', () => {
    assert(r.enkoderskiOpsegHz >= 0, `enkoderskiOpsegHz: ${r.enkoderskiOpsegHz}`);
  });

  console.log('\n📦 Enkoderski impulsi (#1247)');
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
  await test('enkoderskiHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.enkoderskiHz > 0, `enkoderskiHz: ${i.enkoderskiHz}`);
    }
  });
  await test('enkoderskaVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.enkoderskaVeza >= 0 && i.enkoderskaVeza <= 1, `enkoderskaVeza: ${i.enkoderskaVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1247)');
  await test('AUTOFINISH_COUNT === 1247', () => {
    assertEqual(AUTOFINISH_COUNT, 1247, 'AUTOFINISH_COUNT=1247');
  });
  await test('APP_VERSION === "51.6.0"', () => {
    assertEqual(APP_VERSION, '51.6.0', 'APP_VERSION=51.6.0');
  });
  await test('TOTAL_API_ROUTES === 1116', () => {
    assertEqual(TOTAL_API_ROUTES, 1116, 'TOTAL_API_ROUTES=1116');
  });
  await test('TOTAL_ROUTES === 1193', () => {
    assertEqual(TOTAL_ROUTES, 1193, 'TOTAL_ROUTES=1193');
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
