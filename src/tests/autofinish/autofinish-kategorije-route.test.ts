// Autofinish #1321 — Autofinish Kategorije Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-kategorije-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-kategorije/route';
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
  console.log('\n🏁 Autofinish Kategorije — Route Coverage Test Suite (#1321)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-kategorije/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const request = new Request('http://localhost/api/autofinish-kategorije', {
    headers: { 'x-forwarded-for': '127.0.0.1' },
  });

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(
      apiRouteSource.includes('getAutofinishKategorijePorHijarhijama'),
      'Nedostaje getAutofinishKategorijePorHijarhijama',
    );
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('X-Autofinish-Iteracija'), 'Nedostaje X-Autofinish-Iteracija header');
  });

  await test('GET vraća 200, payload i heder-e', async () => {
    const response = await GET(request);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof body['ukupnoIteracija'] === 'number', 'ukupnoIteracija number');
    assert(typeof body['ukupnoKategorija'] === 'number', 'ukupnoKategorija number');
    assert(Array.isArray(body['kategorije']), 'kategorije niz');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');

    const kategorije = body['kategorije'] as Array<Record<string, unknown>>;
    assert(kategorije.length > 0, 'kategorije nije prazan');
    const helper = kategorije.find((k) => k['kategorija'] === 'helper');
    assert(helper !== undefined, 'helper kategorija prisutna');
    if (helper) {
      assert(typeof helper['labelSr'] === 'string', 'helper.labelSr string');
      assert(typeof helper['ukupno'] === 'number', 'helper.ukupno number');
      assert(Array.isArray(helper['iteracije']), 'helper.iteracije niz');
    }

    assertEqual(
      response.headers.get('Cache-Control'),
      'public, s-maxage=600, stale-while-revalidate=3600',
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
    assertEqual(APP_VERSION, '59.1.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1322, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1158, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1258, 'TOTAL_ROUTES');
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
