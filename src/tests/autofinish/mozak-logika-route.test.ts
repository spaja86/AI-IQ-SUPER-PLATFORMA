// Autofinish #1256 — MOZAK LOGIKA route coverage
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/autofinish/mozak-logika-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/mozak-logika/page';
import { navigation } from '../../lib/navigation';
import { glavniEndzinDigitalneIndustrije, getGlavniEndzinStatistika } from '../../lib/glavni-endzin-digitalne-industrije';
import { buildMozakLogika } from '../../lib/mozak-logika';
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
  console.log('\n🧠 MOZAK LOGIKA ruta — Unit Test Suite (#1256)\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/mozak-logika`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/mozak-logika/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildMozakLogika('test-user-id', {
    glavniEndzinId: glavniEndzinDigitalneIndustrije.id,
    glavniEndzinNaziv: glavniEndzinDigitalneIndustrije.naziv,
    glavniEndzinVerzija: glavniEndzinDigitalneIndustrije.verzija,
    statistika: getGlavniEndzinStatistika(),
    spojeniEndzini: glavniEndzinDigitalneIndustrije.spojeniEndzini,
    evolucija: glavniEndzinDigitalneIndustrije.evolucija,
    mogucnosti: glavniEndzinDigitalneIndustrije.mogucnosti,
  });

  await test('Sitemap sadrži /mozak-logika', () => {
    assert(entries.some((entry) => entry.url === routeUrl), `/mozak-logika nije u sitemap-u (${routeUrl})`);
  });

  await test('metadata.title sadrži MOZAK LOGIKA', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('MOZAK LOGIKA'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /mozak-logika', () => {
    assert(
      navigation.some((item) => item.href === '/mozak-logika' && item.label === 'MOZAK LOGIKA'),
      'navigation nema MOZAK LOGIKA link',
    );
  });

  await test('API ruta koristi buildMozakLogika()', () => {
    assert(apiRouteSource.includes('buildMozakLogika'), 'API route ne koristi buildMozakLogika');
  });

  await test('API ruta vraća apiSuccess({ rezultat }) shape', () => {
    assert(apiRouteSource.includes('apiSuccess({ rezultat })'), 'API route ne vraća apiSuccess({ rezultat })');
  });

  await test('Model rezultata ima očekivana ključna polja za API', () => {
    assert(Array.isArray(rezultat.aktivniCiklusi), 'aktivniCiklusi niz');
    assert(Array.isArray(rezultat.reviewQueue), 'reviewQueue niz');
    assert(typeof rezultat.operativniStatus.ciklusZdravlja === 'number', 'ciklusZdravlja broj');
    assert(typeof rezultat.povratniOdaziv.ukupnoStavki === 'number', 'ukupnoStavki broj');
  });

  await test('AUTOFINISH_COUNT === 1258', () => {
    assertEqual(AUTOFINISH_COUNT, 1258, 'AUTOFINISH_COUNT=1258');
  });

  await test('APP_VERSION === 52.7.0', () => {
    assertEqual(APP_VERSION, '52.7.0', 'APP_VERSION=52.7.0');
  });

  await test('TOTAL_API_ROUTES ostaje 1124', () => {
    assertEqual(TOTAL_API_ROUTES, 1124, 'TOTAL_API_ROUTES=1124');
  });

  await test('TOTAL_ROUTES ostaje 1207', () => {
    assertEqual(TOTAL_ROUTES, 1207, 'TOTAL_ROUTES=1207');
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
