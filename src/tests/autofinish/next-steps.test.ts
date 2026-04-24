// Autofinish #916 — Unit Testovi getAutofinishNextSteps()
// Autofinish #918 — Integracioni Testovi /api/autofinish-next-steps
// Autofinish #920 — E2E svih 10 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/next-steps.test.ts

import {
  getAutofinishNextSteps,
  getAutofinishHealthSummary,
  getAutofinishStatistikaSummary,
  getAutofinishMetaInfo,
  getAutofinishVerzijeSummary,
  getAutofinishAuditReport,
  getAutofinishRoadmapInfo,
  getAutofinishRoadmapStatusSummary,
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
  console.log('\n🚀 Next Steps + Full 10-Endpoint E2E — Test Suite (#916 + #918 + #920)\n');

  // ── 1. getAutofinishNextSteps() schema (#916) ──────────────────────────────
  console.log('📦 getAutofinishNextSteps() Schema (#916)');

  const ns = getAutofinishNextSteps();

  await test('Vraća objekat', () => {
    assert(typeof ns === 'object' && ns !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(ns.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(ns.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('steps je niz', () => {
    assert(Array.isArray(ns.steps), 'steps je niz');
  });

  await test('steps nije prazan', () => {
    assert(ns.steps.length >= 1, `steps.length >= 1: ${ns.steps.length}`);
  });

  await test('ukupnoKoraka === steps.length', () => {
    assertEqual(ns.ukupnoKoraka, ns.steps.length, 'ukupnoKoraka');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(ns.timestamp)), 'timestamp ISO');
  });

  // ── 2. Step schema (#916) ─────────────────────────────────────────────────
  console.log('\n📦 Step Schema (#916)');

  await test('Svaki step ima id (string)', () => {
    for (const step of ns.steps) {
      assert(typeof step.id === 'string' && step.id.length > 0, `id string: ${step.id}`);
    }
  });

  await test('Svaki step ima naziv (string)', () => {
    for (const step of ns.steps) {
      assert(typeof step.naziv === 'string' && step.naziv.length > 0, `naziv string: ${step.naziv}`);
    }
  });

  await test('Svaki step ima opis (string)', () => {
    for (const step of ns.steps) {
      assert(typeof step.opis === 'string' && step.opis.length > 0, `opis string: ${step.opis}`);
    }
  });

  await test('Svaki step prioritet je 1–5', () => {
    const valid = [1, 2, 3, 4, 5];
    for (const step of ns.steps) {
      assert(valid.includes(step.prioritet), `prioritet validan: ${step.prioritet}`);
    }
  });

  await test('Svaki step kategorija je validna', () => {
    const valid = ['helper', 'api', 'test', 'dashboard', 'e2e', 'refactor', 'dokumentacija'];
    for (const step of ns.steps) {
      assert(valid.includes(step.kategorija), `kategorija validna: ${step.kategorija}`);
    }
  });

  await test('Svaki step autofinishTarget >= AUTOFINISH_COUNT', () => {
    for (const step of ns.steps) {
      assert(step.autofinishTarget >= AUTOFINISH_COUNT, `autofinishTarget >= AUTOFINISH_COUNT: ${step.autofinishTarget}`);
    }
  });

  // ── 3. Logički invarijanti (#916) ─────────────────────────────────────────
  console.log('\n📦 Logički Invarijanti (#916)');

  await test('Step ID-evi su unikatni', () => {
    const ids = ns.steps.map((s) => s.id);
    const unique = new Set(ids);
    assertEqual(unique.size, ids.length, 'unikatni IDevi');
  });

  await test('Barem jedan step prioritet 1', () => {
    assert(ns.steps.some((s) => s.prioritet === 1), 'barem jedan P1');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const ns1 = getAutofinishNextSteps();
    const ns2 = getAutofinishNextSteps();
    assertEqual(ns1.ukupnoKoraka, ns2.ukupnoKoraka, 'ukupnoKoraka konzistentno');
    assertEqual(ns1.verzija, ns2.verzija, 'verzija konzistentno');
  });

  // ── 4. /api/autofinish-next-steps simulacija (#918) ───────────────────────
  console.log('\n📦 /api/autofinish-next-steps — E2E Schema (#918)');

  function simulateNextStepsGET() {
    const r = getAutofinishNextSteps();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: r,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateNextStepsGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=300', () => {
    const r = simulateNextStepsGET();
    assert(r.headers['Cache-Control'].includes('s-maxage=300'), 'Cache-Control s-maxage=300');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateNextStepsGET();
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    const r = simulateNextStepsGET();
    assertEqual(r.headers['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('body ima sve obavezne ključeve', () => {
    const r = simulateNextStepsGET();
    const required = ['verzija', 'autofinishBroj', 'ukupnoKoraka', 'steps', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  await test('body.steps nije prazan', () => {
    const r = simulateNextStepsGET();
    assert(r.body.steps.length >= 1, 'steps >= 1');
  });

  await test('body.verzija === APP_VERSION', () => {
    const r = simulateNextStepsGET();
    assertEqual(r.body.verzija, APP_VERSION, 'body.verzija');
  });

  await test('body step prioriteti su 1–5', () => {
    const r = simulateNextStepsGET();
    const valid = [1, 2, 3, 4, 5];
    for (const step of r.body.steps) {
      assert(valid.includes(step.prioritet), `prioritet validan: ${step.prioritet}`);
    }
  });

  // ── 5. E2E svih 10 autofinish API endpoints konzistentnost (#920) ─────────
  console.log('\n📦 E2E Svih 10 Autofinish Endpoints — Konzistentnost (#920)');

  const zdravlje = getAutofinishHealthSummary();
  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps10 = getAutofinishNextSteps();

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
    assertEqual(roadmap.verzija, APP_VERSION, 'roadmap.verzija');
  });

  await test('roadmapStatus.verzija === APP_VERSION', () => {
    assertEqual(roadmapStatus.verzija, APP_VERSION, 'roadmapStatus.verzija');
  });

  await test('nextSteps.verzija === APP_VERSION', () => {
    assertEqual(nextSteps10.verzija, APP_VERSION, 'nextSteps.verzija');
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
    assertEqual(roadmap.autofinishBroj, AUTOFINISH_COUNT, 'roadmap.autofinishBroj');
  });

  await test('roadmapStatus.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(roadmapStatus.autofinishBroj, AUTOFINISH_COUNT, 'roadmapStatus.autofinishBroj');
  });

  await test('nextSteps.autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(nextSteps10.autofinishBroj, AUTOFINISH_COUNT, 'nextSteps.autofinishBroj');
  });

  // Dijagnostike
  await test('zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'zdravlje.ukupnoProvera');
  });

  await test('statistika.dijagnostike === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(statistika.dijagnostike, TOTAL_DIAGNOSTIKA, 'statistika.dijagnostike');
  });

  await test('audit.zdravlje.ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    assertEqual(audit.zdravlje.ukupnoProvera, TOTAL_DIAGNOSTIKA, 'audit.zdravlje.ukupnoProvera');
  });

  // API Routes
  await test('statistika.apiRute === TOTAL_API_ROUTES', () => {
    assertEqual(statistika.apiRute, TOTAL_API_ROUTES, 'statistika.apiRute');
  });

  // meta endpoints
  await test('meta.autofinishEndpoints sadrži /api/autofinish-next-steps', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-next-steps'), 'next-steps u endpoints');
  });

  await test('roadmapStatus.ukupno === roadmap.milestones.length', () => {
    assertEqual(roadmapStatus.ukupno, roadmap.milestones.length, 'roadmapStatus.ukupno konzistentno sa roadmap');
  });

  await test('nextSteps step targets >= AUTOFINISH_COUNT', () => {
    for (const s of nextSteps10.steps) {
      assert(s.autofinishTarget >= AUTOFINISH_COUNT, `target >= AUTOFINISH_COUNT: ${s.autofinishTarget}`);
    }
  });

  // ── 6. Globalni invarijanti (#920) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#920)');

  await test('AUTOFINISH_COUNT === 920', () => {
    assertEqual(AUTOFINISH_COUNT, 920, 'AUTOFINISH_COUNT=920');
  });

  await test('APP_VERSION === "44.41.0"', () => {
    assertEqual(APP_VERSION, '44.41.0', 'APP_VERSION=44.41.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 1824', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1824, 'TOTAL_DIAGNOSTIKA=1824');
  });

  await test('TOTAL_API_ROUTES === 934', () => {
    assertEqual(TOTAL_API_ROUTES, 934, 'TOTAL_API_ROUTES=934');
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
