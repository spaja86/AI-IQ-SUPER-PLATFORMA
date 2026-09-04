import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_ROUTES,
} from '@/lib/constants';
import { getNotificationOverview } from '@/lib/notifications';

export async function GET() {
  const overview = getNotificationOverview();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OpenAI Platforma Notifikacije - Centralizovani Sistem Obavestenja i Alertinga',
    verzija: APP_VERSION,

    notifikacije: {
      pregled: {
        rute: TOTAL_ROUTES,
        apiEndpointi: TOTAL_API_ROUTES,
        dijagnostike: TOTAL_DIAGNOSTIKA,
        persone: OMEGA_AI_PERSONA_UKUPNO,
        autofinishIteracija: AUTOFINISH_COUNT,
      },
      sourceOfTruth: overview.sourceOfTruth,
      arhitektura: overview.architecture,
      inventar: {
        tokovi: overview.inventory.length,
        kategorije: overview.categories,
        kanali: overview.channels,
        stavke: overview.inventory,
      },
      templateRegistry: overview.templates,
      alerting: overview.alerting,
      persistence: overview.persistence,
      observabilnost: overview.observability,
    },

    dijagnostike: [
      {
        id: 'openai-notif-001',
        naziv: 'Jedan izvor istine',
        status: 'ok',
        opis: `Domen notifikacija je centralizovan u ${overview.sourceOfTruth}.`,
      },
      {
        id: 'openai-notif-002',
        naziv: 'Arhitektura po slojevima',
        status: 'ok',
        opis: `${overview.architecture.length} slojeva pokrivaju domen, orkestraciju, producente, persistence i read-model.`,
      },
      {
        id: 'openai-notif-003',
        naziv: 'Template registar',
        status: 'ok',
        opis: `${overview.templates.total} template-a standardizuje billing, sistemske i alert poruke.`,
      },
      {
        id: 'openai-notif-004',
        naziv: 'Alert pravila',
        status: 'ok',
        opis: `${overview.alerting.totalRules} alert pravila koristi zajednički notification ugovor i observability signal.`,
      },
      {
        id: 'openai-notif-005',
        naziv: 'Persistence model',
        status: 'ok',
        opis: `Tabela ${overview.persistence.primaryTable} koristi metadata-extended zapis za pokušaje, template i audit trag.`,
      },
      {
        id: 'openai-notif-006',
        naziv: 'API read model',
        status: 'ok',
        opis: 'Read-only pregled je reorganizovan pod /api/notifications* namespace.',
      },
    ],

    timestamp: new Date().toISOString(),
  });
}
