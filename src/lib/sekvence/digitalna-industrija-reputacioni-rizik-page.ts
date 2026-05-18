import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaReputacioniRizik } from '@/lib/digitalna-industrija-reputacioni-rizik';

const r = buildDigitalnaIndustrijaReputacioniRizik('system');

export const digitalnaIndustrijaReputacioniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-reputacioni-rizik-hero',
    tip: 'hero',
    naslov: '🏛️ Digitalna Industrija — Reputacioni Rizik',
    podnaslov: 'Centralni registar medijskih, socijalnih, regulatornih i partnerskih reputacionih rizika',
    ikona: '🏛️',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih reputacionih stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Operativni rizik', href: '/digitalna-industrija-operativni-rizik' },
        { tekst: 'Likvidnosni rizik', href: '/digitalna-industrija-likvidnosni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-reputacioni-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI reputacionog rizika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno stavki', vrednost: r.kpi.ukupnoStavki, ikona: '📋' },
        { naziv: 'Kritičnih', vrednost: r.kpi.kriticnih, ikona: '🚨' },
        { naziv: 'Visokih', vrednost: r.kpi.visokih, ikona: '⚠️' },
        { naziv: 'Umerenih', vrednost: r.kpi.umerenih, ikona: '🟡' },
        { naziv: 'Niskih', vrednost: r.kpi.niskih, ikona: '🟢' },
        { naziv: 'Prosečni rizik skor', vrednost: r.kpi.prosecniRizikSkor, ikona: '📈' },
        { naziv: 'Maksimalni rizik skor', vrednost: r.kpi.maxRizikSkor, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-reputacioni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar reputacionih rizika po oblastima',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Oblast', 'Kategorija', 'Izloženost', 'Uticaj na brend', 'Rizik skor', 'Mitigacija', 'Datum procene', 'Status'],
      redovi: r.stavke.map((s) => [
        s.id,
        s.oblast,
        s.kategorija,
        String(s.izlozenost),
        String(s.uticajNaBrend),
        String(s.rizikSkor),
        s.mitigacija,
        s.datumProcene,
        s.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-reputacioni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Zaštita brenda Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar reputacionog rizika omogućava pravovremenu identifikaciju pretnji brendu, koordinaciju PR odgovora i zaštitu poverenja partnera i korisnika.',
      dugmad: [
        { tekst: 'Reputacioni rizik API', href: '/api/digitalna-industrija-reputacioni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
