import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';

const stats = getStatistike();

export const industrijaSekvence: Sekvenca[] = [
  {
    id: 'industrija-hero',
    tip: 'hero',
    naslov: '🏭 Digitalna Industrija',
    podnaslov: 'AI IQ SUPER PLATFORMA',
    ikona: '🏭',
    redosled: 1,
    podaci: { opis: 'Kompanija SPAJA kao digitalna industrija objedinjuje sve AI i IT projekte u jedinstven ekosistem.' },
  },
  {
    id: 'industrija-tekst',
    tip: 'tekst',
    naslov: 'Sta je Digitalna Industrija?',
    redosled: 2,
    podaci: {
      sadrzaj: 'Digitalna Industrija je koncept gde kompanija SPAJA funkcionise kao industrijski kompleks u digitalnom svetu. Svaka platforma je fabrika, svaki IT proizvod je alat, a AI agenti su radnici koji automatizuju procese.',
      istaknuteStavke: [
        'Platforme su digitalne fabrike',
        'IT Proizvodi su specijalizovani alati',
        'OMEGA AI agenti automatizuju operacije',
        'Ekosistem povezuje sve u celinu',
      ],
    },
  },
  {
    id: 'industrija-statistika',
    tip: 'statistika',
    naslov: '📊 Industrija u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Kategorije', vrednost: stats.kategorijePlatformi, ikona: '📂' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
      ],
    },
  },
  {
    id: 'industrija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Struktura industrije',
    redosled: 4,
    podaci: {
      nivoi: [
        { naziv: 'Digitalna Industrija', ikona: '🏭', deca: ['Kompanija SPAJA'] },
        { naziv: 'Kompanija SPAJA', ikona: '🏢', deca: ['Platforme (11)', 'IT Proizvodi (17)', 'OMEGA AI Agenti'] },
        { naziv: 'Platforme', ikona: '🌐', deca: ['Jezgro', 'Finansije', 'Globalno', 'AI', 'Alati'] },
      ],
    },
  },
  {
    id: 'industrija-tabela',
    tip: 'tabela',
    naslov: '📋 Klasifikacija entiteta',
    redosled: 5,
    podaci: {
      zaglavlje: ['Entitet', 'Tip', 'Broj', 'Status'],
      redovi: [
        ['Platforme', 'Digitalne fabrike', '11', 'Aktivne'],
        ['IT Proizvodi', 'Alati i servisi', '17', 'U produkciji'],
        ['OMEGA AI', 'AI agenti', '21', 'Operativni'],
        ['Organizacije', 'Strukture', '6', 'Aktivne'],
      ],
    },
  },
  {
    id: 'industrija-cta',
    tip: 'cta',
    naslov: '🚀 Istrazi ekosistem',
    redosled: 6,
    podaci: {
      opis: 'Digitalna Industrija Kompanije SPAJA je spremna za rast.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
      ],
    },
  },
];
