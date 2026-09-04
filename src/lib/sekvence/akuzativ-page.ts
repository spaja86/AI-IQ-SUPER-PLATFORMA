import type { Sekvenca } from '@/lib/types';

export const akuzativSekvence: Sekvenca[] = [
  {
    id: 'akuzativ-hero',
    tip: 'hero',
    naslov: '🧠 AKUZATIV — EDUKATIVNI MODUL + PROVERA ZNANJA',
    podnaslov: 'Lekcija kroz nivoe + praktični zadaci + validacija razumevanja',
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis: 'AKUZATIV modul je samostalna edukativna sekvenca za razumevanje funkcije objekta, upotrebe sa/bez predloga i tipičnih grešaka. Modul uključuje mini-provere i povratnu informaciju.',
      dugmad: [
        { tekst: 'Počni osnovni nivo', href: '#akuzativ-osnovni' },
        { tekst: 'Srednji nivo', href: '#akuzativ-srednji', stil: 'sekundarno' },
        { tekst: 'Napredni nivo', href: '#akuzativ-napredni', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'akuzativ-obuhvat',
    tip: 'tekst',
    naslov: '📘 Obuhvat sadržaja',
    redosled: 2,
    podaci: {
      sadrzaj: 'Modul pokriva: (1) osnovna pravila akuzativa, (2) pitanja „koga? šta?”, (3) upotrebu bez predloga i sa čestim predlozima (na, u, za, kroz, niz, uz), (4) tipične primere i kontrastne parove, (5) najčešće greške i korekcije.',
      istaknuteStavke: [
        'Pitanja: koga? šta?',
        'Akuzativ bez predloga (direktan objekat)',
        'Akuzativ sa predlogom (pravac/kretanje/cilj)',
        'Najčešće greške: nominativ umesto akuzativa, pogrešan oblik zamenica',
      ],
    },
  },
  {
    id: 'akuzativ-nivoi',
    tip: 'tabela',
    naslov: '🎯 Nivoi težine i ishodi',
    redosled: 3,
    podaci: {
      zaglavlje: ['Nivo', 'Fokus', 'Ishod'],
      redovi: [
        ['Osnovni', 'Prepoznavanje akuzativa u prostim rečenicama', 'Učenik tačno razlikuje subjekat i objekat'],
        ['Srednji', 'Akuzativ sa/bez predloga u kontekstu', 'Učenik bira tačan oblik imenice/zamenice u rečenici'],
        ['Napredni', 'Kompleksne rečenice i korekcija grešaka', 'Učenik samostalno ispravlja greške i obrazlaže izbor'],
      ],
    },
  },
  {
    id: 'akuzativ-osnovni',
    tip: 'lista',
    naslov: '🟢 Osnovni nivo — mini zadaci',
    redosled: 4,
    podaci: {
      stavke: [
        'Prepoznavanje oblika: „Vidim ___ (pas).”',
        'Dopuna rečenice: „Kupujem ___ (hleb).”',
        'Kratka provera: izaberi pravilno pitanje (koga? / ko?)',
      ],
    },
  },
  {
    id: 'akuzativ-srednji',
    tip: 'lista',
    naslov: '🟡 Srednji nivo — kontekstualni zadaci',
    redosled: 5,
    podaci: {
      stavke: [
        'Dopuna sa predlogom: „Idem u ___ (grad).”',
        'Razlika smera i mesta: „u školu” vs „u školi”',
        'Zamenice: „Vidim ga/je/ih” — izbor prema kontekstu',
      ],
    },
  },
  {
    id: 'akuzativ-napredni',
    tip: 'lista',
    naslov: '🔴 Napredni nivo — korekcija i obrazloženje',
    redosled: 6,
    podaci: {
      stavke: [
        'Ispravka grešaka u složenim rečenicama',
        'Prepoznavanje dvosmislenih slučajeva i izbor pravilnog oblika',
        'Kratki kviz sa objašnjenjem za svaki odgovor',
      ],
    },
  },
  {
    id: 'akuzativ-validacija',
    tip: 'kartice',
    naslov: '✅ Kriterijumi validacije',
    redosled: 7,
    podaci: {
      kartice: [
        {
          naslov: 'Tačnost odgovora',
          opis: 'Cilj je visoka tačnost kroz nivoe i stabilnost rezultata u ponovljenim pokušajima.',
          ikona: '🎯',
          oznake: ['preciznost', 'doslednost'],
        },
        {
          naslov: 'Pokrivenost edge-case primera',
          opis: 'Validacija uključuje primere sa predlozima, zamenicama i kontrastnim konstrukcijama.',
          ikona: '🧪',
          oznake: ['edge-case', 'predlozi'],
        },
        {
          naslov: 'Kvalitet povratne informacije',
          opis: 'Povratna informacija mora biti jasna, kratka i upotrebljiva za sledeći pokušaj.',
          ikona: '💬',
          oznake: ['feedback', 'jasnoća'],
        },
      ],
    },
  },
  {
    id: 'akuzativ-povezane-teme',
    tip: 'cta',
    naslov: '🔗 Povezane jezičke teme',
    redosled: 8,
    podaci: {
      opis: 'Nastavi kontinuitet učenja kroz povezane padeže.',
      stavke: [
        { naziv: 'Nominativ', vrednost: 'Osnovni oblik subjekta', ikona: '🅽' },
        { naziv: 'Genitiv', vrednost: 'Odnos pripadnosti i negacije', ikona: '🅶' },
        { naziv: 'Dativ', vrednost: 'Usmerenost prema primaocu', ikona: '🅳' },
      ],
      dugmad: [
        { tekst: 'Nominativ', href: '/nominativ' },
        { tekst: 'Genitiv', href: '/genitiv', stil: 'sekundarno' },
        { tekst: 'Dativ', href: '/dativ', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'akuzativ-revizija',
    tip: 'tekst',
    naslov: '🛠️ Plan objave i revizije',
    redosled: 9,
    podaci: {
      sadrzaj: 'Objava modula prati internu proveru sadržaja, iterativnu doradu po povratnim informacijama korisnika i periodično ažuriranje primera/zadataka radi održavanja kvaliteta.',
      istaknuteStavke: [
        'Interna sadržajna provera pre objave',
        'Iterativna dorada na osnovu povratnih informacija',
        'Periodična revizija i osvežavanje primera',
      ],
    },
  },
];
