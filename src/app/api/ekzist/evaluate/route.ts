// SpajaUltraOmegaCore -∞Ω+∞ — EKZIST API: /api/ekzist/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateEkzist, setEkzistHeaders } from '@/lib/ekzist';
import type { EkzistDomainScore, EkzistInput } from '@/lib/ekzist';

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
    const { referenceId, domains, lifePressures, ageGroup, sessionNotes } = candidate;

    if (!Array.isArray(domains) || domains.length === 0) {
      return apiError('BAD_REQUEST', 'domains is required (non-empty array)');
    }

    const input: EkzistInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      domains: domains as EkzistDomainScore[],
      lifePressures: Array.isArray(lifePressures)
        ? (lifePressures as string[]).filter((s) => typeof s === 'string')
        : undefined,
      ageGroup: typeof ageGroup === 'string' ? (ageGroup as EkzistInput['ageGroup']) : undefined,
      sessionNotes: typeof sessionNotes === 'string' ? sessionNotes : undefined,
    };

    const result = evaluateEkzist(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    setEkzistHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('ekzist/evaluate', error);
  }
}
