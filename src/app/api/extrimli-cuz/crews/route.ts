// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/crews
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createCrew, listCrews, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sportId   = searchParams.get('sportId')   ?? undefined;
    const region    = searchParams.get('region')    ?? undefined;
    const isPublic  = searchParams.has('isPublic')
      ? searchParams.get('isPublic') === 'true'
      : undefined;

    const crews = listCrews({ sportId, region, isPublic });
    const response = apiSuccess({ crews, count: crews.length }, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/crews GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body', 400);
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object', 400);
    }

    const b = body as Record<string, unknown>;
    if (typeof b.name      !== 'string') return apiError('BAD_REQUEST', 'name (string) is required', 400);
    if (typeof b.captainId !== 'string') return apiError('BAD_REQUEST', 'captainId (string) is required', 400);
    if (!Array.isArray(b.sportIds))      return apiError('BAD_REQUEST', 'sportIds (array) is required', 400);
    if (typeof b.region    !== 'string') return apiError('BAD_REQUEST', 'region (string) is required', 400);

    const crew = createCrew({
      name:      b.name,
      captainId: b.captainId,
      sportIds:  b.sportIds as string[],
      region:    b.region,
      isPublic:  typeof b.isPublic === 'boolean' ? b.isPublic : true,
    });

    const response = apiSuccess(crew, 201);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/crews POST', error);
  }
}
