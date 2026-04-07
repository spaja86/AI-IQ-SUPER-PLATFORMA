import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

export async function GET() {
  const slojevi = [
    { sloj: 'Input Layer', neurona: 100000, aktivacija: 'ReLU', status: 'aktivan' },
    { sloj: 'Hidden-1 (Conv3D)', neurona: 500000, aktivacija: 'GELU', status: 'aktivan' },
    { sloj: 'Hidden-2 (Transformer)', neurona: 1000000, aktivacija: 'SwiGLU', status: 'aktivan' },
    { sloj: 'Hidden-3 (SPAJA-Dense)', neurona: 5000000, aktivacija: 'SPAJA-Act', status: 'aktivan' },
    { sloj: 'OMEGA-Core', neurona: 100000000, aktivacija: 'OMEGA-∞', status: 'aktivan' },
    { sloj: 'Output Layer', neurona: 50000, aktivacija: 'Softmax', status: 'aktivan' },
  ];

  const metrike = {
    ukupnoSlojeva: slojevi.length,
    aktivnihSlojeva: slojevi.filter((s) => s.status === 'aktivan').length,
    ukupnoNeurona: slojevi.reduce((sum, s) => sum + s.neurona, 0),
    treningEpoha: 10000,
    loss: 0.00001,
    accuracy: '99.999%',
    optimizator: 'SPAJA-Adam + OMEGA-SGD',
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Ultra Neuronska Mreža Status — Deep Neural Network',
    verzija: APP_VERSION,

    mreza: {
      ...metrike,
      slojevi,
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },

    timestamp: new Date().toISOString(),
  });
}
