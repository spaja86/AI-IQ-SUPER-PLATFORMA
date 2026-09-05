// SpajaUltraOmegaCore -∞Ω+∞ — GAMELORD API: /api/gamelord/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateGamelord, setGamelordHeaders } from '@/lib/gamelord';
import type { GamelordInput } from '@/lib/gamelord';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const withHeaders = (response: Response) => {
    setGamelordHeaders(response);
    return response;
  };

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return withHeaders(apiError('BAD_REQUEST', 'Invalid JSON body'));
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return withHeaders(apiError('BAD_REQUEST', 'Body must be a JSON object'));
    }

    const {
      referenceId,
      mode,
      strategyScore,
      executionScore,
      consistencyScore,
      riskControlScore,
      penaltyPoints,
      anomalyCount,
      matchDurationMs,
    } = body as Record<string, unknown>;

    if (referenceId !== undefined && typeof referenceId !== 'string') {
      return withHeaders(apiError('BAD_REQUEST', 'referenceId must be a string when provided'));
    }
    if (typeof mode !== 'string') {
      return withHeaders(apiError('BAD_REQUEST', 'mode is required (string)'));
    }
    if (typeof strategyScore !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'strategyScore is required (number)'));
    }
    if (typeof executionScore !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'executionScore is required (number)'));
    }
    if (typeof consistencyScore !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'consistencyScore is required (number)'));
    }
    if (typeof riskControlScore !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'riskControlScore is required (number)'));
    }
    if (typeof penaltyPoints !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'penaltyPoints is required (number)'));
    }
    if (typeof anomalyCount !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'anomalyCount is required (number)'));
    }
    if (typeof matchDurationMs !== 'number') {
      return withHeaders(apiError('BAD_REQUEST', 'matchDurationMs is required (number)'));
    }

    const result = evaluateGamelord({
      referenceId,
      mode: mode as GamelordInput['mode'],
      strategyScore,
      executionScore,
      consistencyScore,
      riskControlScore,
      penaltyPoints,
      anomalyCount,
      matchDurationMs,
    });

    return withHeaders(apiSuccess(result, result.valid ? 200 : 422));
  } catch (error) {
    return withHeaders(apiInternalError('gamelord/evaluate', error));
  }
}
