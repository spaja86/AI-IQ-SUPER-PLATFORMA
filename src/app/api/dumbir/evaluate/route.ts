// SpajaUltraOmegaCore -∞Ω+∞ — ÐUMBIR API: /api/dumbir/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDumbir, setDumbirHeaders } from '@/lib/dumbir';
import type { DumbirAddon, DumbirInput } from '@/lib/dumbir';

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
      goal,
      sensitivity,
      preparation,
      gingerGrams,
      waterMl,
      steepMinutes,
      servings,
      addons,
    } = candidate;

    if (typeof goal !== 'string') {
      return apiError('BAD_REQUEST', 'goal is required (string)');
    }
    if (typeof sensitivity !== 'string') {
      return apiError('BAD_REQUEST', 'sensitivity is required (string)');
    }
    if (typeof preparation !== 'string') {
      return apiError('BAD_REQUEST', 'preparation is required (string)');
    }
    if (typeof gingerGrams !== 'number') {
      return apiError('BAD_REQUEST', 'gingerGrams is required (number)');
    }
    if (typeof waterMl !== 'number') {
      return apiError('BAD_REQUEST', 'waterMl is required (number)');
    }
    if (typeof steepMinutes !== 'number') {
      return apiError('BAD_REQUEST', 'steepMinutes is required (number)');
    }
    if (servings !== undefined && typeof servings !== 'number') {
      return apiError('BAD_REQUEST', 'servings must be a number when provided');
    }
    if (addons !== undefined && (!Array.isArray(addons) || addons.some((addon) => typeof addon !== 'string'))) {
      return apiError('BAD_REQUEST', 'addons must be an array of strings when provided');
    }

    const input: DumbirInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      goal: goal as DumbirInput['goal'],
      sensitivity: sensitivity as DumbirInput['sensitivity'],
      preparation: preparation as DumbirInput['preparation'],
      gingerGrams,
      waterMl,
      steepMinutes,
      servings: typeof servings === 'number' ? servings : undefined,
      addons: addons as DumbirAddon[] | undefined,
    };

    const result = evaluateDumbir(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDumbirHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('dumbir/evaluate', error);
  }
}
