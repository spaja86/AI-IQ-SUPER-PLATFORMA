// SpajaUltraOmegaCore -∞Ω+∞ — TRIKOT API: /api/trikot/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import { evaluateTrikot, mapTrikotInput, setTrikotHeaders, validateTrikotRequestShape } from '@/lib/trikot';

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
    const shapeError = validateTrikotRequestShape(candidate);
    if (shapeError) return apiError('BAD_REQUEST', shapeError);

    const input = mapTrikotInput(candidate);
    const result = evaluateTrikot(input);
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('TRIKOT evaluation input failed domain validation', {
        data: result,
        validation: {
          valid: result.valid,
          objective: result.rawObjective ?? result.objective,
          season: result.rawSeason ?? result.season,
          dressCode: result.rawDressCode ?? result.dressCode,
          status: result.status,
          recommendedAction: result.recommendedAction,
          reason: result.warnings[0] ?? 'DOMAIN_VALIDATION_FAILED',
        },
      });
    setTrikotHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('trikot/evaluate', error);
  }
}
