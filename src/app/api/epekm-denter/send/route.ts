// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D API: POST /api/epekm-denter/send
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { sendEmailMessage, EPEKM_CONTRACT_VERSION } from '@/lib/epekm-denter';
import type { EpekmSendInput, EpekmPayloadType } from '@/lib/epekm-denter';

export const dynamic = 'force-dynamic';

const VALID_PAYLOAD_TYPES: EpekmPayloadType[] = ['plain-text', 'json', 'agent-handoff'];

/**
 * POST /api/epekm-denter/send
 *
 * Sends a message via the EPEKM-D email engine.
 * Idempotent via optional messageId field.
 *
 * Body: EpekmSendInput
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError('BAD_REQUEST', 'Invalid JSON body');
  }

  const input = body as Partial<EpekmSendInput>;

  if (!input.fromAlias || typeof input.fromAlias !== 'string' || input.fromAlias.trim() === '') {
    return apiError('BAD_REQUEST', 'fromAlias is required and must be a non-empty string');
  }
  if (!input.toAlias || typeof input.toAlias !== 'string' || input.toAlias.trim() === '') {
    return apiError('BAD_REQUEST', 'toAlias is required and must be a non-empty string');
  }
  if (!input.payload || typeof input.payload !== 'string' || input.payload.trim() === '') {
    return apiError('BAD_REQUEST', 'payload is required and must be a non-empty string');
  }
  if (!input.payloadType || !VALID_PAYLOAD_TYPES.includes(input.payloadType)) {
    return apiError(
      'BAD_REQUEST',
      `payloadType must be one of: ${VALID_PAYLOAD_TYPES.join(', ')}`,
    );
  }

  try {
    const result = sendEmailMessage({
      fromAlias: input.fromAlias,
      toAlias: input.toAlias,
      payloadType: input.payloadType,
      payload: input.payload,
      messageId: typeof input.messageId === 'string' ? input.messageId : undefined,
    });
    const response = apiSuccess(result, 200);
    response.headers.set('X-Epekm-Contract-Version', EPEKM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('epekm-denter/send', error);
  }
}
