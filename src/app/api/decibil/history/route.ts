// SpajaUltraOmegaCore -∞Ω+∞ — DECIBIL API: /api/decibil/history
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/decibil/history — vraća istoriju merenja i health report

import type { NextRequest } from 'next/server';
import { apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  getDecibelHistory,
  getDecibelHealthReport,
  DECIBIL_CONTRACT_VERSION,
  DECIBIL_MODULE_VERSION,
} from '@/lib/decibil';

export const dynamic = 'force-dynamic';

function setDecibilHeaders(res: Response): void {
  res.headers.set('X-Decibil-Contract-Version', DECIBIL_CONTRACT_VERSION);
  res.headers.set('X-Decibil-Module-Version', DECIBIL_MODULE_VERSION);
}

/**
 * GET /api/decibil/history
 *
 * Vraća time-series istoriju merenja i health report.
 *
 * Query params:
 *   limit (number, optional) — max broj merenja (default: sva)
 */
export async function GET(req: NextRequest) {
  try {
    const limitParam = req.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const history = getDecibelHistory(limit && !isNaN(limit) ? limit : undefined);
    const healthReport = getDecibelHealthReport();

    const response = apiSuccess(
      {
        history,
        healthReport,
        contractVersion: DECIBIL_CONTRACT_VERSION,
      },
      200,
    );
    setDecibilHeaders(response);
    return response;
  } catch (err) {
    return apiInternalError(err);
  }
}
