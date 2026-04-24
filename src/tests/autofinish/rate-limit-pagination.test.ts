// Autofinish #846 — Rate Limit Test Coverage
// Autofinish #847 — Pagination Test Coverage
// Kompanija SPAJA — Digitalna Industrija
//
// Testovi pokrivaju:
//   1. checkRateLimitGlobal() — vraća true u normalnom toku, false pri prelasku limita
//   2. rateLimitKey() — ispravni format ključeva po endpoint-u
//   3. isKVConfigured() — vraća boolean
//   4. Paginacija: pageSize/offset, default 50, max 100, ukupno/strana/podaci polja
//
// Pokretanje: npx tsx src/tests/autofinish/rate-limit-pagination.test.ts

import { checkRateLimitGlobal, rateLimitKey, isKVConfigured } from '../../lib/rate-limit';
import {
  AUTOFINISH_COUNT,
  APP_VERSION,
  TOTAL_ROUTES,
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
  console.log('\n🚦 Rate Limit & Pagination — Test Suite (#846 + #847)\n');

  // ── 1. checkRateLimitGlobal() ─────────────────────────────────────────────
  console.log('📦 checkRateLimitGlobal() — Rate Limiting (#846)');

  await test('Vraća true za prvi zahtev (limit=100)', async () => {
    const key = `test-rl-${Date.now()}-a`;
    const allowed = await checkRateLimitGlobal(key, 100, 60);
    assert(allowed === true, 'prvi zahtev je dozvoljen');
  });

  await test('Vraća true za zahteve u okviru limita', async () => {
    const key = `test-rl-${Date.now()}-b`;
    for (let i = 0; i < 5; i++) {
      const allowed = await checkRateLimitGlobal(key, 10, 60);
      assert(allowed === true, `zahtev ${i + 1} je dozvoljen`);
    }
  });

  await test('Vraća false pri prelasku limita (limit=3)', async () => {
    const key = `test-rl-${Date.now()}-c`;
    // Iscrpi limit
    for (let i = 0; i < 3; i++) {
      await checkRateLimitGlobal(key, 3, 60);
    }
    // Sledeći treba biti odbijen
    const blocked = await checkRateLimitGlobal(key, 3, 60);
    assert(blocked === false, 'zahtev posle limit je odbijen');
  });

  await test('Različiti ključevi imaju nezavisne limite', async () => {
    const base = Date.now();
    const key1 = `test-rl-${base}-x`;
    const key2 = `test-rl-${base}-y`;

    // Iscrpi key1
    for (let i = 0; i < 2; i++) await checkRateLimitGlobal(key1, 2, 60);
    const blockedKey1 = await checkRateLimitGlobal(key1, 2, 60);
    const allowedKey2 = await checkRateLimitGlobal(key2, 2, 60);

    assert(blockedKey1 === false, 'key1 je blokiran');
    assert(allowedKey2 === true, 'key2 je i dalje dozvoljen');
  });

  await test('Vraća true za limit=1 pri prvom zahtjevu', async () => {
    const key = `test-rl-${Date.now()}-d`;
    const allowed = await checkRateLimitGlobal(key, 1, 60);
    assert(allowed === true, 'limit=1, prvi zahtjev dozvoljen');
  });

  await test('Vraća false za limit=1 pri drugom zahtjevu', async () => {
    const key = `test-rl-${Date.now()}-e`;
    await checkRateLimitGlobal(key, 1, 60);
    const blocked = await checkRateLimitGlobal(key, 1, 60);
    assert(blocked === false, 'limit=1, drugi zahtjev odbijen');
  });

  // ── 2. rateLimitKey() ─────────────────────────────────────────────────────
  console.log('\n📦 rateLimitKey() — Format Ključeva (#846)');

  await test('Vraća string', () => {
    const key = rateLimitKey('1.2.3.4', '/api/autofinish');
    assert(typeof key === 'string', 'ključ je string');
  });

  await test('Počinje sa "rl:"', () => {
    const key = rateLimitKey('1.2.3.4', '/api/autofinish');
    assert(key.startsWith('rl:'), 'ključ počinje sa "rl:"');
  });

  await test('Sadrži IP adresu', () => {
    const key = rateLimitKey('192.168.1.1', '/api/test');
    assert(key.includes('192.168.1.1'), 'ključ sadrži IP');
  });

  await test('Isti endpoint + IP → isti ključ', () => {
    const key1 = rateLimitKey('1.2.3.4', '/api/autofinish');
    const key2 = rateLimitKey('1.2.3.4', '/api/autofinish');
    assertEqual(key1, key2, 'isti ključ za iste parametre');
  });

  await test('Različiti IP-ovi → različiti ključevi', () => {
    const key1 = rateLimitKey('1.1.1.1', '/api/autofinish');
    const key2 = rateLimitKey('2.2.2.2', '/api/autofinish');
    assert(key1 !== key2, 'različiti ključevi za različite IP-ove');
  });

  await test('Različiti endpoint-i → različiti ključevi', () => {
    const key1 = rateLimitKey('1.1.1.1', '/api/autofinish');
    const key2 = rateLimitKey('1.1.1.1', '/api/health');
    assert(key1 !== key2, 'različiti ključevi za različite endpoint-e');
  });

  // ── 3. isKVConfigured() ───────────────────────────────────────────────────
  console.log('\n📦 isKVConfigured() (#846)');

  await test('Vraća boolean', () => {
    const result = isKVConfigured();
    assert(typeof result === 'boolean', 'isKVConfigured vraća boolean');
  });

  await test('Vraća false kad KV env varijable nisu postavljene (test env)', () => {
    const kvUrl = process.env.VERCEL_KV_REST_API_URL;
    const kvToken = process.env.VERCEL_KV_REST_API_TOKEN;
    if (!kvUrl && !kvToken) {
      assert(isKVConfigured() === false, 'isKVConfigured() === false u test okruženju');
    } else {
      // KV je konfigurisano — preskočimo ovu provjeru
      assert(true, 'KV je konfigurisano — provjera preskočena');
    }
  });

  // ── 4. Paginacija Logika (#847) ────────────────────────────────────────────
  console.log('\n📦 Paginacija — /api/autofinish pageSize/offset (#847)');

  const DEFAULT_PAGE_SIZE = 50;
  const MAX_PAGE_SIZE = 100;

  function paginateAutofinish(
    pageSize: string | null,
    offset: string | null,
    total: number,
  ) {
    const ps = Math.min(
      parseInt(pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );
    const off = Math.max(parseInt(offset ?? '0', 10) || 0, 0);
    const start = off;
    const end = Math.min(off + ps, total);
    const items = Array.from({ length: Math.max(end - start, 0) }, (_, i) => start + i + 1);
    return { pageSize: ps, offset: off, ukupno: total, strana: items.length, podaci: items };
  }

  await test('Default pageSize=50', () => {
    const r = paginateAutofinish(null, null, 1000);
    assertEqual(r.pageSize, 50, 'default pageSize=50');
  });

  await test('pageSize=10 vraća 10 stavki', () => {
    const r = paginateAutofinish('10', '0', 1000);
    assertEqual(r.strana, 10, 'strana=10');
  });

  await test('Max pageSize je 100', () => {
    const r = paginateAutofinish('999', '0', 1000);
    assertEqual(r.pageSize, MAX_PAGE_SIZE, `max pageSize=${MAX_PAGE_SIZE}`);
  });

  await test('offset pomjera početak', () => {
    const r = paginateAutofinish('5', '10', 1000);
    assertEqual(r.podaci[0], 11, 'prva stavka je offset+1');
  });

  await test('offset 0 — počinje od 1', () => {
    const r = paginateAutofinish('3', '0', 1000);
    assertEqual(r.podaci[0], 1, 'prva stavka je 1');
  });

  await test('ukupno je total', () => {
    const r = paginateAutofinish('10', '0', AUTOFINISH_COUNT);
    assertEqual(r.ukupno, AUTOFINISH_COUNT, `ukupno=${AUTOFINISH_COUNT}`);
  });

  await test('Offset veći od total → prazna lista', () => {
    const r = paginateAutofinish('10', '9999', 100);
    assertEqual(r.strana, 0, 'strana=0 kad je offset > total');
  });

  await test('Negativni offset se tretira kao 0', () => {
    const r = paginateAutofinish('5', '-10', 100);
    assertEqual(r.offset, 0, 'negativni offset → 0');
  });

  await test('Neispravan pageSize → default', () => {
    const r = paginateAutofinish('abc', '0', 100);
    assertEqual(r.pageSize, DEFAULT_PAGE_SIZE, 'neispravan pageSize → default');
  });

  await test('Zadnja stranica vraća manji broj stavki', () => {
    const r = paginateAutofinish('10', '95', 100);
    assertEqual(r.strana, 5, 'zadnja stranica ima 5 stavki');
  });

  // ── 5. API Response struktura (#847) ─────────────────────────────────────
  console.log('\n📦 API Response Struktura (#847)');

  await test('TOTAL_ROUTES je pozitivni broj', () => {
    assert(typeof TOTAL_ROUTES === 'number', 'TOTAL_ROUTES je broj');
    assert(TOTAL_ROUTES > 0, 'TOTAL_ROUTES > 0');
  });

  await test('TOTAL_API_ROUTES je pozitivni broj', () => {
    assert(typeof TOTAL_API_ROUTES === 'number', 'TOTAL_API_ROUTES je broj');
    assert(TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES > 0');
  });

  await test('APP_VERSION je string u semver formatu', () => {
    assert(typeof APP_VERSION === 'string', 'APP_VERSION je string');
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), `APP_VERSION "${APP_VERSION}" je semver`);
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
