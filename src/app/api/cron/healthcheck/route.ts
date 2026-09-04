import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { saveHealthSnapshot } from '@/lib/evolucija';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';
import { protokolManager } from '@/lib/protokoli/manager';

const INCIDENT_THRESHOLD = 0.5;

/**
 * Cron endpoint — Unified Healthcheck
 *
 * Combines zdravlje (system diagnostics) and protokoli-verifikacija (protocol checks)
 * into a single endpoint running every 15 minutes.
 *
 * GET /api/cron/healthcheck
 */
export async function GET(request: Request) {
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  // ── System diagnostics (from zdravlje) ───────────────────────────────────
  const dijagnostika = runDiagnostics();
  const omegaSummary = getDispatchSummary();

  const kriticno = dijagnostika.kriticnih > 0;
  const upozorenje = dijagnostika.upozorenja > 0;
  const statusStr: 'kriticno' | 'upozorenje' | 'zdravo' = kriticno
    ? 'kriticno'
    : upozorenje
    ? 'upozorenje'
    : 'zdravo';

  void saveHealthSnapshot({
    zdravlje: dijagnostika.zdravlje,
    status: statusStr,
    ukupnoProvera: dijagnostika.ukupnoProvera,
    uspesnih: dijagnostika.uspesnih,
    upozorenja: dijagnostika.upozorenja,
    gresaka: dijagnostika.gresaka,
    kriticnih: dijagnostika.kriticnih,
  });

  // ── Protocol verification (from protokoli-verifikacija) ──────────────────
  const protokolResults = await protokolManager.verifikujSveAktivne();
  const neuspesni = protokolResults.filter((result) => !result.uspesno);
  const failRatio = protokolResults.length === 0 ? 0 : neuspesni.length / protokolResults.length;

  let incidentUpdated = 0;
  if (failRatio > INCIDENT_THRESHOLD) {
    for (const result of neuspesni) {
      await protokolManager.updateStatus(result.protokolId, 'incident', {
        reqId: `cron-healthcheck-${Date.now()}`,
        reason: 'cron-failure-ratio',
      });
      incidentUpdated++;
    }
  }

  return NextResponse.json({
    sistem: 'Omega Healthcheck',
    verzija: APP_VERSION,
    zdravlje: {
      procenat: dijagnostika.zdravlje,
      status: statusStr,
      provera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
      upozorenja: dijagnostika.upozorenja,
      gresaka: dijagnostika.gresaka,
      kriticnih: dijagnostika.kriticnih,
    },
    omegaAI: {
      ukupnoPersona: omegaSummary.ukupnoPersona,
      ukupnoOktava: omegaSummary.ukupnoOktava,
      status: omegaSummary.status,
      matricnoJezgro: omegaSummary.matricnoJezgro.status,
      neuroloskaMreza: omegaSummary.neuroloskaMreza.status,
    },
    protokoli: {
      ukupno: protokolResults.length,
      neuspesni: neuspesni.length,
      failRatio,
      incidentUpdated,
    },
    timestamp: new Date().toISOString(),
  });
}
