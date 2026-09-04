// SpajaUltraOmegaCore -∞Ω+∞ — Agent Resilience API: Kill Switch
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/agent-resilience/kill
// Triggers the kill switch for an agent (admin-only).

import type { NextRequest } from 'next/server';
import { apiError, apiSuccess, apiInternalError } from '@/lib/api/response';
import { triggerKillSwitch, AGENT_RESILIENCE_CONTRACT_VERSION } from '@/lib/agent-resilience';
import type { KillSwitchReason } from '@/lib/agent-resilience';

export const dynamic = 'force-dynamic';

const VALID_REASONS: KillSwitchReason[] = [
  'CRITICAL_ERROR',
  'MANUAL',
  'SECURITY',
  'LOOP_DETECTED',
  'RESOURCE_EXHAUSTED',
];

/**
 * POST /api/agent-resilience/kill
 *
 * Body: { agentId: string; reason: KillSwitchReason; triggeredBy?: string; message?: string }
 * Triggers the kill switch for the given agent.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return apiError('BAD_REQUEST', 'Request body must be a JSON object', 400);
    }

    const { agentId, reason, triggeredBy = 'api-admin', message } = body as Record<string, unknown>;

    if (!agentId || typeof agentId !== 'string') {
      return apiError('BAD_REQUEST', 'agentId is required and must be a string', 400);
    }

    if (!reason || !VALID_REASONS.includes(reason as KillSwitchReason)) {
      return apiError(
        'BAD_REQUEST',
        `reason must be one of: ${VALID_REASONS.join(', ')}`,
        400,
      );
    }

    const record = triggerKillSwitch(
      agentId,
      reason as KillSwitchReason,
      String(triggeredBy),
      message ? String(message) : undefined,
    );

    const response = apiSuccess(
      {
        record,
        message: `Kill switch triggered for agent "${agentId}" (reason: ${reason})`,
      },
      200,
    );
    response.headers.set('X-AgentResilience-Contract-Version', AGENT_RESILIENCE_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('agent-resilience/kill', error);
  }
}
