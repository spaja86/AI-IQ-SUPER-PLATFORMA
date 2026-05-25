import { type NextRequest } from 'next/server';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requireIssuerIdentity } from '@/lib/issuer-licensing-auth';
import {
  transitionIssuerAuthorityStatus,
  type IssuerLicensingStatus,
} from '@/lib/issuer-licensing';

type RouteContext = { params: Promise<{ authorityId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireIssuerIdentity(request, ΩClearanceLevel.OPERATOR);
    if (!auth.ok) return auth.response;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/issuer-licensing/[authorityId]/status'), 60, 60);
    if (!allowed) return apiRateLimited(60);

    const { authorityId } = await context.params;
    if (!authorityId) return apiError('BAD_REQUEST', 'authorityId je obavezan.');

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('BAD_REQUEST', 'Neispravan JSON payload.');
    }
    const payload = (body ?? {}) as { noviStatus?: IssuerLicensingStatus; razlog?: string };
    if (!payload.noviStatus) return apiError('BAD_REQUEST', 'Polje noviStatus je obavezno.');

    const result = transitionIssuerAuthorityStatus(
      {
        authorityId,
        noviStatus: payload.noviStatus,
        razlog: payload.razlog,
      },
      { role: auth.identity.role, id: auth.identity.id },
    );

    if (!result.ok) {
      const lowered = result.error.toLowerCase();
      if (lowered.includes('nije pronađeno')) return apiError('NOT_FOUND', result.error);
      if (lowered.includes('prava')) return apiError('FORBIDDEN', result.error);
      return apiError('UNPROCESSABLE_ENTITY', result.error);
    }

    return apiSuccess({
      status: 'azurirano',
      authority: result.authority,
      poruka: 'Status issuer ovlašćenja je ažuriran.',
    });
  } catch (error) {
    return apiInternalError('issuer-licensing-status-patch', error);
  }
}
