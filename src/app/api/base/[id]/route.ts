import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getBasePoolById, setBaseHeaders } from '@/lib/base';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || id.trim().length === 0) {
      return apiError('BAD_REQUEST', 'id is required');
    }

    const pool = getBasePoolById(id);
    if (!pool) {
      return apiError('NOT_FOUND', `BASE pool not found: ${id}`);
    }

    const response = apiSuccess(pool, 200);
    setBaseHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('base/[id]', error);
  }
}
