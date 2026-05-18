import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaStrateskiRizik } from '@/lib/digitalna-industrija-strateski-rizik';

const r = buildDigitalnaIndustrijaStrateskiRizik('system');

export const digitalnaIndustrijaStrateskiRizikSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-strateski-rizik-hero',
    tip: 'hero',
    naslov: '🎯 Digitalna Industrija — Strateški Rizik',
    podnaslov: 'Centralni registar konkurentskih, tržišnih, inovacionih i regulatornih strateških rizika',
    ikona: '🎯',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih strateških stavki: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'Reputacioni rizik', href: '/digitalna-industrija-reputacioni-rizik' },
        { tekst: 'Operativni rizik', href: '/digitalna-industrija-operativni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-strateski-rizik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI strateškog rizika',
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
    id: 'digitalna-industrija-strateski-rizik-tabela',
    tip: 'tabela',
    naslov: '📄 Registar strateških rizika po oblastima',
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
    id: 'digitalna-industrija-strateski-rizik-cta',
    tip: 'cta',
    naslov: '🚀 Strateška zaštita Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar strateškog rizika omogućava pravovremenu identifikaciju strateških pretnji, prilagodbu poslovnog modela i jačanje tržišne pozicije.',
      dugmad: [
        { tekst: 'Strateški rizik API', href: '/api/digitalna-industrija-strateski-rizik' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
