import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  digitalnaObservatorija,
  getObservatorijaPregled,
  getOtvoreneAlarme,
  getMetePoPrioritetu,
  observatorijaSesije,
} from '@/lib/digitalna-observatorija';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'Digitalna Observatorija — Pregled',
    verzija: APP_VERSION,
    observatorijaVerzija: digitalnaObservatorija.verzija,
    link: digitalnaObservatorija.link,
    pregled: getObservatorijaPregled(),
    kriticneMete: getMetePoPrioritetu('kritican').map((meta) => meta.naziv),
    otvoreniAlarmi: getOtvoreneAlarme().map((alarm) => ({
      id: alarm.id,
      naziv: alarm.naziv,
      status: alarm.status,
      ozbiljnost: alarm.ozbiljnost,
    })),
    poslednjeSesije: observatorijaSesije
      .slice()
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 3)
      .map((sesija) => ({
        id: sesija.id,
        naziv: sesija.naziv,
        status: sesija.status,
        signal: `${sesija.signal}%`,
      })),
    timestamp: new Date().toISOString(),
  });
}
