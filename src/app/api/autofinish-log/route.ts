import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

function getAutofinishLog(): Array<{ iteracija: number; verzija: string; rute: number; api: number; dijagnostike: number; opis: string }> {
  return [
    { iteracija: 1, verzija: '5.5.0', rute: 16, api: 7, dijagnostike: 5, opis: 'Inicijalni fix — TypeScript, sekvence, deploy' },
    { iteracija: 5, verzija: '6.2.0', rute: 28, api: 8, dijagnostike: 12, opis: 'Igrice sistem 36 igrica' },
    { iteracija: 10, verzija: '6.6.0', rute: 43, api: 12, dijagnostike: 18, opis: 'Constants centralizacija, SEO metadata' },
    { iteracija: 15, verzija: '6.8.0', rute: 55, api: 24, dijagnostike: 27, opis: 'JSON-LD + robots.txt, 3 nova API' },
    { iteracija: 20, verzija: '7.0.0', rute: 60, api: 28, dijagnostike: 30, opis: 'Major v7.0.0 milestone' },
    { iteracija: 25, verzija: '7.5.0', rute: 65, api: 33, dijagnostike: 34, opis: 'Autofinish summary, graph' },
    { iteracija: 30, verzija: '8.0.0', rute: 70, api: 38, dijagnostike: 39, opis: 'v8.0.0 — Milestones, 38 API' },
    { iteracija: 35, verzija: '8.5.0', rute: 75, api: 43, dijagnostike: 44, opis: 'Platforme status, 43 API' },
    { iteracija: 40, verzija: '9.0.0', rute: 80, api: 48, dijagnostike: 49, opis: 'v9.0.0 — Ekosistem status' },
    { iteracija: 45, verzija: '9.5.0', rute: 85, api: 53, dijagnostike: 54, opis: 'Kompletna statistika, 53 API' },
    { iteracija: 50, verzija: '10.0.0', rute: 90, api: 58, dijagnostike: 59, opis: 'v10.0.0 MILESTONE — Sistem pregled' },
    { iteracija: 55, verzija: '10.5.0', rute: 95, api: 63, dijagnostike: 64, opis: 'v10.5.0 — Mega status, dispatch, logovi' },
    { iteracija: 60, verzija: '11.0.0', rute: 100, api: 68, dijagnostike: 69, opis: 'v11.0.0 MILESTONE — Full ecosystem, 100 ruta' },
    { iteracija: 65, verzija: '11.5.0', rute: 105, api: 73, dijagnostike: 74, opis: 'v11.5.0 — Dimenzije, OMEGA AI, evolucija, mobilna, promptovi' },
    { iteracija: 70, verzija: '12.0.0', rute: 110, api: 78, dijagnostike: 79, opis: 'v12.0.0 MILESTONE — Industrija, WiFi, deploy, IT proizvodi, prompt pregled' },
    { iteracija: 75, verzija: '12.5.0', rute: 115, api: 83, dijagnostike: 84, opis: 'v12.5.0 — Ultra OMEGA Core, sekvence, dispatch, dijagnostika, rast pregled' },
    { iteracija: 80, verzija: '13.0.0', rute: 120, api: 88, dijagnostike: 89, opis: 'v13.0.0 MILESTONE — Repair, upgrade, evolucija dijagnostika, kategorije, ekosistem zdravlje' },
    { iteracija: 85, verzija: '13.5.0', rute: 125, api: 93, dijagnostike: 94, opis: 'v13.5.0 — Verzija istorija, OMEGA oktave, proksi kapacitet, mobilna statistika, arhitektura' },
    { iteracija: 90, verzija: '14.0.0', rute: 130, api: 98, dijagnostike: 99, opis: 'v14.0.0 MILESTONE — Dimenzije mapa, SpajaPro benchmark, igrice kategorije, evolucija ciklus, full dijagnostika' },
    { iteracija: 95, verzija: '14.5.0', rute: 135, api: 103, dijagnostike: 104, opis: 'v14.5.0 — Mega dijagnostika, timeline, mobilna-proksi integracija, OMEGA evolucija mapa, platforma indeks' },
    { iteracija: 100, verzija: APP_VERSION, rute: TOTAL_ROUTES, api: TOTAL_API_ROUTES, dijagnostike: TOTAL_DIAGNOSTIKA, opis: 'v15.0.0 MILESTONE — Ekosistem indeks, predikcija, SpajaPro evolucija, OMEGA sinhronizacija, verzija roadmap' },
  ];
}

export async function GET() {
  const log = getAutofinishLog();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Log — Kompletna Istorija',
    verzija: APP_VERSION,

    trenutno: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
      procenat: ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2),
    },

    log,

    statistike: {
      ukupnoIteracija: AUTOFINISH_COUNT,
      prvaVerzija: '5.5.0',
      trenutnaVerzija: APP_VERSION,
      rastRuta: `${log[0].rute} → ${TOTAL_ROUTES} (${((TOTAL_ROUTES / log[0].rute) * 100 - 100).toFixed(0)}%)`,
      rastAPI: `${log[0].api} → ${TOTAL_API_ROUTES} (${((TOTAL_API_ROUTES / log[0].api) * 100 - 100).toFixed(0)}%)`,
      rastDijagnostika: `${log[0].dijagnostike} → ${TOTAL_DIAGNOSTIKA} (${((TOTAL_DIAGNOSTIKA / log[0].dijagnostike) * 100 - 100).toFixed(0)}%)`,
    },

    timestamp: new Date().toISOString(),
  });
}
