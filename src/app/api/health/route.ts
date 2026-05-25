// Autofinish #838 — Poboljšani Health-Check Endpoint
// Liveness: brza provjera da server živi (/api/health?check=liveness)
// Readiness: puna provjera da je servis spreman za saobraćaj (/api/health?check=readiness)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getStatistike } from '@/lib/statistika';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';
import { buildEkstremnoProcesuiranjeSvega } from '@/lib/procesuiranje-svega';

// Bilježi vreme starta procesa za uptime izračun.
// Napomena: U serverless okruženjima (Vercel) ovo se resetuje pri svakom cold startu.
// Za produkcijski uptime, koristite deployment timestamp iz env varijable ili Vercel API.
const PROCESS_START_MS = Date.now();

/**
 * Vraća broj sekundi od cold starta ovog serverless instance.
 * Napomena: resetuje se pri svakom cold startu u Vercel serverless okruženju.
 * Za produkcijski uptime koristiti deployment timestamp iz env ili Vercel API.
 */
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
        analizaSvega: {
          sourceOfTruth: '/api/analiza-svega',
          contractVersion: 'v2',
          modelVersion: '2.0.0',
        },
        potencijalSvegaOvogaDoSada: {
          sourceOfTruth: '/api/potencijal-svega-ovoga-do-sada',
          contractVersion: 'v1',
          modelVersion: '1.0.0',
        },
        uptime: uptimeSeconds(),
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Readiness: puna provjera
  const dijagnostika = runDiagnostics();
  const stats = getStatistike();
  const operativa = getOperativnaSpremnost();
  const ekstremno = buildEkstremnoProcesuiranjeSvega();

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
      operativnaSpremnost: {
        status: operativa.spremnost.status,
        score: operativa.spremnost.ukupanScore,
        modelStanja: operativa.spremnost.modelStanja,
        acceptanceCriteria: operativa.spremnost.acceptanceCriteria,
        missingEnv: operativa.spremnost.missingEnv.length,
        missingVercelEnv: operativa.spremnost.missingVercelEnv.length,
        runtime: operativa.spremnost.runtime.status,
        ops: operativa.spremnost.modelStanja.ops,
        enterpriseMode: operativa.spremnost.modelStanja.enterprise,
        kastlerTv: operativa.spremnost.kastlerTv,
        mail: operativa.spremnost.mail.status,
        vercel: operativa.spremnost.vercel.status,
        github: operativa.spremnost.github.status,
        support: operativa.spremnost.support.status,
        enterprise: operativa.spremnost.enterprise,
        missingKastlerEnv: operativa.spremnost.missingKastlerEnv.length,
      },
      ekstremnoProcesuiranje: {
        score: ekstremno.ukupanProcenat,
        throughputPerMin: ekstremno.score.throughputPerMin,
        latencyMsP95: ekstremno.score.latencyMsP95,
        errorRatePct: ekstremno.score.errorRatePct,
        queueDepth: ekstremno.scheduler.queueDepth,
        emergencyOverride: ekstremno.scheduler.emergencyOverride,
        degraded: ekstremno.meta.degraded,
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
