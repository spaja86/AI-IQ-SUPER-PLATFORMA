// Autofinish #1262 — AI IQ World Bank — Route Coverage Test Suite

import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/ai-iq-world-bank/page';
import { navigation } from '../../lib/navigation';
import { buildAiIqWorldBank } from '../../lib/ai-iq-world-bank';
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
  console.log('\n🏦 AI IQ World Bank — Route Coverage Test Suite (#1262)\n');

  const entries = sitemap();
  const routeUrl = `${BASE_URL}/ai-iq-world-bank`;
  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/ai-iq-world-bank/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const rezultat = buildAiIqWorldBank('test-user-id');

  // ── Sitemap ───────────────────────────────────────────────────────────────
  await test('Sitemap sadrži /ai-iq-world-bank', () => {
    assert(
      entries.some((entry) => entry.url === routeUrl),
      '/ai-iq-world-bank nije u sitemap-u',
    );
  });

  // ── Page metadata ─────────────────────────────────────────────────────────
  await test('metadata.title sadrži AI IQ World Bank', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('AI IQ World Bank'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('metadata.description je postavljen', () => {
    assert(
      typeof metadata.description === 'string' && metadata.description.length > 10,
      'metadata.description je prazan ili previše kratak',
    );
  });

  // ── Navigation ────────────────────────────────────────────────────────────
  await test('Navigation sadrži /ai-iq-world-bank', () => {
    assert(
      navigation.some((item) => item.href === '/ai-iq-world-bank'),
      'navigation nema /ai-iq-world-bank link',
    );
  });

  await test('Navigation label je AI IQ World Bank', () => {
    const item = navigation.find((i) => i.href === '/ai-iq-world-bank');
    assert(item !== undefined, 'nav item postoji');
    assert(item.label.includes('AI IQ World Bank'), `nav label: ${item.label}`);
  });

  // ── API ruta ──────────────────────────────────────────────────────────────
  await test('API ruta koristi buildAiIqWorldBank()', () => {
    assert(apiRouteSource.includes('buildAiIqWorldBank'), 'API route ne koristi buildAiIqWorldBank');
  });

  await test('API ruta vraća apiSuccess payload', () => {
    assert(apiRouteSource.includes('apiSuccess'), 'API route ne koristi apiSuccess');
    assert(apiRouteSource.includes('rezultat'), 'API route ne vraća rezultat');
  });

  await test('API ruta ima rate limiting', () => {
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limiting');
    assert(apiRouteSource.includes('apiRateLimited'), 'API route nema apiRateLimited odgovor');
  });

  await test('API ruta ima error handling', () => {
    assert(apiRouteSource.includes('apiInternalError'), 'API route nema error handling');
  });

  // ── Model konzistentnost ──────────────────────────────────────────────────
  await test('Model rezultata ima sva obavezna polja', () => {
    assertEqual(rezultat.status, 'aktivan', 'status');
    assert(typeof rezultat.profil === 'object', 'profil je objekat');
    assert(Array.isArray(rezultat.usluge), 'usluge je niz');
    assert(Array.isArray(rezultat.bezbednost), 'bezbednost je niz');
    assert(typeof rezultat.ersteInfo === 'object', 'ersteInfo je objekat');
    assert(typeof rezultat.omegaAiTehnologija === 'object', 'omegaAiTehnologija je objekat');
    assert(Array.isArray(rezultat.partneri), 'partneri je niz');
    assert(Array.isArray(rezultat.transferi), 'transferi je niz');
    assert(typeof rezultat.dugovi === 'object', 'dugovi je objekat');
    assert(Array.isArray(rezultat.kontakt), 'kontakt je niz');
    assert(Array.isArray(rezultat.drustvneMreze), 'drustvneMreze je niz');
    assert(typeof rezultat.srpskeBanke === 'object', 'srpskeBanke je objekat');
    assert(typeof rezultat.githubBilling === 'object', 'githubBilling je objekat');
    assert(typeof rezultat.kpi === 'object', 'kpi je objekat');
    assert(!Number.isNaN(Date.parse(rezultat.timestamp)), 'timestamp ISO');
  });

  await test('Postojeća /banka ruta ostaje nepromenjena', () => {
    const bankaApiPath = path.resolve(process.cwd(), 'src/app/api/banka/route.ts');
    assert(fs.existsSync(bankaApiPath), '/api/banka/route.ts postoji');
    const bankaPagePath = path.resolve(process.cwd(), 'src/app/banka/page.tsx');
    assert(fs.existsSync(bankaPagePath), '/banka/page.tsx postoji');
  });

  await test('Sve banka-* API rute su i dalje prisutne', () => {
    const bankaApiRute = [
      'src/app/api/banka-kontakt-drustvene-mreze/route.ts',
      'src/app/api/banka-partneri/route.ts',
      'src/app/api/banka-transfer-dugovi/route.ts',
      'src/app/api/banka-omega-ai-tehnologija/route.ts',
      'src/app/api/banka-smederevo-ekspanzija/route.ts',
    ];
    for (const ruta of bankaApiRute) {
      const fullPath = path.resolve(process.cwd(), ruta);
      assert(fs.existsSync(fullPath), `${ruta} mora postojati`);
    }
  });

  // ── Konstante ─────────────────────────────────────────────────────────────
  await test('Konstante su ažurirane za AI IQ World Bank modul', () => {
    assertEqual(APP_VERSION, '54.3.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1274, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1140, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1234, 'TOTAL_ROUTES');
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
