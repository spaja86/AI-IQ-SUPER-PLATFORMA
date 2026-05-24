// Autofinish #1376 — Brouvzer Inkognito Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/brouvzer-inkognito-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';
import { GET } from '../../app/api/brouvzer-inkognito-status/route';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

const _lintUseHelpers = [assertEqual, isObject];
void _lintUseHelpers;

async function runTests(): Promise<void> {
  console.log('\n🕵️ Brouvzer Inkognito Status — Route Coverage Test Suite (#1376)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/brouvzer-inkognito-status/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET handler', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('Ruta importuje iz brouvzer-inkognito', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('brouvzer-inkognito'), 'Nedostaje import iz brouvzer-inkognito');
  });

  await test('GET smoke — vraća 200', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');
  });

  await test('GET — X-App-Version header prisutan', async () => {
    const response = await GET();
    const ver = response.headers.get('X-App-Version');
    assert(ver !== null, 'X-App-Version header nedostaje');
    assertEqual(ver, APP_VERSION, 'X-App-Version');
  });

  await test('GET — Cache-Control header prisutan', async () => {
    const response = await GET();
    const cc = response.headers.get('Cache-Control');
    assert(cc !== null && cc.length > 0, 'Cache-Control header nedostaje');
  });

  await test('GET — body.status === aktivan', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
  });

  await test('GET — body.verzija === APP_VERSION', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
  });

  await test('GET — body.inkognito je objekat', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assert(isObject(body['inkognito']), 'body.inkognito mora biti objekat');
  });

  await test('GET — inkognito.dostupno je boolean', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const ink = body['inkognito'] as Record<string, unknown>;
    assert(typeof ink['dostupno'] === 'boolean', 'inkognito.dostupno mora biti boolean');
    assertEqual(ink['dostupno'] as boolean, true, 'inkognito.dostupno mora biti true');
  });

  await test('GET — inkognito.pravilaPrivatnosti — istorija i bookmarkovi false, auth true', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const ink = body['inkognito'] as Record<string, unknown>;
    const pravila = ink['pravilaPrivatnosti'] as Record<string, unknown>;
    assert(isObject(pravila), 'pravilaPrivatnosti mora biti objekat');
    assertEqual(pravila['istorijaSacuvana'] as boolean, false, 'istorijaSacuvana mora biti false');
    assertEqual(pravila['bookmarkoviSacuvani'] as boolean, false, 'bookmarkoviSacuvani mora biti false');
    assertEqual(pravila['authAktivan'] as boolean, true, 'authAktivan mora biti true');
    assertEqual(pravila['sandboxNepromenjen'] as boolean, true, 'sandboxNepromenjen mora biti true');
  });

  await test('GET — inkognito.mogucnosti je neprazan niz', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const ink = body['inkognito'] as Record<string, unknown>;
    assert(Array.isArray(ink['mogucnosti']), 'inkognito.mogucnosti mora biti niz');
    assert((ink['mogucnosti'] as unknown[]).length > 0, 'inkognito.mogucnosti mora biti neprazan');
  });

  await test('GET — inkognito.featureFlag prisutan', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const ink = body['inkognito'] as Record<string, unknown>;
    assert(isObject(ink['featureFlag']), 'inkognito.featureFlag mora biti objekat');
    const ff = ink['featureFlag'] as Record<string, unknown>;
    assertEqual(ff['id'] as string, 'brouvzer-inkognito-mode', 'featureFlag.id');
    assertEqual(ff['strategy'] as string, 'enabled', 'featureFlag.strategy');
  });

  await test('GET — timestamp je validan ISO string', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['timestamp'] === 'string', 'timestamp mora biti string');
    assert(!isNaN(Date.parse(body['timestamp'] as string)), 'timestamp mora biti validan ISO datum');
  });

  await test('Konstante su ažurirane za #1376', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT >= 1376, 'AUTOFINISH_COUNT >= 1376');
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
