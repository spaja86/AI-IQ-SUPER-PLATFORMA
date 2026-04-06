import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  TOTAL_PAGES,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_IGRICA,
  OMEGA_AI_PERSONA_COUNT,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  const apiKategorije = {
    status: [
      '/api/health', '/api/status', '/api/cron-status', '/api/deploy-status',
      '/api/ekosistem-status', '/api/evolucija-status', '/api/industrija-status',
      '/api/it-proizvodi-status', '/api/omega-ai-status', '/api/omega-dispatch-status',
      '/api/platforme-status', '/api/proksi-status', '/api/mobilna-mreza-status',
      '/api/prompt-status', '/api/sajtovi-status', '/api/sekvence-status',
      '/api/sitemap-status', '/api/spaja-core-status', '/api/spaja-pro-status',
      '/api/wifi-antena-status', '/api/dimenzije-status',
    ],
    pregled: [
      '/api/platforme-pregled', '/api/igrice-pregled', '/api/sajtovi-pregled',
      '/api/kompanije-pregled', '/api/spaja-pro-pregled', '/api/proksi-pregled',
      '/api/dimenzije-pregled', '/api/omega-ai-pregled', '/api/evolucija-pregled',
      '/api/mobilna-mreza-pregled', '/api/univerzalni-prompt-pregled',
      '/api/industrija-pregled', '/api/wifi-antena-pregled', '/api/deploy-pregled',
      '/api/it-proizvodi-pregled', '/api/prompt-pregled', '/api/sekvence-pregled',
      '/api/dispatch-pregled', '/api/rast-pregled', '/api/repair-pregled',
      '/api/upgrade-pregled', '/api/kategorije-pregled', '/api/sistem-pregled',
    ],
    dijagnostika: [
      '/api/auto-repair', '/api/kompletna-dijagnostika', '/api/full-diagnostika-pregled',
      '/api/mega-dijagnostika', '/api/ekosistem-zdravlje', '/api/evolucija-dijagnostika',
    ],
    autofinish: [
      '/api/autofinish', '/api/autofinish-log', '/api/autofinish-summary',
      '/api/autofinish-timeline',
    ],
    meta: [
      '/api/mega-status', '/api/full-ecosystem', '/api/kompletna-statistika',
      '/api/platforma-arhitektura', '/api/platforma-indeks', '/api/ecosystem-graph',
      '/api/tech-stack', '/api/runtime-info', '/api/infrastructure',
      '/api/verzija', '/api/verzija-istorija', '/api/changelog', '/api/milestones',
      '/api/metrics', '/api/navigation-info', '/api/navigacija', '/api/statistike',
      '/api/security',
    ],
    specijalizovani: [
      '/api/igrice', '/api/igrice-stats', '/api/igrice-kategorije',
      '/api/spaja-pro', '/api/spaja-pro-benchmark',
      '/api/omega-ai', '/api/omega-ai-oktave', '/api/omega-evolucija-mapa',
      '/api/ultra-omega-core',
      '/api/proksi', '/api/proksi-github-deploy', '/api/proksi-kapacitet',
      '/api/mobilna-mreza', '/api/mobilna-statistika', '/api/spaja-mobilna-integracija',
      '/api/dimenzije', '/api/dimenzije-mapa',
      '/api/evolucija', '/api/evolucija-ciklus',
      '/api/ekosistem', '/api/platforme',
      '/api/prompt', '/api/univerzalni-prompt-pregled',
      '/api/sajtovi', '/api/kompanije', '/api/industrija',
      '/api/cron',
    ],
  };

  const ukupnoAPIPoKategoriji = Object.entries(apiKategorije).map(([k, v]) => ({
    kategorija: k,
    broj: v.length,
  }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Platforma Indeks — Master Registar Svih API Endpointa',
    verzija: APP_VERSION,
    platforma: APP_NAME,
    kompanija: KOMPANIJA,

    brojevi: {
      stranice: TOTAL_PAGES,
      apiEndpointa: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      omegaAI: OMEGA_AI_PERSONA_COUNT,
      autofinish: AUTOFINISH_COUNT,
      autofinishCilj: AUTOFINISH_TARGET,
    },

    apiKategorije,
    ukupnoAPIPoKategoriji,

    timestamp: new Date().toISOString(),
  });
}
