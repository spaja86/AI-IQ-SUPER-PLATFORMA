// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ PROGRAMSKI JEZIK API: /api/ai-iq-programski-jezik/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getAiiqLanguageHealthReport, setAiiqLanguageHeaders } from '@/lib/ai-iq-programski-jezik';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getAiiqLanguageHealthReport();
    const response = apiSuccess(report, 200);
    setAiiqLanguageHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('ai-iq-programski-jezik/health', error);
  }
}
