import type { Sekvenca } from '@/lib/types';
import { buildLicencniBudzetSrbija } from '@/lib/licencni-budzet-srbija';

const r = buildLicencniBudzetSrbija('system');

export const licencniBudzetSrbijaSekvence: Sekvenca[] = [
  {
    id: 'licencni-budzet-srbija-hero',
    tip: 'hero',
    naslov: '📜 Licencni Budžet Srbija',
    podnaslov: 'Regulatorna usklađenost, aktivna nabavka i godišnje planiranje licenci',
    ikona: '📜',
    redosled: 1,
    podaci: {
      opis:
        `Centralni pregled licenci za jurisdikciju ${r.jurisdikcija}. ` +
        `Ukupan budžet: ${r.ukupanGodisnjiBudzetRSD.toLocaleString('sr-Latn')} RSD.`,
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank' },
        { tekst: 'Licencna analiza', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'licencni-budzet-srbija-kpi',
    tip: 'statistika',
    naslov: '📊 KPI licencnog budžeta',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno licenci', vrednost: r.kpi.ukupnoLicenci, ikona: '📄' },
        { naziv: 'Aktivna nabavka', vrednost: r.kpi.aktivnaNabavka, ikona: '✅' },
        { naziv: 'Visok prioritet', vrednost: r.kpi.visokiPrioritet, ikona: '⚠️' },
        { naziv: 'Rezervisano', vrednost: `${r.rezervisanoRSD.toLocaleString('sr-Latn')} RSD`, ikona: '💰' },
        { naziv: 'Slobodno', vrednost: `${r.slobodnoRSD.toLocaleString('sr-Latn')} RSD`, ikona: '🟢' },
      ],
    },
  },
  {
    id: 'licencni-budzet-srbija-stavke',
    tip: 'tabela',
    naslov: '📋 Registar licenci',
    redosled: 3,
    podaci: {
      zaglavlje: ['Licenca', 'Regulator', 'Status', 'Prioritet', 'Godišnji trošak (RSD)', 'Rok'],
      redovi: r.stavke.map((s) => [
        s.naziv,
        s.regulator,
        s.status,
        s.prioritet,
        s.godisnjiTrosakRSD.toLocaleString('sr-Latn'),
        s.rok,
      ]),
    },
  },
  {
    id: 'licencni-budzet-srbija-cta',
    tip: 'cta',
    naslov: '🚀 Operativna aktivacija nabavke',
    redosled: 4,
    podaci: {
      opis:
        `Plan uključuje ${r.kpi.ukupnoLicenci} licenci i prosečni trošak ` +
        `${r.kpi.prosecniTrosakRSD.toLocaleString('sr-Latn')} RSD po licenci.`,
      dugmad: [
        { tekst: 'Licencni budžet API', href: '/api/licencni-budzet-srbija' },
        { tekst: 'Autofinish dashboard', href: '/autofinish', stil: 'sekundarno' },
      ],
    },
  },
];
