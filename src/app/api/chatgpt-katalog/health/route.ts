// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG API: GET /api/chatgpt-katalog/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getKatalogHealth, setKatalogHeaders } from '@/lib/chatgpt-katalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getKatalogHealth();
    const response = apiSuccess(report, 200);
    setKatalogHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('chatgpt-katalog/health', error);
  }
}
