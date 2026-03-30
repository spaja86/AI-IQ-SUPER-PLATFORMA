import type { Sekvenca } from '@/lib/types';
import { platforme } from '@/lib/platforme';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const platformeSekvence: Sekvenca[] = [
  {
    id: 'platforme-hero',
    tip: 'hero',
    naslov: '🌐 Sve Platforme',
    podnaslov: `${stats.ukupnoPlatformi} platformi u ${stats.kategorijePlatformi} kategorija`,
    ikona: '🌐',
    redosled: 1,
    podaci: { opis: 'Pregled svih platformi u ekosistemu Kompanije SPAJA.' },
  },
  {
    id: 'platforme-statistika',
    tip: 'statistika',
    naslov: 'Statistika platformi',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Aktivne', vrednost: stats.aktivnihPlatformi, ikona: '✅' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
        { naziv: 'Kategorije', vrednost: stats.kategorijePlatformi, ikona: '📂' },
      ],
    },
  },
  {
    id: 'platforme-kartice',
    tip: 'kartice',
    naslov: '🌐 Sve platforme u ekosistemu',
    redosled: 3,
    podaci: {
      kartice: platforme.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        progres: p.progres,
        oznake: [...p.tehnologije, p.status],
      })),
    },
  },
];
