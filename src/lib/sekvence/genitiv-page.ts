import type { Sekvenca } from '@/lib/types';

export const genitivSekvence: Sekvenca[] = [
  {
    id: 'genitiv-hero',
    tip: 'hero',
    naslov: '🅶 GENITIV — povezani modul',
    podnaslov: 'Dopuna kontinuiteta učenja uz AKUZATIV',
    redosled: 1,
    podaci: {
      opis: 'Genitiv pokriva odnose pripadnosti, količine i negacije; ovde je dostupan kao povezana tema.',
      dugmad: [
        { tekst: 'Nazad na AKUZATIV', href: '/akuzativ' },
        { tekst: 'Dativ', href: '/dativ', stil: 'sekundarno' },
      ],
    },
  },
];
