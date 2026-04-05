import { NextResponse } from 'next/server';
import { runDiagnostics } from '@/lib/auto-repair/diagnostics';
import { runRepair } from '@/lib/auto-repair/repair-engine';
import { checkUpgrades } from '@/lib/auto-repair/upgrade-engine';
import { pokeniEvolucijskuDijagnostiku } from '@/lib/evolucija/engine';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  AUTOFINISH_COUNT,
} from '@/lib/constants';

export async function GET() {
  const dijagnostike = runDiagnostics();
  const popravke = runRepair();
  const nadogradnje = checkUpgrades();
  const evolucija = pokeniEvolucijskuDijagnostiku();

  const zdravljeDijagnostika = dijagnostike.zdravlje;
  const zdravljeEvolucija = evolucija.zdravlje;
  const ukupnoZdravlje = Math.round((zdravljeDijagnostika + zdravljeEvolucija) / 2);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Ekosistem Zdravlje — Kompletni Health Dashboard',
    verzija: APP_VERSION,

    zdravlje: {
      ukupno: ukupnoZdravlje,
      dijagnostike: zdravljeDijagnostika,
      evolucija: zdravljeEvolucija,
    },

    pregled: {
      stranice: TOTAL_PAGES,
      apiRute: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostika: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      popravki: popravke.length,
      nadogradnji: nadogradnje.length,
    },

    moduli: [
      { naziv: 'Dijagnostike', provera: dijagnostike.ukupnoProvera, zdravlje: zdravljeDijagnostika },
      { naziv: 'Auto-Repair', akcija: popravke.length, status: 'aktivan' },
      { naziv: 'Upgrade Engine', nadogradnji: nadogradnje.length, status: 'aktivan' },
      { naziv: 'Evolucija', zdravlje: zdravljeEvolucija, status: 'aktivan' },
    ],

    timestamp: new Date().toISOString(),
  });
}
