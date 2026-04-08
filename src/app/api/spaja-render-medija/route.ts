import { NextResponse } from 'next/server';
import {
  spajaRenderMedija,
  renderEngini,
  renderPipeline,
  getAktivniEngini,
  getRenderStatistika,
} from '@/lib/spaja-render-medija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const statistika = getRenderStatistika();
  const aktivniEng = getAktivniEngini();

  return NextResponse.json({
    sistem: 'SPAJA Render za Slike i Video',
    verzija: spajaRenderMedija.verzija,
    appVerzija: APP_VERSION,
    opis: spajaRenderMedija.opis,
    link: spajaRenderMedija.link,
    generatorLink: spajaRenderMedija.generatorLink,
    ukupnoEngina: renderEngini.length,
    aktivnihEngina: aktivniEng.length,
    ukupnoPipeline: renderPipeline.length,
    statistika,
    engini: renderEngini,
    pipeline: renderPipeline,
    timestamp: new Date().toISOString(),
  });
}
