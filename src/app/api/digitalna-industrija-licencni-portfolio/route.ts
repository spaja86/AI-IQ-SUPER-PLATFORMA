import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import { buildDigitalnaIndustrijaLicencniPortfolio } from '@/lib/digitalna-industrija-licencni-portfolio';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/digitalna-industrija-licencni-portfolio'),
      120,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const portfolio = buildDigitalnaIndustrijaLicencniPortfolio();

    return apiSuccess({
      status: 'aktivan',
      naziv: portfolio.naziv,
      verzija: APP_VERSION,
      kompanija: portfolio.kompanija,
      jurisdikcija: portfolio.jurisdikcija,
      rezimNabavke: portfolio.rezimNabavke,
      entiteti: portfolio.entiteti,
      stavke: portfolio.stavke,
      summary: portfolio.summary,
      vendorEnterpriseIntegrisan: portfolio.vendorEnterpriseIntegrisan,
      issuerReadiness: portfolio.issuerReadiness,
      timestamp: portfolio.timestamp,
    });
  } catch (error) {
    return apiInternalError('digitalna-industrija-licencni-portfolio', error);
  }
}
