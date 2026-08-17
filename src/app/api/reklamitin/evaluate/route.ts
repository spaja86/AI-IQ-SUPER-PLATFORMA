// SpajaUltraOmegaCore -∞Ω+∞ — REKLAMITIN API: /api/reklamitin/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateReklamitin, setReklamitiнHeaders } from '@/lib/reklamitin';
import type { ReklamitiнRequest } from '@/lib/reklamitin';

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
    const { referenceId, level, broadcastTargets, audienceSegment, durationSeconds, budgetScore, adId, title } = candidate;

    if (!level) {
      return apiError('BAD_REQUEST', 'level is required');
    }

    if (!Array.isArray(broadcastTargets) || broadcastTargets.length === 0) {
      return apiError('BAD_REQUEST', 'broadcastTargets is required (non-empty array)');
    }

    if (!audienceSegment) {
      return apiError('BAD_REQUEST', 'audienceSegment is required');
    }

    if (typeof durationSeconds !== 'number') {
      return apiError('BAD_REQUEST', 'durationSeconds must be a number');
    }

    if (typeof budgetScore !== 'number') {
      return apiError('BAD_REQUEST', 'budgetScore must be a number');
    }

    const input: ReklamitiнRequest = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      level: level as ReklamitiнRequest['level'],
      broadcastTargets: broadcastTargets as ReklamitiнRequest['broadcastTargets'],
      audienceSegment: audienceSegment as ReklamitiнRequest['audienceSegment'],
      durationSeconds: durationSeconds as number,
      budgetScore: budgetScore as number,
      adId: typeof adId === 'string' ? adId : undefined,
      title: typeof title === 'string' ? title : undefined,
    };

    const result = evaluateReklamitin(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setReklamitiнHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('reklamitin/evaluate', error);
  }
}
