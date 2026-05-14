// Autofinish #1239 — Unit Testovi buildLaureatskiTalas()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-talas.test.ts

import { buildLaureatskiTalas } from '../../lib/laureatski-talas';
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
  console.log('\n🌊  LAUREATSKI TALAS — Unit Test Suite (#1239)\n');

  const r = buildLaureatskiTalas('test-user-id');

  console.log('📦 Top-level schema (#1239)');
  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });
  await test('status === "aktivan"', () => {
    assertEqual(r.status, 'aktivan', 'status');
  });
  await test('cvorovi je niz', () => {
    assert(Array.isArray(r.cvorovi), 'cvorovi niz');
  });
  await test('cvorovi ima 32 elementa', () => {
    assertEqual(r.cvorovi.length, 32, 'cvorovi.length');
  });

  console.log('\n📦 Talasni indikatori (#1239)');
  await test('talasniIndeks je 0–1', () => {
    assert(r.talasniIndeks >= 0 && r.talasniIndeks <= 1, `talasniIndeks: ${r.talasniIndeks}`);
  });
  await test('talasnaStabilnost je 0–1', () => {
    assert(r.talasnaStabilnost >= 0 && r.talasnaStabilnost <= 1, `talasnaStabilnost: ${r.talasnaStabilnost}`);
  });
  await test('prosecnaFrekvencijaHz > 0', () => {
    assert(r.prosecnaFrekvencijaHz > 0, `prosecnaFrekvencijaHz: ${r.prosecnaFrekvencijaHz}`);
  });
  await test('maksimalnaFrekvencijaHz >= minimalnaFrekvencijaHz', () => {
    assert(r.maksimalnaFrekvencijaHz >= r.minimalnaFrekvencijaHz, `${r.maksimalnaFrekvencijaHz} >= ${r.minimalnaFrekvencijaHz}`);
  });
  await test('talasniOpsegHz >= 0', () => {
    assert(r.talasniOpsegHz >= 0, `talasniOpsegHz: ${r.talasniOpsegHz}`);
  });

  console.log('\n📦 Talasni čvorovi (#1239)');
  await test('svaki čvor ima validan sloj 1–4', () => {
    for (const c of r.cvorovi) {
      assert(c.sloj >= 1 && c.sloj <= 4, `sloj: ${c.sloj}`);
    }
  });
  await test('svaki čvor ima validan t 0–7', () => {
    for (const c of r.cvorovi) {
      assert(c.t >= 0 && c.t <= 7, `t: ${c.t}`);
    }
  });
  await test('svaki čvor ima harmonik 1–4', () => {
    for (const c of r.cvorovi) {
      assert(c.harmonik >= 1 && c.harmonik <= 4, `harmonik: ${c.harmonik}`);
    }
  });
  await test('metar je 0–2', () => {
    for (const c of r.cvorovi) {
      assert(c.metar >= 0 && c.metar <= 2, `metar: ${c.metar}`);
    }
  });
  await test('faza je 0–2', () => {
    for (const c of r.cvorovi) {
      assert(c.faza >= 0 && c.faza <= 2, `faza: ${c.faza}`);
    }
  });
  await test('frekvencijaHz > 0', () => {
    for (const c of r.cvorovi) {
      assert(c.frekvencijaHz > 0, `frekvencijaHz: ${c.frekvencijaHz}`);
    }
  });
  await test('amplituda je 0–1', () => {
    for (const c of r.cvorovi) {
      assert(c.amplituda >= 0 && c.amplituda <= 1, `amplituda: ${c.amplituda}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const c of r.cvorovi) {
      assert(c.normalizovano >= 0 && c.normalizovano <= 1, `normalizovano: ${c.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1239)');
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
