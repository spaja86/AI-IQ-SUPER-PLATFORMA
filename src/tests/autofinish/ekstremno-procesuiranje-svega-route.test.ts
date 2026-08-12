// Autofinish — ekstremno-procesuiranje-svega Route Coverage Test
// Generisano: scripts/generate-route-tests.mjs

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
import { GET } from '../../app/api/ekstremno-procesuiranje-svega/route';

async function runTests(): Promise<void> {
  console.log('\n🏁 ekstremno-procesuiranje-svega — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/ekstremno-procesuiranje-svega/route.ts');

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
    const request = new Request('http://localhost/api/ekstremno-procesuiranje-svega', {
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

      const payload = isObject(body['data']) ? body['data'] : body;
      if (isObject(payload['meta'])) {
        const meta = payload['meta'];
        assert(typeof meta['contractVersion'] === 'string', 'meta.contractVersion');
        assert(typeof meta['modelVersion'] === 'string', 'meta.modelVersion');
        assert(typeof meta['degraded'] === 'boolean', 'meta.degraded');
        assert(typeof meta['degradedMode'] === 'string', 'meta.degradedMode');
        assert(typeof meta['auditSignal'] === 'string', 'meta.auditSignal');
      }
    }

    assert(response.headers.get('X-Procesuiranje-Contract-Version') !== null, 'contract header');
    assert(response.headers.get('X-Procesuiranje-Model-Version') !== null, 'model header');
    assertEqual(response.headers.get('X-Procesuiranje-Mode'), 'extreme', 'mode header');
    assert(response.headers.get('X-Procesuiranje-Degraded') !== null, 'degraded header');
    assert(response.headers.get('X-Procesuiranje-Degraded-Mode') !== null, 'degraded mode header');
    assert(response.headers.get('X-Procesuiranje-Audit-Signal') !== null, 'audit signal header');
    assert(response.headers.get('X-Procesuiranje-Queue-Depth') !== null, 'queue depth header');
    assert(response.headers.get('X-Procesuiranje-Fairness-Index') !== null, 'fairness header');
  });

  await test('Rate limit aktivan posle više zahteva sa iste IP', async () => {
    const ip = '127.0.9.90';
    let got429 = false;
    for (let i = 0; i < 40; i++) {
      const request = new Request('http://localhost/api/ekstremno-procesuiranje-svega', {
        headers: { 'x-forwarded-for': ip },
      });
      const response = await GET(request as unknown as NextRequest);
      if (response.status === 429) {
        got429 = true;
        assert(response.headers.get('Retry-After') !== null, 'Retry-After header');
        break;
      }
    }
    assert(got429, 'očekivan je 429 nakon prelaska limita');
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  console.log(`
🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
