import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';
import { generisaniEngini, getRepoEngini, getProsecnaOptimizacija } from '@/lib/spaja-generator-engine';

const stats = getStatistike();
const repoEngini = getRepoEngini();

export const ekosistemSekvence: Sekvenca[] = [
  {
    id: 'ekosistem-hero',
    tip: 'hero',
    naslov: '🔗 SPAJA Ekosistem Hub',
    podnaslov: 'Iz IO OPENUI AO',
    ikona: '🔗',
    redosled: 1,
    podaci: { opis: 'Centralni hub koji povezuje sve platforme, servise i AI agente u jedinstven ekosistem.' },
  },
  {
    id: 'ekosistem-tekst',
    tip: 'tekst',
    naslov: 'Sta je SPAJA Ekosistem Hub?',
    redosled: 2,
    podaci: {
      sadrzaj: 'SPAJA Ekosistem Hub je centralizovana tacka integracije za sve module Kompanije SPAJA. Povezuje Banku, Menjacnicu, Kompaniju i AI platforme u jedinstvenu celinu.',
      istaknuteStavke: [
        'Unified API za sve module',
        'Real-time komunikacija izmedju servisa',
        'Centralizovano upravljanje identitetom',
        'Automatska sinhronizacija podataka',
      ],
    },
  },
  {
    id: 'ekosistem-kartice',
    tip: 'kartice',
    naslov: '🧩 Moduli ekosistema',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'Banka', opis: 'Digitalna banka sa globalnim dometom', ikona: '🏦', oznake: ['Racuni', 'Transferi', 'Krediti'] },
        { naslov: 'Menjacnica', opis: 'Kripto i fiat menjacnica', ikona: '💱', oznake: ['Trading', 'Portfolio', 'AI predikcije'] },
        { naslov: 'Kompanija', opis: 'Upravljanje poslovanjem', ikona: '🏢', oznake: ['HR', 'Finansije', 'Projekti'] },
        { naslov: 'AI Platforma', opis: 'OMEGA AI agenti i servisi', ikona: '🧠', oznake: ['21 persona', 'Auto-repair', 'Learning'] },
        { naslov: 'Generator Endžina', opis: `SPAJA Generator — ${generisaniEngini.length} engine-a, ${repoEngini.length} repo`, ikona: '🔧', oznake: ['Engine Generator', `${getProsecnaOptimizacija()}% optimizacija`] },
      ],
    },
  },
  {
    id: 'ekosistem-statistika',
    tip: 'statistika',
    naslov: 'Status implementacije',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'Igrice', vrednost: stats.ukupnoIgrica, ikona: '🎮' },
        { naziv: 'OMEGA AI', vrednost: stats.ukupnoOmegaPersona, ikona: '🧠' },
        { naziv: 'Kompanije', vrednost: stats.ukupnoKompanija, ikona: '🏛️' },
        { naziv: 'Organizacije', vrednost: stats.ukupnoOrganizacija, ikona: '🏢' },
        { naziv: 'Rute', vrednost: stats.ukupnoRuta, ikona: '🗺️' },
        { naziv: 'Engine-i', vrednost: stats.generatorEngina, ikona: '🔧' },
        { naziv: 'Repo Engine-i', vrednost: stats.generatorRepoEngina, ikona: '📦' },
        { naziv: 'Progres', vrednost: `${stats.ukupniProgres}%`, ikona: '📈' },
      ],
    },
  },
  {
    id: 'ekosistem-cta',
    tip: 'cta',
    naslov: '🚀 Pridruzi se ekosistemu',
    redosled: 5,
    podaci: {
      opis: 'SPAJA Ekosistem Hub raste svakim danom. SPAJA Generator za Endžine prevlači engine-e preko svih modula.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine', stil: 'sekundarno' },
      ],
    },
  },
];
