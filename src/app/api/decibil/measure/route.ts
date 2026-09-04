// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL API: /api/decibil/measure
// Kompanija SPAJA — Digitalna Industrija
//
// GET  /api/decibil/measure — vraća trenutno sintetičko merenje (tišina)
// POST /api/decibil/measure — prima JSON { samples, sampleRate, ... } i vraća merenje

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  analyzeDecibels,
  getSilenceMeasurement,
  DECIBIL_CONTRACT_VERSION,
  DECIBIL_MODULE_VERSION,
} from '@/lib/decibil';
import type { DecibelAnalysisInput } from '@/lib/decibil';

export const dynamic = 'force-dynamic';

function setDecibilHeaders(res: Response): void {
  res.headers.set('X-Decibil-Contract-Version', DECIBIL_CONTRACT_VERSION);
  res.headers.set('X-Decibil-Module-Version', DECIBIL_MODULE_VERSION);
}

/**
 * GET /api/decibil/measure
 *
 * Vraća trenutno merenje (sintetička tišina kao placeholder za server-side).
 */
export async function GET() {
  try {
    const measurement = getSilenceMeasurement();
    const response = apiSuccess(measurement, 200);
    setDecibilHeaders(response);
    return response;
  } catch (err) {
    return apiInternalError(err);
  }
}

/**
 * POST /api/decibil/measure
 *
 * Prima JSON body sa audio uzorcima i vraća DecibelAnalysisResult.
 *
 * Body: { samples: number[], sampleRate: number, windowMs?, source?, sourceId?, thresholds? }
 */
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Neispravan JSON body.', 400);
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      !Array.isArray((body as DecibelAnalysisInput).samples) ||
      typeof (body as DecibelAnalysisInput).sampleRate !== 'number'
    ) {
      return apiError('BAD_REQUEST', 'Obavezna polja: samples (number[]), sampleRate (number).', 400);
    }

    const input = body as DecibelAnalysisInput;

    if (input.sampleRate <= 0) {
      return apiError('BAD_REQUEST', 'sampleRate mora biti pozitivan broj.', 400);
    }

    const result = analyzeDecibels(input);
    const response = apiSuccess(result, 200);
    setDecibilHeaders(response);
    return response;
  } catch (err) {
    return apiInternalError(err);
  }
}
