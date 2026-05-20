// Autofinish #1306 — AIIQ World Bank Licencni Compliance Izvestaj Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/aiiq-world-bank-licencni-compliance-izvestaj/route';
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
  console.log('\n📋 AIIQ World Bank Licencni Compliance Izvestaj — Route Coverage Test (#1306)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/aiiq-world-bank-licencni-compliance-izvestaj/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne funkcije', () => {
    assert(apiRouteSource.includes('getLicencniComplianceIzvestaj'), 'Nedostaje getLicencniComplianceIzvestaj');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
  });

  await test('GET vraća očekivani payload', async () => {
    const request = {
      headers: new Headers({ 'x-forwarded-for': `1306.${Date.now()}` }),
      nextUrl: new URL('http://localhost/api/aiiq-world-bank-licencni-compliance-izvestaj?periodTip=kvartalni'),
    } as never;

    const response = await GET(request);
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;

    assert(data && typeof data === 'object', 'data payload mora postojati');
    assertEqual(data['sistem'] as string, 'AI IQ WORLD BANK Licencni Compliance Izvestaj', 'sistem');
    assertEqual(data['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof data['izvestaj'] === 'object' && data['izvestaj'] !== null, 'izvestaj mora biti objekat');
  });

  await test('Konstante su ažurirane bez promene broja ruta', () => {
    assertEqual(APP_VERSION, '57.7.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1308, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
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
