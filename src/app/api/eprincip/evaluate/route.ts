// SpajaUltraOmegaCore -∞Ω+∞ — EPRINCIP API: /api/eprincip/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateEPrincip,
  EPRINCIP_CONTRACT_VERSION,
  EPRINCIP_MODULE_VERSION,
} from '@/lib/eprincip';
import type { EPrincipInput } from '@/lib/eprincip';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Eprincip-Contract-Version', EPRINCIP_CONTRACT_VERSION);
  res.headers.set('X-Eprincip-Module-Version', EPRINCIP_MODULE_VERSION);
}

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

    const { principles, referenceId, minimumScore } = body as Record<string, unknown>;
    if (!Array.isArray(principles)) {
      return apiError('BAD_REQUEST', 'principles is required (array)');
    }

    const isShallowShapeValid = principles.every((principle) => {
      if (!principle || typeof principle !== 'object' || Array.isArray(principle)) return false;
      const candidate = principle as Record<string, unknown>;

      return (
        typeof candidate.id === 'string' &&
        typeof candidate.label === 'string' &&
        typeof candidate.score === 'number' &&
        typeof candidate.weight === 'number' &&
        (candidate.required === undefined || typeof candidate.required === 'boolean') &&
        (candidate.evidenceCount === undefined || typeof candidate.evidenceCount === 'number')
      );
    });

    if (!isShallowShapeValid) {
      return apiError(
        'BAD_REQUEST',
        'Each principle must include: id (string), label (string), score (number), weight (number)',
      );
    }

    if (referenceId !== undefined && typeof referenceId !== 'string') {
      return apiError('BAD_REQUEST', 'referenceId must be a string when provided');
    }

    if (minimumScore !== undefined && typeof minimumScore !== 'number') {
      return apiError('BAD_REQUEST', 'minimumScore must be a number when provided');
    }

    const input: EPrincipInput = {
      principles: principles as EPrincipInput['principles'],
      referenceId: referenceId as string | undefined,
      minimumScore: minimumScore as number | undefined,
    };

    const result = evaluateEPrincip(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('eprincip/evaluate', error);
  }
}
