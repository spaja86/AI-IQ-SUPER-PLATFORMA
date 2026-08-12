// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/gear/[sku]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getGearItem, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    if (!sku) return apiError('BAD_REQUEST', 'sku param is required', 400);

    const item = getGearItem(sku.toUpperCase());
    if (!item) return apiError('NOT_FOUND', `gear item not found: ${sku}`, 404);

    const response = apiSuccess(item, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/gear/[sku]', error);
  }
}
