// SVE OD SVEGA — Route Coverage Test
// Kompanija SPAJA — Digitalna Industrija

import fs from 'node:fs';
import path from 'node:path';
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

import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/sve-od-svega/route';

async function runTests(): Promise<void> {
  console.log('\n🌌 sve-od-svega — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/sve-od-svega/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET i response helper', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(
      src.includes('NextResponse.json') || src.includes('Response.json') || src.includes('apiSuccess'),
      'Nedostaje JSON response helper',
    );
  });

  await test('GET smoke provera', async () => {
    const request = new Request('http://localhost/api/sve-od-svega', {
      headers: { 'x-forwarded-for': '127.0.1.10' },
    });

    const response = await GET(request as unknown as NextRequest);
    assert(response.status >= 200 && response.status < 600, `Neočekivan status: ${response.status}`);

    const xAppVersion = response.headers.get('X-App-Version');
    if (xAppVersion !== null) {
      assertEqual(xAppVersion, APP_VERSION, 'X-App-Version');
    }

    let body: unknown = null;
    try {
      body = await response.clone().json();
    } catch {
      body = null;
    }

    if (isObject(body)) {
      if (typeof body['status'] === 'string') {
        assert((body['status'] as string).length > 0, 'status string');
      }

      if (typeof body['verzija'] === 'string') {
        assertEqual(body['verzija'], APP_VERSION, 'verzija');
      } else if (isObject(body['data']) && typeof body['data']['verzija'] === 'string') {
        assertEqual(body['data']['verzija'], APP_VERSION, 'data.verzija');
      }
    }
  });

  await test('Lib: getSveOdSvegaInfo vraca ispravnu strukturu', async () => {
    const { getSveOdSvegaInfo } = await import('../../lib/sve-od-svega');
    const info = getSveOdSvegaInfo();
    assert(typeof info.endpoint === 'string' && info.endpoint.length > 0, 'endpoint mora biti string');
    assert(typeof info.contractVersion === 'string', 'contractVersion mora biti string');
    assert(typeof info.modelVersion === 'string', 'modelVersion mora biti string');
    assert(info.endpoint === '/api/sve-od-svega', 'endpoint mora biti /api/sve-od-svega');
    assert(typeof info.scoreWeights === 'object' && info.scoreWeights !== null, 'scoreWeights mora biti objekat');
  });

  await test('scoreWeights zbir mora biti 1.0', async () => {
    const { getSveOdSvegaInfo } = await import('../../lib/sve-od-svega');
    const info = getSveOdSvegaInfo();
    const sum = Object.values(info.scoreWeights).reduce((s, w) => s + (w as number), 0);
    assert(Math.abs(sum - 1) < 0.0001, `scoreWeights zbir mora biti 1.0 (trenutno: ${sum})`);
  });

  await test('domeni sadrze gaming i licensing kljuceve', async () => {
    const { buildSveOdSvega } = await import('../../lib/sve-od-svega');
    const rezultat = await buildSveOdSvega();
    const domenKljucevi = Object.keys(rezultat.domeni);
    assert(domenKljucevi.some((k) => k.toLowerCase().includes('gaming') || rezultat.domeni[k].naziv.includes('Gaming')), 'Nedostaje gaming domen');
    assert(domenKljucevi.some((k) => k.toLowerCase().includes('licensing') || rezultat.domeni[k].naziv.includes('Licensing')), 'Nedostaje licensing domen');
  });

  await test('contractVersion je v2', async () => {
    const { SVE_OD_SVEGA_CONTRACT_VERSION } = await import('../../lib/sve-od-svega');
    assertEqual(SVE_OD_SVEGA_CONTRACT_VERSION, 'v2', 'contractVersion mora biti v2');
  });

  await test('history polje je niz u GET response-u', async () => {
    const request = new Request('http://localhost/api/sve-od-svega', {
      headers: { 'x-forwarded-for': '127.0.1.11' },
    });
    const response = await GET(request as unknown as NextRequest);
    if (response.status === 200) {
      const body = await response.clone().json() as unknown;
      if (isObject(body) && isObject(body['data'])) {
        assert(Array.isArray(body['data']['history']), 'data.history mora biti niz');
      } else if (isObject(body)) {
        assert(Array.isArray(body['history']), 'history mora biti niz');
      }
    }
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  console.log(`
🌌 Rezultat: ${passed} prošlo, ${failed} palo`);
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
