// SpajaUltraOmegaCore -∞Ω+∞ — GREAT SUMBION API: /api/great-sumbion/calculate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  calculateGreatSumbion,
  GREAT_SUMBION_CONTRACT_VERSION,
  GREAT_SUMBION_MODULE_VERSION,
} from '@/lib/great-sumbion';
import type { GreatSumbionInput } from '@/lib/great-sumbion';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-GreatSumbion-Contract-Version', GREAT_SUMBION_CONTRACT_VERSION);
  res.headers.set('X-GreatSumbion-Module-Version', GREAT_SUMBION_MODULE_VERSION);
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object', 400);
    }

    const { signals, referenceId } = body as Record<string, unknown>;
    if (!Array.isArray(signals)) {
      return apiError('BAD_REQUEST', 'signals is required (array)', 400);
    }

    const input: GreatSumbionInput = {
      signals: signals as GreatSumbionInput['signals'],
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
    };

    const result = calculateGreatSumbion(input);
    const statusCode = result.valid ? 200 : 422;
    const response = apiSuccess(result, statusCode);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('great-sumbion/calculate', error);
  }
}
