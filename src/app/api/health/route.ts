// Autofinish #838 — Poboljšani Health-Check Endpoint
// Liveness: brza provjera da server živi (/api/health?check=liveness)
// Readiness: puna provjera da je servis spreman za saobraćaj (/api/health?check=readiness)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getStatistike } from '@/lib/statistika';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

// Bilježi vreme starta procesa za uptime izračun
const PROCESS_START_MS = Date.now();

function uptimeSeconds(): number {
  return Math.floor((Date.now() - PROCESS_START_MS) / 1000);
}

function memoryMB(): number {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  }
  return 0;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const check = searchParams.get('check') ?? 'readiness';

  // Liveness: samo provjeri da server radi
  if (check === 'liveness') {
    return NextResponse.json(
      {
        status: 'alive',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        uptime: uptimeSeconds(),
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Readiness: puna provjera
  const dijagnostika = runDiagnostics();
  const stats = getStatistike();

  const status =
    dijagnostika.zdravlje >= 90
      ? 'healthy'
      : dijagnostika.zdravlje >= 70
        ? 'degraded'
        : 'unhealthy';

  const httpStatus = status === 'unhealthy' ? 503 : 200;

  const response = NextResponse.json(
    {
      status,
      check,
      zdravlje: dijagnostika.zdravlje,
      platforma: 'AI IQ SUPER PLATFORMA',
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      uptime: uptimeSeconds(),
      memorijaHeapMB: memoryMB(),
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
    },
    { status: httpStatus },
  );

  response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
  response.headers.set('X-App-Version', APP_VERSION);
  response.headers.set('X-Autofinish-Iteracija', String(AUTOFINISH_COUNT));
  return response;
}
