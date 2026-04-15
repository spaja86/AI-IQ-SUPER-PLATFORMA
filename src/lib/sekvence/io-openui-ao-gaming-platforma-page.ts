import type { Sekvenca } from '@/lib/types';
import {
  ioOpenUIAOGamingPlatforma,
  endzinNadIgricama,
  gamingStatistika,
  gamingKonfiguracija,
  getAktivneIgriceSaEndzinom,
  gejmingKonstrukcija,
  IOOPENUIAO_URL,
  IOOPENUIAO_DOMEN,
} from '@/lib/io-openui-ao-gaming-platforma';

const aktivnih = getAktivneIgriceSaEndzinom().length;

export const ioOpenUIAOGamingSekvence: Sekvenca[] = [
  {
    id: 'gaming-platforma-hero',
    tip: 'hero',
    naslov: '🎮 IO/OPENUI/AO Gaming Platforma',
    podnaslov: 'SPAJA Univerzalni Endžin prevučen preko svih 95 igrica',
    ikona: '🎮',
    redosled: 1,
    podaci: {
      opis: `${ioOpenUIAOGamingPlatforma.opis} Link: ${ioOpenUIAOGamingPlatforma.link}`,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine', stil: 'sekundarno' },
        { tekst: 'Dimenzije', href: '/dimenzije', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'gaming-platforma-tekst',
    tip: 'tekst',
    naslov: 'Šta je IO/OPENUI/AO Gaming Platforma?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'IO/OPENUI/AO Gaming Platforma je sistem na kome su sve 95 igrica puštene u opticaj. ' +
        'SPAJA Univerzalni Endžin je prevučen preko svake igrice posebno, obezbeđujući dimenzionalno ' +
        'renderovanje (360D–5760D), SpajaPro 6-15 integraciju, OMEGA AI podršku i Proksi mrežnu optimizaciju. ' +
        `Platforma je dostupna na standardnom URL-u: ${IOOPENUIAO_URL}`,
      istaknuteStavke: [
        `${endzinNadIgricama.length} igrica sa SPAJA Univerzalnim Endžinom`,
        `${aktivnih} aktivnih igrica sa prevučenim endžinom`,
        `${gamingStatistika.ukupnoKategorija} kategorija igrica`,
        `Prosečna optimizacija: ${gamingStatistika.prosecnaOptimizacija}%`,
        `Standardni URL: ${IOOPENUIAO_URL}`,
        `Vercel fallback: https://${gamingKonfiguracija.vercelFallback}`,
        `Link: ${ioOpenUIAOGamingPlatforma.link}`,
      ],
    },
  },
  {
    id: 'gaming-platforma-statistika',
    tip: 'statistika',
    naslov: '📊 Gaming Platforma u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Igrice', vrednost: endzinNadIgricama.length, ikona: '🎮' },
        { naziv: 'Aktivne', vrednost: aktivnih, ikona: '✅' },
        { naziv: 'Kategorije', vrednost: gamingStatistika.ukupnoKategorija, ikona: '📂' },
        { naziv: 'Prevučeno', vrednost: gamingStatistika.prevucenoEndžinom, ikona: '🔧' },
        { naziv: 'Optimizacija', vrednost: `${gamingStatistika.prosecnaOptimizacija}%`, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'gaming-platforma-progres',
    tip: 'progres',
    naslov: '🚀 Prosečna optimizacija SPAJA Univerzalnog Endžina',
    redosled: 4,
    podaci: {
      progres: gamingStatistika.prosecnaOptimizacija,
      poruka: `SPAJA Univerzalni Endžin je prevučen preko svih ${endzinNadIgricama.length} igrica sa prosečnom optimizacijom od ${gamingStatistika.prosecnaOptimizacija}%.`,
    },
  },
  {
    id: 'gaming-platforma-kartice',
    tip: 'kartice',
    naslov: '🎮 Igrice sa SPAJA Univerzalnim Endžinom',
    podnaslov: `${endzinNadIgricama.length} igrica — endžin prevučen preko svake`,
    redosled: 5,
    podaci: {
      kartice: endzinNadIgricama.map((e) => ({
        naslov: `${e.igricaIkona} ${e.igricaNaziv}`,
        opis: `Endžin: ${e.endzinNaziv} (v${e.endzinVerzija}) — Optimizacija: ${e.optimizacija}%`,
        status: e.endzinStatus,
      })),
    },
  },
  {
    id: 'gaming-platforma-tabela-kategorije',
    tip: 'tabela',
    naslov: '📂 Igrice po kategorijama',
    podnaslov: `${gamingStatistika.ukupnoKategorija} kategorija`,
    redosled: 6,
    podaci: {
      kolone: ['Kategorija', 'Broj igrica'],
      redovi: Object.entries(gamingStatistika.poKategoriji).map(([kat, br]) => [kat, String(br)]),
    },
  },
  {
    id: 'gaming-platforma-tabela-url',
    tip: 'tabela',
    naslov: '🌐 Platforma Konfiguracija',
    podnaslov: `Standardni URL: ${IOOPENUIAO_URL}`,
    redosled: 7,
    podaci: {
      kolone: ['Parametar', 'Vrednost'],
      redovi: [
        ['Platforma ID', gamingKonfiguracija.platformaId],
        ['Naziv', gamingKonfiguracija.platformaNaziv],
        ['Standardni URL', gamingKonfiguracija.standardniUrl],
        ['Domen', gamingKonfiguracija.domen],
        ['Vercel Fallback', gamingKonfiguracija.vercelFallback],
        ['Protokol', gamingKonfiguracija.protokol],
        ['Status', gamingKonfiguracija.aktivan ? 'Aktivan' : 'Neaktivan'],
      ],
    },
  },
  {
    id: 'gaming-platforma-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Gaming Platforme',
    redosled: 8,
    podaci: {
      stavke: [
        {
          naziv: `IO/OPENUI/AO Gaming Platforma (${IOOPENUIAO_DOMEN})`,
          deca: [
            {
              naziv: 'SPAJA Univerzalni Endžin',
              deca: [
                { naziv: `${endzinNadIgricama.length} igrica prevučeno endžinom` },
                { naziv: `${gamingStatistika.ukupnoKategorija} kategorija` },
                { naziv: `Optimizacija: ${gamingStatistika.prosecnaOptimizacija}%` },
              ],
            },
            {
              naziv: 'Dimenzionalni Režimi',
              deca: [
                { naziv: '360D — Bazični režim' },
                { naziv: '720D — Napredni režim' },
                { naziv: '1440D — Profesionalni režim' },
                { naziv: '2880D — Ekspertski režim' },
                { naziv: '5760D — Ultimativni režim' },
              ],
            },
            {
              naziv: 'Integracije',
              deca: [
                { naziv: 'SpajaPro 6-15 Engine' },
                { naziv: 'OMEGA AI 40.000.562 persona' },
                { naziv: 'Proksi mrežna optimizacija' },
                { naziv: 'Digitalni Kompjuter + Digitalni Brauzer' },
                { naziv: 'SPAJA Generator za Endžine' },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'gaming-platforma-baner',
    tip: 'baner',
    naslov: `🌐 Platforma je na: ${IOOPENUIAO_URL}`,
    redosled: 9,
    podaci: {
      poruka: `IO/OPENUI/AO Gaming Platforma — ${endzinNadIgricama.length} igrica sa SPAJA Univerzalnim Endžinom. Standardni URL: ${IOOPENUIAO_URL}`,
      stil: 'info',
    },
  },
  {
    id: 'gaming-platforma-cta',
    tip: 'cta',
    naslov: 'Pokreni Gaming Platformu',
    redosled: 10,
    podaci: {
      tekst: `Pristupi IO/OPENUI/AO Gaming Platformi sa svih ${endzinNadIgricama.length} igrica na ${IOOPENUIAO_URL}`,
      dugmad: [
        { tekst: 'Igrice', href: '/igrice' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'gaming-platforma-konstrukcija',
    tip: 'tekst',
    naslov: '🏗️ Otavna Konstrukcija Gejminga — Ektodanari Kapacitet',
    redosled: 11,
    podaci: {
      sadrzaj: gejmingKonstrukcija.opis,
      istaknuteStavke: [
        gejmingKonstrukcija.ektodanariKapacitet.globalniKod,
        gejmingKonstrukcija.ektodanariKapacitet.referentnaEkskalacija,
        gejmingKonstrukcija.ektodanariKapacitet.matricnoJedinjenje,
        gejmingKonstrukcija.ektodanariKapacitet.sekvencionObim,
        gejmingKonstrukcija.ektodanariKapacitet.strukturniKod,
        gejmingKonstrukcija.ektodanariKapacitet.endžiniMatrica,
        gejmingKonstrukcija.ektodanariKapacitet.eportalskaVeza,
        gejmingKonstrukcija.ektodanariKapacitet.trevijananskaVrednost,
        gejmingKonstrukcija.ektodanariKapacitet.gejmPlod,
      ],
    },
  },
];
