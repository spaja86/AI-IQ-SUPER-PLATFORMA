// SpajaUltraOmegaCore -∞Ω+∞ — GEOGRAFIJA REALNA API: /api/geografija-realna/evaluate
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  evaluateGeografijaRealna,
  setGeografijaRealnaHeaders,
} from '@/lib/geografija-realna';
import type { GeografijaRealnaInput } from '@/lib/geografija-realna';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const withHeaders = (response: Response) => {
    setGeografijaRealnaHeaders(response);
    return response;
  };

  const badRequest = (message: string) =>
    withHeaders(apiError('BAD_REQUEST', message));

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
      ['regionScale', 'string'],
      ['terrainComplexity', 'string'],
      ['accuracyScore', 'number'],
      ['contextScore', 'number'],
      ['dataFreshnessScore', 'number'],
      ['riskScore', 'number'],
      ['timeWindowHours', 'number'],
      ['constraintsCount', 'number'],
    ] as const;

    for (const [field, expectedType] of requiredFields) {
      const value = candidate[field];
      if (value === undefined || value === null) {
        return badRequest(`${field} is required (${expectedType})`);
      }
      if (typeof value !== expectedType) {
        return badRequest(`${field} must be ${expectedType}`);
      }
      if (expectedType === 'number' && !Number.isFinite(value as number)) {
        return badRequest(`${field} must be a finite number`);
      }
    }

    const input: GeografijaRealnaInput = {
      referenceId:
        typeof candidate.referenceId === 'string'
          ? candidate.referenceId
          : undefined,
      objective: candidate.objective as GeografijaRealnaInput['objective'],
      regionScale: candidate.regionScale as GeografijaRealnaInput['regionScale'],
      terrainComplexity: candidate.terrainComplexity as GeografijaRealnaInput['terrainComplexity'],
      accuracyScore: candidate.accuracyScore as number,
      contextScore: candidate.contextScore as number,
      dataFreshnessScore: candidate.dataFreshnessScore as number,
      riskScore: candidate.riskScore as number,
      timeWindowHours: candidate.timeWindowHours as number,
      constraintsCount: candidate.constraintsCount as number,
    };

    const result = evaluateGeografijaRealna(input);
    const response = result.valid
      ? apiSuccess(result, 200)
      : apiError(
          'UNPROCESSABLE_ENTITY',
          result.warnings[0] ?? 'GEOGRAFIJA REALNA evaluation is invalid',
          result,
        );
    setGeografijaRealnaHeaders(response, result);
    return response;
  } catch (error) {
    return withHeaders(apiInternalError('geografija-realna/evaluate', error));
  }
}
