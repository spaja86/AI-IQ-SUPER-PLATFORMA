import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import {
  createProfile,
  isSocialAudience,
  isSocialProfileRole,
  isSocialVisibility,
  listProfiles,
  setSpajaDrustvenaMrezaHeaders,
} from '@/lib/spaja-drustvena-mreza';
import type { SocialProfile } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience');
    const visibility = searchParams.get('visibility');
    if (audience !== null && !isSocialAudience(audience)) {
      return apiError('BAD_REQUEST', 'audience must be one of: internal, partner, public');
    }
    if (visibility !== null && !isSocialVisibility(visibility)) {
      return apiError('BAD_REQUEST', 'visibility must be one of: internal, network, public');
    }
    const profiles = listProfiles({
      audience: audience ?? undefined,
      visibility: visibility ?? undefined,
    });
    const response = apiSuccess({ profiles, count: profiles.length }, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/profiles GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    if (typeof candidate.handle !== 'string') return apiError('BAD_REQUEST', 'handle is required (string)');
    if (typeof candidate.displayName !== 'string') return apiError('BAD_REQUEST', 'displayName is required (string)');
    if (!isSocialAudience(candidate.audience)) return apiError('BAD_REQUEST', 'audience must be one of: internal, partner, public');
    if (!isSocialProfileRole(candidate.role)) return apiError('BAD_REQUEST', 'role must be one of: employee, partner-admin, customer, moderator');
    if (!isSocialVisibility(candidate.visibility)) return apiError('BAD_REQUEST', 'visibility must be one of: internal, network, public');
    if (typeof candidate.bio !== 'string') return apiError('BAD_REQUEST', 'bio is required (string)');
    if (candidate.interests !== undefined && !Array.isArray(candidate.interests)) return apiError('BAD_REQUEST', 'interests must be an array when provided');

    const result = createProfile({
      handle: candidate.handle,
      displayName: candidate.displayName,
      audience: candidate.audience,
      role: candidate.role as SocialProfile['role'],
      visibility: candidate.visibility,
      bio: candidate.bio,
      interests: candidate.interests as string[] | undefined,
      verified: typeof candidate.verified === 'boolean' ? candidate.verified : undefined,
    });

    if (!result.ok) {
      return apiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);
    }

    const response = apiSuccess(result.data, 201);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/profiles POST', error);
  }
}
