// Autofinish — ekspres Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';
import { GET } from '../../app/api/ekspres/route';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 ekspres — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/ekspres/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET i JSON response', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('GET smoke provera i contract header-i', async () => {
    const request = new Request('http://localhost/api/ekspres', {
      headers: { 'x-forwarded-for': '127.0.1.11' },
    });
    const response = await GET(request as unknown as NextRequest);
    assert(response.status >= 200 && response.status < 600, `Neočekivan status: ${response.status}`);
    assert(response.headers.get('X-Ekspres-Contract-Version') !== null, 'Nedostaje contract version header');
    assert(response.headers.get('X-Ekspres-Model-Version') !== null, 'Nedostaje model version header');

    const body: unknown = await response.clone().json();
    assert(isObject(body), 'response body mora biti object');
    if (isObject(body) && isObject(body['data'])) {
      assertEqual(body['verzija'], APP_VERSION, 'verzija');
      assertEqual(body['status'], 'aktivan', 'status');
      assert(typeof body['contractVersion'] === 'string', 'contractVersion');
      assert(typeof body['modelVersion'] === 'string', 'modelVersion');
    }
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
