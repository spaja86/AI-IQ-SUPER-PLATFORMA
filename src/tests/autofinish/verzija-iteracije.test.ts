// Autofinish #972 — Unit Testovi getAutofinishIteracijePoVerziji()
// Autofinish #974 — Integracioni Testovi /api/autofinish-verzija-iteracije
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/verzija-iteracije.test.ts

import {
  getAutofinishIteracijePoVerziji,
  getAutofinishVerzijeSummary,
} from '../../lib/autofinish-petlja';
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
  console.log('\n🔍 Iteracije po Verziji + API Integration — Test Suite (#972 + #974)\n');

  // ── 0. Prep ────────────────────────────────────────────────────────────────
  const summary = getAutofinishVerzijeSummary();
  assert(summary.verzije.length > 0, 'ima milestones');
  const testVerzija = summary.verzije[0].verzija;

  // ── 1. Schema (#972) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishIteracijePoVerziji() Schema (#972)');

  const res = getAutofinishIteracijePoVerziji(testVerzija);

  await test('Ne vraća null', () => {
    assert(res !== null && typeof res === 'object', 'nije null');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(res.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(res.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('targetVerzija je proslijeđena verzija', () => {
    assertEqual(res.targetVerzija, testVerzija, 'targetVerzija');
  });

  await test('ukupno === iteracije.length', () => {
    assertEqual(res.ukupno, res.iteracije.length, 'ukupno===iteracije.length');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(res.timestamp)), 'timestamp ISO');
  });

  await test('iteracije je niz', () => {
    assert(Array.isArray(res.iteracije), 'iteracije niz');
  });

  // ── 2. Konzistentnost (#972) ──────────────────────────────────────────────
  console.log('\n📦 Konzistentnost (#972)');

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishIteracijePoVerziji(testVerzija);
    const r2 = getAutofinishIteracijePoVerziji(testVerzija);
    assertEqual(r1.ukupno, r2.ukupno, 'ukupno konzistentno');
    assertEqual(r1.verzija, r2.verzija, 'verzija konzistentno');
  });

  await test('Svaka iteracija.opis je string > 0', () => {
    for (const it of res.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  await test('Svaka iteracija.broj je pozitivan int', () => {
    for (const it of res.iteracije) {
      assert(Number.isInteger(it.broj) && it.broj > 0, `broj validan za #${it.broj}`);
    }
  });

  await test('Sve iteracije za testVerzija su različite (no duplicates)', () => {
    const brojevi = res.iteracije.map((it) => it.broj);
    const unique = new Set(brojevi);
    assertEqual(unique.size, brojevi.length, 'no duplicates');
  });

  // ── 3. Edge cases (#972) ──────────────────────────────────────────────────
  console.log('\n📦 Edge Cases (#972)');

  await test('Nepoznata verzija vraća ukupno=0', () => {
    const r = getAutofinishIteracijePoVerziji('0.0.0');
    assertEqual(r.ukupno, 0, 'ukupno=0 za nepoznatu verziju');
  });

  await test('Nepoznata verzija vraća prazne iteracije', () => {
    const r = getAutofinishIteracijePoVerziji('99.99.99');
    assertEqual(r.iteracije.length, 0, 'iteracije prazan niz');
  });

  await test('Prazni string vraća ukupno=0', () => {
    const r = getAutofinishIteracijePoVerziji('');
    assertEqual(r.ukupno, 0, 'prazni string');
  });

  await test('Zadnja verzija ima AUTOFINISH_COUNT >= ukupno', () => {
    const zadnja = summary.verzije[summary.verzije.length - 1];
    const r = getAutofinishIteracijePoVerziji(zadnja.verzija);
    assert(AUTOFINISH_COUNT >= r.ukupno, 'AUTOFINISH_COUNT >= zadnja.ukupno');
  });

  // ── 4. Sve milestone verzije (#972) ───────────────────────────────────────
  console.log('\n📦 Sve Milestone Verzije (#972)');

  await test('Svaka milestone verzija daje rezultat', () => {
    for (const m of summary.verzije) {
      const r = getAutofinishIteracijePoVerziji(m.verzija);
      assert(typeof r === 'object' && r !== null, `nije null za ${m.verzija}`);
    }
  });

  await test('Svaka milestone verzija targetVerzija == m.verzija', () => {
    for (const m of summary.verzije) {
      const r = getAutofinishIteracijePoVerziji(m.verzija);
      assertEqual(r.targetVerzija, m.verzija, `targetVerzija za ${m.verzija}`);
    }
  });

  // ── 5. /api/autofinish-verzija-iteracije simulacija (#974) ────────────────
  console.log('\n📦 /api/autofinish-verzija-iteracije — E2E Schema (#974)');

  function simulateVerzijaIterGET(params: Record<string, string>) {
    const targetVerzija = params.verzija ?? '';

    if (!targetVerzija) {
      return {
        status: 400,
        body: { error: 'INVALID_PARAMS' },
        headers: { 'X-App-Version': APP_VERSION },
      };
    }

    const result = getAutofinishIteracijePoVerziji(targetVerzija);
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: result,
    };
  }

  await test(`HTTP 200 za verzija=${testVerzija}`, () => {
    assertEqual(simulateVerzijaIterGET({ verzija: testVerzija }).status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=600', () => {
    const resp = simulateVerzijaIterGET({ verzija: testVerzija });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=600'), 's-maxage=600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateVerzijaIterGET({ verzija: testVerzija });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 bez verzija parametra', () => {
    assertEqual(simulateVerzijaIterGET({}).status, 400, 'HTTP 400 bez params');
  });

  await test('HTTP 200 za nepoznatu verziju (vraća ukupno=0)', () => {
    const resp = simulateVerzijaIterGET({ verzija: '0.0.0' });
    assertEqual(resp.status, 200, 'HTTP 200 za nepoznatu');
    assertEqual((resp.body as { ukupno: number }).ukupno, 0, 'ukupno=0');
  });

  await test('Body ima sve obavezne ključeve', () => {
    const resp = simulateVerzijaIterGET({ verzija: testVerzija });
    const required = ['verzija', 'autofinishBroj', 'targetVerzija', 'ukupno', 'iteracije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  await test('Body verzija === APP_VERSION', () => {
    const resp = simulateVerzijaIterGET({ verzija: testVerzija });
    assertEqual((resp.body as { verzija: string }).verzija, APP_VERSION, 'body.verzija');
  });

  await test('HTTP 200 za sve milestone verzije', () => {
    for (const m of summary.verzije) {
      const s = simulateVerzijaIterGET({ verzija: m.verzija }).status;
      assert(s === 200, `${m.verzija}: HTTP 200 (got ${s})`);
    }
  });

  // ── 6. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti');

  await test('AUTOFINISH_COUNT === 980', () => {
    assertEqual(AUTOFINISH_COUNT, 980, 'AUTOFINISH_COUNT=980');
  });

  await test('APP_VERSION === "45.01.0"', () => {
    assertEqual(APP_VERSION, '45.01.0', 'APP_VERSION=45.01.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1944', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1944, 'TOTAL_DIAGNOSTIKA=1944');
  });

  await test('TOTAL_API_ROUTES === 948', () => {
    assertEqual(TOTAL_API_ROUTES, 948, 'TOTAL_API_ROUTES=948');
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
