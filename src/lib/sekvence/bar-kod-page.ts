import type { Sekvenca } from '@/lib/types';
import { buildBarKod } from '@/lib/bar-kod';

const r = buildBarKod('system');

export const barKodSekvence: Sekvenca[] = [
  {
    id: 'bar-kod-hero',
    tip: 'hero',
    naslov: '🔢 BAR KOD — Generatorski obrtaj po jedinici funkcije',
    podnaslov: 'Deterministički integer-only BAR KOD registar za sve platforme',
    ikona: '🔢',
    redosled: 1,
    podaci: {
      opis:
        `Ukupno platformi sa BAR KOD-om: ${r.kpi.ukupnoBarKodova}. ` +
        'Svi BAR KOD identifikatori su celobrojni i namenjeni digitalnom računu/fakturisanju.',
      dugmad: [
        { tekst: 'BAR KOD API', href: '/api/bar-kod' },
        { tekst: 'Izvoz faktura', href: '/digitalna-industrija-izvoz-faktura', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'bar-kod-kpi',
    tip: 'statistika',
    naslov: '📊 KPI BAR KOD sistema',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno BAR KOD-ova', vrednost: r.kpi.ukupnoBarKodova, ikona: '🏷️' },
        { naziv: 'Suma jedinica funkcije', vrednost: r.kpi.sumaJedinicaFunkcije, ikona: '🧮' },
        { naziv: 'Minimalni BAR KOD', vrednost: r.kpi.minBarKod, ikona: '📉' },
        { naziv: 'Maksimalni BAR KOD', vrednost: r.kpi.maxBarKod, ikona: '📈' },
      ],
    },
  },
  {
    id: 'bar-kod-tabela',
    tip: 'tabela',
    naslov: '📄 Registar BAR KOD-ova po platformama',
    redosled: 3,
    podaci: {
      zaglavlje: ['Platforma ID', 'Naziv', 'Kategorija', 'BAR KOD', 'Jedinica funkcije', 'Timestamp'],
      redovi: r.stavke.map((s) => [
        s.platformaId,
        s.naziv,
        s.kategorija,
        String(s.barKod),
        String(s.jedinicaFunkcije),
        s.timestamp,
      ]),
    },
  },
  {
    id: 'bar-kod-cta',
    tip: 'cta',
    naslov: '🧾 BAR KOD u digitalnom računu',
    redosled: 4,
    podaci: {
      opis:
        'BAR KOD je obavezni integer identifikator za digitalni račun koji se prosleđuje mejlom i koristi u fakturisanju.',
      dugmad: [
        { tekst: 'BAR KOD API', href: '/api/bar-kod' },
        { tekst: 'Fakturisanje', href: '/digitalna-industrija-izvoz-faktura', stil: 'sekundarno' },
      ],
    },
  },
];
