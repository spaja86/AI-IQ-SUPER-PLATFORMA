// Autofinish #1299 — GitHub Billing AI IQ World Bank Route Coverage Test

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/github-billing-aiiq-worldbank/route';
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
  console.log('\n🏦 GitHub Billing AI IQ World Bank — Route Coverage Test (#1299)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/github-billing-aiiq-worldbank/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi GitHub billing module i konstante', () => {
    assert(apiRouteSource.includes('getGitHubBillingStatistike'), 'API route ne koristi getGitHubBillingStatistike');
    assert(apiRouteSource.includes('gitHubBillingRacun'), 'API route ne koristi gitHubBillingRacun');
    assert(apiRouteSource.includes('APP_VERSION'), 'API route ne koristi APP_VERSION');
    assert(apiRouteSource.includes('AUTOFINISH_COUNT'), 'API route ne koristi AUTOFINISH_COUNT');
  });

  await test('GET vraća očekivani payload', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');
    const body = (await response.json()) as Record<string, unknown>;

    assertEqual(body['naziv'] as string, 'GitHub Billing — AI IQ World Bank Integracija', 'naziv');
    assertEqual(body['appVerzija'] as string, APP_VERSION, 'appVerzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');
    assertEqual(body['status'] as string, 'aktivan', 'status payload');
    assert(typeof body['opis'] === 'string' && (body['opis'] as string).includes('AI IQ World Bank'), 'opis');
    assert(typeof body['timestamp'] === 'string' && !Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp');

    const statistike = body['statistike'] as Record<string, unknown>;
    assert(statistike !== null && typeof statistike === 'object', 'statistike objekat');
    assertEqual(statistike['verzija'] as string, APP_VERSION, 'statistike.verzija');
    assert(typeof statistike['ukupnoIznosUSD'] === 'number', 'statistike.ukupnoIznosUSD');

    const billingRacun = body['billingRacun'] as Record<string, unknown>;
    assertEqual(billingRacun['banka'] as string, 'AI IQ World Bank', 'billingRacun.banka');
  });

  await test('Konstante su ažurirane bez promene broja ruta', () => {
    assertEqual(APP_VERSION, '57.0.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1301, 'AUTOFINISH_COUNT');
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
