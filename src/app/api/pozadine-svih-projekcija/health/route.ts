// SpajaUltraOmegaCore -∞Ω+∞ — POZADINE SVIH PROJEKCIJA API: /api/pozadine-svih-projekcija/health
// Kompanija SPAJA — Digitalna Industrija

import { apiInternalError, apiSuccess } from '@/lib/api/response';
import { getPozadineSvihProjekcijaHealthReport, setPozadineSvihProjekcijaHeaders } from '@/lib/pozadine-svih-projekcija';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = getPozadineSvihProjekcijaHealthReport();
    const response = apiSuccess(report, 200);
    setPozadineSvihProjekcijaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('pozadine-svih-projekcija/health', error);
  }
}
