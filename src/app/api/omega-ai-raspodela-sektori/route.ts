import { NextResponse } from 'next/server';
import { sektoriRaspodela, getUkupnoPoSektorima } from '@/lib/omega-ai-raspodela';

/**
 * 🏭 OMEGA AI Raspodela — Sektori API
 *
 * Raspodela persona po sektorima: platforma, industrija, menjačnica,
 * banka, IT proizvodi, kompanije, korporacije, suport, istraživanje.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Raspodela — Sektori',
    ukupnoSektora: sektoriRaspodela.length,
    ukupnoPersona: getUkupnoPoSektorima().toLocaleString(),
    sektori: sektoriRaspodela.map((s) => ({
      id: s.id,
      naziv: s.naziv,
      ikona: s.ikona,
      opis: s.opis,
      ukupno: s.ukupnoPersona.toLocaleString(),
      muskih: s.muskih.toLocaleString(),
      zenskih: s.zenskih.toLocaleString(),
      procenat: `${s.procenat}%`,
      kontekst: s.kontekst,
    })),
    napomena: 'Pola muških, pola ženskih u svakom sektoru. Raspodela uz dogovor i kompatibilnost.',
    timestamp: new Date().toISOString(),
  });
}
