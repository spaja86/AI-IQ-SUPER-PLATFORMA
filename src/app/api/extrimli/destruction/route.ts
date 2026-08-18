// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDestruction } from '@/lib/extrimli';
import type { DestructionInput } from '@/lib/extrimli';
import { setDestructionHeaders } from './_utils';

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

    const result = evaluateDestruction(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDestructionHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction', error);
  }
}
