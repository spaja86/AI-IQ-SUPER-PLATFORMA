// Autofinish #1330 — Autofinish Autologin Rikvrst Eksponencijalne Funkcije Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/autofinish-autologin-rikvrst-eksponencijalne-funkcije-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { GET } from '../../app/api/autofinish-autologin-rikvrst-eksponencijalne-funkcije/route';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_ROUTES } from '../../lib/constants';

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
  console.log('\n🏁 Autofinish Autologin Rikvrst Eksponencijalne Funkcije — Route Coverage Test Suite (#1330)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/autofinish-autologin-rikvrst-eksponencijalne-funkcije/route.ts');
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    assert(apiRouteSource.includes('eksponencijalneFunkcije'), 'Nedostaje eksponencijalneFunkcije');
    assert(apiRouteSource.includes('getOktavniSistemPregled'), 'Nedostaje getOktavniSistemPregled');
    assert(apiRouteSource.includes('getFiguracioniCentar'), 'Nedostaje getFiguracioniCentar');
    assert(apiRouteSource.includes('NextResponse.json'), 'Nedostaje NextResponse.json');
  });

  await test('GET vraća 200 i očekivanu strukturu payload-a', async () => {
    const response = await GET();
    assertEqual(response.status, 200, 'status');

    const body = (await response.json()) as Record<string, unknown>;
    assertEqual(body['status'] as string, 'aktivan', 'status');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['naziv'] === 'string' && (body['naziv'] as string).length > 0, 'naziv string');
    assert(typeof body['opis'] === 'string' && (body['opis'] as string).length > 0, 'opis string');
    assert(typeof body['kompanija'] === 'string' && (body['kompanija'] as string).length > 0, 'kompanija string');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');

    const iteracija = body['iteracija'] as Record<string, unknown>;
    assertEqual(iteracija['broj'] as number, AUTOFINISH_COUNT, 'iteracija.broj');
    assertEqual(iteracija['cilj'] as number, AUTOFINISH_TARGET, 'iteracija.cilj');
    assert(typeof iteracija['ciljFormatiran'] === 'string', 'iteracija.ciljFormatiran string');
    assert(typeof iteracija['procenat'] === 'string' && (iteracija['procenat'] as string).endsWith('%'), 'iteracija.procenat %');

    const rikvrst = body['rikvrst'] as Record<string, unknown>;
    assertEqual(rikvrst['ukupnoOktava'] as number, 8, 'rikvrst.ukupnoOktava');
    assert(typeof rikvrst['ukupnaRikvrstSnaga'] === 'number', 'rikvrst.ukupnaRikvrstSnaga number');
    assert(typeof rikvrst['rasponRikvrst'] === 'number', 'rikvrst.rasponRikvrst number');
    assert(Array.isArray(rikvrst['oktave']), 'rikvrst.oktave niz');
    const oktave = rikvrst['oktave'] as Array<Record<string, unknown>>;
    assertEqual(oktave.length, 8, 'rikvrst.oktave.length');
    for (const oktava of oktave) {
      assert(typeof oktava['oktava'] === 'number', 'oktava.oktava number');
      assert(typeof oktava['naziv'] === 'string', 'oktava.naziv string');
      assert(typeof oktava['formula'] === 'string', 'oktava.formula string');
      assert(typeof oktava['inverznaFormula'] === 'string', 'oktava.inverznaFormula string');
      assert(typeof oktava['rikvrstSnaga'] === 'number', 'oktava.rikvrstSnaga number');
      assert(Array.isArray(oktava['inverzneVrednosti']), 'oktava.inverzneVrednosti niz');
    }

    const eksponencijalniPregled = body['eksponencijalniPregled'] as Record<string, unknown>;
    assert(typeof eksponencijalniPregled['ukupnaSnaga'] === 'number', 'eksponencijalniPregled.ukupnaSnaga number');
    assert(typeof eksponencijalniPregled['prosecnaSnaga'] === 'number', 'eksponencijalniPregled.prosecnaSnaga number');
    assert(typeof eksponencijalniPregled['globalniRastFaktor'] === 'number', 'eksponencijalniPregled.globalniRastFaktor number');
    assert(Array.isArray(eksponencijalniPregled['superPozicija']), 'eksponencijalniPregled.superPozicija niz');

    const figuracioniCentar = body['figuracioniCentar'] as Record<string, unknown>;
    assert(typeof figuracioniCentar['centroidX'] === 'number', 'figuracioniCentar.centroidX number');
    assert(typeof figuracioniCentar['centroidY'] === 'number', 'figuracioniCentar.centroidY number');
    assert(typeof figuracioniCentar['fokalnaSnaga'] === 'number', 'figuracioniCentar.fokalnaSnaga number');
    assert(typeof figuracioniCentar['harmonickiIndeks'] === 'number', 'figuracioniCentar.harmonickiIndeks number');
    assert(typeof figuracioniCentar['konvergencioniKoeficijent'] === 'number', 'figuracioniCentar.konvergencioniKoeficijent number');

    const zakoniKoda = body['zakoniKoda'] as Record<string, unknown>;
    assert(Object.keys(zakoniKoda).length === 5, 'zakoniKoda ima 5 stavki');

    const ekosistem = body['ekosistem'] as Record<string, unknown>;
    assertEqual(ekosistem['rute'] as number, TOTAL_ROUTES, 'ekosistem.rute');
    assertEqual(ekosistem['apiRute'] as number, TOTAL_API_ROUTES, 'ekosistem.apiRute');
    assertEqual(ekosistem['dijagnostike'] as number, TOTAL_DIAGNOSTIKA, 'ekosistem.dijagnostike');

    const autofinish = body['autofinish'] as Record<string, unknown>;
    assertEqual(autofinish['iteracija'] as number, AUTOFINISH_COUNT, 'autofinish.iteracija');
    assertEqual(autofinish['cilj'] as number, AUTOFINISH_TARGET, 'autofinish.cilj');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1330, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1158, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1258, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2364, 'TOTAL_DIAGNOSTIKA baseline');
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
