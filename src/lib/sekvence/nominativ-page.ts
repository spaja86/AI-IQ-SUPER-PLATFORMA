import type { Sekvenca } from '@/lib/types';

export const nominativSekvence: Sekvenca[] = [
  {
    id: 'nominativ-hero',
    tip: 'hero',
    naslov: '🅽 NOMINATIV — povezani modul',
    podnaslov: 'Polazna tačka za razumevanje padežnog sistema',
    redosled: 1,
    podaci: {
      opis: 'Nominativ je osnovni padež za imenovanje subjekta. Ovaj modul služi kao povezana tema uz AKUZATIV.',
      dugmad: [
        { tekst: 'Nazad na AKUZATIV', href: '/akuzativ' },
        { tekst: 'Genitiv', href: '/genitiv', stil: 'sekundarno' },
      ],
    },
  },
];
