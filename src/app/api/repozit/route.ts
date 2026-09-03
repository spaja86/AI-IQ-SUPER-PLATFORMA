import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  REPOZIT_ALLOWED_CATEGORIES,
  REPOZIT_ALLOWED_STATUSES,
  listRepozitRepositories,
  setRepozitHeaders,
} from '@/lib/repozit';
import type { RepositoryCategory, RepositoryMetadata, RepositoryStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const ALLOWED_SYNC_STATUS: RepositoryMetadata['syncStatus'][] = ['linked', 'local-only', 'concept-only'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('query') ?? undefined;
    const status = searchParams.get('status') as RepositoryStatus | null;
    const category = searchParams.get('category') as RepositoryCategory | null;
    const syncStatus = searchParams.get('syncStatus') as RepositoryMetadata['syncStatus'] | null;
    const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
    const pageSize = Number.parseInt(searchParams.get('pageSize') ?? '20', 10);

    if (status && !REPOZIT_ALLOWED_STATUSES.includes(status)) {
      return apiError('BAD_REQUEST', `status must be one of: ${REPOZIT_ALLOWED_STATUSES.join(', ')}`);
    }
    if (category && !REPOZIT_ALLOWED_CATEGORIES.includes(category)) {
      return apiError('BAD_REQUEST', `category must be one of: ${REPOZIT_ALLOWED_CATEGORIES.join(', ')}`);
    }
    if (syncStatus && !ALLOWED_SYNC_STATUS.includes(syncStatus)) {
      return apiError('BAD_REQUEST', `syncStatus must be one of: ${ALLOWED_SYNC_STATUS.join(', ')}`);
    }

    const result = listRepozitRepositories({
      searchTerm,
      status: status ?? undefined,
      category: category ?? undefined,
      syncStatus: syncStatus ?? undefined,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 20,
    });

    const response = apiSuccess(result, 200);
    setRepozitHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('repozit/list', error);
  }
}
