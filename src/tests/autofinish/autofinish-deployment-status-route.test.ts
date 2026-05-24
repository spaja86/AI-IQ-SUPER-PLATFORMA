// Autofinish #1367 — Autofinish Deployment Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-deployment-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-deployment-status/route';
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
  console.log('\n🏁 Autofinish Deployment Status — Route Coverage Test Suite (#1367)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-deployment-status/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishDeploymentStatus'), 'Nedostaje getAutofinishDeploymentStatus');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
    assert(apiRouteSource.includes('Retry-After'), 'Nedostaje Retry-After');
  });

  await test('GET vraća 200, payload i heder-e', async () => {
    const request = new Request('http://localhost/api/autofinish-deployment-status', {
      headers: { 'x-forwarded-for': '127.0.0.72' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof body['ukupnoDeploymenata'] === 'number', 'ukupnoDeploymenata number');
    assert(typeof body['aktivnih'] === 'number', 'aktivnih number');
    assert(typeof body['degradovanih'] === 'number', 'degradovanih number');
    assert(typeof body['prosjecnoZdravlje'] === 'number', 'prosjecnoZdravlje number');
    assert(Array.isArray(body['deployments']), 'deployments niz');
    assertEqual((body['deployments'] as unknown[]).length, body['ukupnoDeploymenata'] as number, 'deployments.length');

    const firstDeployment = (body['deployments'] as Record<string, unknown>[])[0];
    assert(typeof firstDeployment['id'] === 'string', 'deployment.id string');
    assert(typeof firstDeployment['okruzenje'] === 'string', 'deployment.okruzenje string');
    assert(typeof firstDeployment['status'] === 'string', 'deployment.status string');
    assert(typeof firstDeployment['zdravlje'] === 'number', 'deployment.zdravlje number');
    assert(typeof firstDeployment['url'] === 'string', 'deployment.url string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=30, stale-while-revalidate=120',
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
    assertEqual(APP_VERSION, '59.40.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1370, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1166, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1270, 'TOTAL_ROUTES');
    assertEqual(TOTAL_DIAGNOSTIKA, 2368, 'TOTAL_DIAGNOSTIKA');
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
