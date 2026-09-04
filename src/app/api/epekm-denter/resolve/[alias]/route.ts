// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D API: GET /api/epekm-denter/resolve/[alias]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRouteEntry, EPEKM_CONTRACT_VERSION } from '@/lib/epekm-denter';

export const dynamic = 'force-dynamic';

/**
 * GET /api/epekm-denter/resolve/[alias]
 *
 * Resolves an alias to its canonical permanent email address.
 * Returns 404 if alias is not found or not active.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ alias: string }> },
) {
  const { alias } = await params;

  if (!alias || alias.trim() === '') {
    return apiError('BAD_REQUEST', 'alias path parameter is required');
  }

  try {
    const entry = getRouteEntry(alias);
    if (!entry) {
      return apiError('NOT_FOUND', `Alias not found or not active: ${alias}`);
    }
    const response = apiSuccess(entry, 200);
    response.headers.set('X-Epekm-Contract-Version', EPEKM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('epekm-denter/resolve', error);
  }
}
