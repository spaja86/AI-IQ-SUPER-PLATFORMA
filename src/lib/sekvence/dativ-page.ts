import type { Sekvenca } from '@/lib/types';

export const dativSekvence: Sekvenca[] = [
  {
    id: 'dativ-hero',
    tip: 'hero',
    naslov: '🅳 DATIV — povezani modul',
    podnaslov: 'Primaoc radnje i usmerenost',
    redosled: 1,
    podaci: {
      opis: 'Dativ je povezana tema koja dopunjuje razumevanje AKUZATIV modula kroz usmerenost ka primaocu.',
      dugmad: [
        { tekst: 'Nazad na AKUZATIV', href: '/akuzativ' },
        { tekst: 'Nominativ', href: '/nominativ', stil: 'sekundarno' },
      ],
    },
  },
];
