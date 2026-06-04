import type { Sekvenca } from '@/lib/types';
import { buildHarmonizacija } from '@/lib/harmonizacija';

const harmonizacija = buildHarmonizacija('system');

export const harmonizacijaSekvence: Sekvenca[] = [
  {
    id: 'harmonizacija-hero',
    tip: 'hero',
    naslov: '🎵 HARMONIZACIJA — Sinhronizacija Procesnih Slojeva',
    podnaslov: 'Kanonizovani pregled inicijalizacije, sinhronizacije, kalibracije i konsolidacije',
    ikona: '🎵',
    redosled: 1,
    podaci: {
      opis: `HARMONIZACIJA prati ${harmonizacija.slojevi.length} ključna sloja kroz indeks harmonije ${harmonizacija.indeksHarmonije}, rezonanciju ${harmonizacija.rezonancija} i prosečnu sinhronizaciju ${harmonizacija.prosekSinhronizacije}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'harmonizacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks harmonije', vrednost: harmonizacija.indeksHarmonije, ikona: '🎵' },
        { naziv: 'Rezonancija', vrednost: harmonizacija.rezonancija, ikona: '🌊' },
        { naziv: 'Stabilnost', vrednost: harmonizacija.stabilnost, ikona: '🛡️' },
        { naziv: 'Prosek sinhronizacije', vrednost: `${Math.round(harmonizacija.prosekSinhronizacije * 100)}%`, ikona: '🔄' },
        { naziv: 'Prosek kalibracije', vrednost: `${Math.round(harmonizacija.prosekKalibracije * 100)}%`, ikona: '🎯' },
        { naziv: 'Broj slojeva', vrednost: harmonizacija.slojevi.length, ikona: '📐' },
      ],
    },
  },
  {
    id: 'harmonizacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Harmonizacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Inicijalizacija',
          opis: 'Pokretanje harmonizacijskog ciklusa kroz aktivaciju baznih frekvencija i amplituda.',
          ikona: '🔊',
          oznake: ['Start', 'Frekvencija', 'Amplituda'],
        },
        {
          naslov: 'Sinhronizacija',
          opis: 'Usklađivanje svih procesnih slojeva u jedinstveni harmonični tok podataka.',
          ikona: '🔄',
          oznake: ['Sinhronizacija', 'Tok', 'Usklađivanje'],
        },
        {
          naslov: 'Kalibracija & Konsolidacija',
          opis: 'Fino podešavanje parametara i konsolidacija za maksimalni indeks harmonije.',
          ikona: '🎯',
          oznake: ['Kalibracija', 'Konsolidacija', 'Optimizacija'],
        },
      ],
    },
  },
  {
    id: 'harmonizacija-tabela',
    tip: 'tabela',
    naslov: '📋 Slojevi — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Sloj', 'Frekvencija (Hz)', 'Amplituda', 'Sinhronizacija', 'Kalibracija', 'Status'],
      redovi: harmonizacija.slojevi.map((sloj) => [
        sloj.naziv,
        String(sloj.frekvencija),
        String(sloj.amplituda),
        `${Math.round(sloj.sinhronizacija * 100)}%`,
        `${Math.round(sloj.kalibracija * 100)}%`,
        sloj.status,
      ]),
    },
  },
  {
    id: 'harmonizacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Harmonizacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks harmonije je ${harmonizacija.indeksHarmonije}. Prati API izvor istine na /api/harmonizacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Harmonizacija API', href: '/api/harmonizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
