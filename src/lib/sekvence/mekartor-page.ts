import type { Sekvenca } from '@/lib/types';
import { getMekartorSnapshot } from '@/lib/mekartor';

export function getMekartorSekvence(): Sekvenca[] {
  const snapshot = getMekartorSnapshot();

  return [
    {
      id: 'mekartor-hero',
      tip: 'hero',
      naslov: '🧭 Mekartor — Deploy-ready platform surface',
      podnaslov: `v${snapshot.verzija} · ${snapshot.runtime} · staged rollout 10% → 50% → 100%`,
      ikona: '🧭',
      redosled: 1,
      podaci: {
        opis: 'Mekartor je novi repo-local deployable surface za upravljanje katalog-ready rolloutom, health signalima i audit-ready promocijom kroz postojeći governance model.',
        dugmad: [
          { tekst: 'API: Mekartor status', href: '/api/mekartor' },
          { tekst: 'Deploy portfolio', href: '/deploy-platforma', stil: 'sekundarno' },
          { tekst: 'Deploy health probe', href: '/api/deploy-platforma/health/mekartor', stil: 'sekundarno' },
        ],
      },
      stil: 'gradijent',
    },
    {
      id: 'mekartor-scope',
      tip: 'statistika',
      naslov: '📦 Deployment scope',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Runtime', vrednost: snapshot.runtime, ikona: '⚙️' },
          { naziv: 'Environments', vrednost: snapshot.scope.targetEnvironments.length, ikona: '🌍' },
          { naziv: 'Runtime surfaces', vrednost: snapshot.scope.runtimeSurface.length, ikona: '🧩' },
          { naziv: 'Downstream deps', vrednost: snapshot.crossRepo.downstreamDependency ? 'Yes' : 'No', ikona: '🔗' },
        ],
      },
    },
    {
      id: 'mekartor-governance',
      tip: 'tabela',
      naslov: '🛡️ Governance contract',
      redosled: 3,
      podaci: {
        zaglavlje: ['Field', 'Value'],
        redovi: [
          ['Owner', snapshot.owner],
          ['Runtime surface', snapshot.scope.runtimeSurface.join(', ')],
          ['Repo surface', snapshot.scope.repoSurface.join(', ')],
          ['Manual trigger', snapshot.deployment.manualTriggerEnabled ? 'Enabled' : 'Disabled'],
          ['Health endpoint', snapshot.deployment.healthEndpoint],
          ['Production URL', snapshot.deployment.productionUrl],
          ['Cross-repo impact', snapshot.crossRepo.note],
        ],
      },
    },
    {
      id: 'mekartor-kpis',
      tip: 'tabela',
      naslov: '📊 Success KPIs',
      redosled: 4,
      podaci: {
        zaglavlje: ['KPI', 'Target', 'Alert', 'Owner'],
        redovi: snapshot.kpis.map((kpi) => [kpi.naziv, kpi.cilj, kpi.alert, kpi.owner]),
      },
    },
    {
      id: 'mekartor-ops',
      tip: 'lista',
      naslov: '🚀 Rollout and observability',
      redosled: 5,
      podaci: {
        stavke: [
          {
            naslov: 'Staged rollout',
            opis: snapshot.deployment.stagedRollout.join(' → '),
            ikona: '🚦',
          },
          {
            naslov: 'First 24h monitoring',
            opis: snapshot.observability.first24hChecks.join(', '),
            ikona: '👁️',
          },
          {
            naslov: 'Rollback contract',
            opis: snapshot.deployment.rollback.join(' • '),
            ikona: '↩️',
          },
          {
            naslov: 'Secret boundary',
            opis: 'Deploy hooks, webhook URLs i sve buduće upstream kredencijale čuvati samo u GitHub/Vercel secret sloju.',
            ikona: '🔐',
          },
        ],
      },
    },
  ];
}
