// Panetracija 2 — Status Route Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: GET /api/panetracija-2/status

import { NextRequest } from 'next/server';
import { GET as getStatus } from '../../app/api/panetracija-2/status/route';
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
  console.log('\n🎯 GET /api/panetracija-2/status — Test Suite\n');

  await test('vraća HTTP 200', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.1' },
    }));
    const res = await getStatus(req);
    assert(res.status >= 200 && res.status < 300, `Neočekivan status: ${res.status}`);
  });

  await test('status === "ok"', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.2' },
    }));
    const res = await getStatus(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
  });

  await test('verzija === APP_VERSION', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.3' },
    }));
    const res = await getStatus(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
  });

  await test('overallScore je broj 0–100', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.4' },
    }));
    const res = await getStatus(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const score = body['overallScore'] as number;
    assert(typeof score === 'number', 'overallScore mora biti broj');
    assert(score >= 0 && score <= 100, `overallScore ${score} van opsega 0–100`);
  });

  await test('ukupnoNalaza > 0', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.5' },
    }));
    const res = await getStatus(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const ukupno = body['ukupnoNalaza'] as number;
    assert(typeof ukupno === 'number' && ukupno > 0, `ukupnoNalaza mora biti > 0, dobijen: ${ukupno}`);
  });

  await test('openNalaza >= 0', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.6' },
    }));
    const res = await getStatus(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const open = body['openNalaza'] as number;
    assert(typeof open === 'number' && open >= 0, `openNalaza mora biti >= 0, dobijen: ${open}`);
  });

  await test('timestamp je validan ISO string', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.7' },
    }));
    const res = await getStatus(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(!isNaN(Date.parse(body['timestamp'] as string)), 'timestamp mora biti validan ISO');
  });

  await test('Content-Type je application/json', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.1.2.8' },
    }));
    const res = await getStatus(req);
    const ct = res.headers.get('content-type') ?? '';
    assert(ct.includes('application/json'), `Content-Type mora biti JSON, dobijen: ${ct}`);
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
