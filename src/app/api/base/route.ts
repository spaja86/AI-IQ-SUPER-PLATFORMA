import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { BASE_ALLOWED_STATUSES, listBasePools, setBaseHeaders } from '@/lib/base';
import type { BasePoolStatus } from '@/lib/base';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as BasePoolStatus | null;
    const minPrizePoolEur = Number.parseFloat(searchParams.get('minPrizePoolEur') ?? '');
    const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
    const pageSize = Number.parseInt(searchParams.get('pageSize') ?? '20', 10);

    if (status && !BASE_ALLOWED_STATUSES.includes(status)) {
      return apiError('BAD_REQUEST', `status must be one of: ${BASE_ALLOWED_STATUSES.join(', ')}`);
    }
    if (searchParams.has('minPrizePoolEur') && !Number.isFinite(minPrizePoolEur)) {
      return apiError('BAD_REQUEST', 'minPrizePoolEur must be a finite number');
    }

    const result = listBasePools({
      status: status ?? undefined,
      minPrizePoolEur: Number.isFinite(minPrizePoolEur) ? minPrizePoolEur : undefined,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 20,
    });

    const response = apiSuccess(result, 200);
    setBaseHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('base/list', error);
  }
}
