import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaDiskriminacija } from '@/lib/digitalna-industrija-diskriminacija';

const r = buildDigitalnaIndustrijaDiskriminacija('system');

export const digitalnaIndustrijaDiskriminacijaSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-diskriminacija-hero',
    tip: 'hero',
    naslov: '⚖️ Digitalna Industrija — Diskriminacija',
    podnaslov:
      'Centralni registar diskriminacionog rizika u zapošljavanju, zaradama, napredovanju, benefitima, partnerstvima i AI automatizaciji',
    ikona: '⚖️',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno registrovanih stavki diskriminacije: ${r.kpi.ukupnoStavki}.`,
      dugmad: [
        { tekst: 'ESG rizik', href: '/digitalna-industrija-esg-rizik' },
        { tekst: 'Pravni rizik', href: '/digitalna-industrija-pravni-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-diskriminacija-kpi',
    tip: 'statistika',
    naslov: '📊 KPI diskriminacionog rizika',
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
    id: 'digitalna-industrija-diskriminacija-tabela',
    tip: 'tabela',
    naslov: '📄 Registar diskriminacionih rizika po oblastima',
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
    id: 'digitalna-industrija-diskriminacija-cta',
    tip: 'cta',
    naslov: '🚀 Anti-diskriminaciona otpornost Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar diskriminacije omogućava rano otkrivanje nejednakog tretmana, smanjenje pravno-reputacionih posledica i odgovornije upravljanje AI i HR odlukama.',
      dugmad: [
        { tekst: 'Diskriminacija API', href: '/api/digitalna-industrija-diskriminacija' },
        { tekst: 'Pozicije', href: '/digitalna-industrija-pozicije', stil: 'sekundarno' },
      ],
    },
  },
];
