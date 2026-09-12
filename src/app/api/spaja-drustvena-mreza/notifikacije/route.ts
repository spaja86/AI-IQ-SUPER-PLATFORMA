import type { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import {
  getProfile,
  listNotifications,
  markNotificationRead,
  spajaDrustvenaMrezaApiError,
  spajaDrustvenaMrezaApiInternalError,
  withSpajaDrustvenaMrezaHeaders,
} from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

function getActorProfileId(req: NextRequest): string | null {
  const value = req.headers.get('x-spaja-profile-id');
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET(req: NextRequest) {
  try {
    const actorProfileId = getActorProfileId(req);
    if (!actorProfileId) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'x-spaja-profile-id header is required');
    }
    const actor = getProfile(actorProfileId);
    if (!actor.ok) {
      return spajaDrustvenaMrezaApiError(actor.code ?? 'NOT_FOUND', actor.message);
    }
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get('recipientId');
    if (!recipientId) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'recipientId query param is required');
    }
    if (recipientId !== actorProfileId) {
      return spajaDrustvenaMrezaApiError('CONFLICT', 'recipientId must match x-spaja-profile-id');
    }
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const notifications = listNotifications({ recipientId, unreadOnly });
    return withSpajaDrustvenaMrezaHeaders(apiSuccess({ notifications, count: notifications.length }, 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/notifikacije GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actorProfileId = getActorProfileId(req);
    if (!actorProfileId) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'x-spaja-profile-id header is required');
    }
    const actor = getProfile(actorProfileId);
    if (!actor.ok) {
      return spajaDrustvenaMrezaApiError(actor.code ?? 'NOT_FOUND', actor.message);
    }
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    if (typeof candidate.notificationId !== 'string') return spajaDrustvenaMrezaApiError('BAD_REQUEST', 'notificationId is required (string)');
    if (candidate.recipientId !== undefined && candidate.recipientId !== actorProfileId) {
      return spajaDrustvenaMrezaApiError('CONFLICT', 'recipientId must match x-spaja-profile-id when provided');
    }

    const result = markNotificationRead(candidate.notificationId, actorProfileId);
    if (!result.ok) return spajaDrustvenaMrezaApiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    return withSpajaDrustvenaMrezaHeaders(apiSuccess(result.data, 200));
  } catch (error) {
    return spajaDrustvenaMrezaApiInternalError('spaja-drustvena-mreza/notifikacije POST', error);
  }
}
