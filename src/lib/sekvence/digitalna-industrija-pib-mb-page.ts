import type { Sekvenca } from '@/lib/types';
import { buildDigitalnaIndustrijaPibMb } from '@/lib/digitalna-industrija-pib-mb';

const r = buildDigitalnaIndustrijaPibMb('system');

export const digitalnaIndustrijaPibMbSekvence: Sekvenca[] = [
  {
    id: 'digitalna-industrija-pib-mb-hero',
    tip: 'hero',
    naslov: '🧾 Digitalna Industrija PIB/MB Registar',
    podnaslov: 'Centralni pregled PIB i matičnih brojeva za ključne entitete',
    ikona: '🧾',
    redosled: 1,
    podaci: {
      opis:
        `Registar za jurisdikciju ${r.jurisdikcija} vodi ${r.registarNosioc}. ` +
        `Ukupno entiteta: ${r.kpi.ukupnoEntiteta}.`,
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank' },
        { tekst: 'Licencni Budžet Srbija', href: '/licencni-budzet-srbija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-kpi',
    tip: 'statistika',
    naslov: '📊 KPI registar',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno entiteta', vrednost: r.kpi.ukupnoEntiteta, ikona: '🏢' },
        { naziv: 'Aktivni', vrednost: r.kpi.aktivnih, ikona: '✅' },
        { naziv: 'U pripremi', vrednost: r.kpi.uPripremi, ikona: '🛠️' },
      ],
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-tabela',
    tip: 'tabela',
    naslov: '📋 PIB i Matični broj po entitetu',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Tip', 'PIB', 'Matični broj', 'Sedište', 'Status'],
      redovi: r.entiteti.map((entitet) => [
        entitet.naziv,
        entitet.tip,
        entitet.pib,
        entitet.maticniBroj,
        entitet.sediste,
        entitet.status,
      ]),
    },
  },
  {
    id: 'digitalna-industrija-pib-mb-cta',
    tip: 'cta',
    naslov: '🚀 Operativni pristup registru',
    redosled: 4,
    podaci: {
      opis:
        'Registar omogućava centralizovanu proveru PIB/MB podataka za finansije, compliance i tehničku operativu.',
      dugmad: [
        { tekst: 'PIB/MB API', href: '/api/digitalna-industrija-pib-mb' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
