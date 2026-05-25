import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';
import { buildEkstremnoProcesuiranjeSvega } from '@/lib/procesuiranje-svega';

/**
 * Cron endpoint — Ekstremno procesuiranje snapshot
 *
 * Pokreće periodičnu re-evaluaciju scheduler/queue signala.
 * GET /api/cron/ekstremno-procesuiranje-svega
 */
export async function GET(request: Request) {
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  const rezultat = buildEkstremnoProcesuiranjeSvega();

  return NextResponse.json({
    sistem: 'Ekstremno Procesuiranje Svega Cron',
    verzija: APP_VERSION,
    score: rezultat.ukupanProcenat,
    scheduler: {
      queueDepth: rezultat.scheduler.queueDepth,
      saturacijaPct: rezultat.scheduler.saturacijaPct,
      fairnessIndex: rezultat.scheduler.fairnessIndex,
      starvationRizik: rezultat.scheduler.starvationRizik,
      emergencyOverride: rezultat.scheduler.emergencyOverride,
    },
    throughputPerMin: rezultat.score.throughputPerMin,
    latencyMsP95: rezultat.score.latencyMsP95,
    errorRatePct: rezultat.score.errorRatePct,
    degraded: rezultat.meta.degraded,
    generatedAt: rezultat.meta.generatedAt,
    timestamp: new Date().toISOString(),
  });
}
