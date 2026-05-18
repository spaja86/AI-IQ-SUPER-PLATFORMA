import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaLikvidnosniRizik } from '@/lib/digitalna-industrija-likvidnosni-rizik';

const r = buildDigitalnaIndustrijaLikvidnosniRizik('system');

export const digitalnaIndustrijaLikvidnosniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-likvidnosni-rizik-hero',
    tip: 'hero',
    naslov: '💧 Digitalna Industrija — Likvidnosni Rizik',
    podnaslov: 'Centralni registar likvidnosti, pokrića obaveza i neto tokova',
    ikona: '💧',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih likvidnosnih pozicija: ${r.kpi.ukupnoPozicija}.`,
      dugmad: [
        { tekst: 'Kreditni rizik', href: '/digitalna-industrija-kreditni-rizik' },
        { tekst: 'Kamatni rizik', href: '/digitalna-industrija-kamatni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-likvidnosni-rizik-kpi',
    tip: 'statistika',
    naslov: '📈 KPI likvidnosnog rizika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno pozicija', vrednost: r.kpi.ukupnoPozicija, ikona: '📋' },
        { naziv: 'Stabilnih', vrednost: r.kpi.stabilnih, ikona: '✅' },
        { naziv: 'Upozorenja', vrednost: r.kpi.upozorenja, ikona: '⚠️' },
        { naziv: 'Kritičnih', vrednost: r.kpi.kriticnih, ikona: '🚨' },
        { naziv: 'Ukupno raspoloživo RSD', vrednost: r.kpi.ukupnoRaspolozivoRsd, ikona: '💰' },
        { naziv: 'Ukupno obaveze RSD', vrednost: r.kpi.ukupnoObavezeRsd, ikona: '🧾' },
        { naziv: 'Zbir neto tokova RSD', vrednost: r.kpi.zbirNetoTokRsd, ikona: '📊' },
        { naziv: 'Prosečni pokriće ratio', vrednost: r.kpi.prosecniPokriceRatio, ikona: '⚖️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-likvidnosni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Likvidnosne pozicije po instrumentu',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Instrument', 'Segment', 'Raspoloživo RSD', 'Obaveze RSD', 'Pokriće ratio', 'Neto tok RSD', 'Datum', 'Status'],
      redovi: r.pozicije.map((p) => [
        p.id,
        p.instrument,
        p.segment,
        String(p.raspolozivoRsd),
        String(p.obavezeRsd),
        String(p.pokriceRatio),
        String(p.netoTokRsd),
        p.datum,
        p.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-likvidnosni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Operativni likvidnosni monitoring',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava rano prepoznavanje nelikvidnosti kroz praćenje pokrića obaveza, neto tokova i statusa kritičnih pozicija za stabilno finansijsko upravljanje.',
      dugmad: [
        { tekst: 'Likvidnosni rizik API', href: '/api/digitalna-industrija-likvidnosni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
