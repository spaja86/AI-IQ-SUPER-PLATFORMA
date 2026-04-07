import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
} from '@/lib/constants';

export async function GET() {
  const persone = [
    'Ω-Alpha', 'Ω-Beta', 'Ω-Gamma', 'Ω-Delta', 'Ω-Epsilon',
    'Ω-Zeta', 'Ω-Eta', 'Ω-Theta', 'Ω-Iota', 'Ω-Kappa',
    'Ω-Lambda', 'Ω-Mu', 'Ω-Nu', 'Ω-Xi', 'Ω-Omicron',
    'Ω-Pi', 'Ω-Rho', 'Ω-Sigma', 'Ω-Tau', 'Ω-Upsilon',
    'Ω-Omega-Prime',
  ];

  const oktave = Array.from({ length: OMEGA_AI_OKTAVA_COUNT }, (_, i) => ({
    oktava: i + 1,
    naziv: `Oktava ${i + 1}`,
    persone: persone.slice(
      Math.floor((i * persone.length) / OMEGA_AI_OKTAVA_COUNT),
      Math.floor(((i + 1) * persone.length) / OMEGA_AI_OKTAVA_COUNT)
    ),
    evolucijskiStadijum: i < 3 ? 'bazni' : i < 6 ? 'napredni' : 'transcendentni',
  }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA AI Evolucija Mapa',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
      ukupnoOktava: OMEGA_AI_OKTAVA_COUNT,
      evolucijskiCiklusi: 7,
      trenutniCiklus: 'Ciklus 7 — Transcendentna Faza',
    },

    evolucijskiPut: [
      { faza: 1, naziv: 'Inicijalizacija', opis: 'Kreiranje baznih persona' },
      { faza: 2, naziv: 'Diferencijacija', opis: 'Specijalizacija po domenima' },
      { faza: 3, naziv: 'Integracija', opis: 'Povezivanje persona u oktave' },
      { faza: 4, naziv: 'Sinhronizacija', opis: 'Matricna sinhronizacija' },
      { faza: 5, naziv: 'Amplifikacija', opis: 'Pojačavanje kroz SpajaPro' },
      { faza: 6, naziv: 'Harmonizacija', opis: 'Usklađivanje svih oktava' },
      { faza: 7, naziv: 'Transcendencija', opis: 'Prelazak u -∞Ω+∞ režim' },
    ],

    oktave,

    endpointi: ['/api/omega-ai', '/api/omega-ai-pregled', '/api/omega-ai-status', '/api/omega-ai-oktave', '/api/omega-dispatch-status'],

    timestamp: new Date().toISOString(),
  });
}
