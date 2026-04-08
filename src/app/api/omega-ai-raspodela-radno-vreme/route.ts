import { NextResponse } from 'next/server';
import { radnoVremeRaspodela } from '@/lib/omega-ai-raspodela';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

/**
 * 🏭 OMEGA AI Raspodela — Radno Vreme API
 *
 * Raspodela persona po smenama: jutarnja, popodnevna, noćna.
 * Pokrivenost 24/7/365 sa ravnomernom raspodelom.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Raspodela — Radno Vreme',
    ukupnoPersona: OMEGA_AI_PERSONA_UKUPNO.toLocaleString(),
    pokrivenost: '24/7/365',
    smene: radnoVremeRaspodela.map((r) => ({
      smena: r.smena,
      naziv: r.naziv,
      ikona: r.ikona,
      vreme: r.vreme,
      persona: r.personaPoSmeni.toLocaleString(),
      opis: r.opis,
    })),
    napomena: 'Persona biraju smenu po dogovoru i kompatibilnosti sa kolegama. Fleksibilna rotacija.',
    timestamp: new Date().toISOString(),
  });
}
