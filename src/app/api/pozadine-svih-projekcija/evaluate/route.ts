// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA API: /api/pozadine-svih-projekcija/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import {
  evaluatePozadineSvihProjekcija,
  mapPozadineSvihProjekcijaInput,
  setPozadineSvihProjekcijaHeaders,
  validatePozadineSvihProjekcijaRequestShape,
} from '@/lib/pozadine-svih-projekcija';

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
    const shapeError = validatePozadineSvihProjekcijaRequestShape(candidate);
    if (shapeError) return apiError('BAD_REQUEST', shapeError);

    const input = mapPozadineSvihProjekcijaInput(candidate);
    const result = evaluatePozadineSvihProjekcija(input);

    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('POZADINE SVIH PROJEKCIJA input failed domain validation', {
        data: result,
        validation: {
          valid: result.valid,
          status: result.status,
          equivalent: result.equivalent,
          reason: result.warnings[0] ?? 'DOMAIN_VALIDATION_FAILED',
        },
      });

    setPozadineSvihProjekcijaHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('pozadine-svih-projekcija/evaluate', error);
  }
}
