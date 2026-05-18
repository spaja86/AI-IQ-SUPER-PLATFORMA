import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaIzvozFaktura } from '@/lib/digitalna-industrija-izvoz-faktura';

const r = buildDigitalnaIndustrijaIzvozFaktura('system');

export const digitalnaIndustrijaIzvozFakturaSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-izvoz-faktura-hero',
    tip: 'hero',
    naslov: '🧾 Digitalna Industrija — Izvoz Faktura',
    podnaslov: 'Centralni pregled izvoznih faktura po entitetima',
    ikona: '🧾',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno izvoznih faktura: ${r.kpi.ukupnoFaktura}.`,
      dugmad: [
        { tekst: 'Regulatorni rokovi', href: '/digitalna-industrija-regulatorni-rokovi' },
        { tekst: 'Šifra delatnosti', href: '/digitalna-industrija-sifra-delatnosti', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-izvoz-faktura-kpi',
    tip: 'statistika',
    naslov: '📊 KPI faktura',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno faktura', vrednost: r.kpi.ukupnoFaktura, ikona: '📌' },
        { naziv: 'Spremno', vrednost: r.kpi.spremno, ikona: '✅' },
        { naziv: 'U pripremi', vrednost: r.kpi.uPripremi, ikona: '⏳' },
        { naziv: 'Revizija', vrednost: r.kpi.zahtevaReviziju, ikona: '⚠️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-izvoz-faktura-tabela',
    tip: 'tabela',
    naslov: '🌍 Izvozne fakture po tržištima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Broj fakture', 'Tržište', 'Valuta', 'Iznos', 'Status'],
      redovi: r.fakture.map((stavka) => [
        stavka.entitet,
        stavka.brojFakture,
        stavka.trziste,
        stavka.valuta,
        String(stavka.iznos),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-izvoz-faktura-cta',
    tip: 'cta',
    naslov: '🚀 Operativni izvoz faktura',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano praćenje izvoznih faktura i statusa spremnosti za naplatu.',
      dugmad: [
        { tekst: 'Izvoz Faktura API', href: '/api/digitalna-industrija-izvoz-faktura' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
