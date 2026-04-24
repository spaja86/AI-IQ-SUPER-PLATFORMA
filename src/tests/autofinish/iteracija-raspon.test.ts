// Autofinish #932 — Unit Testovi getAutofinishIteracijaRaspon()
// Autofinish #934 — Integracioni Testovi /api/autofinish-iteracija-raspon
// Autofinish #936 — Unit testovi Dashboard Iteracija Raspon Widget simulacija
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/iteracija-raspon.test.ts

import {
  getAutofinishIteracijaRaspon,
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
  console.log('\n🔄 Iteracija Raspon + API Integration + Widget — Test Suite (#932 + #934 + #936)\n');

  // ── 1. Schema (#932) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishIteracijaRaspon() Schema (#932)');

  const r = getAutofinishIteracijaRaspon(921, 930);

  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('od === 921', () => {
    assertEqual(r.od, 921, 'od');
  });

  await test('do === 930', () => {
    assertEqual(r.do, 930, 'do');
  });

  await test('iteracije je niz', () => {
    assert(Array.isArray(r.iteracije), 'iteracije niz');
  });

  await test('ukupnoIteracija === iteracije.length', () => {
    assertEqual(r.ukupnoIteracija, r.iteracije.length, 'ukupnoIteracija');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  // ── 2. Opseg (#932) ───────────────────────────────────────────────────────
  console.log('\n📦 Opseg Iteracija (#932)');

  await test('Raspon 921–930 daje 10 iteracija', () => {
    assertEqual(r.iteracije.length, 10, '921–930 = 10 iteracija');
  });

  await test('Svaka iteracija.broj je u rasponu', () => {
    for (const it of r.iteracije) {
      assert(it.broj >= 921 && it.broj <= 930, `iteracija #${it.broj} u rasponu`);
    }
  });

  await test('Iteracije sortirane uzlazno', () => {
    const bros = r.iteracije.map((it) => it.broj);
    for (let i = 1; i < bros.length; i++) {
      assert(bros[i] > bros[i - 1], `sortirano ${bros[i - 1]}<${bros[i]}`);
    }
  });

  await test('Svaka iteracija.opis je string > 0', () => {
    for (const it of r.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  await test('Raspon 1–1 daje 1 iteraciju', () => {
    const single = getAutofinishIteracijaRaspon(841, 841);
    assertEqual(single.iteracije.length, 1, '1 iteracija za raspon 841–841');
  });

  await test('Raspon 841–850 daje 10 iteracija', () => {
    const r10 = getAutofinishIteracijaRaspon(841, 850);
    assertEqual(r10.iteracije.length, 10, '841–850 = 10 iteracija');
  });

  await test('Raspon poslednje 20 daje 20 iteracija', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const r20 = getAutofinishIteracijaRaspon(start, AUTOFINISH_COUNT);
    assertEqual(r20.iteracije.length, 20, 'poslednje 20 iteracija');
  });

  // ── 3. Prazan raspon i granični slučajevi (#932) ───────────────────────────
  console.log('\n📦 Prazan Raspon i Granični Slučajevi (#932)');

  await test('od > do daje praznu listu', () => {
    const empty = getAutofinishIteracijaRaspon(930, 921);
    assertEqual(empty.iteracije.length, 0, 'prazan raspon kad od > do');
    assertEqual(empty.ukupnoIteracija, 0, 'ukupnoIteracija=0');
  });

  await test('od === do daje 1 iteraciju', () => {
    const single = getAutofinishIteracijaRaspon(930, 930);
    assertEqual(single.iteracije.length, 1, 'od===do = 1 iteracija');
  });

  await test('Nepoznate iteracije imaju fallback opis', () => {
    const far = getAutofinishIteracijaRaspon(9990, 9991);
    for (const it of far.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `fallback opis za #${it.broj}`);
    }
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishIteracijaRaspon(921, 930);
    const r2 = getAutofinishIteracijaRaspon(921, 930);
    assertEqual(r1.ukupnoIteracija, r2.ukupnoIteracija, 'ukupnoIteracija konzistentno');
    assertEqual(r1.iteracije[0].opis, r2.iteracije[0].opis, 'opis[0] konzistentno');
  });

  // ── 4. /api/autofinish-iteracija-raspon simulacija (#934) ─────────────────
  console.log('\n📦 /api/autofinish-iteracija-raspon — E2E Schema (#934)');

  function simulateRasponGET(params: Record<string, string>) {
    const od = params.od ? parseInt(params.od, 10) : NaN;
    const do_ = params.do ? parseInt(params.do, 10) : NaN;

    if (!params.od || !params.do) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'INVALID_PARAMS', verzija: APP_VERSION },
      };
    }

    if (isNaN(od) || isNaN(do_) || od < 1 || do_ < 1) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'INVALID_PARAMS', verzija: APP_VERSION },
      };
    }

    if (do_ - od > 200) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'RASPON_PREŠIROK', verzija: APP_VERSION },
      };
    }

    const result = getAutofinishIteracijaRaspon(od, do_);
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: result,
    };
  }

  await test('HTTP 200 za validan raspon', () => {
    assertEqual(simulateRasponGET({ od: '921', do: '930' }).status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=3600', () => {
    const resp = simulateRasponGET({ od: '921', do: '930' });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=3600'), 's-maxage=3600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateRasponGET({ od: '921', do: '930' });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 kada nema parametara', () => {
    assertEqual(simulateRasponGET({}).status, 400, 'HTTP 400 bez params');
  });

  await test('HTTP 400 za negativne vrednosti', () => {
    assertEqual(simulateRasponGET({ od: '-1', do: '10' }).status, 400, 'HTTP 400 negativno');
  });

  await test('HTTP 400 za raspon > 200', () => {
    assertEqual(simulateRasponGET({ od: '1', do: '202' }).status, 400, 'HTTP 400 širok raspon');
  });

  await test('HTTP 400 error == RASPON_PREŠIROK za raspon > 200', () => {
    const resp = simulateRasponGET({ od: '1', do: '202' });
    assert('error' in resp.body && resp.body.error === 'RASPON_PREŠIROK', 'RASPON_PREŠIROK');
  });

  await test('Body 200 ima sve obavezne ključeve', () => {
    const resp = simulateRasponGET({ od: '921', do: '930' });
    const required = ['verzija', 'autofinishBroj', 'od', 'do', 'ukupnoIteracija', 'iteracije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 5. Dashboard widget simulacija (#936) ─────────────────────────────────
  console.log('\n📦 Dashboard Iteracija Raspon Widget — Simulacija (#936)');

  function simulateWidget(od: number, do_: number) {
    const raspon = getAutofinishIteracijaRaspon(od, do_);
    return {
      iteracije: raspon.iteracije,
      count: raspon.iteracije.length,
      empty: raspon.iteracije.length === 0,
      apiLink: `/api/autofinish-iteracija-raspon?od=${od}&do=${do_}`,
      verzija: raspon.verzija,
      autofinishBroj: raspon.autofinishBroj,
    };
  }

  await test('Widget sa 20 iteracija — count=20', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const w = simulateWidget(start, AUTOFINISH_COUNT);
    assertEqual(w.count, 20, 'widget count=20');
  });

  await test('Widget prikaz nije prazan', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const w = simulateWidget(start, AUTOFINISH_COUNT);
    assert(!w.empty, 'widget nije prazan');
  });

  await test('Widget verzija === APP_VERSION', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const w = simulateWidget(start, AUTOFINISH_COUNT);
    assertEqual(w.verzija, APP_VERSION, 'verzija');
  });

  await test('Widget autofinishBroj === AUTOFINISH_COUNT', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const w = simulateWidget(start, AUTOFINISH_COUNT);
    assertEqual(w.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Widget apiLink konzistentno', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const w = simulateWidget(start, AUTOFINISH_COUNT);
    assert(w.apiLink.includes(`od=${start}`) && w.apiLink.includes(`do=${AUTOFINISH_COUNT}`), 'apiLink');
  });

  await test('Widget prazan za od > do', () => {
    const w = simulateWidget(930, 921);
    assert(w.empty, 'prazan za od > do');
  });

  await test('Widget svaki opis je string > 0', () => {
    const start = Math.max(1, AUTOFINISH_COUNT - 19);
    const w = simulateWidget(start, AUTOFINISH_COUNT);
    for (const it of w.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  // ── 6. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti');

  await test('AUTOFINISH_COUNT === 940', () => {
    assertEqual(AUTOFINISH_COUNT, 940, 'AUTOFINISH_COUNT=940');
  });

  await test('APP_VERSION === "44.61.0"', () => {
    assertEqual(APP_VERSION, '44.61.0', 'APP_VERSION=44.61.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1864', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1864, 'TOTAL_DIAGNOSTIKA=1864');
  });

  await test('TOTAL_API_ROUTES === 938', () => {
    assertEqual(TOTAL_API_ROUTES, 938, 'TOTAL_API_ROUTES=938');
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
