import { NextResponse } from 'next/server';
import { checkUpgrades } from '@/lib/auto-repair/upgrade-engine';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const nadogradnje = checkUpgrades();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Upgrade Pregled — Upgrade Engine',
    verzija: APP_VERSION,

    pregled: {
      ukupnoNadogradnji: nadogradnje.length,
      azurnih: nadogradnje.filter((n) => n.trenutna === n.najnovija).length,
    },

    nadogradnje: nadogradnje.map((n) => ({
      paket: n.paket,
      trenutna: n.trenutna,
      najnovija: n.najnovija,
      tip: n.tip,
    })),

    timestamp: new Date().toISOString(),
  });
}
