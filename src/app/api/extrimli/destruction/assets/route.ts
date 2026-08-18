// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/destruction/assets
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { listDestructibleAssets } from '@/lib/extrimli';
import type { DestructibleAssetType, DestructibleMaterial, DimensionBand } from '@/lib/extrimli';
import { setDestructionHeaders } from '../_utils';

export const dynamic = 'force-dynamic';

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
    setDestructionHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/destruction/assets', error);
  }
}
