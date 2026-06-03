// Panetracija 2 — Istorija Route Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: GET /api/panetracija-2/istorija

import { NextRequest } from 'next/server';
import { GET as getIstorija } from '../../app/api/panetracija-2/istorija/route';
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

async function runTests(): Promise<void> {
  console.log('\n🎯 GET /api/panetracija-2/istorija — Test Suite\n');

  // Pokretanje sken sesije kako bi istorija imala bar jedan unos
  await postSken(
    new NextRequest(new Request('http://localhost/api/panetracija-2/sken', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.5.0.1' },
    })),
  );

  await test('vraća HTTP 200', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.1' },
    }));
    const res = await getIstorija(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
  });

  await test('status === "ok"', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.2' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
  });

  await test('istorija je niz', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.3' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(Array.isArray(body['istorija']), 'istorija mora biti niz');
  });

  await test('ukupno je broj', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.4' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['ukupno'] === 'number', `ukupno mora biti broj, dobijen: ${typeof body['ukupno']}`);
  });

  await test('ukupno === istorija.length', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.5' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const ukupno = body['ukupno'] as number;
    const istorija = body['istorija'] as unknown[];
    assertEqual(ukupno, istorija.length, 'ukupno mora biti jednako dužini istorija niza');
  });

  await test('verzija === APP_VERSION', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.6' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    if (body['verzija'] !== undefined) {
      assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    }
  });

  await test('istorija ima max 10 unosa', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.7' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const istorija = body['istorija'] as unknown[];
    assert(istorija.length <= 10, `istorija mora imati max 10 unosa, dobijen: ${istorija.length}`);
  });

  await test('svaki unos u istoriji ima scanId, startedAt, status', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.8' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const istorija = body['istorija'] as Array<Record<string, unknown>>;
    const validStatusi = ['pending', 'running', 'completed', 'failed'];
    for (const s of istorija) {
      assert(typeof s['scanId'] === 'string', 'scanId mora biti string');
      assert(typeof s['startedAt'] === 'string', 'startedAt mora biti string');
      assert(validStatusi.includes(s['status'] as string), `status nevalidan: ${s['status']}`);
    }
  });

  await test('timestamp je validan ISO', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.1.9' },
    }));
    const res = await getIstorija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(!isNaN(Date.parse(body['timestamp'] as string)), 'timestamp mora biti validan ISO');
  });

  await test('Content-Type je application/json', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.5.2.1' },
    }));
    const res = await getIstorija(req);
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
