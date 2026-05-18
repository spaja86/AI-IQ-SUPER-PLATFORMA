import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/digitalna-industrija-pib-mb/page';
import { navigation } from '../../lib/navigation';
import { buildDigitalnaIndustrijaPibMb } from '../../lib/digitalna-industrija-pib-mb';
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
  console.log('\n🧾 Digitalna Industrija PIB/MB route coverage — Unit Test Suite\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/digitalna-industrija-pib-mb`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/digitalna-industrija-pib-mb/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildDigitalnaIndustrijaPibMb('test-user-id');

  await test('Sitemap sadrži /digitalna-industrija-pib-mb', () => {
    assert(
      entries.some((entry) => entry.url === routeUrl),
      '/digitalna-industrija-pib-mb nije u sitemap-u',
    );
  });

  await test('metadata.title sadrži Digitalna Industrija PIB/MB', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Digitalna Industrija PIB/MB'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /digitalna-industrija-pib-mb', () => {
    assert(
      navigation.some(
        (item) =>
          item.href === '/digitalna-industrija-pib-mb' &&
          item.label === 'Digitalna Industrija PIB/MB',
      ),
      'navigation nema Digitalna Industrija PIB/MB link',
    );
  });

  await test('API ruta koristi buildDigitalnaIndustrijaPibMb()', () => {
    assert(
      apiRouteSource.includes('buildDigitalnaIndustrijaPibMb'),
      'API route ne koristi buildDigitalnaIndustrijaPibMb',
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
    assert(Array.isArray(rezultat.entiteti), 'entiteti niz');
    assert(rezultat.entiteti.length > 0, 'entiteti nisu prazni');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '54.4.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1275, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1141, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1236, 'TOTAL_ROUTES');
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
