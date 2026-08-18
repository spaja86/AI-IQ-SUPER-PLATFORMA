// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: GET /api/chatgpt-katalog/[id]
// Kompanija SPAJA — Digitalna Industrija

import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getEntryById, setKatalogHeaders } from '@/lib/chatgpt-katalog';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return apiError('BAD_REQUEST', 'id is required');
    }

    const entry = getEntryById(id.trim());
    if (!entry) {
      return apiError('NOT_FOUND', `Entry not found: ${id}`);
    }

    const response = apiSuccess(entry, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/[id]', error);
  }
}
