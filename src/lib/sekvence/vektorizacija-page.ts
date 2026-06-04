import type { Sekvenca } from '@/lib/types';
import { buildVektorizacija } from '@/lib/vektorizacija';

const vektorizacija = buildVektorizacija('system');

export const vektorizacijaSekvence: Sekvenca[] = [
  {
    id: 'vektorizacija-hero',
    tip: 'hero',
    naslov: '📐 VEKTORIZACIJA — Transformacija Procesnog Prostora',
    podnaslov: 'Kanonizovani pregled inicijalizacije, transformacije, normalizacije i projekcije',
    ikona: '📐',
    redosled: 1,
    podaci: {
      opis: `VEKTORIZACIJA prati ${vektorizacija.vektori.length} vektora kroz indeks vektorizacije ${vektorizacija.indeksVektorizacije}, stabilnost prostora ${vektorizacija.stabilnostProstora} i prosečnu magnitudu ${vektorizacija.prosekMagnitude}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'vektorizacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks vektorizacije', vrednost: vektorizacija.indeksVektorizacije, ikona: '📐' },
        { naziv: 'Stabilnost prostora', vrednost: vektorizacija.stabilnostProstora, ikona: '🛡️' },
        { naziv: 'Efikasnost transformacije', vrednost: vektorizacija.efikasnostTransformacije, ikona: '⚙️' },
        { naziv: 'Prosek magnitude', vrednost: `${Math.round(vektorizacija.prosekMagnitude * 100)}%`, ikona: '📏' },
        { naziv: 'Prosek koherentnosti', vrednost: `${Math.round(vektorizacija.prosekKoherentnosti * 100)}%`, ikona: '🔗' },
        { naziv: 'Broj vektora', vrednost: vektorizacija.vektori.length, ikona: '🧭' },
      ],
    },
  },
  {
    id: 'vektorizacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Vektorizacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Inicijalizacija Prostora',
          opis: 'Priprema vektorskog prostora i postavljanje baznih parametara za transformaciju.',
          ikona: '🚀',
          oznake: ['Start', 'Prostor', 'Inicijalizacija'],
        },
        {
          naslov: 'Transformacija & Normalizacija',
          opis: 'Precizna transformacija ulaznih signala uz normalizaciju vektora za konzistentne izlaze.',
          ikona: '🔄',
          oznake: ['Transformacija', 'Normalizacija', 'Konzistentnost'],
        },
        {
          naslov: 'Projekcija Izlaza',
          opis: 'Finalna projekcija optimizovanih vektora na izlazni prostor za maksimalnu efikasnost.',
          ikona: '🎯',
          oznake: ['Projekcija', 'Optimizacija', 'Efikasnost'],
        },
      ],
    },
  },
  {
    id: 'vektorizacija-tabela',
    tip: 'tabela',
    naslov: '📋 Vektori — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Vektor', 'Dimenzije', 'Magnituda', 'Normalizacija', 'Koherentnost', 'Status'],
      redovi: vektorizacija.vektori.map((v) => [
        v.naziv,
        String(v.dimenzije),
        `${Math.round(v.magnituda * 100)}%`,
        `${Math.round(v.normalizacija * 100)}%`,
        `${Math.round(v.koherentnost * 100)}%`,
        v.status,
      ]),
    },
  },
  {
    id: 'vektorizacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Vektorizacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks vektorizacije je ${vektorizacija.indeksVektorizacije}. Prati API izvor istine na /api/vektorizacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Vektorizacija API', href: '/api/vektorizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
