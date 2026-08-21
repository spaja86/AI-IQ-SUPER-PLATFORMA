// SpajaUltraOmegaCore -∞Ω+∞ — TAJMING API: /api/tajming/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateTajming, setTajmingHeaders } from '@/lib/tajming';
import type { TajmingInput } from '@/lib/tajming';
import { VALID_ACTIVITIES } from '@/lib/tajming/registry';

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
    const { referenceId, activity, timeOfDay, energyLevel, deadline } = candidate;

    if (typeof activity !== 'string' || !VALID_ACTIVITIES.includes(activity as TajmingInput['activity'])) {
      return apiError('BAD_REQUEST', `activity must be one of: ${VALID_ACTIVITIES.join(', ')}`);
    }
    if (typeof timeOfDay !== 'number') {
      return apiError('BAD_REQUEST', 'timeOfDay must be a number (0–23)');
    }
    if (typeof energyLevel !== 'number') {
      return apiError('BAD_REQUEST', 'energyLevel must be a number (0–100)');
    }

    const input: TajmingInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      activity: activity as TajmingInput['activity'],
      timeOfDay,
      energyLevel,
      deadline: typeof deadline === 'string' ? deadline : undefined,
    };

    const result = evaluateTajming(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setTajmingHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('tajming/evaluate', error);
  }
}
