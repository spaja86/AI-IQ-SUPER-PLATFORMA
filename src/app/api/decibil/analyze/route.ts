// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL API: /api/decibil/analyze
// Kompanija SPAJA — Digitalna Industrija
//
// POST /api/decibil/analyze — analizira audio uzorke i vraća DecibelAnalysisResult

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  analyzeDecibels,
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
 * POST /api/decibil/analyze
 *
 * Prihvata JSON sa audio uzorcima i vraća potpunu analizu dBFS vrednosti,
 * status (silence/normal/warning/clipping), upozorenja i performanse.
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

    if (input.samples.length === 0) {
      return apiError('BAD_REQUEST', 'samples niz ne sme biti prazan.', 400);
    }

    const result = analyzeDecibels(input);
    const response = apiSuccess(result, 200);
    setDecibilHeaders(response);
    return response;
  } catch (err) {
    return apiInternalError('decibil/analyze', err);
  }
}
