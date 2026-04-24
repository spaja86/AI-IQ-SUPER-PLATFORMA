// Autofinish #958 — Unit Testovi getAutofinishIteracijeTrend()
// Autofinish #960 — E2E svih 14 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/trend.test.ts

import {
  getAutofinishIteracijeTrend,
  getAutofinishKategorijePorHijarhijama,
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
  console.log('\n📈 Trend + Full 14-Endpoint E2E — Test Suite (#958 + #960)\n');

  // ── 1. Schema (#958) ──────────────────────────────────────────────────────
  console.log('📦 getAutofinishIteracijeTrend() Schema (#958)');

  const t10 = getAutofinishIteracijeTrend(10);

  await test('Vraća objekat', () => {
    assert(typeof t10 === 'object' && t10 !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(t10.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(t10.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('window === 10', () => {
    assertEqual(t10.window, 10, 'window=10');
  });

  await test('windowIteracije je niz', () => {
    assert(Array.isArray(t10.windowIteracije), 'windowIteracije niz');
  });

  await test('baselineIteracije je niz', () => {
    assert(Array.isArray(t10.baselineIteracije), 'baselineIteracije niz');
  });

  await test('ukupnoWindow === windowIteracije.length', () => {
    assertEqual(t10.ukupnoWindow, t10.windowIteracije.length, 'ukupnoWindow');
  });

  await test('ukupnoBaseline === baselineIteracije.length', () => {
    assertEqual(t10.ukupnoBaseline, t10.baselineIteracije.length, 'ukupnoBaseline');
  });

  await test('smjer je up | down | stable', () => {
    assert(['up', 'down', 'stable'].includes(t10.smjer), `smjer "${t10.smjer}" validan`);
  });

  await test('trendProcent je broj', () => {
    assert(typeof t10.trendProcent === 'number', 'trendProcent je broj');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(t10.timestamp)), 'timestamp ISO');
  });

  // ── 2. up/down/stable (#958) ──────────────────────────────────────────────
  console.log('\n📦 Trend smjer (#958)');

  await test('Window 10: ukupnoWindow === 10', () => {
    assertEqual(t10.ukupnoWindow, 10, 'ukupnoWindow=10');
  });

  await test('Konzistentnost window vs baseline dužina', () => {
    assertEqual(t10.ukupnoWindow, t10.ukupnoBaseline, 'window == baseline za dovoljno iteracija');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishIteracijeTrend(10);
    const r2 = getAutofinishIteracijeTrend(10);
    assertEqual(r1.ukupnoWindow, r2.ukupnoWindow, 'ukupnoWindow konzistentno');
    assertEqual(r1.smjer, r2.smjer, 'smjer konzistentno');
  });

  await test('Window 1: ukupnoWindow === 1', () => {
    const t1 = getAutofinishIteracijeTrend(1);
    assertEqual(t1.ukupnoWindow, 1, 'ukupnoWindow=1');
  });

  await test('Window 1: smjer je up | down | stable', () => {
    const t1 = getAutofinishIteracijeTrend(1);
    assert(['up', 'down', 'stable'].includes(t1.smjer), `smjer "${t1.smjer}" validan`);
  });

  await test('Window 20: ukupnoWindow === 20', () => {
    const t20 = getAutofinishIteracijeTrend(20);
    assertEqual(t20.ukupnoWindow, 20, 'ukupnoWindow=20');
  });

  await test('Window > AUTOFINISH_COUNT/2 clampuje na max', () => {
    const tBig = getAutofinishIteracijeTrend(99999);
    assert(tBig.window <= Math.floor(AUTOFINISH_COUNT / 2), 'window clampovan');
  });

  // ── 3. /api/autofinish-trend simulacija (#959) ─────────────────────────────
  console.log('\n📦 /api/autofinish-trend — E2E Schema (#959)');

  function simulateTrendGET(params: Record<string, string>) {
    const windowRaw = params.window ?? '10';
    const windowN = parseInt(windowRaw, 10);

    if (isNaN(windowN) || windowN < 1) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'INVALID_PARAMS', verzija: APP_VERSION },
      };
    }

    const result = getAutofinishIteracijeTrend(windowN);
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

  await test('HTTP 200 za window=10', () => {
    assertEqual(simulateTrendGET({ window: '10' }).status, 200, 'HTTP 200');
  });

  await test('HTTP 200 bez params (default window=10)', () => {
    assertEqual(simulateTrendGET({}).status, 200, 'HTTP 200 default');
  });

  await test('Cache-Control sadrži s-maxage=300', () => {
    const resp = simulateTrendGET({ window: '10' });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=300'), 's-maxage=300');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateTrendGET({ window: '10' });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 za window=0', () => {
    assertEqual(simulateTrendGET({ window: '0' }).status, 400, 'HTTP 400 window=0');
  });

  await test('HTTP 400 za window=-1', () => {
    assertEqual(simulateTrendGET({ window: '-1' }).status, 400, 'HTTP 400 window=-1');
  });

  await test('HTTP 400 za window=abc', () => {
    assertEqual(simulateTrendGET({ window: 'abc' }).status, 400, 'HTTP 400 window=abc');
  });

  await test('Body ima sve obavezne ključeve', () => {
    const resp = simulateTrendGET({ window: '10' });
    const required = ['verzija', 'autofinishBroj', 'window', 'ukupnoWindow', 'ukupnoBaseline', 'trendProcent', 'smjer', 'windowIteracije', 'baselineIteracije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  await test('Body smjer je up | down | stable', () => {
    const resp = simulateTrendGET({ window: '10' });
    assert(['up', 'down', 'stable'].includes(resp.body.smjer), `smjer validan`);
  });

  // ── 4. E2E svih 14 autofinish API endpoints (#960) ────────────────────────
  console.log('\n📦 E2E Svih 14 Autofinish Endpoints — Konzistentnost (#960)');

  const hz = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps = getAutofinishNextSteps();
  const systemReport = getAutofinishSystemReport();
  const raspon = getAutofinishIteracijaRaspon(951, 960);
  const pz = getAutofinishPodsistemiZdravlje();
  const top10 = getAutofinishTopIteracije(10);
  const vdiff = getAutofinishVerzijeDiff('44.71.0', APP_VERSION);
  const kategorije = getAutofinishKategorijePorHijarhijama();
  const trend = getAutofinishIteracijeTrend(10);

  // Verzija konzistentnost
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
  ];

  for (const [label, val] of brojPairs) {
    await test(`${label} === AUTOFINISH_COUNT`, () => {
      assertEqual(val, AUTOFINISH_COUNT, label);
    });
  }

  // Dijagnostike
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
  await test('meta.autofinishEndpoints sadrži /api/autofinish-kategorije', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-kategorije'), 'kategorije endpoint');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-trend', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-trend'), 'trend endpoint');
  });

  // specifični provjere
  await test('raspon 951–960 daje 10 iteracija', () => {
    assertEqual(raspon.iteracije.length, 10, 'raspon 951–960 = 10');
  });

  await test('kategorije.ukupnoIteracija === AUTOFINISH_COUNT', () => {
    assertEqual(kategorije.ukupnoIteracija, AUTOFINISH_COUNT, 'kategorije.ukupnoIteracija');
  });

  await test('trend.window === 10', () => {
    assertEqual(trend.window, 10, 'trend.window=10');
  });

  await test('trend.smjer je validan', () => {
    assert(['up', 'down', 'stable'].includes(trend.smjer), 'smjer validan');
  });

  // ── 5. Globalni invarijanti (#960) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#960)');

  await test('AUTOFINISH_COUNT === 960', () => {
    assertEqual(AUTOFINISH_COUNT, 960, 'AUTOFINISH_COUNT=960');
  });

  await test('APP_VERSION === "44.81.0"', () => {
    assertEqual(APP_VERSION, '44.81.0', 'APP_VERSION=44.81.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1904', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1904, 'TOTAL_DIAGNOSTIKA=1904');
  });

  await test('TOTAL_API_ROUTES === 942', () => {
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
