import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { platforme } from '@/lib/platforme';
import { navigation } from '@/lib/navigation';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_PAGES } from '@/lib/constants';

export async function GET() {
  const stats = getStatistike();
  const povezanePlatforme = platforme.filter((p) => ['palasterizacija', 'eksosistzdacija', 'ai-iq-super-platforma'].includes(p.id));
  const povezaneRute = ['/eksosistzdacija', '/ekosistem', '/platforme', '/deploy', '/dashboard'];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Eksosistzdacija',
    opis: 'Operativni modul za mapiranje i konsolidaciju ekosistemskih tokova',
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
    pokrivenost: {
      platforme: povezanePlatforme.length,
      navigacioniLinkovi: navigation.filter((n) => povezaneRute.includes(n.href)).length,
      povezaneRute,
    },
    statistika: {
      ukupnoPlatformi: stats.ukupnoPlatformi,
      ukupnoStranica: TOTAL_PAGES,
      ukupnoRuta: TOTAL_ROUTES,
      ukupnoAPIRuta: TOTAL_API_ROUTES,
      ukupniProgres: stats.ukupniProgres,
      zdravljeSistema: stats.zdravljeSistema,
    },
    platforme: povezanePlatforme.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      status: p.status,
      progres: p.progres,
      url: p.url,
    })),
    autofinish: {
      broj: AUTOFINISH_COUNT,
      iteracija: `Autofinish #${AUTOFINISH_COUNT}`,
    },
  });
}
