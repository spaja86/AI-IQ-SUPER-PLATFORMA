import { NextResponse } from 'next/server';
import { APP_VERSION, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_DIAGNOSTIKA, AUTOFINISH_COUNT, OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';
import { plasiranjeSistemi } from '@/lib/omega-projekat-plasiranje';

export async function GET() {
  const aktivnihSistema = plasiranjeSistemi.filter((s) => s.status === 'uspešno').length;
  const ukupnoSistema = plasiranjeSistemi.length;

  return NextResponse.json({
    status: 'OPERATIVNO',
    verzija: APP_VERSION,

    zdravlje: {
      sviSistemiAktivni: aktivnihSistema === ukupnoSistema,
      aktivnihSistema,
      ukupnoSistema,
      procenat: Math.round((aktivnihSistema / ukupnoSistema) * 100),
    },

    metrike: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      autofinish: AUTOFINISH_COUNT,
      omegaAi: OMEGA_AI_PERSONA_UKUPNO,
    },

    timestamp: new Date().toISOString(),
  });
}
