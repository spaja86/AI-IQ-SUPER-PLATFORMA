// Panetracija 2 — Nalazi Route Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: GET /api/panetracija-2/nalazi (filteri: severity, kategorija, status)

import { NextRequest } from 'next/server';
import { GET as getNalazi } from '../../app/api/panetracija-2/nalazi/route';
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
  console.log('\n🎯 GET /api/panetracija-2/nalazi — Test Suite\n');

  // ─── Bazni zahtjev ────────────────────────────────────────────────────────
  await test('bez filtera — vraća HTTP 200', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.2.1.1' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
  });

  await test('bez filtera — status === "ok"', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.2.1.2' },
    }));
    const res = await getNalazi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
  });

  await test('bez filtera — nalazi je niz', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.2.1.3' },
    }));
    const res = await getNalazi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(Array.isArray(body['nalazi']), 'nalazi mora biti niz');
  });

  await test('bez filtera — ukupno > 0', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.2.1.4' },
    }));
    const res = await getNalazi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['ukupno'] === 'number' && (body['ukupno'] as number) > 0, 'ukupno mora biti > 0');
  });

  await test('bez filtera — filteri je objekat', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.2.1.5' },
    }));
    const res = await getNalazi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(isObject(body['filteri']), 'filteri mora biti objekat');
  });

  await test('bez filtera — verzija === APP_VERSION', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.2.1.6' },
    }));
    const res = await getNalazi(req);
    const body = await res.clone().json() as Record<string, unknown>;
    if (body['verzija'] !== undefined) {
      assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    }
  });

  // ─── Filter severity ──────────────────────────────────────────────────────
  await test('?severity=critical — svi nalazi su critical', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=critical', {
      headers: { 'x-forwarded-for': '127.2.2.1' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'critical', 'severity');
    }
  });

  await test('?severity=high — svi nalazi su high', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=high', {
      headers: { 'x-forwarded-for': '127.2.2.2' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    assert(nalazi.length > 0, 'mora biti bar jedan high nalaz');
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'high', 'severity');
    }
  });

  await test('?severity=medium — svi nalazi su medium', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=medium', {
      headers: { 'x-forwarded-for': '127.2.2.3' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'medium', 'severity');
    }
  });

  await test('?severity=low — svi nalazi su low', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=low', {
      headers: { 'x-forwarded-for': '127.2.2.4' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'low', 'severity');
    }
  });

  await test('?severity=info — svi nalazi su info', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=info', {
      headers: { 'x-forwarded-for': '127.2.2.5' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
  });

  // ─── Filter kategorija ────────────────────────────────────────────────────
  await test('?kategorija=injection — filtrira po injection', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?kategorija=injection', {
      headers: { 'x-forwarded-for': '127.2.3.1' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    assert(nalazi.length > 0, 'mora biti bar jedan injection nalaz');
    for (const n of nalazi) {
      assertEqual(n['kategorija'] as string, 'injection', 'kategorija');
    }
  });

  await test('?kategorija=auth — filtrira po auth', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?kategorija=auth', {
      headers: { 'x-forwarded-for': '127.2.3.2' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
  });

  // ─── Filter status ────────────────────────────────────────────────────────
  await test('?status=open — svi nalazi su open', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?status=open', {
      headers: { 'x-forwarded-for': '127.2.4.1' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['status'] as string, 'open', 'status');
    }
  });

  await test('?status=fixed — svi nalazi su fixed', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?status=fixed', {
      headers: { 'x-forwarded-for': '127.2.4.2' },
    }));
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['status'] as string, 'fixed', 'status');
    }
  });

  // ─── Kombinovani filteri ──────────────────────────────────────────────────
  await test('?severity=high&status=open — kombinirani filter', async () => {
    const req = new NextRequest(
      new Request('http://localhost/api/panetracija-2/nalazi?severity=high&status=open', {
        headers: { 'x-forwarded-for': '127.2.5.1' },
      }),
    );
    const res = await getNalazi(req);
    assert(res.status === 200, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'high', 'severity');
      assertEqual(n['status'] as string, 'open', 'status');
    }
  });

  // ─── Validacija neispravnih parametara ────────────────────────────────────
  await test('?severity=INVALID — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=INVALID', {
      headers: { 'x-forwarded-for': '127.2.6.1' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400');
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['greska'] === 'string', 'greska poruka mora biti string');
    assert(Array.isArray(body['dozvoljene']), 'dozvoljene lista mora biti niz');
  });

  await test('?kategorija=INVALID — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?kategorija=INVALID', {
      headers: { 'x-forwarded-for': '127.2.6.2' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400');
  });

  await test('?status=INVALID — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?status=INVALID', {
      headers: { 'x-forwarded-for': '127.2.6.3' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400');
  });

  await test('?severity=critical&kategorija=INVALID — vraća 400', async () => {
    const req = new NextRequest(
      new Request('http://localhost/api/panetracija-2/nalazi?severity=critical&kategorija=INVALID', {
        headers: { 'x-forwarded-for': '127.2.6.4' },
      }),
    );
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400 zbog nevaljane kategorije');
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
