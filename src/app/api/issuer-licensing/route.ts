import { type NextRequest } from 'next/server';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requireIssuerIdentity } from '@/lib/issuer-licensing-auth';
import {
  buildIssuerLicensingState,
  createIssuerAuthorityRequest,
  type CreateIssuerAuthorityInput,
} from '@/lib/issuer-licensing';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireIssuerIdentity(request, ΩClearanceLevel.USER);
    if (!auth.ok) return auth.response;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/issuer-licensing'), 120, 60);
    if (!allowed) return apiRateLimited(60);

    const state = buildIssuerLicensingState();

    return apiSuccess({
      status: 'aktivan',
      sistem: state.naziv,
      role: auth.identity.role,
      summary: state.summary,
      blockers: state.blockers,
      pendingApproval: state.pendingApproval,
      authorities: state.authorities,
      issued: state.issued,
      roleMatrica: state.roleMatrica,
      audit: state.audit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return apiInternalError('issuer-licensing-get', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireIssuerIdentity(request, ΩClearanceLevel.OPERATOR);
    if (!auth.ok) return auth.response;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/issuer-licensing'), 30, 60);
    if (!allowed) return apiRateLimited(60);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('BAD_REQUEST', 'Neispravan JSON payload.');
    }

    const payload = (body ?? {}) as Partial<CreateIssuerAuthorityInput>;
    const result = createIssuerAuthorityRequest(
      {
        naziv: payload.naziv ?? '',
        issuerEntitet: payload.issuerEntitet ?? '',
        kategorija: payload.kategorija ?? 'softver',
        pravniOsnov: payload.pravniOsnov ?? '',
        regulatorIliVendor: payload.regulatorIliVendor ?? '',
        vaziOd: payload.vaziOd ?? null,
        vaziDo: payload.vaziDo ?? null,
        kvotaUkupno: payload.kvotaUkupno ?? null,
        sublicenciranjeDozvoljeno: payload.sublicenciranjeDozvoljeno ?? false,
        maxDelegiranihIzdavalaca: payload.maxDelegiranihIzdavalaca ?? 0,
        ogranicenja: payload.ogranicenja ?? [],
        zavisnostiNabavke: payload.zavisnostiNabavke ?? [],
        checklistaPreIzdavanja: payload.checklistaPreIzdavanja ?? [],
      },
      { role: auth.identity.role, id: auth.identity.id },
    );

    if (!result.ok) {
      return apiError('UNPROCESSABLE_ENTITY', result.error);
    }

    return apiSuccess(
      {
        status: 'kreirano',
        authority: result.authority,
        poruka: 'Issuer ovlašćenje je kreirano.',
      },
      201,
    );
  } catch (error) {
    return apiInternalError('issuer-licensing-post', error);
  }
}
