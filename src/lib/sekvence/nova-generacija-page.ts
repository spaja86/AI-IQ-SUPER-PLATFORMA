import type { Sekvenca } from '@/lib/types';
import { APP_VERSION, NOVA_GENERACIJA_TOTAL_CVOROVA, NOVA_GENERACIJA_VERZIJA, OMEGA_AI_OKTAVA_COUNT, OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';
import { getNgEvolucijaDijagnostika, getNgEvolucijaIzveštaj, getNgIndustrijskaKonvergencija } from '@/lib/evolucija/nova-generacija';
import { getSpajaPro16Pregled } from '@/lib/spaja-pro-nova-generacija';
import { ngGamingMetadata } from '@/lib/nova-generacija-gaming';

export function getNovaGeneracijaSekvence(): Sekvenca[] {
  const evolucija = getNgEvolucijaIzveštaj();
  const dijagnostika = getNgEvolucijaDijagnostika();
  const hipermreza = getSpajaPro16Pregled();
  const konvergencija = getNgIndustrijskaKonvergencija();

  return [
    {
      id: 'nova-generacija-hero',
      tip: 'hero',
      naslov: '🌌 Nova Generacija — AI-IQ SUPER PLATFORMA v100',
      podnaslov: 'SpajaPro 16 Hipermreza • 16×16 • 256 čvorova • 50 persona • 16 oktava • Self-Healing • Cross-Platform Sync',
      ikona: '🌌',
      redosled: 1,
      podaci: {
        opis: `Platforma v${APP_VERSION} • NG v${NOVA_GENERACIJA_VERZIJA} • Zdravlje: ${dijagnostika.zdravlje}% • ${OMEGA_AI_PERSONA_COUNT} persona u ${OMEGA_AI_OKTAVA_COUNT} oktava`,
        dugmad: [
          { tekst: 'API: Nova Generacija', href: '/api/nova-generacija' },
          { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
          { tekst: 'Omega Evolucija', href: '/omega-evolution', stil: 'sekundarno' },
        ],
      },
      stil: 'gradijent',
    },
    {
      id: 'nova-generacija-kpis',
      tip: 'statistika',
      naslov: '📊 Nova Generacija KPIs',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'OMEGA AI Persone', vrednost: OMEGA_AI_PERSONA_COUNT, ikona: '🧠' },
          { naziv: 'Oktave', vrednost: OMEGA_AI_OKTAVA_COUNT, ikona: '🎵' },
          { naziv: 'Hipermreza čvorovi', vrednost: NOVA_GENERACIJA_TOTAL_CVOROVA, ikona: '🌐' },
          { naziv: 'Platforma verzija', vrednost: `v${APP_VERSION}`, ikona: '🚀' },
          { naziv: 'NG verzija', vrednost: NOVA_GENERACIJA_VERZIJA, ikona: '🌌' },
          { naziv: 'Uptime SLA', vrednost: '99.99%', ikona: '⏰' },
          { naziv: 'Max latency p99', vrednost: '≤ 50ms', ikona: '⚡' },
          { naziv: 'Gaming completion', vrednost: '≥ 95%', ikona: '🎮' },
        ],
      },
    },
    {
      id: 'nova-generacija-hipermreza',
      tip: 'kartice',
      naslov: '🌐 SpajaPro 16 Hipermreza Engine',
      redosled: 3,
      podaci: {
        kartice: [
          {
            naslov: `SpajaPro ${hipermreza.verzija} — ${hipermreza.kodnoIme}`,
            opis: `${NOVA_GENERACIJA_TOTAL_CVOROVA} čvorova u 16×16 mreži • ${hipermreza.maxTokena.toLocaleString()} max tokena • ${hipermreza.ukupnoKlastera} klastera`,
            ikona: '🌌',
            oznake: [
              'Self-Healing',
              'Cross-Platform Sync',
              'Kvantni Dispatch',
              'Paralelni Dispatch',
              `${OMEGA_AI_PERSONA_COUNT} persona`,
              `${OMEGA_AI_OKTAVA_COUNT} oktava`,
            ],
          },
          {
            naslov: 'Hipermreza Statistika',
            opis: `Aktivnih čvorova: ${hipermreza.statistika.aktivnihCvorova} • Cross-platform sync ops: ${hipermreza.statistika.crossPlatformSyncOps} • Self-healing: ${hipermreza.statistika.selfHealingAktivacija}`,
            ikona: '📡',
            oznake: [
              `${hipermreza.statistika.ukupnoCvorova} ukupno čvorova`,
              `${hipermreza.statistika.ukupnoSinaptickihVeza} sinaptičkih veza`,
              `Klaster utilizacija: ${hipermreza.statistika.klasterUtilizacija.toFixed(1)}%`,
            ],
          },
        ],
      },
    },
    {
      id: 'nova-generacija-evolucija',
      tip: 'tabela',
      naslov: '🧬 Nova Generacija Evolution Engine',
      redosled: 4,
      podaci: {
        zaglavlje: ['Parametar', 'Vrednost'],
        redovi: [
          ['Status', dijagnostika.status],
          ['Zdravlje', `${dijagnostika.zdravlje}%`],
          ['Algoritam', 'QGA-v1 (Quantum Genetic Algorithm)'],
          ['Aktivna generacija', String(evolucija.ukupnoGeneracija)],
          ['Uspesnih generacija', String(evolucija.uspesnihGeneracija)],
          ['Prosečna fitness', String(evolucija.prosecnaFitness)],
          ['Ciljna fitness', String(evolucija.ciljnaFitness)],
          ['Self-healing aktivacija', String(evolucija.selfHealingAktivacija)],
          ['Cross-repo sync ops', String(evolucija.crossRepoSyncOps)],
          ['Cross-platform sync', dijagnostika.crossPlatformSyncStatus],
          ['Industrijska konvergencija', dijagnostika.industrijskaKonvergencijaStatus],
        ],
      },
    },
    {
      id: 'nova-generacija-gaming',
      tip: 'kartice',
      naslov: '🎮 Nova Generacija Gaming',
      redosled: 5,
      podaci: {
        kartice: [
          {
            naslov: ngGamingMetadata.naziv,
            opis: `Naslednik: ${ngGamingMetadata.naslednik} • Liga: ${ngGamingMetadata.ligaNaziv} • Sezona: ${ngGamingMetadata.sezonaNaziv}`,
            ikona: '🎮',
            oznake: [
              `2–${ngGamingMetadata.fairnessPravila.maxIgraca} igrača`,
              `≤ ${ngGamingMetadata.fairnessPravila.maxLatencyKompenzacijaMs}ms latency`,
              `≤ ${ngGamingMetadata.fairnessPravila.maxServerEvaluacijaMs}ms evaluacija`,
              'Kvantni Fairness',
              'Anti-Cheat Hash',
              'Cross-Repo Audit',
            ],
          },
          {
            naslov: 'Gaming Modovi',
            opis: `${ngGamingMetadata.modovi.length} gaming moda dostupna • Cross-repo linked: ${ngGamingMetadata.crossRepoLinked}`,
            ikona: '🕹️',
            oznake: ngGamingMetadata.modovi,
          },
        ],
      },
    },
    {
      id: 'nova-generacija-konvergencija',
      tip: 'tabela',
      naslov: '🏭 Industrijska Konvergencija',
      redosled: 6,
      podaci: {
        zaglavlje: ['Platforma', 'Industrija', 'Status', 'Fitness', 'Linked Repos'],
        redovi: konvergencija.map((k) => [
          k.platforma,
          k.industrija,
          k.status,
          `${k.fitness}%`,
          k.linkedRepos.join(', '),
        ]),
      },
    },
    {
      id: 'nova-generacija-roadmap',
      tip: 'lista',
      naslov: '🗺️ Nova Generacija Roadmap',
      redosled: 7,
      podaci: {
        stavke: [
          '✅ Faza 1 — Temelj: APP_VERSION v100.0.0, SpajaPro 16 range, 50 persona, 16 oktava, feature flags',
          '✅ Faza 2 — AI Arhitektura: Hipermreza 16×16, Nova Generacija Evolution Engine, /api/nova-generacija',
          '✅ Faza 3 — Industrija: platforms/nova-generacija, Nova Generacija Gaming, SpajaMreza 2.0',
          '✅ Faza 4 — Automatizacija: nova-generacija-agent, CI workflow, .agent-config.json, MULTI-REPO-LINKS v2',
          '✅ Faza 5 — UX: /nova-generacija page, SpajaPro 16 plan, ROADMAP.md update',
          '✅ Faza 6 — Bezbednost: SECURITY.md Nova Generacija threat model, enterprise-sla.ts',
          '📋 Sledeće: Staged rollout 20% → 50% → 100% po exit criteria',
        ],
      },
    },
  ];
}
