// Autofinish #1341 — Autofinish Dependency Audit Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-dependency-audit-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-dependency-audit/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Dependency Audit — Route Coverage Test Suite (#1341)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-dependency-audit/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('checkUpgrades'), 'Nedostaje checkUpgrades');
    assert(apiRouteSource.includes('KNOWN_SAFE'), 'Nedostaje KNOWN_SAFE lista');
    assert(apiRouteSource.includes('X-App-Version'), 'Nedostaje X-App-Version header');
    assert(apiRouteSource.includes('Cache-Control'), 'Nedostaje Cache-Control header');
  });

  await test('GET vraća 200, payload i heder-e', async () => {
    const request = new Request('http://localhost/api/autofinish-dependency-audit', {
      headers: { 'x-forwarded-for': '127.0.0.41' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');
    assertEqual(body['status'] as string, 'clean', 'status');
    assert(typeof body['ukupnoProvera'] === 'number', 'ukupnoProvera number');
    assert(typeof body['sigurnih'] === 'number', 'sigurnih number');
    assert(typeof body['advisories'] === 'number', 'advisories number');
    assert(typeof body['zastarjelih'] === 'number', 'zastarjelih number');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    const zavisnosti = body['zavisnosti'] as Array<Record<string, unknown>>;
    assert(Array.isArray(zavisnosti), 'zavisnosti niz');
    assert(zavisnosti.length > 0, 'zavisnosti nije prazan');
    const prva = zavisnosti[0]!;
    assert(typeof prva['paket'] === 'string', 'paket string');
    assert(typeof prva['verzija'] === 'string', 'verzija string');
    assert(typeof prva['status'] === 'string', 'status string');

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=3600, stale-while-revalidate=86400',
      'Cache-Control',
    );
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1337, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1159, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1260, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2364, 'TOTAL_DIAGNOSTIKA baseline');
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
