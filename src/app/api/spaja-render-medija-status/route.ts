import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  renderEngini,
  renderPipeline,
  getAktivniEngini,
  getRenderStatistika,
} from '@/lib/spaja-render-medija';

export async function GET() {
  const statistika = getRenderStatistika();

  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Render za Slike i Video — Status',
    verzija: APP_VERSION,
    link: 'https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
    ukupnoEngina: renderEngini.length,
    aktivnihEngina: getAktivniEngini().length,
    ukupnoPipeline: renderPipeline.length,
    ukupnoFormata: statistika.ukupnoFormata,
    statistika,
    engini: renderEngini.map((e) => ({
      naziv: e.naziv,
      kategorija: e.kategorija,
      status: e.status,
      rezolucija: e.rezolucija,
    })),
    timestamp: new Date().toISOString(),
  });
}
