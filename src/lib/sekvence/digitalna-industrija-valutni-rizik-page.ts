import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaValutniRizik } from '@/lib/digitalna-industrija-valutni-rizik';

const r = buildDigitalnaIndustrijaValutniRizik('system');

export const digitalnaIndustrijaValutniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-valutni-rizik-hero',
    tip: 'hero',
    naslov: '📊 Digitalna Industrija — Valutni Rizik',
    podnaslov: 'Centralni pregled FX izloženosti i korišćenja limita po portfolijima',
    ikona: '📊',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno aktivnih FX portfolija: ${r.kpi.ukupnoPortfolija}.`,
      dugmad: [
        { tekst: 'Kursne razlike', href: '/digitalna-industrija-kursne-razlike' },
        { tekst: 'Kursna lista', href: '/digitalna-industrija-kursna-lista', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-valutni-rizik-kpi',
    tip: 'statistika',
    naslov: '📈 KPI valutnog rizika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno portfolija', vrednost: r.kpi.ukupnoPortfolija, ikona: '📦' },
        { naziv: 'Stabilni', vrednost: r.kpi.stabilni, ikona: '✅' },
        { naziv: 'Povećani', vrednost: r.kpi.povecani, ikona: '⚠️' },
        { naziv: 'Kritični', vrednost: r.kpi.kriticni, ikona: '🚨' },
        { naziv: 'Prosečna iskorišćenost %', vrednost: r.kpi.prosecnaIskoriscenostPct, ikona: '📏' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-valutni-rizik-tabela',
    tip: 'tabela',
    naslov: '💱 FX izloženost po portfolijima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Portfolio', 'Valuta', 'Otvorena pozicija RSD', 'Limit RSD', 'Iskorišćenost %', 'Status'],
      redovi: r.izlozenosti.map((stavka) => [
        stavka.portfolio,
        stavka.valuta,
        String(stavka.otvorenaPozicijaRsd),
        String(stavka.limitRsd),
        String(stavka.iskoriscenostLimitaPct),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-valutni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Operativni FX limit monitoring',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava praćenje otvorenih pozicija, limita i kritičnih portfolija za brzu eskalaciju valutnog rizika.',
      dugmad: [
        { tekst: 'Valutni rizik API', href: '/api/digitalna-industrija-valutni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
