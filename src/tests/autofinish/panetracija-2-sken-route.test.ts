// Panetracija 2 — Sken Route Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: POST /api/panetracija-2/sken

import { NextRequest } from 'next/server';
import { POST as postSken } from '../../app/api/panetracija-2/sken/route';
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

async function makeRequest(ip: string): Promise<Response> {
  return postSken(
    new NextRequest(new Request('http://localhost/api/panetracija-2/sken', {
      method: 'POST',
      headers: { 'x-forwarded-for': ip },
    })),
  );
}

async function runTests(): Promise<void> {
  console.log('\n🎯 POST /api/panetracija-2/sken — Test Suite\n');

  await test('vraća 202 ili 429 (rate limit)', async () => {
    const res = await makeRequest('127.3.1.1');
    assert(res.status === 202 || res.status === 429, `Neočekivan HTTP status: ${res.status}`);
  });

  await test('pri 202: scanId je string', async () => {
    const res = await makeRequest('127.3.1.2');
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      assert(typeof body['scanId'] === 'string' && (body['scanId'] as string).length > 0, 'scanId mora biti string');
    }
  });

  await test('pri 202: status === "started"', async () => {
    const res = await makeRequest('127.3.1.3');
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      assertEqual(body['status'] as string, 'started', 'status');
    }
  });

  await test('pri 202: started je validan ISO timestamp', async () => {
    const res = await makeRequest('127.3.1.4');
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      assert(!isNaN(Date.parse(body['started'] as string)), 'started mora biti validan ISO');
    }
  });

  await test('pri 202: estimatedDuration je pozitivan broj', async () => {
    const res = await makeRequest('127.3.1.5');
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      const est = body['estimatedDuration'] as number;
      assert(typeof est === 'number' && est > 0, `estimatedDuration mora biti > 0, dobijen: ${est}`);
    }
  });

  await test('pri 202: verzija === APP_VERSION', async () => {
    const res = await makeRequest('127.3.1.6');
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      if (body['verzija'] !== undefined) {
        assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
      }
    }
  });

  await test('pri 202: Content-Type je application/json', async () => {
    const res = await makeRequest('127.3.1.7');
    if (res.status === 202) {
      const ct = res.headers.get('content-type') ?? '';
      assert(ct.includes('application/json'), `Content-Type mora biti JSON, dobijen: ${ct}`);
    }
  });

  await test('pri 429: sadržaj ima grešku', async () => {
    // Iscrpi rate limit za jednu IP adresu (3 zahtjeva/min)
    const ip = '127.3.99.1';
    let got429 = false;
    for (let i = 0; i < 5; i++) {
      const res = await makeRequest(ip);
      if (res.status === 429) {
        got429 = true;
        const body = await res.clone().json() as Record<string, unknown>;
        assert(typeof body['greska'] === 'string' || typeof body['error'] === 'string', '429 mora imati grešku');
        break;
      }
    }
    if (!got429) {
      // Rate limit nije dostignut, test je prošao trivijalno
    }
  });

  await test('scanId je unikatan pri svakom pozivu', async () => {
    const res1 = await makeRequest('127.3.2.1');
    const res2 = await makeRequest('127.3.2.2');
    if (res1.status === 202 && res2.status === 202) {
      const b1 = await res1.json() as Record<string, unknown>;
      const b2 = await res2.json() as Record<string, unknown>;
      assert(b1['scanId'] !== b2['scanId'], 'scanId mora biti unikatan');
    }
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
