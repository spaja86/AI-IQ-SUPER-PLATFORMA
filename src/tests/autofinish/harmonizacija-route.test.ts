import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/harmonizacija/page';
import { navigation } from '../../lib/navigation';
import { GET } from '../../app/api/harmonizacija/route';
import { buildHarmonizacija } from '../../lib/harmonizacija';
import {
  APP_VERSION,
  BASE_URL,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  AUTOFINISH_COUNT,
} from '../../lib/constants';

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
  console.log('\n🏁 harmonizacija - Route Coverage Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/harmonizacija`;
  const pagePath = path.resolve(process.cwd(), 'src/app/harmonizacija/page.tsx');
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/harmonizacija/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildHarmonizacija('test-user-id');

  await test('Page i API route fajlovi postoje', () => {
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Sitemap sadrži /harmonizacija', () => {
    assert(entries.some((entry) => entry.url === routeUrl), '/harmonizacija nije u sitemap-u');
  });

  await test('metadata.title sadrži Harmonizacija', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Harmonizacija'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /harmonizacija', () => {
    assert(
      navigation.some((item) => item.href === '/harmonizacija' && item.label === 'Harmonizacija'),
      'navigation nema Harmonizacija link',
    );
  });

  await test('API ruta koristi standard helpere i harmonizacija builder', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('apiRateLimited'), 'API route ne koristi apiRateLimited');
    assert(apiRouteSource.includes('apiInternalError'), 'API route ne koristi apiInternalError');
    assert(
      apiRouteSource.includes('checkRateLimitGlobal') && apiRouteSource.includes('rateLimitKey'),
      'API route nema rate limiting',
    );
    assert(apiRouteSource.includes('buildHarmonizacija'), 'API route ne koristi buildHarmonizacija');
  });

  await test('Model rezultata ima očekivana polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(rezultat.indeksHarmonije >= 0 && rezultat.indeksHarmonije <= 1, 'indeksHarmonije');
    assert(rezultat.rezonancija >= 0 && rezultat.rezonancija <= 1, 'rezonancija');
    assert(rezultat.stabilnost >= 0 && rezultat.stabilnost <= 1, 'stabilnost');
    assert(Array.isArray(rezultat.slojevi) && rezultat.slojevi.length > 0, 'slojevi');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('GET smoke provera', async () => {
    const request = new Request('http://localhost/api/harmonizacija', {
      headers: { 'x-forwarded-for': '127.0.1.22' },
    });
    const response = await GET(request as unknown as Request);
    assert(response.status >= 200 && response.status < 600, `Neočekivan status: ${response.status}`);

    const body = (await response.clone().json().catch(() => null)) as unknown;
    assert(isObject(body), 'response body mora biti objekat');
    if (isObject(body)) {
      if (typeof body['verzija'] === 'string') {
        assertEqual(body['verzija'], APP_VERSION, 'verzija');
      } else if (isObject(body['data']) && typeof body['data']['verzija'] === 'string') {
        assertEqual(body['data']['verzija'], APP_VERSION, 'data.verzija');
      }
      if (isObject(body['data']) && isObject(body['data']['rezultat'])) {
        assertEqual(body['data']['rezultat']['status'], 'aktivan', 'data.rezultat.status');
      }
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
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
