import type { Sekvenca } from '@/lib/types';
import { buildEgzistencijaPravilnikIzvestaj } from '@/lib/egzistencija-pravilnik';

const r = buildEgzistencijaPravilnikIzvestaj('system');

export const egzistencijaPravilnikSekvence: Sekvenca[] = [
  {
    id: 'egzistencija-pravilnik-hero',
    tip: 'hero',
    naslov: '⚖️ Egzistencija "Priliv / Odliv" — Pravilnik',
    podnaslov: 'Pravilnik životnog ciklusa i tokova resursa na platformi',
    ikona: '⚖️',
    redosled: 1,
    podaci: {
      opis:
        'Sveobuhvatan pravilnik koji upravlja egzistencijom svake entitete — ' +
        `od nastanka do gašenja. Verzija pravilnika: ${r.pravilnikVerzija}. ` +
        `Tipovi prililva: ${r.kpi.ukupnoPrilivTipova}. Tipovi odliva: ${r.kpi.ukupnoOdlivTipova}.`,
      dugmad: [
        { tekst: 'Pravilnik Prililva', href: '/egzistencija-pravilnik-priliv' },
        { tekst: 'Pravilnik Odliva', href: '/egzistencija-pravilnik-odliv', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-kpi',
    tip: 'statistika',
    naslov: '📊 KPI Pravilnika',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Tipovi Prililva', vrednost: r.kpi.ukupnoPrilivTipova, ikona: '📥' },
        { naziv: 'Tipovi Odliva', vrednost: r.kpi.ukupnoOdlivTipova, ikona: '📤' },
        { naziv: 'Statusi Entiteta', vrednost: r.kpi.ukupnoStatusova, ikona: '🔄' },
        { naziv: 'Max Deposit (EUR)', vrednost: r.kpi.maxDepositEUR, ikona: '💶' },
        { naziv: 'Max Isplata/Dan (EUR)', vrednost: r.kpi.maxWithdrawalDnevnoEUR, ikona: '💸' },
        { naziv: 'Cooling-Off Verif. (h)', vrednost: r.kpi.coolingOffVerifiedH, ikona: '⏱️' },
        { naziv: 'Cooling-Off Neverif. (h)', vrednost: r.kpi.coolingOffUnverifiedH, ikona: '⏳' },
        { naziv: 'Dormant Period (meseci)', vrednost: r.kpi.dormantPeriodMeseci, ikona: '😴' },
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-lifecycle',
    tip: 'tabela',
    naslov: '🔄 Životni Ciklus Entiteta — State Machine',
    redosled: 3,
    podaci: {
      zaglavlje: ['Status', 'Dozvoljeni Prelazi'],
      redovi: Object.entries(r.statusPrelazi).map(([status, prelazi]) => [
        status,
        (prelazi as string[]).length > 0 ? (prelazi as string[]).join(' → ') : '— (finalni status)',
      ]),
    },
  },
  {
    id: 'egzistencija-pravilnik-limiti',
    tip: 'tabela',
    naslov: '📏 Limiti Egzistencije',
    redosled: 4,
    podaci: {
      zaglavlje: ['Tip', 'Min (EUR)', 'Max (EUR)', 'Period'],
      redovi: [
        ['Deposit', '1', '10.000', 'Po transakciji'],
        ['Withdrawal', '10', '5.000', 'Dnevno'],
        ['Bonus aktivacija', '—', '500', 'Po promociji'],
        ['Session trajanje', '—', '24 h', 'Aktivna sesija'],
        ['Dormant period', '—', '12 meseci', 'Pre DORMANT statusa'],
        ['Account closure hold', '—', '30 dana', 'Pre finalnog zatvaranja'],
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-pravila',
    tip: 'lista',
    naslov: '📋 Ključna Pravila Pravilnika',
    redosled: 5,
    podaci: {
      stavke: [
        'Svaki prelaz stanja evidentiran u audit log-u (immutable).',
        'Anti-duplication check: isti referenceId ne sme biti prijavljen dvaput.',
        'Rate limiting: max 20 transakcija/sat po korisniku.',
        'KYC verifikacija za uplate iznad 1.000 EUR.',
        'Cooling-off period: 24h (verifikovani), 72h (neverifikovani) pre isplate.',
        'Wagering requirement mora biti ispunjen pre isplate bonusa.',
        'AML compliance check za isplate iznad 2.000 EUR.',
        'Automatski FREEZE naloga pri negativnom saldu.',
        'Soft-delete samo — fizičko brisanje nije dozvoljeno.',
        'Svaka transakcija sadrži: created_by, approved_by, ip_address, device_fingerprint.',
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-cta',
    tip: 'cta',
    naslov: '🚀 Operativni Tokovi Platforme',
    redosled: 6,
    podaci: {
      opis:
        'Pravilnik definiše sve aspekte egzistencije entiteta — od kreiranja do gašenja, ' +
        'uključujući potpun audit trail i mehanizme samoobnavljanja (self-healing).',
      dugmad: [
        { tekst: 'Egzistencija API', href: '/api/egzistencija-pravilnik' },
        { tekst: 'Devizni Saldo', href: '/digitalna-industrija-devizni-saldo', stil: 'sekundarno' },
      ],
    },
  },
];
