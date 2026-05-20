// Autofinish #1323 — Autofinish Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_API_ROUTES,
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
  console.log('\n🏁 Autofinish — Route Coverage Test Suite (#1323)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('DEFAULT_PAGE_SIZE'), 'Nedostaje DEFAULT_PAGE_SIZE');
    assert(apiRouteSource.includes('MAX_PAGE_SIZE'), 'Nedostaje MAX_PAGE_SIZE');
    assert(apiRouteSource.includes('getAutofinishOpis'), 'Nedostaje getAutofinishOpis');
  });

  await test('GET vraća 200 i podrazumevanu paginaciju istorije', async () => {
    const request = new Request('http://localhost/api/autofinish', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['naziv'] as string, 'Autofinish Sistem', 'naziv');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assertEqual(body['autofinishIteracija'] as number, AUTOFINISH_COUNT, 'autofinishIteracija');

    const trenutniStatus = body['trenutniStatus'] as Record<string, unknown>;
    assertEqual(trenutniStatus['iteracija'] as number, AUTOFINISH_COUNT, 'trenutniStatus.iteracija');
    assertEqual(trenutniStatus['cilj'] as number, AUTOFINISH_TARGET, 'trenutniStatus.cilj');
    assert(typeof trenutniStatus['procenat'] === 'string', 'trenutniStatus.procenat string');

    const platforma = body['platforma'] as Record<string, unknown>;
    assertEqual(platforma['apiRute'] as number, TOTAL_API_ROUTES, 'platforma.apiRute');
    assertEqual(platforma['ukupnoRuta'] as number, TOTAL_ROUTES, 'platforma.ukupnoRuta');

    const istorija = body['istorija'] as Array<Record<string, unknown>>;
    assert(Array.isArray(istorija), 'istorija niz');
    assertEqual(istorija.length, 50, 'istorija default page size');
    assertEqual(istorija[0]?.['iteracija'] as number, 1, 'istorija[0].iteracija');
    assert(typeof istorija[0]?.['opis'] === 'string', 'istorija[0].opis string');

    const paginacija = body['paginacija'] as Record<string, unknown>;
    assertEqual(paginacija['ukupno'] as number, AUTOFINISH_COUNT, 'paginacija.ukupno');
    assertEqual(paginacija['pageSize'] as number, 50, 'paginacija.pageSize');
    assertEqual(paginacija['offset'] as number, 0, 'paginacija.offset');
    assertEqual(paginacija['sledeci'] as number, 50, 'paginacija.sledeci');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
  });

  await test('GET poštuje offset i clamp-uje pageSize na max 100', async () => {
    const request = new Request('http://localhost/api/autofinish?pageSize=999&offset=100', {
      headers: { 'x-forwarded-for': '127.0.0.2' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    const istorija = body['istorija'] as Array<Record<string, unknown>>;
    const paginacija = body['paginacija'] as Record<string, unknown>;

    assertEqual(istorija.length, 100, 'istorija clamp na 100');
    assertEqual(istorija[0]?.['iteracija'] as number, 101, 'istorija[0].iteracija');
    assertEqual(paginacija['pageSize'] as number, 100, 'paginacija.pageSize');
    assertEqual(paginacija['offset'] as number, 100, 'paginacija.offset');
    assertEqual(paginacija['sledeci'] as number, 200, 'paginacija.sledeci');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.2.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1323, 'AUTOFINISH_COUNT');
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
