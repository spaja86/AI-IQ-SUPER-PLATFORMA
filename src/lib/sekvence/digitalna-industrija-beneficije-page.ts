import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaBeneficije } from '@/lib/digitalna-industrija-beneficije';

const r = buildDigitalnaIndustrijaBeneficije('system');

export const digitalnaIndustrijaBeneficijeSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-beneficije-hero',
    tip: 'hero',
    naslov: '🎁 Digitalna Industrija — Beneficije',
    podnaslov: 'Centralni registar beneficija i paketa pogodnosti',
    ikona: '🎁',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno beneficija: ${r.kpi.ukupnoBeneficija}. ` +
        `Ukupni trošak: ${r.kpi.ukupnoTrosakRsd.toLocaleString('sr-RS')} RSD godišnje.`,
      dugmad: [
        { tekst: 'Plate', href: '/digitalna-industrija-plate' },
        { tekst: 'Pozicije', href: '/digitalna-industrija-pozicije', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-beneficije-kpi',
    tip: 'statistika',
    naslov: '📊 KPI beneficija i troškova',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno beneficija', vrednost: r.kpi.ukupnoBeneficija, ikona: '📋' },
        { naziv: 'Ukupno korisnika', vrednost: r.kpi.ukupnoKorisnika, ikona: '👥' },
        { naziv: 'Ukupni trošak RSD', vrednost: r.kpi.ukupnoTrosakRsd, ikona: '💵' },
        {
          naziv: 'Prosečna vrednost/zaposlenom RSD',
          vrednost: r.kpi.prosecnaVrednostPoZaposlenomRsd,
          ikona: '📈',
        },
        { naziv: 'Prosečna pokrivenost %', vrednost: r.kpi.pokrivenostProsecanPct, ikona: '✅' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-beneficije-tabela',
    tip: 'tabela',
    naslov: '📄 Registar beneficija po tipovima',
    redosled: 3,
    podaci: {
      zaglavlje: [
        'ID',
        'Naziv',
        'Tip',
        'Opis paketa',
        'Vrednost RSD/god',
        'Korisnika',
        'Ukupni trošak RSD',
        'Pokrivenost %',
      ],
      redovi: r.beneficije.map((b) => [
        b.id,
        b.naziv,
        b.tip,
        b.opisPaketa,
        String(b.vrednostRsdGodisnje),
        String(b.brojKorisnika),
        String(b.ukupnoTrosak),
        String(b.pokrivenostPct),
      ]),
    },
  },
  {
    id: 'digitalna-industrija-beneficije-cta',
    tip: 'cta',
    naslov: '🚀 Paket pogodnosti Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar beneficija obezbeđuje transparentnost troškova zaposlenih, pokrivenost beneficijama i ukupni paket nagrađivanja u Digitalnoj Industriji.',
      dugmad: [
        { tekst: 'Beneficije API', href: '/api/digitalna-industrija-beneficije' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
