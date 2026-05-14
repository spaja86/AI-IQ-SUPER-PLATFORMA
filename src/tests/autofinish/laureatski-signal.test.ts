// Autofinish #1238 — Unit Testovi buildLaureatskiSignal()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laureatski-signal.test.ts

import { buildLaureatskiSignal } from '../../lib/laureatski-signal';
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
  console.log('\n📡  LAUREATSKI SIGNAL — Unit Test Suite (#1238)\n');

  const r = buildLaureatskiSignal('test-user-id');

  console.log('📦 Top-level schema (#1238)');
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

  console.log('\n📦 Signalni indikatori (#1238)');
  await test('signalniIndeks je 0–1', () => {
    assert(r.signalniIndeks >= 0 && r.signalniIndeks <= 1, `signalniIndeks: ${r.signalniIndeks}`);
  });
  await test('signalStabilnost je 0–1', () => {
    assert(r.signalStabilnost >= 0 && r.signalStabilnost <= 1, `signalStabilnost: ${r.signalStabilnost}`);
  });
  await test('prosecniImpulsHz > 0', () => {
    assert(r.prosecniImpulsHz > 0, `prosecniImpulsHz: ${r.prosecniImpulsHz}`);
  });
  await test('maksimalniImpulsHz >= minimalniImpulsHz', () => {
    assert(r.maksimalniImpulsHz >= r.minimalniImpulsHz, `${r.maksimalniImpulsHz} >= ${r.minimalniImpulsHz}`);
  });
  await test('signalOpsegHz >= 0', () => {
    assert(r.signalOpsegHz >= 0, `signalOpsegHz: ${r.signalOpsegHz}`);
  });

  console.log('\n📦 Signalni impulsi (#1238)');
  await test('svaki impuls ima validan sloj 1–4', () => {
    for (const s of r.impulsi) {
      assert(s.sloj >= 1 && s.sloj <= 4, `sloj: ${s.sloj}`);
    }
  });
  await test('svaki impuls ima validan t 0–7', () => {
    for (const s of r.impulsi) {
      assert(s.t >= 0 && s.t <= 7, `t: ${s.t}`);
    }
  });
  await test('svaki impuls ima harmonik 1–4', () => {
    for (const s of r.impulsi) {
      assert(s.harmonik >= 1 && s.harmonik <= 4, `harmonik: ${s.harmonik}`);
    }
  });
  await test('metar je 0–2', () => {
    for (const s of r.impulsi) {
      assert(s.metar >= 0 && s.metar <= 2, `metar: ${s.metar}`);
    }
  });
  await test('impulsHz > 0', () => {
    for (const s of r.impulsi) {
      assert(s.impulsHz > 0, `impulsHz: ${s.impulsHz}`);
    }
  });
  await test('amplituda je 0–1', () => {
    for (const s of r.impulsi) {
      assert(s.amplituda >= 0 && s.amplituda <= 1, `amplituda: ${s.amplituda}`);
    }
  });
  await test('normalizovano je 0–1', () => {
    for (const s of r.impulsi) {
      assert(s.normalizovano >= 0 && s.normalizovano <= 1, `normalizovano: ${s.normalizovano}`);
    }
  });

  console.log('\n📦 Globalni invarijanti (#1238)');
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
