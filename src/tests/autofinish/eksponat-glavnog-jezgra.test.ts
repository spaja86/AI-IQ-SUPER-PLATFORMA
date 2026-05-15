// Autofinish #1253 — Unit Testovi buildEksponatGlavnogJezgra()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/eksponat-glavnog-jezgra.test.ts

import { buildEksponatGlavnogJezgra } from '../../lib/eksponat-glavnog-jezgra';
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
  console.log('\n🔬  EKSPONAT GLAVNOG JEZGRA — Unit Test Suite (#1253)\n');

  const r = buildEksponatGlavnogJezgra('test-user-id');

  // ── 1. Top-level schema ───────────────────────────────────────────────────
  console.log('📦 Top-level schema (#1253)');

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

  // ── 2. eksponatKoeficijent ────────────────────────────────────────────────
  console.log('\n📦 eksponatKoeficijent (#1253)');

  await test('eksponatKoeficijent je broj', () => {
    assert(typeof r.eksponatKoeficijent === 'number', 'eksponatKoeficijent tip');
  });

  await test('eksponatKoeficijent je >= 0', () => {
    assert(r.eksponatKoeficijent >= 0, `eksponatKoeficijent >= 0: ${r.eksponatKoeficijent}`);
  });

  await test('eksponatKoeficijent je <= 1', () => {
    assert(r.eksponatKoeficijent <= 1, `eksponatKoeficijent <= 1: ${r.eksponatKoeficijent}`);
  });

  // ── 3. ilustrovaniOktavniSistem ───────────────────────────────────────────
  console.log('\n📦 ilustrovaniOktavniSistem (#1253)');

  await test('ilustrovaniOktavniSistem je objekat', () => {
    assert(typeof r.ilustrovaniOktavniSistem === 'object' && r.ilustrovaniOktavniSistem !== null, 'objekat');
  });

  await test('jedinjenja ima 8 elemenata', () => {
    assertEqual(r.ilustrovaniOktavniSistem.jedinjenja.length, 8, 'jedinjenja.length');
  });

  await test('srazmernoCentimentarnoSjedinjavanje je 0–1', () => {
    const v = r.ilustrovaniOktavniSistem.srazmernoCentimentarnoSjedinjavanje;
    assert(v >= 0 && v <= 1, `srazmernoCentimentarnoSjedinjavanje: ${v}`);
  });

  await test('sistematskiInfrajedinkonalniSkvenc je broj', () => {
    assert(
      typeof r.ilustrovaniOktavniSistem.sistematskiInfrajedinkonalniSkvenc === 'number',
      'sistematskiInfrajedinkonalniSkvenc tip',
    );
  });

  await test('srazmerniFaktorKonvergencije je 0–1', () => {
    const v = r.ilustrovaniOktavniSistem.srazmerniFaktorKonvergencije;
    assert(v >= 0 && v <= 1, `srazmerniFaktorKonvergencije: ${v}`);
  });

  await test('oktodomolniKuzmetrijskiParavan je 8×8 matrica', () => {
    const m = r.ilustrovaniOktavniSistem.oktodomolniKuzmetrijskiParavan;
    assert(Array.isArray(m) && m.length === 8, 'matrica.length === 8');
    for (const red of m) {
      assert(Array.isArray(red) && red.length === 8, `red.length === 8: ${red.length}`);
    }
  });

  // ── 4. Cinemetrička jedinjenja ────────────────────────────────────────────
  console.log('\n📦 Cinemetrička jedinjenja (#1253)');

  await test('svako jedinjenje ima oktava 1–8', () => {
    r.ilustrovaniOktavniSistem.jedinjenja.forEach((j, i) => {
      assert(j.oktava === i + 1, `jedinjenje[${i}].oktava === ${i + 1}: ${j.oktava}`);
    });
  });

  await test('cinemetricnaKomponenta je 0–1 za sva jedinjenja', () => {
    for (const j of r.ilustrovaniOktavniSistem.jedinjenja) {
      assert(
        j.cinemetricnaKomponenta >= 0 && j.cinemetricnaKomponenta <= 1,
        `cinemetricnaKomponenta oktava ${j.oktava}: ${j.cinemetricnaKomponenta}`,
      );
    }
  });

  await test('centimentarnaVrednost je 0–1 za sva jedinjenja', () => {
    for (const j of r.ilustrovaniOktavniSistem.jedinjenja) {
      assert(
        j.centimentarnaVrednost >= 0 && j.centimentarnaVrednost <= 1,
        `centimentarnaVrednost oktava ${j.oktava}: ${j.centimentarnaVrednost}`,
      );
    }
  });

  await test('centimentarneVrednosti sumiraju se blizu 1', () => {
    const suma = r.ilustrovaniOktavniSistem.jedinjenja.reduce(
      (s, j) => s + j.centimentarnaVrednost,
      0,
    );
    assert(Math.abs(suma - 1) < 0.01, `suma centimentarnih: ${suma}`);
  });

  await test('eksponicijalnaVrednost je >= 0 za sva jedinjenja', () => {
    for (const j of r.ilustrovaniOktavniSistem.jedinjenja) {
      assert(j.eksponicijalnaVrednost >= 0, `eksponicijalnaVrednost oktava ${j.oktava}: ${j.eksponicijalnaVrednost}`);
    }
  });

  await test('naziv i ikona su neprazni stringovi', () => {
    for (const j of r.ilustrovaniOktavniSistem.jedinjenja) {
      assert(typeof j.naziv === 'string' && j.naziv.length > 0, `naziv oktava ${j.oktava}`);
      assert(typeof j.ikona === 'string' && j.ikona.length > 0, `ikona oktava ${j.oktava}`);
    }
  });

  // ── 5. Metrike jezgra ─────────────────────────────────────────────────────
  console.log('\n📦 Metrike jezgra (#1253)');

  await test('jezgroSnaga je broj > 0', () => {
    assert(typeof r.jezgroSnaga === 'number' && r.jezgroSnaga > 0, `jezgroSnaga: ${r.jezgroSnaga}`);
  });

  await test('egzocentricnost je >= 0', () => {
    assert(r.egzocentricnost >= 0, `egzocentricnost: ${r.egzocentricnost}`);
  });

  await test('matricnaSimetrija je > 0', () => {
    assert(r.matricnaSimetrija > 0, `matricnaSimetrija: ${r.matricnaSimetrija}`);
  });

  await test('eurekaKoeficijent je 0–1', () => {
    assert(r.eurekaKoeficijent >= 0 && r.eurekaKoeficijent <= 1, `eurekaKoeficijent: ${r.eurekaKoeficijent}`);
  });

  await test('spektralnaGustina je 0–1', () => {
    assert(r.spektralnaGustina >= 0 && r.spektralnaGustina <= 1, `spektralnaGustina: ${r.spektralnaGustina}`);
  });

  // ── 6. Konzistentnost konstanti ───────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#1253)');

  await test('AUTOFINISH_COUNT === 1257', () => {
    assertEqual(AUTOFINISH_COUNT, 1257, 'AUTOFINISH_COUNT=1257');
  });

  await test('APP_VERSION === "52.6.0"', () => {
    assertEqual(APP_VERSION, '52.6.0', 'APP_VERSION=52.6.0');
  });

  await test('TOTAL_API_ROUTES === 1124', () => {
    assertEqual(TOTAL_API_ROUTES, 1124, 'TOTAL_API_ROUTES=1124');
  });

  await test('TOTAL_ROUTES === 1207', () => {
    assertEqual(TOTAL_ROUTES, 1207, 'TOTAL_ROUTES=1207');
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
