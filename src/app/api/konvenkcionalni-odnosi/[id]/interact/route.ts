// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI API: POST /api/konvenkcionalni-odnosi/[id]/interact
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { recordInteraction, setKoHeaders } from '@/lib/konvenkcionalni-odnosi';
import type { InteractionInput } from '@/lib/konvenkcionalni-odnosi';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    if (!id || !id.trim()) {
      return apiError('BAD_REQUEST', 'id param is required');
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    const { actorId, payload, note } = candidate;

    if (typeof actorId !== 'string' || !actorId.trim()) {
      return apiError('BAD_REQUEST', 'actorId is required (non-empty string)');
    }

    const input: InteractionInput = {
      relationId: id,
      actorId,
      payload: payload && typeof payload === 'object' && !Array.isArray(payload)
        ? (payload as Record<string, unknown>)
        : undefined,
      note: typeof note === 'string' ? note : undefined,
    };

    const result = recordInteraction(input);
    const response = apiSuccess(result, result.ok ? 200 : 422);
    setKoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvenkcionalni-odnosi/[id]/interact', error);
  }
}
