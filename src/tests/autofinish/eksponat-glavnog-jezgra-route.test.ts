// Autofinish #1254 — EKSPONAT GLAVNOG JEZGRA route coverage
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/eksponat-glavnog-jezgra-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/eksponat-glavnog-jezgra/page';
import { navigation } from '../../lib/navigation';
import { buildEksponatGlavnogJezgra } from '../../lib/eksponat-glavnog-jezgra';
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
  console.log('\n🔬 EKSPONAT GLAVNOG JEZGRA ruta — Unit Test Suite (#1254)\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/eksponat-glavnog-jezgra`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/eksponat-glavnog-jezgra/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildEksponatGlavnogJezgra('test-user-id');

  await test('Sitemap sadrži /eksponat-glavnog-jezgra', () => {
    assert(entries.some((entry) => entry.url === routeUrl), `/eksponat-glavnog-jezgra nije u sitemap-u (${routeUrl})`);
  });

  await test('metadata.title sadrži EKSPONAT GLAVNOG JEZGRA', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('EKSPONAT GLAVNOG JEZGRA'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /eksponat-glavnog-jezgra', () => {
    assert(
      navigation.some((item) => item.href === '/eksponat-glavnog-jezgra' && item.label === 'EKSPONAT GLAVNOG JEZGRA'),
      'navigation nema EKSPONAT GLAVNOG JEZGRA link',
    );
  });

  await test('API ruta koristi buildEksponatGlavnogJezgra()', () => {
    assert(
      apiRouteSource.includes('buildEksponatGlavnogJezgra'),
      'API route ne koristi buildEksponatGlavnogJezgra',
    );
  });

  await test('API ruta vraća apiSuccess({ rezultat }) shape', () => {
    assert(
      apiRouteSource.includes('apiSuccess({ rezultat })'),
      'API route ne vraća apiSuccess({ rezultat })',
    );
  });

  await test('Model rezultata ima očekivana ključna polja za API', () => {
    assert(typeof rezultat.eksponatKoeficijent === 'number', 'eksponatKoeficijent broj');
    assert(Array.isArray(rezultat.ilustrovaniOktavniSistem.jedinjenja), 'jedinjenja niz');
    assertEqual(rezultat.ilustrovaniOktavniSistem.jedinjenja.length, 8, 'jedinjenja.length');
    assert(rezultat.status === 'aktivan', 'status=aktivan');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('AUTOFINISH_COUNT === 1254', () => {
    assertEqual(AUTOFINISH_COUNT, 1254, 'AUTOFINISH_COUNT=1254');
  });

  await test('APP_VERSION === 52.3.0', () => {
    assertEqual(APP_VERSION, '52.3.0', 'APP_VERSION=52.3.0');
  });

  await test('TOTAL_API_ROUTES ostaje 1122', () => {
    assertEqual(TOTAL_API_ROUTES, 1122, 'TOTAL_API_ROUTES=1122');
  });

  await test('TOTAL_ROUTES ostaje 1205', () => {
    assertEqual(TOTAL_ROUTES, 1205, 'TOTAL_ROUTES=1205');
  });

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspješni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
