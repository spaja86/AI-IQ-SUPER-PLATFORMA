// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction/assets
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  EXTRIMLI_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION,
  EXTRIMLI_DESTRUKCIJA_MODULE_VERSION,
  listDestructibleAssets,
} from '@/lib/extrimli';
import type { DestructibleAssetType, DestructibleMaterial, DimensionBand } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Contract-Version', EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Destrukcija-Module-Version', EXTRIMLI_DESTRUKCIJA_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as DestructibleAssetType | null;
    const material = searchParams.get('material') as DestructibleMaterial | null;
    const dimension = searchParams.get('dimension') as DimensionBand | null;
    const sportId = searchParams.get('sportId') ?? undefined;

    const assets = listDestructibleAssets({
      type: type ?? undefined,
      material: material ?? undefined,
      dimension: dimension ?? undefined,
      sportId,
    });

    const response = apiSuccess({ assets, count: assets.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction/assets', error);
  }
}
