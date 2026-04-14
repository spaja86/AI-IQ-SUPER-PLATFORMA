import type { Sekvenca } from '@/lib/types';
import {
  brouvzerEntiteti,
  brouvzerModuli,
  spajaDigitalniBrouvzer,
  getAktivniEntiteti,
  getAktivniModuli,
  getBrouvzerStatistika,
  ekstremniMotori,
  ekstremniBackend,
  providniFrontendKomponente,
} from '@/lib/spaja-digitalni-brouvzer';

const statistika = getBrouvzerStatistika();
const aktivniEntiteti = getAktivniEntiteti().length;
const aktivniModuli = getAktivniModuli().length;

export const spajaDigitalniBrouvzerSekvence: Sekvenca[] = [
  {
    id: 'brouvzer-hero',
    tip: 'hero',
    naslov: '🌐 SPAJA Digitalni Brouvzer — EKSTREMNI',
    podnaslov: 'EKSTREMNI DIGITALNI BROUZER sa sopstvenim motorom, bekendom i providnim frontendom',
    ikona: '🌐',
    redosled: 1,
    podaci: {
      opis: `${spajaDigitalniBrouvzer.opis} Brouvzer Link: ${spajaDigitalniBrouvzer.link} | Generator Link: ${spajaDigitalniBrouvzer.generatorLink} | BAZA Link: ${spajaDigitalniBrouvzer.bazaLink}`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'IO/OPENUI/AO Gaming', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'brouvzer-tekst',
    tip: 'tekst',
    naslov: 'Šta je EKSTREMNI DIGITALNI BROUZER?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'EKSTREMNI DIGITALNI BROUZER nastaje prevlačenjem "SPAJA Generator za Endžine" preko "SPAJA Digitalnog Brouvzera". ' +
        'Rezultat je brouzer koji može SAMOSTALNO DA RADI, ima SOPSTVENI MOTOR, SOPSTVENI BEKEND i PROVIDNI FRONTEND. ' +
        'Može da se ubacuje u druge brouzere jer ima svoj motor. Služi za prenos podataka, deploy, import, export. ' +
        'Integrisana SPAJA BAZA sa prevučenim Generator Endžinom. Ide ispod "Digitalna Industrija" i prati sve sajtove.',
      istaknuteStavke: [
        'EKSTREMNI — samostalan rad, može se ubaciti u druge brouzere',
        `${ekstremniMotori.length} sopstvenih motora (rendering, JS, network, storage, deploy, transfer)`,
        `${ekstremniBackend.length} backend servisa (API, SPAJA BAZA, auth, deploy, transfer, cache)`,
        `${providniFrontendKomponente.length} providnih frontend komponenti (UI, overlay, embeddable, standalone, responsive)`,
        `${brouvzerEntiteti.length} entiteta + ${brouvzerModuli.length} modula industrije`,
        'SPAJA BAZA integracija sa prevučenim Generator Endžinom',
        'Deploy igrica i svega na IO/OPENUI/AO',
        'Protok podataka svuda — deploy, import, export',
      ],
    },
  },
  {
    id: 'brouvzer-statistika',
    tip: 'statistika',
    naslov: '📊 EKSTREMNI Brouvzer u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Entiteti', vrednost: brouvzerEntiteti.length, ikona: '🏢' },
        { naziv: 'Aktivni entiteti', vrednost: aktivniEntiteti, ikona: '✅' },
        { naziv: 'Moduli', vrednost: brouvzerModuli.length, ikona: '🧩' },
        { naziv: 'Aktivni moduli', vrednost: aktivniModuli, ikona: '⚡' },
        { naziv: 'Motori', vrednost: ekstremniMotori.length, ikona: '🔧' },
        { naziv: 'Backend servisi', vrednost: ekstremniBackend.length, ikona: '🖧' },
        { naziv: 'Frontend komp.', vrednost: providniFrontendKomponente.length, ikona: '🪟' },
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
      poruka: `EKSTREMNI Brouvzer pokriva ${statistika.pokrivenostIndustrije}% industrije sa ${aktivniEntiteti} aktivnih entiteta, ${aktivniModuli} modula, ${ekstremniMotori.length} motora, ${ekstremniBackend.length} backend servisa i ${providniFrontendKomponente.length} frontend komponenti.`,
    },
  },
  {
    id: 'brouvzer-kartice-motori',
    tip: 'kartice',
    naslov: '🔧 Sopstveni Motori',
    podnaslov: `${ekstremniMotori.length} sopstvenih motora EKSTREMNOG Brouvzera`,
    redosled: 5,
    podaci: {
      kartice: ekstremniMotori.map((m) => ({
        naslov: m.naziv,
        opis: m.opis,
        ikona: m.ikona,
        oznake: [m.tip, m.status, `v${m.verzija}`],
      })),
    },
  },
  {
    id: 'brouvzer-kartice-backend',
    tip: 'kartice',
    naslov: '🖧 Sopstveni Backend',
    podnaslov: `${ekstremniBackend.length} backend servisa EKSTREMNOG Brouvzera`,
    redosled: 6,
    podaci: {
      kartice: ekstremniBackend.map((b) => ({
        naslov: b.naziv,
        opis: b.opis,
        ikona: b.ikona,
        oznake: [b.tip, b.status],
      })),
    },
  },
  {
    id: 'brouvzer-kartice-frontend',
    tip: 'kartice',
    naslov: '🪟 Providni (Transparentni) Frontend',
    podnaslov: `${providniFrontendKomponente.length} providnih frontend komponenti`,
    redosled: 7,
    podaci: {
      kartice: providniFrontendKomponente.map((f) => ({
        naslov: f.naziv,
        opis: f.opis,
        ikona: f.ikona,
        oznake: [f.tip, f.status],
      })),
    },
  },
  {
    id: 'brouvzer-kartice-entiteti',
    tip: 'kartice',
    naslov: '🏢 Entiteti na Brouvzeru',
    podnaslov: `${brouvzerEntiteti.length} entiteta plasiranih na EKSTREMNOM Brouvzeru`,
    redosled: 8,
    podaci: {
      kartice: brouvzerEntiteti.map((e) => ({
        naslov: e.naziv,
        opis: e.opis,
        ikona: e.ikona,
        eksterniLink: e.url,
        oznake: [e.tip, e.status, e.kategorija],
      })),
    },
  },
  {
    id: 'brouvzer-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija entiteta',
    redosled: 9,
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
    podnaslov: `${brouvzerModuli.length} modula za funkcionisanje EKSTREMNOG Brouvzera`,
    redosled: 10,
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
    id: 'brouvzer-lista-mogucnosti',
    tip: 'lista',
    naslov: '🌟 Mogućnosti EKSTREMNOG Brouvzera',
    podnaslov: 'Sve mogućnosti koje pruža EKSTREMNI DIGITALNI BROUZER',
    redosled: 11,
    podaci: {
      stavke: spajaDigitalniBrouvzer.mogucnosti.map((m, i) => ({
        ikona: ['🚀', '🧩', '🔧', '🖧', '🪟', '🔄', '📦', '💾', '📡', '🔁', '🎮', '🌐', '⚡', '📱', '🛡️', '🔧', '💻', '📨'][i % 18],
        naslov: m,
        opis: m,
      })),
    },
  },
  {
    id: 'brouvzer-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura EKSTREMNOG Brouvzera',
    redosled: 12,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Digitalni Brouvzer — EKSTREMNI',
          ikona: '🌐',
          deca: ['Sopstveni Motori', 'Sopstveni Backend', 'Providni Frontend', 'Entiteti Industrije', 'Moduli Brouvzera', 'SPAJA BAZA', 'SPAJA Generator za Endžine'],
        },
        {
          naziv: 'Sopstveni Motori',
          ikona: '🔧',
          deca: ekstremniMotori.map((m) => `${m.ikona} ${m.naziv}`),
        },
        {
          naziv: 'Sopstveni Backend',
          ikona: '🖧',
          deca: ekstremniBackend.map((b) => `${b.ikona} ${b.naziv}`),
        },
        {
          naziv: 'Providni Frontend',
          ikona: '🪟',
          deca: providniFrontendKomponente.map((f) => `${f.ikona} ${f.naziv}`),
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
    naslov: 'EKSTREMNI DIGITALNI BROUZER — Industrija na dlanu',
    redosled: 13,
    podaci: {
      bedz: '🌐 EKSTREMNI',
      opis: `EKSTREMNI DIGITALNI BROUZER: ${brouvzerEntiteti.length} entiteta, ${brouvzerModuli.length} modula, ${ekstremniMotori.length} motora, ${ekstremniBackend.length} backend servisa, ${providniFrontendKomponente.length} frontend komponenti. Pokrivenost: ${statistika.pokrivenostIndustrije}%. Samostalan rad, deploy, import, export.`,
      dugme: { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
    },
  },
  {
    id: 'brouvzer-cta',
    tip: 'cta',
    naslov: '🚀 EKSTREMNI Brouvzer infrastruktura',
    redosled: 14,
    podaci: {
      opis: `EKSTREMNI DIGITALNI BROUZER — ${brouvzerEntiteti.length} entiteta, ${brouvzerModuli.length} modula, ${ekstremniMotori.length} motora, ${ekstremniBackend.length} backend servisa, ${providniFrontendKomponente.length} providnih frontend komponenti. Samostalan rad, ubaciv u druge brouzere, deploy, import, export. Celokupna Digitalna Industrija.`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
        { tekst: 'IO/OPENUI/AO Gaming', href: '/io-openui-ao-gaming-platforma', stil: 'sekundarno' },
        { tekst: 'SPAJA BAZA', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
];
