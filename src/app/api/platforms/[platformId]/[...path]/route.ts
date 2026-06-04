import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PlatformIdSchema } from '@/lib/api-contracts/platforms';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { enforceGatewayMiddleware } from '@/lib/platform-gateway/middleware';
import { routePlatformRequest } from '@/lib/platform-gateway/router';

type RouteContext = { params: Promise<{ platformId: string; path: string[] }> };

function requiredScopeFor(platformId: string, method: 'GET' | 'POST'): string {
  const access = method === 'GET' ? 'read' : 'write';
  return `${platformId}:${access}`;
}

async function handle(request: NextRequest, context: RouteContext, method: 'GET' | 'POST') {
  try {
    const { platformId, path } = await context.params;
    const parsedPlatformId = PlatformIdSchema.safeParse(platformId);
    if (!parsedPlatformId.success) {
      return apiError('BAD_REQUEST', `Nepodržan platformId '${platformId}'.`);
    }

    const middleware = await enforceGatewayMiddleware(
      request,
      parsedPlatformId.data,
      requiredScopeFor(parsedPlatformId.data, method),
    );

    if (!middleware.ok) return middleware.response;

    let body: unknown = {};
    if (method === 'POST') {
      try {
        body = await request.json();
      } catch {
        return apiError('BAD_REQUEST', 'Nevalidan JSON body.');
      }
    }

    const result = routePlatformRequest({
      platformId: parsedPlatformId.data,
      path,
      method,
      body,
      userId: middleware.context.userId,
    });

    if (result.status >= 400) {
      return NextResponse.json(
        {
          error: String(result.payload.error ?? 'Gateway greška.'),
          code: result.status === 404 ? 'NOT_FOUND' : 'BAD_REQUEST',
          details: result.payload,
        },
        { status: result.status },
      );
    }

    return apiSuccess(
      {
        platformId: parsedPlatformId.data,
        path,
        ...result.payload,
      },
      result.status,
    );
  } catch (error) {
    return apiInternalError('platform-gateway-router', error);
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context, 'GET');
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context, 'POST');
}
