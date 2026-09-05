// SpajaUltraOmegaCore -∞Ω+∞ — DUET API: /api/duet/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDuet, setDuetHeaders } from '@/lib/duet';
import type { DuetInput } from '@/lib/duet';

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
    const {
      referenceId,
      objective,
      mode,
      energyMatch,
      clarityScore,
      reciprocityScore,
      trustScore,
      rhythmScore,
      tensionLevel,
      sharedWindowHours,
    } = candidate;

    if (typeof objective !== 'string') {
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof mode !== 'string') {
      return apiError('BAD_REQUEST', 'mode is required (string)');
    }
    if (typeof energyMatch !== 'string') {
      return apiError('BAD_REQUEST', 'energyMatch is required (string)');
    }
    if (typeof clarityScore !== 'number') {
      return apiError('BAD_REQUEST', 'clarityScore is required (number)');
    }
    if (typeof reciprocityScore !== 'number') {
      return apiError('BAD_REQUEST', 'reciprocityScore is required (number)');
    }
    if (typeof trustScore !== 'number') {
      return apiError('BAD_REQUEST', 'trustScore is required (number)');
    }
    if (typeof rhythmScore !== 'number') {
      return apiError('BAD_REQUEST', 'rhythmScore is required (number)');
    }
    if (typeof tensionLevel !== 'number') {
      return apiError('BAD_REQUEST', 'tensionLevel is required (number)');
    }
    if (typeof sharedWindowHours !== 'number') {
      return apiError('BAD_REQUEST', 'sharedWindowHours is required (number)');
    }

    const input: DuetInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as DuetInput['objective'],
      mode: mode as DuetInput['mode'],
      energyMatch: energyMatch as DuetInput['energyMatch'],
      clarityScore,
      reciprocityScore,
      trustScore,
      rhythmScore,
      tensionLevel,
      sharedWindowHours,
    };

    const result = evaluateDuet(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDuetHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('duet/evaluate', error);
  }
}
