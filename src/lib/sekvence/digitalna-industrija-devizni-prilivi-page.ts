import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaDevizniPrilivi } from '@/lib/digitalna-industrija-devizni-prilivi';

const r = buildDigitalnaIndustrijaDevizniPrilivi('system');

export const digitalnaIndustrijaDevizniPriliviSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-devizni-prilivi-hero',
    tip: 'hero',
    naslov: '💱 Digitalna Industrija — Devizni Prilivi',
    podnaslov: 'Centralni pregled deviznih priliva po entitetima',
    ikona: '💱',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno deviznih priliva: ${r.kpi.ukupnoPriliva}.`,
      dugmad: [
        { tekst: 'Izvoz faktura', href: '/digitalna-industrija-izvoz-faktura' },
        { tekst: 'Regulatorni rokovi', href: '/digitalna-industrija-regulatorni-rokovi', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-devizni-prilivi-kpi',
    tip: 'statistika',
    naslov: '📊 KPI priliva',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno priliva', vrednost: r.kpi.ukupnoPriliva, ikona: '📌' },
        { naziv: 'Evidentirano', vrednost: r.kpi.evidentirano, ikona: '✅' },
        { naziv: 'Na usklađivanju', vrednost: r.kpi.naUskladjivanju, ikona: '⏳' },
        { naziv: 'Blokirano', vrednost: r.kpi.blokirano, ikona: '⚠️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-devizni-prilivi-tabela',
    tip: 'tabela',
    naslov: '🌍 Devizni prilivi po izvoru',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Izvor', 'Valuta', 'Iznos', 'Status'],
      redovi: r.prilivi.map((stavka) => [
        stavka.entitet,
        stavka.izvor,
        stavka.valuta,
        String(stavka.iznos),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-devizni-prilivi-cta',
    tip: 'cta',
    naslov: '🚀 Operativni devizni tokovi',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano praćenje deviznih priliva i statusa usklađenosti kroz entitete.',
      dugmad: [
        { tekst: 'Devizni prilivi API', href: '/api/digitalna-industrija-devizni-prilivi' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
