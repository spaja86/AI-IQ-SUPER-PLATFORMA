import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getStatistike } from '@/lib/statistika';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const dijagnostika = runDiagnostics();
  const stats = getStatistike();

  const status =
    dijagnostika.zdravlje >= 90
      ? 'healthy'
      : dijagnostika.zdravlje >= 70
        ? 'degraded'
        : 'unhealthy';

  return NextResponse.json({
    status,
    zdravlje: dijagnostika.zdravlje,
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,
    ukupnoProvera: dijagnostika.ukupnoProvera,
    uspesnih: dijagnostika.uspesnih,
    upozorenja: dijagnostika.upozorenja,
    gresaka: dijagnostika.gresaka,
    kriticnih: dijagnostika.kriticnih,
    ekosistem: {
      platforme: stats.ukupnoPlatformi,
      proizvodi: stats.ukupnoProizvoda,
      igrice: stats.ukupnoIgrica,
      omegaAI: stats.ukupnoOmegaPersona,
      promptovi: stats.ukupnoPromptova,
      stranice: stats.ukupnoStranica,
    },
    timestamp: new Date().toISOString(),
  });
}
