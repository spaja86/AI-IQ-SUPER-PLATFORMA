// Autofinish #1335 — Gejming Likovi Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-gejming-likovi-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/gejming-likovi/route';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_GEJMING_ENTITETA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Gejming Likovi — Route Coverage Test Suite (#1335)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/gejming-likovi/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');
  const libPath = path.resolve(process.cwd(), 'src/lib/gejming-likovi.ts');
  const pagePath = path.resolve(process.cwd(), 'src/app/gejming-likovi/page.tsx');
  const loadingPath = path.resolve(process.cwd(), 'src/app/gejming-likovi/loading.tsx');
  const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/gejming-likovi-page.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Lib fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('Page fajl postoji', () => {
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
  });

  await test('Loading fajl postoji', () => {
    assert(fs.existsSync(loadingPath), `${loadingPath} ne postoji`);
  });

  await test('Sekvence fajl postoji', () => {
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('buildGejmingLikovi'), 'Nedostaje buildGejmingLikovi');
    assert(apiRouteSource.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(apiRouteSource.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(apiRouteSource.includes('Industrija Gejming Likova'), 'Nedostaje naziv sistema');
  });

  await test('GET vraća 200 i ispravan payload', async () => {
    const request = new Request('http://localhost/api/gejming-likovi', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');

    const data = body['data'] as Record<string, unknown>;
    assertEqual(data['sistem'] as string, 'Industrija Gejming Likova', 'sistem');
    assertEqual(data['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof data['opis'] === 'string', 'opis string');
    assert(typeof data['rezultat'] === 'object' && data['rezultat'] !== null, 'rezultat objekat');

    const rezultat = data['rezultat'] as Record<string, unknown>;
    assertEqual(rezultat['status'] as string, 'aktivan', 'rezultat.status');
    assert(typeof rezultat['pregled'] === 'object', 'rezultat.pregled objekat');
    assert(Array.isArray(rezultat['entiteti']), 'rezultat.entiteti niz');
    assert(Array.isArray(rezultat['poTipu']), 'rezultat.poTipu niz');
    assert(Array.isArray(rezultat['poKategoriji']), 'rezultat.poKategoriji niz');
    assert(Array.isArray(rezultat['poIgrici']), 'rezultat.poIgrici niz');
  });

  await test('Pregled sadrži ispravne tipove podataka', async () => {
    const request = new Request('http://localhost/api/gejming-likovi', {
      headers: { 'x-forwarded-for': '127.0.0.2' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const rezultat = data['rezultat'] as Record<string, unknown>;
    const pregled = rezultat['pregled'] as Record<string, unknown>;

    assert(typeof pregled['ukupnoEntiteta'] === 'number', 'ukupnoEntiteta number');
    assert(typeof pregled['likovaIgravih'] === 'number', 'likovaIgravih number');
    assert(typeof pregled['npcLikova'] === 'number', 'npcLikova number');
    assert(typeof pregled['objekata'] === 'number', 'objekata number');
    assert(typeof pregled['subjekata'] === 'number', 'subjekata number');
    assert(typeof pregled['okruzenja'] === 'number', 'okruzenja number');
    assert(typeof pregled['kategorijaCount'] === 'number', 'kategorijaCount number');
    assert(typeof pregled['vezanihIgrica'] === 'number', 'vezanihIgrica number');
    assert((pregled['ukupnoEntiteta'] as number) > 0, 'ukupnoEntiteta > 0');
    assertEqual(
      pregled['ukupnoEntiteta'] as number,
      TOTAL_GEJMING_ENTITETA,
      'ukupnoEntiteta === TOTAL_GEJMING_ENTITETA',
    );
  });

  await test('Entiteti sadrže ispravan format', async () => {
    const request = new Request('http://localhost/api/gejming-likovi', {
      headers: { 'x-forwarded-for': '127.0.0.3' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const rezultat = data['rezultat'] as Record<string, unknown>;
    const entiteti = rezultat['entiteti'] as Array<Record<string, unknown>>;

    assert(entiteti.length > 0, 'entiteti nije prazan');
    const entitet = entiteti[0]!;
    assert(typeof entitet['id'] === 'string', 'entitet.id string');
    assert(typeof entitet['naziv'] === 'string', 'entitet.naziv string');
    assert(typeof entitet['tip'] === 'string', 'entitet.tip string');
    assert(typeof entitet['kategorijaDizajna'] === 'string', 'entitet.kategorijaDizajna string');
    assert(typeof entitet['igricaId'] === 'string', 'entitet.igricaId string');
    assert(Array.isArray(entitet['dimenzije']), 'entitet.dimenzije niz');
    assert(Array.isArray(entitet['atributi']), 'entitet.atributi niz');
    assert(Array.isArray(entitet['sposobnosti']), 'entitet.sposobnosti niz');
    assert(typeof entitet['vizuelniStil'] === 'string', 'entitet.vizuelniStil string');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1337, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1159, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1260, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2364, 'TOTAL_DIAGNOSTIKA baseline');
    assertEqual(TOTAL_GEJMING_ENTITETA, 45, 'TOTAL_GEJMING_ENTITETA');
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
