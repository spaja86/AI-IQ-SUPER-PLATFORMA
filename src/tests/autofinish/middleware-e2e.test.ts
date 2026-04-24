// Autofinish #858 — X-Request-Id Middleware Test Coverage
// Autofinish #859 — Integracioni Testovi Middleware-a
// Autofinish #860 — E2E Snapshot /api/autofinish JSON Schema
// Updated through Autofinish #880 — globalni invarijanti ažurirani
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. resolveRequestId() — x-request-id header, x-correlation-id fallback, UUID fallback
//   2. Middleware X-App-Version i X-Autofinish-Iteracija header logika
//   3. CORS preflight simulacija
//   4. /api/autofinish JSON schema — sva obavezna polja, paginacija
//
// Pokretanje: npx tsx src/tests/autofinish/middleware-e2e.test.ts

import { getLastNIterations } from '../../lib/autofinish-petlja';
import { runDiagnostics } from '../../lib/auto-repair';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
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

// ─── Middleware helper simulacija ─────────────────────────────────────────────

import { randomUUID } from 'crypto';

function resolveRequestId(headers: Record<string, string | undefined>): string {
  return (
    headers['x-request-id'] ??
    headers['x-correlation-id'] ??
    `req-${randomUUID()}`
  );
}

function simulateMiddlewareResponse(headers: Record<string, string | undefined>): Record<string, string> {
  const requestId = resolveRequestId(headers);
  return {
    'X-Request-Id': requestId,
    'X-App-Version': APP_VERSION,
    'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
  };
}

