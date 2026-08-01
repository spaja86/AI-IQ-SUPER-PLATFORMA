import { APP_VERSION } from '@/lib/constants';

export const MEKARTOR_VERSION = '1.0.0';

export interface MekartorKpi {
  naziv: string;
  cilj: string;
  alert: string;
  owner: string;
}

export interface MekartorEnvRequirement {
  kljuc: string;
  required: boolean;
  owner: string;
  opis: string;
}

export const mekartorKpis: MekartorKpi[] = [
  { naziv: 'Catalog sync latency p95', cilj: '≤ 250ms', alert: '> 1s', owner: 'Platform Ops' },
  { naziv: 'Health endpoint SLA', cilj: '≥ 99.95%', alert: '< 99%', owner: 'Operations' },
  { naziv: 'Build duration', cilj: '≤ 3 min', alert: '> 10 min', owner: 'CI / Platform Ops' },
  { naziv: 'Error rate', cilj: '< 0.2%', alert: '> 1%', owner: 'Release Ops' },
  { naziv: 'Manual deploy recovery', cilj: '≤ 15 min', alert: '> 30 min', owner: 'Deploy Bot' },
];

export const mekartorEnvRequirements: MekartorEnvRequirement[] = [
  {
    kljuc: 'VERCEL_DEPLOY_HOOK_MEKARTOR',
    required: false,
    owner: 'GitHub Secrets / Vercel',
    opis: 'Opcioni Vercel deploy hook za ručni fallback deploy Mekartor surface-a.',
  },
  {
    kljuc: 'MEKARTOR_STATUS_WEBHOOK_URL',
    required: false,
    owner: 'GitHub Secrets',
    opis: 'Opcioni webhook za eksterni signal statusa posle staged rollout-a.',
  },
  {
    kljuc: 'MEKARTOR_UPSTREAM_URL',
    required: false,
    owner: 'Vercel Environment Variables',
    opis: 'Opciona upstream URL referenca za buduće katalog feed-ove i integracije.',
  },
];

export function getMekartorSnapshot() {
  return {
    id: 'mekartor',
    naziv: 'Mekartor',
    verzija: MEKARTOR_VERSION,
    platformaVerzija: APP_VERSION,
    owner: '@spaja86',
    runtime: 'Next.js 16',
    scope: {
      runtimeSurface: ['/mekartor', '/api/mekartor'],
      repoSurface: ['platforms/mekartor/', 'src/app/mekartor/', 'src/app/api/mekartor/'],
      targetEnvironments: ['dev', 'staging', 'production'],
    },
    deployment: {
      strategy: 'Vercel Git Integration + deploy-platforma fallback hook',
      manualTriggerEnabled: true,
      productionUrl: 'https://ai-iq-super-platforma.vercel.app/mekartor',
      healthEndpoint: 'https://ai-iq-super-platforma.vercel.app/api/mekartor',
      stagedRollout: ['10% canary', '50% staging', '100% production'],
      rollback: [
        'Pause staged rollout and disable Mekartor feature track labels',
        'Revert to previous Vercel deployment from dashboard history',
        'Trigger fallback deploy hook only after health endpoint returns healthy again',
      ],
    },
    observability: {
      first24hChecks: [
        'Health endpoint status',
        'Deploy Platforma health probe',
        'Error-rate and audit summary review',
      ],
      auditTrail: 'No linked repo change required',
    },
    crossRepo: {
      linkedRepo: 'spaja86/IO-OPENUI-AO',
      downstreamDependency: false,
      note: 'Mekartor is repo-local in this rollout and does not require a linked IO-OPENUI-AO change.',
    },
    externalServices: [
      'Vercel Git Integration',
      'GitHub Actions deploy-platforma workflow',
      'Optional external status webhook via secrets only',
    ],
    envRequirements: mekartorEnvRequirements,
    kpis: mekartorKpis,
  };
}
