// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience API: Per-Agent Status
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/agent-resilience/status/[agentId]
// Returns full health report for a single agent.

import type { NextRequest } from 'next/server';
import { apiSuccess, apiInternalError } from '@/lib/api/response';
import { runDiagnostic, AGENT_RESILIENCE_CONTRACT_VERSION } from '@/lib/agent-resilience';

export const dynamic = 'force-dynamic';

/**
 * GET /api/agent-resilience/status/[agentId]
 *
 * Returns the full AgentHealthReport for the given agentId.
 * If the agent has not yet been registered in the store, returns a default HEALTHY report.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { agentId: string } },
) {
  try {
    const { agentId } = params;
    const report = runDiagnostic(agentId);

    const response = apiSuccess(report, 200);
    response.headers.set('X-AgentResilience-Contract-Version', AGENT_RESILIENCE_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('agent-resilience/status', error);
  }
}
