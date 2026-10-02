import { NextRequest, NextResponse } from 'next/server';
import type { DeployEnvironment } from '@/lib/deploy/deploy-registry';
import { triggerPlatformDeploy } from '@/lib/deploy/deploy-trigger';
import { recordDeployHistory } from '@/lib/deploy/deploy-history';
import { authorizeDeployRequest } from '@/lib/deploy/deploy-authorization';
import { APP_VERSION } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface TriggerBody {
  platformId?: unknown;
  environment?: unknown;
  confirmToken?: unknown;
}

const VALID_ENVIRONMENTS: DeployEnvironment[] = ['dev', 'staging', 'production'];

/**
 * POST /api/deploy-platforma/trigger
 *
 * Pokreće deployment za datu platformu.
 *
 * Body: { platformId: string, environment: 'dev'|'staging'|'production', confirmToken?: string }
 *
 * Bezbednost:
 * - Production deploy zahteva confirmToken === 'DEPLOY_PRODUCTION'
 * - Verifikuje ACCESS Bearer token i ADMIN clearance u handler-u
 */
export async function POST(request: NextRequest) {
  const authorization = await authorizeDeployRequest(request);
  if (!authorization.ok) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }
  let body: TriggerBody = {};
  try {
    body = await request.json() as TriggerBody;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON body' }, { status: 400 });
  }

  const { platformId, environment, confirmToken } = body;

  if (typeof platformId !== 'string' || !platformId.trim()) {
    return NextResponse.json({ error: 'platformId je obavezan' }, { status: 400 });
  }

  if (!VALID_ENVIRONMENTS.includes(environment as DeployEnvironment)) {
    return NextResponse.json(
      { error: `environment mora biti jedan od: ${VALID_ENVIRONMENTS.join(', ')}` },
      { status: 400 },
    );
  }

  const triggeredBy = authorization.identityId;

  const result = await triggerPlatformDeploy({
    platformId: platformId.trim(),
    environment: environment as DeployEnvironment,
    confirmToken: typeof confirmToken === 'string' ? confirmToken : undefined,
    triggeredBy,
  });

  const historyEntry = recordDeployHistory(result, triggeredBy, environment as DeployEnvironment);

  const statusCode = result.success ? 200 : 422;

  return NextResponse.json(
    {
      success: result.success,
      verzija: APP_VERSION,
      result,
      historyEntryId: historyEntry.id,
      timestamp: new Date().toISOString(),
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store',
        'X-App-Version': APP_VERSION,
      },
    },
  );
}
