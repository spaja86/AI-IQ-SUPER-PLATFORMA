import type { Sekvenca } from '@/lib/types';
import {
  igrice,
  igriceSistem,
  getBrojAktivnihIgrica,
  getSveKategorijeIgrica,
  getDimenzionalnoPitanje,
  OBAVEZNI_ZAHTEVI,
} from '@/lib/igrice';
import { dimenzije } from '@/lib/dimenzije';
import { itProizvodi } from '@/lib/it-proizvodi';
import { IOOPENUIAO_URL, IOOPENUIAO_DOMEN } from '@/lib/io-openui-ao-gaming-platforma';

const aktivnihIgrica = getBrojAktivnihIgrica();
const kategorije = getSveKategorijeIgrica();

/** Generiše mapu id → "ikona naziv" iz IT proizvoda (single source of truth) */
const proizvodiNazivi: Record<string, string> = Object.fromEntries(
  itProizvodi.map((p) => [p.id, `${p.ikona} ${p.naziv}`]),
);

/** Vraća prikaz naziva za proizvod ID */
function getNazivProizvoda(id: string): string {
  return proizvodiNazivi[id] ?? id;
}

export const igriceSekvence: Sekvenca[] = [
  {
    id: 'igrice-hero',
    tip: 'hero',
    naslov: '🎮 IGRICE — Dimenzionalni Gaming Sistem',
    podnaslov: 'SpajaUltraOmegaCore -∞Ω+∞ | Dimenzionalni Gaming Sistem | Gaming Industrija | Preporuke prema IT proizvodima',
    ikona: '🎮',
    redosled: 1,
    podaci: {
      opis: igriceSistem.opis,
      dugmad: [
        { tekst: `Gaming Platforma (${IOOPENUIAO_DOMEN})`, href: '/io-openui-ao-gaming-platforma' },
        { tekst: 'Dimenzije', href: '/dimenzije', stil: 'sekundarno' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
        { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'igrice-zahtevi-baner',
    tip: 'baner',
    naslov: '🖥️ OBAVEZNO: Digitalni Kompjuter + Digitalni Brauzer',
    redosled: 2,
    podaci: {
      bedz: '⚠️ ZAHTEVI',
      opis: 'Da bi igrice uopšte mogle da se pokrenu, potreban je Digitalni Kompjuter (dimenzionalno renderovanje 360D–5760D, geometrijsko procesiranje, multi-dimenzionalni GPU) i Digitalni Brauzer (WebGL/WebGPU renderovanje, pokretanje igrica u brauzeru, podrška za 3D naočare). Bez ova dva proizvoda nijedna igrica NE MOŽE da se pokrene!',
      dugme: { tekst: 'IT Proizvodi', href: '/it-proizvodi' },
    },
  },
  {
    id: 'igrice-tekst',
    tip: 'tekst',
    naslov: 'Kako funkcionišu dimenzionalne igrice?',
    redosled: 3,
    podaci: {
      sadrzaj: 'Svaka igrica je vezana za dimenzionalni sistem (360D–5760D). Prilikom pokretanja, igrica pita igrača koju dimenziju želi (D). Izabrana dimenzija određuje geometrijske slojeve (Elipsoid, Rezonanca, Hiperbola, Spirala), zakone manifestacije, vizuelni prikaz i snagu renderovanja. Spoljašnje dimenzije (1440D, 2880D, 5760D) koriste 3D prikaz sa 3D naočarima, dok unutrašnje (360D, 720D) koriste standardni prikaz. Svaka igrica preporučuje IT proizvode koji poboljšavaju iskustvo.',
      istaknuteStavke: [
        '🖥️ ZAHTEV: Digitalni Kompjuter — osnova za pokretanje igrica',
        '🌐 ZAHTEV: Digitalni Brauzer — neophodan za pristup igricama',
        '🎮 Prilikom pokretanja: „Koju dimenziju želiš (D)?"',
        '🔵 360D — Bazični režim: 2 geometrijska sloja, 2 zakona',
        '🟣 720D — Dvostruki režim: 3 sloja, 3 zakona',
        '🟡 1440D — Kvadra režim (3D): 4 sloja, 4 zakona',
        '🟠 2880D — Okto režim (3D): 4 sloja, 5 zakona',
        '🔴 5760D — Maksimalni režim (3D): 4 sloja, 6 zakona, puna reprodukcija',
        `Ukupno igrica: ${igriceSistem.ukupnoIgrica} | Kategorija: ${kategorije.length}`,
      ],
    },
  },
  {
    id: 'igrice-statistika',
    tip: 'statistika',
    naslov: '📊 Gaming sistem u brojevima',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Igrice', vrednost: igrice.length, ikona: '🎮' },
        { naziv: 'Aktivne', vrednost: aktivnihIgrica, ikona: '✅' },
        { naziv: 'Kategorije', vrednost: kategorije.length, ikona: '🏷️' },
        { naziv: 'Dimenzije', vrednost: dimenzije.length, ikona: '🌀' },
        { naziv: 'IT Proizvodi', vrednost: Object.keys(proizvodiNazivi).length, ikona: '📦' },
        { naziv: 'Režimi/Igra', vrednost: dimenzije.length, ikona: '⚙️' },
      ],
    },
  },
  {
    id: 'igrice-kartice',
    tip: 'kartice',
    naslov: '🎮 Igrice — Preporuke prema IT proizvodima',
    podnaslov: 'Svaka igrica pita „Koju dimenziju želiš (D)?" i preporučuje IT proizvode',
    redosled: 5,
    podaci: {
      kartice: igrice.map((i) => ({
        naslov: `${i.ikona} ${i.naziv}`,
        opis: i.opis,
        ikona: i.ikona,
        href: `/spaja-digitalni-brouvzer?url=${encodeURIComponent(IOOPENUIAO_URL)}&igra=${encodeURIComponent(i.naziv)}`,
        oznake: [
          i.kategorija,
          i.status,
          `D: ${i.podrazumevanaDimenzija}`,
          '🌐 Brouvzer',
          ...i.preporuceniProizvodi.map((p) => getNazivProizvoda(p)),
        ],
      })),
    },
  },
  {
    id: 'igrice-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija igrica sa preporučenim proizvodima',
    redosled: 6,
    podaci: {
      zaglavlje: ['Igrica', 'Kategorija', 'D', 'Preporučeni IT Proizvodi', 'Status'],
      redovi: igrice.map((i) => [
        `${i.ikona} ${i.naziv}`,
        i.kategorija,
        i.podrazumevanaDimenzija,
        i.preporuceniProizvodi.map((p) => getNazivProizvoda(p)).join(', '),
        i.status,
      ]),
    },
  },
  {
    id: 'igrice-dimenzije-tabela',
    tip: 'tabela',
    naslov: '🌀 Dimenzije i režimi u igricama',
    podnaslov: 'Šta dobijate u svakoj dimenziji (D)',
    redosled: 7,
    podaci: {
      zaglavlje: ['Dimenzija', 'Geo. Slojevi', 'Zakoni', 'Snaga', 'Prikaz'],
      redovi: dimenzije.map((d) => [
        `${d.ikona} ${d.nivo}`,
        d.geometrijskiSlojevi.join(', '),
        `${d.zakoni.length} zakona`,
        d.snaga,
        d.tip === 'spoljasnja' ? '3D (naočare)' : 'Standardni',
      ]),
    },
  },
  {
    id: 'igrice-zahtevi-tabela',
    tip: 'tabela',
    naslov: '🖥️ Obavezni zahtevi za pokretanje igrica',
    podnaslov: 'Bez ovih proizvoda igrice NE MOGU da se pokrenu',
    redosled: 8,
    podaci: {
      zaglavlje: ['Zahtev', 'Opis', 'Funkcije'],
      redovi: [
        ['🖥️ Digitalni Kompjuter', 'Osnova za pokretanje svih igrica u dimenzionalnom prostoru', 'Dimenzionalno renderovanje, Geometrijsko procesiranje, Multi-dim GPU, Cirkularna kalkulacija'],
        ['🌐 Digitalni Brauzer', 'Neophodan za pristup i pokretanje dimenzionalnih igrica', 'WebGL/WebGPU renderovanje, Pokretanje u brauzeru, 3D naočare podrška, Dim. streaming'],
      ],
    },
  },
  {
    id: 'igrice-gaming-industrija-baner',
    tip: 'baner',
    naslov: '🎮 Gaming Industrija — Masovne Preporuke',
    redosled: 9,
    podaci: {
      bedz: '🕹️ GAMING INDUSTRIJA',
      opis: `${igriceSistem.ukupnoIgrica} igrica u ${kategorije.length} kategorija! RPG sage, Battle Royale, MOBA arene, Racing simulatori, Horor, Muzičke igrice, Sandbox svetovi, Tower Defense, Card Battles, Flight simulatori, Party igrice, eSport menadžment i još mnogo toga — sve u dimenzionalnom prostoru 360D–5760D sa preporukama IT proizvoda!`,
      dugme: { tekst: 'IT Proizvodi', href: '/it-proizvodi' },
    },
  },
  {
    id: 'igrice-gaming-proizvodi-tabela',
    tip: 'tabela',
    naslov: '🎮 Gaming Industrija IT Proizvodi',
    podnaslov: 'Specijalizovani proizvodi za gaming ekosistem',
    redosled: 10,
    podaci: {
      zaglavlje: ['Proizvod', 'Kategorija', 'Opis', 'Uticaj'],
      redovi: itProizvodi.filter((p) => p.kategorija === 'gaming').map((p) => [
        `${p.ikona} ${p.naziv}`,
        p.kategorija,
        p.opis.slice(0, 80) + '...',
        p.uticaj,
      ]),
    },
  },
  {
    id: 'igrice-pitanje-lista',
    tip: 'lista',
    naslov: '🎮 Dimenzionalno pitanje pri pokretanju',
    redosled: 11,
    podaci: {
      stavke: igrice.map((i) => ({
        ikona: i.ikona,
        naslov: i.naziv,
        opis: getDimenzionalnoPitanje(i.id),
      })),
    },
  },
  {
    id: 'igrice-preporuke-kartice',
    tip: 'kartice',
    naslov: '📦 Preporučeni IT proizvodi po igricama',
    podnaslov: 'Svaka igrica preporučuje specifične proizvode za najbolje iskustvo',
    redosled: 12,
    podaci: {
      kartice: igrice.map((i) => ({
        naslov: `${i.ikona} ${i.naziv}`,
        opis: `Preporučeno: ${i.preporuceniProizvodi.map((p) => getNazivProizvoda(p)).join(', ')}`,
        ikona: i.ikona,
        oznake: [
          `Zahtevi: ${OBAVEZNI_ZAHTEVI.map((z) => getNazivProizvoda(z)).join(' + ')}`,
          ...i.preporuceniProizvodi.map((p) => getNazivProizvoda(p)),
        ],
      })),
    },
  },
  {
    id: 'igrice-kategorije-tabela',
    tip: 'tabela',
    naslov: '🏷️ Kategorije igrica u gaming industriji',
    podnaslov: `${kategorije.length} kategorija za sve tipove gejmera`,
    redosled: 13,
    podaci: {
      zaglavlje: ['Kategorija', 'Broj igrica', 'Primeri'],
      redovi: kategorije.map((k) => {
        const igriceKat = igrice.filter((i) => i.kategorija === k);
        return [
          k.charAt(0).toUpperCase() + k.slice(1),
          `${igriceKat.length} igrica`,
          igriceKat.slice(0, 3).map((i) => `${i.ikona} ${i.naziv}`).join(', '),
        ];
      }),
    },
  },
  {
    id: 'igrice-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Gaming Sistema',
    redosled: 14,
    podaci: {
      nivoi: [
        {
          naziv: 'Dimenzionalni Gaming Sistem — Gaming Industrija',
          ikona: '🎮',
          deca: ['Obavezni Zahtevi', 'Igrice', 'Kategorije', 'Dimenzije', 'IT Proizvodi', 'Gaming IT Proizvodi', 'Dimenzionalno Pitanje (D)'],
        },
        {
          naziv: 'Obavezni Zahtevi',
          ikona: '⚠️',
          deca: ['🖥️ Digitalni Kompjuter — pokretanje igrica', '🌐 Digitalni Brauzer — pristup igricama'],
        },
        {
          naziv: 'Igrice',
          ikona: '🕹️',
          deca: igrice.map((i) => `${i.ikona} ${i.naziv} — ${i.kategorija}`),
        },
        {
          naziv: 'Kategorije',
          ikona: '🏷️',
          deca: kategorije.map((k) => `${k}: ${igrice.filter((i) => i.kategorija === k).length} igrica`),
        },
        {
          naziv: 'Dimenzije',
          ikona: '🌀',
          deca: dimenzije.map((d) => `${d.ikona} ${d.nivo} — ${d.snaga}`),
        },
        {
          naziv: 'IT Proizvodi',
          ikona: '📦',
          deca: [...new Set(igrice.flatMap((i) => i.preporuceniProizvodi))].map((p) => getNazivProizvoda(p)),
        },
        {
          naziv: 'Gaming IT Proizvodi',
          ikona: '🎮',
          deca: itProizvodi.filter((p) => p.kategorija === 'gaming').map((p) => `${p.ikona} ${p.naziv}`),
        },
        {
          naziv: 'Dimenzionalno Pitanje (D)',
          ikona: '❓',
          deca: [
            'Pokretanje igrice → Provera: Digitalni Kompjuter + Brauzer',
            'Pitanje: „Koju dimenziju želiš (D)?"',
            'Igrač bira: 360D | 720D | 1440D | 2880D | 5760D',
            'Sistem učitava geometriju, zakone, vizuelni prikaz',
            'Igra počinje u izabranoj dimenziji',
          ],
        },
      ],
    },
  },
  {
    id: 'igrice-progres',
    tip: 'progres',
    naslov: '📊 Status igrica',
    redosled: 15,
    podaci: {
      stavke: igrice.map((i) => ({
        naziv: `${i.ikona} ${i.naziv}`,
        vrednost: i.status === 'aktivna' ? 100 : i.status === 'beta' ? 75 : i.status === 'razvoj' ? 50 : 25,
        opis: `${i.kategorija} | ${i.podrzaneDimenzije.length} dim | ${i.preporuceniProizvodi.length} proizvoda`,
      })),
    },
  },
  {
    id: 'igrice-baner',
    tip: 'baner',
    naslov: '🎮 Koju dimenziju želiš (D)?',
    redosled: 16,
    podaci: {
      bedz: '🌀 360D → 5760D',
      opis: `Gaming industrija sa ${igriceSistem.ukupnoIgrica} igrica u ${kategorije.length} kategorija! Svaka igrica pri pokretanju pita: „Koju dimenziju želiš (D)?" — izaberi od 360D do 5760D. RPG, Battle Royale, MOBA, Racing, Horor, Muzika, Sandbox i mnogo više. ZAHTEVI: Digitalni Kompjuter + Digitalni Brauzer!`,
      dugme: { tekst: 'Istraži dimenzije', href: '/dimenzije' },
    },
  },
  {
    id: 'igrice-cta',
    tip: 'cta',
    naslov: '🚀 Gaming Industrija — Dimenzionalni Gaming',
    redosled: 17,
    podaci: {
      opis: `${igriceSistem.ukupnoIgrica} igrica u ${kategorije.length} kategorija — od RPG i Battle Royale do Muzike i eSporta. Sve u dimenzionalnom prostoru 360D–5760D. ${itProizvodi.filter((p) => p.kategorija === 'gaming').length} specijalizovanih gaming IT proizvoda. Zahtevi: Digitalni Kompjuter + Digitalni Brauzer. Gaming Platforma: ${IOOPENUIAO_URL}. Izaberi dimenziju (D) i igraj!`,
      dugmad: [
        { tekst: `Gaming Platforma (${IOOPENUIAO_DOMEN})`, href: '/io-openui-ao-gaming-platforma' },
        { tekst: 'Dimenzije', href: '/dimenzije', stil: 'sekundarno' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
        { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
