import type { Sekvenca } from '@/lib/types';
import { mobilneCentrale, mobilniServisi, spajaMobilnaMreza, getAktivneCentrale } from '@/lib/mobilna-mreza';

const aktivnihCentrala = getAktivneCentrale().length;

export const mobilnaMrezaSekvence: Sekvenca[] = [
  {
    id: 'mobilna-hero',
    tip: 'hero',
    naslov: '📱 SPAJA Mobilna Mreža',
    podnaslov: 'Mobilna komunikacija preko Proksi hipsoneuričnog signala',
    ikona: '📱',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Mobilna Mreža je mobilni komunikacioni sloj Digitalne Industrije. Koristi Proksi infrastrukturu — ekscentrični simulator koncentričnog hipsoneuričnog signala — za prenos glasa, podataka i multimedije sa pozivnim brojevima centrale: +38177, +38188, +38178, +38187.',
      dugmad: [
        { tekst: 'Proksi', href: '/proksi' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'mobilna-tekst',
    tip: 'tekst',
    naslov: 'Šta je SPAJA Mobilna Mreža?',
    redosled: 2,
    podaci: {
      sadrzaj: 'SPAJA Mobilna Mreža je mobilna komunikaciona mreža Digitalne Industrije Kompanije SPAJA. Koristi postojeću Proksi infrastrukturu — ekscentrični simulator koncentričnog hipsoneuričnog signala prema WiFi objektima — za ostvarivanje mobilne komunikacije. Četiri centrale sa pozivnim brojevima +38177, +38188, +38178 i +38187 pokrivaju sve zone: jezgro, finansije, AI i globalnu komunikaciju.',
      istaknuteStavke: [
        'Pozivni brojevi: +38177, +38188, +38178, +38187',
        'Potpuna integracija sa Proksi mrežom',
        'Hipsoneurični signal za mobilnu komunikaciju',
        `${mobilniServisi.length} specijalizovanih servisa`,
        `${mobilneCentrale.length} centrale u ${aktivnihCentrala} aktivnih zona`,
        `Ukupni kapacitet: ${spajaMobilnaMreza.ukupniKapacitet}`,
      ],
    },
  },
  {
    id: 'mobilna-statistika',
    tip: 'statistika',
    naslov: '📊 Mobilna mreža u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Centrale', vrednost: mobilneCentrale.length, ikona: '📞' },
        { naziv: 'Servisi', vrednost: mobilniServisi.length, ikona: '📱' },
        { naziv: 'Aktivne', vrednost: aktivnihCentrala, ikona: '✅' },
        { naziv: 'Pozivni brojevi', vrednost: 4, ikona: '☎️' },
      ],
    },
  },
  {
    id: 'mobilna-kartice-centrale',
    tip: 'kartice',
    naslov: '📞 Centrale SPAJA mreže',
    podnaslov: 'Pozivni brojevi i zone',
    redosled: 4,
    podaci: {
      kartice: mobilneCentrale.map((c) => ({
        naslov: `${c.pozivniBroj} — ${c.naziv}`,
        opis: c.opis,
        ikona: c.ikona,
        oznake: [c.pozivniBroj, c.tip, c.status],
      })),
    },
  },
  {
    id: 'mobilna-tabela',
    tip: 'tabela',
    naslov: '📋 Pozivni brojevi i specifikacije',
    redosled: 5,
    podaci: {
      zaglavlje: ['Pozivni broj', 'Centrala', 'Tip', 'Zona', 'Kapacitet', 'Status'],
      redovi: mobilneCentrale.map((c) => [
        c.pozivniBroj,
        c.naziv,
        c.tip,
        c.zona,
        c.kapacitet,
        c.status,
      ]),
    },
  },
  {
    id: 'mobilna-kartice-servisi',
    tip: 'kartice',
    naslov: '⚡ Mobilni servisi',
    podnaslov: 'Servisi SPAJA mobilne mreže',
    redosled: 6,
    podaci: {
      kartice: mobilniServisi.map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, ...s.funkcije.slice(0, 2)],
      })),
    },
  },
  {
    id: 'mobilna-lista',
    tip: 'lista',
    naslov: '📡 Proksi integracija',
    redosled: 7,
    podaci: {
      stavke: mobilniServisi.map((s) => ({
        ikona: s.ikona,
        naslov: s.naziv,
        opis: `Koristi Proksi signal: ${s.proksiSignal} — ${s.funkcije.join(', ')}`,
      })),
    },
  },
  {
    id: 'mobilna-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura SPAJA mobilne mreže',
    redosled: 8,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Mobilna Mreža',
          ikona: '📱',
          deca: ['Centrale', 'Servisi', 'Proksi Integracija'],
        },
        {
          naziv: 'Centrale',
          ikona: '📞',
          deca: mobilneCentrale.map((c) => `${c.pozivniBroj} ${c.naziv}`),
        },
        {
          naziv: 'Servisi',
          ikona: '⚡',
          deca: mobilniServisi.map((s) => s.naziv),
        },
        {
          naziv: 'Proksi Integracija',
          ikona: '📡',
          deca: ['Hipsoneurični Signal', 'Ekscentrični Modulator', 'Ekliptična Vez', 'Rezonantni Pojačavač', 'Koncentrični Distributer'],
        },
      ],
    },
  },
  {
    id: 'mobilna-baner',
    tip: 'baner',
    naslov: 'SPAJA Mobilna — Pozovite nas!',
    redosled: 9,
    podaci: {
      bedz: '📱 SPAJA Mobilna',
      opis: `Pozivni brojevi centrale: ${spajaMobilnaMreza.pozivniBrojevi.join(', ')}. Mobilna komunikacija preko Proksi hipsoneuričnog signala sa kapacitetom od ${spajaMobilnaMreza.ukupniKapacitet}.`,
      dugme: { tekst: 'Proksi mreža', href: '/proksi' },
    },
  },
  {
    id: 'mobilna-cta',
    tip: 'cta',
    naslov: '🚀 SPAJA Mobilna infrastruktura',
    redosled: 10,
    podaci: {
      opis: 'SPAJA Mobilna Mreža — mobilna komunikacija Digitalne Industrije sa pozivnim brojevima +38177, +38188, +38178, +38187.',
      dugmad: [
        { tekst: 'Proksi', href: '/proksi' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
