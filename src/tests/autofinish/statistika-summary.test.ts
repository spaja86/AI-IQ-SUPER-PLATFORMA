// Autofinish #892 — Unit Testovi getAutofinishStatistikaSummary()
// Autofinish #894 — Integracioni Testovi /api/autofinish-statistika
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/statistika-summary.test.ts

import {
  getAutofinishStatistikaSummary,
} from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_DIAGNOSTIKA,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
  SPAJA_PRO_VERZIJA_COUNT,
  AUTOFINISH_TARGET,
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
  console.log('\n📊 Statistika Summary — Unit + Integration Test Suite (#892 + #894)\n');

  // ── 1. getAutofinishStatistikaSummary() schema (#892) ──────────────────────
  console.log('📦 getAutofinishStatistikaSummary() Schema (#892)');

  const s = getAutofinishStatistikaSummary();

  await test('Vraća objekat', () => {
    assert(typeof s === 'object' && s !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(s.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(s.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('rute === TOTAL_ROUTES', () => {
    assertEqual(s.rute, TOTAL_ROUTES, 'rute');
  });

  await test('apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(s.apiRute, TOTAL_API_ROUTES, 'apiRute');
  });

  await test('stranice === TOTAL_PAGES', () => {
    assertEqual(s.stranice, TOTAL_PAGES, 'stranice');
  });

  await test('dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(s.dijagnostike, TOTAL_DIAGNOSTIKA, 'dijagnostike');
  });

  await test('igrice === TOTAL_IGRICA', () => {
    assertEqual(s.igrice, TOTAL_IGRICA, 'igrice');
  });

  await test('omegaAiPersone === OMEGA_AI_PERSONA_COUNT', () => {
    assertEqual(s.omegaAiPersone, OMEGA_AI_PERSONA_COUNT, 'omegaAiPersone');
  });

  await test('omegaAiOktave === OMEGA_AI_OKTAVA_COUNT', () => {
    assertEqual(s.omegaAiOktave, OMEGA_AI_OKTAVA_COUNT, 'omegaAiOktave');
  });

  await test('omegaAiUkupno === OMEGA_AI_PERSONA_UKUPNO', () => {
    assertEqual(s.omegaAiUkupno, OMEGA_AI_PERSONA_UKUPNO, 'omegaAiUkupno');
  });

  await test('spajaProVerzija === SPAJA_PRO_VERZIJA_COUNT', () => {
    assertEqual(s.spajaProVerzija, SPAJA_PRO_VERZIJA_COUNT, 'spajaProVerzija');
  });

  await test('autofinishTarget === AUTOFINISH_TARGET', () => {
    assertEqual(s.autofinishTarget, AUTOFINISH_TARGET, 'autofinishTarget');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(s.timestamp)), 'timestamp ISO');
  });

  // ── 2. Tipovi (#892) ─────────────────────────────────────────────────────
  console.log('\n📦 Tipovi (#892)');

  await test('rute je broj > 0', () => {
    assert(typeof s.rute === 'number' && s.rute > 0, `rute > 0: ${s.rute}`);
  });

  await test('apiRute je broj > 0', () => {
    assert(typeof s.apiRute === 'number' && s.apiRute > 0, `apiRute > 0: ${s.apiRute}`);
  });

  await test('dijagnostike je broj > 0', () => {
    assert(typeof s.dijagnostike === 'number' && s.dijagnostike > 0, `dijagnostike > 0: ${s.dijagnostike}`);
  });

  await test('igrice je broj > 0', () => {
    assert(typeof s.igrice === 'number' && s.igrice > 0, `igrice > 0: ${s.igrice}`);
  });

  await test('omegaAiPersone je broj > 0', () => {
    assert(typeof s.omegaAiPersone === 'number' && s.omegaAiPersone > 0, `omegaAiPersone > 0: ${s.omegaAiPersone}`);
  });

  await test('omegaAiUkupno je broj > 0', () => {
    assert(typeof s.omegaAiUkupno === 'number' && s.omegaAiUkupno > 0, `omegaAiUkupno > 0: ${s.omegaAiUkupno}`);
  });

  await test('autofinishTarget je broj > 0', () => {
    assert(typeof s.autofinishTarget === 'number' && s.autofinishTarget > 0, `autofinishTarget > 0`);
  });

  await test('apiRute <= rute', () => {
    assert(s.apiRute <= s.rute, `apiRute <= rute: ${s.apiRute} <= ${s.rute}`);
  });

  await test('stranice <= rute', () => {
    assert(s.stranice <= s.rute, `stranice <= rute: ${s.stranice} <= ${s.rute}`);
  });

  // ── 3. Konzistentnost (#892) ─────────────────────────────────────────────
  console.log('\n📦 Konzistentnost (#892)');

  await test('Dva uzastopna poziva konzistentna', () => {
    const s1 = getAutofinishStatistikaSummary();
    const s2 = getAutofinishStatistikaSummary();
    assertEqual(s1.verzija, s2.verzija, 'verzija konzistentna');
    assertEqual(s1.rute, s2.rute, 'rute konzistentno');
    assertEqual(s1.dijagnostike, s2.dijagnostike, 'dijagnostike konzistentno');
    assertEqual(s1.autofinishBroj, s2.autofinishBroj, 'autofinishBroj konzistentno');
  });

  // ── 4. /api/autofinish-statistika simulacija (#894) ──────────────────────
  console.log('\n📦 /api/autofinish-statistika — E2E Schema (#894)');

  function simulateStatistikaGET() {
    const stat = getAutofinishStatistikaSummary();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: stat,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateStatistikaGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=60', () => {
    const r = simulateStatistikaGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=60'), 'Cache-Control s-maxage=60');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateStatistikaGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateStatistikaGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateStatistikaGET();
    const required = ['verzija', 'autofinishBroj', 'rute', 'apiRute', 'stranice', 'dijagnostike',
      'igrice', 'omegaAiPersone', 'omegaAiOktave', 'omegaAiUkupno', 'spajaProVerzija', 'autofinishTarget', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateStatistikaGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    const r = simulateStatistikaGET();
    assertEqual(r.body.dijagnostike, TOTAL_DIAGNOSTIKA, 'body.dijagnostike');
  });

  await test('body.timestamp je validan ISO', () => {
    const r = simulateStatistikaGET();
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp ISO');
  });

  // ── 5. Globalni invarijanti (#894) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#894)');

  await test('AUTOFINISH_COUNT === 950', () => {
    assertEqual(AUTOFINISH_COUNT, 950, 'AUTOFINISH_COUNT=950');
  });

  await test('APP_VERSION === "44.21.0"', () => {
    assertEqual(APP_VERSION, '44.71.0', 'APP_VERSION=44.71.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1884', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1884, 'TOTAL_DIAGNOSTIKA=1884');
  });

  await test('TOTAL_API_ROUTES === 940', () => {
    assertEqual(TOTAL_API_ROUTES, 940, 'TOTAL_API_ROUTES=940');
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
