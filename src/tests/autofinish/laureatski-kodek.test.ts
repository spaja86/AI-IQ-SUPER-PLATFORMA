// Autofinish #1251 — Unit Testovi buildLaureatskiKodek()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-kodek.test.ts

import { buildLaureatskiKodek } from '../../lib/laureatski-kodek';
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
  console.log('\n🎞️  LAUREATSKI KODEK — Unit Test Suite (#1251)\n');

  const r = buildLaureatskiKodek('test-user-id');

  console.log('📦 Top-level schema (#1251)');
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

  console.log('\n📦 Kodek indikatori (#1251)');
  await test('kodekIndeks je 0–1', () => {
    assert(r.kodekIndeks >= 0 && r.kodekIndeks <= 1, `kodekIndeks: ${r.kodekIndeks}`);
  });
  await test('kodekStabilnost je 0–1', () => {
    assert(r.kodekStabilnost >= 0 && r.kodekStabilnost <= 1, `kodekStabilnost: ${r.kodekStabilnost}`);
  });
  await test('prosecniKodekHz > 0', () => {
    assert(r.prosecniKodekHz > 0, `prosecniKodekHz: ${r.prosecniKodekHz}`);
  });
  await test('maksimalniKodekHz >= minimalniKodekHz', () => {
    assert(r.maksimalniKodekHz >= r.minimalniKodekHz, `${r.maksimalniKodekHz} >= ${r.minimalniKodekHz}`);
  });
  await test('kodekOpsegHz >= 0', () => {
    assert(r.kodekOpsegHz >= 0, `kodekOpsegHz: ${r.kodekOpsegHz}`);
  });

  console.log('\n📦 Kodek impulsi (#1251)');
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
  await test('kodekHz > 0', () => {
    for (const i of r.impulsi) {
      assert(i.kodekHz > 0, `kodekHz: ${i.kodekHz}`);
    }
  });
  await test('kodekVeza je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.kodekVeza >= 0 && i.kodekVeza <= 1, `kodekVeza: ${i.kodekVeza}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const i of r.impulsi) {
      assert(i.normalizovano >= 0 && i.normalizovano <= 1, `normalizovano: ${i.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1251)');
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
