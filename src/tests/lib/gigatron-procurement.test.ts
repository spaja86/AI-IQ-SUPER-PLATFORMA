// GIGATRON Procurement Tests — AI IQ SUPER PLATFORMA

import {
  kreirajNarudzbu,
  validirajNarudzbu,
  getNarudzbinaById,
  azurirajStatusNarudzbine,
  PDV_STOPA,
  MAX_STAVKI_PO_NARUDZBINI,
  MAX_B2B_KOLICINA,
  type NarudzbinaAdresa,
} from '../../lib/gigatron/gigatron-procurement';
import { gigatronKatalog } from '../../lib/gigatron/gigatron-catalog';

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

const validnaAdresa: NarudzbinaAdresa = {
  kompanija: 'Test Kompanija d.o.o.',
  ulica: 'Ulica Testna 123',
  grad: 'Beograd',
  postanskiBroj: '11000',
  drzava: 'Srbija',
  kontaktOsoba: 'Petar Petrović',
  telefon: '+381631234567',
};

async function runTests(): Promise<void> {
  console.log('\n📦 GIGATRON Procurement Test Suite\n');

  const aktivanProizvod = gigatronKatalog.find(
    (p) => p.status === 'aktivan' && (p.dostupnost === 'na-stanju' || p.dostupnost === 'ogranicene-zalihe'),
  );
  assert(aktivanProizvod !== undefined, 'Mora postojati bar jedan aktivan proizvod na stanju za testiranje');

  // ── Validacija ─────────────────────────────────────────────────────────────

  await test('Validacija prolazi za ispravnu narudžbinu', () => {
    const greske = validirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(greske.length === 0, `Nije smelo biti grešaka, pronađeno: ${greske.map((g) => g.poruka).join(', ')}`);
  });

  await test('Validacija odbija prazne stavke', () => {
    const greske = validirajNarudzbu(
      { stavke: [], adresaIsporuke: validnaAdresa },
      gigatronKatalog,
    );
    assert(greske.length > 0, 'Mora odbiti prazne stavke');
  });

  await test('Validacija odbija nepostojeći proizvod', () => {
    const greske = validirajNarudzbu(
      {
        stavke: [{ proizvodId: 'ne-postoji-XXX', kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(greske.some((g) => g.poruka.includes('nije pronađen')), 'Mora odbiti nepostojeći ID');
  });

  await test('Validacija odbija nultu količinu', () => {
    const greske = validirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 0 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(greske.length > 0, 'Mora odbiti nultu količinu');
  });

  await test('Validacija odbija prekomjernu količinu', () => {
    const greske = validirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: MAX_B2B_KOLICINA + 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(greske.length > 0, `Mora odbiti količinu > ${MAX_B2B_KOLICINA}`);
  });

  await test('Validacija odbija praznu adresu', () => {
    const greske = validirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: { ...validnaAdresa, kompanija: '' },
      },
      gigatronKatalog,
    );
    assert(greske.some((g) => g.polje.includes('kompanija')), 'Mora odbiti prazno ime kompanije');
  });

  await test('Validacija odbija prazno ime grada', () => {
    const greske = validirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: { ...validnaAdresa, grad: '' },
      },
      gigatronKatalog,
    );
    assert(greske.some((g) => g.polje.includes('grad')), 'Mora odbiti prazan grad');
  });

  // ── Kreiranje Narudžbine ────────────────────────────────────────────────────

  await test('Uspješno kreiranje narudžbine', () => {
    const rezultat = kreirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(rezultat.ok === true, 'Narudžbina mora biti kreirana uspešno');
    assert(rezultat.narudzbina !== undefined, 'Narudžbina mora biti u rezultatu');
    assert(rezultat.narudzbina!.id.length > 0, 'ID narudžbine mora biti neprazan');
    assert(rezultat.narudzbina!.broj.startsWith('GTR-B2B-'), 'Broj narudžbine mora počinjati sa GTR-B2B-');
    assert(rezultat.narudzbina!.status === 'kreirana', 'Početni status mora biti kreirana');
  });

  await test('PDV kalkulacija je tačna (20%)', () => {
    const rezultat = kreirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(rezultat.ok === true, 'Narudžbina mora biti kreirana');
    const n = rezultat.narudzbina!;
    const ocekivaniPdv = Math.round(n.ukupnoEUR * PDV_STOPA * 100) / 100;
    assert(Math.abs(n.pdvEUR - ocekivaniPdv) < 0.01, `PDV mora biti ${ocekivaniPdv}, pronađeno: ${n.pdvEUR}`);
    assert(
      Math.abs(n.ukupnoSaPdvEUR - (n.ukupnoEUR + n.pdvEUR)) < 0.01,
      'Ukupno sa PDV-om mora biti zbir base i PDV-a',
    );
  });

  await test('Ukupna cena stavki se pravilno računa', () => {
    const rezultat = kreirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 2 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(rezultat.ok === true, 'Narudžbina mora biti kreirana');
    const stavka = rezultat.narudzbina!.stavke[0]!;
    assert(
      stavka.ukupnoCenaEUR === stavka.cenaPoKomEUR * 2,
      `Ukupna cena ${stavka.ukupnoCenaEUR} mora biti 2 × ${stavka.cenaPoKomEUR}`,
    );
  });

  await test('Procenjena isporuka je setovana', () => {
    const rezultat = kreirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
        urgentnost: 'standardna',
      },
      gigatronKatalog,
    );
    assert(rezultat.narudzbina?.procenjenaIsporuka !== undefined, 'procenjenaIsporuka mora biti setovana');
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(rezultat.narudzbina!.procenjenaIsporuka!),
      'procenjenaIsporuka mora biti ISO date format',
    );
  });

  await test('getNarudzbinaById pronalazi kreiranu narudžbinu', () => {
    const rezultat = kreirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(rezultat.ok === true, 'Narudžbina mora biti kreirana');
    const nadjeno = getNarudzbinaById(rezultat.narudzbina!.id);
    assert(nadjeno !== null, 'getNarudzbinaById mora pronaći narudžbinu');
    assert(nadjeno!.id === rezultat.narudzbina!.id, 'ID mora da se poklapa');
  });

  await test('getNarudzbinaById vraća null za nepostojeći ID', () => {
    const rezultat = getNarudzbinaById('ne-postoji-XXX');
    assert(rezultat === null, 'mora da vrati null');
  });

  await test('azurirajStatusNarudzbine ažurira status', () => {
    const kreirano = kreirajNarudzbu(
      {
        stavke: [{ proizvodId: aktivanProizvod!.id, kolicina: 1 }],
        adresaIsporuke: validnaAdresa,
      },
      gigatronKatalog,
    );
    assert(kreirano.ok === true, 'Narudžbina mora biti kreirana');
    const azurirano = azurirajStatusNarudzbine(kreirano.narudzbina!.id, 'potvrdjeno');
    assert(azurirano !== null, 'azurirajStatusNarudzbine mora da vrati narudžbinu');
    assert(azurirano!.status === 'potvrdjeno', 'Status mora biti potvrdjeno');
  });

  await test('Max stavki po narudžbini je enforsiran', () => {
    const stavke = Array.from({ length: MAX_STAVKI_PO_NARUDZBINI + 1 }, (_, i) => ({
      proizvodId: `proizvod-${i}`,
      kolicina: 1,
    }));
    const greske = validirajNarudzbu({ stavke, adresaIsporuke: validnaAdresa }, gigatronKatalog);
    assert(greske.some((g) => g.poruka.includes('Maksimalan broj')), 'Mora odbiti previše stavki');
  });

  console.log(`\nRezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
}

void runTests();
