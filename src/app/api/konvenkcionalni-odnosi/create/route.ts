// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI API: POST /api/konvenkcionalni-odnosi/create
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createRelation, setKoHeaders } from '@/lib/konvenkcionalni-odnosi';
import type { CreateRelationInput } from '@/lib/konvenkcionalni-odnosi';

export const dynamic = 'force-dynamic';

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

    const candidate = body as Record<string, unknown>;
    const { type, initiatorId, initiatorEntityType, recipientId, recipientEntityType, description, tags } = candidate;

    if (typeof type !== 'string' || !type) {
      return apiError('BAD_REQUEST', 'type is required (string)');
    }
    if (typeof initiatorId !== 'string' || !initiatorId.trim()) {
      return apiError('BAD_REQUEST', 'initiatorId is required (non-empty string)');
    }
    if (typeof recipientId !== 'string' || !recipientId.trim()) {
      return apiError('BAD_REQUEST', 'recipientId is required (non-empty string)');
    }
    if (typeof initiatorEntityType !== 'string' || !initiatorEntityType) {
      return apiError('BAD_REQUEST', 'initiatorEntityType is required (string)');
    }
    if (typeof recipientEntityType !== 'string' || !recipientEntityType) {
      return apiError('BAD_REQUEST', 'recipientEntityType is required (string)');
    }

    const input: CreateRelationInput = {
      type: type as CreateRelationInput['type'],
      initiatorId,
      initiatorEntityType: initiatorEntityType as CreateRelationInput['initiatorEntityType'],
      recipientId,
      recipientEntityType: recipientEntityType as CreateRelationInput['recipientEntityType'],
      description: typeof description === 'string' ? description : undefined,
      tags: Array.isArray(tags) ? (tags as string[]) : undefined,
    };

    const result = createRelation(input);
    const response = apiSuccess(result, result.ok ? 201 : 422);
    setKoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvenkcionalni-odnosi/create', error);
  }
}
