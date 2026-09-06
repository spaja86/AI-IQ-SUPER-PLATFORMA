// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ API: /api/extrimli-cuz/feed/[id]
// Kompanija SPAJA — Digitalna Industrija

import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getPost, CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION } from '@/lib/extrimli-cuz';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-ExtrimliCuz-Contract-Version', CUZ_CONTRACT_VERSION);
  res.headers.set('X-ExtrimliCuz-Module-Version', CUZ_MODULE_VERSION);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = getPost(id);
    if (!post) {
      return apiError('NOT_FOUND', `post not found: ${id}`, 404);
    }
    const response = apiSuccess(post, 200);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli-cuz/feed/[id] GET', error);
  }
}
