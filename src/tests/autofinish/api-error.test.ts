// Autofinish #842 — Unit Testovi za src/lib/api-error.ts
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. apiError() vraća tačan HTTP status za svaki ApiErrorKod
//   2. Telo odgovora sadrži error/poruka/verzija/autofinishIteracija/timestamp
//   3. Convenience wrappers: apiRateLimited, apiInternalError, apiBadRequest, apiNotFound
//   4. Retry-After header za apiRateLimited
//   5. apiError sa detalji poljem
//
// Pokretanje: npx tsx src/tests/autofinish/api-error.test.ts

import {
  apiError,
  apiBadRequest,
  apiUnauthorized,
  apiForbidden,
  apiNotFound,
  apiRateLimited,
  apiInternalError,
} from '../../lib/api-error';
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

// ─── Helper: dohvat status koda iz NextResponse ───────────────────────────────

function getStatus(response: { status: number }): number {
  return response.status;
}

async function getBody(response: Response): Promise<Record<string, unknown>> {
  return response.json() as Promise<Record<string, unknown>>;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🚨 api-error.ts — Unit Test Suite (#842)\n');

  // ── 1. HTTP status kodovi ─────────────────────────────────────────────────
  console.log('📦 apiError() — HTTP Status Kodovi');

  await test('BAD_REQUEST → HTTP 400', () => {
    const res = apiError('BAD_REQUEST', 'Loš zahtev');
    assertEqual(getStatus(res), 400, 'HTTP 400');
  });

  await test('UNAUTHORIZED → HTTP 401', () => {
    const res = apiError('UNAUTHORIZED', 'Neautorizovan');
    assertEqual(getStatus(res), 401, 'HTTP 401');
  });

  await test('FORBIDDEN → HTTP 403', () => {
    const res = apiError('FORBIDDEN', 'Zabranjen pristup');
    assertEqual(getStatus(res), 403, 'HTTP 403');
  });

  await test('NOT_FOUND → HTTP 404', () => {
    const res = apiError('NOT_FOUND', 'Nije pronađeno');
    assertEqual(getStatus(res), 404, 'HTTP 404');
  });

  await test('METHOD_NOT_ALLOWED → HTTP 405', () => {
    const res = apiError('METHOD_NOT_ALLOWED', 'Metoda nije dozvoljena');
    assertEqual(getStatus(res), 405, 'HTTP 405');
  });

  await test('CONFLICT → HTTP 409', () => {
    const res = apiError('CONFLICT', 'Konflikt');
    assertEqual(getStatus(res), 409, 'HTTP 409');
  });

  await test('TOO_MANY_REQUESTS → HTTP 429', () => {
    const res = apiError('TOO_MANY_REQUESTS', 'Previše zahteva');
    assertEqual(getStatus(res), 429, 'HTTP 429');
  });

  await test('INTERNAL_ERROR → HTTP 500', () => {
    const res = apiError('INTERNAL_ERROR', 'Interna greška');
    assertEqual(getStatus(res), 500, 'HTTP 500');
  });

  await test('SERVICE_UNAVAILABLE → HTTP 503', () => {
    const res = apiError('SERVICE_UNAVAILABLE', 'Servis nedostupan');
    assertEqual(getStatus(res), 503, 'HTTP 503');
  });

  // ── 2. Telo odgovora ──────────────────────────────────────────────────────
  console.log('\n📦 apiError() — Telo Odgovora');

  await test('Sadrži error kod', async () => {
    const res = apiError('NOT_FOUND', 'Test');
    const body = await getBody(res as unknown as Response);
    assertEqual(body.error as string, 'NOT_FOUND', 'error');
  });

  await test('Sadrži poruka string', async () => {
    const res = apiError('NOT_FOUND', 'Moja poruka');
    const body = await getBody(res as unknown as Response);
    assertEqual(body.poruka as string, 'Moja poruka', 'poruka');
  });

  await test('Sadrži verzija === APP_VERSION', async () => {
    const res = apiError('NOT_FOUND', 'Test');
    const body = await getBody(res as unknown as Response);
    assertEqual(body.verzija as string, APP_VERSION, 'verzija');
  });

  await test('Sadrži autofinishIteracija === AUTOFINISH_COUNT', async () => {
    const res = apiError('NOT_FOUND', 'Test');
    const body = await getBody(res as unknown as Response);
    assertEqual(body.autofinishIteracija as number, AUTOFINISH_COUNT, 'autofinishIteracija');
  });

  await test('Sadrži ISO timestamp', async () => {
    const res = apiError('NOT_FOUND', 'Test');
    const body = await getBody(res as unknown as Response);
    assert(typeof body.timestamp === 'string', 'timestamp je string');
    assert(!isNaN(Date.parse(body.timestamp as string)), 'timestamp je validan ISO datum');
  });

  await test('Nema detalji polje kad nije prosleđeno', async () => {
    const res = apiError('NOT_FOUND', 'Test');
    const body = await getBody(res as unknown as Response);
    assert(!('detalji' in body), 'detalji nije u body kad nije prosleđeno');
  });

  await test('Sadrži detalji kad je prosleđeno', async () => {
    const res = apiError('INTERNAL_ERROR', 'Test', { uzrok: 'db' });
    const body = await getBody(res as unknown as Response);
    assert('detalji' in body, 'detalji je u body');
  });

  // ── 3. Convenience wrappers ───────────────────────────────────────────────
  console.log('\n📦 Convenience Wrappers');

  await test('apiBadRequest() vraća HTTP 400', () => {
    const res = apiBadRequest('Loš unos');
    assertEqual(getStatus(res), 400, 'HTTP 400');
  });

  await test('apiUnauthorized() vraća HTTP 401', () => {
    const res = apiUnauthorized();
    assertEqual(getStatus(res), 401, 'HTTP 401');
  });

  await test('apiForbidden() vraća HTTP 403', () => {
    const res = apiForbidden();
    assertEqual(getStatus(res), 403, 'HTTP 403');
  });

  await test('apiNotFound() vraća HTTP 404', () => {
    const res = apiNotFound();
    assertEqual(getStatus(res), 404, 'HTTP 404');
  });

  await test('apiRateLimited() vraća HTTP 429', () => {
    const res = apiRateLimited();
    assertEqual(getStatus(res), 429, 'HTTP 429');
  });

  await test('apiInternalError() vraća HTTP 500', () => {
    const res = apiInternalError();
    assertEqual(getStatus(res), 500, 'HTTP 500');
  });

  await test('apiRateLimited() sa custom retryAfter=30', () => {
    const res = apiRateLimited(30);
    assertEqual(getStatus(res), 429, 'HTTP 429');
    const retryAfter = res.headers.get('Retry-After');
    assertEqual(retryAfter, '30', 'Retry-After: 30');
  });

  await test('apiRateLimited() default retryAfter=60', () => {
    const res = apiRateLimited();
    const retryAfter = res.headers.get('Retry-After');
    assertEqual(retryAfter, '60', 'Retry-After: 60');
  });

  await test('apiRateLimited() poruka sadrži sekunde', async () => {
    const res = apiRateLimited(120);
    const body = await getBody(res as unknown as Response);
    assert((body.poruka as string).includes('120'), 'poruka sadrži 120');
  });

  // ── 4. Custom headers ─────────────────────────────────────────────────────
  console.log('\n📦 apiError() — Custom Headers');

  await test('Prosleđeni header se pojavljuje u odgovoru', () => {
    const res = apiError('TOO_MANY_REQUESTS', 'Test', undefined, { 'Retry-After': '45' });
    const retryAfter = res.headers.get('Retry-After');
    assertEqual(retryAfter, '45', 'Retry-After: 45');
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
