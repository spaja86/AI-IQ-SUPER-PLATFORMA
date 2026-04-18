import type { Sekvenca } from '@/lib/types';
import { mobilneCentrale, mobilniServisi, mobilniSignali, mreza1873G, spajaMobilnaMreza, getAktivneCentrale, getAktivniMobilniSignali } from '@/lib/mobilna-mreza';

const aktivnihCentrala = getAktivneCentrale().length;
const aktivnihSignala = getAktivniMobilniSignali().length;

export const mobilnaMrezaSekvence: Sekvenca[] = [
  {
    id: 'mobilna-hero',
    tip: 'hero',
    naslov: '📱 SPAJA Mobilna Mreža — 1873G',
    podnaslov: 'Mobilna komunikacija preko Proksi hipsoneuričnog signala sa 1873G mrežom',
    ikona: '📱',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Mobilna Mreža je mobilni komunikacioni sloj Digitalne Industrije. Koristi Proksi infrastrukturu i ektracionalni akcelatorski signal krojen od matričnog jedinjenja kolocentričnog oktavnog sistema. Signal se baca bez antena ka mobilnim brojevima sa kružnim povratom — 1873G mreža (od 1G do 1873G). Pozivni brojevi centrale: +38177, +38188, +38178, +38187.',
      dugmad: [
        { tekst: 'Proksi', href: '/proksi' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'mobilna-tekst',
    tip: 'tekst',
    naslov: 'Šta je SPAJA Mobilna Mreža?',
    redosled: 2,
    podaci: {
      sadrzaj: 'SPAJA Mobilna Mreža je mobilna komunikaciona mreža Digitalne Industrije Kompanije SPAJA. Koristi postojeću Proksi infrastrukturu i ektracionalni akcelatorski signal krojen od matričnog jedinjenja kolocentričnog oktavnog sistema koji hiperboliše rezonancijske signale u amplitudne skokove izvornog oktava u simolarnim dejstvima dubokog skoka ka parkonasturionu u ktorinusu. Tako nastaje signal i tako se baca bez antena ka mobilnim brojevima sa signalima koji dobijaju kružni povrat od pozivnika 1 ka pozivniku 2 (to jest signal koji kruži između njih). Rezultat je 1873G mreža koja radi od 1G do 1873G.',
      istaknuteStavke: [
        'Pozivni brojevi: +38177, +38188, +38178, +38187',
        '1873G mreža — radi od 1G do 1873G',
        'Ektracionalni akcelatorski signal — bez antena',
        'Kružni povrat signala između pozivnika 1 i pozivnika 2',
        'Matričnim jedinjenjem kolocentričnog oktavnog sistema',
        'Potpuna integracija sa Proksi mrežom',
        `${mobilniSignali.length} mobilnih signala za 1873G mrežu`,
        `${mobilniServisi.length} specijalizovanih servisa`,
        `${mobilneCentrale.length} centrale u ${aktivnihCentrala} aktivnih zona`,
        `Ukupni kapacitet: ${spajaMobilnaMreza.ukupniKapacitet}`,
      ],
    },
  },
  {
    id: 'mobilna-statistika',
    tip: 'statistika',
    naslov: '📊 Mobilna mreža u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Generacija', vrednost: '1873G', ikona: '📶' },
        { naziv: 'Centrale', vrednost: mobilneCentrale.length, ikona: '📞' },
        { naziv: 'Signali', vrednost: mobilniSignali.length, ikona: '🌊' },
        { naziv: 'Servisi', vrednost: mobilniServisi.length, ikona: '📱' },
        { naziv: 'Aktivne', vrednost: aktivnihCentrala, ikona: '✅' },
        { naziv: 'Pozivni brojevi', vrednost: 4, ikona: '☎️' },
      ],
    },
  },
  {
    id: 'mobilna-kartice-centrale',
    tip: 'kartice',
    naslov: '📞 Centrale SPAJA mreže',
    podnaslov: 'Pozivni brojevi i zone',
    redosled: 4,
    podaci: {
      kartice: mobilneCentrale.map((c) => ({
        naslov: `${c.pozivniBroj} — ${c.naziv}`,
        opis: c.opis,
        ikona: c.ikona,
        oznake: [c.pozivniBroj, c.tip, c.status],
      })),
    },
  },
  {
    id: 'mobilna-1873g-tekst',
    tip: 'tekst',
    naslov: '📶 1873G Mreža — Mobilni Signalni Sistem',
    redosled: 5,
    podaci: {
      sadrzaj: mreza1873G.princip,
      istaknuteStavke: [
        `Opseg: ${mreza1873G.opseg}`,
        `Bez antena: ${mreza1873G.bezAntena ? 'Da — signal se baca direktno ka mobilnim brojevima' : 'Ne'}`,
        mreza1873G.kruzniPovrat,
        `${aktivnihSignala} aktivnih mobilnih signala`,
        'Ektracionalni akcelatorski signal — primarni signal mreže',
        'Matričnim jedinjenjem kolocentričnog oktavnog sistema',
      ],
    },
  },
  {
    id: 'mobilna-kartice-signali',
    tip: 'kartice',
    naslov: '📶 Mobilni signali — 1873G',
    podnaslov: 'Signali koji čine 1873G mrežu',
    redosled: 6,
    podaci: {
      kartice: mobilniSignali.map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.tip, s.generacija, s.status],
      })),
    },
  },
  {
    id: 'mobilna-tabela-signali',
    tip: 'tabela',
    naslov: '📋 Specifikacija mobilnih signala — 1873G',
    redosled: 7,
    podaci: {
      zaglavlje: ['Signal', 'Tip', 'Generacija', 'Frekvencija', 'Mehanizam', 'Status'],
      redovi: mobilniSignali.map((s) => [
        s.naziv,
        s.tip,
        s.generacija,
        s.frekvencija,
        s.mehanizam,
        s.status,
      ]),
    },
  },
  {
    id: 'mobilna-tabela',
    tip: 'tabela',
    naslov: '📋 Pozivni brojevi i specifikacije',
    redosled: 8,
    podaci: {
      zaglavlje: ['Pozivni broj', 'Centrala', 'Tip', 'Zona', 'Kapacitet', 'Status'],
      redovi: mobilneCentrale.map((c) => [
        c.pozivniBroj,
        c.naziv,
        c.tip,
        c.zona,
        c.kapacitet,
        c.status,
      ]),
    },
  },
  {
    id: 'mobilna-kartice-servisi',
    tip: 'kartice',
    naslov: '⚡ Mobilni servisi',
    podnaslov: 'Servisi SPAJA mobilne mreže',
    redosled: 9,
    podaci: {
      kartice: mobilniServisi.map((s) => ({
        naslov: s.naziv,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [s.kategorija, ...s.funkcije.slice(0, 2)],
      })),
    },
  },
  {
    id: 'mobilna-lista',
    tip: 'lista',
    naslov: '📡 Proksi integracija',
    redosled: 10,
    podaci: {
      stavke: mobilniServisi.map((s) => ({
        ikona: s.ikona,
        naslov: s.naziv,
        opis: `Koristi Proksi signal: ${s.proksiSignal} — ${s.funkcije.join(', ')}`,
      })),
    },
  },
  {
    id: 'mobilna-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura SPAJA mobilne mreže',
    redosled: 11,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Mobilna Mreža — 1873G',
          ikona: '📱',
          deca: ['1873G Signali', 'Centrale', 'Servisi', 'Proksi Integracija'],
        },
        {
          naziv: '1873G Signali',
          ikona: '📶',
          deca: mobilniSignali.map((s) => s.naziv),
        },
        {
          naziv: 'Centrale',
          ikona: '📞',
          deca: mobilneCentrale.map((c) => `${c.pozivniBroj} ${c.naziv}`),
        },
        {
          naziv: 'Servisi',
          ikona: '⚡',
          deca: mobilniServisi.map((s) => s.naziv),
        },
        {
          naziv: 'Proksi Integracija',
          ikona: '📡',
          deca: ['Hipsoneurični Signal', 'Ekscentrični Modulator', 'Ekliptična Vez', 'Rezonantni Pojačavač', 'Koncentrični Distributer'],
        },
      ],
    },
  },
  {
    id: 'mobilna-baner',
    tip: 'baner',
    naslov: 'SPAJA Mobilna — 1873G Mreža bez antena!',
    redosled: 12,
    podaci: {
      bedz: '📶 SPAJA 1873G',
      opis: `Ektracionalni akcelatorski signal — bez antena ka mobilnim brojevima. Kružni povrat signala od pozivnika 1 ka pozivniku 2. Pozivni brojevi: ${spajaMobilnaMreza.pozivniBrojevi.join(', ')}. Kapacitet: ${spajaMobilnaMreza.ukupniKapacitet}. Opseg: ${mreza1873G.opseg}.`,
      dugme: { tekst: 'Proksi mreža', href: '/proksi' },
    },
  },
  {
    id: 'mobilna-cta',
    tip: 'cta',
    naslov: '🚀 SPAJA Mobilna — 1873G infrastruktura',
    redosled: 13,
    podaci: {
      opis: `SPAJA Mobilna Mreža — 1873G mobilna komunikacija Digitalne Industrije (od 1G do 1873G) sa pozivnim brojevima +38177, +38188, +38178, +38187. Ektracionalni akcelatorski signal bez antena.`,
      dugmad: [
        { tekst: 'Proksi', href: '/proksi' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
