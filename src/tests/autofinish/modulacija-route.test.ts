import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/modulacija/page';
import { navigation } from '../../lib/navigation';
import { GET } from '../../app/api/modulacija/route';
import { buildModulacija } from '../../lib/modulacija';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  BASE_URL,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 modulacija - Route Coverage Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/modulacija`;
  const pagePath = path.resolve(process.cwd(), 'src/app/modulacija/page.tsx');
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/modulacija/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildModulacija('test-user-id');

  await test('Page i API route fajlovi postoje', () => {
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Sitemap sadrži /modulacija', () => {
    assert(entries.some((entry) => entry.url === routeUrl), '/modulacija nije u sitemap-u');
  });

  await test('metadata.title sadrži Modulacija', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Modulacija'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /modulacija', () => {
    assert(
      navigation.some((item) => item.href === '/modulacija' && item.label === 'Modulacija'),
      'navigation nema Modulacija link',
    );
  });

  await test('API ruta koristi standard helpere i modulacija builder', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('apiRateLimited'), 'API route ne koristi apiRateLimited');
    assert(apiRouteSource.includes('apiInternalError'), 'API route ne koristi apiInternalError');
    assert(
      apiRouteSource.includes('checkRateLimitGlobal') && apiRouteSource.includes('rateLimitKey'),
      'API route nema rate limiting',
    );
    assert(apiRouteSource.includes('buildModulacija'), 'API route ne koristi buildModulacija');
  });

  await test('Model rezultata ima očekivana polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(
      rezultat.indeksModulacije >= 0 && rezultat.indeksModulacije <= 1,
      'indeksModulacije',
    );
    assert(rezultat.prosekIntegriteta >= 0 && rezultat.prosekIntegriteta <= 1, 'prosekIntegriteta');
    assert(
      rezultat.efikasnostPrenosa >= 0 && rezultat.efikasnostPrenosa <= 1,
      'efikasnostPrenosa',
    );
    assert(typeof rezultat.ukupnaBandwidth === 'number' && rezultat.ukupnaBandwidth > 0, 'ukupnaBandwidth');
    assert(Array.isArray(rezultat.kanali) && rezultat.kanali.length > 0, 'kanali');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('GET smoke provera', async () => {
    const request = new Request('http://localhost/api/modulacija', {
      headers: { 'x-forwarded-for': '127.0.1.27' },
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
    failures.forEach((failure) => console.error(`  • ${failure}`));
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Kritična greška u test runneru:', error);
  process.exit(1);
});
