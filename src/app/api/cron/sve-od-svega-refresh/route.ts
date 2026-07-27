// SVE OD SVEGA — Cron Refresh
// Kompanija SPAJA — Digitalna Industrija
//
// Periodicni refresh SVE OD SVEGA snapshots.
// GET /api/cron/sve-od-svega-refresh
//
// Autorizacija: ****** ili x-cron-secret header (CRON_SECRET env var).

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';
import { buildSveOdSvega } from '@/lib/sve-od-svega';
import { appendSveOdSvegaSnapshot, setCachedSveOdSvega } from '@/lib/sve-od-svega-store';
import { dispatchSveOdSvegaAlert } from '@/lib/sve-od-svega-alert';

/**
 * GET /api/cron/sve-od-svega-refresh
 *
 * Gradi SVE OD SVEGA, kesi rezultat, dodaje snapshot u historijat
 * i opciono salje alert webhook ako su uslovi ispunjeni.
 */
export async function GET(request: Request) {
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  try {
    const rezultat = await buildSveOdSvega();

    const [history, alert] = await Promise.all([
      appendSveOdSvegaSnapshot(rezultat),
      dispatchSveOdSvegaAlert(rezultat),
      setCachedSveOdSvega(rezultat),
    ]);

    return NextResponse.json({
      sistem: 'SVE OD SVEGA Cron Refresh',
      verzija: APP_VERSION,
      ukupanScore: rezultat.ukupanScore,
      konacnaOcena: rezultat.konacnaOcena,
      kriticniDomeniCount: rezultat.kriticniDomeni.length,
      degraded: rezultat.meta.degraded,
      historyLength: history.length,
      alert: {
        sent: alert.sent,
        reason: alert.reason,
        nivo: alert.nivo ?? null,
      },
      generatedAt: rezultat.meta.generatedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/sve-od-svega-refresh] Kritična greška', error);
    return NextResponse.json(
      {
        error: 'Interna greška pri SVE OD SVEGA refresh-u',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
