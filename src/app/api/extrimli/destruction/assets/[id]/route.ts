// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction/assets/[id]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getDestructibleAssetById } from '@/lib/extrimli';
import { setDestructionHeaders } from '../../_utils';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return apiError('BAD_REQUEST', 'id param is required');

    const asset = getDestructibleAssetById(id);
    if (!asset) return apiError('NOT_FOUND', `destructible asset not found: ${id}`);

    const response = apiSuccess(asset, 200);
    setDestructionHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction/assets/[id]', error);
  }
}
