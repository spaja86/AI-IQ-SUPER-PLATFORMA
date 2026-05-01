import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { saveHealthSnapshot } from '@/lib/evolucija';
import { APP_VERSION } from '@/lib/constants';

/**
 * Cron endpoint — Zdravlje sistema
 *
 * Pokreće se svakih 30 minuta putem Cloudflare Scheduled Worker.
 * Proverava zdravlje platforme i OMEGA AI sistema.
 * Snima health snapshot u Supabase za trend analizu.
 *
 * GET /api/cron/zdravlje
 */
export async function GET(request: Request) {
  // Proveravamo CRON_SECRET (Cloudflare Worker šalje Bearer token)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
