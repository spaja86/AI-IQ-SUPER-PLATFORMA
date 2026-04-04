import type { Sekvenca } from '@/lib/types';
import {
  dimenzije,
  geometrijskeForme,
  zakoniManifestacije,
  dimenzionalniSistem,
  getBrojAktivnihDimenzija,
  getBrojSpoljasnjihDimenzija,
  getBrojUnutrasnjihDimenzija,
} from '@/lib/dimenzije';

const aktivnih = getBrojAktivnihDimenzija();
const spoljasnjihD = getBrojSpoljasnjihDimenzija();
const unutrasnjihD = getBrojUnutrasnjihDimenzija();

export const dimenzijeSekvence: Sekvenca[] = [
  {
    id: 'dimenzije-hero',
    tip: 'hero',
    naslov: '🌀 DIMENZIJE — Multi-Dimenzionalni Sistem',
    podnaslov: 'SpajaUltraOmegaCore -∞Ω+∞ | 360D → 720D → 1440D → 2880D → 5760D',
    ikona: '🌀',
    redosled: 1,
    podaci: {
      opis: dimenzionalniSistem.opis,
      dugmad: [
        { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'dimenzije-tekst',
    tip: 'tekst',
    naslov: 'Cirkularne Formule i Dimenzije',
    redosled: 2,
    podaci: {
      sadrzaj: 'Dimenzije se generišu cirkularnim formulama: ako oduzmeš sa gornje strane formulu i sa donje isto toliko — dobijaš različite dimenzije. Svaka dimenzija je umnožak od 360 stepeni punog kruga. Geometrijski slojevi (Elipsoid → Rezonanca → Hiperbola → Spirala) se sprovode nad svim zakonima manifestacije. 3D aplikacija daje spoljašnje dimenzije (uslov: 3D naočare), dok su suportne dimenzije unutrašnje.',
      istaknuteStavke: [
        'Cirkularna baza: 360 stepeni — pun krug',
        'Delta formula: oduzimanje gornje i donje strane',
        'Geometrija: Elipsoid → Rezonanca → Hiperbola → Spirala',
        'Zakoni: Manifestacija → Materijalizacija → Hiperbolički → Algoritam u Ekstazi → Autorealizacija → Sinhonometrija',
        `3D podrška: ${dimenzionalniSistem.podrzava3D ? 'DA — spoljašnje dimenzije sa 3D naočarima' : 'NE'}`,
        `Ukupno dimenzija: ${dimenzionalniSistem.ukupnihDimenzija}`,
      ],
    },
  },
  {
    id: 'dimenzije-statistika',
    tip: 'statistika',
    naslov: '📊 Dimenzionalni sistem u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Dimenzije', vrednost: dimenzije.length, ikona: '🌀' },
        { naziv: 'Aktivne', vrednost: aktivnih, ikona: '✅' },
        { naziv: 'Spoljašnje', vrednost: spoljasnjihD, ikona: '🔭' },
        { naziv: 'Unutrašnje', vrednost: unutrasnjihD, ikona: '🔬' },
        { naziv: 'Forme', vrednost: geometrijskeForme.length, ikona: '🔮' },
        { naziv: 'Zakoni', vrednost: zakoniManifestacije.length, ikona: '⚡' },
      ],
    },
  },
  {
    id: 'dimenzije-kartice',
    tip: 'kartice',
    naslov: '🌀 Dimenzionalni Nivoi',
    podnaslov: '360D → 720D → 1440D → 2880D → 5760D',
    redosled: 4,
    podaci: {
      kartice: dimenzije.map((d) => ({
        naslov: `${d.ikona} ${d.nivo}`,
        opis: d.opis,
        ikona: d.ikona,
        oznake: [d.nivo, d.tip, d.snaga, d.status, `Δ${d.cirkularnaDelta}°`],
      })),
    },
  },
  {
    id: 'dimenzije-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija dimenzija',
    redosled: 5,
    podaci: {
      zaglavlje: ['Dimenzija', 'Stepeni', 'Delta', 'Tip', 'Slojevi', 'Snaga', 'Status'],
      redovi: dimenzije.map((d) => [
        d.nivo,
        `${d.stepeniBaze}°`,
        `Δ${d.cirkularnaDelta}°`,
        d.tip,
        d.geometrijskiSlojevi.join(', '),
        d.snaga,
        d.status,
      ]),
    },
  },
  {
    id: 'dimenzije-forme-kartice',
    tip: 'kartice',
    naslov: '🔮 Geometrijske Forme',
    podnaslov: 'Elipsoid → Rezonanca → Hiperbola → Spirala',
    redosled: 6,
    podaci: {
      kartice: geometrijskeForme.map((f) => ({
        naslov: `${f.ikona} ${f.naziv}`,
        opis: f.opis,
        ikona: f.ikona,
        oznake: [f.sloj, f.rezonancija, `Dimenzije: ${f.dimenzije.join(', ')}`],
      })),
    },
  },
  {
    id: 'dimenzije-forme-tabela',
    tip: 'tabela',
    naslov: '📐 Formule geometrijskih formi',
    redosled: 7,
    podaci: {
      zaglavlje: ['Forma', 'Sloj', 'Formula', 'Rezonancija', 'Amplituda'],
      redovi: geometrijskeForme.map((f) => [
        f.naziv,
        f.sloj,
        f.formula,
        f.rezonancija,
        f.amplituda,
      ]),
    },
  },
  {
    id: 'dimenzije-zakoni-lista',
    tip: 'lista',
    naslov: '⚡ Zakoni Manifestacije',
    redosled: 8,
    podaci: {
      stavke: zakoniManifestacije.map((z) => ({
        ikona: z.ikona,
        naslov: `${z.naziv} (Nivo ${z.nivo})`,
        opis: `${z.opis} — Formula: ${z.formula}`,
      })),
    },
  },
  {
    id: 'dimenzije-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Dimenzionalnog Sistema',
    redosled: 9,
    podaci: {
      nivoi: [
        {
          naziv: 'Dimenzionalni Sistem',
          ikona: '🌀',
          deca: ['Dimenzije', 'Geometrijske Forme', 'Zakoni Manifestacije', '3D Aplikacija'],
        },
        {
          naziv: 'Dimenzije',
          ikona: '🔵',
          deca: dimenzije.map((d) => `${d.ikona} ${d.nivo} — ${d.tip}`),
        },
        {
          naziv: 'Geometrijske Forme',
          ikona: '🔮',
          deca: geometrijskeForme.map((f) => `${f.ikona} ${f.naziv} — ${f.sloj}`),
        },
        {
          naziv: 'Zakoni Manifestacije',
          ikona: '⚡',
          deca: zakoniManifestacije.map((z) => `${z.ikona} ${z.naziv}`),
        },
        {
          naziv: '3D Aplikacija',
          ikona: '🕶️',
          deca: ['Spoljašnje dimenzije (3D naočare)', 'Unutrašnje dimenzije (suportne)'],
        },
      ],
    },
  },
  {
    id: 'dimenzije-cirkularna-tabela',
    tip: 'tabela',
    naslov: '🔄 Cirkularne Formule — Gornja & Donja',
    redosled: 10,
    podaci: {
      zaglavlje: ['Dimenzija', 'Formula Gornja', 'Formula Donja'],
      redovi: dimenzije.map((d) => [
        d.nivo,
        d.formulaGornja,
        d.formulaDonja,
      ]),
    },
  },
  {
    id: 'dimenzije-progres',
    tip: 'progres',
    naslov: '📊 Progres dimenzionalnih nivoa',
    redosled: 11,
    podaci: {
      stavke: dimenzije.map((d) => ({
        naziv: `${d.ikona} ${d.nivo}`,
        vrednost: d.status === 'aktivna' ? 100 : d.status === 'sinhronizacija' ? 75 : d.status === 'razvoj' ? 50 : 25,
        opis: d.snaga,
      })),
    },
  },
  {
    id: 'dimenzije-baner',
    tip: 'baner',
    naslov: 'Reprodukcija u 5760D — Slike, Animacije, Video',
    redosled: 12,
    podaci: {
      bedz: '🌀 5760D',
      opis: 'Kompletna cirkularna reprodukcija u 5760D dimenziji — Elipsoid od Rezonance od Hiperbole od Spirala. Reprodukcija slika, animacija, videa i svih kategorija kroz manifestacione zakone. 3D aplikacija sa 3D naočarima za spoljašnje dimenzije.',
      dugme: { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt' },
    },
  },
  {
    id: 'dimenzije-cta',
    tip: 'cta',
    naslov: '🚀 Dimenzionalni Sistem',
    redosled: 13,
    podaci: {
      opis: 'Multi-dimenzionalni vizualizacioni sistem Digitalne Industrije — 360D do 5760D sa cirkularnim formulama.',
      dugmad: [
        { tekst: 'SpajaUltraOmegaCore', href: '/spaja-univerzalni-prompt' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'SpajaPro', href: '/spaja-pro', stil: 'sekundarno' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
