// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Ekslataciju Proizvoda
// Pokretanje: npx tsx src/tests/lib/ekslatacija-proizvoda.test.ts

import {
  ekslatacijaProizvodi,
  ekslatacijaKanali,
  getEkslatacijaMetrike,
  getProizvodiPoFazi,
  getProizvodiPoModelu,
  getVrhunckiProizvodi,
  getEkslatacijaPregled,
  getUkupniKanalniPotencijal,
} from '../../lib/ekslatacija-proizvoda';

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
  console.log('\n💸 Ekslatacija Proizvoda Test Suite\n');

  // ── Kataloški podaci ────────────────────────────────────────────────────────

  await test('ekslatacijaProizvodi niz nije prazan', () => {
    assert(ekslatacijaProizvodi.length > 0, 'mora biti bar jedan proizvod');
  });

  await test('ekslatacijaProizvodi ima najmanje 10 unosa', () => {
    assert(ekslatacijaProizvodi.length >= 10, `očekivano >=10, dobijeno ${ekslatacijaProizvodi.length}`);
  });

  await test('svi proizvodi imaju obavezna polja', () => {
    for (const p of ekslatacijaProizvodi) {
      assert(p.id.length > 0, `proizvod bez id-a`);
      assert(p.naziv.length > 0, `${p.id}: naziv prazan`);
      assert(p.ikona.length > 0, `${p.id}: ikona prazna`);
      assert(p.fazaEkslatacije.length > 0, `${p.id}: fazaEkslatacije prazna`);
      assert(p.komercijalnIModel.length > 0, `${p.id}: komercijalnIModel prazan`);
      assert(p.status.length > 0, `${p.id}: status prazan`);
      assert(p.prihod >= 0, `${p.id}: prihod negativan`);
      assert(p.rast >= 0, `${p.id}: rast negativan`);
      assert(p.trzisnaPokrivenost >= 0 && p.trzisnaPokrivenost <= 100, `${p.id}: pokrivenost van opsega`);
      assert(p.konkurentnostIndex >= 1 && p.konkurentnostIndex <= 10, `${p.id}: konkurentnost van opsega`);
    }
  });

  await test('ekslatacijaKanali niz nije prazan', () => {
    assert(ekslatacijaKanali.length > 0, 'mora biti bar jedan kanal');
  });

  await test('svi kanali imaju obavezna polja', () => {
    for (const k of ekslatacijaKanali) {
      assert(k.id.length > 0, `kanal bez id-a`);
      assert(k.naziv.length > 0, `${k.id}: naziv prazan`);
      assert(k.potencijalEUR > 0, `${k.id}: potencijalEUR mora biti pozitivan`);
      assert(k.aktivnih >= 0, `${k.id}: aktivnih ne sme biti negativan`);
    }
  });

  // ── getEkslatacijaMetrike ───────────────────────────────────────────────────

  await test('getEkslatacijaMetrike vraća ispravnu strukturu', () => {
    const m = getEkslatacijaMetrike();
    assert('ukupnoProizvoda' in m, 'ukupnoProizvoda polje nedostaje');
    assert('aktivnih' in m, 'aktivnih polje nedostaje');
    assert('uPripremi' in m, 'uPripremi polje nedostaje');
    assert('planirani' in m, 'planirani polje nedostaje');
    assert('povuceni' in m, 'povuceni polje nedostaje');
    assert('ukupanPotencijalPrihoda' in m, 'ukupanPotencijalPrihoda polje nedostaje');
    assert('prosecniRast' in m, 'prosecniRast polje nedostaje');
    assert('prosecnaPokrivenost' in m, 'prosecnaPokrivenost polje nedostaje');
    assert('aktivnihKanala' in m, 'aktivnihKanala polje nedostaje');
    assert('fazama' in m, 'fazama polje nedostaje');
    assert('modelima' in m, 'modelima polje nedostaje');
  });

  await test('getEkslatacijaMetrike ukupnoProizvoda konzistentno', () => {
    const m = getEkslatacijaMetrike();
    assertEqual(m.ukupnoProizvoda, ekslatacijaProizvodi.length, 'ukupnoProizvoda');
  });

  await test('getEkslatacijaMetrike aktivnih + uPripremi + planirani + povuceni = ukupno', () => {
    const m = getEkslatacijaMetrike();
    const zbir = m.aktivnih + m.uPripremi + m.planirani + m.povuceni;
    assertEqual(zbir, m.ukupnoProizvoda, 'zbir statusa mora biti ukupno');
  });

  await test('getEkslatacijaMetrike ukupanPotencijalPrihoda konzistentno', () => {
    const m = getEkslatacijaMetrike();
    const zbir = ekslatacijaProizvodi.reduce((sum, p) => sum + p.prihod, 0);
    assertEqual(m.ukupanPotencijalPrihoda, zbir, 'ukupanPotencijalPrihoda');
  });

  await test('getEkslatacijaMetrike aktivnihKanala konzistentno', () => {
    const m = getEkslatacijaMetrike();
    assertEqual(m.aktivnihKanala, ekslatacijaKanali.length, 'aktivnihKanala');
  });

  // ── getProizvodiPoFazi ──────────────────────────────────────────────────────

  await test('getProizvodiPoFazi grupišeproizvode po svim fazama', () => {
    const poFazi = getProizvodiPoFazi();
    const ukupno = Object.values(poFazi).reduce((sum, arr) => sum + arr.length, 0);
    assertEqual(ukupno, ekslatacijaProizvodi.length, 'suma po fazama mora biti ukupno');
  });

  await test('getProizvodiPoFazi svaka faza sadrži ispravne proizvode', () => {
    const poFazi = getProizvodiPoFazi();
    for (const [faza, proizvodi] of Object.entries(poFazi)) {
      for (const p of proizvodi) {
        assertEqual(p.fazaEkslatacije, faza as typeof p.fazaEkslatacije, `proizvod ${p.id} faza`);
      }
    }
  });

  // ── getProizvodiPoModelu ────────────────────────────────────────────────────

  await test('getProizvodiPoModelu grupišeproizvode po svim modelima', () => {
    const poModelu = getProizvodiPoModelu();
    const ukupno = Object.values(poModelu).reduce((sum, arr) => sum + arr.length, 0);
    assertEqual(ukupno, ekslatacijaProizvodi.length, 'suma po modelima mora biti ukupno');
  });

  await test('getProizvodiPoModelu svaki model sadrži ispravne proizvode', () => {
    const poModelu = getProizvodiPoModelu();
    for (const [model, proizvodi] of Object.entries(poModelu)) {
      for (const p of proizvodi) {
        assertEqual(p.komercijalnIModel, model as typeof p.komercijalnIModel, `proizvod ${p.id} model`);
      }
    }
  });

  // ── getVrhunckiProizvodi ────────────────────────────────────────────────────

  await test('getVrhunckiProizvodi vraća top 5 po defaultu', () => {
    const vrhunckiProizvodi = getVrhunckiProizvodi();
    assertEqual(vrhunckiProizvodi.length, 5, 'mora vraćati 5 po defaultu');
  });

  await test('getVrhunckiProizvodi respektuje limit parametar', () => {
    const top3 = getVrhunckiProizvodi(3);
    assertEqual(top3.length, 3, 'mora vraćati 3 kada se prosledi limit=3');
  });

  await test('getVrhunckiProizvodi sortirani opadajuće po prihodu', () => {
    const vrhunckiProizvodi = getVrhunckiProizvodi(5);
    for (let i = 0; i < vrhunckiProizvodi.length - 1; i++) {
      assert(
        vrhunckiProizvodi[i].prihod >= vrhunckiProizvodi[i + 1].prihod,
        `indeks ${i} prihod ${vrhunckiProizvodi[i].prihod} manji od ${i + 1}: ${vrhunckiProizvodi[i + 1].prihod}`,
      );
    }
  });

  // ── getEkslatacijaPregled ───────────────────────────────────────────────────

  await test('getEkslatacijaPregled vraća ispravnu strukturu', () => {
    const p = getEkslatacijaPregled();
    assert(p.naziv.length > 0, 'naziv prazan');
    assert(p.verzija.length > 0, 'verzija prazna');
    assertEqual(p.status, 'aktivan', 'status mora biti aktivan');
    assert(p.timestamp.length > 0, 'timestamp prazan');
    assert(p.poFazama.length > 0, 'poFazama prazan');
    assert(p.poModelima.length > 0, 'poModelima prazan');
    assert(p.vrhunckiProizvodi.length > 0, 'vrhunckiProizvodi prazan');
    assert(p.sviProizvodi.length > 0, 'sviProizvodi prazan');
  });

  await test('getEkslatacijaPregled sviProizvodi dužina konzistentna', () => {
    const p = getEkslatacijaPregled();
    assertEqual(p.sviProizvodi.length, ekslatacijaProizvodi.length, 'sviProizvodi dužina');
  });

  await test('getEkslatacijaPregled kanali konzistentni', () => {
    const p = getEkslatacijaPregled();
    assertEqual(p.kanali.length, ekslatacijaKanali.length, 'kanali dužina');
  });

  await test('getEkslatacijaPregled poFazama ukupno konzistentno', () => {
    const p = getEkslatacijaPregled();
    const zbir = p.poFazama.reduce((sum, f) => sum + f.broj, 0);
    assertEqual(zbir, ekslatacijaProizvodi.length, 'poFazama ukupno');
  });

  await test('getEkslatacijaPregled poModelima ukupno konzistentno', () => {
    const p = getEkslatacijaPregled();
    const zbir = p.poModelima.reduce((sum, m) => sum + m.broj, 0);
    assertEqual(zbir, ekslatacijaProizvodi.length, 'poModelima ukupno');
  });

  // ── getUkupniKanalniPotencijal ──────────────────────────────────────────────

  await test('getUkupniKanalniPotencijal vraća pozitivan broj', () => {
    const potencijal = getUkupniKanalniPotencijal();
    assert(potencijal > 0, `mora biti pozitivan, dobijeno ${potencijal}`);
  });

  await test('getUkupniKanalniPotencijal konzistentno sa kanalima', () => {
    const potencijal = getUkupniKanalniPotencijal();
    const zbir = ekslatacijaKanali.reduce((sum, k) => sum + k.potencijalEUR, 0);
    assertEqual(potencijal, zbir, 'ukupni kanalski potencijal');
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
