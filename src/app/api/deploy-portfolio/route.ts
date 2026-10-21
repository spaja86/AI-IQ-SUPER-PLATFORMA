/**
 * GET /api/deploy-portfolio
 *
 * Portfolio pregled svih registrovanih platformi sa deployment metapodacima,
 * KPI snapshot-om i infrastrukturnim statusom.
 *
 * Javni endpoint — ne sadrži tajne ključeve ni deploy hook URL-ove.
 */

import { NextResponse } from 'next/server';
import { deployRegistry } from '@/lib/deploy/deploy-registry';
import { kpiSnapshot } from '@/lib/deploy/deploy-portfolio-data';
import { APP_VERSION } from '@/lib/constants';
import deployEvidence from '../../../../public/deploy_status.json';

export const dynamic = 'force-dynamic';

/** CI/CD workflow status snapshot */
const workflowStatus = [
  {
    workflow: 'omega-auto-build.yml',
    opis: 'Quality gate: TypeScript, ESLint, unit testovi, smoke testovi, predeploy check',
    trigger: 'push/PR na main i copilot/**',
    status: 'active',
  },
  {
    workflow: 'security-scanner.yml',
    opis: 'CodeQL SAST, dependency review, npm audit, secret heuristics',
    trigger: 'svaki PR, nightly schedule, manual dispatch',
    status: 'active',
  },
  {
    workflow: 'nova-generacija.yml',
    opis: 'Nova Generacija CI: KPI gate ≤50ms evaluacija, ≤3 min build',
    trigger: 'nova-generacija label i putanje',
    status: 'active',
  },
  {
    workflow: 'vercel-deploy.yml',
    opis: 'Manualni fallback trigger za Vercel deploy hook',
    trigger: 'manual, zahteva confirmToken za production',
    status: 'active',
  },
  {
    workflow: 'deploy-platforma.yml',
    opis: 'Deploy Platforma hub i Mekartor rollout putanje sa quality gate-ovima i audit logom',
    trigger: 'push na deploy-platforma/mekartor putanje + manual dispatch',
    status: 'active',
  },
];

/** Registrovani agenti i njihov deployment-relevantan status */
const agentStatus = [
  { agent: 'ci-bot', status: 'active', workflow: 'omega-auto-build.yml', scope: 'All repos' },
  { agent: 'security-scanner', status: 'active', workflow: 'security-scanner.yml', scope: 'All repos' },
  { agent: 'nova-generacija-agent', status: 'active', workflow: 'nova-generacija.yml', scope: 'All repos' },
  { agent: 'deploy-bot', status: 'planned', workflow: 'vercel-deploy.yml', scope: 'All repos' },
  { agent: 'multi-repo-sync-agent', status: 'ready', workflow: 'push/weekly', scope: 'SUPER-PLATFORMA ↔ IO-OPENUI-AO' },
  { agent: 'human-review', status: 'active', workflow: 'manual', scope: 'All repos' },
];

export async function GET() {
  const platforme = deployRegistry.map((p) => ({
    platform_name: p.naziv,
    platform_id: p.id,
    ikona: p.ikona,
    opis: p.opis,
    version: APP_VERSION,
    runtime: p.framework,
    status: p.status,
    manual_trigger_enabled: p.manualTriggerEnabled,
    health_url: p.healthUrl,
    production_url: p.produktionUrl,
    path: p.id === 'ai-iq-super-platforma' ? 'src/ → Vercel' : `platforms/${p.id}/`,
    deploy_hook_configured: p.deployHookEnvVar !== null,
  }));

  const aktivne = deployRegistry.filter((p) => p.status === 'aktivan').length;
  const uPripremi = deployRegistry.filter((p) => p.status === 'u_pripremi').length;
  const triggable = deployRegistry.filter((p) => p.manualTriggerEnabled).length;
  const saHealthCheck = deployRegistry.filter((p) => p.healthUrl !== null).length;

  return NextResponse.json(
    {
      status: 'ok',
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
      portfolio: {
        ukupno_platformi: platforme.length,
        aktivne,
        u_pripremi: uPripremi,
        triggable,
        sa_health_check: saHealthCheck,
        platforme,
      },
      kpi_snapshot: kpiSnapshot,
      ci_cd: {
        workflows: workflowStatus,
        agenti: agentStatus,
      },
      // Compatibility URL: historical snapshot, never a current success signal.
      deploy_status_artifact: '/deploy_status.json',
      deployment_evidence: deployEvidence,
      docs: {
        portfolio: '/docs/DEPLOY-PORTFOLIO.md',
        go_live: '/docs/GO-LIVE.md',
        deployment_power: '/docs/DEPLOYMENT-POWER-RESOLUTION.md',
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-App-Version': APP_VERSION,
      },
    },
  );
}
