// Autofinish #1395 — Autofinish SVEGA Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/autofinish-svega/route';
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

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish SVEGA — Route Coverage Test Suite (#1395)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/autofinish-svega/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/autofinish-svega.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');
  const libSource = fs.readFileSync(libPath, 'utf8');

  // ─── Fajlovi postoje ──────────────────────────────────────────────────────

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Lib fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  // ─── Gradivni blokovi rute ───────────────────────────────────────────────

  await test('Ruta eksportuje GET i POST', () => {
    assert(routeSource.includes('export async function GET'), 'Nedostaje GET handler');
    assert(routeSource.includes('export async function POST'), 'Nedostaje POST handler');
    assert(routeSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('Ruta koristi AUTOFINISH_TRIGGER_TOKEN zaštitu', () => {
    assert(routeSource.includes('AUTOFINISH_TRIGGER_TOKEN'), 'Nedostaje AUTOFINISH_TRIGGER_TOKEN');
    assert(routeSource.includes('SERVICE_UNAVAILABLE'), 'Nedostaje SERVICE_UNAVAILABLE guard');
    assert(routeSource.includes('Unauthorized'), 'Nedostaje Unauthorized guard');
  });

  await test('Ruta koristi rate-limit', () => {
    assert(routeSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(routeSource.includes('rateLimitKey'), 'Nedostaje rateLimitKey');
    assert(routeSource.includes('Retry-After'), 'Nedostaje Retry-After header');
  });

  await test('Lib eksportuje buildAutofinishSvega i getAutofinishSvegaInfo', () => {
    assert(libSource.includes('export async function buildAutofinishSvega'), 'Nedostaje buildAutofinishSvega');
    assert(libSource.includes('export function getAutofinishSvegaInfo'), 'Nedostaje getAutofinishSvegaInfo');
  });

  await test('Lib sadrži kanonski redosled stage-ova', () => {
    assert(libSource.includes("'analiza-svega'"), 'Nedostaje analiza-svega stage');
    assert(libSource.includes("'procesuiranje-svega'"), 'Nedostaje procesuiranje-svega stage');
    assert(libSource.includes("'ekstremno-procesuiranje-svega'"), 'Nedostaje ekstremno stage');
    assert(libSource.includes("'autofinish-petlja'"), 'Nedostaje autofinish-petlja stage');
  });

  // ─── GET smoke provera ────────────────────────────────────────────────────

  await test('GET vraća 200 sa ispravnim payload-om i header-ima', async () => {
    const request = new Request('http://localhost/api/autofinish-svega', {
      headers: { 'x-forwarded-for': '127.0.0.50' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['sistem'] === 'string', 'sistem string');
    assert(typeof body['verzija'] === 'string', 'verzija string');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['autofinishBroj'] === 'number', 'autofinishBroj number');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(Array.isArray(body['dostupniStepovi']), 'dostupniStepovi niz');
    assert((body['dostupniStepovi'] as unknown[]).length === 4, 'dostupniStepovi length=4');

    const prvaStepa = (body['dostupniStepovi'] as Array<Record<string, unknown>>)[0];
    assert(typeof prvaStepa?.['id'] === 'string', 'stepa.id string');
    assert(typeof prvaStepa?.['naziv'] === 'string', 'stepa.naziv string');
    assert(typeof prvaStepa?.['endpoint'] === 'string', 'stepa.endpoint string');

    assert(isObject(body['ekosistem']), 'ekosistem objekat');
    const eko = body['ekosistem'] as Record<string, unknown>;
    assertEqual(eko['apiRute'] as number, TOTAL_API_ROUTES, 'ekosistem.apiRute');
    assertEqual(eko['ukupnoRuta'] as number, TOTAL_ROUTES, 'ekosistem.ukupnoRuta');

    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(
      response.headers.get('X-Autofinish-Iteracija'),
      String(AUTOFINISH_COUNT),
      'X-Autofinish-Iteracija',
    );
    assert(
      (response.headers.get('Cache-Control') ?? '').includes('s-maxage=60'),
      'Cache-Control s-maxage',
    );
  });

  // ─── POST bez tokena — 503 ────────────────────────────────────────────────

  await test('POST bez TRIGGER_TOKEN vraća 4xx ili 5xx', async () => {
    const req = new Request('http://localhost/api/autofinish-svega', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.51' },
      body: JSON.stringify({}),
    });
    const response = await POST(req as NextRequest);
    assert(
      response.status >= 400 && response.status < 600,
      `Očekivan 4xx/5xx bez tokena, dobijeno ${response.status}`,
    );
  });

  // ─── POST sa pogrešnim tokenom — 401 ili 503 ─────────────────────────────

  await test('POST sa pogrešnim tokenom vraća 401 ili 503', async () => {
    const req = new Request('http://localhost/api/autofinish-svega', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer pogresni-token-xyz',
        'x-forwarded-for': '127.0.0.52',
      },
      body: JSON.stringify({}),
    });
    const response = await POST(req as NextRequest);
    assert(
      response.status === 401 || response.status === 503,
      `Očekivan 401 ili 503, dobijeno ${response.status}`,
    );
  });

  // ─── POST sa neispravnim JSON — 400 ili 401/503 ──────────────────────────

  await test('POST sa neispravnim JSON vraća 4xx (ili 503 bez tokena)', async () => {
    const req = new Request('http://localhost/api/autofinish-svega', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer test-token',
        'x-forwarded-for': '127.0.0.53',
      },
      body: '{broken',
    });
    const response = await POST(req as NextRequest);
    assert(
      response.status >= 400 && response.status < 600,
      `Očekivan 4xx ili 5xx za neispravni JSON, dobijeno ${response.status}`,
    );
  });

  // ─── Konstante ────────────────────────────────────────────────────────────

  await test('Konstante su ažurirane', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION string');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT >= 1395, 'AUTOFINISH_COUNT >= 1395');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES >= 1202, 'TOTAL_API_ROUTES >= 1202');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES >= 1328, 'TOTAL_ROUTES >= 1328');
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
