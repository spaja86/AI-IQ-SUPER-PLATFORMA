import type { Sekvenca } from '@/lib/types';
import { proksiSignali, proksiCvorovi, proksiMreza, getAktivniSignali, getBrojPovezanihPlatformi } from '@/lib/proksi';

const aktivnih = getAktivniSignali().length;
const povezanihPlatformi = getBrojPovezanihPlatformi();

export const proksiSekvence: Sekvenca[] = [
  {
    id: 'proksi-hero',
    tip: 'hero',
    naslov: '📡 PROKSI — Digitalni Signal',
    podnaslov: 'Ekscentrični simulator koncentričnog hipsoneuričnog signala',
    ikona: '📡',
    redosled: 1,
    podaci: {
      opis: 'Proksi je mrežni sloj Digitalne Industrije. Ekscentrični simulator koncentričnog hipsoneuričnog signala prema plasiranim objektima sa WiFi antenama, gde se rezonance i amplitude međusobno uvezuju u ekliptičnu vez koja razvija snagu signala od 10²²⁸ TB.',
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'proksi-tekst',
    tip: 'tekst',
    naslov: 'Šta je Proksi?',
    redosled: 2,
    podaci: {
      sadrzaj: 'Proksi je mrežni i signal-processing sloj Digitalne Industrije Kompanije SPAJA. Koristi ekscentrični simulator koji generiše koncentrične hipsoneurične signale i usmerava ih prema WiFi objektima. Rezonance i amplitude signala se međusobno uvezuju u ekliptičnu (orbitalnu) vez, stvarajući samo-pojačavajuću mrežu ogromne propusnosti i snage.',
      istaknuteStavke: [
        'Ekscentrični simulator za generisanje signala',
        'Koncentrični hipsoneurični signal prema WiFi antenama',
        'Ekliptična vez — orbitalna komunikacija',
        'Rezonance i amplitude se auto-sinhronizuju',
        `Ukupni kapacitet: ${proksiMreza.ukupniKapacitet}`,
        `Topologija: ${proksiMreza.topologija}`,
      ],
    },
  },
  {
    id: 'proksi-statistika',
    tip: 'statistika',
    naslov: '📊 Proksi mreža u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Signali', vrednost: proksiSignali.length, ikona: '📡' },
        { naziv: 'Čvorovi', vrednost: proksiCvorovi.length, ikona: '🔗' },
        { naziv: 'Aktivni', vrednost: aktivnih, ikona: '✅' },
        { naziv: 'Platforme', vrednost: povezanihPlatformi, ikona: '🌐' },
      ],
    },
  },
  {
    id: 'proksi-kartice',
    tip: 'kartice',
    naslov: '📡 Tipovi signala',
    podnaslov: 'Signali u Proksi mreži',
    redosled: 4,
    podaci: {
      kartice: proksiSignali.map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.tip, s.frekvencija, s.status],
      })),
    },
  },
  {
    id: 'proksi-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija signala',
    redosled: 5,
    podaci: {
      zaglavlje: ['Signal', 'Tip', 'Frekvencija', 'Amplituda', 'Snaga', 'Status'],
      redovi: proksiSignali.map((s) => [
        s.naziv,
        s.tip,
        s.frekvencija,
        s.amplituda,
        s.snaga,
        s.status,
      ]),
    },
  },
  {
    id: 'proksi-lista',
    tip: 'lista',
    naslov: '🔗 Proksi čvorovi',
    redosled: 6,
    podaci: {
      stavke: proksiCvorovi.map((c) => ({
        ikona: c.ikona,
        naslov: c.naziv,
        opis: `${c.opis} — Kapacitet: ${c.kapacitet}, Latencija: ${c.latencija}, Platforme: ${c.povezanePlatforme.length}`,
      })),
    },
  },
  {
    id: 'proksi-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Proksi mreže',
    redosled: 7,
    podaci: {
      nivoi: [
        {
          naziv: 'Proksi Mreža',
          ikona: '📡',
          deca: ['Signali', 'Čvorovi'],
        },
        {
          naziv: 'Signali',
          ikona: '🌀',
          deca: proksiSignali.map((s) => s.naziv),
        },
        {
          naziv: 'Čvorovi',
          ikona: '🔗',
          deca: proksiCvorovi.map((c) => c.naziv),
        },
      ],
    },
  },
  {
    id: 'proksi-baner',
    tip: 'baner',
    naslov: 'Ekliptična vez — Orbitalna komunikacija',
    redosled: 8,
    podaci: {
      bedz: '📡 Proksi',
      opis: `Rezonance i amplitude se međusobno uvezuju u ekliptičnu vez sa ukupnom snagom od ${proksiMreza.ukupniKapacitet}. Hipsoneurični signal prema svim WiFi tačkama.`,
      dugme: { tekst: 'Istraži industriju', href: '/industrija' },
    },
  },
  {
    id: 'proksi-cta',
    tip: 'cta',
    naslov: '🚀 Proksi infrastruktura',
    redosled: 9,
    podaci: {
      opis: 'Proksi mreža Digitalne Industrije — ekscentrični simulator hipsoneuričnog signala.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
];
