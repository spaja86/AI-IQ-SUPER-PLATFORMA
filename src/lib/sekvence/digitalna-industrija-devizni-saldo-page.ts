import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaDevizniSaldo } from '@/lib/digitalna-industrija-devizni-saldo';

const r = buildDigitalnaIndustrijaDevizniSaldo('system');

export const digitalnaIndustrijaDevizniSaldoSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-devizni-saldo-hero',
    tip: 'hero',
    naslov: '⚖️ Digitalna Industrija — Devizni Saldo',
    podnaslov: 'Centralni pregled neto deviznog salda po entitetima',
    ikona: '⚖️',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno stavki deviznog salda: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Devizni prilivi', href: '/digitalna-industrija-devizni-prilivi' },
        { tekst: 'Devizni odlivi', href: '/digitalna-industrija-devizni-odlivi', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-devizni-saldo-kpi',
    tip: 'statistika',
    naslov: '📊 KPI deviznog salda',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno stavki', vrednost: r.kpi.ukupnoStavki, ikona: '📌' },
        { naziv: 'Prilivi', vrednost: r.kpi.prilivi, ikona: '📈' },
        { naziv: 'Odlivi', vrednost: r.kpi.odlivi, ikona: '📉' },
        { naziv: 'Neto EUR', vrednost: r.kpi.netoEUR, ikona: '💶' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-devizni-saldo-tabela',
    tip: 'tabela',
    naslov: '🌍 Stavke deviznog salda',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Tok', 'Valuta', 'Iznos'],
      redovi: r.stavke.map((stavka) => [
        stavka.entitet,
        stavka.tok,
        stavka.valuta,
        String(stavka.iznos),
      ]),
    },
  },
  {
    id: 'digitalna-industrija-devizni-saldo-cta',
    tip: 'cta',
    naslov: '🚀 Operativni devizni balans',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralno praćenje neto deviznog salda i statusa bilansa ključnih entiteta.',
      dugmad: [
        { tekst: 'Devizni saldo API', href: '/api/digitalna-industrija-devizni-saldo' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
