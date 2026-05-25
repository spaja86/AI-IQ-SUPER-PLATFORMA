import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import { getLicencniPortfolioVendorStatus } from '@/lib/digitalna-industrija-licencni-portfolio';
import { getEnterpriseZahtevi } from '@/lib/kompanija-spaja-operativa';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-licencni-vendor-status'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const vendorStatus = getLicencniPortfolioVendorStatus();
    const enterpriseZahtevi = getEnterpriseZahtevi();

    const uskladeno = vendorStatus.filter((v) => v.uskladen).length;
    const neuskladeno = vendorStatus.filter((v) => !v.uskladen).length;

    return apiSuccess({
      status: 'aktivan',
      naziv: 'Vendor Enterprise Integrisani Status — Digitalna Industrija',
      verzija: APP_VERSION,
      summary: {
        ukupnoVendora: vendorStatus.length,
        uskladeno,
        neuskladeno,
        procenatUskladenosti: vendorStatus.length === 0 ? 0 : Math.round((uskladeno / vendorStatus.length) * 100),
      },
      vendorStatus,
      enterpriseZahtevi: enterpriseZahtevi.map((z) => ({
        id: z.id,
        provajder: z.provajder,
        status: z.status,
        kanal: z.kanalPodnosenja.url,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-licencni-vendor-status', error);
  }
}
