import type { Sekvenca } from '@/lib/types';
import {
  generisaniEngini,
  generatorKonfiguracije,
  spajaGeneratorEngine,
  getAktivniEngini,
  getProsecnaOptimizacija,
  getEnginiUGenerisanju,
} from '@/lib/spaja-generator-engine';

const aktivnih = getAktivniEngini().length;
const prosecnaOpt = getProsecnaOptimizacija();
const uGenerisanju = getEnginiUGenerisanju().length;

export const spajaGeneratorEngineSekvence: Sekvenca[] = [
  {
    id: 'generator-engine-hero',
    tip: 'hero',
    naslov: '🔧 SPAJA Generator za Endžine',
    podnaslov: 'Engine Generator za AI IQ SUPER PLATFORMA',
    ikona: '🔧',
    redosled: 1,
    podaci: {
      opis: `${spajaGeneratorEngine.opis} Link: ${spajaGeneratorEngine.link}`,
      dugmad: [
        { tekst: 'SpajaPro', href: '/spaja-pro' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'generator-engine-tekst',
    tip: 'tekst',
    naslov: 'Šta je SPAJA Generator za Endžine?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'SPAJA Generator za Endžine je centralni sistem koji generiše, primenjuje i optimizuje sve engine-e ' +
        'u repozitorijumu AI-IQ-SUPER-PLATFORMA. Kao fabrika engine-a, generator prevlači endžine preko ' +
        'celog ekosistema — od SpajaPro Prompt engine-a i OMEGA AI dispatch-a do Proksi signal engine-a, ' +
        'Gaming engine-a i Finansijskih engine-a. Svaki modul u repozitorijumu dobija svoj optimizovani engine.',
      istaknuteStavke: [
        'Generiše engine-e za sve module u repozitorijumu',
        'Prevlači engine-e preko celog AI-IQ-SUPER-PLATFORMA ekosistema',
        `${generisaniEngini.length} generisanih engine-a u sistemu`,
        `${aktivnih} aktivnih engine-a sa prosečnom optimizacijom ${prosecnaOpt}%`,
        `${generatorKonfiguracije.length} konfiguracija za različite module`,
        `Link generatora: ${spajaGeneratorEngine.link}`,
      ],
    },
  },
  {
    id: 'generator-engine-statistika',
    tip: 'statistika',
    naslov: '📊 Generator u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Engine-i', vrednost: generisaniEngini.length, ikona: '🔧' },
        { naziv: 'Aktivni', vrednost: aktivnih, ikona: '✅' },
        { naziv: 'U generisanju', vrednost: uGenerisanju, ikona: '⏳' },
        { naziv: 'Optimizacija', vrednost: `${prosecnaOpt}%`, ikona: '📈' },
        { naziv: 'Konfiguracije', vrednost: generatorKonfiguracije.length, ikona: '⚙️' },
        { naziv: 'Pokrivenost', vrednost: '100%', ikona: '🎯' },
      ],
    },
  },
  {
    id: 'generator-engine-progres',
    tip: 'progres',
    naslov: '🚀 Prosečna optimizacija engine-a',
    redosled: 4,
    podaci: {
      progres: prosecnaOpt,
      poruka: `SPAJA Generator je optimizovao ${aktivnih} engine-a sa prosečnom optimizacijom od ${prosecnaOpt}%. Svi moduli u repozitorijumu su pokriveni.`,
    },
  },
  {
    id: 'generator-engine-kartice',
    tip: 'kartice',
    naslov: '🔧 Generisani Engine-i',
    podnaslov: `${generisaniEngini.length} engine-a generisanih za ceo ekosistem`,
    redosled: 5,
    podaci: {
      kartice: generisaniEngini.map((e) => ({
        naslov: e.naziv,
        opis: e.opis,
        ikona: e.ikona,
        progres: e.optimizacija,
        oznake: [e.tip, e.status, `v${e.verzija}`, `${e.optimizacija}%`],
      })),
    },
  },
  {
    id: 'generator-engine-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija engine-a',
    redosled: 6,
    podaci: {
      zaglavlje: ['Engine', 'Tip', 'Verzija', 'Status', 'Ciljni Modul', 'Optimizacija'],
      redovi: generisaniEngini.map((e) => [
        e.naziv,
        e.tip,
        `v${e.verzija}`,
        e.status,
        e.ciljniModul,
        `${e.optimizacija}%`,
      ]),
    },
  },
  {
    id: 'generator-engine-konfiguracije',
    tip: 'lista',
    naslov: '⚙️ Generator Konfiguracije',
    podnaslov: 'Konfiguracije za generisanje engine-a po modulima',
    redosled: 7,
    podaci: {
      stavke: generatorKonfiguracije.map((k) => ({
        ikona: k.ikona,
        naslov: k.naziv,
        opis: `${k.opis} — Repo: ${k.ciljniRepozitorijum} | Parametri: ${k.parametri.join(', ')} | ${k.aktivna ? '✅ Aktivna' : '⏸️ Neaktivna'}`,
      })),
    },
  },
  {
    id: 'generator-engine-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura SPAJA Generatora',
    redosled: 8,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Generator za Endžine',
          ikona: '🔧',
          deca: ['Core Engine-i', 'AI Engine-i', 'Mrežni Engine-i', 'Ostali Engine-i'],
        },
        {
          naziv: 'Core Engine-i',
          ikona: '🧩',
          deca: generisaniEngini.filter((e) => e.tip === 'core').map((e) => e.naziv),
        },
        {
          naziv: 'AI Engine-i',
          ikona: '🧠',
          deca: generisaniEngini.filter((e) => e.tip === 'ai').map((e) => e.naziv),
        },
        {
          naziv: 'Mrežni Engine-i',
          ikona: '📡',
          deca: generisaniEngini.filter((e) => e.tip === 'mreza').map((e) => e.naziv),
        },
        {
          naziv: 'Ostali Engine-i',
          ikona: '⚡',
          deca: generisaniEngini.filter((e) => !['core', 'ai', 'mreza'].includes(e.tip)).map((e) => e.naziv),
        },
      ],
    },
  },
  {
    id: 'generator-engine-baner',
    tip: 'baner',
    naslov: 'SPAJA Generator — Engine za sve Engine-e',
    redosled: 9,
    podaci: {
      bedz: '🔧 Generator',
      opis: `SPAJA Generator za Endžine prevlači ${generisaniEngini.length} engine-a preko celog repozitorijuma AI-IQ-SUPER-PLATFORMA. Prosečna optimizacija: ${prosecnaOpt}%. ${aktivnih} aktivnih engine-a pokrivaju 100% ekosistema.`,
      dugme: { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
    },
  },
  {
    id: 'generator-engine-cta',
    tip: 'cta',
    naslov: '🚀 Engine Generator infrastruktura',
    redosled: 10,
    podaci: {
      opis: `SPAJA Generator za Endžine — ${generisaniEngini.length} engine-a, ${generatorKonfiguracije.length} konfiguracija, ${prosecnaOpt}% prosečna optimizacija. Celokupan AI-IQ-SUPER-PLATFORMA repozitorijum pokriven.`,
      dugmad: [
        { tekst: 'SpajaPro', href: '/spaja-pro' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
];
