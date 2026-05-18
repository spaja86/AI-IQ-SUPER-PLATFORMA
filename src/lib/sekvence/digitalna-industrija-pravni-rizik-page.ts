import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaPravniRizik } from '@/lib/digitalna-industrija-pravni-rizik';

const r = buildDigitalnaIndustrijaPravniRizik('system');

export const digitalnaIndustrijaPravniRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-pravni-rizik-hero',
    tip: 'hero',
    naslov: '⚖️ Digitalna Industrija — Pravni Rizik',
    podnaslov: 'Centralni registar ugovornih, sudskih, IP i regulatornih pravnih rizika',
    ikona: '⚖️',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih pravnih stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Strateški rizik', href: '/digitalna-industrija-strateski-rizik' },
        { tekst: 'Reputacioni rizik', href: '/digitalna-industrija-reputacioni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pravni-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI pravnog rizika',
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
    id: 'digitalna-industrija-pravni-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar pravnih rizika po oblastima',
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
    id: 'digitalna-industrija-pravni-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Pravna zaštita Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar pravnog rizika omogućava pravovremeno upravljanje pravnim izloženošću, smanjenje sporova i zaštitu poslovne stabilnosti.',
      dugmad: [
        { tekst: 'Pravni rizik API', href: '/api/digitalna-industrija-pravni-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
