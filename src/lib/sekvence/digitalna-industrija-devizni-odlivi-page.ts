import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaDevizniOdlivi } from '@/lib/digitalna-industrija-devizni-odlivi';

const r = buildDigitalnaIndustrijaDevizniOdlivi('system');

export const digitalnaIndustrijaDevizniOdliviSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-devizni-odlivi-hero',
    tip: 'hero',
    naslov: '💸 Digitalna Industrija — Devizni Odlivi',
    podnaslov: 'Centralni pregled deviznih odliva po entitetima',
    ikona: '💸',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno deviznih odliva: ${r.kpi.ukupnoOdliva}.`,
      dugmad: [
        { tekst: 'Devizni prilivi', href: '/digitalna-industrija-devizni-prilivi' },
        { tekst: 'Izvoz faktura', href: '/digitalna-industrija-izvoz-faktura', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-devizni-odlivi-kpi',
    tip: 'statistika',
    naslov: '📊 KPI odliva',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno odliva', vrednost: r.kpi.ukupnoOdliva, ikona: '📌' },
        { naziv: 'Odobreno', vrednost: r.kpi.odobreno, ikona: '✅' },
        { naziv: 'Na proveri', vrednost: r.kpi.naProveri, ikona: '⏳' },
        { naziv: 'Zadržano', vrednost: r.kpi.zadrzano, ikona: '⚠️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-devizni-odlivi-tabela',
    tip: 'tabela',
    naslov: '🌍 Devizni odlivi po nameni',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Namena', 'Valuta', 'Iznos', 'Status'],
      redovi: r.odlivi.map((stavka) => [
        stavka.entitet,
        stavka.namena,
        stavka.valuta,
        String(stavka.iznos),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-devizni-odlivi-cta',
    tip: 'cta',
    naslov: '🚀 Operativni devizni odlivi',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano praćenje deviznih odliva i statusa validacije po entitetima.',
      dugmad: [
        { tekst: 'Devizni odlivi API', href: '/api/digitalna-industrija-devizni-odlivi' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
