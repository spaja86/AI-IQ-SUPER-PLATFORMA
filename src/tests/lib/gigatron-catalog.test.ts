// GIGATRON Catalog Tests — AI IQ SUPER PLATFORMA

import {
  gigatronKatalog,
  getGigatronKatalog,
  getGigatronProizvodById,
  getGigatronProizvodBySku,
  getGigatronKategorije,
  getGigatronBrandovi,
  getGigatronKatalogMetrike,
} from '../../lib/gigatron/gigatron-catalog';

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

async function runTests(): Promise<void> {
  console.log('\n🛒 GIGATRON Catalog Test Suite\n');

  await test('Katalog nije prazan', () => {
    assert(gigatronKatalog.length > 0, 'katalog mora imati bar jedan proizvod');
  });

  await test('Svaki proizvod ima obavezna polja', () => {
    for (const p of gigatronKatalog) {
      assert(p.id.length > 0, `Proizvod bez id`);
      assert(p.sku.length > 0, `Proizvod ${p.id} bez SKU`);
      assert(p.naziv.length > 0, `Proizvod ${p.id} bez naziva`);
      assert(p.cenaEUR > 0, `Proizvod ${p.id} mora imati pozitivnu cenu EUR`);
      assert(p.cenaRSD > 0, `Proizvod ${p.id} mora imati pozitivnu cenu RSD`);
      assert(p.affiliateProvizijaPct > 0, `Proizvod ${p.id} mora imati affiliate proviziju`);
    }
  });

  await test('Nema dupliranih ID-eva', () => {
    const ids = new Set(gigatronKatalog.map((p) => p.id));
    assert(ids.size === gigatronKatalog.length, 'duplirani ID-evi u katalogu');
  });

  await test('Nema dupliranih SKU-ova', () => {
    const skuovi = new Set(gigatronKatalog.map((p) => p.sku));
    assert(skuovi.size === gigatronKatalog.length, 'duplirani SKU-ovi u katalogu');
  });

  await test('getGigatronKatalog vraća sve aktivne proizvode bez filtera', () => {
    const rezultat = getGigatronKatalog();
    assert(rezultat.ukupno > 0, 'mora biti bar jedan aktivan proizvod');
    assert(rezultat.stranica === 1, 'default stranica mora biti 1');
  });

  await test('getGigatronKatalog filtrira po kategoriji', () => {
    const laptopi = getGigatronKatalog({ kategorija: 'laptopovi' });
    assert(laptopi.ukupno > 0, 'mora biti bar jedan laptop');
    for (const p of laptopi.proizvodi) {
      assert(p.kategorija === 'laptopovi', `Svi rezultati moraju biti laptopovi, pronađeno: ${p.kategorija}`);
    }
  });

  await test('getGigatronKatalog filtrira po brand-u', () => {
    const apple = getGigatronKatalog({ brand: 'Apple' });
    assert(apple.ukupno > 0, 'mora biti bar jedan Apple proizvod');
    for (const p of apple.proizvodi) {
      assert(p.brand === 'Apple', `Svi rezultati moraju biti Apple, pronađeno: ${p.brand}`);
    }
  });

  await test('getGigatronKatalog filtrira po cenovnom opsegu', () => {
    const filteri = getGigatronKatalog({ minCenaEUR: 100, maxCenaEUR: 500 });
    for (const p of filteri.proizvodi) {
      assert(p.cenaEUR >= 100 && p.cenaEUR <= 500, `Cena ${p.cenaEUR} van opsega 100-500 EUR`);
    }
  });

  await test('getGigatronKatalog full-text pretraga radi', () => {
    const rezultat = getGigatronKatalog({ pretraga: 'Apple' });
    assert(rezultat.ukupno > 0, 'pretraga za Apple mora da nađe bar jedan rezultat');
  });

  await test('getGigatronKatalog pretraga bez rezultata vraća prazan niz', () => {
    const rezultat = getGigatronKatalog({ pretraga: 'NEMAS-OVOGU_XXXXXX' });
    assert(rezultat.ukupno === 0, 'pretraga za nepostojeći pojam mora da vrati 0 rezultata');
    assert(rezultat.proizvodi.length === 0, 'proizvodi moraju biti prazan niz');
  });

  await test('Paginacija radi ispravno', () => {
    const stranica1 = getGigatronKatalog({}, 1, 3);
    const stranica2 = getGigatronKatalog({}, 2, 3);
    assert(stranica1.proizvodi.length <= 3, 'stranica 1 mora imati max 3 rezultata');
    if (stranica1.ukupno > 3) {
      assert(stranica2.proizvodi.length > 0, 'stranica 2 mora imati rezultate');
      assert(stranica1.proizvodi[0]!.id !== stranica2.proizvodi[0]!.id, 'stranice ne smeju imati isti prvi element');
    }
  });

  await test('getGigatronProizvodById pronalazi po ID-u', () => {
    const prvi = gigatronKatalog[0]!;
    const pronadjen = getGigatronProizvodById(prvi.id);
    assert(pronadjen !== null, 'mora da pronađe proizvod');
    assert(pronadjen!.id === prvi.id, 'ID mora da se poklapa');
  });

  await test('getGigatronProizvodById vraća null za nepostojeći ID', () => {
    const rezultat = getGigatronProizvodById('ne-postoji-XXX');
    assert(rezultat === null, 'mora da vrati null za nepostojeći ID');
  });

  await test('getGigatronProizvodBySku pronalazi po SKU-u', () => {
    const prvi = gigatronKatalog[0]!;
    const pronadjen = getGigatronProizvodBySku(prvi.sku);
    assert(pronadjen !== null, 'mora da pronađe proizvod po SKU');
    assert(pronadjen!.sku === prvi.sku, 'SKU mora da se poklapa');
  });

  await test('getGigatronKategorije vraća neprazan niz', () => {
    const kategorije = getGigatronKategorije();
    assert(kategorije.length > 0, 'mora biti bar jedna kategorija');
  });

  await test('getGigatronBrandovi vraća neprazan niz', () => {
    const brendovi = getGigatronBrandovi();
    assert(brendovi.length > 0, 'mora biti bar jedan brand');
  });

  await test('getGigatronKatalogMetrike vraća validne metrike', () => {
    const metrike = getGigatronKatalogMetrike();
    assert(metrike.ukupnoProizvoda > 0, 'ukupnoProizvoda mora biti > 0');
    assert(metrike.aktivnih > 0, 'aktivnih mora biti > 0');
    assert(metrike.prosecnaCenaEUR > 0, 'prosecnaCenaEUR mora biti > 0');
    assert(metrike.kategorija > 0, 'kategorija mora biti > 0');
    assert(metrike.brendovi > 0, 'brendovi mora biti > 0');
  });

  await test('Affiliate provizija je pozitivna za sve aktivne proizvode', () => {
    const aktivni = gigatronKatalog.filter((p) => p.status === 'aktivan');
    for (const p of aktivni) {
      assert(p.affiliateProvizijaPct > 0, `Affiliate provizija za '${p.naziv}' mora biti > 0`);
      assert(p.affiliateProvizijaPct <= 20, `Affiliate provizija za '${p.naziv}' ne sme biti > 20%`);
    }
  });

  console.log(`\nRezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
}

void runTests();
