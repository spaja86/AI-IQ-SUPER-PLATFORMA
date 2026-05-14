// Autofinish #1242 — Unit Testovi buildLaureatskiRezonator()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-rezonator.test.ts

import { buildLaureatskiRezonator } from '../../lib/laureatski-rezonator';
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
  console.log('\n🎛️  LAUREATSKI REZONATOR — Unit Test Suite (#1242)\n');

  const r = buildLaureatskiRezonator('test-user-id');

  console.log('📦 Top-level schema (#1242)');
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

  console.log('\n📦 Rezonatorski indikatori (#1242)');
  await test('rezonatorskiIndeks je 0–1', () => {
    assert(r.rezonatorskiIndeks >= 0 && r.rezonatorskiIndeks <= 1, `rezonatorskiIndeks: ${r.rezonatorskiIndeks}`);
  });
  await test('rezonatorskaStabilnost je 0–1', () => {
    assert(r.rezonatorskaStabilnost >= 0 && r.rezonatorskaStabilnost <= 1, `rezonatorskaStabilnost: ${r.rezonatorskaStabilnost}`);
  });
  await test('prosecniRezonatorHz > 0', () => {
    assert(r.prosecniRezonatorHz > 0, `prosecniRezonatorHz: ${r.prosecniRezonatorHz}`);
  });
  await test('maksimalniRezonatorHz >= minimalniRezonatorHz', () => {
    assert(r.maksimalniRezonatorHz >= r.minimalniRezonatorHz, `${r.maksimalniRezonatorHz} >= ${r.minimalniRezonatorHz}`);
  });
  await test('rezonatorskiOpsegHz >= 0', () => {
    assert(r.rezonatorskiOpsegHz >= 0, `rezonatorskiOpsegHz: ${r.rezonatorskiOpsegHz}`);
  });

  console.log('\n📦 Rezonatorski impulsi (#1242)');
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
  await test('rezonatorHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.rezonatorHz > 0, `rezonatorHz: ${i.rezonatorHz}`);
    }
  });
  await test('rezonatorskaVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.rezonatorskaVeza >= 0 && i.rezonatorskaVeza <= 1, `rezonatorskaVeza: ${i.rezonatorskaVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1242)');
  await test('AUTOFINISH_COUNT === 1246', () => {
    assertEqual(AUTOFINISH_COUNT, 1246, 'AUTOFINISH_COUNT=1246');
  });
  await test('APP_VERSION === "51.5.0"', () => {
    assertEqual(APP_VERSION, '51.5.0', 'APP_VERSION=51.5.0');
  });
  await test('TOTAL_API_ROUTES === 1115', () => {
    assertEqual(TOTAL_API_ROUTES, 1115, 'TOTAL_API_ROUTES=1115');
  });
  await test('TOTAL_ROUTES === 1191', () => {
    assertEqual(TOTAL_ROUTES, 1191, 'TOTAL_ROUTES=1191');
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
