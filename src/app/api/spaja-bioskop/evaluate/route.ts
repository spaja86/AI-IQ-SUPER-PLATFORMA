import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess, apiUnprocessableEntity } from '@/lib/api/response';
import {
  evaluateSpajaBioskop,
  SPAJA_BIOSKOP_API_RESPONSE_MAX_MS,
  SPAJA_BIOSKOP_CONTRACT_VERSION,
  SPAJA_BIOSKOP_MODULE_VERSION,
  type SpajaBioskopInput,
} from '@/lib/spaja-bioskop';

export const dynamic = 'force-dynamic';

function isValidInputShape(value: unknown): value is SpajaBioskopInput {
  if (typeof value !== 'object' || value === null) return false;
  const body = value as Record<string, unknown>;
  return typeof body.sequence === 'string'
    || (Array.isArray(body.sequence) && body.sequence.every((item) => typeof item === 'string'));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    if (!isValidInputShape(body)) {
      return apiError('BAD_REQUEST', 'Polje sequence je obavezno (string ili string[]).');
    }
    const payload: SpajaBioskopInput = body;

    const result = evaluateSpajaBioskop({
      sequence: payload.sequence,
      signalStrength: typeof payload.signalStrength === 'number' ? payload.signalStrength : undefined,
      strictOrder: typeof payload.strictOrder === 'boolean' ? payload.strictOrder : undefined,
    });

    const response = result.status === 'BLOCKED'
      ? apiUnprocessableEntity('Bioskop sekvenca nije validna.', result)
      : apiSuccess(result, 200);
    response.headers.set('X-Spaja-Bioskop-Contract-Version', SPAJA_BIOSKOP_CONTRACT_VERSION);
    response.headers.set('X-Spaja-Bioskop-Module-Version', SPAJA_BIOSKOP_MODULE_VERSION);
    response.headers.set('X-Spaja-Bioskop-Status', result.status);
    response.headers.set('X-Spaja-Bioskop-Go-NoGo', result.goNoGo);
    response.headers.set('X-Spaja-Bioskop-Max-Api-Ms', String(SPAJA_BIOSKOP_API_RESPONSE_MAX_MS));
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError('BAD_REQUEST', 'Nevalidan JSON payload.');
    }
    return apiInternalError('spaja-bioskop/evaluate', error);
  }
}
