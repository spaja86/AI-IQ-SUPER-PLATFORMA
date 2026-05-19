import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaPlate } from '@/lib/digitalna-industrija-plate';

const r = buildDigitalnaIndustrijaPlate('system');

export const digitalnaIndustrijaPlateSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-plate-hero',
    tip: 'hero',
    naslov: '💰 Digitalna Industrija — Plate',
    podnaslov: 'Centralni registar plata, fondova i poreskih obaveza',
    ikona: '💰',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno zaposlenih: ${r.kpi.ukupnoZaposlenih}. ` +
        `Ukupni fond plata: ${r.kpi.ukupnoFondRsd.toLocaleString('sr-RS')} RSD.`,
      dugmad: [
        { tekst: 'Pozicije', href: '/digitalna-industrija-pozicije' },
        { tekst: 'Sajber rizik', href: '/digitalna-industrija-sajber-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-plate-kpi',
    tip: 'statistika',
    naslov: '📊 KPI plata i fondova',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno pozicija', vrednost: r.kpi.ukupnoPozicija, ikona: '📋' },
        { naziv: 'Ukupno zaposlenih', vrednost: r.kpi.ukupnoZaposlenih, ikona: '👥' },
        { naziv: 'Ukupni fond RSD', vrednost: r.kpi.ukupnoFondRsd, ikona: '💵' },
        { naziv: 'Prosečno bruto RSD', vrednost: r.kpi.prosecnoBrutoRsd, ikona: '📈' },
        { naziv: 'Prosečno neto RSD', vrednost: r.kpi.prosecnoNetoRsd, ikona: '💳' },
        { naziv: 'Ukupni doprinosi RSD', vrednost: r.kpi.ukupnoDoprinosiRsd, ikona: '🏛️' },
        { naziv: 'Ukupni porez RSD', vrednost: r.kpi.ukupnoPorezRsd, ikona: '🧾' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-plate-tabela',
    tip: 'tabela',
    naslov: '📄 Registar plata po sektorima',
    redosled: 3,
    podaci: {
      zaglavlje: [
        'ID',
        'Naziv pozicije',
        'Kategorija',
        'Sektor',
        'Nivo',
        'Bruto RSD',
        'Neto RSD',
        'Doprinosi RSD',
        'Porez RSD',
        'Zaposlenih',
        'Fond RSD',
      ],
      redovi: r.plate.map((p) => [
        p.id,
        p.nazivPozicije,
        p.kategorija,
        p.sektor,
        p.nivo,
        String(p.brutoRsd),
        String(p.netoRsd),
        String(p.doprinosiRsd),
        String(p.porezRsd),
        String(p.brojZaposlenih),
        String(p.ukupnoFondRsd),
      ]),
    },
  },
  {
    id: 'digitalna-industrija-plate-cta',
    tip: 'cta',
    naslov: '🚀 Fond plata Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar plata obezbeđuje transparentnost troškova rada, poreskih obaveza i ukupnih fondova Digitalne Industrije.',
      dugmad: [
        { tekst: 'Plate API', href: '/api/digitalna-industrija-plate' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
