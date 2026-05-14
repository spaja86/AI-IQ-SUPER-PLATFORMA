// Autofinish #1240 — Unit Testovi buildLaureatskiOdjek()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-odjek.test.ts

import { buildLaureatskiOdjek } from '../../lib/laureatski-odjek';
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
  console.log('\n🔊  LAUREATSKI ODJEK — Unit Test Suite (#1240)\n');

  const r = buildLaureatskiOdjek('test-user-id');

  console.log('📦 Top-level schema (#1240)');
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

  console.log('\n📦 Odječni indikatori (#1240)');
  await test('odjecniIndeks je 0–1', () => {
    assert(r.odjecniIndeks >= 0 && r.odjecniIndeks <= 1, `odjecniIndeks: ${r.odjecniIndeks}`);
  });
  await test('odjecnaStabilnost je 0–1', () => {
    assert(r.odjecnaStabilnost >= 0 && r.odjecnaStabilnost <= 1, `odjecnaStabilnost: ${r.odjecnaStabilnost}`);
  });
  await test('prosecniOdjekHz > 0', () => {
    assert(r.prosecniOdjekHz > 0, `prosecniOdjekHz: ${r.prosecniOdjekHz}`);
  });
  await test('maksimalniOdjekHz >= minimalniOdjekHz', () => {
    assert(r.maksimalniOdjekHz >= r.minimalniOdjekHz, `${r.maksimalniOdjekHz} >= ${r.minimalniOdjekHz}`);
  });
  await test('odjecniOpsegHz >= 0', () => {
    assert(r.odjecniOpsegHz >= 0, `odjecniOpsegHz: ${r.odjecniOpsegHz}`);
  });

  console.log('\n📦 Odječni impulsi (#1240)');
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
  await test('odjekHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.odjekHz > 0, `odjekHz: ${i.odjekHz}`);
    }
  });
  await test('rezonanca je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.rezonanca >= 0 && i.rezonanca <= 1, `rezonanca: ${i.rezonanca}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1240)');
  await test('AUTOFINISH_COUNT === 1241', () => {
    assertEqual(AUTOFINISH_COUNT, 1241, 'AUTOFINISH_COUNT=1241');
  });
  await test('APP_VERSION === "51.0.0"', () => {
    assertEqual(APP_VERSION, '51.0.0', 'APP_VERSION=51.0.0');
  });
  await test('TOTAL_API_ROUTES === 1110', () => {
    assertEqual(TOTAL_API_ROUTES, 1110, 'TOTAL_API_ROUTES=1110');
  });
  await test('TOTAL_ROUTES === 1181', () => {
    assertEqual(TOTAL_ROUTES, 1181, 'TOTAL_ROUTES=1181');
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
