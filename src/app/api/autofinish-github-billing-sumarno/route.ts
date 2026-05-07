import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubBillingRolloutFaze,
  getGitHubBillingStatistike,
} from '@/lib/github-billing-aiiq-worldbank';

export async function GET() {
  const statistike = getGitHubBillingStatistike();
  const ukupnoPilotUSD = gitHubPilotTransakcije.reduce((sum, item) => sum + item.iznos, 0);
  const budzetIskoriscenPct = Math.round((ukupnoPilotUSD / gitHubBillingBudzet.mesecniLimitUSD) * 100);
  const aktivnaFaza = gitHubBillingRolloutFaze.find((faza) => faza.status === 'u_toku');

  return NextResponse.json({
    naziv: 'Autofinish GitHub Billing Sumarno',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    status: 'aktivan',
    pilot: {
      ukupnoTransakcija: gitHubPilotTransakcije.length,
      ukupnoPilotUSD,
      budzetMesecniLimitUSD: gitHubBillingBudzet.mesecniLimitUSD,
      budzetIskoriscenPct,
    },
    rollout: {
      aktivnaFaza: aktivnaFaza
        ? {
            faza: aktivnaFaza.faza,
            naziv: aktivnaFaza.naziv,
            status: aktivnaFaza.status,
          }
        : null,
      ukupnoFaza: gitHubBillingRolloutFaze.length,
    },
    statistike,
    timestamp: new Date().toISOString(),
  });
}
