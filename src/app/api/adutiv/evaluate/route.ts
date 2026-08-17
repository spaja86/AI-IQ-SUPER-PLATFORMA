// SpajaUltraOmegaCore -∞Ω+∞ — ADUTIV API: /api/adutiv/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateAdutiv, setAdutivHeaders } from '@/lib/adutiv';
import type { AdutivInput, AdutivStrength } from '@/lib/adutiv';

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
    const { referenceId, advantages, context, competitiveField } = candidate;

    if (!Array.isArray(advantages) || advantages.length === 0) {
      return apiError('BAD_REQUEST', 'advantages is required (non-empty array)');
    }

    const input: AdutivInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      advantages: advantages as AdutivStrength[],
      context: typeof context === 'string' ? context : undefined,
      competitiveField: typeof competitiveField === 'string' ? competitiveField : undefined,
    };

    const result = evaluateAdutiv(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setAdutivHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('adutiv/evaluate', error);
  }
}
