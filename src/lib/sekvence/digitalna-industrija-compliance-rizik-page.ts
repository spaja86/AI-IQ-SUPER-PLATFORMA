import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaComplianceRizik } from '@/lib/digitalna-industrija-compliance-rizik';

const r = buildDigitalnaIndustrijaComplianceRizik('system');

export const digitalnaIndustrijaComplianceRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-compliance-rizik-hero',
    tip: 'hero',
    naslov: '🧾 Digitalna Industrija — Compliance Rizik',
    podnaslov: 'Centralni registar regulatorne usklađenosti, kontrolnih procedura, internog audita i kaznene izloženosti',
    ikona: '🧾',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih compliance stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Pravni rizik', href: '/digitalna-industrija-pravni-rizik' },
        { tekst: 'Strateški rizik', href: '/digitalna-industrija-strateski-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-compliance-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI compliance rizika',
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
    id: 'digitalna-industrija-compliance-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar compliance rizika po oblastima',
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
    id: 'digitalna-industrija-compliance-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Compliance otpornost Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar compliance rizika omogućava pravovremeno upravljanje compliance izloženošću, smanjenje kaznenih troškova i sigurniju usklađenost poslovanja.',
      dugmad: [
        { tekst: 'Compliance rizik API', href: '/api/digitalna-industrija-compliance-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
