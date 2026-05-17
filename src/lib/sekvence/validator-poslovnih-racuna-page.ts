import type { Sekvenca } from '@/lib/types';
import { buildValidatorPoslovnihRacuna } from '@/lib/validator-poslovnih-racuna';

const r = buildValidatorPoslovnihRacuna('system');

export const validatorPoslovnihRacunaSekvence: Sekvenca[] = [
  {
    id: 'validator-poslovni-racuni-hero',
    tip: 'hero',
    naslov: '✅ Validator Poslovnih Računa',
    podnaslov: 'AI IQ World Bank — validacija računa kroz format, compliance i operativu',
    ikona: '✅',
    redosled: 1,
    podaci: {
      opis:
        'Validator radi nad izlazom generatora poslovnih računa i daje sažetak prolaza/upozorenja po računu i nivou provere.',
      dugmad: [
        { tekst: 'Generator', href: '/generator-za-poslovne-racune' },
        { tekst: 'Banka', href: '/banka', stil: 'sekundarno' },
        { tekst: 'Poslovni Novčanik', href: '/poslovni-novcanik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'validator-poslovni-racuni-statistika',
    tip: 'statistika',
    naslov: '📊 Rezultat validacije',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno računa', vrednost: r.summary.ukupnoRacuna, ikona: '🧾' },
        { naziv: 'Ukupno provera', vrednost: r.summary.ukupnoProvera, ikona: '🧮' },
        { naziv: 'Prolaza', vrednost: r.summary.prolaza, ikona: '✅' },
        { naziv: 'Upozorenja', vrednost: r.summary.upozorenja, ikona: '⚠️' },
      ],
    },
  },
  {
    id: 'validator-poslovni-racuni-tabela',
    tip: 'tabela',
    naslov: '📋 Validacije po računu',
    redosled: 3,
    podaci: {
      zaglavlje: ['Račun', 'Tip', 'Valuta', 'Status', 'Broj stavki', 'Upozorenja'],
      redovi: r.validacije.map((v) => [
        v.racunId,
        v.tip,
        v.valuta,
        v.statusRacuna,
        String(v.stavke.length),
        String(v.stavke.filter((s) => s.status === 'upozorenje').length),
      ]),
    },
  },
  {
    id: 'validator-poslovni-racuni-cta',
    tip: 'cta',
    naslov: '🚀 Pokreni validaciju kroz API',
    redosled: 4,
    podaci: {
      opis:
        'Koristi validator API za automatsku proveru generator izlaza i integraciju sa daljim bankarskim workflow-om.',
      dugmad: [
        { tekst: 'API endpoint', href: '/api/validator-poslovnih-racuna' },
        { tekst: 'Generator', href: '/generator-za-poslovne-racune', stil: 'sekundarno' },
      ],
    },
  },
];
