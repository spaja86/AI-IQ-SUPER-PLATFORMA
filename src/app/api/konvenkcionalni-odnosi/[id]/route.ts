// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI API: GET /api/konvenkcionalni-odnosi/[id]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRelation, setKoHeaders } from '@/lib/konvenkcionalni-odnosi';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return apiError('BAD_REQUEST', 'id param is required');
    }

    const result = getRelation(id);
    const response = apiSuccess(result, result.ok ? 200 : 404);
    setKoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvenkcionalni-odnosi/[id]', error);
  }
}
