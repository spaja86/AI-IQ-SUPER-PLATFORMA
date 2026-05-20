import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/digitalna-industrija-plate/page';
import { navigation } from '../../lib/navigation';
import { buildDigitalnaIndustrijaPlate } from '../../lib/digitalna-industrija-plate';
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

async function runTests(): Promise<void> {
  console.log('\n💰 Digitalna Industrija Plate route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/digitalna-industrija-plate`;
  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/digitalna-industrija-plate/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildDigitalnaIndustrijaPlate('test-user-id');

  await test('Sitemap sadrži /digitalna-industrija-plate', () => {
    assert(
      entries.some((entry) => entry.url === routeUrl),
      '/digitalna-industrija-plate nije u sitemap-u',
    );
  });

  await test('metadata.title sadrži Digitalna Industrija Plate', () => {
    assert(
      typeof metadata.title === 'string' &&
        metadata.title.includes('Digitalna Industrija Plate'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /digitalna-industrija-plate', () => {
    assert(
      navigation.some(
        (item) =>
          item.href === '/digitalna-industrija-plate' &&
          item.label === 'Digitalna Industrija Plate',
      ),
      'navigation nema Digitalna Industrija Plate link',
    );
  });

  await test('API ruta koristi buildDigitalnaIndustrijaPlate()', () => {
    assert(
      apiRouteSource.includes('buildDigitalnaIndustrijaPlate'),
      'API route ne koristi buildDigitalnaIndustrijaPlate',
    );
  });

  await test('API ruta ima apiSuccess i rate limiting', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limiting');
    assert(apiRouteSource.includes('rateLimitKey'), 'API route nema rate limit key');
  });

  await test('Model rezultata ima očekivana polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assertEqual(rezultat.jurisdikcija, 'Republika Srbija', 'jurisdikcija');
    assert(Array.isArray(rezultat.plate), 'plate niz');
    assert(rezultat.plate.length > 0, 'plate nisu prazne');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '57.3.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1304, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n💰 Rezultat: ${passed} prošlo, ${failed} palo`);
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
