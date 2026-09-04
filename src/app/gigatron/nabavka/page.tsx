import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import type { Sekvenca } from '@/lib/types';
import { PDV_STOPA, MIN_B2B_KOLICINA, MAX_B2B_KOLICINA, MAX_STAVKI_PO_NARUDZBINI } from '@/lib/gigatron/gigatron-procurement';
import { getGigatronKatalog } from '@/lib/gigatron/gigatron-catalog';

export const metadata: Metadata = {
  title: 'GIGATRON B2B Nabavka | AI IQ SUPER PLATFORMA',
  description: 'B2B procurement forma za GIGATRON IT i elektronika opremu. Kreirajte narudžbine, pratite status i upravljajte isporukom.',
};

function getNabavkaSekvence(): Sekvenca[] {
  const katalog = getGigatronKatalog({ dostupnost: 'na-stanju' }, 1, 50);

  return [
    {
      id: 'nabavka-hero',
      tip: 'hero',
      naslov: '📦 GIGATRON B2B Nabavka',
      podnaslov: 'Kreiranje narudžbine · PDV kalkulacija · Praćenje statusa',
      ikona: '📦',
      redosled: 1,
      podaci: {
        opis: 'B2B procurement za Kompanija SPAJA — kreirajte narudžbine za IT opremu direktno kroz GIGATRON integraciju. PDV 20% se automatski kalkuliše. Isporuka 1–5 radnih dana.',
        dugmad: [
          { tekst: 'API: Kreiranje narudžbine (POST)', href: '/api/gigatron/order' },
          { tekst: 'Katalog proizvoda', href: '/gigatron/katalog', stil: 'sekundarno' },
          { tekst: 'Nazad na GIGATRON', href: '/gigatron', stil: 'sekundarno' },
        ],
      },
      stil: 'gradijent',
    },
    {
      id: 'nabavka-pravila',
      tip: 'tabela',
      naslov: '📋 Pravila Naručivanja',
      redosled: 2,
      podaci: {
        zaglavlje: ['Parametar', 'Vrednost'],
        redovi: [
          ['PDV stopa', `${PDV_STOPA * 100}%`],
          ['Minimalna količina', String(MIN_B2B_KOLICINA)],
          ['Maksimalna količina po stavki', String(MAX_B2B_KOLICINA)],
          ['Maksimalno stavki po narudžbini', String(MAX_STAVKI_PO_NARUDZBINI)],
          ['Rok isporuke (standardna)', '5 radnih dana'],
          ['Rok isporuke (ekspres)', '2 radna dana'],
          ['Rok isporuke (hitna)', '1 radni dan'],
          ['Status kreiranje', 'kreirana → potvrdjeno → u-obradi → isporuceno'],
        ],
      },
    },
    {
      id: 'nabavka-dostupni-proizvodi',
      tip: 'tabela',
      naslov: '✅ Proizvodi Dostupni za Odmah',
      redosled: 3,
      podaci: {
        zaglavlje: ['ID', 'Naziv', 'Cena (EUR)', 'Kolicina'],
        redovi: katalog.proizvodi.map((p) => [
          p.id,
          `${p.ikona} ${p.naziv}`,
          `€${p.cenaEUR}`,
          String(p.kolicinaNaStanju),
        ]),
      },
    },
    {
      id: 'nabavka-api-primer',
      tip: 'lista',
      naslov: '🌐 API Integracija',
      redosled: 4,
      podaci: {
        stavke: [
          {
            naslov: 'POST /api/gigatron/order',
            opis: 'Kreiranje nove B2B narudžbine. Body: { stavke: [{proizvodId, kolicina}], adresaIsporuke: {...}, urgentnost?, napomena? }',
            ikona: '📤',
          },
          {
            naslov: 'GET /api/gigatron/order/[id]',
            opis: 'Preuzimanje statusa narudžbine po ID-u. Vraća kompletan objekat narudžbine sa svim stavkama.',
            ikona: '📥',
          },
          {
            naslov: 'GET /api/gigatron/catalog',
            opis: 'Pretraga kataloga sa filterima: kategorija, brand, minCenaEUR, maxCenaEUR, dostupnost, q (full-text).',
            ikona: '🔍',
          },
          {
            naslov: 'GET /api/gigatron/inventory',
            opis: 'Stanje zaliha u realnom vremenu — dostupnost, rezervacije, alerti za niske zalihe.',
            ikona: '📊',
          },
        ],
      },
    },
  ];
}

export default function GigatronNabavkaPage() {
  return <StranicaRenderer sekvence={getNabavkaSekvence()} />;
}
