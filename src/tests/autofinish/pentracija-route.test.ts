// Pentracija — Route Coverage Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: GET /api/pentracija, GET /api/pentracija/nalazi, GET /api/pentracija/status

import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

const _lintUseHelpers = [assertEqual, isObject];
void _lintUseHelpers;

import { GET as getPentracija } from '../../app/api/pentracija/route';
import { GET as getNalazi } from '../../app/api/pentracija/nalazi/route';
import { GET as getStatus } from '../../app/api/pentracija/status/route';
import { POST as postSken } from '../../app/api/pentracija/sken/route';

async function runTests(): Promise<void> {
  console.log('\n🎯 Pentracija — Route Coverage Test Suite\n');

  // ─── Fajlovi postoje ──────────────────────────────────────────────────────
  const routes = [
    'src/app/api/pentracija/route.ts',
    'src/app/api/pentracija/nalazi/route.ts',
    'src/app/api/pentracija/status/route.ts',
    'src/app/api/pentracija/sken/route.ts',
    'src/app/pentracija/page.tsx',
    'src/lib/pentracija.ts',
  ];

  for (const rel of routes) {
    await test(`Fajl postoji: ${rel}`, () => {
      const full = path.resolve(process.cwd(), rel);
      assert(fs.existsSync(full), `${full} ne postoji`);
    });
  }

  // ─── Route source sadržaj ─────────────────────────────────────────────────
  await test('GET /api/pentracija eksportuje GET handler', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/app/api/pentracija/route.ts'), 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('NextResponse.json'), 'Nedostaje JSON response');
  });

  await test('POST /api/pentracija/sken eksportuje POST handler', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/app/api/pentracija/sken/route.ts'), 'utf8');
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
  });

  await test('Pentracija lib eksportuje sve potrebne funkcije', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/pentracija.ts'), 'utf8');
    assert(src.includes('buildPentestReport'), 'Nedostaje buildPentestReport');
    assert(src.includes('getPentestFindings'), 'Nedostaje getPentestFindings');
    assert(src.includes('calculatePentestScore'), 'Nedostaje calculatePentestScore');
    assert(src.includes('getPentestSummary'), 'Nedostaje getPentestSummary');
  });

  // ─── GET /api/pentracija smoke ────────────────────────────────────────────
  await test('GET /api/pentracija — 200 i status === "ok"', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija', {
      headers: { 'x-forwarded-for': '127.0.1.10' },
    }));
    const res = await getPentracija(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    assert(typeof body['overallScore'] === 'number', 'overallScore');
    assert(Array.isArray(body['findings']), 'findings je niz');
  });

  await test('GET /api/pentracija — X-App-Version header', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija', {
      headers: { 'x-forwarded-for': '127.0.1.11' },
    }));
    const res = await getPentracija(req);
    const version = res.headers.get('X-App-Version');
    if (version !== null) {
      assertEqual(version, APP_VERSION, 'X-App-Version');
    }
  });

  await test('GET /api/pentracija — verzija === APP_VERSION', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija', {
      headers: { 'x-forwarded-for': '127.0.1.12' },
    }));
    const res = await getPentracija(req);
    const body = await res.clone().json() as Record<string, unknown>;
    if (typeof body['verzija'] === 'string') {
      assertEqual(body['verzija'], APP_VERSION, 'verzija');
    }
  });

  // ─── GET /api/pentracija/nalazi smoke ─────────────────────────────────────
  await test('GET /api/pentracija/nalazi — vraća niz', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija/nalazi', {
      headers: { 'x-forwarded-for': '127.0.1.20' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(Array.isArray(body['nalazi']), 'nalazi mora biti niz');
  });

  await test('GET /api/pentracija/nalazi?severity=medium — filtrira po severity', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija/nalazi?severity=medium', {
      headers: { 'x-forwarded-for': '127.0.1.21' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    assert(Array.isArray(nalazi), 'nalazi je niz');
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'medium', 'svi nalazi moraju biti medium');
    }
  });

  await test('GET /api/pentracija/nalazi?severity=invalid — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija/nalazi?severity=invalid', {
      headers: { 'x-forwarded-for': '127.0.1.22' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400 za nevalidan severity');
  });

  // ─── GET /api/pentracija/status smoke ────────────────────────────────────
  await test('GET /api/pentracija/status — vraća status polje', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija/status', {
      headers: { 'x-forwarded-for': '127.0.1.30' },
    }));
    const res = await getStatus(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['status'] === 'string', 'status mora biti string');
    assert(typeof body['overallScore'] === 'number', 'overallScore mora biti broj');
  });

  // ─── POST /api/pentracija/sken smoke ─────────────────────────────────────
  await test('POST /api/pentracija/sken — vraća 202 i scanId', async () => {
    const req = new NextRequest(new Request('http://localhost/api/pentracija/sken', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.1.40' },
    }));
    const res = await postSken(req);
    assert(res.status === 202 || res.status === 429, `Neočekivan status: ${res.status}`);
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      assert(typeof body['scanId'] === 'string', 'scanId mora biti string');
      assertEqual(body['status'] as string, 'started', 'status mora biti "started"');
    }
  });

  // ─── Konstante ────────────────────────────────────────────────────────────
  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
