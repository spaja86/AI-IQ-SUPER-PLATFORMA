import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaSajberRizik } from '@/lib/digitalna-industrija-sajber-rizik';

const r = buildDigitalnaIndustrijaSajberRizik('system');

export const digitalnaIndustrijaSajberRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-sajber-rizik-hero',
    tip: 'hero',
    naslov: '🛡️ Digitalna Industrija — Sajber Rizik',
    podnaslov: 'Centralni registar mrežnih, podataka i pristupnih sajber rizika',
    ikona: '🛡️',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih sajber stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'ESG rizik', href: '/digitalna-industrija-esg-rizik' },
        { tekst: 'Operativni rizik', href: '/digitalna-industrija-operativni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-sajber-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI sajber bezbednosnih rizika',
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
    id: 'digitalna-industrija-sajber-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar sajber rizika po kategorijama',
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
    id: 'digitalna-industrija-sajber-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Sajber otpornost Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar sajber rizika omogućava pravovremeno upravljanje bezbednosnim pretnjama, skraćen oporavak i smanjenje operativnog prekida.',
      dugmad: [
        { tekst: 'Sajber rizik API', href: '/api/digitalna-industrija-sajber-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
