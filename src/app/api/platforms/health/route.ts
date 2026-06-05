import type { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api/response';
import { enforceGatewayMiddleware } from '@/lib/platform-gateway/middleware';
import { getPlatformGatewaySnapshot } from '@/lib/platform-gateway/router';

export async function GET(request: NextRequest) {
  const security = await enforceGatewayMiddleware(request, 'world-bank', 'platforms:health');
  if (!security.ok) return security.response;

  return apiSuccess({
    status: 'healthy',
    rateLimits: {
      perPlatformPerSecond: 10,
      globalPerSecond: 100,
    },
    platforms: {
      'io-openui-ao': 'operational',
      'menja-nica': 'operational',
      'world-bank': 'operational',
    },
    gatewaySnapshot: getPlatformGatewaySnapshot(),
    security: {
      auth: '******',
      scopesEnabled: true,
    },
  });
}
