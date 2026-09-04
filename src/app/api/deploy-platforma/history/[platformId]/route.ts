import { NextRequest, NextResponse } from 'next/server';
import { getDeployHistory } from '@/lib/deploy/deploy-history';
import { getDeployPlatformById } from '@/lib/deploy/deploy-registry';
import { APP_VERSION } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ platformId: string }>;
}

/**
 * GET /api/deploy-platforma/history/[platformId]
 *
 * Vraća istoriju deploymenta za datu platformu (do 20 najnovijih).
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { platformId } = await params;

  const platform = getDeployPlatformById(platformId);
  if (!platform) {
    return NextResponse.json(
      { error: `Platforma '${platformId}' nije pronađena u registru` },
      { status: 404 },
    );
  }

  const history = getDeployHistory(platformId);

  return NextResponse.json(
    {
      platformId,
      naziv: platform.naziv,
      ukupno: history.length,
      stavke: history,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-App-Version': APP_VERSION,
      },
    },
  );
}
