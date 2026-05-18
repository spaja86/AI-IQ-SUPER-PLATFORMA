import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaOperativniRizik } from '@/lib/digitalna-industrija-operativni-rizik';

const r = buildDigitalnaIndustrijaOperativniRizik('system');

export const digitalnaIndustrijaOperativniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-operativni-rizik-hero',
    tip: 'hero',
    naslov: '🧭 Digitalna Industrija — Operativni Rizik',
    podnaslov: 'Centralni registar procesnih, tehnoloških i regulatornih operativnih rizika',
    ikona: '🧭',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih operativnih stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Likvidnosni rizik', href: '/digitalna-industrija-likvidnosni-rizik' },
        { tekst: 'Kreditni rizik', href: '/digitalna-industrija-kreditni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-operativni-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI operativnog rizika',
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
    id: 'digitalna-industrija-operativni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar operativnih rizika po oblastima',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Oblast', 'Kategorija', 'Verovatnoća', 'Uticaj', 'Rizik skor', 'Mitigacija', 'Datum procene', 'Status'],
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
    id: 'digitalna-industrija-operativni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Operativna otpornost Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar operativnog rizika omogućava prioritetizaciju mitigacija, stabilno upravljanje incidentima i održavanje regulatorne usklađenosti poslovnih tokova.',
      dugmad: [
        { tekst: 'Operativni rizik API', href: '/api/digitalna-industrija-operativni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
