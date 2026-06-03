// Autofinish #1223 — Unit Testovi getAutofinishReleaseReadiness()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/release-readiness.test.ts

import { getAutofinishReleaseReadiness } from '../../lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

const VALID_STATUSI = ['spremno', 'na-rubu', 'blokirano'] as const;
const VALID_READY_STATES = ['READY', 'NOT_READY'] as const;
const VALID_KATEGORIJE = [
  'deploy',
  'pipeline',
  'sigurnost',
  'konfiguracija',
  'incidenti',
  'operativa',
  'infrastruktura',
] as const;

async function runTests(): Promise<void> {
  console.log('\n🚦 Release Readiness — Unit Test Suite (#1223)\n');

  const r = getAutofinishReleaseReadiness();

  console.log('📦 Top-level schema (#1223)');

  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('status je validan enum', () => {
    assert((VALID_STATUSI as readonly string[]).includes(r.status), `status: ${r.status}`);
  });

  await test('readyState je validan enum', () => {
    assert((VALID_READY_STATES as readonly string[]).includes(r.readyState), `readyState: ${r.readyState}`);
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('checks je neprazan niz', () => {
    assert(Array.isArray(r.checks) && r.checks.length > 0, 'checks niz');
  });

  console.log('\n📦 Summary konzistentnost (#1223)');

  await test('ukupnoCheckova === checks.length', () => {
    assertEqual(r.summary.ukupnoCheckova, r.checks.length, 'ukupnoCheckova');
  });

  await test('spremno + naRubu + blokirano === ukupnoCheckova', () => {
    const suma = r.summary.spremnoCount + r.summary.naRubuCount + r.summary.blokiranoCount;
    assertEqual(suma, r.summary.ukupnoCheckova, 'suma summary statusa');
  });

  await test('ready + notReady === ukupnoCheckova', () => {
    const suma = r.summary.readyCount + r.summary.notReadyCount;
    assertEqual(suma, r.summary.ukupnoCheckova, 'suma ready statusa');
  });

  await test('summary.readyState prati top-level readyState', () => {
    assertEqual(r.summary.readyState, r.readyState, 'summary.readyState');
  });

  await test('overallScore je 0–100', () => {
    assert(r.summary.overallScore >= 0 && r.summary.overallScore <= 100, 'overallScore');
  });

  await test('releaseWindow nije prazan', () => {
    assert(r.summary.releaseWindow.length > 0, 'releaseWindow');
  });

  await test('releaseCaptain nije prazan', () => {
    assert(r.summary.releaseCaptain.length > 0, 'releaseCaptain');
  });

  console.log('\n📦 Check schema (#1223)');

  for (const check of r.checks) {
    await test(`${check.id}: id nije prazan`, () => {
      assert(check.id.length > 0, 'id');
    });

    await test(`${check.id}: naziv nije prazan`, () => {
      assert(check.naziv.length > 0, 'naziv');
    });

    await test(`${check.id}: kategorija je validna`, () => {
      assert((VALID_KATEGORIJE as readonly string[]).includes(check.kategorija), `kategorija=${check.kategorija}`);
    });

    await test(`${check.id}: status je validan`, () => {
      assert((VALID_STATUSI as readonly string[]).includes(check.status), `status=${check.status}`);
    });

    await test(`${check.id}: readyState je validan`, () => {
      assert((VALID_READY_STATES as readonly string[]).includes(check.readyState), `readyState=${check.readyState}`);
    });

    await test(`${check.id}: score je 0–100`, () => {
      assert(check.score >= 0 && check.score <= 100, `score=${check.score}`);
    });

    await test(`${check.id}: threshold je 0–100`, () => {
      assert(check.threshold >= 0 && check.threshold <= 100, `threshold=${check.threshold}`);
    });

    await test(`${check.id}: owner nije prazan`, () => {
      assert(check.owner.length > 0, 'owner');
    });

    await test(`${check.id}: detalj nije prazan`, () => {
      assert(check.detalj.length > 0, 'detalj');
    });

    await test(`${check.id}: akcija nije prazna`, () => {
      assert(check.akcija.length > 0, 'akcija');
    });
  }

  console.log('\n📦 Logički invarijanti (#1223)');

  await test('Blockers odgovaraju blokiranim checkovima', () => {
    assertEqual(r.blockers.length, r.summary.blokiranoCount, 'blockers.length');
  });

  await test('Warnings ne prelaze broj checkova na rubu', () => {
    assert(r.warnings.length <= r.summary.naRubuCount, 'warnings.length <= naRubuCount');
  });

  await test('Preporuka nije prazna', () => {
    assert(r.preporuka.length > 0, 'preporuka');
  });

  console.log('\n📦 /api/autofinish-release-readiness — E2E Schema (#1223)');

  function simulateReleaseReadinessGET() {
    const data = getAutofinishReleaseReadiness();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
        'X-Ready-State': data.readyState,
      },
      body: data,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulateReleaseReadinessGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    assert(
      simulateReleaseReadinessGET().headers['Cache-Control'].includes('s-maxage=30'),
      'Cache-Control',
    );
  });

  await test('X-App-Version === APP_VERSION', () => {
    assertEqual(simulateReleaseReadinessGET().headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    assertEqual(
      simulateReleaseReadinessGET().headers['X-Autofinish-Iteracija'],
      String(AUTOFINISH_COUNT),
      'X-Autofinish-Iteracija',
    );
  });

  await test('X-Ready-State je validan', () => {
    assert(
      (VALID_READY_STATES as readonly string[]).includes(simulateReleaseReadinessGET().headers['X-Ready-State']),
      'X-Ready-State',
    );
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Greška:', e);
  process.exit(1);
});
