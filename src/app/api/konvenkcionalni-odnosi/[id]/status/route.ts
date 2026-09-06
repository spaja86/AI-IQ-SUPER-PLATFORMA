// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI API: PATCH /api/konvenkcionalni-odnosi/[id]/status
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { changeRelationStatus, setKoHeaders } from '@/lib/konvenkcionalni-odnosi';
import type { StatusChangeInput } from '@/lib/konvenkcionalni-odnosi';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
    const { newStatus, actorId, reason } = candidate;

    if (typeof newStatus !== 'string' || !newStatus) {
      return apiError('BAD_REQUEST', 'newStatus is required (string)');
    }
    if (typeof actorId !== 'string' || !actorId.trim()) {
      return apiError('BAD_REQUEST', 'actorId is required (non-empty string)');
    }

    const input: StatusChangeInput = {
      relationId: id,
      newStatus: newStatus as StatusChangeInput['newStatus'],
      actorId,
      reason: typeof reason === 'string' ? reason : undefined,
    };

    const result = changeRelationStatus(input);
    const response = apiSuccess(result, result.ok ? 200 : 422);
    setKoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvenkcionalni-odnosi/[id]/status', error);
  }
}
