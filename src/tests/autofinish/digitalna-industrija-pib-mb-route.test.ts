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
  console.log('\n🧾 Digitalna Industrija PIB/M/B — Route Coverage Test Suite (#1265)\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/digitalna-industrija-pib-mb`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/digitalna-industrija-pib-mb/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildDigitalnaIndustrijaPibMb('test-user');

  await test('Sitemap sadrži /digitalna-industrija-pib-mb', () => {
    assert(entries.some((entry) => entry.url === routeUrl), 'ruta nije u sitemap-u');
  });

  await test('metadata.title sadrži Digitalna Industrija PIB/M/B', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Digitalna Industrija PIB/M/B'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /digitalna-industrija-pib-mb', () => {
    assert(
      navigation.some((item) => item.href === '/digitalna-industrija-pib-mb' && item.label === 'Digitalna Industrija PIB/M/B'),
      'navigation nema Digitalna Industrija PIB/M/B link',
    );
  });

  await test('API ruta koristi buildDigitalnaIndustrijaPibMb()', () => {
    assert(apiRouteSource.includes('buildDigitalnaIndustrijaPibMb'), 'API route ne koristi builder');
  });

  await test('API ruta koristi apiSuccess i rate limit', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limit');
  });

  await test('Model rezultata ima očekivana ključna polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(Array.isArray(rezultat.entiteti), 'entiteti niz');
    assert(Array.isArray(rezultat.zahtevi), 'zahtevi niz');
    assert(Array.isArray(rezultat.preporuke), 'preporuke niz');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Konstante su ažurirane za #1265', () => {
    assertEqual(APP_VERSION, '53.4.0', 'APP_VERSION');
    assertEqual(TOTAL_API_ROUTES, 1130, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1216, 'TOTAL_ROUTES');
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
