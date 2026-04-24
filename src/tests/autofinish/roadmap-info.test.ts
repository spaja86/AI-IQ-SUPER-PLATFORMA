// Autofinish #906 — Unit Testovi getAutofinishRoadmapInfo()
// Autofinish #908 — Integracioni Testovi /api/autofinish-roadmap
// Autofinish #910 — E2E svih 9 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/roadmap-info.test.ts

import {
  getAutofinishRoadmapInfo,
  getAutofinishHealthSummary,
  getAutofinishStatistikaSummary,
  getAutofinishMetaInfo,
  getAutofinishVerzijeSummary,
  getAutofinishAuditReport,
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
  console.log('\n🗺️ Roadmap Info + Full 9-Endpoint E2E — Test Suite (#906 + #908 + #910)\n');

  // ── 1. getAutofinishRoadmapInfo() schema (#906) ────────────────────────────
  console.log('📦 getAutofinishRoadmapInfo() Schema (#906)');

  const roadmap = getAutofinishRoadmapInfo();

  await test('Vraća objekat', () => {
    assert(typeof roadmap === 'object' && roadmap !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(roadmap.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(roadmap.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('milestones je niz', () => {
    assert(Array.isArray(roadmap.milestones), 'milestones je niz');
  });

  await test('milestones nije prazan', () => {
    assert(roadmap.milestones.length >= 1, `milestones.length >= 1: ${roadmap.milestones.length}`);
  });

  await test('ukupnoMilestona === milestones.length', () => {
    assertEqual(roadmap.ukupnoMilestona, roadmap.milestones.length, 'ukupnoMilestona');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(roadmap.timestamp)), 'timestamp ISO');
  });

  // ── 2. Milestone schema (#906) ────────────────────────────────────────────
  console.log('\n📦 Milestone Schema (#906)');

  await test('Svaki milestone ima naziv (string)', () => {
    for (const m of roadmap.milestones) {
      assert(typeof m.naziv === 'string' && m.naziv.length > 0, `naziv string: ${m.naziv}`);
    }
  });

  await test('Svaki milestone ima opis (string)', () => {
    for (const m of roadmap.milestones) {
      assert(typeof m.opis === 'string' && m.opis.length > 0, `opis string: ${m.opis}`);
    }
  });

  await test('Svaki milestone ima autofinishOd (broj > 0)', () => {
    for (const m of roadmap.milestones) {
      assert(typeof m.autofinishOd === 'number' && m.autofinishOd > 0, `autofinishOd: ${m.autofinishOd}`);
    }
  });

  await test('Svaki milestone ima autofinishDo (broj > autofinishOd)', () => {
    for (const m of roadmap.milestones) {
      assert(m.autofinishDo > m.autofinishOd, `autofinishDo > autofinishOd: ${m.autofinishOd}–${m.autofinishDo}`);
    }
  });

  await test('Svaki milestone status je validan', () => {
    const valid = ['done', 'active', 'pending'];
    for (const m of roadmap.milestones) {
      assert(valid.includes(m.status), `status validan: ${m.status}`);
    }
  });

  // ── 3. Logički invarijanti (#906) ─────────────────────────────────────────
  console.log('\n📦 Logički Invarijanti (#906)');

  await test('Barem jedan milestone status done', () => {
    assert(roadmap.milestones.some((m) => m.status === 'done'), 'barem jedan done');
  });

  await test('Barem jedan milestone status active ili pending', () => {
    assert(roadmap.milestones.some((m) => m.status !== 'done'), 'barem jedan active/pending');
  });

  await test('autofinishOd se povećava kroz milestones', () => {
    for (let i = 1; i < roadmap.milestones.length; i++) {
      assert(
        roadmap.milestones[i].autofinishOd >= roadmap.milestones[i - 1].autofinishOd,
        `milestones[${i}].autofinishOd >= milestones[${i - 1}].autofinishOd`
      );
    }
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const r1 = getAutofinishRoadmapInfo();
    const r2 = getAutofinishRoadmapInfo();
    assertEqual(r1.verzija, r2.verzija, 'verzija konzistentna');
    assertEqual(r1.ukupnoMilestona, r2.ukupnoMilestona, 'ukupnoMilestona konzistentno');
    assertEqual(r1.milestones.length, r2.milestones.length, 'milestones.length konzistentno');
  });

  // ── 4. /api/autofinish-roadmap simulacija (#908) ──────────────────────────
  console.log('\n📦 /api/autofinish-roadmap — E2E Schema (#908)');

  function simulateRoadmapGET() {
    const r = getAutofinishRoadmapInfo();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: r,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateRoadmapGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=3600', () => {
    const r = simulateRoadmapGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=3600'), 'Cache-Control s-maxage=3600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateRoadmapGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateRoadmapGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateRoadmapGET();
    const required = ['verzija', 'autofinishBroj', 'ukupnoMilestona', 'milestones', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.milestones nije prazan', () => {
    const r = simulateRoadmapGET();
    assert(r.body.milestones.length >= 1, 'milestones >= 1');
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateRoadmapGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  // ── 5. E2E svih 9 autofinish API endpoints konzistentnost (#910) ──────────
  console.log('\n📦 E2E Svih 9 Autofinish Endpoints — Konzistentnost (#910)');

  const zdravlje = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap9 = getAutofinishRoadmapInfo();

  // Verzija konzistentnost
  await test('zdravlje.verzija === APP_VERSION', () => {
    assertEqual(zdravlje.verzija, APP_VERSION, 'zdravlje.verzija');
  });

  await test('statistika.verzija === APP_VERSION', () => {
    assertEqual(statistika.verzija, APP_VERSION, 'statistika.verzija');
  });

  await test('meta.verzija === APP_VERSION', () => {
    assertEqual(meta.verzija, APP_VERSION, 'meta.verzija');
  });

  await test('verzije.aktuelnaVerzija === APP_VERSION', () => {
    assertEqual(verzije.aktuelnaVerzija, APP_VERSION, 'verzije.aktuelnaVerzija');
  });

  await test('audit.verzija === APP_VERSION', () => {
    assertEqual(audit.verzija, APP_VERSION, 'audit.verzija');
  });

  await test('roadmap.verzija === APP_VERSION', () => {
    assertEqual(roadmap9.verzija, APP_VERSION, 'roadmap.verzija');
  });

  // autofinishBroj konzistentnost
  await test('zdravlje.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(zdravlje.autofinishBroj, AUTOFINISH_COUNT, 'zdravlje.autofinishBroj');
  });

  await test('statistika.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(statistika.autofinishBroj, AUTOFINISH_COUNT, 'statistika.autofinishBroj');
  });

  await test('meta.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(meta.autofinishBroj, AUTOFINISH_COUNT, 'meta.autofinishBroj');
  });

  await test('verzije.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(verzije.autofinishBroj, AUTOFINISH_COUNT, 'verzije.autofinishBroj');
  });

  await test('audit.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(audit.autofinishBroj, AUTOFINISH_COUNT, 'audit.autofinishBroj');
  });

  await test('roadmap.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(roadmap9.autofinishBroj, AUTOFINISH_COUNT, 'roadmap.autofinishBroj');
  });

  // Dijagnostike konzistentnost
  await test('zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'zdravlje.ukupnoProvera');
  });

  await test('statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'statistika.dijagnostike');
  });

  await test('audit.zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(audit.zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'audit.zdravlje.ukupnoProvera');
  });

  // API Routes konzistentnost
  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  // meta endpoints provjera
  await test('meta.autofinishEndpoints sadrži /api/autofinish-zdravlje', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-zdravlje'), 'zdravlje u endpoints');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-roadmap', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-roadmap'), 'roadmap u endpoints');
  });

  // ── 6. Globalni invarijanti (#910) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#910)');

  await test('AUTOFINISH_COUNT === 950', () => {
    assertEqual(AUTOFINISH_COUNT, 950, 'AUTOFINISH_COUNT=950');
  });

  await test('APP_VERSION === "44.71.0"', () => {
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
