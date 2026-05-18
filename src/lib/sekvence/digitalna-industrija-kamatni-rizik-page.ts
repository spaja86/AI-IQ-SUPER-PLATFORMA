import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaKamatniRizik } from '@/lib/digitalna-industrija-kamatni-rizik';

const r = buildDigitalnaIndustrijaKamatniRizik('system');

export const digitalnaIndustrijaKamatniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-kamatni-rizik-hero',
    tip: 'hero',
    naslov: '📊 Digitalna Industrija — Kamatni Rizik',
    podnaslov: 'Centralni registar kamatnog rizika — fiksne, varijabilne i mešovite pozicije',
    ikona: '📊',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih kamatnih pozicija: ${r.kpi.ukupnoPozicija}.`,
      dugmad: [
        { tekst: 'Hedzing', href: '/digitalna-industrija-hedzing' },
        { tekst: 'Valutni rizik', href: '/digitalna-industrija-valutni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kamatni-rizik-kpi',
    tip: 'statistika',
    naslov: '📈 KPI kamatnog rizika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno pozicija', vrednost: r.kpi.ukupnoPozicija, ikona: '📋' },
        { naziv: 'Aktivnih', vrednost: r.kpi.aktivnih, ikona: '✅' },
        { naziv: 'Zatvorenih', vrednost: r.kpi.zatvorenih, ikona: '🔒' },
        { naziv: 'U restrukturiranju', vrednost: r.kpi.uRestrukturiranju, ikona: '🔄' },
        { naziv: 'Ukupna nominalna RSD', vrednost: r.kpi.ukupnoNominalnaRsd, ikona: '💰' },
        { naziv: 'Prosečna kamatna stopa %', vrednost: r.kpi.prosecnaKamatnaStopaGodisnjaPct, ikona: '📉' },
        { naziv: 'Ukupni DUR01 RSD', vrednost: r.kpi.ukupnoDur01Rsd, ikona: '⚖️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kamatni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Kamatne pozicije po instrumentu',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Instrument', 'Tip', 'Nominalna RSD', 'Kamatna stopa %', 'Referentna stopa', 'Dospeće', 'DUR01 RSD', 'Status'],
      redovi: r.pozicije.map((p) => [
        p.id,
        p.instrument,
        p.tip,
        String(p.nominalnaVrednostRsd),
        String(p.kamatnaStopaGodisnjaPct),
        p.referentnaStopa,
        p.datumDospeca,
        String(p.dur01Rsd),
        p.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-kamatni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Operativni kamatni rizik monitoring',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava praćenje aktivnih kamatnih pozicija, izloženosti po tipu stope i DUR01 senzitivnosti za efikasno upravljanje kamatnim rizikom portfelja.',
      dugmad: [
        { tekst: 'Kamatni rizik API', href: '/api/digitalna-industrija-kamatni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
