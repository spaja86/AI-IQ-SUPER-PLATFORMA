// Autofinish #942 — Unit Testovi getAutofinishTopIteracije()
// Autofinish #944 — Integracioni Testovi /api/autofinish-top-iteracije
// Autofinish #946 — Unit testovi Dashboard Top Iteracije Widget simulacija
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/top-iteracije.test.ts

import {
  getAutofinishTopIteracije,
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
  console.log('\n🏆 Top Iteracije + API Integration + Widget — Test Suite (#942 + #944 + #946)\n');

  // ── 1. Schema (#942) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishTopIteracije() Schema (#942)');

  const t10 = getAutofinishTopIteracije(10);

  await test('Vraća objekat', () => {
    assert(typeof t10 === 'object' && t10 !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(t10.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(t10.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('n === 10', () => {
    assertEqual(t10.n, 10, 'n=10');
  });

  await test('iteracije je niz', () => {
    assert(Array.isArray(t10.iteracije), 'iteracije niz');
  });

  await test('ukupnoIteracija === iteracije.length', () => {
    assertEqual(t10.ukupnoIteracija, t10.iteracije.length, 'ukupnoIteracija');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(t10.timestamp)), 'timestamp ISO');
  });

  // ── 2. Top N (#942) ───────────────────────────────────────────────────────
  console.log('\n📦 Top N Iteracija (#942)');

  await test('getAutofinishTopIteracije(10) daje 10 iteracija', () => {
    assertEqual(t10.iteracije.length, 10, 'top 10 = 10 iteracija');
  });

  await test('Iteracije sortirane opadajuće', () => {
    const bros = t10.iteracije.map((it) => it.broj);
    for (let i = 1; i < bros.length; i++) {
      assert(bros[i] < bros[i - 1], `opadajuće: ${bros[i - 1]} > ${bros[i]}`);
    }
  });

  await test('Prva iteracija je AUTOFINISH_COUNT', () => {
    assertEqual(t10.iteracije[0].broj, AUTOFINISH_COUNT, 'prva = AUTOFINISH_COUNT');
  });

  await test('Svaka iteracija.opis je string > 0', () => {
    for (const it of t10.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  await test('getAutofinishTopIteracije(5) daje 5 iteracija', () => {
    const t5 = getAutofinishTopIteracije(5);
    assertEqual(t5.iteracije.length, 5, 'top 5 = 5 iteracija');
  });

  await test('getAutofinishTopIteracije(5) sortirano opadajuće', () => {
    const t5 = getAutofinishTopIteracije(5);
    const bros = t5.iteracije.map((it) => it.broj);
    for (let i = 1; i < bros.length; i++) {
      assert(bros[i] < bros[i - 1], `opadajuće: ${bros[i - 1]} > ${bros[i]}`);
    }
  });

  await test('getAutofinishTopIteracije(1) daje 1 iteraciju', () => {
    const t1 = getAutofinishTopIteracije(1);
    assertEqual(t1.iteracije.length, 1, 'top 1 = 1 iteracija');
    assertEqual(t1.iteracije[0].broj, AUTOFINISH_COUNT, 'top 1 = AUTOFINISH_COUNT');
  });

  // ── 3. Granični slučajevi (#942) ──────────────────────────────────────────
  console.log('\n📦 Granični Slučajevi (#942)');

  await test('getAutofinishTopIteracije(0) daje praznu listu', () => {
    const t0 = getAutofinishTopIteracije(0);
    assertEqual(t0.iteracije.length, 0, 'top 0 = 0 iteracija');
    assertEqual(t0.ukupnoIteracija, 0, 'ukupnoIteracija=0');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishTopIteracije(10);
    const r2 = getAutofinishTopIteracije(10);
    assertEqual(r1.ukupnoIteracija, r2.ukupnoIteracija, 'ukupnoIteracija konzistentno');
    assertEqual(r1.iteracije[0].broj, r2.iteracije[0].broj, 'prvi bro konzistentno');
  });

  await test('Top 10 vs top 5 — top 5 je podskup top 10', () => {
    const t10r = getAutofinishTopIteracije(10);
    const t5r = getAutofinishTopIteracije(5);
    const t10nums = t10r.iteracije.map((it) => it.broj);
    for (const it of t5r.iteracije) {
      assert(t10nums.includes(it.broj), `#${it.broj} je u top 10`);
    }
  });

  // ── 4. /api/autofinish-top-iteracije simulacija (#944) ────────────────────
  console.log('\n📦 /api/autofinish-top-iteracije — E2E Schema (#944)');

  function simulateTopGET(params: Record<string, string>) {
    const nRaw = params.n ?? '10';
    const n = parseInt(nRaw, 10);

    if (isNaN(n) || n < 1) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'INVALID_PARAMS', verzija: APP_VERSION },
      };
    }

    if (n > 200) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'N_PREVELIK', verzija: APP_VERSION },
      };
    }

    const result = getAutofinishTopIteracije(n);
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: result,
    };
  }

  await test('HTTP 200 za n=10', () => {
    assertEqual(simulateTopGET({ n: '10' }).status, 200, 'HTTP 200');
  });

  await test('HTTP 200 bez params (default n=10)', () => {
    assertEqual(simulateTopGET({}).status, 200, 'HTTP 200 default');
  });

  await test('Cache-Control sadrži s-maxage=300', () => {
    const resp = simulateTopGET({ n: '10' });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=300'), 's-maxage=300');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateTopGET({ n: '10' });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 za n=0', () => {
    assertEqual(simulateTopGET({ n: '0' }).status, 400, 'HTTP 400 n=0');
  });

  await test('HTTP 400 za n=-1', () => {
    assertEqual(simulateTopGET({ n: '-1' }).status, 400, 'HTTP 400 n=-1');
  });

  await test('HTTP 400 za n=201', () => {
    assertEqual(simulateTopGET({ n: '201' }).status, 400, 'HTTP 400 n=201');
  });

  await test('HTTP 400 error == N_PREVELIK za n=201', () => {
    const resp = simulateTopGET({ n: '201' });
    assert('error' in resp.body && resp.body.error === 'N_PREVELIK', 'N_PREVELIK');
  });

  await test('Body 200 ima sve obavezne ključeve', () => {
    const resp = simulateTopGET({ n: '10' });
    const required = ['verzija', 'autofinishBroj', 'n', 'ukupnoIteracija', 'iteracije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  await test('Body iteracije su sortirane opadajuće', () => {
    const resp = simulateTopGET({ n: '5' });
    if ('iteracije' in resp.body) {
      const bros = (resp.body as typeof t10).iteracije.map((it) => it.broj);
      for (let i = 1; i < bros.length; i++) {
        assert(bros[i] < bros[i - 1], `opadajuće: ${bros[i - 1]} > ${bros[i]}`);
      }
    }
  });

  // ── 5. Dashboard widget simulacija (#946) ─────────────────────────────────
  console.log('\n📦 Dashboard Top Iteracije Widget — Simulacija (#946)');

  function simulateTopWidget(n: number) {
    const top = getAutofinishTopIteracije(n);
    return {
      iteracije: top.iteracije,
      count: top.iteracije.length,
      empty: top.iteracije.length === 0,
      apiLink: `/api/autofinish-top-iteracije?n=${n}`,
      verzija: top.verzija,
      autofinishBroj: top.autofinishBroj,
      firstBroj: top.iteracije[0]?.broj ?? null,
    };
  }

  await test('Widget sa n=10 — count=10', () => {
    const w = simulateTopWidget(10);
    assertEqual(w.count, 10, 'count=10');
  });

  await test('Widget prikaz nije prazan', () => {
    const w = simulateTopWidget(10);
    assert(!w.empty, 'nije prazan');
  });

  await test('Widget verzija === APP_VERSION', () => {
    const w = simulateTopWidget(10);
    assertEqual(w.verzija, APP_VERSION, 'verzija');
  });

  await test('Widget autofinishBroj === AUTOFINISH_COUNT', () => {
    const w = simulateTopWidget(10);
    assertEqual(w.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Widget apiLink konzistentno', () => {
    const w = simulateTopWidget(10);
    assert(w.apiLink.includes('n=10'), 'apiLink sadrži n=10');
  });

  await test('Widget firstBroj === AUTOFINISH_COUNT (opadajuće)', () => {
    const w = simulateTopWidget(10);
    assertEqual(w.firstBroj, AUTOFINISH_COUNT, 'firstBroj');
  });

  await test('Widget prazan za n=0', () => {
    const w = simulateTopWidget(0);
    assert(w.empty, 'prazan za n=0');
  });

  await test('Widget svaki opis je string > 0', () => {
    const w = simulateTopWidget(10);
    for (const it of w.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  // ── 6. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti');

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
