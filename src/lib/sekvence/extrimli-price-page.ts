import type { Sekvenca } from '@/lib/types';
import { getExtrimliPriceCatalog } from '@/lib/extrimli-price';

const katalog = getExtrimliPriceCatalog();

export const extrimliPriceSekvence: Sekvenca[] = [
  {
    id: 'extrimli-price-hero',
    tip: 'hero',
    naslov: '🎬 EXTRIMLI / EXTRONDOL / EXTREM — Kreacija priča',
    podnaslov: 'Igrice · Bioskop · Srodne branše',
    ikona: '🎬',
    redosled: 1,
    podaci: {
      opis: katalog.opis,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Ekstrimli Ekstrem', href: '/ekstrimli-ekstrem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'extrimli-price-verticals',
    tip: 'kartice',
    naslov: '🧭 Vertikale priča',
    redosled: 2,
    podaci: {
      kartice: katalog.vertikale.map((vertikala) => ({
        naslov: vertikala.naziv,
        opis: `Publika: ${vertikala.publika}`,
        ikona: vertikala.status === 'spremno' ? '✅' : '🛠️',
        oznake: [...vertikala.formati.slice(0, 2), ...vertikala.tonovi.slice(0, 2), vertikala.status],
      })),
    },
  },
  {
    id: 'extrimli-price-table',
    tip: 'tabela',
    naslov: '📋 Tema · ton · format · kanal',
    redosled: 3,
    podaci: {
      zaglavlje: ['Vertikala', 'Teme', 'Tonovi', 'Formati', 'Kanali'],
      redovi: katalog.vertikale.map((vertikala) => [
        vertikala.naziv,
        vertikala.teme.join(', '),
        vertikala.tonovi.join(', '),
        vertikala.formati.join(', '),
        vertikala.kanali.join(', '),
      ]),
    },
  },
  {
    id: 'extrimli-price-cta',
    tip: 'cta',
    naslov: '🚀 Spoji narativ sa kampanjama i partnerstvima',
    redosled: 4,
    podaci: {
      opis: 'Kreacija priča ostaje direktno povezana sa gaming modulima, EXTRIMLI površinama i reklamno-partnerskim kanalima.',
      dugmad: [
        { tekst: 'Reklame & Partnerstva', href: '/reklame-i-partnerstva' },
        { tekst: 'DIKTOR komandni centar', href: '/diktor-komandni-centar', stil: 'sekundarno' },
      ],
    },
  },
];
