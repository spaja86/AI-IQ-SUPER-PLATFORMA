import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';
import { generisaniEngini, getRepoEngini, getProsecnaOptimizacija } from '@/lib/spaja-generator-engine';
import { OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';

const stats = getStatistike();
const repoEngini = getRepoEngini();
const kraljevstvoEcosystemRegistry = [
  ['AI-IQ-SUPER-PLATFORMA', 'Centralni orchestration i governance hub', 'runtime-integrated', 'EXTREM / EXTRONDOL / SPAJA KOD', 'Human review + audit trail'],
  ['IO-OPENUI-AO', 'Primarni downstream product surface', 'summary-synced', 'AI-IQ-SUPER-PLATFORMA → IO-OPENUI-AO', 'Summary sync only'],
  ['AI IQ WORLD BANK', 'Finansijski i governance okvir', 'policy-linked', 'Governance + payout posture', 'Compliance + payment verification'],
  ['AI IQ MENJAČNICA', 'Tržišni i novčani operativni sloj', 'policy-linked', 'Treasury + wallet posture', 'Approval + blocker summary'],
  ['KOMPANIJA SPAJA', 'Enterprise umbrella', 'policy-linked', 'Ownership + rollout posture', 'Review + downstream reference'],
  ['SVETSKA ORGANIZACIJA', 'Globalni institucionalni okvir', 'policy-linked', 'Ethics + institutional summary', 'Audit-safe only'],
  ['OPENAI', 'Eksterni AI/provider boundary', 'external-provider', 'Provider dependency summary', 'Compliance boundary'],
  ['SPAJANIKOPENEVOLUTION', 'Narativni/evolucioni track', 'narrative-only', 'Documentation + reflection', 'No runtime coupling'],
] as const;

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
        { naslov: 'AI Platforma', opis: 'OMEGA AI agenti i servisi', ikona: '🧠', oznake: [`${OMEGA_AI_PERSONA_COUNT} persona`, 'Auto-repair', 'Learning'] },
        { naslov: 'Generator Endžina', opis: `SPAJA Generator — ${generisaniEngini.length} engine-a, ${repoEngini.length} repo`, ikona: '🔧', oznake: ['Engine Generator', `${getProsecnaOptimizacija()}% optimizacija`] },
      ],
    },
  },
  {
    id: 'ekosistem-kraljevstvo-registar',
    tip: 'tabela',
    naslov: '👑 KRALJEVSTVO — Ecosystem registry',
    redosled: 4,
    podaci: {
      zaglavlje: ['Domen', 'Uloga', 'Veza', 'Komunikacija', 'Promocija / blokator'],
      redovi: kraljevstvoEcosystemRegistry.map((stavka) => [...stavka]),
    },
  },
  {
    id: 'ekosistem-governance-lock',
    tip: 'lista',
    naslov: '🛡️ Governance lock',
    redosled: 5,
    podaci: {
      stavke: [
        {
          naslov: 'Scope lock',
          opis: 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA ostaje početni scope bez novih paralelnih runtime sistema.',
          ikona: '🔒',
        },
        {
          naslov: 'Ownership split',
          opis: 'EXTREM ostaje tehnički signal, EXTRONDOL governance/WAWE/audit, a SPAJA KOD javni audit-safe summary boundary.',
          ikona: '🧭',
        },
        {
          naslov: 'Summary-safe exchange',
          opis: 'Između domena se razmenjuju samo readiness, governance posture, approval status, blocker reason i downstream reference.',
          ikona: '📦',
        },
        {
          naslov: 'Promotion gates',
          opis: 'Human review, rollout/rollback disciplina, audit trail i downstream reference ostaju obavezni pre cross-repo promocije.',
          ikona: '✅',
        },
      ],
    },
  },
  {
    id: 'ekosistem-statistika',
    tip: 'statistika',
    naslov: 'Status implementacije',
    redosled: 6,
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
    redosled: 7,
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
