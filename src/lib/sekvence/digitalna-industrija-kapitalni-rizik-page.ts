import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaKapitalniRizik } from '@/lib/digitalna-industrija-kapitalni-rizik';

const r = buildDigitalnaIndustrijaKapitalniRizik('system');

export const digitalnaIndustrijaKapitalniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-kapitalni-rizik-hero',
    tip: 'hero',
    naslov: '🏛️ Digitalna Industrija — Kapitalni Rizik',
    podnaslov: 'Centralni registar adekvatnosti kapitala — CAR, CET1, Tier1/Tier2 i kapitalni baferi',
    ikona: '🏛️',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih kapitalnih pozicija: ${r.kpi.ukupnoPozicija}.`,
      dugmad: [
        { tekst: 'Kreditni rizik', href: '/digitalna-industrija-kreditni-rizik' },
        { tekst: 'Likvidnosni rizik', href: '/digitalna-industrija-likvidnosni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kapitalni-rizik-kpi',
    tip: 'statistika',
    naslov: '📈 KPI kapitalnog rizika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno pozicija', vrednost: r.kpi.ukupnoPozicija, ikona: '📋' },
        { naziv: 'Usklađenih', vrednost: r.kpi.uskladjenih, ikona: '✅' },
        { naziv: 'Upozorenja', vrednost: r.kpi.upozorenja, ikona: '⚠️' },
        { naziv: 'Prekršaja', vrednost: r.kpi.prekrsaja, ikona: '🚨' },
        { naziv: 'Ukupni kapital RSD', vrednost: r.kpi.ukupnoKapitalRsd, ikona: '💰' },
        { naziv: 'Ukupna RWA RSD', vrednost: r.kpi.ukupnoRwaRsd, ikona: '⚖️' },
        { naziv: 'Prosečni CAR %', vrednost: r.kpi.prosecniCarPct, ikona: '📉' },
        { naziv: 'Prosečni kapitalni baferi %', vrednost: r.kpi.prosecniKapitalniBufferPct, ikona: '🛡️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kapitalni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Pozicije adekvatnosti kapitala po entitetu',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Entitet', 'Tip', 'Kapital RSD', 'RWA RSD', 'CAR %', 'Min. CAR %', 'Buffer %', 'Datum', 'Status'],
      redovi: r.pozicije.map((p) => [
        p.id,
        p.entitet,
        p.tip,
        String(p.kapitalRsd),
        String(p.rwaPonderisanaAktivaRsd),
        String(p.carPct),
        String(p.minimalniCarPct),
        String(p.kapitalniBufferPct),
        p.datum,
        p.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-kapitalni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Operativni monitoring kapitalnog rizika',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava kontinuirano praćenje adekvatnosti kapitala, kapitalnih bafera i usklađenosti sa regulatornim minimumima za sve entitete Digitalne Industrije.',
      dugmad: [
        { tekst: 'Kapitalni rizik API', href: '/api/digitalna-industrija-kapitalni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
