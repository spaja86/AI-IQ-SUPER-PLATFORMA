import type { Sekvenca } from '@/lib/types';
import { products, getActiveProducts, productCategories } from '@/lib/products';

const active = getActiveProducts();
const categories = Object.keys(productCategories).filter((k) =>
  products.some((p) => p.category === k)
);

export const proizvodiSekvence: Sekvenca[] = [
  {
    id: 'proizvodi-hero',
    tip: 'hero',
    naslov: '📦 IT Proizvodi',
    podnaslov: `${products.length} proizvoda i alata u ekosistemu`,
    ikona: '📦',
    redosled: 1,
    podaci: {
      opis: `IT proizvodi Digitalne Industrije — ${products.length} proizvoda u ${categories.length} kategorija, ${active.length} aktivnih. Pokreću sve platforme i servise.`,
      dugmad: [
        { tekst: 'IT Proizvodi (SR)', href: '/it-proizvodi' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'proizvodi-statistika',
    tip: 'statistika',
    naslov: '📊 Proizvodi u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno', vrednost: products.length, ikona: '📦' },
        { naziv: 'Aktivnih', vrednost: active.length, ikona: '✅' },
        { naziv: 'Kategorija', vrednost: categories.length, ikona: '📁' },
        { naziv: 'Platforme', vrednost: [...new Set(products.map((p) => p.platformId).filter(Boolean))].length, ikona: '🌐' },
      ],
    },
  },
  {
    id: 'proizvodi-kartice',
    tip: 'kartice',
    naslov: '⚡ Svi proizvodi',
    redosled: 3,
    podaci: {
      kartice: products.map((p) => ({
        naslov: p.name,
        opis: p.description,
        ikona: p.icon,
        oznake: [p.category, `v${p.version}`, p.status],
      })),
    },
  },
];
