// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience API: Recover
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/agent-resilience/recover
// Clears the kill switch and/or resets the circuit breaker (admin-only).

import type { NextRequest } from 'next/server';
import { apiError, apiSuccess, apiInternalError } from '@/lib/api/response';
import {
  attemptRecovery,
  DEFAULT_RESILIENCE_CONFIG,
  AGENT_RESILIENCE_CONTRACT_VERSION,
} from '@/lib/agent-resilience';

export const dynamic = 'force-dynamic';

/**
 * POST /api/agent-resilience/recover
 *
 * Body: { agentId: string; initiatedBy?: string }
 * Attempts recovery: clears kill switch (if auto-clearable) and resets circuit to HALF-OPEN.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return apiError('BAD_REQUEST', 'Request body must be a JSON object', 400);
    }

    const { agentId, initiatedBy = 'api-admin' } = body as Record<string, unknown>;

    if (!agentId || typeof agentId !== 'string') {
      return apiError('BAD_REQUEST', 'agentId is required and must be a string', 400);
    }

    const result = attemptRecovery(agentId, DEFAULT_RESILIENCE_CONFIG, String(initiatedBy));

    const response = apiSuccess(result, result.success ? 200 : 422);
    response.headers.set('X-AgentResilience-Contract-Version', AGENT_RESILIENCE_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('agent-resilience/recover', error);
  }
}
