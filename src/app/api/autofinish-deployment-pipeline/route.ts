// Autofinish #1120 — GET /api/autofinish-deployment-pipeline
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća pregled CI/CD deployment pipeline statusa po servisu.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAutofinishDeploymentPipeline } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/autofinish-deployment-pipeline
 *
 * @returns AutofinishDeploymentPipelineResult — pregled CI/CD pipeline statusa
 */
export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(
    rateLimitKey(ip, '/api/autofinish-deployment-pipeline'),
    60,
    60,
  );
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const pipeline = getAutofinishDeploymentPipeline();

  return NextResponse.json(pipeline, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
