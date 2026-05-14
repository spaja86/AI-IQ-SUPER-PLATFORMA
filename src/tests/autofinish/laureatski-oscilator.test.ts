// Autofinish #1243 — Unit Testovi buildLaureatskiOscilator()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-oscilator.test.ts

import { buildLaureatskiOscilator } from '../../lib/laureatski-oscilator';
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
  console.log('\n🌀  LAUREATSKI OSCILATOR — Unit Test Suite (#1243)\n');

  const r = buildLaureatskiOscilator('test-user-id');

  console.log('📦 Top-level schema (#1243)');
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

  console.log('\n📦 Oscilatorski indikatori (#1243)');
  await test('oscilatorskiIndeks je 0–1', () => {
    assert(r.oscilatorskiIndeks >= 0 && r.oscilatorskiIndeks <= 1, `oscilatorskiIndeks: ${r.oscilatorskiIndeks}`);
  });
  await test('oscilatorskaStabilnost je 0–1', () => {
    assert(r.oscilatorskaStabilnost >= 0 && r.oscilatorskaStabilnost <= 1, `oscilatorskaStabilnost: ${r.oscilatorskaStabilnost}`);
  });
  await test('prosecniOscilatorHz > 0', () => {
    assert(r.prosecniOscilatorHz > 0, `prosecniOscilatorHz: ${r.prosecniOscilatorHz}`);
  });
  await test('maksimalniOscilatorHz >= minimalniOscilatorHz', () => {
    assert(r.maksimalniOscilatorHz >= r.minimalniOscilatorHz, `${r.maksimalniOscilatorHz} >= ${r.minimalniOscilatorHz}`);
  });
  await test('oscilatorskiOpsegHz >= 0', () => {
    assert(r.oscilatorskiOpsegHz >= 0, `oscilatorskiOpsegHz: ${r.oscilatorskiOpsegHz}`);
  });

  console.log('\n📦 Oscilatorski impulsi (#1243)');
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
  await test('oscilatorHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.oscilatorHz > 0, `oscilatorHz: ${i.oscilatorHz}`);
    }
  });
  await test('oscilatorskaVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.oscilatorskaVeza >= 0 && i.oscilatorskaVeza <= 1, `oscilatorskaVeza: ${i.oscilatorskaVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1243)');
  await test('AUTOFINISH_COUNT === 1245', () => {
    assertEqual(AUTOFINISH_COUNT, 1245, 'AUTOFINISH_COUNT=1245');
  });
  await test('APP_VERSION === "51.4.0"', () => {
    assertEqual(APP_VERSION, '51.4.0', 'APP_VERSION=51.4.0');
  });
  await test('TOTAL_API_ROUTES === 1114', () => {
    assertEqual(TOTAL_API_ROUTES, 1114, 'TOTAL_API_ROUTES=1114');
  });
  await test('TOTAL_ROUTES === 1189', () => {
    assertEqual(TOTAL_ROUTES, 1189, 'TOTAL_ROUTES=1189');
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
