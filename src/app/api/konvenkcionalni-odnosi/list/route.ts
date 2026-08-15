// SpajaUltraOmegaCore -∞Ω+∞ — KONVENKCIONALNI ODNOSI API: GET /api/konvenkcionalni-odnosi/list
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { queryRelations, setKoHeaders } from '@/lib/konvenkcionalni-odnosi';
import type { RelationListFilter } from '@/lib/konvenkcionalni-odnosi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filter: RelationListFilter = {};
    const entityId = searchParams.get('entityId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    if (entityId) filter.entityId = entityId;
    if (type) filter.type = type as RelationListFilter['type'];
    if (status) filter.status = status as RelationListFilter['status'];

    const result = queryRelations(filter);
    const response = apiSuccess(result, 200);
    setKoHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('konvenkcionalni-odnosi/list', error);
  }
}
