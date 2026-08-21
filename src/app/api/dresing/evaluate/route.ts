// SpajaUltraOmegaCore -∞Ω+∞ — DRESING API: /api/dresing/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDresing, setDresingHeaders } from '@/lib/dresing';
import type { DresingInput } from '@/lib/dresing';
import { VALID_OCCASIONS, VALID_STYLES } from '@/lib/dresing/registry';

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

    const c = body as Record<string, unknown>;
    const {
      referenceId, occasion, weatherTempC, windSpeedKmh,
      precipitation, formalityLevel, colorPalette, preferredStyle,
    } = c;

    if (typeof occasion !== 'string' || !VALID_OCCASIONS.includes(occasion as DresingInput['occasion'])) {
      return apiError('BAD_REQUEST', `occasion must be one of: ${VALID_OCCASIONS.join(', ')}`);
    }
    if (typeof weatherTempC !== 'number') {
      return apiError('BAD_REQUEST', 'weatherTempC must be a number');
    }
    if (typeof windSpeedKmh !== 'number') {
      return apiError('BAD_REQUEST', 'windSpeedKmh must be a number');
    }
    if (typeof precipitation !== 'number') {
      return apiError('BAD_REQUEST', 'precipitation must be a number (0–100)');
    }
    if (typeof formalityLevel !== 'number') {
      return apiError('BAD_REQUEST', 'formalityLevel must be a number (0–10)');
    }
    if (!Array.isArray(colorPalette)) {
      return apiError('BAD_REQUEST', 'colorPalette must be an array of strings');
    }
    if (typeof preferredStyle !== 'string' || !VALID_STYLES.includes(preferredStyle as DresingInput['preferredStyle'])) {
      return apiError('BAD_REQUEST', `preferredStyle must be one of: ${VALID_STYLES.join(', ')}`);
    }

    const input: DresingInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      occasion: occasion as DresingInput['occasion'],
      weatherTempC,
      windSpeedKmh,
      precipitation,
      formalityLevel,
      colorPalette: (colorPalette as unknown[]).map(String),
      preferredStyle: preferredStyle as DresingInput['preferredStyle'],
    };

    const result = evaluateDresing(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDresingHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('dresing/evaluate', error);
  }
}
