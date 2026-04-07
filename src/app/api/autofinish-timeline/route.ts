import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '@/lib/constants';

export async function GET() {
  const timeline = [
    { period: 'v5.5–v6.2', iteracije: '1–5', rute: '16→28', api: '7→8', opis: 'Inicijalizacija, igrice, deploy fix' },
    { period: 'v6.2–v6.6', iteracije: '5–10', rute: '28→43', api: '8→12', opis: 'Sekvence, constants, SEO metadata' },
    { period: 'v6.6–v7.0', iteracije: '10–20', rute: '43→60', api: '12→28', opis: 'JSON-LD, robots.txt, PWA, API ekspanzija' },
    { period: 'v7.0–v8.0', iteracije: '20–30', rute: '60→70', api: '28→38', opis: 'Milestones, changelog, infrastructure' },
    { period: 'v8.0–v9.0', iteracije: '30–40', rute: '70→80', api: '38→48', opis: 'Status endpointi za sve module' },
    { period: 'v9.0–v10.0', iteracije: '40–50', rute: '80→90', api: '48→58', opis: 'Cron, evolucija, industrija, IT proizvodi' },
    { period: 'v10.0–v11.0', iteracije: '50–60', rute: '90→100', api: '58→68', opis: 'Mega status, pregledi, full-ecosystem' },
    { period: 'v11.0–v12.0', iteracije: '60–70', rute: '100→110', api: '68→78', opis: 'Dimenzije, OMEGA, evolucija, prompt pregledi' },
    { period: 'v12.0–v13.0', iteracije: '70–80', rute: '110→120', api: '78→88', opis: 'Ultra OMEGA Core, repair, upgrade, kategorije' },
    { period: 'v13.0–v14.0', iteracije: '80–90', rute: '120→130', api: '88→98', opis: 'Verzija istorija, oktave, benchmark, arhitektura' },
    { period: `v14.0–v14.5`, iteracije: '90–95', rute: `130→${TOTAL_ROUTES}`, api: `98→${TOTAL_API_ROUTES}`, opis: 'Mega dijagnostika, timeline, integracija, evolucija mapa, indeks' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Autofinish Timeline — Vizuelni Pregled Evolucije',
    verzija: APP_VERSION,

    trenutno: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
      procenat: ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2),
    },

    timeline,

    brzina: {
      prosecnoRutaPoIteraciji: (TOTAL_ROUTES / AUTOFINISH_COUNT).toFixed(1),
      prosecnoAPIPoIteraciji: (TOTAL_API_ROUTES / AUTOFINISH_COUNT).toFixed(1),
      prosecnoDijagnostikaPoIteraciji: (TOTAL_DIAGNOSTIKA / AUTOFINISH_COUNT).toFixed(1),
    },

    timestamp: new Date().toISOString(),
  });
}
