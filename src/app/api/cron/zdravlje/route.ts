import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';

/**
 * Vercel Cron endpoint — Zdravlje sistema
 *
 * Pokreće se svakih 30 minuta.
 * Proverava zdravlje platforme i OMEGA AI sistema.
 *
 * Vercel Cron: GET /api/cron/zdravlje
 */
export async function GET(request: Request) {
  // Vercel Cron šalje Authorization header sa CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  const dijagnostika = runDiagnostics();
  const omegaSummary = getDispatchSummary();

  const kriticno = dijagnostika.kriticnih > 0;
  const upozorenje = dijagnostika.upozorenja > 0;

  return NextResponse.json({
    sistem: 'Omega Zdravlje Monitor',
    verzija: '1.0.0',
    zdravlje: {
      procenat: dijagnostika.zdravlje,
      status: kriticno ? 'kriticno' : upozorenje ? 'upozorenje' : 'zdravo',
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
