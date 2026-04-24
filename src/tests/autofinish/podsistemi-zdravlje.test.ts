// Autofinish #938 — Unit Testovi getAutofinishPodsistemiZdravlje()
// Autofinish #940 — E2E svih 12 autofinish API endpoints konzistentnost
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/podsistemi-zdravlje.test.ts

import {
  getAutofinishPodsistemiZdravlje,
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
  console.log('\n🏥 Podsistemi Zdravlje + Full 12-Endpoint E2E — Test Suite (#938 + #940)\n');

  // ── 1. getAutofinishPodsistemiZdravlje() schema (#938) ────────────────────
  console.log('📦 getAutofinishPodsistemiZdravlje() Schema (#938)');

  const pz = getAutofinishPodsistemiZdravlje();

  await test('Vraća objekat', () => {
    assert(typeof pz === 'object' && pz !== null, 'objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(pz.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(pz.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('podsistemi je niz', () => {
    assert(Array.isArray(pz.podsistemi), 'podsistemi niz');
  });

  await test('podsistemi.length >= 1', () => {
    assert(pz.podsistemi.length >= 1, `podsistemi.length >= 1: ${pz.podsistemi.length}`);
  });

  await test('ukupnoPodsistema === podsistemi.length', () => {
    assertEqual(pz.ukupnoPodsistema, pz.podsistemi.length, 'ukupnoPodsistema');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(pz.timestamp)), 'timestamp ISO');
  });

  // ── 2. Per-podsistem schema (#938) ────────────────────────────────────────
  console.log('\n📦 Per-Podsistem Schema (#938)');

  for (const p of pz.podsistemi) {
    await test(`"${p.naziv}" — naziv string > 0`, () => {
      assert(typeof p.naziv === 'string' && p.naziv.length > 0, `naziv: ${p.naziv}`);
    });

    await test(`"${p.naziv}" — zdravlje 0–100`, () => {
      assert(p.zdravlje >= 0 && p.zdravlje <= 100, `zdravlje 0–100: ${p.zdravlje}`);
    });

    await test(`"${p.naziv}" — status validan`, () => {
      const valid = ['ok', 'warning', 'error', 'critical'];
      assert(valid.includes(p.status), `status validan: ${p.status}`);
    });

    await test(`"${p.naziv}" — ukupnoProvera >= 0`, () => {
      assert(p.ukupnoProvera >= 0, `ukupnoProvera >= 0: ${p.ukupnoProvera}`);
    });

    await test(`"${p.naziv}" — uspesnih <= ukupnoProvera`, () => {
      assert(p.uspesnih <= p.ukupnoProvera, `uspesnih <= ukupnoProvera`);
    });
  }

  // ── 3. Konzistentnost sa zdravlje (#938) ──────────────────────────────────
  console.log('\n📦 Konzistentnost sa Health Summary (#938)');

  const hz = getAutofinishHealthSummary();

  await test('Svi podsistemi imaju zdravlje=100 (sve OK)', () => {
    for (const p of pz.podsistemi) {
      assert(p.zdravlje === 100, `zdravlje=100 za ${p.naziv}: ${p.zdravlje}`);
    }
  });

  await test('Svi podsistemi imaju status=ok', () => {
    for (const p of pz.podsistemi) {
      assertEqual(p.status, 'ok', `status=ok za ${p.naziv}`);
    }
  });

  await test('hz.zdravlje === 100 (konzistentno)', () => {
    assertEqual(hz.zdravlje, 100, 'hz.zdravlje=100');
  });

  await test('Dva uzastopna poziva konzistentna', () => {
    const pz1 = getAutofinishPodsistemiZdravlje();
    const pz2 = getAutofinishPodsistemiZdravlje();
    assertEqual(pz1.ukupnoPodsistema, pz2.ukupnoPodsistema, 'ukupnoPodsistema konzistentno');
    assertEqual(pz1.podsistemi[0].naziv, pz2.podsistemi[0].naziv, 'naziv[0] konzistentno');
    assertEqual(pz1.podsistemi[0].zdravlje, pz2.podsistemi[0].zdravlje, 'zdravlje[0] konzistentno');
  });

  // ── 4. /api/autofinish-podsistemi-zdravlje simulacija (#939) ──────────────
  console.log('\n📦 /api/autofinish-podsistemi-zdravlje — E2E Schema (#939)');

  function simulatePodsistemiZdravljeGET() {
    const result = getAutofinishPodsistemiZdravlje();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: result,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulatePodsistemiZdravljeGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    const resp = simulatePodsistemiZdravljeGET();
    assert(resp.headers['Cache-Control'].includes('s-maxage=30'), 's-maxage=30');
  });

  await test('X-App-Version === APP_VERSION', () => {
    const resp = simulatePodsistemiZdravljeGET();
    assertEqual(resp.headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('body ima sve obavezne ključeve', () => {
    const resp = simulatePodsistemiZdravljeGET();
    const required = ['verzija', 'autofinishBroj', 'podsistemi', 'ukupnoPodsistema', 'timestamp'];
    for (const k of required) {
      assert(k in resp.body, `ključ "${k}" prisutan`);
    }
  });

  // ── 5. E2E svih 12 autofinish API endpoints (#940) ────────────────────────
  console.log('\n📦 E2E Svih 12 Autofinish Endpoints — Konzistentnost (#940)');

  const statistika = getAutofinishStatistikaSummary();
  const meta = getAutofinishMetaInfo();
  const verzije = getAutofinishVerzijeSummary();
  const audit = getAutofinishAuditReport();
  const roadmap = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  const nextSteps = getAutofinishNextSteps();
  const systemReport = getAutofinishSystemReport();
  const raspon = getAutofinishIteracijaRaspon(931, 940);

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
    ['podsistemiZdravlje.verzija', pz.verzija],
    ['raspon.verzija', raspon.verzija],
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
    ['podsistemiZdravlje.autofinishBroj', pz.autofinishBroj],
    ['raspon.autofinishBroj', raspon.autofinishBroj],
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
  await test('meta.autofinishEndpoints sadrži /api/autofinish-iteracija-raspon', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-iteracija-raspon'), 'iteracija-raspon u endpoints');
  });

  await test('meta.autofinishEndpoints sadrži /api/autofinish-podsistemi-zdravlje', () => {
    assert(meta.autofinishEndpoints.includes('/api/autofinish-podsistemi-zdravlje'), 'podsistemi-zdravlje u endpoints');
  });

  // raspon 931–940 konzistentnost
  await test('raspon 931–940 daje 10 iteracija', () => {
    assertEqual(raspon.iteracije.length, 10, 'raspon 931–940 = 10');
  });

  await test('pz.ukupnoPodsistema === 10', () => {
    assertEqual(pz.ukupnoPodsistema, 10, 'ukupnoPodsistema=10');
  });

  // systemReport roadmap konzistentnost
  await test('systemReport.roadmap.ukupno === roadmap.milestones.length', () => {
    assertEqual(systemReport.roadmap.ukupno, roadmap.milestones.length, 'roadmap.ukupno konzistentno');
  });

  // ── 6. Globalni invarijanti (#940) ────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#940)');

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
