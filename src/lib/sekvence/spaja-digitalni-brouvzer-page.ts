import type { Sekvenca } from '@/lib/types';
import {
  brouvzerEntiteti,
  brouvzerModuli,
  spajaDigitalniBrouvzer,
  getAktivniEntiteti,
  getAktivniModuli,
  getBrouvzerStatistika,
} from '@/lib/spaja-digitalni-brouvzer';

const statistika = getBrouvzerStatistika();
const aktivniEntiteti = getAktivniEntiteti().length;
const aktivniModuli = getAktivniModuli().length;

export const spajaDigitalniBrouvzerSekvence: Sekvenca[] = [
  {
    id: 'brouvzer-hero',
    tip: 'hero',
    naslov: '🌐 SPAJA Digitalni Brouvzer',
    podnaslov: 'Digitalna Brauzer Platforma za celokupnu SPAJA Industriju',
    ikona: '🌐',
    redosled: 1,
    podaci: {
      opis: `${spajaDigitalniBrouvzer.opis} Link: ${spajaDigitalniBrouvzer.link}`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'Render Medija', href: '/spaja-render-medija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'brouvzer-tekst',
    tip: 'tekst',
    naslov: 'Šta je SPAJA Digitalni Brouvzer?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'SPAJA Digitalni Brouvzer je digitalna brauzer platforma na koju se postavlja celokupna SPAJA ' +
        'industrija — platforme, organizacije, korporacije, kompanije, prodavnice i sve ostalo. Pokretan ' +
        'od strane SPAJA Generatora za Endžine, brouvzer omogućava svim entitetima iz digitalne industrije ' +
        'da budu prisutni i dostupni korisnicima.',
      istaknuteStavke: [
        'Celokupna industrija na jednom brouvzeru',
        `${brouvzerEntiteti.length} entiteta plasiranih na brouvzeru`,
        `${brouvzerModuli.length} modula za rad brouvzera`,
        `${aktivniEntiteti} aktivnih entiteta, ${aktivniModuli} aktivnih modula`,
        'Pokretan od strane SPAJA Generator za Endžine',
        `Link: ${spajaDigitalniBrouvzer.link}`,
      ],
    },
  },
  {
    id: 'brouvzer-statistika',
    tip: 'statistika',
    naslov: '📊 Brouvzer u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Entiteti', vrednost: brouvzerEntiteti.length, ikona: '🏢' },
        { naziv: 'Aktivni entiteti', vrednost: aktivniEntiteti, ikona: '✅' },
        { naziv: 'Moduli', vrednost: brouvzerModuli.length, ikona: '🧩' },
        { naziv: 'Aktivni moduli', vrednost: aktivniModuli, ikona: '⚡' },
        { naziv: 'Pokrivenost', vrednost: `${statistika.pokrivenostIndustrije}%`, ikona: '🎯' },
      ],
    },
  },
  {
    id: 'brouvzer-progres',
    tip: 'progres',
    naslov: '🚀 Pokrivenost industrije',
    redosled: 4,
    podaci: {
      progres: statistika.pokrivenostIndustrije,
      poruka: `SPAJA Digitalni Brouvzer pokriva ${statistika.pokrivenostIndustrije}% industrije sa ${aktivniEntiteti} aktivnih entiteta i ${aktivniModuli} aktivnih modula.`,
    },
  },
  {
    id: 'brouvzer-kartice-entiteti',
    tip: 'kartice',
    naslov: '🏢 Entiteti na Brouvzeru',
    podnaslov: `${brouvzerEntiteti.length} entiteta plasiranih na digitalnom brouvzeru`,
    redosled: 5,
    podaci: {
      kartice: brouvzerEntiteti.map((e) => ({
        naslov: e.naziv,
        opis: e.opis,
        ikona: e.ikona,
        oznake: [e.tip, e.status, e.kategorija],
      })),
    },
  },
  {
    id: 'brouvzer-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija entiteta',
    redosled: 6,
    podaci: {
      zaglavlje: ['Entitet', 'Tip', 'Status', 'Kategorija', 'URL'],
      redovi: brouvzerEntiteti.map((e) => [
        e.naziv,
        e.tip,
        e.status,
        e.kategorija,
        e.url,
      ]),
    },
  },
  {
    id: 'brouvzer-kartice-moduli',
    tip: 'kartice',
    naslov: '🧩 Moduli Brouvzera',
    podnaslov: `${brouvzerModuli.length} modula za funkcionisanje brouvzera`,
    redosled: 7,
    podaci: {
      kartice: brouvzerModuli.map((m) => ({
        naslov: m.naziv,
        opis: m.opis,
        ikona: m.ikona,
        oznake: [m.status, `v${m.verzija}`],
      })),
    },
  },
  {
    id: 'brouvzer-lista-moduli',
    tip: 'lista',
    naslov: '⚙️ Mogućnosti modula',
    podnaslov: 'Detaljan pregled mogućnosti svakog modula',
    redosled: 8,
    podaci: {
      stavke: brouvzerModuli.map((m) => ({
        ikona: m.ikona,
        naslov: m.naziv,
        opis: `${m.opis} — Mogućnosti: ${m.mogucnosti.join(', ')} | Status: ${m.status} | v${m.verzija}`,
      })),
    },
  },
  {
    id: 'brouvzer-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Digitalnog Brouvzera',
    redosled: 9,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Digitalni Brouvzer',
          ikona: '🌐',
          deca: ['Entiteti Industrije', 'Moduli Brouvzera', 'SPAJA Generator za Endžine'],
        },
        {
          naziv: 'Entiteti Industrije',
          ikona: '🏢',
          deca: brouvzerEntiteti.map((e) => `${e.ikona} ${e.naziv}`),
        },
        {
          naziv: 'Moduli Brouvzera',
          ikona: '🧩',
          deca: brouvzerModuli.map((m) => `${m.ikona} ${m.naziv}`),
        },
      ],
    },
  },
  {
    id: 'brouvzer-baner',
    tip: 'baner',
    naslov: 'SPAJA Digitalni Brouvzer — Industrija na dlanu',
    redosled: 10,
    podaci: {
      bedz: '🌐 Brouvzer',
      opis: `SPAJA Digitalni Brouvzer plasira ${brouvzerEntiteti.length} entiteta industrije sa ${brouvzerModuli.length} modula. Pokrivenost: ${statistika.pokrivenostIndustrije}%. Pokretan od SPAJA Generatora za Endžine.`,
      dugme: { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
    },
  },
  {
    id: 'brouvzer-cta',
    tip: 'cta',
    naslov: '🚀 Digitalni Brouvzer infrastruktura',
    redosled: 11,
    podaci: {
      opis: `SPAJA Digitalni Brouvzer — ${brouvzerEntiteti.length} entiteta, ${brouvzerModuli.length} modula, ${statistika.pokrivenostIndustrije}% pokrivenost industrije. Celokupna digitalna industrija na jednoj brauzer platformi.`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Render', href: '/spaja-render-medija', stil: 'sekundarno' },
      ],
    },
  },
];
