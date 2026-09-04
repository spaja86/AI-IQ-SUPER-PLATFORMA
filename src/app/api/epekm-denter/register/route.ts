// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D API: POST /api/epekm-denter/register
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { registerEmailIdentity, EPEKM_CONTRACT_VERSION } from '@/lib/epekm-denter';
import type { EpekmRegistrationInput } from '@/lib/epekm-denter';

export const dynamic = 'force-dynamic';

/**
 * POST /api/epekm-denter/register
 *
 * Registers a new permanent email identity.
 * Idempotent: returns existing identity if alias is already registered.
 *
 * Body: EpekmRegistrationInput
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('BAD_REQUEST', 'Invalid JSON body');
  }

  const input = body as Partial<EpekmRegistrationInput>;

  if (!input.alias || typeof input.alias !== 'string' || input.alias.trim() === '') {
    return apiError('BAD_REQUEST', 'alias is required and must be a non-empty string');
  }
  if (!input.agentRef || typeof input.agentRef !== 'string' || input.agentRef.trim() === '') {
    return apiError('BAD_REQUEST', 'agentRef is required and must be a non-empty string');
  }
  if (typeof input.octave !== 'number' || !Number.isFinite(input.octave) || input.octave < 0) {
    return apiError('BAD_REQUEST', 'octave must be a non-negative finite number');
  }
  if (typeof input.nodeId !== 'number' || !Number.isFinite(input.nodeId) || input.nodeId < 0) {
    return apiError('BAD_REQUEST', 'nodeId must be a non-negative finite number');
  }

  try {
    const result = registerEmailIdentity({
      alias: input.alias,
      agentRef: input.agentRef,
      octave: input.octave,
      nodeId: input.nodeId,
    });
    const response = apiSuccess(result, 201);
    response.headers.set('X-Epekm-Contract-Version', EPEKM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('epekm-denter/register', error);
  }
}
