// Autofinish #1298 — DIGATALNA EUREKA Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/digatalna-eureka/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n💡 DIGATALNA EUREKA — Route Coverage Test (#1298)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/digatalna-eureka/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi buildDigatalnaEureka', () => {
    assert(apiRouteSource.includes('buildDigatalnaEureka'), 'API route ne koristi buildDigatalnaEureka');
  });

  await test('API ruta ima auth, rate limit i standardne API odgovore', () => {
    assert(apiRouteSource.includes('verifyUserFromToken'), 'API route nema auth proveru');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'API route nema rate limiting');
    assert(apiRouteSource.includes('apiSuccess'), 'API route nema apiSuccess');
    assert(apiRouteSource.includes('apiError'), 'API route nema apiError');
    assert(apiRouteSource.includes('apiInternalError'), 'API route nema apiInternalError');
  });

  await test('GET bez auth vraća 401 Unauthorized', async () => {
    const request = new Request('http://localhost/api/digatalna-eureka');
    const response = await GET(request as never);
    assertEqual(response.status, 401, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['code'] as string, 'UNAUTHORIZED', 'code');
    assert(typeof body['error'] === 'string' && (body['error'] as string).length > 0, 'error');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1308, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1158, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1258, 'TOTAL_ROUTES baseline');
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
