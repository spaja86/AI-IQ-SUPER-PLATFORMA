import type { Sekvenca } from '@/lib/types';
import { buildEgzistencijaOdlivIzvestaj } from '@/lib/egzistencija-pravilnik';

const r = buildEgzistencijaOdlivIzvestaj('system');

export const egzistencijaPravilnikOdlivSekvence: Sekvenca[] = [
  {
    id: 'egzistencija-pravilnik-odliv-hero',
    tip: 'hero',
    naslov: '📤 Egzistencija — Pravilnik Odliva',
    podnaslov: 'Pravila i limiti za sve tipove odliva resursa na platformi',
    ikona: '📤',
    redosled: 1,
    podaci: {
      opis:
        `Pravilnik odliva definiše ${r.kpi.ukupnoTipova} tipa odliva. ` +
        `Minimalna isplata: ${r.kpi.minWithdrawalEUR} EUR. ` +
        `Max dnevna isplata: ${r.kpi.maxDnevnoWithdrawalEUR} EUR. ` +
        `AML prag: ${r.kpi.amlPragEUR} EUR.`,
      dugmad: [
        { tekst: 'Pravilnik Prililva', href: '/egzistencija-pravilnik-priliv' },
        { tekst: 'Pravilnik Pregled', href: '/egzistencija-pravilnik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-odliv-kpi',
    tip: 'statistika',
    naslov: '📊 KPI Odliva',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Tipovi Odliva', vrednost: r.kpi.ukupnoTipova, ikona: '📌' },
        { naziv: 'Min Isplata (EUR)', vrednost: r.kpi.minWithdrawalEUR, ikona: '💶' },
        { naziv: 'Max Isplata/Dan (EUR)', vrednost: r.kpi.maxDnevnoWithdrawalEUR, ikona: '💸' },
        { naziv: 'AML Prag (EUR)', vrednost: r.kpi.amlPragEUR, ikona: '🛡️' },
        { naziv: 'Cooling-Off Verif. (h)', vrednost: r.kpi.coolingOffVerifiedH, ikona: '⏱️' },
        { naziv: 'Cooling-Off Neverif. (h)', vrednost: r.kpi.coolingOffUnverifiedH, ikona: '⏳' },
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-odliv-tipovi',
    tip: 'tabela',
    naslov: '💸 Tipovi Odliva',
    redosled: 3,
    podaci: {
      zaglavlje: ['Tip Odliva', 'Opis'],
      redovi: [
        ['WITHDRAWAL', 'Isplata korisnika sa naloga'],
        ['GAME_LOSS', 'Gubitak iz igre — automatski odliv'],
        ['FEE_COMMISSION', 'Naknada / provizija platforme'],
        ['BONUS_EXPIRY', 'Istek neiskorišćenog bonusa'],
        ['SYSTEM_DEDUCTION', 'Korekcija od strane sistema'],
        ['ACCOUNT_CLOSURE_PAYOUT', 'Isplata pri zatvaranju naloga'],
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-odliv-pravila',
    tip: 'lista',
    naslov: '📋 Validaciona Pravila Odliva',
    redosled: 4,
    podaci: {
      stavke: [
        'Svaki odliv mora imati: destination, amount, currency, timestamp, status, reason_code.',
        `Cooling-off period: ${r.pravila.coolingOffVerifiedH}h (verifikovani), ${r.pravila.coolingOffUnverifiedH}h (neverifikovani).`,
        `Max dnevni limit isplate: ${r.kpi.maxDnevnoWithdrawalEUR} EUR po korisniku.`,
        'Odliv se ne sme izvršiti ako saldo pada ispod minimalnog praga.',
        'Wagering requirement mora biti ispunjen pre isplate bonusa.',
        `AML compliance check za isplate iznad ${r.pravila.amlCheckPragEUR} EUR.`,
        'Automatski hold pri detekciji sumnjive aktivnosti (fraud detection).',
        'Soft-delete samo — fizičko brisanje odliva nije dozvoljeno.',
      ],
    },
  },
  {
    id: 'egzistencija-pravilnik-odliv-cta',
    tip: 'cta',
    naslov: '🚀 Upravljanje Odlivima',
    redosled: 5,
    podaci: {
      opis:
        'Pravilnik odliva osigurava usklađenost sa AML/KYC regulativom, ' +
        'sprečava prevare i garantuje integritet svih odlaznih tokova resursa.',
      dugmad: [
        { tekst: 'Odliv API', href: '/api/egzistencija-pravilnik-odliv' },
        { tekst: 'Devizni Odlivi', href: '/digitalna-industrija-devizni-odlivi', stil: 'sekundarno' },
      ],
    },
  },
];
