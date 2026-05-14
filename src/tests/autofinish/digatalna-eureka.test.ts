// Autofinish #1233 — Unit Testovi buildDigatalnaEureka()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/digatalna-eureka.test.ts

import { buildDigatalnaEureka } from '../../lib/digatalna-eureka';
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
  console.log('\n💡  DIGATALNA EUREKA — Unit Test Suite (#1233)\n');

  const r = buildDigatalnaEureka('test-user-id');

  // ── 1. Top-level schema ───────────────────────────────────────────────────
  console.log('📦 Top-level schema (#1233)');

  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('status === "aktivna"', () => {
    assertEqual(r.status, 'aktivna', 'status');
  });

  await test('userId je string', () => {
    assert(typeof r.userId === 'string' && r.userId.length > 0, 'userId string');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  // ── 2. eurekaKoeficijent ─────────────────────────────────────────────────
  console.log('\n📦 eurekaKoeficijent (#1233)');

  await test('eurekaKoeficijent je broj', () => {
    assert(typeof r.eurekaKoeficijent === 'number', 'eurekaKoeficijent tip');
  });

  await test('eurekaKoeficijent je >= 0', () => {
    assert(r.eurekaKoeficijent >= 0, `eurekaKoeficijent >= 0: ${r.eurekaKoeficijent}`);
  });

  await test('eurekaKoeficijent je <= 1', () => {
    assert(r.eurekaKoeficijent <= 1, `eurekaKoeficijent <= 1: ${r.eurekaKoeficijent}`);
  });

  // ── 3. oktavnaSinergija ───────────────────────────────────────────────────
  console.log('\n📦 oktavnaSinergija (#1233)');

  await test('oktavnaSinergija je niz', () => {
    assert(Array.isArray(r.oktavnaSinergija), 'oktavnaSinergija niz');
  });

  await test('oktavnaSinergija ima 8 elemenata', () => {
    assertEqual(r.oktavnaSinergija.length, 8, 'oktavnaSinergija.length');
  });

  await test('svi elementi oktavnaSinergija su >= 0', () => {
    for (const v of r.oktavnaSinergija) {
      assert(v >= 0, `element >= 0: ${v}`);
    }
  });

  await test('svi elementi oktavnaSinergija su <= 1', () => {
    for (const v of r.oktavnaSinergija) {
      assert(v <= 1, `element <= 1: ${v}`);
    }
  });

  await test('maksimalni element oktavnaSinergija je 1', () => {
    const max = Math.max(...r.oktavnaSinergija);
    assertEqual(max, 1, 'max oktavnaSinergija');
  });

  // ── 4. epicentricniEkvivalent ─────────────────────────────────────────────
  console.log('\n📦 epicentricniEkvivalent (#1233)');

  await test('epicentricniEkvivalent je objekat', () => {
    assert(typeof r.epicentricniEkvivalent === 'object' && r.epicentricniEkvivalent !== null, 'epicentricniEkvivalent objekat');
  });

  await test('epicentricnost je >= 0', () => {
    assert(r.epicentricniEkvivalent.epicentricnost >= 0, `epicentricnost: ${r.epicentricniEkvivalent.epicentricnost}`);
  });

  await test('simetrijskaSnaga je 0–1', () => {
    const s = r.epicentricniEkvivalent.simetrijskaSnaga;
    assert(s >= 0 && s <= 1, `simetrijskaSnaga: ${s}`);
  });

  await test('status je "simetričan" ili "asimetričan"', () => {
    assert(
      r.epicentricniEkvivalent.status === 'simetričan' ||
      r.epicentricniEkvivalent.status === 'asimetričan',
      `status: ${r.epicentricniEkvivalent.status}`,
    );
  });

  await test('centarMase ima x i y', () => {
    assert(
      typeof r.epicentricniEkvivalent.centarMase.x === 'number' &&
      typeof r.epicentricniEkvivalent.centarMase.y === 'number',
      'centarMase x/y',
    );
  });

  // ── 5. matricnaSimetrija ──────────────────────────────────────────────────
  console.log('\n📦 matricnaSimetrija (#1233)');

  await test('matricnaSimetrija je broj', () => {
    assert(typeof r.matricnaSimetrija === 'number', 'matricnaSimetrija tip');
  });

  await test('matricnaSimetrija je > 0', () => {
    assert(r.matricnaSimetrija > 0, `matricnaSimetrija: ${r.matricnaSimetrija}`);
  });

  // ── 6. ektridonalnaEksinometrija ──────────────────────────────────────────
  console.log('\n📦 ektridonalnaEksinometrija (#1233)');

  await test('superPozicija ima 8 elemenata', () => {
    assertEqual(r.ektridonalnaEksinometrija.superPozicija.length, 8, 'superPozicija.length');
  });

  await test('normalizovana ima 8 elemenata', () => {
    assertEqual(r.ektridonalnaEksinometrija.normalizovana.length, 8, 'normalizovana.length');
  });

  await test('doprinosiOktava ima 8 elemenata', () => {
    assertEqual(r.ektridonalnaEksinometrija.doprinosiOktava.length, 8, 'doprinosiOktava.length');
  });

  await test('ukupnaSinergija je > 0', () => {
    assert(r.ektridonalnaEksinometrija.ukupnaSinergija > 0, `ukupnaSinergija: ${r.ektridonalnaEksinometrija.ukupnaSinergija}`);
  });

  await test('prosecnaSinergija je 0–1', () => {
    const p = r.ektridonalnaEksinometrija.prosecnaSinergija;
    assert(p >= 0 && p <= 1, `prosecnaSinergija: ${p}`);
  });

  // ── 7. Konzistentnost konstanti ───────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#1233)');

  await test('AUTOFINISH_COUNT === 1237', () => {
    assertEqual(AUTOFINISH_COUNT, 1237, 'AUTOFINISH_COUNT=1237');
  });

  await test('APP_VERSION === "50.6.0"', () => {
    assertEqual(APP_VERSION, '50.6.0', 'APP_VERSION=50.6.0');
  });

  await test('TOTAL_API_ROUTES === 1106', () => {
    assertEqual(TOTAL_API_ROUTES, 1106, 'TOTAL_API_ROUTES=1106');
  });

  await test('TOTAL_ROUTES === 1173', () => {
    assertEqual(TOTAL_ROUTES, 1173, 'TOTAL_ROUTES=1173');
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
