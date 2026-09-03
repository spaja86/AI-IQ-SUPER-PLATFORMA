import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getRepozitRepositoryById, setRepozitHeaders } from '@/lib/repozit';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || id.trim().length === 0) {
      return apiError('BAD_REQUEST', 'id is required');
    }

    const repository = getRepozitRepositoryById(id);
    if (!repository) {
      return apiError('NOT_FOUND', `Repository not found: ${id}`);
    }

    const response = apiSuccess(repository, 200);
    setRepozitHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('repozit/[id]', error);
  }
}
