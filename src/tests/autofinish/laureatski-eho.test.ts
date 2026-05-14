// Autofinish #1241 — Unit Testovi buildLaureatskiEho()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-eho.test.ts

import { buildLaureatskiEho } from '../../lib/laureatski-eho';
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
  console.log('\n📣  LAUREATSKI EHO — Unit Test Suite (#1241)\n');

  const r = buildLaureatskiEho('test-user-id');

  console.log('📦 Top-level schema (#1241)');
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

  console.log('\n📦 Eho indikatori (#1241)');
  await test('ehoIndeks je 0–1', () => {
    assert(r.ehoIndeks >= 0 && r.ehoIndeks <= 1, `ehoIndeks: ${r.ehoIndeks}`);
  });
  await test('ehoStabilnost je 0–1', () => {
    assert(r.ehoStabilnost >= 0 && r.ehoStabilnost <= 1, `ehoStabilnost: ${r.ehoStabilnost}`);
  });
  await test('prosecniEhoHz > 0', () => {
    assert(r.prosecniEhoHz > 0, `prosecniEhoHz: ${r.prosecniEhoHz}`);
  });
  await test('maksimalniEhoHz >= minimalniEhoHz', () => {
    assert(r.maksimalniEhoHz >= r.minimalniEhoHz, `${r.maksimalniEhoHz} >= ${r.minimalniEhoHz}`);
  });
  await test('ehoOpsegHz >= 0', () => {
    assert(r.ehoOpsegHz >= 0, `ehoOpsegHz: ${r.ehoOpsegHz}`);
  });

  console.log('\n📦 Eho impulsi (#1241)');
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
  await test('ehoHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.ehoHz > 0, `ehoHz: ${i.ehoHz}`);
    }
  });
  await test('povratnaSprega je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.povratnaSprega >= 0 && i.povratnaSprega <= 1, `povratnaSprega: ${i.povratnaSprega}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1241)');
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
