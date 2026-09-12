import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { listNotifications, markNotificationRead, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get('recipientId') ?? undefined;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const notifications = listNotifications({ recipientId, unreadOnly });
    const response = apiSuccess({ notifications, count: notifications.length }, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/notifikacije GET', error);
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
    if (typeof candidate.notificationId !== 'string') return apiError('BAD_REQUEST', 'notificationId is required (string)');
    if (typeof candidate.recipientId !== 'string') return apiError('BAD_REQUEST', 'recipientId is required (string)');

    const result = markNotificationRead(candidate.notificationId, candidate.recipientId);
    if (!result.ok) return apiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    const response = apiSuccess(result.data, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/notifikacije POST', error);
  }
}
