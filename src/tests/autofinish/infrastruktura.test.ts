// Autofinish #1121 — Unit Testovi getAutofinishInfrastruktura()
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/infrastruktura.test.ts

import { getAutofinishInfrastruktura } from '../../lib/autofinish-petlja';
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

async function runTests(): Promise<void> {
  console.log('\n🖥️  Infrastruktura Monitor — Unit Test Suite (#1121)\n');

  const r = getAutofinishInfrastruktura();

  // ── 1. Top-level schema ───────────────────────────────────────────────────
  console.log('📦 Top-level schema (#1121)');

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

  await test('nodeovi je neprazan niz', () => {
    assert(Array.isArray(r.nodeovi) && r.nodeovi.length > 0, 'nodeovi niz');
  });

  await test('summary je objekat', () => {
    assert(typeof r.summary === 'object' && r.summary !== null, 'summary objekat');
  });

  // ── 2. Summary konzistentnost ─────────────────────────────────────────────
  console.log('\n📦 Summary konzistentnost (#1121)');

  await test('ukupnoNodeova === nodeovi.length', () => {
    assertEqual(r.summary.ukupnoNodeova, r.nodeovi.length, 'ukupnoNodeova');
  });

  await test('okNodeova + upozorenjaNodeova + kriticnihNodeova === ukupnoNodeova', () => {
    const suma = r.summary.okNodeova + r.summary.upozorenjaNodeova + r.summary.kriticnihNodeova;
    assertEqual(suma, r.summary.ukupnoNodeova, 'suma statusa');
  });

  await test('prosjecniCpu je 0–100', () => {
    assert(r.summary.prosjecniCpu >= 0 && r.summary.prosjecniCpu <= 100, `prosjecniCpu: ${r.summary.prosjecniCpu}`);
  });

  await test('prosjecniRam je 0–100', () => {
    assert(r.summary.prosjecniRam >= 0 && r.summary.prosjecniRam <= 100, `prosjecniRam: ${r.summary.prosjecniRam}`);
  });

  await test('prosjecniDisk je 0–100', () => {
    assert(r.summary.prosjecniDisk >= 0 && r.summary.prosjecniDisk <= 100, `prosjecniDisk: ${r.summary.prosjecniDisk}`);
  });

  await test('prosjecniUptime je 0–100', () => {
    assert(r.summary.prosjecniUptime >= 0 && r.summary.prosjecniUptime <= 100, `prosjecniUptime: ${r.summary.prosjecniUptime}`);
  });

  // ── 3. Node schema ────────────────────────────────────────────────────────
  console.log('\n📦 Node schema (#1121)');

  const validUloge = ['aplikacija', 'baza', 'kes', 'proxy', 'monitoring'];
  const validStatusi = ['ok', 'warning', 'critical'];

  for (const node of r.nodeovi) {
    await test(`${node.id}: id nije prazan`, () => {
      assert(typeof node.id === 'string' && node.id.length > 0, `id: ${node.id}`);
    });

    await test(`${node.id}: naziv nije prazan`, () => {
      assert(typeof node.naziv === 'string' && node.naziv.length > 0, `naziv: ${node.naziv}`);
    });

    await test(`${node.id}: uloga je validan enum`, () => {
      assert(validUloge.includes(node.uloga), `uloga: ${node.uloga}`);
    });

    await test(`${node.id}: status je validan enum`, () => {
      assert(validStatusi.includes(node.status), `status: ${node.status}`);
    });

    await test(`${node.id}: uptimePostotak je 0–100`, () => {
      assert(node.uptimePostotak >= 0 && node.uptimePostotak <= 100, `uptime: ${node.uptimePostotak}`);
    });

    await test(`${node.id}: cpu je 0–100`, () => {
      assert(node.cpu >= 0 && node.cpu <= 100, `cpu: ${node.cpu}`);
    });

    await test(`${node.id}: ram je 0–100`, () => {
      assert(node.ram >= 0 && node.ram <= 100, `ram: ${node.ram}`);
    });

    await test(`${node.id}: disk je 0–100`, () => {
      assert(node.disk >= 0 && node.disk <= 100, `disk: ${node.disk}`);
    });

    await test(`${node.id}: mrezaUlazMbps >= 0`, () => {
      assert(node.mrezaUlazMbps >= 0, `mrezaUlazMbps: ${node.mrezaUlazMbps}`);
    });

    await test(`${node.id}: loadAverage1m >= 0`, () => {
      assert(node.loadAverage1m >= 0, `load1m: ${node.loadAverage1m}`);
    });

    await test(`${node.id}: zadnjeAzuriranjeISO je validan ISO`, () => {
      assert(!isNaN(Date.parse(node.zadnjeAzuriranjeISO)), `zadnjeAzuriranje ISO`);
    });
  }

  // ── 4. Jedinstveni ID-ovi ─────────────────────────────────────────────────
  console.log('\n📦 Logički invarijanti (#1121)');

  await test('Svi node ID-ovi su jedinstveni', () => {
    const ids = r.nodeovi.map((n) => n.id);
    const unique = new Set(ids);
    assertEqual(unique.size, ids.length, 'jedinstveni ID-ovi');
  });

  await test('Postoji barem jedan node uloga=aplikacija', () => {
    assert(r.nodeovi.some((n) => n.uloga === 'aplikacija'), 'ima aplikacija node');
  });

  await test('Postoji barem jedan node uloga=baza', () => {
    assert(r.nodeovi.some((n) => n.uloga === 'baza'), 'ima baza node');
  });

  // ── 5. /api/autofinish-infrastruktura simulacija ──────────────────────────
  console.log('\n📦 /api/autofinish-infrastruktura — E2E Schema (#1121)');

  function simulateInfraGET() {
    const data = getAutofinishInfrastruktura();
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
    assertEqual(simulateInfraGET().status, 200, 'HTTP 200');
  });

  await test('Cache-Control sadrži s-maxage=30', () => {
    assert(simulateInfraGET().headers['Cache-Control'].includes('s-maxage=30'), 'Cache-Control');
  });

  await test('X-App-Version === APP_VERSION', () => {
    assertEqual(simulateInfraGET().headers['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === AUTOFINISH_COUNT', () => {
    assertEqual(
      simulateInfraGET().headers['X-Autofinish-Iteracija'],
      String(AUTOFINISH_COUNT),
      'X-Autofinish-Iteracija',
    );
  });

  await test('body ima obavezne ključeve', () => {
    const b = simulateInfraGET().body;
    const required = ['verzija', 'autofinishBroj', 'summary', 'nodeovi', 'timestamp'];
    for (const k of required) {
      assert(k in b, `ključ "${k}" prisutan`);
    }
  });

  // ── 6. Globalni invarijanti ────────────────────────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#1121)');

  await test('AUTOFINISH_COUNT === 1121', () => {
    assertEqual(AUTOFINISH_COUNT, 1121, 'AUTOFINISH_COUNT=1121');
  });

  await test('APP_VERSION === "46.42.0"', () => {
    assertEqual(APP_VERSION, '46.42.0', 'APP_VERSION=46.42.0');
  });

  await test('TOTAL_DIAGNOSTIKA === 2226', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 2226, 'TOTAL_DIAGNOSTIKA=2226');
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
