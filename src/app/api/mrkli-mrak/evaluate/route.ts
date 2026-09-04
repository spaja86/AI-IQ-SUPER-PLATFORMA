// SpajaUltraOmegaCore -∞Ω+∞ — MRKLI MRAK API: /api/mrkli-mrak/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateMrkliMrak, setMrkliMrakHeaders } from '@/lib/mrkli-mrak';
import type { MrkliMrakInput, MrkliMrakSupportTool } from '@/lib/mrkli-mrak';

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
      riskTolerance,
      ambientLightLux,
      focusLevel,
      sleepHours,
      sessionMinutes,
      supportTools,
    } = candidate;

    if (typeof mode !== 'string') {
      return apiError('BAD_REQUEST', 'mode is required (string)');
    }
    if (typeof riskTolerance !== 'string') {
      return apiError('BAD_REQUEST', 'riskTolerance is required (string)');
    }
    if (typeof ambientLightLux !== 'number') {
      return apiError('BAD_REQUEST', 'ambientLightLux is required (number)');
    }
    if (typeof focusLevel !== 'number') {
      return apiError('BAD_REQUEST', 'focusLevel is required (number)');
    }
    if (typeof sleepHours !== 'number') {
      return apiError('BAD_REQUEST', 'sleepHours is required (number)');
    }
    if (typeof sessionMinutes !== 'number') {
      return apiError('BAD_REQUEST', 'sessionMinutes is required (number)');
    }
    if (
      supportTools !== undefined &&
      (!Array.isArray(supportTools) || supportTools.some((tool) => typeof tool !== 'string'))
    ) {
      return apiError('BAD_REQUEST', 'supportTools must be an array of strings when provided');
    }

    const input: MrkliMrakInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      mode: mode as MrkliMrakInput['mode'],
      riskTolerance: riskTolerance as MrkliMrakInput['riskTolerance'],
      ambientLightLux,
      focusLevel,
      sleepHours,
      sessionMinutes,
      supportTools: supportTools as MrkliMrakSupportTool[] | undefined,
    };

    const result = evaluateMrkliMrak(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setMrkliMrakHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('mrkli-mrak/evaluate', error);
  }
}
