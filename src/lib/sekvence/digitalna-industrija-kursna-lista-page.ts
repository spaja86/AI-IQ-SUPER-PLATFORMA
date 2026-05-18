import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaKursnaLista } from '@/lib/digitalna-industrija-kursna-lista';

const r = buildDigitalnaIndustrijaKursnaLista('system');

export const digitalnaIndustrijaKursnaListaSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-kursna-lista-hero',
    tip: 'hero',
    naslov: '💱 Digitalna Industrija — Kursna Lista',
    podnaslov: 'Centralni pregled valutnih parova i operativnih kurseva',
    ikona: '💱',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno valutnih parova: ${r.kpi.ukupnoParova}.`,
      dugmad: [
        { tekst: 'Devizni saldo', href: '/digitalna-industrija-devizni-saldo' },
        { tekst: 'Devizni prilivi', href: '/digitalna-industrija-devizni-prilivi', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kursna-lista-kpi',
    tip: 'statistika',
    naslov: '📊 KPI kursne liste',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno parova', vrednost: r.kpi.ukupnoParova, ikona: '📌' },
        { naziv: 'Aktivni', vrednost: r.kpi.aktivniParovi, ikona: '✅' },
        { naziv: 'Na proveri', vrednost: r.kpi.proveraParovi, ikona: '⏳' },
        { naziv: 'Prosečni spread', vrednost: r.kpi.prosecniSpread, ikona: '📏' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kursna-lista-tabela',
    tip: 'tabela',
    naslov: '🌍 Kursna lista po parovima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Valutni par', 'Kupovni', 'Srednji', 'Prodajni', 'Status'],
      redovi: r.kursnaLista.map((stavka) => [
        stavka.par,
        String(stavka.kupovni),
        String(stavka.srednji),
        String(stavka.prodajni),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-kursna-lista-cta',
    tip: 'cta',
    naslov: '🚀 Operativna FX kontrola',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano praćenje kursne liste, spread-a i statusa validacije valutnih parova.',
      dugmad: [
        { tekst: 'Kursna lista API', href: '/api/digitalna-industrija-kursna-lista' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
