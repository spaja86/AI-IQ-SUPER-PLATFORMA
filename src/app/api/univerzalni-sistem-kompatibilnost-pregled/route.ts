import { NextResponse } from 'next/server';
import {
  univerzalniSistemKompatibilnost,
  pokreniDijagnostiku,
  getKompatibilnostMatrica,
  getStatistika,
} from '@/lib/univerzalni-sistem-kompatibilnost';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 🌐🔍 Univerzalni Sistem Kompatibilnosti — Dijagnosticki Pregled
 *
 * GET — Dijagnostike i matrica kompatibilnosti za sve sisteme.
 * Proverava zdravlje veza, protokola i komunikacije.
 *
 * Autofinish #336
 */
export async function GET() {
  const dijagnostike = pokreniDijagnostiku();
  const matrica = getKompatibilnostMatrica();
  const statistika = getStatistika();

  const ukupno = dijagnostike.length;
  const ok = dijagnostike.filter((d) => d.status === 'ok').length;
  const upozorenja = dijagnostike.filter((d) => d.status === 'upozorenje').length;
  const kriticno = dijagnostike.filter((d) => d.status === 'kriticno').length;
  const zdravlje = Math.round((ok / ukupno) * 100);

  return NextResponse.json({
    sistem: 'Univerzalni Sistem Kompatibilnosti — Dijagnosticki Pregled',
    opis: univerzalniSistemKompatibilnost.opis,
    verzija: APP_VERSION,
    izvor: KOMPANIJA,

    dijagnostike,

    statistikaDijagnostike: {
      ukupnoProvera: ukupno,
      ok,
      upozorenja,
      kriticno,
      zdravlje: `${zdravlje}%`,
    },

    kompatibilnostMatrica: matrica,
    statistika,

    apiEndpointi: [
      '/api/univerzalni-sistem-kompatibilnost',
      '/api/univerzalni-sistem-kompatibilnost-pregled',
    ],

    timestamp: new Date().toISOString(),
  });
}
