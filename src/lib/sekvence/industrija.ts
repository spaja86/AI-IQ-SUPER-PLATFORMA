import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';
import { sajtovi, getSajtoviPoKategoriji } from '@/lib/sajtovi';
import { generisaniEngini, getRepoEngini, getProsecnaOptimizacija } from '@/lib/spaja-generator-engine';
import { OMEGA_AI_INSTANCI } from '@/lib/constants';

const stats = getStatistike();

export const industrijaSekvence: Sekvenca[] = [
  {
    id: 'industrija-hero',
    tip: 'hero',
    naslov: '🏭 ŽIVA FUNKCIONALNA Digitalna Industrija',
    podnaslov: 'AI IQ SUPER PLATFORMA — Sve je AKTIVNO, sve PROIZVODI',
    ikona: '🏭',
    redosled: 1,
    podaci: { opis: `Kompanija SPAJA kao ŽIVA FUNKCIONALNA digitalna industrija — sve platforme, kompanije, organizacije i proizvodi su AKTIVNI. ${OMEGA_AI_INSTANCI.toLocaleString()} OMEGA AI instanci rade non-stop. Promptovi svuda, AI svuda, produkcija svuda.` },
  },
  {
    id: 'industrija-tekst',
    tip: 'tekst',
    naslov: 'ŽIVA FUNKCIONALNA Digitalna Industrija',
    redosled: 2,
    podaci: {
      sadrzaj: 'Digitalna Industrija je ŽIVA FUNKCIONALNA korporacija gde kompanija SPAJA funkcioniše kao industrijski kompleks u digitalnom svetu. Svaka platforma je aktivna fabrika, svaki IT proizvod je funkcionalan alat, a 40.000.000 OMEGA AI instanci su radnici koji automatizuju sve procese. PROMPTOVI su svuda — u svakoj platformi, svakom proizvodu, svakom agentu.',
      istaknuteStavke: [
        'SVE platforme su AKTIVNE digitalne fabrike',
        'SVE kompanije su AKTIVNE i proizvode',
        'SVE organizacije su AKTIVNE i funkcionišu',
        'SVI IT Proizvodi su AKTIVNI specijalizovani alati',
        '40.000.000 OMEGA AI instanci rade non-stop',
        'PROMPTOVI su integrisani svuda u ekosistemu',
        'Ekosistem je ŽIVO FUNKCIONALAN — sve je u produkciji',
      ],
    },
  },
  {
    id: 'industrija-statistika',
    tip: 'statistika',
    naslov: '📊 ŽIVA Industrija u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'OMEGA AI', vrednost: '40.000.000', ikona: '🧠' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
        { naziv: 'Engine-i', vrednost: stats.generatorEngina, ikona: '🔧' },
        { naziv: 'Repo Engine-i', vrednost: stats.generatorRepoEngina, ikona: '📦' },
        { naziv: 'Gen. Optimiz.', vrednost: `${stats.generatorOptimizacija}%`, ikona: '⚙️' },
        { naziv: 'Promptovi', vrednost: stats.ukupnoPromptova, ikona: '💬' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
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
        { naziv: 'Kompanija SPAJA', ikona: '🏢', deca: [`Platforme (${stats.ukupnoPlatformi})`, `IT Proizvodi (${stats.ukupnoProizvoda})`, '40.000.000 OMEGA AI Instanci', 'Proksi Mreža', 'SPAJA Mobilna Mreža', 'SPAJA Generator za Endžine', `Promptovi (${stats.ukupnoPromptova})`, `Igrice (${stats.ukupnoIgrica})`] },
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
        ['Platforme', 'AKTIVNE digitalne fabrike', String(stats.ukupnoPlatformi), '✅ SVE AKTIVNE'],
        ['IT Proizvodi', 'AKTIVNI alati i servisi', String(stats.ukupnoProizvoda), '✅ SVE AKTIVNO'],
        ['OMEGA AI', 'AI agenti — 40M instanci', '40.000.000', '✅ AKTIVNI'],
        ['Promptovi', 'Univerzalni Prompt sistem', String(stats.ukupnoPromptova), '✅ SVI AKTIVNI'],
        ['Igrice', 'Dimenzionalne igrice', String(stats.ukupnoIgrica), '✅ SVE AKTIVNE'],
        ['Proksi Mreža', 'Signal infrastruktura', '6 signala / 5 čvorova', '✅ AKTIVNA'],
        ['SPAJA Mobilna', 'Mobilna mreža', '4 centrale / 5 servisa', '✅ AKTIVNA'],
        ['SPAJA Generator', 'Engine generator', `${generisaniEngini.length} engine-a / ${getRepoEngini().length} repo`, `✅ ${getProsecnaOptimizacija()}% opt.`],
        ['Organizacije', 'AKTIVNE strukture', String(stats.ukupnoOrganizacija), '✅ SVE AKTIVNE'],
        ['Kompanije', 'AKTIVNE kompanije', String(stats.ukupnoKompanija), '✅ SVE AKTIVNE'],
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
      opis: 'ŽIVA FUNKCIONALNA Digitalna Industrija Kompanije SPAJA — SVE je AKTIVNO, SVE proizvodi. 40.000.000 OMEGA AI instanci. SPAJA Generator za Endžine prevlači engine-e preko svih modula. Promptovi svuda.',
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
