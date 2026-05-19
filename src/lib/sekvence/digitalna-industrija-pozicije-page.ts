import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaPozicije } from '@/lib/digitalna-industrija-pozicije';

const r = buildDigitalnaIndustrijaPozicije('system');

export const digitalnaIndustrijaPozicijeSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-pozicije-hero',
    tip: 'hero',
    naslov: '👥 Digitalna Industrija — Pozicije',
    podnaslov: 'Centralni registar ključnih radnih pozicija i kadrovskih potreba',
    ikona: '👥',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno aktivnih pozicija: ${r.kpi.ukupnoPozicija}.`,
      dugmad: [
        { tekst: 'Operativni rizik', href: '/digitalna-industrija-operativni-rizik' },
        { tekst: 'Sajber rizik', href: '/digitalna-industrija-sajber-rizik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pozicije-kpi',
    tip: 'statistika',
    naslov: '📊 KPI pozicija i popunjenosti',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno pozicija', vrednost: r.kpi.ukupnoPozicija, ikona: '📋' },
        { naziv: 'Planirano izvršilaca', vrednost: r.kpi.ukupnoPlaniranoIzvrsilaca, ikona: '🧮' },
        { naziv: 'Popunjeno izvršilaca', vrednost: r.kpi.ukupnoPopunjenoIzvrsilaca, ikona: '✅' },
        { naziv: 'Popunjenih pozicija', vrednost: r.kpi.popunjenihPozicija, ikona: '🟢' },
        { naziv: 'U zapošljavanju', vrednost: r.kpi.uZaposljavanju, ikona: '🔎' },
        { naziv: 'Planiranih', vrednost: r.kpi.planiranih, ikona: '🗂️' },
        { naziv: 'Prosečna popunjenost %', vrednost: r.kpi.prosecnaPopunjenostPct, ikona: '📈' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pozicije-tabela',
    tip: 'tabela',
    naslov: '📄 Registar pozicija po sektorima',
    redosled: 3,
    podaci: {
      zaglavlje: [
        'ID',
        'Naziv pozicije',
        'Kategorija',
        'Sektor',
        'Nivo',
        'Planirano',
        'Popunjeno',
        'Bruto RSD',
        'Prioritet',
        'Status',
      ],
      redovi: r.pozicije.map((p) => [
        p.id,
        p.nazivPozicije,
        p.kategorija,
        p.sektor,
        p.nivo,
        String(p.brojIzvrsilaca),
        String(p.popunjeno),
        String(p.prosecnaBrutoZaradaRsd),
        p.prioritetZaposljavanja,
        p.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-pozicije-cta',
    tip: 'cta',
    naslov: '🚀 Kadrovski kapacitet Digitalne Industrije',
    redosled: 4,
    podaci: {
      opis:
        'Registar pozicija omogućava kontinuirano planiranje kadrovskih kapaciteta, praćenje popunjenosti i prioritetnu realizaciju zapošljavanja.',
      dugmad: [
        { tekst: 'Pozicije API', href: '/api/digitalna-industrija-pozicije' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
