// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK API: /api/ai-iq-programski-jezik/compile
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { compileAiiqLanguage, setAiiqLanguageHeaders } from '@/lib/ai-iq-programski-jezik';
import type { AiiqLanguageCompileInput } from '@/lib/ai-iq-programski-jezik';

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
    const { referenceId, source, targetMode, strictSecurity, featureFlagAiIqLanguage } = candidate;

    if (typeof source !== 'string') return apiError('BAD_REQUEST', 'source is required (string)');
    if (typeof targetMode !== 'string') return apiError('BAD_REQUEST', 'targetMode is required (string)');
    if (typeof strictSecurity !== 'boolean') return apiError('BAD_REQUEST', 'strictSecurity is required (boolean)');
    if (typeof featureFlagAiIqLanguage !== 'boolean') {
      return apiError('BAD_REQUEST', 'featureFlagAiIqLanguage is required (boolean)');
    }

    const input: AiiqLanguageCompileInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      source,
      targetMode: targetMode as AiiqLanguageCompileInput['targetMode'],
      strictSecurity,
      featureFlagAiIqLanguage,
    };

    const result = compileAiiqLanguage(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setAiiqLanguageHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('ai-iq-programski-jezik/compile', error);
  }
}
