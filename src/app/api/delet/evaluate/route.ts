// SpajaUltraOmegaCore -∞Ω+∞ — DELET API: /api/delet/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import { evaluateDelet, setDeletHeaders } from '@/lib/delet';
import type { DeletInput } from '@/lib/delet';

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
      return apiError('BAD_REQUEST', 'objective is required (string)');
    }
    if (typeof scope !== 'string') {
      return apiError('BAD_REQUEST', 'scope is required (string)');
    }
    if (typeof dataSensitivityScore !== 'number') {
      return apiError('BAD_REQUEST', 'dataSensitivityScore is required (number)');
    }
    if (typeof retentionAgeDays !== 'number') {
      return apiError('BAD_REQUEST', 'retentionAgeDays is required (number)');
    }
    if (typeof recoveryWindowHours !== 'number') {
      return apiError('BAD_REQUEST', 'recoveryWindowHours is required (number)');
    }
    if (typeof dependencyCount !== 'number') {
      return apiError('BAD_REQUEST', 'dependencyCount is required (number)');
    }
    if (typeof backupCoverageScore !== 'number') {
      return apiError('BAD_REQUEST', 'backupCoverageScore is required (number)');
    }
    if (typeof legalHoldActive !== 'boolean') {
      return apiError('BAD_REQUEST', 'legalHoldActive is required (boolean)');
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
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiUnprocessableEntity('DELET evaluation input failed domain validation', {
        validation: {
          valid: result.valid,
          objective: result.objective,
          scope: result.scope,
          status: result.status,
          recommendedAction: result.recommendedAction,
          reason: result.warnings[0] ?? 'DOMAIN_VALIDATION_FAILED',
        },
      });
    setDeletHeaders(response, result);
    return response;
  } catch (error) {
    return apiInternalError('delet/evaluate', error);
  }
}
