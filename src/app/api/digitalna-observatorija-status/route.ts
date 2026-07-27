import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  digitalnaObservatorija,
  getObservatorijaStatistika,
  getAktivniInstrumenti,
  getSesijePoStatusu,
  getOtvoreneAlarme,
} from '@/lib/digitalna-observatorija';

export async function GET() {
  const statistika = getObservatorijaStatistika();

  return NextResponse.json({
    status: digitalnaObservatorija.status,
    sistem: 'Digitalna Observatorija — Status',
    verzija: APP_VERSION,
    ukupnoInstrumenata: statistika.ukupnoInstrumenata,
    aktivnihInstrumenata: getAktivniInstrumenti().length,
    aktivnihSesija: getSesijePoStatusu('u_toku').length,
    otvorenihAlarma: getOtvoreneAlarme().length,
    statistika,
    timestamp: new Date().toISOString(),
  });
}
