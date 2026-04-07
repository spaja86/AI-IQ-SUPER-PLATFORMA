import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';
import { sajtovi, getSajtoviPoKategoriji } from '@/lib/sajtovi';
import { generisaniEngini, getRepoEngini, getProsecnaOptimizacija } from '@/lib/spaja-generator-engine';

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
        { naziv: 'Engine-i', vrednost: stats.generatorEngina, ikona: '🔧' },
        { naziv: 'Repo Engine-i', vrednost: stats.generatorRepoEngina, ikona: '📦' },
        { naziv: 'Gen. Optimiz.', vrednost: `${stats.generatorOptimizacija}%`, ikona: '⚙️' },
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
        { naziv: 'Kompanija SPAJA', ikona: '🏢', deca: [`Platforme (${stats.ukupnoPlatformi})`, `IT Proizvodi (${stats.ukupnoProizvoda})`, 'OMEGA AI Agenti', 'Proksi Mreža', 'SPAJA Mobilna Mreža', 'SPAJA Generator za Endžine'] },
        { naziv: 'Platforme', ikona: '🌐', deca: ['Jezgro', 'Finansije', 'Globalno', 'AI', 'Alati'] },
        { naziv: 'Proksi Mreža', ikona: '📡', deca: ['Hipsoneurični Signal', 'Ekscentrični Modulator', 'Ekliptična Vez', 'Rezonantni Pojačavač'] },
        { naziv: 'SPAJA Mobilna Mreža', ikona: '📱', deca: ['+38177 Primarna', '+38188 Sekundarna', '+38178 Redundantna', '+38187 Globalna'] },
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
        ['Platforme', 'Digitalne fabrike', String(stats.ukupnoPlatformi), 'Aktivne'],
        ['IT Proizvodi', 'Alati i servisi', String(stats.ukupnoProizvoda), 'U produkciji'],
        ['OMEGA AI', 'AI agenti', '21', 'Operativni'],
        ['Proksi Mreža', 'Signal infrastruktura', '6 signala / 5 čvorova', 'Aktivna'],
        ['SPAJA Mobilna', 'Mobilna mreža', '4 centrale / 5 servisa', 'Aktivna'],
        ['SPAJA Generator', 'Engine generator', `${generisaniEngini.length} engine-a / ${getRepoEngini().length} repo`, `${getProsecnaOptimizacija()}% opt.`],
        ['Organizacije', 'Strukture', '6', 'Aktivne'],
      ],
    },
  },
  {
    id: 'industrija-sajtovi-ekosistem',
    tip: 'kartice',
    naslov: '🌐 Sajtovi Ekosistema',
    podnaslov: 'Zvanični sajtovi Digitalne Industrije',
    redosled: 6,
    podaci: {
      kartice: getSajtoviPoKategoriji('ekosistem').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        href: s.url,
        oznake: ['Ekosistem'],
      })),
    },
  },
  {
    id: 'industrija-sajtovi-partneri',
    tip: 'kartice',
    naslov: '🤝 Tehnološki Partneri',
    podnaslov: 'Platforme i partneri koji podržavaju Digitalnu Industriju',
    redosled: 7,
    podaci: {
      kartice: getSajtoviPoKategoriji('tehnoloski-partner').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        href: s.url,
        oznake: ['Partner'],
      })),
    },
  },
  {
    id: 'industrija-sajtovi-drustvene',
    tip: 'kartice',
    naslov: '📱 Društvene Mreže',
    podnaslov: 'Pratite Digitalnu Industriju na društvenim mrežama',
    redosled: 8,
    podaci: {
      kartice: getSajtoviPoKategoriji('drustvena-mreza').map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        href: s.url,
        oznake: ['Društvena mreža'],
      })),
    },
  },
  {
    id: 'industrija-sajtovi-statistika',
    tip: 'statistika',
    naslov: '🔗 Povezani Sajtovi',
    redosled: 9,
    podaci: {
      stavke: [
        { naziv: 'Ukupno Sajtova', vrednost: sajtovi.length, ikona: '🌐' },
        { naziv: 'Ekosistem', vrednost: getSajtoviPoKategoriji('ekosistem').length, ikona: '🏭' },
        { naziv: 'Partneri', vrednost: getSajtoviPoKategoriji('tehnoloski-partner').length, ikona: '🤝' },
        { naziv: 'Društvene Mreže', vrednost: getSajtoviPoKategoriji('drustvena-mreza').length, ikona: '📱' },
      ],
    },
  },
  {
    id: 'industrija-cta',
    tip: 'cta',
    naslov: '🚀 Istrazi ekosistem',
    redosled: 10,
    podaci: {
      opis: 'Digitalna Industrija Kompanije SPAJA je spremna za rast. SPAJA Generator za Endžine prevlači engine-e preko svih modula.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'IT Proizvodi', href: '/it-proizvodi', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Mobilna', href: '/mobilna-mreza', stil: 'sekundarno' },
        { tekst: 'Generator', href: '/spaja-generator-engine', stil: 'sekundarno' },
      ],
    },
  },
];
