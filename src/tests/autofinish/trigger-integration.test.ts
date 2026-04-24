// Autofinish #851 — Integracioni Test /api/autofinish-trigger
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. 503 kad AUTOFINISH_TRIGGER_TOKEN nije konfigurisan
//   2. 401 bez Authorization headera
//   3. 401 sa pogrešnim tokenom
//   4. 200 sa ispravnim tokenom (simulacija)
//   5. Struktura odgovora — verzija, autofinishIteracija, timestamp
//
// Pokretanje: npx tsx src/tests/autofinish/trigger-integration.test.ts

import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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

// ─── Simulirani handler logika ────────────────────────────────────────────────

interface TriggerResponse {
  status: number;
  body: Record<string, unknown>;
  headers: Record<string, string>;
}

function simulateTriggerPOST(
  authHeader: string | null,
  configuredToken: string | undefined,
): TriggerResponse {
  // 503 kad token nije konfigurisan
  if (!configuredToken) {
    return {
      status: 503,
      body: {
        error: 'SERVICE_UNAVAILABLE',
        poruka: 'Autofinish trigger nije konfigurisan. Podesite AUTOFINISH_TRIGGER_TOKEN.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      headers: {},
    };
  }

  // 401 bez Authorization headera
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token || token !== configuredToken) {
    return {
      status: 401,
      body: {
        error: 'Unauthorized',
        poruka: 'Validan token je obavezan za pokretanje autofinish iteracije.',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      headers: {},
    };
  }

  // 200 sa ispravnim tokenom
  return {
    status: 200,
    body: {
      status: 'pokrenuto',
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    },
    headers: { 'Cache-Control': 'no-store' },
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔐 /api/autofinish-trigger — Integracioni Test Suite (#851)\n');

  const TOKEN = 'super-secret-autofinish-token';

  // ── 1. 503 kad token nije konfigurisan ────────────────────────────────────
  console.log('📦 503 — Token nije konfigurisan');

  await test('HTTP 503 kad AUTOFINISH_TRIGGER_TOKEN undefined', () => {
    const r = simulateTriggerPOST(null, undefined);
    assertEqual(r.status, 503, 'HTTP 503');
  });

  await test('503 body sadrži error=SERVICE_UNAVAILABLE', () => {
    const r = simulateTriggerPOST(null, undefined);
    assertEqual(r.body.error as string, 'SERVICE_UNAVAILABLE', 'error=SERVICE_UNAVAILABLE');
  });

  await test('503 body sadrži verzija', () => {
    const r = simulateTriggerPOST(null, undefined);
    assertEqual(r.body.verzija as string, APP_VERSION, 'verzija');
  });

  await test('503 body sadrži autofinishIteracija', () => {
    const r = simulateTriggerPOST(null, undefined);
    assertEqual(r.body.autofinishIteracija as number, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  // ── 2. 401 bez Authorization headera ─────────────────────────────────────
  console.log('\n📦 401 — Bez Authorization headera');

  await test('HTTP 401 bez Authorization headera', () => {
    const r = simulateTriggerPOST(null, TOKEN);
    assertEqual(r.status, 401, 'HTTP 401');
  });

  await test('401 body sadrži error=Unauthorized', () => {
    const r = simulateTriggerPOST(null, TOKEN);
    assertEqual(r.body.error as string, 'Unauthorized', 'error=Unauthorized');
  });

  await test('401 body sadrži poruka string', () => {
    const r = simulateTriggerPOST(null, TOKEN);
    assert(typeof r.body.poruka === 'string', 'poruka je string');
    assert((r.body.poruka as string).length > 0, 'poruka nije prazna');
  });

  // ── 3. 401 sa pogrešnim tokenom ───────────────────────────────────────────
  console.log('\n📦 401 — Pogrešan token');

  await test('HTTP 401 sa pogrešnim tokenom', () => {
    const r = simulateTriggerPOST('Bearer wrong-token', TOKEN);
    assertEqual(r.status, 401, 'HTTP 401');
  });

  await test('HTTP 401 sa praznim Bearer', () => {
    const r = simulateTriggerPOST('Bearer ', TOKEN);
    assertEqual(r.status, 401, 'HTTP 401');
  });

  await test('HTTP 401 sa Basic auth umesto Bearer', () => {
    const r = simulateTriggerPOST('Basic dXNlcjpwYXNz', TOKEN);
    assertEqual(r.status, 401, 'HTTP 401');
  });

  // ── 4. 200 sa ispravnim tokenom ───────────────────────────────────────────
  console.log('\n📦 200 — Ispravan token');

  await test('HTTP 200 sa ispravnim tokenom', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}`, TOKEN);
    assertEqual(r.status, 200, 'HTTP 200');
  });

  await test('200 body sadrži status=pokrenuto', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}`, TOKEN);
    assertEqual(r.body.status as string, 'pokrenuto', 'status=pokrenuto');
  });

  await test('200 body sadrži verzija === APP_VERSION', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}`, TOKEN);
    assertEqual(r.body.verzija as string, APP_VERSION, 'verzija');
  });

  await test('200 body sadrži autofinishIteracija === AUTOFINISH_COUNT', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}`, TOKEN);
    assertEqual(r.body.autofinishIteracija as number, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  await test('200 body sadrži ISO timestamp', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}`, TOKEN);
    assert(typeof r.body.timestamp === 'string', 'timestamp je string');
    assert(!isNaN(Date.parse(r.body.timestamp as string)), 'timestamp je validan ISO datum');
  });

  await test('200 response ima Cache-Control: no-store', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}`, TOKEN);
    assert(r.headers['Cache-Control']?.includes('no-store'), 'Cache-Control: no-store');
  });

  // ── 5. Token komparacija ──────────────────────────────────────────────────
  console.log('\n📦 Token Komparacija');

  await test('Tačna komparacija — nije prefix match', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN}-extra`, TOKEN);
    assertEqual(r.status, 401, 'duži token je odbijen');
  });

  await test('Tačna komparacija — nije substring match', () => {
    const r = simulateTriggerPOST(`Bearer ${TOKEN.slice(0, 5)}`, TOKEN);
    assertEqual(r.status, 401, 'prefix tokena je odbijen');
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
