// SpajaUltraOmegaCore -∞Ω+∞ — KULKON API: /api/kulkon/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateKulkon, setKulkonHeaders } from '@/lib/kulkon';
import type { KulkonInput } from '@/lib/kulkon';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const withHeaders = (response: Response) => {
    setKulkonHeaders(response);
    return response;
  };

  const badRequest = (message: string) => withHeaders(apiError('BAD_REQUEST', message));

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return badRequest('Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return badRequest('Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;

    const requiredFields = [
      ['objective', 'string'],
      ['environment', 'string'],
      ['rhythm', 'string'],
      ['clarityScore', 'number'],
      ['trustScore', 'number'],
      ['accountabilityScore', 'number'],
      ['communicationLoad', 'number'],
      ['conflictRate', 'number'],
      ['participantCount', 'number'],
      ['windowDays', 'number'],
    ] as const;

    for (const [field, expectedType] of requiredFields) {
      const value = candidate[field];
      if (value === undefined || value === null) {
        return badRequest(`${field} is required (${expectedType})`);
      }
      if (typeof value !== expectedType) {
        return badRequest(`${field} must be ${expectedType}`);
      }
    }

    const input: KulkonInput = {
      referenceId: typeof candidate.referenceId === 'string' ? candidate.referenceId : undefined,
      objective: candidate.objective as KulkonInput['objective'],
      environment: candidate.environment as KulkonInput['environment'],
      rhythm: candidate.rhythm as KulkonInput['rhythm'],
      clarityScore: candidate.clarityScore as number,
      trustScore: candidate.trustScore as number,
      accountabilityScore: candidate.accountabilityScore as number,
      communicationLoad: candidate.communicationLoad as number,
      conflictRate: candidate.conflictRate as number,
      participantCount: candidate.participantCount as number,
      windowDays: candidate.windowDays as number,
    };

    const result = evaluateKulkon(input);
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiError('UNPROCESSABLE_ENTITY', result.warnings[0] ?? 'KULKON evaluation is invalid', result);
    setKulkonHeaders(response, result);
    return response;
  } catch (error) {
    return withHeaders(apiInternalError('kulkon/evaluate', error));
  }
}
