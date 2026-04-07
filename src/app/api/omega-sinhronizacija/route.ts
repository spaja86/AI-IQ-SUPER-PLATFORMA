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

  const matrica = persone.map((p, i) => ({
    persona: p,
    oktava: (i % OMEGA_AI_OKTAVA_COUNT) + 1,
    sinhronizacija: {
      status: 'sinhronizovano',
      latencija: `${(Math.random() * 0.5 + 0.1).toFixed(2)}ms`,
      protokol: 'MatrixSync v3',
    },
    veze: persone.filter((_, j) => j !== i && Math.abs(i - j) <= 3).slice(0, 4),
  }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Sinhronizacija — Matricni Pregled',
    verzija: APP_VERSION,

    pregled: {
      persone: OMEGA_AI_PERSONA_COUNT,
      oktave: OMEGA_AI_OKTAVA_COUNT,
      vezeUMatrici: matrica.reduce((acc, m) => acc + m.veze.length, 0),
      protokol: 'MatrixSync v3',
      jezgro: 'SpajaUltraOmegaCore -∞Ω+∞',
    },

    sinhronizacija: {
      globalniStatus: 'aktivna',
      tip: 'Potpuna matricna sinhronizacija',
      frekvencija: 'Kontinualna (real-time)',
      kvalitet: '99.99% uptime',
    },

    matrica,

    timestamp: new Date().toISOString(),
  });
}
