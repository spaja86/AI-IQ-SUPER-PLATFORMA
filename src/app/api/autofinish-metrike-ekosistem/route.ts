import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  OMEGA_AI_PERSONA_UKUPNO,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_OKTAVA_COUNT,
  SPAJA_PRO_VERZIJA_COUNT,
  MOBILNE_CENTRALE,
} from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  const metrike = {
    platforma: {
      naziv: 'AI IQ SUPER PLATFORMA',
      verzija: APP_VERSION,
      ukupnoRuta: TOTAL_ROUTES,
      apiEndpointi: TOTAL_API_ROUTES,
      stranice: TOTAL_PAGES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
    },
    omegaAi: {
      persone: OMEGA_AI_PERSONA_COUNT,
      oktave: OMEGA_AI_OKTAVA_COUNT,
      ukupnoInstanci: OMEGA_AI_PERSONA_UKUPNO,
      format: '40.000.562',
    },
    spajaPro: {
      verzije: SPAJA_PRO_VERZIJA_COUNT,
      raspon: '6-15',
      engine: 'SpajaPro Prompt Engine v15',
    },
    ekosistem: {
      platforme: platforme.length,
      itProizvodi: itProizvodi.length,
      mobilneCentrale: MOBILNE_CENTRALE,
    },
    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
      procenat: procenat.toExponential(2),
    },
    rast: {
      rutaPoIteraciji: (TOTAL_ROUTES / AUTOFINISH_COUNT).toFixed(2),
      apiPoIteraciji: (TOTAL_API_ROUTES / AUTOFINISH_COUNT).toFixed(2),
      dijagnostikaPoIteraciji: (TOTAL_DIAGNOSTIKA / AUTOFINISH_COUNT).toFixed(2),
    },
  };

  return NextResponse.json({
    status: 'aktivan',
    naziv: `Autofinish Metrike Ekosistema — Iteracija #${AUTOFINISH_COUNT}`,
    opis: 'Agregirane metrike celokupnog ekosistema — platforma, OMEGA AI, SpajaPro, rast po iteraciji',
    verzija: APP_VERSION,

    metrike,

    sumarno: {
      ukupnoEntiteta: TOTAL_ROUTES + TOTAL_DIAGNOSTIKA + OMEGA_AI_PERSONA_UKUPNO + platforme.length + itProizvodi.length,
      format: 'routes + diagnostics + OMEGA instances + platforms + products',
    },

    timestamp: new Date().toISOString(),
  });
}
