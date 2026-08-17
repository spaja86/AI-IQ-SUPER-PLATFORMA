// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI API: /api/zlatni-racuni/racun
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRacunByUserId, upsertRacun, setZlatniHeaders } from '@/lib/zlatni-racuni';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return apiError('BAD_REQUEST', 'userId query param required');

    const racun = getRacunByUserId(userId);
    if (!racun) return apiError('NOT_FOUND', `ZlatniRacun not found for userId: ${userId}`);

    const response = apiSuccess(racun, 200);
    setZlatniHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('zlatni-racuni/racun GET', error);
  }
}

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

    const { userId, idempotencyKey } = body as Record<string, unknown>;
    if (typeof userId !== 'string' || !userId) {
      return apiError('BAD_REQUEST', 'userId is required (string)');
    }
    if (typeof idempotencyKey !== 'string' || !idempotencyKey) {
      return apiError('BAD_REQUEST', 'idempotencyKey is required (string)');
    }

    const racun = upsertRacun({ userId, idempotencyKey });
    const response = apiSuccess(racun, 200);
    setZlatniHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('zlatni-racuni/racun POST', error);
  }
}
