import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair';
import { getStatistike } from '@/lib/statistika';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_PAGES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  PROKSI_KAPACITET,
  MOBILNE_CENTRALE,
} from '@/lib/constants';

export async function GET() {
  const dijagnostika = runDiagnostics();
  const stats = getStatistike();

  const apiEndpointi = [
    '/api/health', '/api/status', '/api/autofinish', '/api/autofinish-summary', '/api/autofinish-log',
    '/api/verzija', '/api/changelog', '/api/metrics', '/api/infrastructure', '/api/tech-stack',
    '/api/runtime-info', '/api/navigation-info', '/api/security', '/api/sitemap-status',
    '/api/ecosystem-graph', '/api/milestones', '/api/kompletna-statistika', '/api/sistem-pregled',
    '/api/platforme', '/api/platforme-status', '/api/platforme-pregled',
    '/api/igrice', '/api/igrice-stats', '/api/igrice-pregled',
    '/api/omega-ai', '/api/omega-ai-status', '/api/omega-dispatch-status',
    '/api/dimenzije', '/api/dimenzije-status',
    '/api/spaja-pro', '/api/spaja-pro-status', '/api/spaja-core-status',
    '/api/prompt', '/api/prompt-status', '/api/spaja-univerzalni-prompt',
    '/api/proksi', '/api/proksi-status', '/api/proksi-github-deploy',
    '/api/wifi-antena-status', '/api/deploy-status',
    '/api/mobilna-mreza', '/api/mobilna-mreza-status',
    '/api/sajtovi', '/api/sajtovi-status',
    '/api/industrija', '/api/industrija-status', '/api/it-proizvodi-status',
    '/api/kompanije', '/api/organizacije', '/api/proizvodi',
    '/api/ekosistem', '/api/ekosistem-status',
    '/api/evolucija', '/api/evolucija-status',
    '/api/cron', '/api/cron-status',
    '/api/navigacija', '/api/statistike',
    '/api/sekvence-status', '/api/auto-repair',
    '/api/mega-status',
    '/api/sajtovi-pregled', '/api/kompanije-pregled', '/api/spaja-pro-pregled',
    '/api/proksi-pregled', '/api/full-ecosystem',
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: `${APP_NAME} — Mega Status`,
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,

    zdravlje: {
      procenat: dijagnostika.zdravlje,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
      upozorenja: dijagnostika.upozorenja,
      gresaka: dijagnostika.gresaka,
    },

    ekosistem: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      platforme: stats.ukupnoPlatformi,
      omegaAI: OMEGA_AI_PERSONA_COUNT,
      oktave: OMEGA_AI_OKTAVA_COUNT,
      spajaProVerzije: SPAJA_PRO_VERZIJA_COUNT,
      proksiKapacitet: PROKSI_KAPACITET,
      mobilneCentrale: MOBILNE_CENTRALE,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    apiEndpointi: {
      ukupno: apiEndpointi.length,
      lista: apiEndpointi,
    },

    timestamp: new Date().toISOString(),
  });
}
