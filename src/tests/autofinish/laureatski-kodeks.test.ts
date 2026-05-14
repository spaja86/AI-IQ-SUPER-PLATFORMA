// Autofinish #1252 — Unit Testovi buildLaureatskiKodeks()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-kodeks.test.ts

import { buildLaureatskiKodeks } from '../../lib/laureatski-kodeks';
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
  console.log('\n📜  LAUREATSKI KODEKS — Unit Test Suite (#1252)\n');

  const r = buildLaureatskiKodeks('test-user-id');

  console.log('📦 Top-level schema (#1252)');
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

  console.log('\n📦 Kodeks indikatori (#1252)');
  await test('kodeksIndeks je 0–1', () => {
    assert(r.kodeksIndeks >= 0 && r.kodeksIndeks <= 1, `kodeksIndeks: ${r.kodeksIndeks}`);
  });
  await test('kodeksStabilnost je 0–1', () => {
    assert(r.kodeksStabilnost >= 0 && r.kodeksStabilnost <= 1, `kodeksStabilnost: ${r.kodeksStabilnost}`);
  });
  await test('prosecniKodeksHz > 0', () => {
    assert(r.prosecniKodeksHz > 0, `prosecniKodeksHz: ${r.prosecniKodeksHz}`);
  });
  await test('maksimalniKodeksHz >= minimalniKodeksHz', () => {
    assert(r.maksimalniKodeksHz >= r.minimalniKodeksHz, `${r.maksimalniKodeksHz} >= ${r.minimalniKodeksHz}`);
  });
  await test('kodeksOpsegHz >= 0', () => {
    assert(r.kodeksOpsegHz >= 0, `kodeksOpsegHz: ${r.kodeksOpsegHz}`);
  });

  console.log('\n📦 Kodeks impulsi (#1252)');
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
  await test('kodeksHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.kodeksHz > 0, `kodeksHz: ${i.kodeksHz}`);
    }
  });
  await test('kodeksVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.kodeksVeza >= 0 && i.kodeksVeza <= 1, `kodeksVeza: ${i.kodeksVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1252)');
  await test('AUTOFINISH_COUNT === 1252', () => {
    assertEqual(AUTOFINISH_COUNT, 1252, 'AUTOFINISH_COUNT=1252');
  });
  await test('APP_VERSION === "52.1.0"', () => {
    assertEqual(APP_VERSION, '52.1.0', 'APP_VERSION=52.1.0');
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
