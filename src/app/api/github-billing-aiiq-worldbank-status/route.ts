import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  gitHubBillingRacun,
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubBillingRolloutFaze,
  getGitHubBillingStatistike,
} from '@/lib/github-billing-aiiq-worldbank';

export async function GET() {
  const statistike = getGitHubBillingStatistike();
  const aktivnaFaza = gitHubBillingRolloutFaze.find((f) => f.status === 'u_toku');
  const ukupnoPilot = gitHubPilotTransakcije.reduce((sum, t) => sum + t.iznos, 0);
  const budzetnoProcent = Math.round((ukupnoPilot / gitHubBillingBudzet.mesecniLimitUSD) * 100);

  return NextResponse.json({
    naziv: 'GitHub Billing Status — AI IQ World Bank',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    status: 'aktivan',
    billingRacun: {
      id: gitHubBillingRacun.id,
      naziv: gitHubBillingRacun.naziv,
      status: gitHubBillingRacun.status,
    },
    budzet: {
      mesecniLimitUSD: gitHubBillingBudzet.mesecniLimitUSD,
      iskoriscenUSD: ukupnoPilot,
      iskoriscenProcent: budzetnoProcent,
      preostaloUSD: gitHubBillingBudzet.mesecniLimitUSD - ukupnoPilot,
      zdravlje: budzetnoProcent < 80 ? 'ok' : budzetnoProcent < 95 ? 'upozorenje' : 'kriticno',
    },
    aktivnaFaza: aktivnaFaza
      ? { faza: aktivnaFaza.faza, naziv: aktivnaFaza.naziv, status: aktivnaFaza.status }
      : null,
    statistike,
    timestamp: new Date().toISOString(),
  });
}
