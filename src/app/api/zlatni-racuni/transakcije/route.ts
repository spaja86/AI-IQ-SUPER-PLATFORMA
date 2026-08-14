// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI API: /api/zlatni-racuni/transakcije
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRacunByUserId, getTransactions, setZlatniHeaders } from '@/lib/zlatni-racuni';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return apiError('BAD_REQUEST', 'userId query param required');

    const racun = getRacunByUserId(userId);
    if (!racun) return apiError('NOT_FOUND', `ZlatniRacun not found for userId: ${userId}`);

    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const pageSize = pageSizeParam ? Math.min(100, Math.max(1, parseInt(pageSizeParam, 10))) : 20;

    const result = getTransactions(racun.id, page, pageSize);
    const response = apiSuccess(result, 200);
    setZlatniHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('zlatni-racuni/transakcije', error);
  }
}
