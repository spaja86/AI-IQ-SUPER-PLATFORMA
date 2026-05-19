// Autofinish #1255 — Unit Testovi buildDigitalniVorteks()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/digitalni-vorteks.test.ts

import { buildDigitalniVorteks } from '../../lib/digitalni-vorteks';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';

// ─── Minimal test runner ──────────────────────────────────────────────────────

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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🌀 DIGITALNI VORTEKS — Unit Test Suite (#1255)\n');

  const r = buildDigitalniVorteks('test-user-id');

  // ── 1. Top-level schema ───────────────────────────────────────────────────
  console.log('📦 Top-level schema (#1255)');

  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('status === "aktivan"', () => {
    assertEqual(r.status, 'aktivan', 'status');
  });

  await test('userId je string', () => {
    assert(typeof r.userId === 'string' && r.userId.length > 0, 'userId string');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  // ── 2. vorteksniKoeficijent ───────────────────────────────────────────────
  console.log('\n📦 vorteksniKoeficijent (#1255)');

  await test('vorteksniKoeficijent je broj', () => {
    assert(typeof r.vorteksniKoeficijent === 'number', 'vorteksniKoeficijent tip');
  });

  await test('vorteksniKoeficijent je >= 0', () => {
    assert(r.vorteksniKoeficijent >= 0, `>= 0: ${r.vorteksniKoeficijent}`);
  });

  await test('vorteksniKoeficijent je <= 1', () => {
    assert(r.vorteksniKoeficijent <= 1, `<= 1: ${r.vorteksniKoeficijent}`);
  });

  // ── 3. spiralniImpuls ─────────────────────────────────────────────────────
  console.log('\n📦 spiralniImpuls (#1255)');

  await test('spiralniImpuls je broj', () => {
    assert(typeof r.spiralniImpuls === 'number', 'spiralniImpuls tip');
  });

  await test('spiralniImpuls je >= 0', () => {
    assert(r.spiralniImpuls >= 0, `spiralniImpuls >= 0: ${r.spiralniImpuls}`);
  });

  await test('spiralniImpuls je <= 1', () => {
    assert(r.spiralniImpuls <= 1, `spiralniImpuls <= 1: ${r.spiralniImpuls}`);
  });

  // ── 4. eksponatKoeficijent i eurekaKoeficijent ───────────────────────────
  console.log('\n📦 Izvedene metrike (#1255)');

  await test('eksponatKoeficijent je 0–1', () => {
    assert(
      r.eksponatKoeficijent >= 0 && r.eksponatKoeficijent <= 1,
      `eksponatKoeficijent: ${r.eksponatKoeficijent}`,
    );
  });

  await test('eurekaKoeficijent je 0–1', () => {
    assert(
      r.eurekaKoeficijent >= 0 && r.eurekaKoeficijent <= 1,
      `eurekaKoeficijent: ${r.eurekaKoeficijent}`,
    );
  });

  // ── 5. vorteksniCentar ───────────────────────────────────────────────────
  console.log('\n📦 vorteksniCentar (#1255)');

  await test('vorteksniCentar je objekat', () => {
    assert(
      typeof r.vorteksniCentar === 'object' && r.vorteksniCentar !== null,
      'objekat',
    );
  });

  await test('oktave ima 8 elemenata', () => {
    assertEqual(r.vorteksniCentar.oktave.length, 8, 'oktave.length');
  });

  await test('ukupnaCentripetalnaSila je > 0', () => {
    assert(
      r.vorteksniCentar.ukupnaCentripetalnaSila > 0,
      `ukupnaCentripetalnaSila: ${r.vorteksniCentar.ukupnaCentripetalnaSila}`,
    );
  });

  await test('spiralniKoeficijent je > 0', () => {
    assert(
      r.vorteksniCentar.spiralniKoeficijent > 0,
      `spiralniKoeficijent: ${r.vorteksniCentar.spiralniKoeficijent}`,
    );
  });

  await test('vorteksnaKohezija je 0–1', () => {
    const v = r.vorteksniCentar.vorteksnaKohezija;
    assert(v >= 0 && v <= 1, `vorteksnaKohezija: ${v}`);
  });

  await test('dominantnaOktava je 1–8', () => {
    assert(
      r.vorteksniCentar.dominantnaOktava >= 1 &&
        r.vorteksniCentar.dominantnaOktava <= 8,
      `dominantnaOktava: ${r.vorteksniCentar.dominantnaOktava}`,
    );
  });

  // ── 6. Vorteksne oktave ───────────────────────────────────────────────────
  console.log('\n📦 Vorteksne oktave (#1255)');

  await test('svaka oktava ima ugaonaBrzina > 0', () => {
    for (const o of r.vorteksniCentar.oktave) {
      assert(o.ugaonaBrzina > 0, `ugaonaBrzina oktava ${o.oktava}: ${o.ugaonaBrzina}`);
    }
  });

  await test('svaka oktava ima radijus > 0', () => {
    for (const o of r.vorteksniCentar.oktave) {
      assert(o.radijus > 0, `radijus oktava ${o.oktava}: ${o.radijus}`);
    }
  });

  await test('svaka oktava ima centripetalnaSnaga > 0', () => {
    for (const o of r.vorteksniCentar.oktave) {
      assert(
        o.centripetalnaSnaga > 0,
        `centripetalnaSnaga oktava ${o.oktava}: ${o.centripetalnaSnaga}`,
      );
    }
  });

  await test('vorteksniDoprinos sumiraju se blizu 1', () => {
    const suma = r.vorteksniCentar.oktave.reduce(
      (s, o) => s + o.vorteksniDoprinos,
      0,
    );
    assert(Math.abs(suma - 1) < 0.01, `suma vorteksnih doprinosa: ${suma}`);
  });

  await test('naziv i ikona su neprazni stringovi za svaku oktavu', () => {
    for (const o of r.vorteksniCentar.oktave) {
      assert(typeof o.naziv === 'string' && o.naziv.length > 0, `naziv oktava ${o.oktava}`);
      assert(typeof o.ikona === 'string' && o.ikona.length > 0, `ikona oktava ${o.oktava}`);
    }
  });

  // ── 7. Globalni invarijanti ───────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#1255)');

  await test('AUTOFINISH_COUNT === 1299', () => {
    assertEqual(AUTOFINISH_COUNT, 1299, 'AUTOFINISH_COUNT=1295');
  });

  await test('APP_VERSION === "56.4.0"', () => {
    assertEqual(APP_VERSION, '56.8.0', 'APP_VERSION=56.4.0');
  });

  await test('TOTAL_API_ROUTES === 1158', () => {
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES=1158');
  });

  await test('TOTAL_ROUTES === 1258', () => {
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES=1258');
  });

  // ─── Rezultat ─────────────────────────────────────────────────────────────
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
