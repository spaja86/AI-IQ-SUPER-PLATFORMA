import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { createProfile, listProfiles, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';
import type { SocialAudience, SocialProfile, SocialVisibility } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience') as SocialAudience | null;
    const visibility = searchParams.get('visibility') as SocialVisibility | null;
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
    if (typeof candidate.audience !== 'string') return apiError('BAD_REQUEST', 'audience is required (string)');
    if (typeof candidate.role !== 'string') return apiError('BAD_REQUEST', 'role is required (string)');
    if (typeof candidate.visibility !== 'string') return apiError('BAD_REQUEST', 'visibility is required (string)');
    if (typeof candidate.bio !== 'string') return apiError('BAD_REQUEST', 'bio is required (string)');
    if (candidate.interests !== undefined && !Array.isArray(candidate.interests)) return apiError('BAD_REQUEST', 'interests must be an array when provided');

    const result = createProfile({
      handle: candidate.handle,
      displayName: candidate.displayName,
      audience: candidate.audience as SocialAudience,
      role: candidate.role as SocialProfile['role'],
      visibility: candidate.visibility as SocialVisibility,
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
