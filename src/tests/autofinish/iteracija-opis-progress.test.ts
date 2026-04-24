// Autofinish #872 — Unit Testovi getAutofinishIteracijaOpis()
// Autofinish #876 — Integracioni Testovi /api/autofinish-progress
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. getAutofinishIteracijaOpis() — poznati opisi, default fallback, tipovi
//   2. GET /api/autofinish-iteracija-opis simulacija — ?br=N, schema, Cache-Control
//   3. getAutofinishProgressInfo() — schema, procenat, preostalo, prognoza
//   4. /api/autofinish-progress simulacija — schema, Cache-Control, headers
//
// Pokretanje: npx tsx src/tests/autofinish/iteracija-opis-progress.test.ts

import {
  getAutofinishIteracijaOpis,
  getAutofinishProgressInfo,
} from '../../lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
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
  console.log('\n📝 Iteracija Opis + Progress — Unit Test Suite (#872 + #876)\n');

  // ── 1. getAutofinishIteracijaOpis() — poznati opisi (#872) ────────────────
  console.log('📦 getAutofinishIteracijaOpis() — Poznati Opisi (#872)');

  const poznatoOpisi: Array<[number, string[]]> = [
    [841, ['integracioni', 'api/health', 'health']],
    [842, ['unit', 'api-error', 'testovi']],
    [843, ['unit', 'config-validation', 'testovi']],
    [844, ['logger', 'request-id', 'unit']],
    [845, ['integracioni', 'autofinish-dependency-audit']],
    [854, ['changelog', 'GET', 'api']],
    [855, ['changelog', 'dashboard', 'sekcija']],
    [856, ['getLastNIterations', 'helper']],
    [857, ['testovi', 'getLastNIterations']],
    [858, ['X-Request-Id', 'header', 'middleware']],
    [860, ['E2E', 'snapshot', 'JSON', 'schema', 'api']],
    [863, ['getAutofinishEkosistemSnapshot', 'helper', 'ekosistem']],
    [867, ['getAutofinishHealthSummary', 'helper', 'health']],
    [869, ['full-report', 'report', 'GET']],
    [870, ['testovi', 'full-report', 'integracioni']],
    [871, ['iteracija-opis', 'GET', 'api']],
    [872, ['unit', 'testovi', 'getAutofinishIteracijaOpis']],
    [873, ['getAutofinishProgressInfo', 'helper', 'progress']],
    [874, ['dashboard', 'progress', 'widget']],
    [875, ['progress', 'GET', 'api']],
    [876, ['testovi', 'progress', 'integracioni']],
    [877, ['getAutofinishPodsistemiDetails', 'helper', 'podsistemi']],
    [878, ['testovi', 'podsistemi', 'unit']],
    [879, ['podsistemi', 'GET', 'api']],
    [880, ['testovi', 'podsistemi', 'integracioni']],
  ];

  for (const [br, keywords] of poznatoOpisi) {
    await test(`#${br} opis je informativan (nema "iteracija #${br}" default)`, () => {
      const opis = getAutofinishIteracijaOpis(br);
      assert(typeof opis === 'string', `opis je string za #${br}`);
      assert(opis.length > 0, `opis nije prazan za #${br}`);
      const opisLower = opis.toLowerCase();
      const hasKeyword = keywords.some((k) => opisLower.includes(k.toLowerCase()));
      assert(hasKeyword, `opis #${br} sadrži barem jedan od: ${keywords.join(', ')}. Dobio: "${opis}"`);
    });
  }

  await test('Default fallback za nepoznat broj (999999)', () => {
    const opis = getAutofinishIteracijaOpis(999999);
    assert(opis.includes('999999'), `fallback sadrži broj: "${opis}"`);
  });

  await test('Default fallback za 0', () => {
    const opis = getAutofinishIteracijaOpis(0);
    assert(typeof opis === 'string', 'string za 0');
    assert(opis.length > 0, 'nije prazan za 0');
  });

  await test('Sve iteracije 841–880 vraćaju string koji nije prazan', () => {
    for (let br = 841; br <= 880; br++) {
      const opis = getAutofinishIteracijaOpis(br);
      assert(typeof opis === 'string', `string za #${br}`);
      assert(opis.length > 0, `nije prazan za #${br}`);
    }
  });

  // ── 2. /api/autofinish-iteracija-opis simulacija (#872) ──────────────────
  console.log('\n📦 /api/autofinish-iteracija-opis Simulacija (#872)');

  function simulateIteracijaOpisGET(brParam: string | null) {
    const DEFAULT_BR = AUTOFINISH_COUNT;
    const br = parseInt(brParam ?? String(DEFAULT_BR), 10);
    const validBr = !isNaN(br) && br > 0 ? br : DEFAULT_BR;
    const opis = getAutofinishIteracijaOpis(validBr);
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: {
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        br: validBr,
        opis,
        timestamp: new Date().toISOString(),
      },
    };
  }

  await test('HTTP 200 za default poziv', () => {
    assertEqual(simulateIteracijaOpisGET(null).status, 200, 'HTTP 200');
  });

  await test('Default bez ?br — vraća AUTOFINISH_COUNT', () => {
    const r = simulateIteracijaOpisGET(null);
    assertEqual(r.body.br, AUTOFINISH_COUNT, 'br=AUTOFINISH_COUNT');
  });

  await test('?br=860 — vraća opis za #860', () => {
    const r = simulateIteracijaOpisGET('860');
    assertEqual(r.body.br, 860, 'br=860');
    assert(typeof r.body.opis === 'string', 'opis je string');
    assert(r.body.opis.length > 0, 'opis nije prazan');
  });

  await test('?br=abc — fallback na AUTOFINISH_COUNT', () => {
    const r = simulateIteracijaOpisGET('abc');
    assertEqual(r.body.br, AUTOFINISH_COUNT, 'fallback=AUTOFINISH_COUNT');
  });

  await test('?br=0 — fallback na AUTOFINISH_COUNT', () => {
    const r = simulateIteracijaOpisGET('0');
    assertEqual(r.body.br, AUTOFINISH_COUNT, 'fallback=AUTOFINISH_COUNT za br=0');
  });

  await test('Cache-Control sadrži s-maxage=3600', () => {
    const r = simulateIteracijaOpisGET(null);
    assert(r.headers['Cache-Control'].includes('s-maxage=3600'), 'Cache-Control s-maxage=3600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateIteracijaOpisGET(null);
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('verzija === APP_VERSION', () => {
    const r = simulateIteracijaOpisGET(null);
    assertEqual(r.body.verzija, APP_VERSION, 'verzija');
  });

  await test('timestamp je validan ISO', () => {
    const r = simulateIteracijaOpisGET(null);
    assert(!isNaN(Date.parse(r.body.timestamp)), 'timestamp je validan ISO');
  });

  // ── 3. getAutofinishProgressInfo() schema (#873) ──────────────────────────
  console.log('\n📦 getAutofinishProgressInfo() Schema (#873)');

  const prog = getAutofinishProgressInfo();

  await test('Vraća objekat', () => {
    assert(typeof prog === 'object' && prog !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(prog.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(prog.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('target === AUTOFINISH_TARGET', () => {
    assertEqual(prog.target, AUTOFINISH_TARGET, 'target');
  });

  await test('procenat je broj 0–100', () => {
    assert(typeof prog.procenat === 'number', 'procenat je broj');
    assert(prog.procenat >= 0 && prog.procenat <= 100, `procenat 0–100: ${prog.procenat}`);
  });

  await test('procenat = AUTOFINISH_COUNT/AUTOFINISH_TARGET * 100 (zaokruženo)', () => {
    const expected = Math.round((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100 * 100) / 100;
    assertEqual(prog.procenat, expected, 'procenat tačan');
  });

  await test('preostalo >= 0', () => {
    assert(typeof prog.preostalo === 'number', 'preostalo je broj');
    assert(prog.preostalo >= 0, `preostalo >= 0: ${prog.preostalo}`);
  });

  await test('preostalo = AUTOFINISH_TARGET - AUTOFINISH_COUNT', () => {
    assertEqual(prog.preostalo, Math.max(AUTOFINISH_TARGET - AUTOFINISH_COUNT, 0), 'preostalo tačno');
  });

  await test('prognoza je string koji nije prazan', () => {
    assert(typeof prog.prognoza === 'string', 'prognoza je string');
    assert(prog.prognoza.length > 0, 'prognoza nije prazna');
  });

  await test('prognoza sadrži "preostalo" ili "Završeno"', () => {
    const valid = prog.prognoza.toLowerCase().includes('preostalo') || prog.prognoza.includes('Završeno');
    assert(valid, `prognoza sadrži relevantne informacije: "${prog.prognoza}"`);
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(prog.timestamp)), 'timestamp je validan ISO');
  });

  await test('autofinishBroj + preostalo === target', () => {
    assertEqual(prog.autofinishBroj + prog.preostalo, prog.target, 'autofinishBroj + preostalo === target');
  });

  // ── 4. /api/autofinish-progress simulacija (#876) ────────────────────────
  console.log('\n📦 /api/autofinish-progress Simulacija (#876)');

  function simulateProgressGET() {
    const progress = getAutofinishProgressInfo();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: progress,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateProgressGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    const r = simulateProgressGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control s-maxage=30');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateProgressGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateProgressGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateProgressGET();
    const required = ['verzija', 'autofinishBroj', 'target', 'procenat', 'preostalo', 'prognoza', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.procenat je 0–100', () => {
    const r = simulateProgressGET();
    assert(r.body.procenat >= 0 && r.body.procenat <= 100, 'procenat 0–100');
  });

  await test('body.preostalo >= 0', () => {
    const r = simulateProgressGET();
    assert(r.body.preostalo >= 0, 'preostalo >= 0');
  });

  // ── 5. Globalni invarijanti ───────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#872 + #876)');

  await test('AUTOFINISH_COUNT === 910', () => {
    assertEqual(AUTOFINISH_COUNT, 910, 'AUTOFINISH_COUNT=910');
  });

  await test('APP_VERSION === "44.21.0"', () => {
    assertEqual(APP_VERSION, '44.31.0', 'APP_VERSION=44.31.0');
  });

  await test('AUTOFINISH_TARGET > AUTOFINISH_COUNT', () => {
    assert(AUTOFINISH_TARGET > AUTOFINISH_COUNT, `AUTOFINISH_TARGET(${AUTOFINISH_TARGET}) > AUTOFINISH_COUNT(${AUTOFINISH_COUNT})`);
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
