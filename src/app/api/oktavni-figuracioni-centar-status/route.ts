import { NextResponse } from 'next/server';
import { getFiguracioniCentar } from '@/lib/oktavne-eksponencijalne-funkcije';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const centar = getFiguracioniCentar();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Figuracioni Centar — Status',
    verzija: APP_VERSION,

    zdravlje: {
      centroidX: centar.centroidX,
      centroidY: centar.centroidY,
      fokalnaSnaga: centar.fokalnaSnaga,
      harmonickiIndeks: centar.harmonickiIndeks,
      konvergencioniKoeficijent: centar.konvergencioniKoeficijent,
      brojOsa: centar.figuracioneOse.length,
      brojSlojeva: centar.slojevi.length,
      statusObjekta: centar.status,
    },

    timestamp: new Date().toISOString(),
  });
}
