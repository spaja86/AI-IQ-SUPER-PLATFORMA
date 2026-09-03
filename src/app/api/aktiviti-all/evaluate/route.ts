// SpajaUltraOmegaCore -∞Ω+∞ — AKTIVITI ALL API: /api/aktiviti-all/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateAktivitiAll, setAktivitiAllHeaders } from '@/lib/aktiviti-all';
import type { AktivitiAllInput } from '@/lib/aktiviti-all';
import { VALID_AKTIVITI_ALL_ACTIVITIES } from '@/lib/aktiviti-all/registry';

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
    const { referenceId, activity, durationMinutes, energyLevel, focusLevel, stressLevel, completionRate } = c;

    if (typeof activity !== 'string') {
      return apiError('BAD_REQUEST', `activity must be one of: ${VALID_AKTIVITI_ALL_ACTIVITIES.join(', ')}`);
    }

    if (typeof durationMinutes !== 'number') {
      return apiError('BAD_REQUEST', 'durationMinutes must be a number');
    }
    if (typeof energyLevel !== 'number') {
      return apiError('BAD_REQUEST', 'energyLevel must be a number (0-100)');
    }
    if (typeof focusLevel !== 'number') {
      return apiError('BAD_REQUEST', 'focusLevel must be a number (0-100)');
    }
    if (typeof stressLevel !== 'number') {
      return apiError('BAD_REQUEST', 'stressLevel must be a number (0-100)');
    }
    if (typeof completionRate !== 'number') {
      return apiError('BAD_REQUEST', 'completionRate must be a number (0-100)');
    }

    const input: AktivitiAllInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      activity: activity as AktivitiAllInput['activity'],
      durationMinutes,
      energyLevel,
      focusLevel,
      stressLevel,
      completionRate,
    };

    const result = evaluateAktivitiAll(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setAktivitiAllHeaders(response, result);
    return response;
  } catch (error) {
    const response = apiInternalError('aktiviti-all/evaluate', error);
    setAktivitiAllHeaders(response);
    return response;
  }
}
