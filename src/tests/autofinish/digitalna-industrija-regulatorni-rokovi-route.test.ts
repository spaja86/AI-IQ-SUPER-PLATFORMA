import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/digitalna-industrija-regulatorni-rokovi/page';
import { navigation } from '../../lib/navigation';
import { buildDigitalnaIndustrijaRegulatorniRokovi } from '../../lib/digitalna-industrija-regulatorni-rokovi';
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
  console.log('\n📅 Digitalna Industrija Regulatorni Rokovi route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/digitalna-industrija-regulatorni-rokovi`;
  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/digitalna-industrija-regulatorni-rokovi/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildDigitalnaIndustrijaRegulatorniRokovi('test-user-id');

  await test('Sitemap sadrži /digitalna-industrija-regulatorni-rokovi', () => {
    assert(
      entries.some((entry) => entry.url === routeUrl),
      '/digitalna-industrija-regulatorni-rokovi nije u sitemap-u',
    );
  });

  await test('metadata.title sadrži Digitalna Industrija Regulatorni Rokovi', () => {
    assert(
      typeof metadata.title === 'string' &&
        metadata.title.includes('Digitalna Industrija Regulatorni Rokovi'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /digitalna-industrija-regulatorni-rokovi', () => {
    assert(
      navigation.some(
        (item) =>
          item.href === '/digitalna-industrija-regulatorni-rokovi' &&
          item.label === 'Digitalna Industrija Regulatorni Rokovi',
      ),
      'navigation nema Digitalna Industrija Regulatorni Rokovi link',
    );
  });

  await test('API ruta koristi buildDigitalnaIndustrijaRegulatorniRokovi()', () => {
    assert(
      apiRouteSource.includes('buildDigitalnaIndustrijaRegulatorniRokovi'),
      'API route ne koristi buildDigitalnaIndustrijaRegulatorniRokovi',
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
    assert(Array.isArray(rezultat.rokovi), 'rokovi niz');
    assert(rezultat.rokovi.length > 0, 'rokovi nisu prazni');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '56.5.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1296, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
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
