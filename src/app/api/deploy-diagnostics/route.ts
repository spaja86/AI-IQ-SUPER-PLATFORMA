import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import {
  classifyDeploymentFailure,
  getDeployDiagnosticsSnapshot,
  probeVercelDeployment,
} from '@/lib/deploy-diagnostics';
import { getOpenAISafe } from '@/lib/openai/client';
import { getStripeSafe } from '@/lib/stripe/config';
import { getSupabaseClientSafe } from '@/lib/supabase/client';
import { getSupabaseServerClientSafe } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/deploy-diagnostics
 *
 * Query params:
 * - deploymentId: Vercel deployment ID za direktan API probe
 * - signal: raw poruka greške (npr. "fra1::...")
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deploymentId = searchParams.get('deploymentId') ?? undefined;
  const signalInput = searchParams.get('signal') ?? undefined;

  const snapshot = getDeployDiagnosticsSnapshot();
  const userSignal = classifyDeploymentFailure(signalInput);
  const vercelProbe = await probeVercelDeployment(deploymentId);

  const gracefulProviders = {
    supabaseClient: getSupabaseClientSafe() !== null,
    supabaseServer: getSupabaseServerClientSafe() !== null,
    openai: getOpenAISafe() !== null,
    stripe: getStripeSafe() !== null,
  };

  return NextResponse.json({
    status: 'ok',
    opis: 'Deploy dijagnostika za build/runtime razdvajanje i env/routing rizike',
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    requested: {
      deploymentId: deploymentId ?? null,
      signal: signalInput ?? null,
    },
    failureSignals: {
      fromUserSignal: userSignal,
      fromVercelProbe: vercelProbe.signal,
      preferred: vercelProbe.signal.kind !== 'unknown' ? vercelProbe.signal : userSignal,
    },
    vercelProbe,
    checks: snapshot,
    gracefulProviders,
    hardFailPolicy: [
      'Billing mutacije i webhook rute koriste strict klijente (OpenAI/Stripe/Supabase).',
      'Javne dijagnostičke rute i read-only endpoint-i mogu koristiti safe varijante.',
    ],
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-App-Version': APP_VERSION,
      'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
    },
  });
}
