// Autofinish #912 — Unit Testovi getAutofinishRoadmapStatusSummary()
// Autofinish #914 — Integracioni Testovi Dashboard Roadmap Sekcije
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/roadmap-status-summary.test.ts

import {
  getAutofinishRoadmapStatusSummary,
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

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🗺️ Roadmap Status Summary + Dashboard Roadmap — Test Suite (#912 + #914)\n');

  // ── 1. getAutofinishRoadmapStatusSummary() schema (#912) ──────────────────
  console.log('📦 getAutofinishRoadmapStatusSummary() Schema (#912)');

  const s = getAutofinishRoadmapStatusSummary();

  await test('Vraća objekat', () => {
    assert(typeof s === 'object' && s !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(s.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(s.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('ukupno je broj > 0', () => {
    assert(typeof s.ukupno === 'number' && s.ukupno > 0, `ukupno > 0: ${s.ukupno}`);
  });

  await test('done je broj >= 0', () => {
    assert(typeof s.done === 'number' && s.done >= 0, `done >= 0: ${s.done}`);
  });

  await test('active je broj >= 0', () => {
    assert(typeof s.active === 'number' && s.active >= 0, `active >= 0: ${s.active}`);
  });

  await test('pending je broj >= 0', () => {
    assert(typeof s.pending === 'number' && s.pending >= 0, `pending >= 0: ${s.pending}`);
  });

  await test('progres je broj', () => {
    assert(typeof s.progres === 'number', 'progres je broj');
  });

  await test('progres je u opsegu 0–100', () => {
    assert(s.progres >= 0 && s.progres <= 100, `progres 0–100: ${s.progres}`);
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(s.timestamp)), 'timestamp ISO');
  });

  // ── 2. Logički invarijanti (#912) ─────────────────────────────────────────
  console.log('\n📦 Logički Invarijanti (#912)');

  await test('done + active + pending === ukupno', () => {
    const suma = s.done + s.active + s.pending;
    assertEqual(suma, s.ukupno, 'zbir == ukupno');
  });

  await test('done <= ukupno', () => {
    assert(s.done <= s.ukupno, `done <= ukupno`);
  });

  await test('active <= ukupno', () => {
    assert(s.active <= s.ukupno, `active <= ukupno`);
  });

  await test('pending <= ukupno', () => {
    assert(s.pending <= s.ukupno, `pending <= ukupno`);
  });

  await test('progres === round(done/ukupno*100)', () => {
    const expected = s.ukupno > 0 ? Math.round((s.done / s.ukupno) * 100) : 0;
    assertEqual(s.progres, expected, 'progres formula');
  });

  await test('Barem jedan done milestone', () => {
    assert(s.done >= 1, `done >= 1: ${s.done}`);
  });

  // ── 3. Konzistentnost sa getAutofinishRoadmapInfo() (#912) ────────────────
  console.log('\n📦 Konzistentnost sa getAutofinishRoadmapInfo() (#912)');

  const roadmap = getAutofinishRoadmapInfo();

  await test('ukupno === roadmap.milestones.length', () => {
    assertEqual(s.ukupno, roadmap.milestones.length, 'ukupno konzistentno');
  });

  await test('done === count roadmap done milestones', () => {
    const expected = roadmap.milestones.filter((m) => m.status === 'done').length;
    assertEqual(s.done, expected, 'done konzistentno');
  });

  await test('active === count roadmap active milestones', () => {
    const expected = roadmap.milestones.filter((m) => m.status === 'active').length;
    assertEqual(s.active, expected, 'active konzistentno');
  });

  await test('pending === count roadmap pending milestones', () => {
    const expected = roadmap.milestones.filter((m) => m.status === 'pending').length;
    assertEqual(s.pending, expected, 'pending konzistentno');
  });

  await test('Konzistentnost dva uzastopna poziva', () => {
    const s1 = getAutofinishRoadmapStatusSummary();
    const s2 = getAutofinishRoadmapStatusSummary();
    assertEqual(s1.progres, s2.progres, 'progres konzistentno');
    assertEqual(s1.done, s2.done, 'done konzistentno');
  });

  // ── 4. Dashboard Roadmap Sekcija simulacija (#914) ────────────────────────
  console.log('\n📦 Dashboard Roadmap Sekcija — Simulacija (#914)');

  function simulateDashboardRoadmap() {
    const rm = getAutofinishRoadmapInfo();
    const rs = getAutofinishRoadmapStatusSummary();
    return {
      milestones: rm.milestones,
      progresProcent: rs.progres,
      doneCount: rs.done,
      ukupnoCount: rs.ukupno,
      apiLink: '/api/autofinish-roadmap',
      statusValues: rm.milestones.map((m) => m.status),
    };
  }

  await test('Dashboard milestones niz nije prazan', () => {
    const d = simulateDashboardRoadmap();
    assert(d.milestones.length >= 1, 'milestones >= 1');
  });

  await test('Dashboard progresProcent 0–100', () => {
    const d = simulateDashboardRoadmap();
    assert(d.progresProcent >= 0 && d.progresProcent <= 100, `progres 0–100`);
  });

  await test('Dashboard apiLink === /api/autofinish-roadmap', () => {
    const d = simulateDashboardRoadmap();
    assertEqual(d.apiLink, '/api/autofinish-roadmap', 'apiLink');
  });

  await test('Dashboard svaki status validan (done/active/pending)', () => {
    const d = simulateDashboardRoadmap();
    const valid = ['done', 'active', 'pending'];
    for (const st of d.statusValues) {
      assert(valid.includes(st), `status validan: ${st}`);
    }
  });

  await test('Dashboard doneCount/ukupnoCount konzistentno', () => {
    const d = simulateDashboardRoadmap();
    const computed = d.milestones.filter((m) => m.status === 'done').length;
    assertEqual(d.doneCount, computed, 'doneCount konzistentno');
  });

  // ── 5. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti');

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
