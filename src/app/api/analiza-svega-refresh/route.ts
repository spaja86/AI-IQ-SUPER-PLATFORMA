import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';
import { buildAnalizaSvega } from '@/lib/analiza-svega';
import { dispatchAnalizaSvegaAlert } from '@/lib/analiza-svega-alert';
import { setCachedAnalizaSvega } from '@/lib/analiza-svega-store';
import { ANALIZA_SVEGA_CACHE_TTL_SECONDS } from '@/app/api/analiza-svega/route';

/**
 * Cron endpoint za periodično osvežavanje /api/analiza-svega cache-a.
 * GET /api/analiza-svega-refresh
 */
export async function GET(request: Request) {
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  try {
    const analiza = await buildAnalizaSvega();
    await setCachedAnalizaSvega(analiza, ANALIZA_SVEGA_CACHE_TTL_SECONDS);
    const alert = await dispatchAnalizaSvegaAlert(analiza);

    return NextResponse.json({
      sistem: 'Analiza Svega Refresh Cron',
      verzija: APP_VERSION,
      score: analiza.ukupanScore,
      konacnaOcena: analiza.konacnaOcena,
      kriticniDomeni: analiza.kriticniDomeni.length,
      cacheTtlSeconds: ANALIZA_SVEGA_CACHE_TTL_SECONDS,
      alert,
      generatedAt: analiza.meta.generatedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[analiza-svega-refresh] failure', error);
    return NextResponse.json(
      {
        error: 'Analiza refresh nije uspeo',
        code: 'ANALIZA_REFRESH_FAILED',
      },
      { status: 500 },
    );
  }
}
