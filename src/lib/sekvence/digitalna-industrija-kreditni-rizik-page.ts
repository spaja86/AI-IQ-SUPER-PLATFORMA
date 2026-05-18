import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaKreditniRizik } from '@/lib/digitalna-industrija-kreditni-rizik';

const r = buildDigitalnaIndustrijaKreditniRizik('system');

export const digitalnaIndustrijaKreditniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-kreditni-rizik-hero',
    tip: 'hero',
    naslov: '🏦 Digitalna Industrija — Kreditni Rizik',
    podnaslov: 'Centralni registar kreditne izloženosti, PD/LGD i kolateralne pokrivenosti',
    ikona: '🏦',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih kreditnih izloženosti: ${r.kpi.ukupnoIzlozenosti}.`,
      dugmad: [
        { tekst: 'Kamatni rizik', href: '/digitalna-industrija-kamatni-rizik' },
        { tekst: 'Hedzing', href: '/digitalna-industrija-hedzing', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kreditni-rizik-kpi',
    tip: 'statistika',
    naslov: '📈 KPI kreditnog rizika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno izloženosti', vrednost: r.kpi.ukupnoIzlozenosti, ikona: '📋' },
        { naziv: 'Aktivnih', vrednost: r.kpi.aktivnih, ikona: '✅' },
        { naziv: 'U kašnjenju', vrednost: r.kpi.kasnjenje, ikona: '⏱️' },
        { naziv: 'Restrukturiranih', vrednost: r.kpi.restrukturiranih, ikona: '🔄' },
        { naziv: 'Ukupna izloženost RSD', vrednost: r.kpi.ukupnaIzlozenostRsd, ikona: '💰' },
        { naziv: 'Prosečni PD %', vrednost: r.kpi.prosecniPdPct, ikona: '📉' },
        { naziv: 'Prosečni LGD %', vrednost: r.kpi.prosecniLgdPct, ikona: '📉' },
        { naziv: 'Pokrivenost kolateralom %', vrednost: r.kpi.pokrivenostKolateralomPct, ikona: '🛡️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kreditni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Kreditne izloženosti po klijentu',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Klijent', 'Segment', 'Iznos RSD', 'Ročnost (meseci)', 'PD %', 'LGD %', 'Kolateral %', 'Dospeće', 'Status'],
      redovi: r.izlozenosti.map((i) => [
        i.id,
        i.klijent,
        i.segment,
        String(i.iznosRsd),
        String(i.rocnostMeseci),
        String(i.pdPct),
        String(i.lgdPct),
        String(i.kolateralPct),
        i.datumDospeca,
        i.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-kreditni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Operativni kreditni rizik monitoring',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava kontinuirano praćenje kreditne izloženosti, kvaliteta portfelja i efikasnosti kolaterala za pravovremeno upravljanje kreditnim rizikom.',
      dugmad: [
        { tekst: 'Kreditni rizik API', href: '/api/digitalna-industrija-kreditni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
