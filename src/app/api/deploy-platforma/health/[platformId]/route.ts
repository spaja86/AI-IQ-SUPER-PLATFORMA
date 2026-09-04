import { NextRequest, NextResponse } from 'next/server';
import { getDeployPlatformById } from '@/lib/deploy/deploy-registry';
import { APP_VERSION } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ platformId: string }>;
}

/**
 * GET /api/deploy-platforma/health/[platformId]
 *
 * Pokreće HTTP health check prema konfiguriranom health URL-u platforme.
 * Vraća HTTP status i vreme odgovora.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { platformId } = await params;
  const checkedAt = new Date().toISOString();

  const platform = getDeployPlatformById(platformId);
  if (!platform) {
    return NextResponse.json(
      { error: `Platforma '${platformId}' nije pronađena u registru` },
      { status: 404 },
    );
  }

  if (!platform.healthUrl) {
    return NextResponse.json(
      {
        platformId,
        naziv: platform.naziv,
        healthy: null,
        message: 'Health URL nije konfigurisan za ovu platformu',
        checkedAt,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-App-Version': APP_VERSION,
        },
      },
    );
  }

  const start = Date.now();
  try {
    const res = await fetch(platform.healthUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    const responseTimeMs = Date.now() - start;
    const healthy = res.status >= 200 && res.status < 400;

    return NextResponse.json(
      {
        platformId,
        naziv: platform.naziv,
        healthy,
        httpStatus: res.status,
        responseTimeMs,
        healthUrl: platform.healthUrl,
        message: healthy
          ? `Health check OK (HTTP ${res.status}, ${responseTimeMs}ms)`
          : `Health check neuspešan (HTTP ${res.status})`,
        checkedAt,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-App-Version': APP_VERSION,
        },
      },
    );
  } catch (error) {
    const responseTimeMs = Date.now() - start;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        platformId,
        naziv: platform.naziv,
        healthy: false,
        httpStatus: null,
        responseTimeMs,
        healthUrl: platform.healthUrl,
        message: `Health check greška: ${msg}`,
        checkedAt,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-App-Version': APP_VERSION,
        },
      },
    );
  }
}
