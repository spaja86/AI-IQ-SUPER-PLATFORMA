import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaRegulatorniRokovi } from '@/lib/digitalna-industrija-regulatorni-rokovi';

const r = buildDigitalnaIndustrijaRegulatorniRokovi('system');

export const digitalnaIndustrijaRegulatorniRokoviSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-regulatorni-rokovi-hero',
    tip: 'hero',
    naslov: '📅 Digitalna Industrija — Regulatorni Rokovi',
    podnaslov: 'Centralni pregled regulatornih obaveza i rokova',
    ikona: '📅',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno aktivnih rokova: ${r.kpi.ukupnoRokova}.`,
      dugmad: [
        { tekst: 'Šifra delatnosti', href: '/digitalna-industrija-sifra-delatnosti' },
        { tekst: 'PIB/MB registar', href: '/digitalna-industrija-pib-mb', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-regulatorni-rokovi-kpi',
    tip: 'statistika',
    naslov: '📊 KPI rokova',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno rokova', vrednost: r.kpi.ukupnoRokova, ikona: '📌' },
        { naziv: 'Na vreme', vrednost: r.kpi.naVreme, ikona: '✅' },
        { naziv: 'U toku', vrednost: r.kpi.uToku, ikona: '⏳' },
        { naziv: 'Kritično', vrednost: r.kpi.kriticno, ikona: '⚠️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-regulatorni-rokovi-tabela',
    tip: 'tabela',
    naslov: '🧾 Regulatorni rokovi po entitetu',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Regulator', 'Obaveza', 'Rok', 'Status', 'Prioritet'],
      redovi: r.rokovi.map((stavka) => [
        stavka.entitet,
        stavka.regulator,
        stavka.obaveza,
        stavka.rok,
        stavka.status,
        stavka.prioritet,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-regulatorni-rokovi-cta',
    tip: 'cta',
    naslov: '🚀 Operativni pristup rokovima',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano praćenje rokova za compliance, finansije i regulatornu koordinaciju.',
      dugmad: [
        { tekst: 'Rokovi API', href: '/api/digitalna-industrija-regulatorni-rokovi' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
