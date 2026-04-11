import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { renderPipeline, getPipeline } from '@/lib/spaja-render-medija';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    sistem: 'SPAJA Render — Pipeline-i',
    verzija: APP_VERSION,
    ukupnoPipeline: renderPipeline.length,
    pipeline: getPipeline().map((p) => ({
      id: p.id,
      naziv: p.naziv,
      opis: p.opis,
      ikona: p.ikona,
      koraci: p.koraci,
      ulazniFormati: p.ulazniFormati,
      izlazniFormati: p.izlazniFormati,
    })),
    timestamp: new Date().toISOString(),
  });
}
