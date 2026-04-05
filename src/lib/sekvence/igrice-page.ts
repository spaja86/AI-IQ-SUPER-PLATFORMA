import type { Sekvenca } from '@/lib/types';
import {
  igrice,
  igriceSistem,
  getBrojAktivnihIgrica,
  getSveKategorijeIgrica,
  getDimenzionalnoPitanje,
} from '@/lib/igrice';
import { dimenzije } from '@/lib/dimenzije';

const aktivnihIgrica = getBrojAktivnihIgrica();
const kategorije = getSveKategorijeIgrica();

export const igriceSekvence: Sekvenca[] = [
  {
    id: 'igrice-hero',
    tip: 'hero',
    naslov: '🎮 IGRICE — Dimenzionalni Gaming Sistem',
    podnaslov: 'SpajaUltraOmegaCore -∞Ω+∞ | Igrice vezane za dimenzije 360D → 5760D',
    ikona: '🎮',
    redosled: 1,
    podaci: {
      opis: igriceSistem.opis,
      dugmad: [
        { tekst: 'Dimenzije', href: '/dimenzije' },
        { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'igrice-tekst',
    tip: 'tekst',
    naslov: 'Kako funkcionišu dimenzionalne igrice?',
    redosled: 2,
    podaci: {
      sadrzaj: 'Svaka igrica je vezana za dimenzionalni sistem (360D–5760D). Prilikom pokretanja, igrica pita igrača koju dimenziju želi (D). Izabrana dimenzija određuje geometrijske slojeve (Elipsoid, Rezonanca, Hiperbola, Spirala), zakone manifestacije, vizuelni prikaz i snagu renderovanja. Spoljašnje dimenzije (1440D, 2880D, 5760D) koriste 3D prikaz sa 3D naočarima, dok unutrašnje (360D, 720D) koriste standardni prikaz.',
      istaknuteStavke: [
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
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Igrice', vrednost: igrice.length, ikona: '🎮' },
        { naziv: 'Aktivne', vrednost: aktivnihIgrica, ikona: '✅' },
        { naziv: 'Kategorije', vrednost: kategorije.length, ikona: '🏷️' },
        { naziv: 'Dimenzije', vrednost: dimenzije.length, ikona: '🌀' },
        { naziv: 'Režimi/Igra', vrednost: dimenzije.length, ikona: '⚙️' },
      ],
    },
  },
  {
    id: 'igrice-kartice',
    tip: 'kartice',
    naslov: '🎮 Igrice',
    podnaslov: 'Svaka igrica pita „Koju dimenziju želiš (D)?" prilikom pokretanja',
    redosled: 4,
    podaci: {
      kartice: igrice.map((i) => ({
        naslov: `${i.ikona} ${i.naziv}`,
        opis: i.opis,
        ikona: i.ikona,
        oznake: [
          i.kategorija,
          i.status,
          `Podrazumevano: ${i.podrazumevanaDimenzija}`,
          `Dimenzije: ${i.podrzaneDimenzije.join(', ')}`,
        ],
      })),
    },
  },
  {
    id: 'igrice-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija igrica',
    redosled: 5,
    podaci: {
      zaglavlje: ['Igrica', 'Kategorija', 'Podrazumevano D', 'Podržane D', 'Status'],
      redovi: igrice.map((i) => [
        `${i.ikona} ${i.naziv}`,
        i.kategorija,
        i.podrazumevanaDimenzija,
        i.podrzaneDimenzije.join(', '),
        i.status,
      ]),
    },
  },
  {
    id: 'igrice-dimenzije-tabela',
    tip: 'tabela',
    naslov: '🌀 Dimenzije i režimi u igricama',
    podnaslov: 'Šta dobijate u svakoj dimenziji (D)',
    redosled: 6,
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
    id: 'igrice-pitanje-lista',
    tip: 'lista',
    naslov: '🎮 Dimenzionalno pitanje pri pokretanju',
    redosled: 7,
    podaci: {
      stavke: igrice.map((i) => ({
        ikona: i.ikona,
        naslov: i.naziv,
        opis: getDimenzionalnoPitanje(i.id),
      })),
    },
  },
  {
    id: 'igrice-funkcije-kartice',
    tip: 'kartice',
    naslov: '⚙️ Funkcije igrica',
    podnaslov: 'Svaka igrica koristi dimenzionalne forme i zakone',
    redosled: 8,
    podaci: {
      kartice: igrice.map((i) => ({
        naslov: `${i.ikona} ${i.naziv}`,
        opis: i.funkcije.join(' • '),
        ikona: i.ikona,
        oznake: [i.kategorija, ...i.funkcije.slice(0, 3)],
      })),
    },
  },
  {
    id: 'igrice-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Gaming Sistema',
    redosled: 9,
    podaci: {
      nivoi: [
        {
          naziv: 'Dimenzionalni Gaming Sistem',
          ikona: '🎮',
          deca: ['Igrice', 'Dimenzije', 'Dimenzionalno Pitanje (D)'],
        },
        {
          naziv: 'Igrice',
          ikona: '🕹️',
          deca: igrice.map((i) => `${i.ikona} ${i.naziv} — ${i.kategorija}`),
        },
        {
          naziv: 'Dimenzije',
          ikona: '🌀',
          deca: dimenzije.map((d) => `${d.ikona} ${d.nivo} — ${d.snaga}`),
        },
        {
          naziv: 'Dimenzionalno Pitanje (D)',
          ikona: '❓',
          deca: [
            'Pokretanje igrice → Pitanje: „Koju dimenziju želiš (D)?"',
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
    redosled: 10,
    podaci: {
      stavke: igrice.map((i) => ({
        naziv: `${i.ikona} ${i.naziv}`,
        vrednost: i.status === 'aktivna' ? 100 : i.status === 'beta' ? 75 : i.status === 'razvoj' ? 50 : 25,
        opis: `${i.kategorija} | ${i.podrzaneDimenzije.length} dimenzija`,
      })),
    },
  },
  {
    id: 'igrice-baner',
    tip: 'baner',
    naslov: '🎮 Koju dimenziju želiš (D)?',
    redosled: 11,
    podaci: {
      bedz: '🌀 360D → 5760D',
      opis: 'Svaka igrica pri pokretanju pita: „Koju dimenziju želiš (D)?" — izaberi od 360D do 5760D. Dimenzija određuje celokupno iskustvo: geometriju, zakone, vizuelni prikaz i snagu renderovanja. Viša dimenzija = bogatije iskustvo.',
      dugme: { tekst: 'Istraži dimenzije', href: '/dimenzije' },
    },
  },
  {
    id: 'igrice-cta',
    tip: 'cta',
    naslov: '🚀 Dimenzionalni Gaming',
    redosled: 12,
    podaci: {
      opis: 'Igrice vezane za dimenzije — od 360D do 5760D. Izaberi dimenziju (D) i igraj!',
      dugmad: [
        { tekst: 'Dimenzije', href: '/dimenzije' },
        { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
