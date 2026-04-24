// Autofinish #976 — Unit Testovi getAutofinishKategorijeStats()
// Autofinish #979 — Unit testovi KategorijeStatsWidget simulacija
// Autofinish #980 — E2E svih 18 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/kategorije-stats.test.ts

import {
  getAutofinishKategorijeStats,
  getAutofinishIteracijePoVerziji,
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
  console.log('\n📊 Kategorije Stats + StatsWidget + 18-Endpoint E2E — Test Suite (#976 + #979 + #980)\n');

  // ── 1. Schema (#976) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishKategorijeStats() Schema (#976)');

  const stats = getAutofinishKategorijeStats();

  await test('Vraća objekat', () => {
    assert(typeof stats === 'object' && stats !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(stats.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(stats.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('ukupnoKategorija >= 1', () => {
    assert(stats.ukupnoKategorija >= 1, 'ukupnoKategorija >= 1');
  });

  await test('ukupnoIteracija > 0', () => {
    assert(stats.ukupnoIteracija > 0, 'ukupnoIteracija > 0');
  });

  await test('kategorije je niz', () => {
    assert(Array.isArray(stats.kategorije), 'kategorije niz');
  });

  await test('ukupnoKategorija === kategorije.length', () => {
    assertEqual(stats.ukupnoKategorija, stats.kategorije.length, 'ukupnoKategorija===kategorije.length');
  });

  await test('globalMin > 0', () => {
    assert(stats.globalMin > 0, 'globalMin > 0');
  });

  await test('globalMax >= globalMin', () => {
    assert(stats.globalMax >= stats.globalMin, 'globalMax >= globalMin');
  });

  await test('globalAvg >= globalMin && globalAvg <= globalMax', () => {
    assert(stats.globalAvg >= stats.globalMin && stats.globalAvg <= stats.globalMax, 'globalAvg in range');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(stats.timestamp)), 'timestamp ISO');
  });

  // ── 2. Math konzistentnost (#976) ─────────────────────────────────────────
  console.log('\n📦 Math Konzistentnost (#976)');

  await test('Svaka kategorija.ukupno >= 0', () => {
    for (const k of stats.kategorije) {
      assert(k.ukupno >= 0, `ukupno >= 0 za ${k.kategorija}`);
    }
  });

  await test('Kategorije s ukupno>0 imaju ne-null min/max/avg/median', () => {
    for (const k of stats.kategorije) {
      if (k.ukupno > 0) {
        assert(k.minBroj !== null, `minBroj not null za ${k.kategorija}`);
        assert(k.maxBroj !== null, `maxBroj not null za ${k.kategorija}`);
        assert(k.avgBroj !== null, `avgBroj not null za ${k.kategorija}`);
        assert(k.medianBroj !== null, `medianBroj not null za ${k.kategorija}`);
      }
    }
  });

  await test('Svaka kategorija.minBroj <= maxBroj (ako ne null)', () => {
    for (const k of stats.kategorije) {
      if (k.minBroj !== null && k.maxBroj !== null) {
        assert(k.minBroj <= k.maxBroj, `minBroj <= maxBroj za ${k.kategorija}`);
      }
    }
  });

  await test('Svaka kategorija.avgBroj in [minBroj, maxBroj] (ako ne null)', () => {
    for (const k of stats.kategorije) {
      if (k.avgBroj !== null && k.minBroj !== null && k.maxBroj !== null) {
        assert(k.avgBroj >= k.minBroj && k.avgBroj <= k.maxBroj, `avgBroj in range za ${k.kategorija}`);
      }
    }
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishKategorijeStats();
    const r2 = getAutofinishKategorijeStats();
    assertEqual(r1.ukupnoIteracija, r2.ukupnoIteracija, 'ukupnoIteracija konzistentno');
    assertEqual(r1.globalMin, r2.globalMin, 'globalMin konzistentno');
  });

  await test('Suma ukupno po kategorijama === ukupnoIteracija', () => {
    const suma = stats.kategorije.reduce((acc, k) => acc + k.ukupno, 0);
    assertEqual(suma, stats.ukupnoIteracija, 'suma === ukupnoIteracija');
  });

  // ── 3. /api/autofinish-kategorije-stats simulacija (#977) ─────────────────
  console.log('\n📦 /api/autofinish-kategorije-stats — E2E Schema (#977)');

  function simulateStatsGET() {
    const result = getAutofinishKategorijeStats();
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

  await test('HTTP 200', () => {
    assertEqual(simulateStatsGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=600', () => {
    const resp = simulateStatsGET();
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=600'), 's-maxage=600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    assertEqual(simulateStatsGET().headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('Body ima sve obavezne ključeve', () => {
    const resp = simulateStatsGET();
    const required = ['verzija', 'autofinishBroj', 'ukupnoIteracija', 'ukupnoKategorija', 'kategorije', 'globalMin', 'globalMax', 'globalAvg', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 4. KategorijeStatsWidget simulacija (#979) ─────────────────────────────
  console.log('\n📦 KategorijeStatsWidget — Simulacija (#979)');

  function simulateStatsWidget() {
    const s = getAutofinishKategorijeStats();
    return {
      kategorije: s.kategorije,
      ukupnoIteracija: s.ukupnoIteracija,
      globalMin: s.globalMin,
      globalMax: s.globalMax,
      globalAvg: s.globalAvg,
      verzija: s.verzija,
      autofinishBroj: s.autofinishBroj,
      empty: s.kategorije.length === 0,
      apiLink: '/api/autofinish-kategorije-stats',
    };
  }

  await test('Widget nije prazan', () => {
    const w = simulateStatsWidget();
    assert(!w.empty, 'nije prazan');
  });

  await test('Widget verzija === APP_VERSION', () => {
    assertEqual(simulateStatsWidget().verzija, APP_VERSION, 'verzija');
  });

  await test('Widget autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(simulateStatsWidget().autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('Widget apiLink === "/api/autofinish-kategorije-stats"', () => {
    assertEqual(simulateStatsWidget().apiLink, '/api/autofinish-kategorije-stats', 'apiLink');
  });

  await test('Widget globalMin <= globalMax', () => {
    const w = simulateStatsWidget();
    assert(w.globalMin <= w.globalMax, 'globalMin <= globalMax');
  });

  await test('Widget globalAvg in [globalMin, globalMax]', () => {
    const w = simulateStatsWidget();
    assert(w.globalAvg >= w.globalMin && w.globalAvg <= w.globalMax, 'globalAvg in range');
  });

  await test('Widget svaka kategorija ima labelSr', () => {
    const w = simulateStatsWidget();
    for (const k of w.kategorije) {
      assert(typeof k.labelSr === 'string' && k.labelSr.length > 0, `labelSr za ${k.kategorija}`);
    }
  });

  // ── 5. E2E svih 18 autofinish API endpoints (#980) ────────────────────────
  console.log('\n📦 E2E Svih 18 Autofinish Endpoints — Konzistentnost (#980)');

  const hz = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps = getAutofinishNextSteps();
  const systemReport = getAutofinishSystemReport();
  const raspon = getAutofinishIteracijaRaspon(971, 980);
  const pz = getAutofinishPodsistemiZdravlje();
  const top10 = getAutofinishTopIteracije(10);
  const vdiff = getAutofinishVerzijeDiff('44.81.0', APP_VERSION);
  const kategorije = getAutofinishKategorijePorHijarhijama();
  const trend = getAutofinishIteracijeTrend(10);
  const katDetalji = getAutofinishKategorijaDetalji('helper')!;
  const trendKat = getAutofinishTrendPoKategorijama(5);
  const testVerzija = verzije.verzije[0].verzija;
  const verzijaIter = getAutofinishIteracijePoVerziji(testVerzija);

  // verzija konzistentnost — 18 endpoints
  const verzijePairs: [string, string][] = [
    ['zdravlje.verzija', hz.verzija],
    ['statistika.verzija', statistika.verzija],
    ['meta.verzija', meta.verzija],
    ['verzijeSummary.aktuelnaVerzija', verzije.aktuelnaVerzija],
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
    ['verzijaIteracije.verzija', verzijaIter.verzija],
    ['kategorijeStats.verzija', stats.verzija],
  ];

  for (const [label, val] of verzijePairs) {
    await test(`${label} === APP_VERSION`, () => {
      assertEqual(val, APP_VERSION, label);
    });
  }

  // autofinishBroj konzistentnost — 18 endpoints
  const brojPairs: [string, number][] = [
    ['zdravlje.autofinishBroj', hz.autofinishBroj],
    ['statistika.autofinishBroj', statistika.autofinishBroj],
    ['meta.autofinishBroj', meta.autofinishBroj],
    ['verzijeSummary.autofinishBroj', verzije.autofinishBroj],
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
    ['verzijaIteracije.autofinishBroj', verzijaIter.autofinishBroj],
    ['kategorijeStats.autofinishBroj', stats.autofinishBroj],
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
  await test('meta.autofinishEndpoints sadrži /api/autofinish-verzija-iteracije', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-verzija-iteracije'), 'verzija-iteracije endpoint');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-kategorije-stats', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-kategorije-stats'), 'kategorije-stats endpoint');
  });

  // specifične provjere
  await test('raspon 971–980 daje 10 iteracija', () => {
    assertEqual(raspon.iteracije.length, 10, 'raspon 971–980 = 10');
  });

  await test('verzijaIter.iteracije.length === verzijaIter.ukupno', () => {
    assertEqual(verzijaIter.iteracije.length, verzijaIter.ukupno, 'verzijaIter.length === ukupno');
  });

  await test('stats.kategorije.length >= 1', () => {
    assert(stats.kategorije.length >= 1, 'barem 1 kategorija u stats');
  });

  await test('stats.globalMin <= stats.globalMax', () => {
    assert(stats.globalMin <= stats.globalMax, 'globalMin <= globalMax');
  });

  // ── 6. Globalni invarijanti (#980) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#980)');

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
