import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaNagrade } from '@/lib/digitalna-industrija-nagrade';

const r = buildDigitalnaIndustrijaNagrade('system');

export const digitalnaIndustrijaNagradeSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-nagrade-hero',
    tip: 'hero',
    naslov: '🏆 Digitalna Industrija — Nagrade',
    podnaslov: 'Centralni registar nagrada, bonusa i premija',
    ikona: '🏆',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno nagrada: ${r.kpi.ukupnoNagrada}. ` +
        `Ukupno isplaćeno: ${r.kpi.ukupnoIsplacenoRsd.toLocaleString('sr-RS')} RSD.`,
      dugmad: [
        { tekst: 'Beneficije', href: '/digitalna-industrija-beneficije' },
        { tekst: 'Plate', href: '/digitalna-industrija-plate', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-nagrade-kpi',
    tip: 'statistika',
    naslov: '📊 KPI nagrada i bonusa',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno nagrada', vrednost: r.kpi.ukupnoNagrada, ikona: '🏅' },
        { naziv: 'Ukupno korisnika', vrednost: r.kpi.ukupnoKorisnika, ikona: '👥' },
        { naziv: 'Ukupno isplaćeno RSD', vrednost: r.kpi.ukupnoIsplacenoRsd, ikona: '💵' },
        {
          naziv: 'Prosečna vrednost/zaposlenom RSD',
          vrednost: r.kpi.prosecnaVrednostPoZaposlenomRsd,
          ikona: '📈',
        },
        { naziv: 'Učešće zaposlenih %', vrednost: r.kpi.ucesce, ikona: '✅' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-nagrade-tabela',
    tip: 'tabela',
    naslov: '📄 Registar nagrada po tipovima',
    redosled: 3,
    podaci: {
      zaglavlje: [
        'ID',
        'Naziv',
        'Tip',
        'Kriterijum',
        'Vrednost RSD',
        'Korisnika',
        'Ukupno isplaćeno RSD',
        'Frekvencija',
        'Datum isplate',
      ],
      redovi: r.nagrade.map((n) => [
        n.id,
        n.naziv,
        n.tip,
        n.opisKriterijuma,
        String(n.vrednostRsd),
        String(n.brojKorisnika),
        String(n.ukupnoIsplaceno),
        n.frekvencija,
        n.datumIsplate,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-nagrade-cta',
    tip: 'cta',
    naslov: '🚀 Sistem nagrađivanja Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar nagrada obezbeđuje transparentnost sistema nagrađivanja, isplaćenih bonusa i premija u Digitalnoj Industriji.',
      dugmad: [
        { tekst: 'Nagrade API', href: '/api/digitalna-industrija-nagrade' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
