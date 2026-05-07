import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  gitHubBillingBudzet,
  gitHubPilotTransakcije,
  gitHubBillingAuditLog,
  getGitHubBillingStatistike,
  type GitHubTroskovnaKategorija,
} from '@/lib/github-billing-aiiq-worldbank';

export async function GET() {
  const statistike = getGitHubBillingStatistike();
  const ukupnoIznos = gitHubPilotTransakcije.reduce((sum, t) => sum + t.iznos, 0);

  const poKategoriji = gitHubPilotTransakcije.reduce<Record<GitHubTroskovnaKategorija, number>>(
    (acc, t) => {
      acc[t.kategorija] = (acc[t.kategorija] ?? 0) + t.iznos;
      return acc;
    },
    {} as Record<GitHubTroskovnaKategorija, number>
  );

  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return NextResponse.json({
    naziv: 'GitHub Billing Mesečni Izveštaj — AI IQ World Bank',
    appVerzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    period,
    izvestaj: {
      ukupnoTransakcija: gitHubPilotTransakcije.length,
      ukupnoIznosUSD: ukupnoIznos,
      poKategoriji,
      budzet: {
        mesecniLimitUSD: gitHubBillingBudzet.mesecniLimitUSD,
        iskoriscenUSD: ukupnoIznos,
        iskoriscenProcent: Math.round((ukupnoIznos / gitHubBillingBudzet.mesecniLimitUSD) * 100),
        preostaloUSD: gitHubBillingBudzet.mesecniLimitUSD - ukupnoIznos,
      },
      statusUskladenosti: 'uskladjeno',
      auditZapisa: gitHubBillingAuditLog.length,
    },
    transakcije: gitHubPilotTransakcije,
    statistike,
    timestamp: new Date().toISOString(),
  });
}
