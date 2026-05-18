import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaEsgRizik } from '@/lib/digitalna-industrija-esg-rizik';

const r = buildDigitalnaIndustrijaEsgRizik('system');

export const digitalnaIndustrijaEsgRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-esg-rizik-hero',
    tip: 'hero',
    naslov: '🌱 Digitalna Industrija — ESG Rizik',
    podnaslov: 'Centralni registar ekoloških, socijalnih i upravljačkih ESG rizika',
    ikona: '🌱',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih ESG stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Compliance rizik', href: '/digitalna-industrija-compliance-rizik' },
        { tekst: 'Poreski rizik', href: '/digitalna-industrija-poreski-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-esg-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI ESG rizika po dimenzijama',
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
    id: 'digitalna-industrija-esg-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar ESG rizika po ESG dimenzijama',
    redosled: 3,
    podaci: {
      zaglavlje: [
        'ID',
        'Oblast',
        'Kategorija',
        'Verovatnoća',
        'Uticaj',
        'Rizik skor',
        'Mitigacija',
        'Datum procene',
        'Status',
      ],
      redovi: r.stavke.map((s) => [
        s.id,
        s.oblast,
        s.kategorija,
        String(s.verovatnoca),
        String(s.uticaj),
        String(s.rizikSkor),
        s.mitigacija,
        s.datumProcene,
        s.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-esg-rizik-cta',
    tip: 'cta',
    naslov: '🚀 ESG otpornost Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar ESG rizika omogućava pravovremeno upravljanje održivošću, bolju transparentnost i smanjenje regulatorno-reputacione izloženosti.',
      dugmad: [
        { tekst: 'ESG rizik API', href: '/api/digitalna-industrija-esg-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
