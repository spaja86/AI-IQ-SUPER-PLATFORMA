import { NextResponse } from 'next/server';
import { deployRegistry } from '@/lib/deploy/deploy-registry';
import { fetchAllPlatformStatuses } from '@/lib/deploy/deploy-status';
import { APP_VERSION } from '@/lib/constants';

export const dynamic = 'force-dynamic';

/**
 * GET /api/deploy-platforma/status
 *
 * Vraća live deploy status svih registrovanih platformi.
 * Dohvata podatke sa Vercel API-ja u paralelu.
 */
export async function GET() {
  const statuses = await fetchAllPlatformStatuses(deployRegistry);

  const aktivan = statuses.filter((s) => s.state === 'READY').length;
  const grade = statuses.filter((s) => s.state === 'BUILDING' || s.state === 'QUEUED' || s.state === 'INITIALIZING').length;
  const greska = statuses.filter((s) => s.state === 'ERROR').length;

  return NextResponse.json(
    {
      status: 'ok',
      verzija: APP_VERSION,
      platforme: {
        ukupno: statuses.length,
        aktivan,
        grade,
        greska,
        nepoznato: statuses.length - aktivan - grade - greska,
      },
      lista: statuses,
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
