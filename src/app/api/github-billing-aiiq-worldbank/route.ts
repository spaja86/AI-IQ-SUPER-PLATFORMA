import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  gitHubBillingRacun,
  gitHubBillingUloge,
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubOrgBillingModel,
  gitHubBillingAuditLog,
  gitHubBillingRolloutFaze,
  getGitHubBillingStatistike,
} from '@/lib/github-billing-aiiq-worldbank';

export async function GET() {
  const statistike = getGitHubBillingStatistike();

  return NextResponse.json({
    naziv: 'GitHub Billing — AI IQ World Bank Integracija',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    status: 'aktivan',
    opis: 'Centralizacija svih GitHub plaćanja kroz AI IQ World Bank. GLAVNI ENDŽIN i OMEGA AI upravljaju svim kupovinama za projekte Digitalne Industrije.',
    billingRacun: gitHubBillingRacun,
    orgBillingModel: gitHubOrgBillingModel,
    uloge: gitHubBillingUloge,
    budzet: gitHubBillingBudzet,
    pilotTransakcije: gitHubPilotTransakcije,
    rolloutFaze: gitHubBillingRolloutFaze,
    auditLog: gitHubBillingAuditLog,
    statistike,
    timestamp: new Date().toISOString(),
  });
}
