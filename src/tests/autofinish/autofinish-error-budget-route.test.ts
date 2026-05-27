// Autofinish #1372 — Autofinish Error Budget Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-error-budget-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-error-budget/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
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
  console.log('\n🏁 Autofinish Error Budget — Route Coverage Test Suite (#1372)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-error-budget/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishErrorBudget'), 'Nedostaje getAutofinishErrorBudget');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('Retry-After'), 'Nedostaje Retry-After');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
  });

  await test('GET vraća 200, payload i heder-e', async () => {
    const request = new Request('http://localhost/api/autofinish-error-budget', {
      headers: { 'x-forwarded-for': '127.0.0.72' },
    });

    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof body['ukupnoServisa'] === 'number', 'ukupnoServisa number');
    assert(typeof body['zdravih'] === 'number', 'zdravih number');
    assert(typeof body['uUpozorenju'] === 'number', 'uUpozorenju number');
    assert(typeof body['kriticnih'] === 'number', 'kriticnih number');
    assert(typeof body['iscrpljenih'] === 'number', 'iscrpljenih number');
    assert(typeof body['prosjecnaPotrosenjaOst'] === 'number', 'prosjecnaPotrosenjaOst number');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    const servisi = body['servisi'] as Array<Record<string, unknown>>;
    assert(Array.isArray(servisi), 'servisi niz');
    assert(servisi.length > 0, 'servisi nije prazan');
    const apiGateway = servisi.find((s) => s['id'] === 'api-gateway');
    assert(!!apiGateway, 'postoji api-gateway servis');
    assert(typeof apiGateway['sloTarget'] === 'number', 'api-gateway sloTarget number');
    assert(typeof apiGateway['potrosenoPct'] === 'number', 'api-gateway potrosenoPct number');
    assert(typeof apiGateway['status'] === 'string', 'api-gateway status string');

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=300, stale-while-revalidate=1800',
      'Cache-Control',
    );
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(
      response.headers.get('X-Autofinish-Iteracija'),
      String(AUTOFINISH_COUNT),
      'X-Autofinish-Iteracija',
    );
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1372, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1166, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1270, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2368, 'TOTAL_DIAGNOSTIKA baseline');
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
