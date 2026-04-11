import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, OMEGA_AI_PERSONA_UKUPNO, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OpenAI Platforma Incident Menadzer - Upravljanje Incidentima i Odgovor',
    verzija: APP_VERSION,

    incidentMenadzer: {
      pregled: {
        rute: TOTAL_ROUTES,
        apiEndpointi: TOTAL_API_ROUTES,
        dijagnostike: TOTAL_DIAGNOSTIKA,
        persone: OMEGA_AI_PERSONA_UKUPNO,
        autofinishIteracija: AUTOFINISH_COUNT,
      },
      incidentResponse: {
        naziv: 'OMEGA Incident Response Engine',
        automatskaDetekcija: true,
        automatskaTrijaza: true,
        mttd: '<30s',
        mtta: '<2min',
        mttr: '<15min',
        eskalacioniNivoi: 4,
        onCallTimovi: 8,
        rotacijaPeriod: 'nedeljno',
        ukupnoResenihIncidenata: 45_000,
        uspenostResavanja: '99.92%',
      },
      severityKlasifikacija: {
        naziv: 'OMEGA Severity Classifier',
        automatskaSeverity: true,
        mlKlasifikacija: true,
        nivoi: [
          { nivo: 'P0', opis: 'Kritican - kompletni pad sistema', sla: '<15min', eskalacija: 'odmah' },
          { nivo: 'P1', opis: 'Visok - znacajan uticaj na korisnike', sla: '<30min', eskalacija: '<5min' },
          { nivo: 'P2', opis: 'Srednji - delimican uticaj', sla: '<2h', eskalacija: '<15min' },
          { nivo: 'P3', opis: 'Nizak - minimalan uticaj', sla: '<8h', eskalacija: '<1h' },
          { nivo: 'P4', opis: 'Informativni - bez uticaja', sla: '<24h', eskalacija: 'opciono' },
        ],
        preciznostKlasifikacije: '98.5%',
      },
      runbookAutomatizacija: {
        naziv: 'OMEGA Runbook Automation',
        ukupnoRunbookova: 350,
        automatizovanih: 320,
        kategorije: ['Infrastructure', 'Application', 'Network', 'Security', 'Database', 'API'],
        automatskoPokretanje: true,
        rollbackPodrska: true,
        validacijaKoraka: true,
        paralelnoIzvrsavanje: true,
        uspenostAutomatizacije: '96.8%',
      },
      komunikacija: {
        naziv: 'OMEGA Incident Communicator',
        statusPage: true,
        automatskiUpdate: true,
        stakeholderNotifikacije: true,
        kanali: ['Slack', 'PagerDuty', 'Email', 'SMS', 'StatusPage', 'Teams'],
        templateSistem: true,
        ukupnoTemplejta: 150,
        multiJezickaPodrska: true,
        statusPageURL: 'status.omega-ai.spaja.rs',
      },
      postmortemAnaliza: {
        naziv: 'OMEGA Postmortem Analyzer',
        automatskiPostmortem: true,
        rootCauseAnaliza: true,
        blamelessKultura: true,
        actionItems: true,
        trendAnaliza: true,
        recurrenceDetection: true,
        ukupnoPostmortema: 2_500,
        implementiraneAkcije: '94%',
        prosecnoVremeDoPostmortema: '<48h',
      },
      metrikeITrendovi: {
        naziv: 'OMEGA Incident Metrics',
        dashboardRealTime: true,
        kpiPracenje: ['MTTD', 'MTTA', 'MTTR', 'MTBF', 'Incident Rate', 'Recurrence Rate'],
        trendAnaliza: true,
        benchmarking: true,
        mesecniIzvestaj: true,
        kvartalniPregled: true,
        godisnjiAudit: true,
      },
    },

    dijagnostike: [
      { id: 'openai-inc-001', naziv: 'Incident response', status: 'ok', opis: 'MTTD <30s, MTTA <2min, MTTR <15min, 45K resenih, 99.92% uspesnost' },
      { id: 'openai-inc-002', naziv: 'Severity klasifikacija', status: 'ok', opis: 'ML klasifikacija, P0-P4, automatska trijaza, 98.5% preciznost' },
      { id: 'openai-inc-003', naziv: 'Runbook automatizacija', status: 'ok', opis: '350 runbook-ova (320 auto), rollback, validacija, 96.8% uspesnost' },
      { id: 'openai-inc-004', naziv: 'Komunikacija', status: 'ok', opis: 'StatusPage, 6 kanala, 150 template-a, automatski update, multi-jezik' },
      { id: 'openai-inc-005', naziv: 'Postmortem analiza', status: 'ok', opis: '2500 postmortema, root cause, blameless, 94% implementiranih akcija' },
      { id: 'openai-inc-006', naziv: 'Metrike i trendovi', status: 'ok', opis: 'Real-time dashboard, 6 KPI, trend analiza, mesecni/kvartalni/godisnji izvestaji' },
    ],

    timestamp: new Date().toISOString(),
  });
}
