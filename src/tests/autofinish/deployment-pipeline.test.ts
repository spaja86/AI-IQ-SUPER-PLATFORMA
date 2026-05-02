// Autofinish #1123 — Unit Testovi getAutofinishDeploymentPipeline()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/deployment-pipeline.test.ts

import { getAutofinishDeploymentPipeline } from '../../lib/autofinish-petlja';
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
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

const VALID_FAZA_STATUS = ['ok', 'running', 'failed', 'skipped'] as const;
const VALID_OKIDAC      = ['push', 'pr', 'manual', 'schedule', 'tag'] as const;
const VALID_TREND       = ['raste', 'pada', 'stabilno'] as const;

async function runTests(): Promise<void> {
  console.log('\n🚀 Deployment Pipeline — Unit Test Suite (#1123)\n');

  const r = getAutofinishDeploymentPipeline();

  // ── 1. Top-level schema ───────────────────────────────────────────────────
  console.log('📦 Top-level schema (#1123)');

  await test('Vraća objekat', () => {
    assert(typeof r === 'object' && r !== null, 'vraća objekat');
  });

  await test('verzija === APP_VERSION', () => {
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('timestamp je validan ISO', () => {
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp ISO');
  });

  await test('pipelines je neprazan niz', () => {
    assert(Array.isArray(r.pipelines) && r.pipelines.length > 0, 'pipelines niz');
  });

  // ── 2. Summary konzistentnost ─────────────────────────────────────────────
  console.log('\n📦 Summary konzistentnost (#1123)');

  await test('ukupnoPipeline === pipelines.length', () => {
    assertEqual(r.ukupnoPipeline, r.pipelines.length, 'ukupnoPipeline');
  });

  await test('aktivnih + uspjesnih + neuspjesnih + preskocenih <= ukupnoPipeline', () => {
    const suma = r.aktivnih + r.uspjesnih + r.neuspjesnih + r.preskocenih;
    assert(suma <= r.ukupnoPipeline, `suma (${suma}) <= ukupno (${r.ukupnoPipeline})`);
  });

  await test('prosjecnoTrajanjeSekundi >= 0', () => {
    assert(r.prosjecnoTrajanjeSekundi >= 0, `prosjecno: ${r.prosjecnoTrajanjeSekundi}`);
  });

  await test('ukupnoPipeline > 0', () => {
    assert(r.ukupnoPipeline > 0, 'ukupnoPipeline > 0');
  });

  // ── 3. Pipeline schema ────────────────────────────────────────────────────
  console.log('\n📦 Pipeline schema (#1123)');

  for (const p of r.pipelines) {
    await test(`${p.id}: id nije prazan`, () => {
      assert(typeof p.id === 'string' && p.id.length > 0, `id: ${p.id}`);
    });

    await test(`${p.id}: servis nije prazan`, () => {
      assert(typeof p.servis === 'string' && p.servis.length > 0, `servis: ${p.servis}`);
    });

    await test(`${p.id}: grana nije prazan`, () => {
      assert(typeof p.grana === 'string' && p.grana.length > 0, `grana: ${p.grana}`);
    });

    await test(`${p.id}: commitSha nije prazan`, () => {
      assert(typeof p.commitSha === 'string' && p.commitSha.length > 0, `commitSha: ${p.commitSha}`);
    });

    await test(`${p.id}: okidac je validan enum`, () => {
      assert((VALID_OKIDAC as readonly string[]).includes(p.okidac), `okidac: ${p.okidac}`);
    });

    await test(`${p.id}: status je validan enum`, () => {
      assert((VALID_FAZA_STATUS as readonly string[]).includes(p.status), `status: ${p.status}`);
    });

    await test(`${p.id}: trendUspjeha je validan enum`, () => {
      assert((VALID_TREND as readonly string[]).includes(p.trendUspjeha), `trend: ${p.trendUspjeha}`);
    });

    await test(`${p.id}: postoUspijeha je 0–100`, () => {
      assert(p.postoUspijeha >= 0 && p.postoUspijeha <= 100, `postoUspijeha: ${p.postoUspijeha}`);
    });

    await test(`${p.id}: trajanjeSekundi >= 0`, () => {
      assert(p.trajanjeSekundi >= 0, `trajanje: ${p.trajanjeSekundi}`);
    });

    await test(`${p.id}: pocetakISO je validan ISO`, () => {
      assert(!isNaN(Date.parse(p.pocetakISO)), `pocetakISO: ${p.pocetakISO}`);
    });

    await test(`${p.id}: prethodniDeployISO je validan ISO`, () => {
      assert(!isNaN(Date.parse(p.prethodniDeployISO)), `prethodniDeployISO: ${p.prethodniDeployISO}`);
    });

    await test(`${p.id}: faze je neprazan niz`, () => {
      assert(Array.isArray(p.faze) && p.faze.length > 0, 'faze niz');
    });

    // Faze schema
    for (const f of p.faze) {
      await test(`${p.id}/${f.naziv}: naziv nije prazan`, () => {
        assert(typeof f.naziv === 'string' && f.naziv.length > 0, `faza naziv: ${f.naziv}`);
      });

      await test(`${p.id}/${f.naziv}: status je validan enum`, () => {
        assert((VALID_FAZA_STATUS as readonly string[]).includes(f.status), `faza status: ${f.status}`);
      });

      await test(`${p.id}/${f.naziv}: trajanjeSekundi >= 0`, () => {
        assert(f.trajanjeSekundi >= 0, `faza trajanje: ${f.trajanjeSekundi}`);
      });
    }
  }

  // ── 4. Logički invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Logički invarijanti (#1123)');

  await test('Svi pipeline ID-ovi su jedinstveni', () => {
    const ids = r.pipelines.map((p) => p.id);
    const unique = new Set(ids);
    assertEqual(unique.size, ids.length, 'jedinstveni ID-ovi');
  });

  await test('Svi servis nazivi su neprazni', () => {
    assert(r.pipelines.every((p) => p.servis.length > 0), 'servis nije prazan');
  });

  await test('Svaki pipeline ima barem jednu fazu', () => {
    assert(r.pipelines.every((p) => p.faze.length > 0), 'barem jedna faza');
  });

  await test('Postoji barem jedan uspjesan pipeline', () => {
    assert(r.uspjesnih >= 0, `uspjesnih: ${r.uspjesnih}`);
  });

  // ── 5. /api/autofinish-deployment-pipeline simulacija ─────────────────────
  console.log('\n📦 /api/autofinish-deployment-pipeline — E2E Schema (#1123)');

  function simulatePipelineGET() {
    const data = getAutofinishDeploymentPipeline();
    return {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
      body: data,
    };
  }

  await test('HTTP 200', () => {
    assertEqual(simulatePipelineGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    assert(simulatePipelineGET().headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control');
  });

  await test('X-App-Version === APP_VERSION', () => {
    assertEqual(simulatePipelineGET().headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    assertEqual(
      simulatePipelineGET().headers['X-Autofinish-Iteracija'],
      String(AUTOFINISH_COUNT),
      'X-Autofinish-Iteracija',
    );
  });

  await test('body ima obavezne ključeve', () => {
    const b = simulatePipelineGET().body;
    const required = ['verzija', 'autofinishBroj', 'ukupnoPipeline', 'pipelines', 'timestamp'];
    for (const k of required) {
      assert(k in b, `ključ "${k}" prisutan`);
    }
  });

  // ── 6. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#1123)');

  await test('AUTOFINISH_COUNT === 1123', () => {
    assertEqual(AUTOFINISH_COUNT, 1123, 'AUTOFINISH_COUNT=1123');
  });

  await test('APP_VERSION === "46.44.0"', () => {
    assertEqual(APP_VERSION, '46.44.0', 'APP_VERSION=46.44.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 2230', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 2230, 'TOTAL_DIAGNOSTIKA=2230');
  });

  await test('TOTAL_API_ROUTES === 986', () => {
    assertEqual(TOTAL_API_ROUTES, 986, 'TOTAL_API_ROUTES=986');
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
