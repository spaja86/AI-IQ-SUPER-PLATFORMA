import { type NextRequest } from 'next/server';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { apiError, apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { requireIssuerIdentity } from '@/lib/issuer-licensing-auth';
import { issueLicenseFromAuthority, type IssueLicenseInput } from '@/lib/issuer-licensing';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireIssuerIdentity(request, ΩClearanceLevel.ADMIN);
    if (!auth.ok) return auth.response;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/issuer-licensing/issue'), 40, 60);
    if (!allowed) return apiRateLimited(60);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('BAD_REQUEST', 'Neispravan JSON payload.');
    }

    const payload = (body ?? {}) as Partial<IssueLicenseInput>;
    const result = issueLicenseFromAuthority(
      {
        authorityId: payload.authorityId ?? '',
        primalacNaziv: payload.primalacNaziv ?? '',
        primalacEmail: payload.primalacEmail ?? '',
        izdavanjeTip: payload.izdavanjeTip ?? 'direktna',
        validTo: payload.validTo ?? null,
        checklistKeys: payload.checklistKeys ?? [],
      },
      { role: auth.identity.role, id: auth.identity.id },
    );

    if (!result.ok) {
      const lowered = result.error.toLowerCase();
      if (lowered.includes('nije pronađeno')) return apiError('NOT_FOUND', result.error);
      if (lowered.includes('prava')) return apiError('FORBIDDEN', result.error);
      if (lowered.includes('kvota')) return apiError('CONFLICT', result.error);
      return apiError('UNPROCESSABLE_ENTITY', result.error);
    }

    return apiSuccess(
      {
        status: 'izdato',
        licenca: result.issued,
        poruka: 'Krajnja licenca je uspešno izdata.',
      },
      201,
    );
  } catch (error) {
    return apiInternalError('issuer-licensing-issue-post', error);
  }
}
