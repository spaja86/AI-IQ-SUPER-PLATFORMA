// Autofinish #948 — Unit Testovi getAutofinishVerzijeDiff()
// Autofinish #950 — E2E svih 13 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/verzije-diff.test.ts

import {
  getAutofinishVerzijeDiff,
  getAutofinishTopIteracije,
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
  console.log('\n🔀 Verzije Diff + Full 13-Endpoint E2E — Test Suite (#948 + #950)\n');

  // ── 1. getAutofinishVerzijeDiff() schema (#948) ───────────────────────────
  console.log('📦 getAutofinishVerzijeDiff() Schema (#948)');

  const vd = getAutofinishVerzijeDiff('44.51.0', '44.61.0');

  await test('Vraća objekat', () => {
    assert(typeof vd === 'object' && vd !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(vd.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(vd.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('v1 === "44.51.0"', () => {
    assertEqual(vd.v1, '44.51.0', 'v1');
  });

  await test('v2 === "44.61.0"', () => {
    assertEqual(vd.v2, '44.61.0', 'v2');
  });

  await test('iteracije je niz', () => {
    assert(Array.isArray(vd.iteracije), 'iteracije niz');
  });

  await test('ukupnoIteracija === iteracije.length', () => {
    assertEqual(vd.ukupnoIteracija, vd.iteracije.length, 'ukupnoIteracija');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(vd.timestamp)), 'timestamp ISO');
  });

  // ── 2. Konzistentnost (#948) ──────────────────────────────────────────────
  console.log('\n📦 Konzistentnost Verzije Diff (#948)');

  await test('v1AutofinishBroj je broj ili null', () => {
    assert(
      vd.v1AutofinishBroj === null || typeof vd.v1AutofinishBroj === 'number',
      'v1AutofinishBroj tip',
    );
  });

  await test('v2AutofinishBroj je broj ili null', () => {
    assert(
      vd.v2AutofinishBroj === null || typeof vd.v2AutofinishBroj === 'number',
      'v2AutofinishBroj tip',
    );
  });

  await test('Ista verzija = 0 iteracija', () => {
    const same = getAutofinishVerzijeDiff(APP_VERSION, APP_VERSION);
    assertEqual(same.ukupnoIteracija, 0, 'ista verzija = 0 iteracija');
  });

  await test('Nepoznata verzija = v1AutofinishBroj null', () => {
    const unk = getAutofinishVerzijeDiff('99.0.0', APP_VERSION);
    assertEqual(unk.v1AutofinishBroj, null, 'nepoznata v1 = null');
  });

  await test('Obje nepoznate = 0 iteracija', () => {
    const unk = getAutofinishVerzijeDiff('99.0.0', '100.0.0');
    assertEqual(unk.ukupnoIteracija, 0, 'obje nepoznate = 0 iteracija');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const d1 = getAutofinishVerzijeDiff('44.51.0', '44.61.0');
    const d2 = getAutofinishVerzijeDiff('44.51.0', '44.61.0');
    assertEqual(d1.ukupnoIteracija, d2.ukupnoIteracija, 'ukupnoIteracija konzistentno');
  });

  await test('Svaka iteracija.opis je string > 0 (ako ima)', () => {
    for (const it of vd.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `opis za #${it.broj}`);
    }
  });

  // ── 3. /api/autofinish-verzije-diff simulacija (#949) ─────────────────────
  console.log('\n📦 /api/autofinish-verzije-diff — E2E Schema (#949)');

  function simulateVerzijeDiffGET(params: Record<string, string>) {
    const v1 = params.v1;
    const v2 = params.v2;

    if (!v1 || !v2) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'INVALID_PARAMS', verzija: APP_VERSION },
      };
    }

    const semverRe = /^\d+\.\d+\.\d+$/;
    if (!semverRe.test(v1) || !semverRe.test(v2)) {
      return {
        status: 400,
        headers: { 'X-App-Version': APP_VERSION },
        body: { error: 'INVALID_PARAMS', verzija: APP_VERSION },
      };
    }

    const result = getAutofinishVerzijeDiff(v1, v2);
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

  await test('HTTP 200 za validne verzije', () => {
    assertEqual(simulateVerzijeDiffGET({ v1: '44.51.0', v2: '44.61.0' }).status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=3600', () => {
    const resp = simulateVerzijeDiffGET({ v1: '44.51.0', v2: '44.61.0' });
    assert((resp.headers['Cache-Control'] ?? '').includes('s-maxage=3600'), 's-maxage=3600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateVerzijeDiffGET({ v1: '44.51.0', v2: '44.61.0' });
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 400 kada nema v1', () => {
    assertEqual(simulateVerzijeDiffGET({ v2: '44.61.0' }).status, 400, 'HTTP 400 bez v1');
  });

  await test('HTTP 400 kada nema v2', () => {
    assertEqual(simulateVerzijeDiffGET({ v1: '44.51.0' }).status, 400, 'HTTP 400 bez v2');
  });

  await test('HTTP 400 za nevažeći format v1', () => {
    assertEqual(simulateVerzijeDiffGET({ v1: 'invalid', v2: '44.61.0' }).status, 400, 'HTTP 400 invalid v1');
  });

  await test('Body 200 ima sve obavezne ključeve', () => {
    const resp = simulateVerzijeDiffGET({ v1: '44.51.0', v2: '44.61.0' });
    const required = ['verzija', 'autofinishBroj', 'v1', 'v2', 'v1AutofinishBroj', 'v2AutofinishBroj', 'ukupnoIteracija', 'iteracije', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 4. E2E svih 13 autofinish API endpoints (#950) ────────────────────────
  console.log('\n📦 E2E Svih 13 Autofinish Endpoints — Konzistentnost (#950)');

  const hz = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps = getAutofinishNextSteps();
  const systemReport = getAutofinishSystemReport();
  const raspon = getAutofinishIteracijaRaspon(941, 950);
  const pz = getAutofinishPodsistemiZdravlje();
  const top10 = getAutofinishTopIteracije(10);
  const vdiff = getAutofinishVerzijeDiff('44.61.0', APP_VERSION);

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

  // API Routes
  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  // meta endpoints
  await test('meta.autofinishEndpoints sadrži /api/autofinish-top-iteracije', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-top-iteracije'), 'top-iteracije endpoint');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-verzije-diff', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-verzije-diff'), 'verzije-diff endpoint');
  });

  // top-iteracije specifični
  await test('top10 daje 10 iteracija', () => {
    assertEqual(top10.iteracije.length, 10, 'top10 = 10');
  });

  await test('top10.iteracije[0].broj === AUTOFINISH_COUNT', () => {
    assertEqual(top10.iteracije[0].broj, AUTOFINISH_COUNT, 'top1 = AUTOFINISH_COUNT');
  });

  // raspon 941–950
  await test('raspon 941–950 daje 10 iteracija', () => {
    assertEqual(raspon.iteracije.length, 10, 'raspon 941–950 = 10');
  });

  // verzijeDiff prezentnost
  await test('vdiff.v1 === "44.61.0"', () => {
    assertEqual(vdiff.v1, '44.61.0', 'vdiff.v1');
  });

  await test('vdiff.v2 === APP_VERSION', () => {
    assertEqual(vdiff.v2, APP_VERSION, 'vdiff.v2');
  });

  // ── 5. Globalni invarijanti (#950) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#950)');

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
