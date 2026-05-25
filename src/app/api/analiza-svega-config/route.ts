import { NextResponse } from 'next/server';
import {
  ANALIZA_DOMAIN_WEIGHTS,
  clearAnalizaDomainWeightsOverride,
  getAnalizaDomainWeights,
  getAnalizaDomainWeightsOverride,
  setAnalizaDomainWeightsOverride,
  type AnalizaScoreWeights,
} from '@/lib/analiza-svega';

const WEIGHT_KEYS: Array<keyof AnalizaScoreWeights> = [
  'ekosistem',
  'infrastruktura',
  'finansije',
  'bezbednost',
  'operativa',
  'autofinish',
  'protokoli',
];

function isValidWeightInput(weights: unknown): weights is AnalizaScoreWeights {
  if (!weights || typeof weights !== 'object') return false;
  const record = weights as Record<string, unknown>;
  return WEIGHT_KEYS.every((key) => typeof record[key] === 'number' && Number.isFinite(record[key]));
}

/**
 * GET /api/analiza-svega-config
 * Vraća aktivne težine i trenutno override stanje.
 */
export async function GET() {
  return NextResponse.json({
    defaultWeights: ANALIZA_DOMAIN_WEIGHTS,
    activeWeights: getAnalizaDomainWeights(),
    overrideWeights: getAnalizaDomainWeightsOverride(),
    hasOverride: getAnalizaDomainWeightsOverride() !== null,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/analiza-svega-config
 * Body:
 *  - { "weights": { ... } }  -> postavlja override
 *  - { "reset": true }        -> resetuje override
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { weights?: unknown; reset?: boolean };

    if (body.reset === true) {
      clearAnalizaDomainWeightsOverride();
      return NextResponse.json({
        status: 'override-reset',
        activeWeights: getAnalizaDomainWeights(),
        overrideWeights: null,
        timestamp: new Date().toISOString(),
      });
    }

    if (!isValidWeightInput(body.weights)) {
      return NextResponse.json(
        { error: 'Nevalidan payload za težine domena' },
        { status: 400 },
      );
    }

    setAnalizaDomainWeightsOverride(body.weights);
    return NextResponse.json({
      status: 'override-set',
      activeWeights: getAnalizaDomainWeights(),
      overrideWeights: getAnalizaDomainWeightsOverride(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[analiza-svega-config] failure', error);
    return NextResponse.json(
      {
        error: 'Neuspešna konfiguracija ANALIZA SVEGA',
        code: 'ANALIZA_SVEGA_CONFIG_ERROR',
      },
      { status: 500 },
    );
  }
}
