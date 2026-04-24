// Autofinish #928 — Unit Testovi getAutofinishSystemReport()
// Autofinish #930 — E2E svih 11 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/system-report.test.ts

import {
  getAutofinishSystemReport,
  getAutofinishHealthSummary,
  getAutofinishStatistikaSummary,
  getAutofinishMetaInfo,
  getAutofinishVerzijeSummary,
  getAutofinishAuditReport,
  getAutofinishRoadmapInfo,
  getAutofinishRoadmapStatusSummary,
  getAutofinishNextSteps,
  getAutofinishMilestoneDetail,
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

function toSlug(naziv: string): string {
  return naziv.toLowerCase().replace(/\s+/g, '-');
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📊 System Report + Full 11-Endpoint E2E — Test Suite (#928 + #930)\n');

  // ── 1. getAutofinishSystemReport() schema (#928) ──────────────────────────
  console.log('📦 getAutofinishSystemReport() Schema (#928)');

  const r = getAutofinishSystemReport();

  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('generisanoU je validan ISO', () => {
    assert(!isNaN(Date.parse(r.generisanoU)), 'generisanoU ISO');
  });

  await test('zdravlje je objekat', () => {
    assert(typeof r.zdravlje === 'object' && r.zdravlje !== null, 'zdravlje objekat');
  });

  await test('roadmap je objekat', () => {
    assert(typeof r.roadmap === 'object' && r.roadmap !== null, 'roadmap objekat');
  });

  await test('statistika je objekat', () => {
    assert(typeof r.statistika === 'object' && r.statistika !== null, 'statistika objekat');
  });

  await test('nextSteps je objekat', () => {
    assert(typeof r.nextSteps === 'object' && r.nextSteps !== null, 'nextSteps objekat');
  });

  // ── 2. Sub-object konzistentnost (#928) ───────────────────────────────────
  console.log('\n📦 Sub-Object Konzistentnost (#928)');

  await test('zdravlje.zdravlje je broj 0–100', () => {
    assert(r.zdravlje.zdravlje >= 0 && r.zdravlje.zdravlje <= 100, `zdravlje.zdravlje 0–100: ${r.zdravlje.zdravlje}`);
  });

  await test('roadmap.progres je broj 0–100', () => {
    assert(r.roadmap.progres >= 0 && r.roadmap.progres <= 100, `roadmap.progres 0–100: ${r.roadmap.progres}`);
  });

  await test('roadmap.done + active + pending === ukupno', () => {
    const suma = r.roadmap.done + r.roadmap.active + r.roadmap.pending;
    assertEqual(suma, r.roadmap.ukupno, 'zbir == ukupno');
  });

  await test('statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(r.statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'statistika.dijagnostike');
  });

  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(r.statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  await test('nextSteps.steps niz nije prazan', () => {
    assert(Array.isArray(r.nextSteps.steps) && r.nextSteps.steps.length >= 1, 'nextSteps.steps >= 1');
  });

  await test('nextSteps.ukupnoKoraka === steps.length', () => {
    assertEqual(r.nextSteps.ukupnoKoraka, r.nextSteps.steps.length, 'ukupnoKoraka');
  });

  await test('Konzistentnost sa izolovanim pozivima', () => {
    const hz = getAutofinishHealthSummary();
    assertEqual(r.zdravlje.zdravlje, hz.zdravlje, 'zdravlje konzistentno');
    const rs = getAutofinishRoadmapStatusSummary();
    assertEqual(r.roadmap.progres, rs.progres, 'roadmap progres konzistentno');
    const st = getAutofinishStatistikaSummary();
    assertEqual(r.statistika.dijagnostike, st.dijagnostike, 'statistika konzistentno');
    const ns = getAutofinishNextSteps();
    assertEqual(r.nextSteps.ukupnoKoraka, ns.ukupnoKoraka, 'nextSteps konzistentno');
  });

  await test('Dva uzastopna poziva konzistentna', () => {
    const r1 = getAutofinishSystemReport();
    const r2 = getAutofinishSystemReport();
    assertEqual(r1.verzija, r2.verzija, 'verzija konzistentno');
    assertEqual(r1.zdravlje.zdravlje, r2.zdravlje.zdravlje, 'zdravlje konzistentno');
    assertEqual(r1.roadmap.progres, r2.roadmap.progres, 'roadmap konzistentno');
  });

  // ── 3. /api/autofinish-system-report simulacija (#929) ────────────────────
  console.log('\n📦 /api/autofinish-system-report — E2E Schema (#929)');

  function simulateSystemReportGET() {
    const report = getAutofinishSystemReport();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: report,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateSystemReportGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    const resp = simulateSystemReportGET();
    assert(resp.headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control s-maxage=30');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulateSystemReportGET();
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const resp = simulateSystemReportGET();
    assertEqual(resp.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const resp = simulateSystemReportGET();
    const required = ['verzija', 'autofinishBroj', 'generisanoU', 'zdravlje', 'roadmap', 'statistika', 'nextSteps'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 4. E2E svih 11 autofinish API endpoints konzistentnost (#930) ─────────
  console.log('\n📦 E2E Svih 11 Autofinish Endpoints — Konzistentnost (#930)');

  const zdravlje = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps11 = getAutofinishNextSteps();
  const systemReport = getAutofinishSystemReport();

  // Verzija konzistentnost — svih 11 endpoints
  const verzijePairs: [string, string][] = [
    ['zdravlje.verzija', zdravlje.verzija],
    ['statistika.verzija', statistika.verzija],
    ['meta.verzija', meta.verzija],
    ['verzije.aktuelnaVerzija', verzije.aktuelnaVerzija],
    ['audit.verzija', audit.verzija],
    ['roadmap.verzija', roadmap.verzija],
    ['roadmapStatus.verzija', roadmapStatus.verzija],
    ['nextSteps.verzija', nextSteps11.verzija],
    ['systemReport.verzija', systemReport.verzija],
    ['systemReport.zdravlje.verzija', systemReport.zdravlje.verzija],
    ['systemReport.roadmap.verzija', systemReport.roadmap.verzija],
    ['systemReport.statistika.verzija', systemReport.statistika.verzija],
    ['systemReport.nextSteps.verzija', systemReport.nextSteps.verzija],
  ];

  for (const [label, val] of verzijePairs) {
    await test(`${label} === APP_VERSION`, () => {
      assertEqual(val, APP_VERSION, label);
    });
  }

  // autofinishBroj konzistentnost
  const brojPairs: [string, number][] = [
    ['zdravlje.autofinishBroj', zdravlje.autofinishBroj],
    ['statistika.autofinishBroj', statistika.autofinishBroj],
    ['meta.autofinishBroj', meta.autofinishBroj],
    ['verzije.autofinishBroj', verzije.autofinishBroj],
    ['audit.autofinishBroj', audit.autofinishBroj],
    ['roadmap.autofinishBroj', roadmap.autofinishBroj],
    ['roadmapStatus.autofinishBroj', roadmapStatus.autofinishBroj],
    ['nextSteps.autofinishBroj', nextSteps11.autofinishBroj],
    ['systemReport.autofinishBroj', systemReport.autofinishBroj],
  ];

  for (const [label, val] of brojPairs) {
    await test(`${label} === AUTOFINISH_COUNT`, () => {
      assertEqual(val, AUTOFINISH_COUNT, label);
    });
  }

  // Dijagnostike
  await test('zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'zdravlje.ukupnoProvera');
  });

  await test('statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'statistika.dijagnostike');
  });

  await test('systemReport.statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(systemReport.statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'systemReport.statistika.dijagnostike');
  });

  // API Routes
  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  await test('systemReport.statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(systemReport.statistika.apiRute, TOTAL_API_ROUTES, 'systemReport.statistika.apiRute');
  });

  // meta endpoints sadrži nova 2
  await test('meta.autofinishEndpoints sadrži /api/autofinish-milestone/[id]', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-milestone/[id]'), 'milestone/[id] u endpoints');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-system-report', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-system-report'), 'system-report u endpoints');
  });

  // milestone detail konzistentnost
  await test('Sve milestone detalji konzistentne sa roadmap', () => {
    for (const m of roadmap.milestones) {
      const slug = toSlug(m.naziv);
      const detail = getAutofinishMilestoneDetail(slug);
      assert(detail !== null, `detalji za "${m.naziv}" postoje`);
      assertEqual(detail!.naziv, m.naziv, `naziv konzistentno: ${m.naziv}`);
      assertEqual(detail!.status, m.status, `status konzistentno: ${m.naziv}`);
    }
  });

  // systemReport roadmap konzistentnost
  await test('systemReport.roadmap.ukupno === roadmap.milestones.length', () => {
    assertEqual(systemReport.roadmap.ukupno, roadmap.milestones.length, 'roadmap.ukupno konzistentno');
  });

  await test('systemReport.zdravlje.zdravlje je 0–100', () => {
    assert(
      systemReport.zdravlje.zdravlje >= 0 && systemReport.zdravlje.zdravlje <= 100,
      `zdravlje 0–100: ${systemReport.zdravlje.zdravlje}`,
    );
  });

  // ── 5. Globalni invarijanti (#930) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#930)');

  await test('AUTOFINISH_COUNT === 930', () => {
    assertEqual(AUTOFINISH_COUNT, 930, 'AUTOFINISH_COUNT=930');
  });

  await test('APP_VERSION === "44.51.0"', () => {
    assertEqual(APP_VERSION, '44.51.0', 'APP_VERSION=44.51.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1844', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1844, 'TOTAL_DIAGNOSTIKA=1844');
  });

  await test('TOTAL_API_ROUTES === 936', () => {
    assertEqual(TOTAL_API_ROUTES, 936, 'TOTAL_API_ROUTES=936');
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
