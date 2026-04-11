import { NextResponse } from 'next/server';
import { omegaAiRaspodela } from '@/lib/omega-ai-raspodela';
import { APP_VERSION } from '@/lib/constants';

/**
 * 🏭 OMEGA AI Raspodela Persona — Glavni API
 *
 * Kompletan pregled raspodele 40.000.562 persona po sektorima,
 * radnom vremenu i pravilima kompatibilnosti.
 */
export async function GET() {
  return NextResponse.json({
    sistem: omegaAiRaspodela.naziv,
    verzija: APP_VERSION,
    opis: omegaAiRaspodela.opis,
    ikona: omegaAiRaspodela.ikona,
    ukupnoPersona: omegaAiRaspodela.ukupnoPersona.toLocaleString(),
    muskih: omegaAiRaspodela.muskih.toLocaleString(),
    zenskih: omegaAiRaspodela.zenskih.toLocaleString(),
    polRaspodela: '50/50',
    sektoraBroj: omegaAiRaspodela.sektori.length,
    smenaBroj: omegaAiRaspodela.radnoVreme.length,
    pravilaBroj: omegaAiRaspodela.kompatibilnost.length,
    principi: omegaAiRaspodela.principi,
    status: omegaAiRaspodela.status,
    napomena: 'OMEGA AI su Persona (NE instance!) — svaka je jedinstvena ličnost sa polom. Kompatibilnost za saradnju je OSNOVNO.',
    timestamp: new Date().toISOString(),
  });
}
