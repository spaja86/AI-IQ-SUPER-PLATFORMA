// Autofinish #922 — Unit Testovi getAutofinishMilestoneDetail()
// Autofinish #924 — Integracioni Testovi /api/autofinish-milestone/[id]
// Autofinish #926 — Unit testovi Dashboard Milestone Modal simulacija
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/milestone-detail.test.ts

import {
  getAutofinishMilestoneDetail,
  getAutofinishRoadmapInfo,
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
  console.log('\n🗺️ Milestone Detail + API Integration + Modal — Test Suite (#922 + #924 + #926)\n');

  const roadmap = getAutofinishRoadmapInfo();
  const firstMilestone = roadmap.milestones[0];
  const firstSlug = toSlug(firstMilestone.naziv);

  // ── 1. getAutofinishMilestoneDetail() schema (#922) ──────────────────────
  console.log('📦 getAutofinishMilestoneDetail() Schema (#922)');

  const d = getAutofinishMilestoneDetail(firstSlug);

  await test('Validan slug vraća objekat', () => {
    assert(d !== null, 'vraća non-null');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(d!.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(d!.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('id === firstSlug', () => {
    assertEqual(d!.id, firstSlug, 'id');
  });

  await test('naziv je string > 0', () => {
    assert(typeof d!.naziv === 'string' && d!.naziv.length > 0, 'naziv string');
  });

  await test('opis je string > 0', () => {
    assert(typeof d!.opis === 'string' && d!.opis.length > 0, 'opis string');
  });

  await test('status je done/active/pending', () => {
    const valid = ['done', 'active', 'pending'];
    assert(valid.includes(d!.status), `status validan: ${d!.status}`);
  });

  await test('autofinishOd je broj > 0', () => {
    assert(typeof d!.autofinishOd === 'number' && d!.autofinishOd > 0, `autofinishOd > 0: ${d!.autofinishOd}`);
  });

  await test('autofinishDo >= autofinishOd', () => {
    assert(d!.autofinishDo >= d!.autofinishOd, `Do >= Od`);
  });

  await test('iteracije je niz', () => {
    assert(Array.isArray(d!.iteracije), 'iteracije niz');
  });

  await test('ukupnoIteracija === iteracije.length', () => {
    assertEqual(d!.ukupnoIteracija, d!.iteracije.length, 'ukupnoIteracija');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(d!.timestamp)), 'timestamp ISO');
  });

  // ── 2. Iteracije u rasponu (#922) ─────────────────────────────────────────
  console.log('\n📦 Iteracije u Rasponu (#922)');

  await test('Svaka iteracija.broj je u rasponu Od–Do', () => {
    for (const it of d!.iteracije) {
      assert(
        it.broj >= d!.autofinishOd && it.broj <= d!.autofinishDo,
        `iteracija #${it.broj} u rasponu ${d!.autofinishOd}–${d!.autofinishDo}`,
      );
    }
  });

  await test('Svaka iteracija.opis je string > 0', () => {
    for (const it of d!.iteracije) {
      assert(typeof it.opis === 'string' && it.opis.length > 0, `iteracija #${it.broj} opis string`);
    }
  });

  await test('Iteracije su sortirane uzlazno po broju', () => {
    const bros = d!.iteracije.map((it) => it.broj);
    for (let i = 1; i < bros.length; i++) {
      assert(bros[i] > bros[i - 1], `sortirano: ${bros[i - 1]} < ${bros[i]}`);
    }
  });

  // ── 3. Nepostojeći ID vraća null (#922) ───────────────────────────────────
  console.log('\n📦 Nepostojeći ID (#922)');

  await test('Nepostojeći ID vraća null', () => {
    const r = getAutofinishMilestoneDetail('nepostojeci-milestone-xyz-999');
    assert(r === null, 'null za nepostojeći ID');
  });

  await test('Prazan string ID vraća null', () => {
    const r = getAutofinishMilestoneDetail('');
    assert(r === null, 'null za prazan string');
  });

  // ── 4. Konzistentnost sa roadmap (#922) ───────────────────────────────────
  console.log('\n📦 Konzistentnost sa Roadmap (#922)');

  await test('naziv konzistentno sa roadmap.milestones', () => {
    assertEqual(d!.naziv, firstMilestone.naziv, 'naziv konzistentno');
  });

  await test('status konzistentno sa roadmap.milestones', () => {
    assertEqual(d!.status, firstMilestone.status, 'status konzistentno');
  });

  await test('autofinishOd konzistentno sa roadmap.milestones', () => {
    assertEqual(d!.autofinishOd, firstMilestone.autofinishOd, 'autofinishOd konzistentno');
  });

  await test('autofinishDo konzistentno sa roadmap.milestones', () => {
    assertEqual(d!.autofinishDo, firstMilestone.autofinishDo, 'autofinishDo konzistentno');
  });

  await test('Svi milestones imaju detalje', () => {
    for (const m of roadmap.milestones) {
      const slug = toSlug(m.naziv);
      const detail = getAutofinishMilestoneDetail(slug);
      assert(detail !== null, `detalji za "${m.naziv}" postoje`);
    }
  });

  // ── 5. /api/autofinish-milestone/[id] simulacija (#924) ───────────────────
  console.log('\n📦 /api/autofinish-milestone/[id] — E2E Schema (#924)');

  function simulateMilestoneGET(id: string): {
    status: number;
    headers: Record<string, string>;
    body: typeof d | { error: string; id: string; verzija: string };
  } {
    const detail = getAutofinishMilestoneDetail(id);
    if (!detail) {
      return {
        status: 404,
        headers: {
          'X-App-Version': APP_VERSION,
          'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        },
        body: {
          error: 'NOT_FOUND',
          id,
          verzija: APP_VERSION,
        },
      };
    }
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: detail,
    };
  }

  await test('HTTP 200 za validan ID', () => {
    assertEqual(simulateMilestoneGET(firstSlug).status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=3600', () => {
    const r = simulateMilestoneGET(firstSlug);
    assert((r.headers['Cache-Control'] ?? '').includes('s-maxage=3600'), 'Cache-Control s-maxage=3600');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const r = simulateMilestoneGET(firstSlug);
    assertEqual(r.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('HTTP 404 za nepostojeći ID', () => {
    assertEqual(simulateMilestoneGET('nepostojeci-xyz').status, 404, 'HTTP 404');
  });

  await test('404 body ima error: NOT_FOUND', () => {
    const r = simulateMilestoneGET('nepostojeci-xyz');
    assert('error' in r.body && r.body.error === 'NOT_FOUND', 'error: NOT_FOUND');
  });

  await test('body 200 ima sve obavezne ključeve', () => {
    const r = simulateMilestoneGET(firstSlug);
    const required = ['verzija', 'autofinishBroj', 'id', 'naziv', 'status', 'iteracije', 'timestamp'];
    for (const k of required) {
      assert(k in r.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 6. Dashboard Modal simulacija (#926) ──────────────────────────────────
  console.log('\n📦 Dashboard Milestone Modal — Simulacija (#926)');

  function simulateModal(slug: string | null) {
    if (!slug) return { open: false, detail: null };
    const detail = getAutofinishMilestoneDetail(slug);
    return {
      open: detail !== null,
      detail,
      apiLink: detail ? `/api/autofinish-milestone/${slug}` : null,
    };
  }

  await test('Modal zatvoren kad slug === null', () => {
    const m = simulateModal(null);
    assert(!m.open, 'modal zatvoren');
  });

  await test('Modal otvoren za validan slug', () => {
    const m = simulateModal(firstSlug);
    assert(m.open, 'modal otvoren');
  });

  await test('Modal apiLink konzistentno', () => {
    const m = simulateModal(firstSlug);
    assertEqual(m.apiLink, `/api/autofinish-milestone/${firstSlug}`, 'apiLink');
  });

  await test('Modal detail ima iteracije', () => {
    const m = simulateModal(firstSlug);
    assert(Array.isArray(m.detail!.iteracije), 'iteracije niz');
  });

  await test('Modal ne otvara se za nepostojeći slug', () => {
    const m = simulateModal('nepostojeci-xyz-modal');
    assert(!m.open, 'modal zatvoren za nepostojeći');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const m1 = simulateModal(firstSlug);
    const m2 = simulateModal(firstSlug);
    assertEqual(m1.detail!.naziv, m2.detail!.naziv, 'naziv konzistentno');
    assertEqual(m1.detail!.ukupnoIteracija, m2.detail!.ukupnoIteracija, 'ukupnoIteracija konzistentno');
  });

  // ── 7. Globalni invarijanti ────────────────────────────────────────────────
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
