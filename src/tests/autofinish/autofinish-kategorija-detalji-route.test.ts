// Autofinish #1357 — Autofinish Kategorija Detalji Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-kategorija-detalji-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET, VALIDNE_KATEGORIJE } from '../../app/api/autofinish-kategorija-detalji/route';
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

function makeRequest(kategorija?: string): Request {
  const suffix = kategorija ? `?kategorija=${encodeURIComponent(kategorija)}` : '';
  return new Request(`http://localhost/api/autofinish-kategorija-detalji${suffix}`, {
    headers: { 'x-forwarded-for': '127.0.1.10' },
  });
}

async function runTests(): Promise<void> {
  console.log('\n🏁 Autofinish Kategorija Detalji — Route Coverage Test Suite (#1357)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/autofinish-kategorija-detalji/route.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta koristi očekivane gradivne blokove', () => {
    assert(routeSource.includes('VALIDNE_KATEGORIJE'), 'Nedostaje VALIDNE_KATEGORIJE');
    assert(routeSource.includes('getAutofinishKategorijaDetalji'), 'Nedostaje helper poziv');
    assert(routeSource.includes(`Parametar 'kategorija' je obavezan`), 'Nedostaje obavezna validacija');
    assert(routeSource.includes('Cache-Control'), 'Nedostaje Cache-Control header');
  });

  await test('GET bez kategorije vraća 400 i listu validnih kategorija', async () => {
    const response = await GET(makeRequest() as unknown as Request);
    assertEqual(response.status, 400, 'status');
    assertEqual(response.headers.get('X-App-Version'), APP_VERSION, 'X-App-Version');
    assertEqual(
      response.headers.get('X-Autofinish-Iteracija'),
      String(AUTOFINISH_COUNT),
      'X-Autofinish-Iteracija',
    );

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'INVALID_PARAMS', 'error');
    assert(typeof body['poruka'] === 'string' && (body['poruka'] as string).includes('obavezan'), 'poruka');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');
    assert(Array.isArray(body['validneKategorije']), 'validneKategorije niz');
    assertEqual(
      JSON.stringify(body['validneKategorije']),
      JSON.stringify(VALIDNE_KATEGORIJE),
      'validneKategorije',
    );
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('GET sa nevalidnom kategorijom vraća 400 i naziv problematične vrednosti', async () => {
    const response = await GET(makeRequest('nepostojeca') as unknown as Request);
    assertEqual(response.status, 400, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['error'] as string, 'INVALID_PARAMS', 'error');
    assert(
      typeof body['poruka'] === 'string' && (body['poruka'] as string).includes('"nepostojeca"'),
      'poruka sadrži nevalidnu vrednost',
    );
    assert(Array.isArray(body['validneKategorije']), 'validneKategorije niz');
  });

  await test('GET za helper kategoriju vraća 200, detalje i cache headere', async () => {
    const response = await GET(makeRequest('helper') as unknown as Request);
    assertEqual(response.status, 200, 'status');
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

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assertEqual(body['kategorija'] as string, 'helper', 'kategorija');
    assertEqual(body['labelSr'] as string, 'Helper funkcije', 'labelSr');
    assert(typeof body['ukupno'] === 'number' && (body['ukupno'] as number) > 0, 'ukupno');
    assert(typeof body['udjel'] === 'number' && (body['udjel'] as number) >= 0, 'udjel');
    assert(typeof body['prvaIteracija'] === 'number', 'prvaIteracija');
    assert(typeof body['posljednjaIteracija'] === 'number', 'posljednjaIteracija');
    assert(
      (body['prvaIteracija'] as number) <= (body['posljednjaIteracija'] as number),
      'prvaIteracija <= posljednjaIteracija',
    );
    assert(Array.isArray(body['iteracije']) && (body['iteracije'] as unknown[]).length > 0, 'iteracije niz');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('GET za api-route kategoriju vraća traženu kategoriju i iteracije', async () => {
    const response = await GET(makeRequest('api-route') as unknown as Request);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['kategorija'] as string, 'api-route', 'kategorija');
    assertEqual(body['labelSr'] as string, 'API rute', 'labelSr');
    assert(Array.isArray(body['iteracije']) && (body['iteracije'] as unknown[]).length > 0, 'iteracije niz');
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
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
