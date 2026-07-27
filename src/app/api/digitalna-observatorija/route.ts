import { NextResponse } from 'next/server';
import {
  digitalnaObservatorija,
  observatorijaInstrumenti,
  observatorijaMete,
  observatorijaSesije,
  observatorijaAlarmi,
  getObservatorijaStatistika,
} from '@/lib/digitalna-observatorija';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'Digitalna Observatorija',
    verzija: digitalnaObservatorija.verzija,
    appVerzija: APP_VERSION,
    observatorija: digitalnaObservatorija,
    ukupnoInstrumenata: observatorijaInstrumenti.length,
    ukupnoMeta: observatorijaMete.length,
    ukupnoSesija: observatorijaSesije.length,
    ukupnoAlarma: observatorijaAlarmi.length,
    statistika: getObservatorijaStatistika(),
    timestamp: new Date().toISOString(),
  });
}
