// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK API: /api/ai-iq-programski-jezik/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateAiiqLanguage, setAiiqLanguageHeaders } from '@/lib/ai-iq-programski-jezik';
import type { AiiqLanguageEvaluateInput } from '@/lib/ai-iq-programski-jezik';

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
      mode,
      promptComplexity,
      ruleCoverage,
      orchestrationReadiness,
      autonomyLevel,
      riskLevel,
      explainabilityNeed,
      securityPolicyScore,
      fallbackConfigured,
    } = candidate;

    if (typeof goal !== 'string') return apiError('BAD_REQUEST', 'goal is required (string)');
    if (typeof mode !== 'string') return apiError('BAD_REQUEST', 'mode is required (string)');
    if (typeof promptComplexity !== 'number') return apiError('BAD_REQUEST', 'promptComplexity is required (number)');
    if (typeof ruleCoverage !== 'number') return apiError('BAD_REQUEST', 'ruleCoverage is required (number)');
    if (typeof orchestrationReadiness !== 'number') return apiError('BAD_REQUEST', 'orchestrationReadiness is required (number)');
    if (typeof autonomyLevel !== 'number') return apiError('BAD_REQUEST', 'autonomyLevel is required (number)');
    if (typeof riskLevel !== 'number') return apiError('BAD_REQUEST', 'riskLevel is required (number)');
    if (typeof explainabilityNeed !== 'number') return apiError('BAD_REQUEST', 'explainabilityNeed is required (number)');
    if (typeof securityPolicyScore !== 'number') return apiError('BAD_REQUEST', 'securityPolicyScore is required (number)');
    if (typeof fallbackConfigured !== 'boolean') return apiError('BAD_REQUEST', 'fallbackConfigured is required (boolean)');

    const input: AiiqLanguageEvaluateInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      goal,
      mode: mode as AiiqLanguageEvaluateInput['mode'],
      promptComplexity,
      ruleCoverage,
      orchestrationReadiness,
      autonomyLevel,
      riskLevel,
      explainabilityNeed,
      securityPolicyScore,
      fallbackConfigured,
    };

    const result = evaluateAiiqLanguage(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setAiiqLanguageHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('ai-iq-programski-jezik/evaluate', error);
  }
}