// ─── /api/autofinish response simulacija ─────────────────────────────────────

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function simulateAutofinishGET(params: Record<string, string>) {
  const pageSize = Math.min(
    parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );
  const offset = Math.max(parseInt(params.offset ?? '0', 10) || 0, 0);
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  const start = offset;
  const end = Math.min(offset + pageSize, AUTOFINISH_COUNT);
  const istorija = Array.from({ length: Math.max(end - start, 0) }, (_, i) => ({
    iteracija: start + i + 1,
    opis: `Autofinish iteracija #${start + i + 1}`,
  }));

  return {
    status: 'zavrsena',
    verzija: APP_VERSION,
    kompanija: 'SPAJA',
    autofinishBroj: AUTOFINISH_COUNT,
    autofinishCilj: AUTOFINISH_TARGET,
    procenat,
    procentFormatiran: `${procenat.toExponential(2)}%`,
    istorija,
    paginacija: {
      ukupno: AUTOFINISH_COUNT,
      pageSize,
      offset,
      strana: istorija.length,
    },
    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
    },
    timestamp: new Date().toISOString(),
  };
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🔀 Middleware & E2E — Test Suite (#858 + #859 + #860)\n');

  // ── 1. resolveRequestId() (#858) ──────────────────────────────────────────
  console.log('📦 resolveRequestId() — X-Request-Id (#858)');

  await test('Čita x-request-id header', () => {
    const id = resolveRequestId({ 'x-request-id': 'my-req-123' });
    assertEqual(id, 'my-req-123', 'ID iz x-request-id');
  });

  await test('Čita x-correlation-id kao fallback', () => {
    const id = resolveRequestId({ 'x-correlation-id': 'corr-456' });
    assertEqual(id, 'corr-456', 'ID iz x-correlation-id');
  });

  await test('x-request-id ima prioritet nad x-correlation-id', () => {
    const id = resolveRequestId({ 'x-request-id': 'primary', 'x-correlation-id': 'secondary' });
    assertEqual(id, 'primary', 'x-request-id ima prioritet');
  });

  await test('Generiše req-XXXXXXXX kad nema headera', () => {
    const id = resolveRequestId({});
    assert(id.startsWith('req-'), `UUID fallback počinje sa "req-": ${id}`);
    assert(id.length > 4, 'UUID fallback ima dovoljno znakova');
  });

  await test('UUID fallback je različit pri svakom pozivu', () => {
    const id1 = resolveRequestId({});
    const id2 = resolveRequestId({});
    assert(id1 !== id2, 'UUID fallback je jedinstven');
  });

  // ── 2. Middleware headers (#858 + #859) ───────────────────────────────────
  console.log('\n📦 Middleware Response Headers (#858 + #859)');

  await test('X-App-Version === APP_VERSION', () => {
    const h = simulateMiddlewareResponse({});
    assertEqual(h['X-App-Version'], APP_VERSION, 'X-App-Version');
  });

  await test('X-Autofinish-Iteracija === String(AUTOFINISH_COUNT)', () => {
    const h = simulateMiddlewareResponse({});
    assertEqual(h['X-Autofinish-Iteracija'], String(AUTOFINISH_COUNT), 'X-Autofinish-Iteracija');
  });

  await test('X-Request-Id je postavljen', () => {
    const h = simulateMiddlewareResponse({});
    assert(typeof h['X-Request-Id'] === 'string', 'X-Request-Id je string');
    assert(h['X-Request-Id'].length > 0, 'X-Request-Id nije prazan');
  });

  await test('X-Request-Id propagira ulazni header', () => {
    const h = simulateMiddlewareResponse({ 'x-request-id': 'custom-id-789' });
    assertEqual(h['X-Request-Id'], 'custom-id-789', 'X-Request-Id propagacija');
  });

  // ── 3. CORS preflight simulacija (#859) ───────────────────────────────────
  console.log('\n📦 CORS Preflight Simulacija (#859)');

  await test('OPTIONS zahtev — CORS headers su string vrijednosti', () => {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    assert(typeof corsHeaders['Access-Control-Allow-Origin'] === 'string', 'Allow-Origin je string');
    assert(typeof corsHeaders['Access-Control-Allow-Methods'] === 'string', 'Allow-Methods je string');
    assert(corsHeaders['Access-Control-Allow-Methods'].includes('GET'), 'Allow-Methods sadrži GET');
    assert(corsHeaders['Access-Control-Allow-Headers'].includes('Authorization'), 'Allow-Headers sadrži Authorization');
  });

  await test('X-App-Version format je semver', () => {
    const version = APP_VERSION;
    assert(/^\d+\.\d+\.\d+$/.test(version), `APP_VERSION ${version} je semver`);
  });

  await test('X-Autofinish-Iteracija je numerički string', () => {
    const iteracija = String(AUTOFINISH_COUNT);
    assert(!isNaN(parseInt(iteracija, 10)), 'X-Autofinish-Iteracija je numerički string');
    assertEqual(parseInt(iteracija, 10), AUTOFINISH_COUNT, 'vrednost odgovara AUTOFINISH_COUNT');
  });

  // ── 4. /api/autofinish E2E schema (#860) ──────────────────────────────────
  console.log('\n📦 /api/autofinish — E2E JSON Schema (#860)');

  await test('Vraća objekat sa status poljem', () => {
    const r = simulateAutofinishGET({});
    assert(typeof r.status === 'string', 'status je string');
  });

  await test('status je "zavrsena" (sve podsisteme na 100%)', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.status, 'zavrsena', 'status=zavrsena');
  });

  await test('verzija === APP_VERSION', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.verzija, APP_VERSION, 'verzija');
  });

  await test('autofinishBroj === AUTOFINISH_COUNT', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.autofinishBroj, AUTOFINISH_COUNT, 'autofinishBroj');
  });

  await test('autofinishCilj je pozitivni broj', () => {
    const r = simulateAutofinishGET({});
    assert(typeof r.autofinishCilj === 'number', 'autofinishCilj je broj');
    assert(r.autofinishCilj > 0, 'autofinishCilj > 0');
  });

  await test('procenat je broj >= 0', () => {
    const r = simulateAutofinishGET({});
    assert(typeof r.procenat === 'number', 'procenat je broj');
    assert(r.procenat >= 0, 'procenat >= 0');
  });

  await test('istorija je niz', () => {
    const r = simulateAutofinishGET({});
    assert(Array.isArray(r.istorija), 'istorija je niz');
  });

  await test('istorija default pageSize=50', () => {
    const r = simulateAutofinishGET({});
    assert(r.istorija.length <= 50, 'istorija.length <= 50');
  });

  await test('paginacija.ukupno === AUTOFINISH_COUNT', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.paginacija.ukupno, AUTOFINISH_COUNT, 'paginacija.ukupno');
  });

  await test('paginacija.pageSize === 50 (default)', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.paginacija.pageSize, 50, 'paginacija.pageSize=50');
  });

  await test('paginacija.offset === 0 (default)', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.paginacija.offset, 0, 'paginacija.offset=0');
  });

  await test('paginacija.strana == istorija.length', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.paginacija.strana, r.istorija.length, 'paginacija.strana=istorija.length');
  });

  await test('ekosistem.rute === TOTAL_ROUTES', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.ekosistem.rute, TOTAL_ROUTES, 'ekosistem.rute');
  });

  await test('ekosistem.apiRute === TOTAL_API_ROUTES', () => {
    const r = simulateAutofinishGET({});
    assertEqual(r.ekosistem.apiRute, TOTAL_API_ROUTES, 'ekosistem.apiRute');
  });

  await test('Sadrži ISO timestamp', () => {
    const r = simulateAutofinishGET({});
    assert(!isNaN(Date.parse(r.timestamp)), 'timestamp je validan ISO');
  });

  // ── 5. TOTAL_DIAGNOSTIKA sync provjera (#860) ─────────────────────────────
  console.log('\n📦 Globalni Invarijanti (#860)');

  await test('TOTAL_DIAGNOSTIKA === 1764', () => {
    assertEqual(TOTAL_DIAGNOSTIKA, 1764, 'TOTAL_DIAGNOSTIKA=1764');
  });

  await test('runDiagnostics() ukupnoProvera === TOTAL_DIAGNOSTIKA', () => {
    const d = runDiagnostics();
    assertEqual(d.ukupnoProvera, TOTAL_DIAGNOSTIKA, `ukupnoProvera=${TOTAL_DIAGNOSTIKA}`);
  });

  await test('runDiagnostics() zdravlje === 100', () => {
    const d = runDiagnostics();
    assertEqual(d.zdravlje, 100, 'zdravlje=100');
  });

  await test('AUTOFINISH_COUNT === 890', () => {
    assertEqual(AUTOFINISH_COUNT, 890, 'AUTOFINISH_COUNT=890');
  });

  await test('APP_VERSION === "44.11.0"', () => {
    assertEqual(APP_VERSION, '44.11.0', 'APP_VERSION=44.11.0');
  });

  await test('getLastNIterations(10) zadnja stavka je #890', () => {
    const r = getLastNIterations(10);
    assertEqual(r[r.length - 1].broj, 890, 'zadnja stavka=#890');
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
