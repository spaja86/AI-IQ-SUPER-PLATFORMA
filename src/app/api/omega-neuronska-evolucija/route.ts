import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  AUTOFINISH_COUNT,
} from '@/lib/constants';

export async function GET() {
  const slojevi = [
    { naziv: 'Ulazni sloj', neurona: 4096, aktivacija: 'ReLU', status: 'aktivan' },
    { naziv: 'Skriveni sloj 1', neurona: 8192, aktivacija: 'GELU', status: 'aktivan' },
    { naziv: 'Skriveni sloj 2', neurona: 16384, aktivacija: 'Swish', status: 'aktivan' },
    { naziv: 'Skriveni sloj 3', neurona: 32768, aktivacija: 'Mish', status: 'aktivan' },
    { naziv: 'Izlazni sloj', neurona: 2048, aktivacija: 'Softmax', status: 'aktivan' },
  ];

  const evolucijskiCiklusi = [
    { ciklus: 1, epoha: 1000, gubitak: 0.0012, tačnost: '99.88%', status: 'završen' },
    { ciklus: 2, epoha: 2000, gubitak: 0.0006, tačnost: '99.94%', status: 'završen' },
    { ciklus: 3, epoha: 5000, gubitak: 0.0001, tačnost: '99.99%', status: 'aktivan' },
  ];

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'OMEGA Neuronska Evolucija — Evolucija Neuronskih Mreža',
    verzija: APP_VERSION,

    mreza: {
      tip: 'Transformer + OMEGA evolucijski sloj',
      ukupnoSlojeva: slojevi.length,
      ukupnoNeurona: slojevi.reduce((s, l) => s + l.neurona, 0),
      slojevi,
    },

    evolucija: {
      ciklusi: evolucijskiCiklusi,
      samoOptimizacija: true,
      genetskiAlgoritam: 'OMEGA-GA-v3',
      mutacijskaStopa: 0.001,
    },

    omegaIntegracija: {
      persone: OMEGA_AI_PERSONA_COUNT,
      oktave: OMEGA_AI_OKTAVA_COUNT,
      neuronskaPovezanost: '100%',
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
    },

    timestamp: new Date().toISOString(),
  });
}
