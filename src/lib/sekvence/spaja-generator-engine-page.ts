import type { Sekvenca } from '@/lib/types';
import {
  generisaniEngini,
  generatorKonfiguracije,
  spajaGeneratorEngine,
  getAktivniEngini,
  getProsecnaOptimizacija,
  getEnginiUGenerisanju,
  getRepoEngini,
  getRepoKonfiguracije,
} from '@/lib/spaja-generator-engine';

const aktivnih = getAktivniEngini().length;
const prosecnaOpt = getProsecnaOptimizacija();
const uGenerisanju = getEnginiUGenerisanju().length;
const repoEngini = getRepoEngini();
const repoKonfig = getRepoKonfiguracije();

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
        { naziv: 'Repo Engine-i', vrednost: repoEngini.length, ikona: '📦' },
        { naziv: 'Repo Konfiguracije', vrednost: repoKonfig.length, ikona: '🔗' },
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
    id: 'generator-engine-repo-kartice',
    tip: 'kartice',
    naslov: '📦 Repo Engine-i — Endžini za sve repozitorijume',
    podnaslov: `${repoEngini.length} repo engine-a za ${repoKonfig.length} repozitorijuma u ekosistemu`,
    redosled: 8,
    podaci: {
      kartice: repoEngini.map((e) => ({
        naslov: e.naziv,
        opis: e.opis,
        ikona: e.ikona,
        progres: e.optimizacija,
        oznake: ['repo-engine', e.status, `v${e.verzija}`, `${e.optimizacija}%`, e.ciljniModul.split('/').pop() ?? e.ciljniModul],
      })),
    },
  },
  {
    id: 'generator-engine-repo-tabela',
    tip: 'tabela',
    naslov: '📋 Repozitorijumi sa endžinima',
    podnaslov: 'Svaki repozitorijum ima svoj SPAJA Generator endžin',
    redosled: 9,
    podaci: {
      zaglavlje: ['Repozitorijum', 'Engine', 'Status', 'Verzija', 'Optimizacija'],
      redovi: repoEngini.map((e) => [
        e.ciljniModul,
        e.naziv,
        e.status,
        `v${e.verzija}`,
        `${e.optimizacija}%`,
      ]),
    },
  },
  {
    id: 'generator-engine-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura SPAJA Generatora',
    redosled: 10,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Generator za Endžine',
          ikona: '🔧',
          deca: ['Core Engine-i', 'AI Engine-i', 'Mrežni Engine-i', 'Repo Engine-i', 'Ostali Engine-i'],
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
          naziv: 'Repo Engine-i',
          ikona: '📦',
          deca: generisaniEngini.filter((e) => e.tip === 'repo-engine').map((e) => e.naziv),
        },
        {
          naziv: 'Ostali Engine-i',
          ikona: '⚡',
          deca: generisaniEngini.filter((e) => !['core', 'ai', 'mreza', 'repo-engine'].includes(e.tip)).map((e) => e.naziv),
        },
      ],
    },
  },
  {
    id: 'generator-engine-baner',
    tip: 'baner',
    naslov: 'SPAJA Generator — Engine za sve Engine-e',
    redosled: 11,
    podaci: {
      bedz: '🔧 Generator',
      opis: `SPAJA Generator za Endžine prevlači ${generisaniEngini.length} engine-a (od kojih ${repoEngini.length} repo engine-a) preko celog repozitorijuma AI-IQ-SUPER-PLATFORMA i svih ${repoKonfig.length} eksternih repozitorijuma. Prosečna optimizacija: ${prosecnaOpt}%. ${aktivnih} aktivnih engine-a pokrivaju 100% ekosistema.`,
      dugme: { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
    },
  },
  {
    id: 'generator-engine-cta',
    tip: 'cta',
    naslov: '🚀 Engine Generator infrastruktura',
    redosled: 12,
    podaci: {
      opis: `SPAJA Generator za Endžine — ${generisaniEngini.length} engine-a (${repoEngini.length} repo engine-a), ${generatorKonfiguracije.length} konfiguracija, ${prosecnaOpt}% prosečna optimizacija. Celokupan AI-IQ-SUPER-PLATFORMA repozitorijum i svih ${repoKonfig.length} eksternih repozitorijuma pokriveno.`,
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
