import { NextResponse } from 'next/server';
import { deployRegistry, getPlatformsWithHealthCheck } from '@/lib/deploy/deploy-registry';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';

export const dynamic = 'force-dynamic';

/**
 * Cron endpoint — Deploy Health Poller
 *
 * Svakih 15 minuta proverava HTTP health endpoint svih platformi
 * iz deployRegistry koje imaju konfigurisan healthUrl.
 *
 * GET /api/cron/deploy-health
 */
export async function GET(request: Request) {
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  const platforms = getPlatformsWithHealthCheck();
  const checkedAt = new Date().toISOString();

  const results = await Promise.allSettled(
    platforms.map(async (platform) => {
      const start = Date.now();
      try {
        const res = await fetch(platform.healthUrl!, {
          method: 'GET',
          cache: 'no-store',
          signal: AbortSignal.timeout(10_000),
        });
        const responseTimeMs = Date.now() - start;
        return {
          platformId: platform.id,
          naziv: platform.naziv,
          healthy: res.status >= 200 && res.status < 400,
          httpStatus: res.status,
          responseTimeMs,
        };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return {
          platformId: platform.id,
          naziv: platform.naziv,
          healthy: false,
          httpStatus: null,
          responseTimeMs: Date.now() - start,
          error: msg,
        };
      }
    }),
  );

  const platformResults = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : {
          platformId: platforms[i].id,
          naziv: platforms[i].naziv,
          healthy: false,
          httpStatus: null,
          responseTimeMs: null,
          error: r.reason instanceof Error ? r.reason.message : String(r.reason),
        },
  );

  const healthy = platformResults.filter((r) => r.healthy).length;
  const unhealthy = platformResults.filter((r) => !r.healthy).length;

  return NextResponse.json(
    {
      sistem: 'Deploy Health Poller',
      verzija: APP_VERSION,
      ukupno: deployRegistry.length,
      provereno: platforms.length,
      zdravo: healthy,
      neispravno: unhealthy,
      platforme: platformResults,
      checkedAt,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-App-Version': APP_VERSION,
      },
    },
  );
}
