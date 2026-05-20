import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/digitalna-industrija-likvidnosni-rizik/page';
import { navigation } from '../../lib/navigation';
import { buildDigitalnaIndustrijaLikvidnosniRizik } from '../../lib/digitalna-industrija-likvidnosni-rizik';
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
  console.log('\n💧 Digitalna Industrija Likvidnosni Rizik route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/digitalna-industrija-likvidnosni-rizik`;
  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/digitalna-industrija-likvidnosni-rizik/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildDigitalnaIndustrijaLikvidnosniRizik('test-user-id');

  await test('Sitemap sadrži /digitalna-industrija-likvidnosni-rizik', () => {
    assert(
      entries.some((entry) => entry.url === routeUrl),
      '/digitalna-industrija-likvidnosni-rizik nije u sitemap-u',
    );
  });

  await test('metadata.title sadrži Digitalna Industrija Likvidnosni Rizik', () => {
    assert(
      typeof metadata.title === 'string' &&
        metadata.title.includes('Digitalna Industrija Likvidnosni Rizik'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /digitalna-industrija-likvidnosni-rizik', () => {
    assert(
      navigation.some(
        (item) =>
          item.href === '/digitalna-industrija-likvidnosni-rizik' &&
          item.label === 'Digitalna Industrija Likvidnosni Rizik',
      ),
      'navigation nema Digitalna Industrija Likvidnosni Rizik link',
    );
  });

  await test('API ruta koristi buildDigitalnaIndustrijaLikvidnosniRizik()', () => {
    assert(
      apiRouteSource.includes('buildDigitalnaIndustrijaLikvidnosniRizik'),
      'API route ne koristi buildDigitalnaIndustrijaLikvidnosniRizik',
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
    assert(Array.isArray(rezultat.pozicije), 'pozicije niz');
    assert(rezultat.pozicije.length > 0, 'pozicije nisu prazne');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '56.9.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1300, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
  });

  console.log(`\n💧 Rezultat: ${passed} prošlo, ${failed} palo`);
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
