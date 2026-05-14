// Autofinish #1234 — Unit Testovi buildLaucentricniSpektar()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/laucentricni-spektar.test.ts

import { buildLaucentricniSpektar } from '../../lib/laucentricni-spektar';
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
  console.log('\n🌊  LAUCENTRICNI SPEKTAR — Unit Test Suite (#1234)\n');

  const r = buildLaucentricniSpektar('test-user-id');

  // ── 1. Top-level schema ───────────────────────────────────────────────────
  console.log('📦 Top-level schema (#1234)');

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

  // ── 2. rezonancniKoeficijent ──────────────────────────────────────────────
  console.log('\n📦 rezonancniKoeficijent (#1234)');

  await test('rezonancniKoeficijent je broj', () => {
    assert(typeof r.rezonancniKoeficijent === 'number', 'rezonancniKoeficijent tip');
  });

  await test('rezonancniKoeficijent je >= 0', () => {
    assert(r.rezonancniKoeficijent >= 0, `rezonancniKoeficijent >= 0: ${r.rezonancniKoeficijent}`);
  });

  await test('rezonancniKoeficijent je <= 1', () => {
    assert(r.rezonancniKoeficijent <= 1, `rezonancniKoeficijent <= 1: ${r.rezonancniKoeficijent}`);
  });

  // ── 3. spektralniSlojevi ──────────────────────────────────────────────────
  console.log('\n📦 spektralniSlojevi (#1234)');

  await test('spektralniSlojevi je niz', () => {
    assert(Array.isArray(r.spektralniSlojevi), 'spektralniSlojevi niz');
  });

  await test('spektralniSlojevi ima 4 elementa', () => {
    assertEqual(r.spektralniSlojevi.length, 4, 'spektralniSlojevi.length');
  });

  await test('svaki sloj ima nivo 1–4', () => {
    r.spektralniSlojevi.forEach((sl, i) => {
      assert(sl.nivo === i + 1, `sloj[${i}].nivo === ${i + 1}: ${sl.nivo}`);
    });
  });

  await test('svaki sloj ima 4 harmonika', () => {
    for (const sl of r.spektralniSlojevi) {
      assertEqual(sl.harmonici.length, 4, `harmonici.length za sloj ${sl.nivo}`);
    }
  });

  await test('rezonancniIndeks svakog sloja je 0–1', () => {
    for (const sl of r.spektralniSlojevi) {
      assert(
        sl.rezonancniIndeks >= 0 && sl.rezonancniIndeks <= 1,
        `rezonancniIndeks sloj ${sl.nivo}: ${sl.rezonancniIndeks}`,
      );
    }
  });

  await test('dominantniHarmonik svakog sloja je 1–4', () => {
    for (const sl of r.spektralniSlojevi) {
      assert(
        sl.dominantniHarmonik >= 1 && sl.dominantniHarmonik <= 4,
        `dominantniHarmonik sloj ${sl.nivo}: ${sl.dominantniHarmonik}`,
      );
    }
  });

  // ── 4. spektralni harmonici ───────────────────────────────────────────────
  console.log('\n📦 Spektralni harmonici (#1234)');

  await test('gustina harmonika sumira se blizu 1 za svaki sloj', () => {
    for (const sl of r.spektralniSlojevi) {
      const suma = sl.harmonici.reduce((s, h) => s + h.gustina, 0);
      // Dopuštamo malu numeričku grešku
      assert(
        Math.abs(suma - 1) < 0.01 || suma === 0,
        `suma gustine sloj ${sl.nivo}: ${suma}`,
      );
    }
  });

  await test('frekvencije harmonika su >= 0', () => {
    for (const sl of r.spektralniSlojevi) {
      for (const h of sl.harmonici) {
        assert(h.frekvencija >= 0, `frekvencija sloj ${sl.nivo} H${h.k}: ${h.frekvencija}`);
      }
    }
  });

  await test('amplitude harmonika su >= 0', () => {
    for (const sl of r.spektralniSlojevi) {
      for (const h of sl.harmonici) {
        assert(h.amplituda >= 0, `amplituda sloj ${sl.nivo} H${h.k}: ${h.amplituda}`);
      }
    }
  });

  // ── 5. laureatskiHarmonik & spektralnaGustina ─────────────────────────────
  console.log('\n📦 Laureatski harmonik & spektralna gustina (#1234)');

  await test('laureatskiHarmonik je > 0', () => {
    assert(r.laureatskiHarmonik > 0, `laureatskiHarmonik: ${r.laureatskiHarmonik}`);
  });

  await test('spektralnaGustina je 0–1', () => {
    assert(
      r.spektralnaGustina >= 0 && r.spektralnaGustina <= 1,
      `spektralnaGustina: ${r.spektralnaGustina}`,
    );
  });

  await test('ukupnaSpektralnaSnaga je > 0', () => {
    assert(r.ukupnaSpektralnaSnaga > 0, `ukupnaSpektralnaSnaga: ${r.ukupnaSpektralnaSnaga}`);
  });

  await test('eurekaSinergija je 0–1', () => {
    assert(
      r.eurekaSinergija >= 0 && r.eurekaSinergija <= 1,
      `eurekaSinergija: ${r.eurekaSinergija}`,
    );
  });

  // ── 6. Konzistentnost konstanti ───────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#1234)');

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
