// Autofinish #1377 — Brouvzer Tab Menadžer Status Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/brouvzer-tab-menadzer-status-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';
import {
  TAB_MENADZER_MAX_AKTIVNIH,
  TAB_MENADZER_MAX_PINIRANIH,
  TAB_MENADZER_MAX_GRUPA,
  trebaPokrenuthHibernaciju,
  mozePinirati,
  mozeKreiratiGrupu,
  getTabItemClass,
} from '../../lib/brouvzer-tab-menadzer';
import { GET } from '../../app/api/brouvzer-tab-menadzer-status/route';

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

async function runTests(): Promise<void> {
  console.log('\n📑 Brouvzer Tab Menadžer Status — Route Coverage Test Suite (#1377)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/brouvzer-tab-menadzer-status/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/brouvzer-tab-menadzer.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Lib fajl brouvzer-tab-menadzer.ts postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('Ruta eksportuje GET handler', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('Ruta importuje iz brouvzer-tab-menadzer', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('brouvzer-tab-menadzer'), 'Nedostaje import iz brouvzer-tab-menadzer');
  });

  // ─── Lib unit testovi ─────────────────────────────────────────────────────

  await test('trebaPokrenuthHibernaciju: false kada <= limit', () => {
    assertEqual(trebaPokrenuthHibernaciju(TAB_MENADZER_MAX_AKTIVNIH), false, 'na limitu = false');
    assertEqual(trebaPokrenuthHibernaciju(1), false, 'malo tabova = false');
  });

  await test('trebaPokrenuthHibernaciju: true kada > limit', () => {
    assertEqual(trebaPokrenuthHibernaciju(TAB_MENADZER_MAX_AKTIVNIH + 1), true, 'iznad limita = true');
  });

  await test('mozePinirati: true kada ispod limita', () => {
    assertEqual(mozePinirati(0), true, '0 piniranih = može');
    assertEqual(mozePinirati(TAB_MENADZER_MAX_PINIRANIH - 1), true, 'ispod limita = može');
  });

  await test('mozePinirati: false kada dostignuto max', () => {
    assertEqual(mozePinirati(TAB_MENADZER_MAX_PINIRANIH), false, 'na limitu = ne može');
    assertEqual(mozePinirati(TAB_MENADZER_MAX_PINIRANIH + 5), false, 'iznad limita = ne može');
  });

  await test('mozeKreiratiGrupu: true kada ispod limita', () => {
    assertEqual(mozeKreiratiGrupu(0), true, '0 grupa = može');
    assertEqual(mozeKreiratiGrupu(TAB_MENADZER_MAX_GRUPA - 1), true, 'ispod limita = može');
  });

  await test('mozeKreiratiGrupu: false kada dostignut max', () => {
    assertEqual(mozeKreiratiGrupu(TAB_MENADZER_MAX_GRUPA), false, 'na limitu = ne može');
  });

  await test('getTabItemClass: vraća string za sva stanja', () => {
    const aktivan = getTabItemClass('aktivan');
    const hiberniran = getTabItemClass('hiberniran');
    const piniran = getTabItemClass('piniran');
    assert(typeof aktivan === 'string' && aktivan.length > 0, 'aktivan mora biti string');
    assert(typeof hiberniran === 'string' && hiberniran.length > 0, 'hiberniran mora biti string');
    assert(typeof piniran === 'string' && piniran.length > 0, 'piniran mora biti string');
    assert(aktivan !== hiberniran, 'aktivan i hiberniran moraju se razlikovati');
    assert(aktivan !== piniran, 'aktivan i piniran moraju se razlikovati');
  });

  // ─── Route testovi ────────────────────────────────────────────────────────

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

  await test('GET — body.tabMenadzer je objekat', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assert(isObject(body['tabMenadzer']), 'body.tabMenadzer mora biti objekat');
  });

  await test('GET — tabMenadzer.dostupno === true', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const tm = body['tabMenadzer'] as Record<string, unknown>;
    assertEqual(tm['dostupno'] as boolean, true, 'tabMenadzer.dostupno mora biti true');
  });

  await test('GET — tabMenadzer.mogucnosti je neprazan niz', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const tm = body['tabMenadzer'] as Record<string, unknown>;
    assert(Array.isArray(tm['mogucnosti']), 'tabMenadzer.mogucnosti mora biti niz');
    assert((tm['mogucnosti'] as unknown[]).length > 0, 'tabMenadzer.mogucnosti mora biti neprazan');
  });

  await test('GET — tabMenadzer.limiti sadrži ispravne vrednosti', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const tm = body['tabMenadzer'] as Record<string, unknown>;
    const limiti = tm['limiti'] as Record<string, unknown>;
    assert(isObject(limiti), 'limiti mora biti objekat');
    assertEqual(limiti['maxAktivnih'] as number, TAB_MENADZER_MAX_AKTIVNIH, 'maxAktivnih');
    assertEqual(limiti['maxPiniranih'] as number, TAB_MENADZER_MAX_PINIRANIH, 'maxPiniranih');
    assertEqual(limiti['maxGrupa'] as number, TAB_MENADZER_MAX_GRUPA, 'maxGrupa');
  });

  await test('GET — tabMenadzer.featureFlag prisutan', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const tm = body['tabMenadzer'] as Record<string, unknown>;
    assert(isObject(tm['featureFlag']), 'tabMenadzer.featureFlag mora biti objekat');
    const ff = tm['featureFlag'] as Record<string, unknown>;
    assertEqual(ff['id'] as string, 'brouvzer-tab-menadzer', 'featureFlag.id');
    assertEqual(ff['strategy'] as string, 'enabled', 'featureFlag.strategy');
  });

  await test('GET — tabMenadzer.funkcionalnosti — sve aktivne', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    const tm = body['tabMenadzer'] as Record<string, unknown>;
    const funk = tm['funkcionalnosti'] as Record<string, unknown>;
    assert(isObject(funk), 'funkcionalnosti mora biti objekat');
    assertEqual(funk['multiTab'] as boolean, true, 'multiTab');
    assertEqual(funk['tabGrupe'] as boolean, true, 'tabGrupe');
    assertEqual(funk['hibernacija'] as boolean, true, 'hibernacija');
    assertEqual(funk['pinTabovi'] as boolean, true, 'pinTabovi');
    assertEqual(funk['sinhronizacija'] as boolean, true, 'sinhronizacija');
  });

  await test('GET — timestamp je validan ISO string', async () => {
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['timestamp'] === 'string', 'timestamp mora biti string');
    assert(!isNaN(Date.parse(body['timestamp'] as string)), 'timestamp mora biti validan ISO datum');
  });

  await test('Konstante su ažurirane za #1377', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT >= 1377, 'AUTOFINISH_COUNT >= 1377');
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
