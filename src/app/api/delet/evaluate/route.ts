// SpajaUltraOmegaCore -∞Ω+∞ — DELET API: /api/delet/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { evaluateDelet, setDeletHeaders } from '@/lib/delet';
import type { DeletInput } from '@/lib/delet';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const badRequest = (message: string) => {
    const response = apiError('BAD_REQUEST', message);
    setDeletHeaders(response);
    return response;
  };

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
    const {
      referenceId,
      objective,
      scope,
      dataSensitivityScore,
      retentionAgeDays,
      recoveryWindowHours,
      dependencyCount,
      backupCoverageScore,
      legalHoldActive,
    } = candidate;

    if (typeof objective !== 'string') {
      return badRequest('objective is required (string)');
    }
    if (typeof scope !== 'string') {
      return badRequest('scope is required (string)');
    }
    if (typeof dataSensitivityScore !== 'number') {
      return badRequest('dataSensitivityScore is required (number)');
    }
    if (typeof retentionAgeDays !== 'number') {
      return badRequest('retentionAgeDays is required (number)');
    }
    if (typeof recoveryWindowHours !== 'number') {
      return badRequest('recoveryWindowHours is required (number)');
    }
    if (typeof dependencyCount !== 'number') {
      return badRequest('dependencyCount is required (number)');
    }
    if (typeof backupCoverageScore !== 'number') {
      return badRequest('backupCoverageScore is required (number)');
    }
    if (typeof legalHoldActive !== 'boolean') {
      return badRequest('legalHoldActive is required (boolean)');
    }

    const input: DeletInput = {
      referenceId: typeof referenceId === 'string' ? referenceId : undefined,
      objective: objective as DeletInput['objective'],
      scope: scope as DeletInput['scope'],
      dataSensitivityScore,
      retentionAgeDays,
      recoveryWindowHours,
      dependencyCount,
      backupCoverageScore,
      legalHoldActive,
    };

    const result = evaluateDelet(input);
    const response = apiSuccess(result, result.valid ? 200 : 422);
    if (!result.valid) {
      response.headers.set('X-Delet-Error-Code', 'UNPROCESSABLE_ENTITY');
      response.headers.set('X-Delet-Validation-Reason', result.warnings[0] ?? 'DOMAIN_VALIDATION_FAILED');
    }
    setDeletHeaders(response, result);
    return response;
  } catch (error) {
    const response = apiInternalError('delet/evaluate', error);
    setDeletHeaders(response);
    return response;
  }
}
