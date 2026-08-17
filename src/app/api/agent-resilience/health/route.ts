// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience API: Health
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/agent-resilience/health
// Returns health reports for all registered agents.

import { apiSuccess, apiInternalError } from '@/lib/api/response';
import { getAllHealthReports, AGENT_RESILIENCE_CONTRACT_VERSION } from '@/lib/agent-resilience';

export const dynamic = 'force-dynamic';

/**
 * GET /api/agent-resilience/health
 *
 * Returns aggregated health report for all registered agents.
 */
export async function GET() {
  try {
    const reports = getAllHealthReports();

    const summary = {
      total: reports.length,
      healthy: reports.filter((r) => r.status === 'HEALTHY').length,
      degraded: reports.filter((r) => r.status === 'DEGRADED').length,
      tripped: reports.filter((r) => r.status === 'TRIPPED').length,
      killed: reports.filter((r) => r.status === 'KILLED').length,
    };

    const response = apiSuccess(
      {
        summary,
        agents: reports,
        generatedAt: new Date().toISOString(),
      },
      200,
    );
    response.headers.set('X-AgentResilience-Contract-Version', AGENT_RESILIENCE_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('agent-resilience/health', error);
  }
}
