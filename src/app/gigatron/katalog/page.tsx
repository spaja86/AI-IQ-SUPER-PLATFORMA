import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import type { Sekvenca } from '@/lib/types';
import { getGigatronKatalog, getGigatronKategorije, getGigatronBrandovi } from '@/lib/gigatron/gigatron-catalog';

export const metadata: Metadata = {
  title: 'GIGATRON Katalog — IT & Elektronika | AI IQ SUPER PLATFORMA',
  description: 'Pregledajte IT i elektronika katalog — laptopovi, mobilni telefoni, monitori, gaming oprema, mrežna oprema i više. B2B cene i affiliate provizije.',
};

function getKatalogSekvence(): Sekvenca[] {
  const katalog = getGigatronKatalog({}, 1, 50);
  const kategorije = getGigatronKategorije();
  const brendovi = getGigatronBrandovi();

  return [
    {
      id: 'katalog-hero',
      tip: 'hero',
      naslov: '🔍 GIGATRON Katalog Proizvoda',
      podnaslov: `${katalog.ukupno} IT i elektronika proizvoda · ${kategorije.length} kategorija · ${brendovi.length} brand-ova`,
      ikona: '🔍',
      redosled: 1,
      podaci: {
        opis: 'Kompletan katalog IT i elektronike opreme dostupne za B2B procurement. Filtrirajte po kategoriji, brand-u, ceni i dostupnosti.',
        dugmad: [
          { tekst: 'API: Pretraga kataloga', href: '/api/gigatron/catalog' },
          { tekst: 'B2B Nabavka', href: '/gigatron/nabavka', stil: 'sekundarno' },
          { tekst: 'Nazad na GIGATRON', href: '/gigatron', stil: 'sekundarno' },
        ],
      },
      stil: 'gradijent',
    },
    {
      id: 'katalog-kategorije',
      tip: 'tabela',
      naslov: '🗂️ Dostupne Kategorije',
      redosled: 2,
      podaci: {
        zaglavlje: ['Kategorija', 'Filter URL'],
        redovi: kategorije.map((k) => [
          k.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          `/api/gigatron/catalog?kategorija=${k}`,
        ]),
      },
    },
    {
      id: 'katalog-proizvodi',
      tip: 'tabela',
      naslov: '📦 Svi Proizvodi',
      redosled: 3,
      podaci: {
        zaglavlje: ['SKU', 'Naziv', 'Kategorija', 'Brand', 'Cena (EUR)', 'Dostupnost'],
        redovi: katalog.proizvodi.map((p) => [
          p.sku,
          `${p.ikona} ${p.naziv}`,
          p.kategorija,
          p.brand,
          `€${p.cenaEUR}`,
          p.dostupnost === 'na-stanju' ? '✅ Na stanju'
            : p.dostupnost === 'ogranicene-zalihe' ? '⚠️ Ograničeno'
            : p.dostupnost === 'na-narudzbu' ? '📋 Na narudžbu'
            : '❌ Nije dostupno',
        ]),
      },
    },
    {
      id: 'katalog-brendovi',
      tip: 'lista',
      naslov: '🏷️ Brand-ovi u Katalogu',
      redosled: 4,
      podaci: {
        stavke: brendovi.map((b) => ({
          naslov: b,
          opis: `Filtriranje: /api/gigatron/catalog?brand=${encodeURIComponent(b)}`,
          ikona: '🏷️',
        })),
      },
    },
  ];
}

export default function GigatronKatalogPage() {
  return <StranicaRenderer sekvence={getKatalogSekvence()} />;
}
