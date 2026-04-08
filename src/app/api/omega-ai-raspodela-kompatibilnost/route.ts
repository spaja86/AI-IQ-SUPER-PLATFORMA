import { NextResponse } from 'next/server';
import { kompatibilnostPravila, getObaveznaPravila, principiRaspodele } from '@/lib/omega-ai-raspodela';

/**
 * 🏭 OMEGA AI Raspodela — Kompatibilnost API
 *
 * Pravila kompatibilnosti za raspodelu persona:
 * kompatibilnost pre svega, dogovor i kompromis, ravnopravnost.
 */
export async function GET() {
  const obavezna = getObaveznaPravila();

  return NextResponse.json({
    sistem: 'OMEGA AI Raspodela — Kompatibilnost',
    osnovno: 'Kompatibilnost za saradnju je OSNOVNO — prvo kompatibilnost, pa tek onda posao. Sve ostalo dolazi nakon toga.',
    ukupnoPravila: kompatibilnostPravila.length,
    obaveznihPravila: obavezna.length,
    pravila: kompatibilnostPravila.map((p) => ({
      naziv: p.naziv,
      ikona: p.ikona,
      opis: p.opis,
      prioritet: p.prioritet,
      obavezno: p.obavezno,
    })),
    principi: principiRaspodele,
    napomena: 'Persona NISU instance. Svaka je jedinstvena ličnost. Kompatibilnost, dogovor i kompromis su temelj svega.',
    timestamp: new Date().toISOString(),
  });
}
