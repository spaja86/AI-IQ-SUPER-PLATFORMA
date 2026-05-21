import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { saveHealthSnapshot } from '@/lib/evolucija';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';

/**
 * Cron endpoint — Zdravlje sistema
 *
 * Pokreće se svakih 30 minuta putem eksternog scheduler-a.
 * Proverava zdravlje platforme i OMEGA AI sistema.
 * Snima health snapshot u Supabase za trend analizu.
 *
 * GET /api/cron/zdravlje
 */
export async function GET(request: Request) {
  // Provider-neutral cron autentifikacija:
  // - Authorization: Bearer <CRON_SECRET>
  // - x-cron-secret: <CRON_SECRET>
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  const dijagnostika = runDiagnostics();
  const omegaSummary = getDispatchSummary();

  const kriticno = dijagnostika.kriticnih > 0;
  const upozorenje = dijagnostika.upozorenja > 0;
  const statusStr: 'kriticno' | 'upozorenje' | 'zdravo' = kriticno
    ? 'kriticno'
    : upozorenje
    ? 'upozorenje'
    : 'zdravo';

  // Snimi health snapshot u Supabase (non-blocking)
  void saveHealthSnapshot({
    zdravlje: dijagnostika.zdravlje,
    status: statusStr,
    ukupnoProvera: dijagnostika.ukupnoProvera,
    uspesnih: dijagnostika.uspesnih,
    upozorenja: dijagnostika.upozorenja,
    gresaka: dijagnostika.gresaka,
    kriticnih: dijagnostika.kriticnih,
  });

  return NextResponse.json({
    sistem: 'Omega Zdravlje Monitor',
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
    timestamp: new Date().toISOString(),
  });
}
