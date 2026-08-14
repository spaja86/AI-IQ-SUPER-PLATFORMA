// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI API: /api/zlatni-racuni/points
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { applyPoints, setZlatniHeaders } from '@/lib/zlatni-racuni';
import type { ZlatniPointsInput } from '@/lib/zlatni-racuni';

export const dynamic = 'force-dynamic';

const VALID_TYPES = new Set(['credit', 'debit', 'bonus', 'penalty']);
const VALID_SOURCES = new Set(['gigatron', 'discount-telecom', 'madagaskar', 'extrimli', 'manual', 'system']);

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const { racunId, type, amount, source, idempotencyKey, metadata } = body as Record<string, unknown>;

    if (typeof racunId !== 'string' || !racunId) {
      return apiError('BAD_REQUEST', 'racunId is required (string)');
    }
    if (typeof type !== 'string' || !VALID_TYPES.has(type)) {
      return apiError('BAD_REQUEST', 'type must be one of: credit, debit, bonus, penalty');
    }
    if (typeof amount !== 'number') {
      return apiError('BAD_REQUEST', 'amount is required (number)');
    }
    if (typeof source !== 'string' || !VALID_SOURCES.has(source)) {
      return apiError('BAD_REQUEST', 'source must be a valid module name');
    }
    if (typeof idempotencyKey !== 'string' || !idempotencyKey) {
      return apiError('BAD_REQUEST', 'idempotencyKey is required (string)');
    }

    const input: ZlatniPointsInput = {
      racunId,
      type: type as ZlatniPointsInput['type'],
      amount,
      source: source as ZlatniPointsInput['source'],
      idempotencyKey,
      metadata: metadata && typeof metadata === 'object' && !Array.isArray(metadata)
        ? (metadata as Record<string, unknown>)
        : undefined,
    };

    const result = applyPoints(input);
    const response = apiSuccess(result, 200);
    setZlatniHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('zlatni-racuni/points', error);
  }
}
