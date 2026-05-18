import type { Sekvenca } from '@/lib/types';
import { buildLicencniBudzetSrbija } from '@/lib/licencni-budzet-srbija';

const r = buildLicencniBudzetSrbija('system');

export const licencniBudzetSrbijaSekvence: Sekvenca[] = [
  {
    id: 'licencni-budzet-srbija-hero',
    tip: 'hero',
    naslov: '💰 Licencni Budžet Srbija',
    podnaslov: 'AI IQ World Bank — budžetski plan nabavke svih licenci za Srbiju',
    ikona: '💰',
    redosled: 1,
    podaci: {
      opis:
        'Kompletni pregled procenjenih troškova nabavke svih licenci u okviru Serbia jurisdiction procurement režima — po kategorijama, fazama i modelima plaćanja.',
      dugmad: [
        { tekst: 'Licencni registar', href: '/ai-iq-world-bank-licencna-analiza' },
        { tekst: 'Validator računa', href: '/validator-poslovnih-racuna', stil: 'sekundarno' },
        { tekst: 'Banka', href: '/banka', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'licencni-budzet-srbija-summary',
    tip: 'statistika',
    naslov: '📊 Budžetski rezime',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno stavki', vrednost: r.summary.ukupnoStavki, ikona: '📋' },
        { naziv: 'Ukupno RSD', vrednost: r.summary.ukupnoRSD.toLocaleString('sr-RS'), ikona: '💵' },
        { naziv: 'Jednokratno RSD', vrednost: r.summary.jednokratnoBudzet.toLocaleString('sr-RS'), ikona: '🏦' },
        { naziv: 'Godišnje RSD', vrednost: r.summary.godisnjeBudzet.toLocaleString('sr-RS'), ikona: '📆' },
        { naziv: 'Kritične stavke', vrednost: r.summary.kriticneStavke, ikona: '🚨' },
      ],
    },
  },
  {
    id: 'licencni-budzet-srbija-kategorije',
    tip: 'tabela',
    naslov: '🗂️ Budžet po kategorijama',
    redosled: 3,
    podaci: {
      zaglavlje: ['Kategorija', 'Broj stavki', 'Ukupno RSD'],
      redovi: r.sumarPoKategoriji.map((kategorija) => [
        kategorija.kategorija.replace(/_/g, ' '),
        String(kategorija.ukupnoStavki),
        kategorija.ukupnoRSD.toLocaleString('sr-RS'),
      ]),
    },
  },
  {
    id: 'licencni-budzet-srbija-stavke',
    tip: 'tabela',
    naslov: '📋 Sve budžetske stavke',
    redosled: 4,
    podaci: {
      zaglavlje: ['Licenca', 'Delatnost', 'Rizik', 'RSD', 'Model', 'Faza'],
      redovi: r.stavke.map((stavka) => [
        stavka.licencaNaziv,
        stavka.delatnost,
        stavka.rizik,
        stavka.procenjeniTrosak.toLocaleString('sr-RS'),
        stavka.placanjeModel,
        stavka.faza,
      ]),
    },
  },
  {
    id: 'licencni-budzet-srbija-preporuke',
    tip: 'lista',
    naslov: '📌 Preporuke',
    redosled: 5,
    podaci: {
      stavke: r.preporuke.map((preporuka) => ({ tekst: preporuka })),
    },
  },
  {
    id: 'licencni-budzet-srbija-cta',
    tip: 'cta',
    naslov: '🚀 API za integraciju budžeta',
    redosled: 6,
    podaci: {
      opis:
        'Koristi API endpoint za preuzimanje kompletnog budžetskog plana u JSON formatu za integraciju sa ERP ili finansijskim sistemom.',
      dugmad: [
        { tekst: 'API endpoint', href: '/api/licencni-budzet-srbija' },
        { tekst: 'Licencni registar', href: '/ai-iq-world-bank-licencna-analiza', stil: 'sekundarno' },
      ],
    },
  },
];
