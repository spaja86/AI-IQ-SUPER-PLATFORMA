import type { Sekvenca } from '@/lib/types';
import { buildEgzistencijaPrilivIzvestaj } from '@/lib/egzistencija-pravilnik';

const r = buildEgzistencijaPrilivIzvestaj('system');

export const egzistencijaPravilnikPrilivSekvence: Sekvenca[] = [
  {
    id: 'egzistencija-pravilnik-priliv-hero',
    tip: 'hero',
    naslov: '📥 Egzistencija — Pravilnik Prililva',
    podnaslov: 'Pravila i limiti za sve tipove prililva resursa na platformi',
    ikona: '📥',
    redosled: 1,
    podaci: {
      opis:
        `Pravilnik prililva definiše ${r.kpi.ukupnoTipova} tipa prililva. ` +
        `Maksimalni deposit: ${r.kpi.maxDepositEUR} EUR. ` +
        `KYC prag: ${r.kpi.kycPragEUR} EUR. Rate limit: ${r.kpi.rateLimitPoSatu} transakcija/sat.`,
      dugmad: [
        { tekst: 'Pravilnik Odliva', href: '/egzistencija-pravilnik-odliv' },
        { tekst: 'Pravilnik Pregled', href: '/egzistencija-pravilnik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-priliv-kpi',
    tip: 'statistika',
    naslov: '📊 KPI Prililva',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Tipovi Prililva', vrednost: r.kpi.ukupnoTipova, ikona: '📌' },
        { naziv: 'Max Deposit (EUR)', vrednost: r.kpi.maxDepositEUR, ikona: '💶' },
        { naziv: 'Max Win Payout (EUR)', vrednost: r.kpi.maxWinPayoutEUR, ikona: '🏆' },
        { naziv: 'Max Bonus Credit (EUR)', vrednost: r.kpi.maxBonusCreditEUR, ikona: '🎁' },
        { naziv: 'KYC Prag (EUR)', vrednost: r.kpi.kycPragEUR, ikona: '🪪' },
        { naziv: 'Rate Limit (txn/sat)', vrednost: r.kpi.rateLimitPoSatu, ikona: '⚡' },
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-priliv-tabela',
    tip: 'tabela',
    naslov: '💱 Tipovi Prililva i Limiti',
    redosled: 3,
    podaci: {
      zaglavlje: ['Tip Prililva', 'Min (EUR)', 'Max (EUR)'],
      redovi: Object.entries(r.limiti).map(([tip, lim]) => [
        tip,
        String((lim as { min: number; max: number }).min),
        String((lim as { min: number; max: number }).max),
      ]),
    },
  },
  {
    id: 'egzistencija-pravilnik-priliv-pravila',
    tip: 'lista',
    naslov: '📋 Validaciona Pravila Prililva',
    redosled: 4,
    podaci: {
      stavke: [
        'Svaki priliv mora imati: source, amount, currency, timestamp, status, reference_id.',
        `Anti-duplication: isti referenceId se ne sme prijaviti dvaput.`,
        `Rate limiting: maksimalno ${r.pravila.rateLimitPoSatu} transakcija/sat po korisniku.`,
        `KYC verifikacija obavezna za uplate iznad ${r.pravila.kycPragEUR} EUR.`,
        'Bonus se aktivira tek nakon ispunjenja wagering requirements.',
        `Klasifikacija izvora: ${r.pravila.klasifikacijaIzvora.join(' / ')} (automatska).`,
        'Fraud detection flag se aktivira za neobičan obrazac transakcija.',
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-priliv-cta',
    tip: 'cta',
    naslov: '🚀 Upravljanje Prilivima',
    redosled: 5,
    podaci: {
      opis:
        'Pravilnik prililva osigurava integritet svih dolaznih tokova resursa kroz ' +
        'validaciju, klasifikaciju i anti-fraud mehanizme.',
      dugmad: [
        { tekst: 'Priliv API', href: '/api/egzistencija-pravilnik-priliv' },
        { tekst: 'Devizni Prilivi', href: '/digitalna-industrija-devizni-prilivi', stil: 'sekundarno' },
      ],
    },
  },
];
