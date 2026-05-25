import type { Sekvenca } from '@/lib/types';
import { buildPerkolizonik } from '@/lib/perkolizonik';

const perkolizonik = buildPerkolizonik('system');

export const perkolizonikSekvence: Sekvenca[] = [
  {
    id: 'perkolizonik-hero',
    tip: 'hero',
    naslov: '⚙️ PERKOLIZONIK — Operativna Stabilizacija Tokova',
    podnaslov: 'Kanonizovani pregled kapaciteta, latencije i stabilnosti procesnih tokova',
    ikona: '⚙️',
    redosled: 1,
    podaci: {
      opis: `PERKOLIZONIK prati ${perkolizonik.tokovi.length} ključna toka kroz operativni indeks ${perkolizonik.operativniIndeks}, stabilnost ${perkolizonik.stabilnost} i procenjeni output ${perkolizonik.procenjeniOutputPoSatu} jedinica/sat.`,
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'perkolizonik-statistika',
    tip: 'statistika',
    naslov: '📊 Ključni KPI pokazatelji',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Operativni indeks', vrednost: perkolizonik.operativniIndeks, ikona: '🎯' },
        { naziv: 'Stabilnost', vrednost: perkolizonik.stabilnost, ikona: '🛡️' },
        { naziv: 'Prosek iskorišćenosti', vrednost: `${Math.round(perkolizonik.prosekIskoriscenosti * 100)}%`, ikona: '📈' },
        { naziv: 'Prosek latencije', vrednost: `${perkolizonik.prosekLatencijeMs} ms`, ikona: '⏱️' },
        { naziv: 'Kapacitet/sat', vrednost: perkolizonik.ukupniKapacitetPoSatu, ikona: '🏭' },
        { naziv: 'Output/sat', vrednost: perkolizonik.procenjeniOutputPoSatu, ikona: '📦' },
      ],
    },
  },
  {
    id: 'perkolizonik-kartice',
    tip: 'kartice',
    naslov: '🧩 Operativni stubovi Perkolizonika',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Stabilnost toka',
          opis: 'Kontinualna kontrola latencije i grešaka po svakom kritičnom toku.',
          ikona: '🛡️',
          oznake: ['Latency', 'Error budget', 'SLA'],
        },
        {
          naslov: 'Kapacitet i throughput',
          opis: 'Balansiranje ulaznog opterećenja prema realnom kapacitetu sistema.',
          ikona: '🏭',
          oznake: ['Capacity', 'Queue', 'Throughput'],
        },
        {
          naslov: 'Prediktivna optimizacija',
          opis: 'Rano prepoznavanje tokova koji ulaze u optimizacioni ili kritični režim.',
          ikona: '🔭',
          oznake: ['Forecast', 'Risk', 'Action'],
        },
      ],
    },
  },
  {
    id: 'perkolizonik-tabela',
    tip: 'tabela',
    naslov: '📋 Tokovi — operativni pregled',
    redosled: 4,
    podaci: {
      zaglavlje: ['Tok', 'Kapacitet/sat', 'Iskorišćenost', 'Latencija (ms)', 'Greške/1000', 'Status'],
      redovi: perkolizonik.tokovi.map((tok) => [
        tok.naziv,
        String(tok.kapacitetPoSatu),
        `${Math.round(tok.iskoriscenost * 100)}%`,
        String(tok.latencijaMs),
        String(tok.greskePo1000),
        tok.status,
      ]),
    },
  },
  {
    id: 'perkolizonik-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj Perkolizonik režim',
    redosled: 5,
    podaci: {
      opis: `Trenutni operativni indeks je ${perkolizonik.operativniIndeks}. Prati API izvor istine na /api/perkolizonik i koristi dashboard za dnevni monitoring.`,
      dugmad: [
        { tekst: 'Perkolizonik API', href: '/api/perkolizonik' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
