import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaPoreskiRizik } from '@/lib/digitalna-industrija-poreski-rizik';

const r = buildDigitalnaIndustrijaPoreskiRizik('system');

export const digitalnaIndustrijaPoreskiRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-poreski-rizik-hero',
    tip: 'hero',
    naslov: '🧾 Digitalna Industrija — Poreski Rizik',
    podnaslov: 'Centralni registar PDV, prijava, transfer pricing i kaznenih poreskih rizika',
    ikona: '🧾',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih poreskih stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Pravni rizik', href: '/digitalna-industrija-pravni-rizik' },
        { tekst: 'Strateški rizik', href: '/digitalna-industrija-strateski-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-poreski-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI poreskog rizika',
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
    id: 'digitalna-industrija-poreski-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar poreskih rizika po oblastima',
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
    id: 'digitalna-industrija-poreski-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Poreska otpornost Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar poreskog rizika omogućava pravovremeno upravljanje poreskom izloženošću, smanjenje kaznenih troškova i sigurniju usklađenost poslovanja.',
      dugmad: [
        { tekst: 'Poreski rizik API', href: '/api/digitalna-industrija-poreski-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
