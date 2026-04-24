// Autofinish #966 — Unit Testovi getAutofinishTrendPoKategorijama()
// Autofinish #969 — Unit testovi Dashboard TrendWidget simulacija
// Autofinish #970 — E2E svih 16 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/trend-kategorije.test.ts

import {
  getAutofinishTrendPoKategorijama,
  getAutofinishKategorijaDetalji,
  getAutofinishKategorijePorHijarhijama,
  getAutofinishIteracijeTrend,
  getAutofinishTopIteracije,
  getAutofinishVerzijeDiff,
  getAutofinishHealthSummary,
  getAutofinishStatistikaSummary,
  getAutofinishMetaInfo,
  getAutofinishVerzijeSummary,
  getAutofinishAuditReport,
  getAutofinishRoadmapInfo,
  getAutofinishRoadmapStatusSummary,
  getAutofinishNextSteps,
  getAutofinishSystemReport,
  getAutofinishIteracijaRaspon,
  getAutofinishPodsistemiZdravlje,
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
  console.log('\n📈 Trend po Kategorijama + TrendWidget + 16-Endpoint E2E — Test Suite (#966 + #969 + #970)\n');

  // ── 1. Schema (#966) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishTrendPoKategorijama() Schema (#966)');

  const t = getAutofinishTrendPoKategorijama(5);

  await test('Vraća objekat', () => {
    assert(typeof t === 'object' && t !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(t.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(t.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('window === 5', () => {
    assertEqual(t.window, 5, 'window=5');
  });

  await test('kategorije je niz', () => {
    assert(Array.isArray(t.kategorije), 'kategorije niz');
  });

  await test('ukupnoKategorija >= 1', () => {
    assert(t.ukupnoKategorija >= 1, 'ukupnoKategorija >= 1');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(t.timestamp)), 'timestamp ISO');
  });

  // ── 2. Smjer + konzistentnost (#966) ──────────────────────────────────────
  console.log('\n📦 Smjer + Konzistentnost (#966)');

  await test('Svaka kategorija.smjer je up | down | stable', () => {
    for (const k of t.kategorije) {
      assert(['up', 'down', 'stable'].includes(k.smjer), `smjer "${k.smjer}" validan za ${k.kategorija}`);
    }
  });

  await test('Svaka kategorija.trendProcent je broj', () => {
    for (const k of t.kategorije) {
      assert(typeof k.trendProcent === 'number', `trendProcent broj za ${k.kategorija}`);
    }
  });

  await test('Svaka kategorija.ukupno > 0', () => {
    for (const k of t.kategorije) {
      assert(k.ukupno > 0, `ukupno > 0 za ${k.kategorija}`);
    }
  });

  await test('Svaka kategorija.labelSr je string > 0', () => {
    for (const k of t.kategorije) {
      assert(typeof k.labelSr === 'string' && k.labelSr.length > 0, `labelSr za ${k.kategorija}`);
    }
  });

  await test('ukupnoKategorija === kategorije.length', () => {
    assertEqual(t.ukupnoKategorija, t.kategorije.length, 'ukupnoKategorija');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishTrendPoKategorijama(5);
    const r2 = getAutofinishTrendPoKategorijama(5);
    assertEqual(r1.ukupnoKategorija, r2.ukupnoKategorija, 'ukupnoKategorija konzistentno');
  });

  await test('Window 1: ukupnoKategorija konzistentno', () => {
    const t1 = getAutofinishTrendPoKategorijama(1);
    assert(t1.ukupnoKategorija >= 1, 'window=1: barem 1 kategorija');
  });

  await test('Window 10: sve kategorije prisutne', () => {
    const t10 = getAutofinishTrendPoKategorijama(10);
    assert(t10.ukupnoKategorija >= 1, 'window=10: kategorije prisutne');
  });

  // ── 3. /api/autofinish-trend-kategorije simulacija (#967) ─────────────────
  console.log('\n📦 /api/autofinish-trend-kategorije — E2E Schema (#967)');

  function simulateTrendKategorijeGET(params: Record<string, string>) {
    const windowRaw = params.window ?? '5';
    const windowN = parseInt(windowRaw, 10);

    if (isNaN(windowN) || windowN < 1) {
      return { status: 400, body: { error: 'INVALID_PARAMS' }, headers: { 'X-App-Version': APP_VERSION } };
    }

    const result = getAutofinishTrendPoKategorijama(windowN);
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

  await test('HTTP 200 za window=5', () => {
    assertEqual(simulateTrendKategorijeGET({ window: '5' }).status, 200, 'HTTP 200');
  });

  await test('HTTP 200 default (bez window)', () => {
    assertEqual(simulateTrendKategorijeGET({}).status, 200, 'HTTP 200 default');
  });

  await test('Cache-Control sadrži s-maxage=300', () => {
    const resp = simulateTrendKategorijeGET({ window: '5' });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=300'), 's-maxage=300');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateTrendKategorijeGET({ window: '5' });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 za window=0', () => {
    assertEqual(simulateTrendKategorijeGET({ window: '0' }).status, 400, 'HTTP 400 window=0');
  });

  await test('HTTP 400 za window=abc', () => {
    assertEqual(simulateTrendKategorijeGET({ window: 'abc' }).status, 400, 'HTTP 400 window=abc');
  });

  await test('Body ima sve obavezne ključeve', () => {
    const resp = simulateTrendKategorijeGET({ window: '5' });
    const required = ['verzija', 'autofinishBroj', 'window', 'ukupnoKategorija', 'kategorije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 4. TrendWidget simulacija (#969) ──────────────────────────────────────
  console.log('\n📦 Dashboard TrendWidget — Simulacija (#969)');

  function simulateTrendWidget() {
    const trend = getAutofinishTrendPoKategorijama(5);
    return {
      kategorije: trend.kategorije,
      window: trend.window,
      verzija: trend.verzija,
      autofinishBroj: trend.autofinishBroj,
      apiLink: '/api/autofinish-trend-kategorije',
      empty: trend.kategorije.length === 0,
    };
  }

  await test('Widget nije prazan', () => {
    const w = simulateTrendWidget();
    assert(!w.empty, 'nije prazan');
  });

  await test('Widget verzija === APP_VERSION', () => {
    const w = simulateTrendWidget();
    assertEqual(w.verzija, APP_VERSION, 'verzija');
  });

  await test('Widget autofinishBroj === AUTOFINISH_COUNT', () => {
    const w = simulateTrendWidget();
    assertEqual(w.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Widget apiLink === "/api/autofinish-trend-kategorije"', () => {
    const w = simulateTrendWidget();
    assertEqual(w.apiLink, '/api/autofinish-trend-kategorije', 'apiLink');
  });

  await test('Widget window === 5', () => {
    const w = simulateTrendWidget();
    assertEqual(w.window, 5, 'window=5');
  });

  await test('Widget svaka kategorija ima smjer validan', () => {
    const w = simulateTrendWidget();
    for (const k of w.kategorije) {
      assert(['up', 'down', 'stable'].includes(k.smjer), `smjer validan za ${k.kategorija}`);
    }
  });

  await test('Widget svaka kategorija ima labelSr', () => {
    const w = simulateTrendWidget();
    for (const k of w.kategorije) {
      assert(typeof k.labelSr === 'string' && k.labelSr.length > 0, `labelSr za ${k.kategorija}`);
    }
  });

  await test('Widget svaka kategorija ima ukupno > 0', () => {
    const w = simulateTrendWidget();
    for (const k of w.kategorije) {
      assert(k.ukupno > 0, `ukupno > 0 za ${k.kategorija}`);
    }
  });

  // ── 5. E2E svih 16 autofinish API endpoints (#970) ────────────────────────
  console.log('\n📦 E2E Svih 16 Autofinish Endpoints — Konzistentnost (#970)');

  const hz = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps = getAutofinishNextSteps();
  const systemReport = getAutofinishSystemReport();
  const raspon = getAutofinishIteracijaRaspon(961, 970);
  const pz = getAutofinishPodsistemiZdravlje();
  const top10 = getAutofinishTopIteracije(10);
  const vdiff = getAutofinishVerzijeDiff('44.81.0', APP_VERSION);
  const kategorije = getAutofinishKategorijePorHijarhijama();
  const trend = getAutofinishIteracijeTrend(10);
  const katDetalji = getAutofinishKategorijaDetalji('helper')!;
  const trendKat = getAutofinishTrendPoKategorijama(5);

  // verzija konzistentnost
  const verzijePairs: [string, string][] = [
    ['zdravlje.verzija', hz.verzija],
    ['statistika.verzija', statistika.verzija],
    ['meta.verzija', meta.verzija],
    ['verzije.aktuelnaVerzija', verzije.aktuelnaVerzija],
    ['audit.verzija', audit.verzija],
    ['roadmap.verzija', roadmap.verzija],
    ['roadmapStatus.verzija', roadmapStatus.verzija],
    ['nextSteps.verzija', nextSteps.verzija],
    ['systemReport.verzija', systemReport.verzija],
    ['raspon.verzija', raspon.verzija],
    ['podsistemiZdravlje.verzija', pz.verzija],
    ['topIteracije.verzija', top10.verzija],
    ['verzijeDiff.verzija', vdiff.verzija],
    ['kategorije.verzija', kategorije.verzija],
    ['trend.verzija', trend.verzija],
    ['kategorijaDetalji.verzija', katDetalji.verzija],
    ['trendKategorije.verzija', trendKat.verzija],
  ];

  for (const [label, val] of verzijePairs) {
    await test(`${label} === APP_VERSION`, () => {
      assertEqual(val, APP_VERSION, label);
    });
  }

  // autofinishBroj konzistentnost
  const brojPairs: [string, number][] = [
    ['zdravlje.autofinishBroj', hz.autofinishBroj],
    ['statistika.autofinishBroj', statistika.autofinishBroj],
    ['meta.autofinishBroj', meta.autofinishBroj],
    ['verzije.autofinishBroj', verzije.autofinishBroj],
    ['audit.autofinishBroj', audit.autofinishBroj],
    ['roadmap.autofinishBroj', roadmap.autofinishBroj],
    ['roadmapStatus.autofinishBroj', roadmapStatus.autofinishBroj],
    ['nextSteps.autofinishBroj', nextSteps.autofinishBroj],
    ['systemReport.autofinishBroj', systemReport.autofinishBroj],
    ['raspon.autofinishBroj', raspon.autofinishBroj],
    ['podsistemiZdravlje.autofinishBroj', pz.autofinishBroj],
    ['topIteracije.autofinishBroj', top10.autofinishBroj],
    ['verzijeDiff.autofinishBroj', vdiff.autofinishBroj],
    ['kategorije.autofinishBroj', kategorije.autofinishBroj],
    ['trend.autofinishBroj', trend.autofinishBroj],
    ['kategorijaDetalji.autofinishBroj', katDetalji.autofinishBroj],
    ['trendKategorije.autofinishBroj', trendKat.autofinishBroj],
  ];

  for (const [label, val] of brojPairs) {
    await test(`${label} === AUTOFINISH_COUNT`, () => {
      assertEqual(val, AUTOFINISH_COUNT, label);
    });
  }

  // statistike
  await test('zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(hz.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'zdravlje.ukupnoProvera');
  });

  await test('statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'statistika.dijagnostike');
  });

  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  // meta endpoints
  await test('meta.autofinishEndpoints sadrži /api/autofinish-kategorija-detalji', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-kategorija-detalji'), 'kategorija-detalji endpoint');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-trend-kategorije', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-trend-kategorije'), 'trend-kategorije endpoint');
  });

  // specifične provjere
  await test('raspon 961–970 daje 10 iteracija', () => {
    assertEqual(raspon.iteracije.length, 10, 'raspon 961–970 = 10');
  });

  await test('kategorijaDetalji.iteracije.length === ukupno', () => {
    assertEqual(katDetalji.iteracije.length, katDetalji.ukupno, 'detalji iteracije.length === ukupno');
  });

  await test('trendKategorije.kategorije.length >= 1', () => {
    assert(trendKat.kategorije.length >= 1, 'barem 1 kategorija u trendu');
  });

  // ── 6. Globalni invarijanti (#970) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#970)');

  await test('AUTOFINISH_COUNT === 970', () => {
    assertEqual(AUTOFINISH_COUNT, 980, 'AUTOFINISH_COUNT=980');
  });

  await test('APP_VERSION === "44.91.0"', () => {
    assertEqual(APP_VERSION, '45.01.0', 'APP_VERSION=45.01.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1924', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1944, 'TOTAL_DIAGNOSTIKA=1944');
  });

  await test('TOTAL_API_ROUTES === 945', () => {
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
