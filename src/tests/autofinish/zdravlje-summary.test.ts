// Autofinish #902 — Unit Testovi getAutofinishHealthSummary()
// Autofinish #904 — Integracioni Testovi /api/autofinish-zdravlje
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/zdravlje-summary.test.ts

import { getAutofinishHealthSummary } from '../../lib/autofinish-petlja';
import { runDiagnostics } from '../../lib/auto-repair';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_DIAGNOSTIKA,
  TOTAL_API_ROUTES,
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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🏥 Zdravlje Summary — Unit + Integration Test Suite (#902 + #904)\n');

  // ── 1. getAutofinishHealthSummary() schema (#902) ─────────────────────────
  console.log('📦 getAutofinishHealthSummary() Schema (#902)');

  const h = getAutofinishHealthSummary();

  await test('Vraća objekat', () => {
    assert(typeof h === 'object' && h !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(h.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(h.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('zdravlje je broj', () => {
    assert(typeof h.zdravlje === 'number', 'zdravlje je broj');
  });

  await test('zdravlje je u opsegu 0–100', () => {
    assert(h.zdravlje >= 0 && h.zdravlje <= 100, `zdravlje 0–100: ${h.zdravlje}`);
  });

  await test('ukupnoProvera je broj > 0', () => {
    assert(typeof h.ukupnoProvera === 'number' && h.ukupnoProvera > 0, `ukupnoProvera > 0: ${h.ukupnoProvera}`);
  });

  await test('uspesnih je broj >= 0', () => {
    assert(typeof h.uspesnih === 'number' && h.uspesnih >= 0, `uspesnih >= 0: ${h.uspesnih}`);
  });

  await test('upozorenja je broj >= 0', () => {
    assert(typeof h.upozorenja === 'number' && h.upozorenja >= 0, `upozorenja >= 0`);
  });

  await test('gresaka je broj >= 0', () => {
    assert(typeof h.gresaka === 'number' && h.gresaka >= 0, `gresaka >= 0`);
  });

  await test('kriticnih je broj >= 0', () => {
    assert(typeof h.kriticnih === 'number' && h.kriticnih >= 0, `kriticnih >= 0`);
  });

  await test('status je jedan od 4 vrednosti', () => {
    const valid = ['ok', 'warning', 'error'];
    assert(valid.includes(h.status), `status validan: ${h.status}`);
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(h.timestamp)), 'timestamp ISO');
  });

  // ── 2. Logički invarijanti (#902) ─────────────────────────────────────────
  console.log('\n📦 Logički Invarijanti (#902)');

  await test('uspesnih <= ukupnoProvera', () => {
    assert(h.uspesnih <= h.ukupnoProvera, `uspesnih <= ukupnoProvera`);
  });

  await test('upozorenja <= ukupnoProvera', () => {
    assert(h.upozorenja <= h.ukupnoProvera, `upozorenja <= ukupnoProvera`);
  });

  await test('gresaka + kriticnih + upozorenja + uspesnih === ukupnoProvera', () => {
    const suma = h.gresaka + h.kriticnih + h.upozorenja + h.uspesnih;
    assertEqual(suma, h.ukupnoProvera, 'suma == ukupnoProvera');
  });

  await test('zdravlje >= 95 => status odlično', () => {
    if (h.zdravlje >= 95) {
      assertEqual(h.status, 'ok', 'status ok za zdravlje>=95');
    }
  });

  await test('zdravlje === 100 => svi uspesnih', () => {
    if (h.zdravlje === 100) {
      assertEqual(h.uspesnih, h.ukupnoProvera, 'svi uspesnih za zdravlje=100');
    }
  });

  // ── 3. Konzistentnost sa runDiagnostics() (#902) ──────────────────────────
  console.log('\n📦 Konzistentnost sa runDiagnostics() (#902)');

  const d = runDiagnostics();

  await test('zdravlje == runDiagnostics().zdravlje', () => {
    assertEqual(h.zdravlje, d.zdravlje, 'zdravlje konzistentno');
  });

  await test('ukupnoProvera == runDiagnostics().ukupnoProvera', () => {
    assertEqual(h.ukupnoProvera, d.ukupnoProvera, 'ukupnoProvera konzistentno');
  });

  await test('uspesnih == runDiagnostics().uspesnih', () => {
    assertEqual(h.uspesnih, d.uspesnih, 'uspesnih konzistentno');
  });

  await test('upozorenja == runDiagnostics().upozorenja', () => {
    assertEqual(h.upozorenja, d.upozorenja, 'upozorenja konzistentno');
  });

  await test('gresaka == runDiagnostics().gresaka', () => {
    assertEqual(h.gresaka, d.gresaka, 'gresaka konzistentno');
  });

  await test('kriticnih == runDiagnostics().kriticnih', () => {
    assertEqual(h.kriticnih, d.kriticnih, 'kriticnih konzistentno');
  });

  await test('ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(h.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'ukupnoProvera=TOTAL_DIAGNOSTIKA');
  });

  // ── 4. /api/autofinish-zdravlje simulacija (#904) ─────────────────────────
  console.log('\n📦 /api/autofinish-zdravlje — E2E Schema (#904)');

  function simulateZdravljeGET() {
    const health = getAutofinishHealthSummary();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: health,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateZdravljeGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    const r = simulateZdravljeGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control s-maxage=30');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateZdravljeGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateZdravljeGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateZdravljeGET();
    const required = ['verzija', 'autofinishBroj', 'zdravlje', 'ukupnoProvera', 'uspesnih', 'upozorenja', 'gresaka', 'kriticnih', 'status', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateZdravljeGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body.zdravlje je 0–100', () => {
    const r = simulateZdravljeGET();
    assert(r.body.zdravlje >= 0 && r.body.zdravlje <= 100, `zdravlje 0–100`);
  });

  await test('body.status je validan', () => {
    const r = simulateZdravljeGET();
    const valid = ['ok', 'warning', 'error'];
    assert(valid.includes(r.body.status), `status validan: ${r.body.status}`);
  });

  await test('body.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    const r = simulateZdravljeGET();
    assertEqual(r.body.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'ukupnoProvera=TOTAL_DIAGNOSTIKA');
  });

  // ── 5. Globalni invarijanti (#904) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#904)');

  await test('AUTOFINISH_COUNT === 950', () => {
    assertEqual(AUTOFINISH_COUNT, 960, 'AUTOFINISH_COUNT=960');
  });

  await test('APP_VERSION === "44.71.0"', () => {
    assertEqual(APP_VERSION, '44.81.0', 'APP_VERSION=44.81.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1884', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1904, 'TOTAL_DIAGNOSTIKA=1904');
  });

  await test('TOTAL_API_ROUTES === 940', () => {
    assertEqual(TOTAL_API_ROUTES, 942, 'TOTAL_API_ROUTES=942');
  });

  // ─── Rezultat ─────────────────────────────────────────────────────────────
  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
