// SpajaUltraOmegaCore -∞Ω+∞ — KONVENCIONALNI ODNOSI API: /api/konvencionalni-odnosi/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateKonvencionalniOdnosi,
  setKonvencionalniOdnosiHeaders,
} from '@/lib/konvencionalni-odnosi';
import type {
  KonvencionalniOdnosiDimensionScore,
  KonvencionalniOdnosiInput,
  KonvencionalniOdnosiRelationType,
} from '@/lib/konvencionalni-odnosi';

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
    const { referenceId, relationType, dimensions } = candidate;

    if (!Array.isArray(dimensions) || dimensions.length === 0) {
      return apiError('BAD_REQUEST', 'dimensions is required (non-empty array)');
    }

    const shapeValid = dimensions.every((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
      const value = entry as Record<string, unknown>;
      return typeof value.dimension === 'string' && typeof value.score === 'number';
    });

    if (!shapeValid) {
      return apiError('BAD_REQUEST', 'Each dimension must include: dimension (string), score (number)');
    }

    const input: KonvencionalniOdnosiInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      relationType: typeof relationType === 'string'
        ? (relationType as KonvencionalniOdnosiRelationType)
        : undefined,
      dimensions: dimensions as KonvencionalniOdnosiDimensionScore[],
    };

    const result = evaluateKonvencionalniOdnosi(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setKonvencionalniOdnosiHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('konvencionalni-odnosi/evaluate', error);
  }
}
