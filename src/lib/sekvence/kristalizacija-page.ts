import type { Sekvenca } from '@/lib/types';
import { buildKristalizacija } from '@/lib/kristalizacija';

const kristalizacija = buildKristalizacija('system');

export const kristalizacijaSekvence: Sekvenca[] = [
  {
    id: 'kristalizacija-hero',
    tip: 'hero',
    naslov: '💎 KRISTALIZACIJA — Stabilizacija Procesnog Jezgra',
    podnaslov: 'Kanonizovani pregled nukleacije, rasta, stabilizacije i purifikacije',
    ikona: '💎',
    redosled: 1,
    podaci: {
      opis: `KRISTALIZACIJA prati ${kristalizacija.jezgra.length} jezgra kroz indeks kristalizacije ${kristalizacija.indeksKristalizacije}, stabilnost jezgra ${kristalizacija.stabilnostJezgra} i prosečnu čistoću ${kristalizacija.prosekCistoce}.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'kristalizacija-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Indeks kristalizacije', vrednost: kristalizacija.indeksKristalizacije, ikona: '💎' },
        { naziv: 'Stabilnost jezgra', vrednost: kristalizacija.stabilnostJezgra, ikona: '🛡️' },
        { naziv: 'Efikasnost procesa', vrednost: kristalizacija.efikasnostProcesa, ikona: '⚙️' },
        { naziv: 'Prosek čistoće', vrednost: `${Math.round(kristalizacija.prosekCistoce * 100)}%`, ikona: '✨' },
        { naziv: 'Prosek kohezije', vrednost: `${Math.round(kristalizacija.prosekKohezije * 100)}%`, ikona: '🔗' },
        { naziv: 'Broj jezgara', vrednost: kristalizacija.jezgra.length, ikona: '🧱' },
      ],
    },
  },
  {
    id: 'kristalizacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Kristalizacije',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Nukleacija',
          opis: 'Inicijalna formacija jezgra i priprema procesnog prostora za stabilan rast.',
          ikona: '🌱',
          oznake: ['Start', 'Jezgro', 'Formacija'],
        },
        {
          naslov: 'Rast Kristala',
          opis: 'Kontrolisano širenje procesa uz očuvanje čistoće i kohezije sistema.',
          ikona: '📈',
          oznake: ['Rast', 'Kontrola', 'Kohezija'],
        },
        {
          naslov: 'Stabilizacija & Purifikacija',
          opis: 'Završna stabilizacija jezgra i purifikacija izlaznih tokova za maksimalni kvalitet.',
          ikona: '🧪',
          oznake: ['Stabilnost', 'Purifikacija', 'Kvalitet'],
        },
      ],
    },
  },
  {
    id: 'kristalizacija-tabela',
    tip: 'tabela',
    naslov: '📋 Jezgra — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Jezgro', 'Temperatura (K)', 'Pritisak', 'Čistoća', 'Kohezija', 'Status'],
      redovi: kristalizacija.jezgra.map((jezgro) => [
        jezgro.naziv,
        String(jezgro.temperatura),
        String(jezgro.pritisak),
        `${Math.round(jezgro.cistoca * 100)}%`,
        `${Math.round(jezgro.kohezija * 100)}%`,
        jezgro.status,
      ]),
    },
  },
  {
    id: 'kristalizacija-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Kristalizacija režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni indeks kristalizacije je ${kristalizacija.indeksKristalizacije}. Prati API izvor istine na /api/kristalizacija i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Kristalizacija API', href: '/api/kristalizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
