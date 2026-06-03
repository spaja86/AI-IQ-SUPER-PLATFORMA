// Panetracija 2 — Route Coverage Test
// Kompanija SPAJA — Digitalna Industrija
//
// Testira: GET /api/panetracija-2, GET /api/panetracija-2/status,
//          GET /api/panetracija-2/nalazi, POST /api/panetracija-2/sken,
//          GET /api/panetracija-2/istorija, GET /api/panetracija-2/trendovi

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

import { GET as getReport } from '../../app/api/panetracija-2/route';
import { GET as getStatus } from '../../app/api/panetracija-2/status/route';
import { GET as getNalazi } from '../../app/api/panetracija-2/nalazi/route';
import { POST as postSken } from '../../app/api/panetracija-2/sken/route';
import { GET as getIstorija } from '../../app/api/panetracija-2/istorija/route';
import { GET as getTrendovi } from '../../app/api/panetracija-2/trendovi/route';

async function runTests(): Promise<void> {
  console.log('\n🎯 Panetracija 2 — Route Coverage Test Suite\n');

  // ─── Fajlovi postoje ──────────────────────────────────────────────────────
  const files = [
    'src/app/api/panetracija-2/route.ts',
    'src/app/api/panetracija-2/status/route.ts',
    'src/app/api/panetracija-2/nalazi/route.ts',
    'src/app/api/panetracija-2/sken/route.ts',
    'src/app/api/panetracija-2/istorija/route.ts',
    'src/app/api/panetracija-2/trendovi/route.ts',
    'src/app/panetracija-2/page.tsx',
    'src/app/panetracija-2/PentestFilterTable.tsx',
    'src/lib/panetracija-2.ts',
  ];

  for (const rel of files) {
    await test(`Fajl postoji: ${rel}`, () => {
      const full = path.resolve(process.cwd(), rel);
      assert(fs.existsSync(full), `${full} ne postoji`);
    });
  }

  // ─── Route source sadržaj ─────────────────────────────────────────────────
  await test('GET /api/panetracija-2 eksportuje GET handler', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/app/api/panetracija-2/route.ts'), 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('NextResponse.json'), 'Nedostaje JSON response');
  });

  await test('POST /api/panetracija-2/sken eksportuje POST handler', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/app/api/panetracija-2/sken/route.ts'), 'utf8');
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
  });

  await test('Panetracija 2 lib eksportuje sve potrebne funkcije', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/panetracija-2.ts'), 'utf8');
    assert(src.includes('buildPentestReportV2'), 'Nedostaje buildPentestReportV2');
    assert(src.includes('getPentestFindingsV2'), 'Nedostaje getPentestFindingsV2');
    assert(src.includes('calculatePentestScoreV2'), 'Nedostaje calculatePentestScoreV2');
    assert(src.includes('getPentestSummaryV2'), 'Nedostaje getPentestSummaryV2');
    assert(src.includes('startScanSession'), 'Nedostaje startScanSession');
    assert(src.includes('getScanHistory'), 'Nedostaje getScanHistory');
    assert(src.includes('getPentestTrend'), 'Nedostaje getPentestTrend');
  });

  await test('PentestFilterTable.tsx koristi "use client"', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/app/panetracija-2/PentestFilterTable.tsx'), 'utf8');
    assert(src.includes("'use client'") || src.includes('"use client"'), 'Nedostaje use client direktiva');
  });

  // ─── GET /api/panetracija-2 smoke ─────────────────────────────────────────
  await test('GET /api/panetracija-2 — 200 i status === "ok"', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2', {
      headers: { 'x-forwarded-for': '127.0.2.10' },
    }));
    const res = await getReport(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    assert(typeof body['overallScore'] === 'number', 'overallScore');
    assert(Array.isArray(body['findings']), 'findings je niz');
    assert(Array.isArray(body['history']), 'history je niz');
    assert(Array.isArray(body['trendovi']), 'trendovi je niz');
  });

  await test('GET /api/panetracija-2 — X-App-Version header', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2', {
      headers: { 'x-forwarded-for': '127.0.2.11' },
    }));
    const res = await getReport(req);
    const version = res.headers.get('X-App-Version');
    if (version !== null) {
      assertEqual(version, APP_VERSION, 'X-App-Version');
    }
  });

  await test('GET /api/panetracija-2 — verzija === APP_VERSION', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2', {
      headers: { 'x-forwarded-for': '127.0.2.12' },
    }));
    const res = await getReport(req);
    const body = await res.clone().json() as Record<string, unknown>;
    if (typeof body['verzija'] === 'string') {
      assertEqual(body['verzija'], APP_VERSION, 'verzija');
    }
  });

  await test('GET /api/panetracija-2 — findings imaju V2 polja', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2', {
      headers: { 'x-forwarded-for': '127.0.2.13' },
    }));
    const res = await getReport(req);
    const body = await res.clone().json() as Record<string, unknown>;
    const findings = body['findings'] as Array<Record<string, unknown>>;
    assert(findings.length > 0, 'mora biti bar jedan finding');
    const first = findings[0];
    assert(typeof first['cvssVector'] === 'string', 'cvssVector mora biti string');
    assert(typeof first['cweId'] === 'string', 'cweId mora biti string');
    assert(typeof first['prioritet'] === 'number', 'prioritet mora biti broj');
  });

  // ─── GET /api/panetracija-2/status smoke ─────────────────────────────────
  await test('GET /api/panetracija-2/status — vraća status i overallScore', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/status', {
      headers: { 'x-forwarded-for': '127.0.2.20' },
    }));
    const res = await getStatus(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(typeof body['status'] === 'string', 'status mora biti string');
    assert(typeof body['overallScore'] === 'number', 'overallScore mora biti broj');
  });

  // ─── GET /api/panetracija-2/nalazi smoke ─────────────────────────────────
  await test('GET /api/panetracija-2/nalazi — vraća niz nalaza', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi', {
      headers: { 'x-forwarded-for': '127.0.2.30' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assert(Array.isArray(body['nalazi']), 'nalazi mora biti niz');
    assert(isObject(body['filteri']), 'filteri mora biti objekat');
  });

  await test('GET /api/panetracija-2/nalazi?severity=high — filtrira po severity', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=high', {
      headers: { 'x-forwarded-for': '127.0.2.31' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['severity'] as string, 'high', 'svi nalazi moraju biti high');
    }
  });

  await test('GET /api/panetracija-2/nalazi?kategorija=injection — filtrira po kategoriji', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?kategorija=injection', {
      headers: { 'x-forwarded-for': '127.0.2.32' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['kategorija'] as string, 'injection', 'svi nalazi moraju biti injection');
    }
  });

  await test('GET /api/panetracija-2/nalazi?status=open — filtrira po statusu', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?status=open', {
      headers: { 'x-forwarded-for': '127.0.2.33' },
    }));
    const res = await getNalazi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    const nalazi = body['nalazi'] as Array<Record<string, unknown>>;
    for (const n of nalazi) {
      assertEqual(n['status'] as string, 'open', 'svi nalazi moraju biti open');
    }
  });

  await test('GET /api/panetracija-2/nalazi?severity=invalid — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?severity=invalid', {
      headers: { 'x-forwarded-for': '127.0.2.34' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400 za nevalidan severity');
  });

  await test('GET /api/panetracija-2/nalazi?kategorija=invalid — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?kategorija=invalid', {
      headers: { 'x-forwarded-for': '127.0.2.35' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400 za nevalidan kategorija');
  });

  await test('GET /api/panetracija-2/nalazi?status=invalid — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/nalazi?status=invalid', {
      headers: { 'x-forwarded-for': '127.0.2.36' },
    }));
    const res = await getNalazi(req);
    assertEqual(res.status, 400, 'mora biti 400 za nevalidan status');
  });

  // ─── POST /api/panetracija-2/sken smoke ───────────────────────────────────
  await test('POST /api/panetracija-2/sken — vraća 202 i scanId', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/sken', {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.2.40' },
    }));
    const res = await postSken(req);
    assert(res.status === 202 || res.status === 429, `Neočekivan status: ${res.status}`);
    if (res.status === 202) {
      const body = await res.clone().json() as Record<string, unknown>;
      assert(typeof body['scanId'] === 'string', 'scanId mora biti string');
      assertEqual(body['status'] as string, 'started', 'status mora biti "started"');
      assert(typeof body['estimatedDuration'] === 'number', 'estimatedDuration mora biti broj');
    }
  });

  // ─── GET /api/panetracija-2/istorija smoke ────────────────────────────────
  await test('GET /api/panetracija-2/istorija — vraća istoriju', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/istorija', {
      headers: { 'x-forwarded-for': '127.0.2.50' },
    }));
    const res = await getIstorija(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    assert(Array.isArray(body['istorija']), 'istorija mora biti niz');
    assert(typeof body['ukupno'] === 'number', 'ukupno mora biti broj');
  });

  // ─── GET /api/panetracija-2/trendovi smoke ────────────────────────────────
  await test('GET /api/panetracija-2/trendovi — vraća trendove', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi', {
      headers: { 'x-forwarded-for': '127.0.2.60' },
    }));
    const res = await getTrendovi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['status'] as string, 'ok', 'status');
    assert(Array.isArray(body['trendovi']), 'trendovi mora biti niz');
  });

  await test('GET /api/panetracija-2/trendovi?n=3 — respektuje n param', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=3', {
      headers: { 'x-forwarded-for': '127.0.2.61' },
    }));
    const res = await getTrendovi(req);
    assert(res.status >= 200 && res.status < 300, `Status: ${res.status}`);
    const body = await res.clone().json() as Record<string, unknown>;
    assertEqual(body['n'] as number, 3, 'n mora biti 3');
  });

  await test('GET /api/panetracija-2/trendovi?n=99 — vraća 400', async () => {
    const req = new NextRequest(new Request('http://localhost/api/panetracija-2/trendovi?n=99', {
      headers: { 'x-forwarded-for': '127.0.2.62' },
    }));
    const res = await getTrendovi(req);
    assertEqual(res.status, 400, 'mora biti 400 za n=99');
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
