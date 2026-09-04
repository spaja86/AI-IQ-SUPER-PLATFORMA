// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI API: /api/extrimli/performance/[id]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getPerformanceReport, EXTRIMLI_CONTRACT_VERSION, EXTRIMLI_MODULE_VERSION } from '@/lib/extrimli';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-Extrimli-Contract-Version', EXTRIMLI_CONTRACT_VERSION);
  res.headers.set('X-Extrimli-Module-Version', EXTRIMLI_MODULE_VERSION);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return apiError('BAD_REQUEST', 'athleteId param is required', 400);

    const report = getPerformanceReport(id);
    const response = apiSuccess(report, report.valid ? 200 : 422);
    setHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('extrimli/performance/[id]', error);
  }
}
