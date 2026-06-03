// Panetracija 2 — Trendovi Route Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: GET /api/panetracija-2/trendovi (query param ?n=1..10)

import { NextRequest } from 'next/server';
import { GET as getTrendovi } from '../../app/api/panetracija-2/trendovi/route';
import { APP_VERSION } from '../../lib/constants';

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
    console.error(`  ❌ ${name}\n     ${msg}`);
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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

const _lintUseHelpers = [assertEqual, isObject];
void _lintUseHelpers;

async function runTests(): Promise<void> {
  console.log('\n🎯 GET /api/panetracija-2/trendovi — Test Suite\n');

  // ─── Bazni zahtjev ────────────────────────────────────────────────────────
  await test('bez ?n — vraća HTTP 200', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.1' },
    }));
    const res = await getTrendovi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
  });

  await test('bez ?n — status === "ok"', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.2' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
  });

  await test('bez ?n — trendovi je niz', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.3' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(Array.isArray(body['trendovi']), 'trendovi mora biti niz');
  });

  await test('bez ?n — n je broj', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.4' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['n'] === 'number', `n mora biti broj, dobijen: ${typeof body['n']}`);
  });

  await test('bez ?n — verzija === APP_VERSION', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.5' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    if (body['verzija'] !== undefined) {
      assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    }
  });

  await test('trendovi unosi imaju overallScore 0–100', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.6' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const trendovi = body['trendovi'] as Array<Record<string, unknown>>;
    for (const t of trendovi) {
      const score = t['overallScore'] as number;
      assert(typeof score === 'number', 'overallScore mora biti broj');
      assert(score >= 0 && score <= 100, `overallScore ${score} van opsega 0–100`);
    }
  });

  await test('trendovi unosi imaju delta polje', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.1.7' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const trendovi = body['trendovi'] as Array<Record<string, unknown>>;
    for (const t of trendovi) {
      assert('delta' in t, 'svaki trend mora imati delta polje');
      assert(typeof t['delta'] === 'number', 'delta mora biti broj');
    }
  });

  // ─── Query param ?n ───────────────────────────────────────────────────────
  await test('?n=5 — n === 5', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=5', {
      headers: { 'x-forwarded-for': '127.6.2.1' },
    }));
    const res = await getTrendovi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['n'] as number, 5, 'n');
  });

  await test('?n=1 — n === 1', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=1', {
      headers: { 'x-forwarded-for': '127.6.2.2' },
    }));
    const res = await getTrendovi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['n'] as number, 1, 'n');
  });

  await test('?n=10 — n === 10', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=10', {
      headers: { 'x-forwarded-for': '127.6.2.3' },
    }));
    const res = await getTrendovi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['n'] as number, 10, 'n');
  });

  // ─── Validacija neispravnih ?n parametara ─────────────────────────────────
  await test('?n=0 — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=0', {
      headers: { 'x-forwarded-for': '127.6.3.1' },
    }));
    const res = await getTrendovi(req);
    assertEqual(res.status, 400, 'mora biti 400 za n=0');
  });

  await test('?n=11 — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=11', {
      headers: { 'x-forwarded-for': '127.6.3.2' },
    }));
    const res = await getTrendovi(req);
    assertEqual(res.status, 400, 'mora biti 400 za n=11');
  });

  await test('?n=99 — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=99', {
      headers: { 'x-forwarded-for': '127.6.3.3' },
    }));
    const res = await getTrendovi(req);
    assertEqual(res.status, 400, 'mora biti 400 za n=99');
  });

  await test('?n=invalid — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=invalid', {
      headers: { 'x-forwarded-for': '127.6.3.4' },
    }));
    const res = await getTrendovi(req);
    assertEqual(res.status, 400, 'mora biti 400 za n=invalid');
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['greska'] === 'string', 'greska poruka mora biti string');
  });

  await test('?n=-1 — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=-1', {
      headers: { 'x-forwarded-for': '127.6.3.5' },
    }));
    const res = await getTrendovi(req);
    assertEqual(res.status, 400, 'mora biti 400 za n=-1');
  });

  await test('Content-Type je application/json', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.4.1' },
    }));
    const res = await getTrendovi(req);
    const ct = res.headers.get('content-type') ?? '';
    assert(ct.includes('application/json'), `Content-Type mora biti JSON, dobijen: ${ct}`);
  });

  await test('timestamp je validan ISO string', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.6.4.2' },
    }));
    const res = await getTrendovi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(!isNaN(Date.parse(body['timestamp'] as string)), 'timestamp mora biti validan ISO');
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
