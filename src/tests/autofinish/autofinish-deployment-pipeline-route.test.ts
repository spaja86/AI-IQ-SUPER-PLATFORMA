// Autofinish #1366 — Autofinish Deployment Pipeline Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-deployment-pipeline-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-deployment-pipeline/route';
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
  console.log('\n🏁 Autofinish Deployment Pipeline — Route Coverage Test Suite (#1366)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-deployment-pipeline/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('getAutofinishDeploymentPipeline'), 'Nedostaje getAutofinishDeploymentPipeline');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
    assert(apiRouteSource.includes('Retry-After'), 'Nedostaje Retry-After');
  });

  await test('GET vraća 200, payload i heder-e', async () => {
    const request = new Request('http://localhost/api/autofinish-deployment-pipeline', {
      headers: { 'x-forwarded-for': '127.0.0.71' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof body['ukupnoPipeline'] === 'number', 'ukupnoPipeline number');
    assert(typeof body['aktivnih'] === 'number', 'aktivnih number');
    assert(typeof body['uspjesnih'] === 'number', 'uspjesnih number');
    assert(typeof body['neuspjesnih'] === 'number', 'neuspjesnih number');
    assert(typeof body['preskocenih'] === 'number', 'preskocenih number');
    assert(typeof body['prosjecnoTrajanjeSekundi'] === 'number', 'prosjecnoTrajanjeSekundi number');
    assert(Array.isArray(body['pipelines']), 'pipelines niz');
    assertEqual((body['pipelines'] as unknown[]).length, body['ukupnoPipeline'] as number, 'pipelines.length');

    const firstPipeline = (body['pipelines'] as Record<string, unknown>[])[0];
    assert(typeof firstPipeline['id'] === 'string', 'pipeline.id string');
    assert(typeof firstPipeline['servis'] === 'string', 'pipeline.servis string');
    assert(typeof firstPipeline['status'] === 'string', 'pipeline.status string');
    assert(Array.isArray(firstPipeline['faze']), 'pipeline.faze niz');
    assert((firstPipeline['faze'] as unknown[]).length > 0, 'pipeline.faze.length > 0');

    const firstFaza = (firstPipeline['faze'] as Record<string, unknown>[])[0];
    assert(typeof firstFaza['naziv'] === 'string', 'faza.naziv string');
    assert(typeof firstFaza['status'] === 'string', 'faza.status string');
    assert(typeof firstFaza['trajanjeSekundi'] === 'number', 'faza.trajanjeSekundi number');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=30, stale-while-revalidate=60',
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
    assertEqual(APP_VERSION, '59.42.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1372, 'AUTOFINISH_COUNT');
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
