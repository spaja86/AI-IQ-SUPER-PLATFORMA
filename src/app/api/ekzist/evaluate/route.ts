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

    if (typeof referenceId !== 'undefined' && typeof referenceId !== 'string') {
      return apiError('BAD_REQUEST', 'referenceId must be a string when provided');
    }

    if (!Array.isArray(domains) || domains.length === 0) {
      return apiError('BAD_REQUEST', 'domains is required (non-empty array)');
    }

    if (!domains.every((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))) {
      return apiError('BAD_REQUEST', 'domains must contain only objects');
    }

    if (
      !domains.every((entry) => typeof (entry as Record<string, unknown>).domain === 'string' && typeof (entry as Record<string, unknown>).score === 'number')
    ) {
      return apiError('BAD_REQUEST', 'each domain entry must include string domain and numeric score');
    }

    if (typeof lifePressures !== 'undefined' && (!Array.isArray(lifePressures) || !lifePressures.every((item) => typeof item === 'string'))) {
      return apiError('BAD_REQUEST', 'lifePressures must be an array of strings when provided');
    }

    if (typeof ageGroup !== 'undefined' && typeof ageGroup !== 'string') {
      return apiError('BAD_REQUEST', 'ageGroup must be a string when provided');
    }

    if (typeof sessionNotes !== 'undefined' && typeof sessionNotes !== 'string') {
      return apiError('BAD_REQUEST', 'sessionNotes must be a string when provided');
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
