import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaKursneRazlike } from '@/lib/digitalna-industrija-kursne-razlike';

const r = buildDigitalnaIndustrijaKursneRazlike('system');

export const digitalnaIndustrijaKursneRazlikeSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-kursne-razlike-hero',
    tip: 'hero',
    naslov: '📉 Digitalna Industrija — Kursne Razlike',
    podnaslov: 'Centralni pregled FX obračuna i usaglašavanja po dokumentima',
    ikona: '📉',
    redosled: 1,
    podaci: {
      opis:
        `Jurisdikcija: ${r.jurisdikcija}. Izvor podataka: ${r.izvor}. ` +
        `Ukupno obrađenih dokumenata: ${r.kpi.ukupnoDokumenata}.`,
      dugmad: [
        { tekst: 'Kursna lista', href: '/digitalna-industrija-kursna-lista' },
        { tekst: 'Devizni saldo', href: '/digitalna-industrija-devizni-saldo', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kursne-razlike-kpi',
    tip: 'statistika',
    naslov: '📊 KPI kursnih razlika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno dokumenata', vrednost: r.kpi.ukupnoDokumenata, ikona: '📄' },
        { naziv: 'Knjiženo', vrednost: r.kpi.knjizeno, ikona: '✅' },
        { naziv: 'Na usaglašavanju', vrednost: r.kpi.naUsaglasavanju, ikona: '⏳' },
        { naziv: 'Neto razlika RSD', vrednost: r.kpi.netoRazlikaRsd, ikona: '💸' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-kursne-razlike-tabela',
    tip: 'tabela',
    naslov: '🧾 FX obračun po dokumentima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Dokument', 'Valuta', 'Osnovica', 'Prethodni kurs', 'Tekući kurs', 'Razlika RSD', 'Status'],
      redovi: r.kursneRazlike.map((stavka) => [
        stavka.dokument,
        stavka.valuta,
        String(stavka.iznosOsnovice),
        String(stavka.prethodniKurs),
        String(stavka.tekuciKurs),
        String(stavka.kursnaRazlikaRsd),
        stavka.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-kursne-razlike-cta',
    tip: 'cta',
    naslov: '🚀 Operativni FX obračun',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovano knjiženje i kontrolu kursnih razlika kroz ključne devizne dokumente.',
      dugmad: [
        { tekst: 'Kursne razlike API', href: '/api/digitalna-industrija-kursne-razlike' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
