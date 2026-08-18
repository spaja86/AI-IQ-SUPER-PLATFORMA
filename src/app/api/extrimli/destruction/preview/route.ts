// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction/preview
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  previewDestruction,
} from '@/lib/extrimli';
import type { DestructionInput } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Contract-Version', EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Module-Version', EXTRIMLI_DESTRUKCIJA_MODULE_VERSION);
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

    const b = body as Record<string, unknown>;
    const required = ['assetId', 'dimension', 'impactForce', 'resonanceIndex', 'containmentLevel'];
    for (const field of required) {
      if (b[field] === undefined) {
        return apiError('BAD_REQUEST', `${field} is required`);
      }
    }

    const input: DestructionInput = {
      assetId: String(b.assetId),
      dimension: String(b.dimension) as DestructionInput['dimension'],
      impactForce: Number(b.impactForce),
      resonanceIndex: Number(b.resonanceIndex),
      containmentLevel: Number(b.containmentLevel),
      athleteExperience: b.athleteExperience === undefined ? undefined : Number(b.athleteExperience),
      sportId: typeof b.sportId === 'string' ? b.sportId : undefined,
      referenceId: typeof b.referenceId === 'string' ? b.referenceId : undefined,
    };

    const result = previewDestruction(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction/preview', error);
  }
}
