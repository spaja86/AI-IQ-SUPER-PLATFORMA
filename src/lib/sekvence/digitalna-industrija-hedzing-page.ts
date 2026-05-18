import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaHedzing } from '@/lib/digitalna-industrija-hedzing';

const r = buildDigitalnaIndustrijaHedzing('system');

export const digitalnaIndustrijaHedzingSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-hedzing-hero',
    tip: 'hero',
    naslov: '🛡️ Digitalna Industrija — Hedzing',
    podnaslov: 'Centralni registar hedzing ugovora za zaštitu od valutnog rizika',
    ikona: '🛡️',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih hedzing ugovora: ${r.kpi.ukupnoUgovora}.`,
      dugmad: [
        { tekst: 'Valutni rizik', href: '/digitalna-industrija-valutni-rizik' },
        { tekst: 'Kursna lista', href: '/digitalna-industrija-kursna-lista', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-hedzing-kpi',
    tip: 'statistika',
    naslov: '📈 KPI hedzing portfelja',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno ugovora', vrednost: r.kpi.ukupnoUgovora, ikona: '📋' },
        { naziv: 'Aktivnih', vrednost: r.kpi.aktivnih, ikona: '✅' },
        { naziv: 'Isteklih', vrednost: r.kpi.istek, ikona: '⏱️' },
        { naziv: 'Zatvorenih', vrednost: r.kpi.zatvorenih, ikona: '🔒' },
        { naziv: 'Ukupna nominalna RSD', vrednost: r.kpi.ukupnoNominalnaRsd, ikona: '💰' },
        { naziv: 'Prosečno pokriveni rizik %', vrednost: r.kpi.prosecnoPokriveniRizikPct, ikona: '🛡️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-hedzing-tabela',
    tip: 'tabela',
    naslov: '📄 Hedzing ugovori po instrumentu',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Tip', 'Valutni par', 'Nominalna RSD', 'Stopa', 'Datum isteka', 'Pokriveni rizik %', 'Status'],
      redovi: r.ugovori.map((u) => [
        u.id,
        u.tip,
        u.valutaPar,
        String(u.nominalnaVrednostRsd),
        String(u.stopa),
        u.datumIsteka,
        String(u.pokriveniRizikPct),
        u.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-hedzing-cta',
    tip: 'cta',
    naslov: '🚀 Operativni hedzing monitoring',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava praćenje aktivnih hedzing instrumenata, pokrivenosti rizika i datuma isteka ugovora za efikasno upravljanje deviznom izloženošću.',
      dugmad: [
        { tekst: 'Hedzing API', href: '/api/digitalna-industrija-hedzing' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
