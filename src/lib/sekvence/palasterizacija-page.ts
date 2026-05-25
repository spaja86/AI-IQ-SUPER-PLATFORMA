import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const palasterizacijaSekvence: Sekvenca[] = [
  {
    id: 'palasterizacija-hero',
    tip: 'hero',
    naslov: '🧱 Palasterizacija',
    podnaslov: 'Novi platformski modul za standardizaciju i operativnu stabilizaciju procesa',
    ikona: '🧱',
    redosled: 1,
    podaci: {
      opis: 'Palasterizacija je novi modul u AI IQ SUPER PLATFORMA ekosistemu koji uvodi standardizovane tokove, bolju kontrolu procesa i jasne operativne korake za timove Digitalne Industrije.',
      dugmad: [
        { tekst: 'Otvori Palasterizaciju', href: '/palasterizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'palasterizacija-statistika',
    tip: 'statistika',
    naslov: '📊 Palasterizacija u kontekstu platforme',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Platformi', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Aktivnih Platformi', vrednost: stats.aktivnihPlatformi, ikona: '✅' },
        { naziv: 'Ukupni Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
        { naziv: 'Kategorije', vrednost: stats.kategorijePlatformi, ikona: '📂' },
      ],
    },
  },
  {
    id: 'palasterizacija-kartice',
    tip: 'kartice',
    naslov: '🧩 Ključni operativni stubovi',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Standardizacija',
          opis: 'Ujednačavanje radnih tokova između timova, servisa i modula.',
          ikona: '📐',
          oznake: ['Proces', 'Kvalitet', 'Usklađenost'],
        },
        {
          naslov: 'Stabilizacija',
          opis: 'Smanjenje operativnog šuma i povećanje predvidivosti izvršenja.',
          ikona: '🛡️',
          oznake: ['Pouzdanost', 'Kontrola', 'SLA'],
        },
        {
          naslov: 'Merljivost',
          opis: 'Jasni KPI indikatori za praćenje učinka i napretka.',
          ikona: '📏',
          oznake: ['KPI', 'Monitoring', 'Izveštavanje'],
        },
      ],
    },
  },
  {
    id: 'palasterizacija-cta',
    tip: 'cta',
    naslov: '🚀 Pokreni Palasterizaciju',
    redosled: 4,
    podaci: {
      opis: 'Integrisi Palasterizaciju u operativni tok i uspostavi stabilniji i merljiviji rad ključnih procesa.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
];
