// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/gear
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { listGearItems, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';
import type { GearCategory } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as GearCategory | null;
    const sportId  = searchParams.get('sportId') ?? undefined;

    const items = listGearItems({
      category: category ?? undefined,
      sportId,
    });

    const response = apiSuccess({ gear: items, count: items.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/gear', error);
  }
}
