// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Glavni Endžin Digitalne Industrije
// Kompanija SPAJA — Digitalna Industrija
// Pokretanje: npx tsx src/tests/glavni-endzin/glavni-endzin.test.ts

/**
 * Minimalista test runner — isti stil kao omega-auth.test.ts.
 * Testovi verifikuju sve ključne komponente Glavnog Endžina:
 *  - Spajanje svih endžina
 *  - Automatsko sklapanje proizvoda
 *  - Statistika
 *  - Evolucioni ciklusi
 *  - Helper funkcije
 */

import {
  glavniEndzinDigitalneIndustrije,
  getSvojeneEndzine,
  getSklopljeneProizvode,
  getEvolucijaCikluse,
  getGlavniEndzinStatistika,
  getSpojenePoTipu,
  getSklopljenePoTipu,
  getUkupnoPokrenutih,
  getKompletnostSistema,
  getGlavniEndzinPregled,
} from '../../lib/glavni-endzin-digitalne-industrije';

import { generisaniEngini } from '../../lib/spaja-generator-engine';
import { endzinNadIgricama } from '../../lib/io-openui-ao-gaming-platforma';
import { platforme } from '../../lib/platforme';
import { products } from '../../lib/products';
import { igrice } from '../../lib/igrice';
import { OMEGA_AI_PERSONA_UKUPNO } from '../../lib/constants';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(a: T, b: T, message?: string): void {
  if (a !== b) throw new Error(`${message ?? 'assertEqual'}: expected ${String(b)}, got ${String(a)}`);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n🏭⚙️ SpajaUltraOmegaCore -∞Ω+∞ — Glavni Endžin Test Suite\n');

  // ── Instanca Glavnog Endžina ─────────────────────────────────────────────

  console.log('📦 Glavni Endžin — Instanca');

  await test('id je ispravno postavljen', () => {
    assertEqual(glavniEndzinDigitalneIndustrije.id, 'glavni-endzin-digitalne-industrije', 'id');
  });

  await test('naziv sadrži "Glavni Endžin"', () => {
    assert(glavniEndzinDigitalneIndustrije.naziv.includes('Glavni'), 'naziv treba da sadrži Glavni');
  });

  await test('verzija je validna semver', () => {
    const parts = glavniEndzinDigitalneIndustrije.verzija.split('.');
    assert(parts.length === 3, 'treba da ima 3 dela');
    assert(parts.every((p) => /^\d+$/.test(p)), 'svaki deo treba da je broj');
  });

  await test('status je aktivan', () => {
    assertEqual(glavniEndzinDigitalneIndustrije.status, 'aktivan', 'status');
  });

  await test('ikona je definisana', () => {
    assert(glavniEndzinDigitalneIndustrije.ikona.length > 0, 'ikona ne sme biti prazna');
  });

  await test('opis nije prazan', () => {
    assert(glavniEndzinDigitalneIndustrije.opis.length > 0, 'opis ne sme biti prazan');
  });

  await test('misija je definisana', () => {
    assert(glavniEndzinDigitalneIndustrije.misija.length > 0, 'misija ne sme biti prazna');
  });

  await test('vizija je definisana', () => {
    assert(glavniEndzinDigitalneIndustrije.vizija.length > 0, 'vizija ne sme biti prazna');
  });

  await test('mogucnosti su neprazne', () => {
    assert(glavniEndzinDigitalneIndustrije.mogucnosti.length > 0, 'mogucnosti ne smeju biti prazne');
  });

  // ── Spajanje endžina ────────────────────────────────────────────────────

  console.log('\n📦 Spajanje svih endžina');

  await test('spojeniEndzini sadrže generisane endžine', () => {
    const spojeni = glavniEndzinDigitalneIndustrije.spojeniEndzini;
    assert(spojeni.length > 0, 'treba da ima spojenih endžina');

    const generatorEndžini = spojeni.filter((e) => e.izvor === 'SPAJA Generator za Endžine');
    assertEqual(generatorEndžini.length, generisaniEngini.length, 'generisanih endžina');
  });

  await test('spojeniEndzini sadrže gaming endžine', () => {
    const spojeni = glavniEndzinDigitalneIndustrije.spojeniEndzini;
    const gamingEndžini = spojeni.filter((e) => e.izvor === 'SPAJA Univerzalni Endžin za Igrice');
    assertEqual(gamingEndžini.length, endzinNadIgricama.length, 'gaming endžina');
  });

  await test('ukupno spojenih = generisani + gaming', () => {
    const spojeni = glavniEndzinDigitalneIndustrije.spojeniEndzini;
    const ocekivano = generisaniEngini.length + endzinNadIgricama.length;
    assertEqual(spojeni.length, ocekivano, 'ukupno spojenih');
  });

  await test('svaki spojeni endžin ima id, naziv, tip, status', () => {
    for (const e of glavniEndzinDigitalneIndustrije.spojeniEndzini) {
      assert(e.id.length > 0, `endžin ${e.id} ima prazan id`);
      assert(e.naziv.length > 0, `endžin ${e.id} ima prazan naziv`);
      assert(e.tip.length > 0, `endžin ${e.id} ima prazan tip`);
      assert(e.status.length > 0, `endžin ${e.id} ima prazan status`);
      assert(e.izvor.length > 0, `endžin ${e.id} ima prazan izvor`);
    }
  });

  await test('optimizacija je broj između 0 i 100 za sve endžine', () => {
    for (const e of glavniEndzinDigitalneIndustrije.spojeniEndzini) {
      assert(e.optimizacija >= 0 && e.optimizacija <= 100, `endžin ${e.id} ima optimizaciju van opsega: ${e.optimizacija}`);
    }
  });

  // ── Automatsko sklapanje ────────────────────────────────────────────────

  console.log('\n📦 Automatsko sklapanje proizvoda');

  await test('sklopljene platforme imaju sve platforme', () => {
    const sklopljene = glavniEndzinDigitalneIndustrije.autoSklapanje.filter((s) => s.tip === 'platforma');
    assertEqual(sklopljene.length, platforme.length, 'platforme');
  });

  await test('sklopljene igrice imaju sve igrice', () => {
    const sklopljene = glavniEndzinDigitalneIndustrije.autoSklapanje.filter((s) => s.tip === 'igrica');
    assertEqual(sklopljene.length, igrice.length, 'igrice');
  });

  await test('sklopljeni IT proizvodi imaju sve proizvode', () => {
    const sklopljeni = glavniEndzinDigitalneIndustrije.autoSklapanje.filter((s) => s.tip === 'it-proizvod');
    assertEqual(sklopljeni.length, products.length, 'proizvodi');
  });

  await test('sve sklopljene stavke imaju status sklopljen i kompletnost 100', () => {
    for (const s of glavniEndzinDigitalneIndustrije.autoSklapanje) {
      assertEqual(s.status, 'sklopljen', `stavka ${s.id} status`);
      assertEqual(s.kompletnost, 100, `stavka ${s.id} kompletnost`);
    }
  });

  await test('ukupno sklopljenih = platforme + igrice + proizvodi', () => {
    const ocekivano = platforme.length + igrice.length + products.length;
    assertEqual(glavniEndzinDigitalneIndustrije.autoSklapanje.length, ocekivano, 'ukupno sklopljenih');
  });

  await test('svaki sklopljeni ima endziniKorisceni', () => {
    for (const s of glavniEndzinDigitalneIndustrije.autoSklapanje) {
      assert(s.endziniKorisceni.length > 0, `stavka ${s.id} nema korišćenih endžina`);
    }
  });

  // ── Evolucioni ciklusi ──────────────────────────────────────────────────

  console.log('\n📦 Evolucioni ciklusi');

  await test('ima 6 evolucionih ciklusa', () => {
    assertEqual(glavniEndzinDigitalneIndustrije.evolucija.length, 6, 'broj ciklusa');
  });

  await test('svaki ciklus ima id, naziv, opis, fazu i napredak', () => {
    for (const c of glavniEndzinDigitalneIndustrije.evolucija) {
      assert(c.id.length > 0, `ciklus ima prazan id`);
      assert(c.naziv.length > 0, `ciklus ${c.id} ima prazan naziv`);
      assert(c.opis.length > 0, `ciklus ${c.id} ima prazan opis`);
      assert(['aktivna', 'planirana', 'zavrsena'].includes(c.faza), `ciklus ${c.id} ima nevalidnu fazu`);
      assert(c.napredak >= 0 && c.napredak <= 100, `ciklus ${c.id} napredak van opsega`);
    }
  });

  await test('svi napredci su 100%', () => {
    for (const c of glavniEndzinDigitalneIndustrije.evolucija) {
      assertEqual(c.napredak, 100, `ciklus ${c.id} napredak`);
    }
  });

  // ── Statistika ──────────────────────────────────────────────────────────

  console.log('\n📦 Statistika');

  await test('statistika je ispravno izračunata', () => {
    const stats = glavniEndzinDigitalneIndustrije.statistika;
    assert(stats.ukupnoSpojenih > 0, 'ukupno spojenih > 0');
    assert(stats.aktivnihEndžina >= 0, 'aktivnih endžina >= 0');
    assert(stats.prosecnaOptimizacija >= 0 && stats.prosecnaOptimizacija <= 100, 'prosek u opsegu');
  });

  await test('kompletnost sistema je 100%', () => {
    assertEqual(glavniEndzinDigitalneIndustrije.statistika.kompletnostSistema, 100, 'kompletnost');
  });

  await test('ukupno spojenih u statistici odgovara stvarnom broju', () => {
    assertEqual(
      glavniEndzinDigitalneIndustrije.statistika.ukupnoSpojenih,
      glavniEndzinDigitalneIndustrije.spojeniEndzini.length,
      'ukupno spojenih',
    );
  });

  await test('zbir endžina po tipu odgovara ukupnom broju', () => {
    const stats = glavniEndzinDigitalneIndustrije.statistika;
    const zbir = stats.coreEndžina + stats.aiEndžina + stats.mrezaEndžina +
      stats.finansijeEndžina + stats.gamingEndžina + stats.deployEndžina +
      stats.bezbednostEndžina + stats.komunikacijaEndžina + stats.repoEndžina;
    assertEqual(zbir, stats.ukupnoSpojenih, 'zbir po tipu');
  });

  await test('ukupno igrica pokrenutih odgovara stvarnom broju', () => {
    assertEqual(
      glavniEndzinDigitalneIndustrije.statistika.ukupnoIgricaPokrenutih,
      igrice.length,
      'igrice',
    );
  });

  await test('ukupno platformi pokrenutih odgovara stvarnom broju', () => {
    assertEqual(
      glavniEndzinDigitalneIndustrije.statistika.ukupnoPlatformiPokrenutih,
      platforme.length,
      'platforme',
    );
  });

  await test('ukupno proizvoda sklopljenih odgovara stvarnom broju', () => {
    assertEqual(
      glavniEndzinDigitalneIndustrije.statistika.ukupnoProizvodaSklopljenih,
      products.length,
      'proizvodi',
    );
  });

  // ── Helper funkcije ─────────────────────────────────────────────────────

  console.log('\n📦 Helper funkcije');

  await test('getSvojeneEndzine vraća ispravan niz', () => {
    const spojeni = getSvojeneEndzine();
    assertEqual(spojeni.length, glavniEndzinDigitalneIndustrije.spojeniEndzini.length, 'dužina');
  });

  await test('getSklopljeneProizvode vraća ispravan niz', () => {
    const sklopljeni = getSklopljeneProizvode();
    assertEqual(sklopljeni.length, glavniEndzinDigitalneIndustrije.autoSklapanje.length, 'dužina');
  });

  await test('getEvolucijaCikluse vraća 6 ciklusa', () => {
    const ciklusi = getEvolucijaCikluse();
    assertEqual(ciklusi.length, 6, 'broj ciklusa');
  });

  await test('getGlavniEndzinStatistika vraća validnu statistiku', () => {
    const stats = getGlavniEndzinStatistika();
    assert(stats.ukupnoSpojenih > 0, 'ukupno > 0');
    assertEqual(stats.kompletnostSistema, 100, 'kompletnost');
  });

  await test('getSpojenePoTipu filtrira korektno', () => {
    const gamingEndžini = getSpojenePoTipu('gaming');
    for (const e of gamingEndžini) {
      assertEqual(e.tip, 'gaming', `tip endžina ${e.id}`);
    }
  });

  await test('getSklopljenePoTipu filtrira korektno', () => {
    const platformeSkl = getSklopljenePoTipu('platforma');
    for (const s of platformeSkl) {
      assertEqual(s.tip, 'platforma', `tip stavke ${s.id}`);
    }
    assertEqual(platformeSkl.length, platforme.length, 'broj platformi');
  });

  await test('getUkupnoPokrenutih vraća ispravan broj', () => {
    const ukupno = getUkupnoPokrenutih();
    const ocekivano = platforme.length + igrice.length + products.length;
    assertEqual(ukupno, ocekivano, 'ukupno pokrenutih');
  });

  await test('getKompletnostSistema vraća 100', () => {
    assertEqual(getKompletnostSistema(), 100, 'kompletnost');
  });

  await test('getGlavniEndzinPregled vraća validan pregled', () => {
    const pregled = getGlavniEndzinPregled();
    assertEqual(pregled.status, 'aktivan', 'status');
    assert(pregled.ukupnoSpojenih > 0, 'spojenih > 0');
    assertEqual(pregled.kompletnost, 100, 'kompletnost');
    assert(pregled.verzija.length > 0, 'verzija non-empty');
  });

  // ── Integritet podataka ─────────────────────────────────────────────────

  console.log('\n📦 Integritet podataka');

  await test('nema dupliranih ID-eva u spojenim endžinima', () => {
    const ids = new Set<string>();
    for (const e of glavniEndzinDigitalneIndustrije.spojeniEndzini) {
      assert(!ids.has(e.id), `duplirani id: ${e.id}`);
      ids.add(e.id);
    }
  });

  await test('nema dupliranih ID-eva u sklopljenim proizvodima', () => {
    const ids = new Set<string>();
    for (const s of glavniEndzinDigitalneIndustrije.autoSklapanje) {
      assert(!ids.has(s.id), `duplirani id: ${s.id}`);
      ids.add(s.id);
    }
  });

  await test('nema dupliranih ID-eva u evolucionim ciklusima', () => {
    const ids = new Set<string>();
    for (const c of glavniEndzinDigitalneIndustrije.evolucija) {
      assert(!ids.has(c.id), `duplirani id: ${c.id}`);
      ids.add(c.id);
    }
  });

  await test('OMEGA_AI_PERSONA_UKUPNO je referenciran u opisu', () => {
    assert(
      glavniEndzinDigitalneIndustrije.opis.includes(OMEGA_AI_PERSONA_UKUPNO.toLocaleString()),
      'opis treba da sadrži OMEGA AI persona count',
    );
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('─'.repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
