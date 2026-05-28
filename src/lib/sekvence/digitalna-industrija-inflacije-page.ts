import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaInflacije } from '@/lib/digitalna-industrija-inflacije';

const r = buildDigitalnaIndustrijaInflacije('system');

export const digitalnaIndustrijaInflacijeSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-inflacije-hero',
    tip: 'hero',
    naslov: '📈 Digitalna Industrija — Inflacije',
    podnaslov: 'Centralni pregled inflacionih indikatora i trendova',
    ikona: '📈',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno obrađenih perioda: ${r.kpi.ukupnoPerioda}.`,
      dugmad: [
        { tekst: 'Kursna lista', href: '/digitalna-industrija-kursna-lista' },
        { tekst: 'Kursne razlike', href: '/digitalna-industrija-kursne-razlike', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-inflacije-kpi',
    tip: 'statistika',
    naslov: '📊 KPI inflacije',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno perioda', vrednost: r.kpi.ukupnoPerioda, ikona: '📅' },
        { naziv: 'Objavljeno', vrednost: r.kpi.objavljeno, ikona: '✅' },
        { naziv: 'Na proveri', vrednost: r.kpi.naProveri, ikona: '⏳' },
        { naziv: 'Prosečna mesečna', vrednost: r.kpi.prosecnaMesecnaStopa, ikona: '📉' },
        { naziv: 'Prosečna godišnja', vrednost: r.kpi.prosecnaGodisnjaStopa, ikona: '📈' },
        { naziv: 'Prosečna bazna', vrednost: r.kpi.prosecnaBaznaInflacija, ikona: '🧮' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-inflacije-tabela',
    tip: 'tabela',
    naslov: '🧾 Inflacioni indikatori po periodima',
    redosled: 3,
    podaci: {
      zaglavlje: [
        'Period',
        'CPI',
        'Mesečna stopa %',
        'Godišnja stopa %',
        'Bazna inflacija %',
        'Projekcija naredni kvartal %',
        'Status',
      ],
      redovi: r.inflacije.map((stavka) => [
        stavka.period,
        String(stavka.cpi),
        String(stavka.mesecnaStopa),
        String(stavka.godisnjaStopa),
        String(stavka.baznaInflacija),
        String(stavka.projekcijaSledeciKvartal),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-inflacije-cta',
    tip: 'cta',
    naslov: '🚀 Makro kontrolni centar',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano praćenje CPI, mesečnih/godišnjih stopa i bazne inflacije za operativno planiranje.',
      dugmad: [
        { tekst: 'Inflacije API', href: '/api/digitalna-industrija-inflacije' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
