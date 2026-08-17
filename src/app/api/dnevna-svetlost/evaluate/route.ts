// SpajaUltraOmegaCore -∞Ω+∞ — DNEVNA SVETLOST API: /api/dnevna-svetlost/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDnevnaSvetlost, setDnevnaSvetlostHeaders } from '@/lib/dnevna-svetlost';
import type { DnevnaSvetlostInput, DnevnaSvetlostSupportTool } from '@/lib/dnevna-svetlost';

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
      mode,
      uvProtection,
      ambientLightLux,
      uvIndex,
      focusLevel,
      sleepHours,
      exposureMinutes,
      supportTools,
    } = candidate;

    if (typeof mode !== 'string') {
      return apiError('BAD_REQUEST', 'mode is required (string)');
    }
    if (typeof uvProtection !== 'string') {
      return apiError('BAD_REQUEST', 'uvProtection is required (string)');
    }
    if (typeof ambientLightLux !== 'number') {
      return apiError('BAD_REQUEST', 'ambientLightLux is required (number)');
    }
    if (typeof uvIndex !== 'number') {
      return apiError('BAD_REQUEST', 'uvIndex is required (number)');
    }
    if (typeof focusLevel !== 'number') {
      return apiError('BAD_REQUEST', 'focusLevel is required (number)');
    }
    if (typeof sleepHours !== 'number') {
      return apiError('BAD_REQUEST', 'sleepHours is required (number)');
    }
    if (typeof exposureMinutes !== 'number') {
      return apiError('BAD_REQUEST', 'exposureMinutes is required (number)');
    }
    if (
      supportTools !== undefined &&
      (!Array.isArray(supportTools) || supportTools.some((tool) => typeof tool !== 'string'))
    ) {
      return apiError('BAD_REQUEST', 'supportTools must be an array of strings when provided');
    }

    const input: DnevnaSvetlostInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      mode: mode as DnevnaSvetlostInput['mode'],
      uvProtection: uvProtection as DnevnaSvetlostInput['uvProtection'],
      ambientLightLux,
      uvIndex,
      focusLevel,
      sleepHours,
      exposureMinutes,
      supportTools: supportTools as DnevnaSvetlostSupportTool[] | undefined,
    };

    const result = evaluateDnevnaSvetlost(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setDnevnaSvetlostHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('dnevna-svetlost/evaluate', error);
  }
}
