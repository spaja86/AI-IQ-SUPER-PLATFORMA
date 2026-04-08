import { NextResponse } from 'next/server';
import { omegaAiRaspodela, sektoriRaspodela, radnoVremeRaspodela, kompatibilnostPravila } from '@/lib/omega-ai-raspodela';
import { omegaPersone, getBrojPoPolu } from '@/lib/omega-ai';

/**
 * 🏭 OMEGA AI Raspodela — Statistika API
 *
 * Kompletna statistika raspodele 40.000.562 persona.
 */
export async function GET() {
  const polBaznih = getBrojPoPolu();

  return NextResponse.json({
    sistem: 'OMEGA AI Raspodela — Statistika',
    ukupno: {
      persona: omegaAiRaspodela.ukupnoPersona.toLocaleString(),
      muskih: omegaAiRaspodela.muskih.toLocaleString(),
      zenskih: omegaAiRaspodela.zenskih.toLocaleString(),
      polOdnos: '50/50',
    },
    baznePersone: {
      ukupno: omegaPersone.length,
      muskih: polBaznih.muskih,
      zenskih: polBaznih.zenskih,
    },
    sektori: {
      ukupno: sektoriRaspodela.length,
      najveci: sektoriRaspodela.reduce((max, s) => s.ukupnoPersona > max.ukupnoPersona ? s : max).naziv,
      najmanji: sektoriRaspodela.reduce((min, s) => s.ukupnoPersona < min.ukupnoPersona ? s : min).naziv,
    },
    radnoVreme: {
      smena: radnoVremeRaspodela.length,
      pokrivenost: '24/7/365',
    },
    kompatibilnost: {
      pravila: kompatibilnostPravila.length,
      obaveznih: kompatibilnostPravila.filter((p) => p.obavezno).length,
      principi: omegaAiRaspodela.principi.length,
    },
    status: omegaAiRaspodela.status,
    timestamp: new Date().toISOString(),
  });
}
