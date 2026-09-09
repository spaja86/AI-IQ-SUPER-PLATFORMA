// SpajaUltraOmegaCore -∞Ω+∞ — TACSKRIN API: /api/tacskrin/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import { evaluateTacskrin, mapTacskrinInput, setTacskrinHeaders, validateTacskrinRequestShape } from '@/lib/tacskrin';

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
    const shapeError = validateTacskrinRequestShape(candidate);
    if (shapeError) return apiError('BAD_REQUEST', shapeError);

    const input = mapTacskrinInput(candidate);
    const result = evaluateTacskrin(input);

    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('TACSKRIN input failed domain validation', {
        data: result,
        validation: {
          valid: result.valid,
          status: result.status,
          equivalent: result.equivalent,
          reason: result.warnings[0] ?? 'DOMAIN_VALIDATION_FAILED',
        },
      });

    setTacskrinHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('tacskrin/evaluate', error);
  }
}
