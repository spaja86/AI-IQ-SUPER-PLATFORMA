import { NextRequest, NextResponse } from 'next/server';
import { rateLimitKey, checkRateLimitGlobal } from '@/lib/rate-limit';
import {
  BILLING_UPGRADE_DISCLOSURE,
  buildUpgradeCompanyRequestRecord,
  validateUpgradeCompanyRequestPayload,
} from '@/lib/billing/upgrade-disclosure';
import { getEnterpriseZahtevi, getKontaktKanal } from '@/lib/kompanija-spaja-operativa';

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (clientIp !== 'unknown') {
    const allowed = await checkRateLimitGlobal(rateLimitKey(clientIp, '/api/billing-upgrade-company-request'), 30, 3600);
    if (!allowed) {
      return NextResponse.json({ error: 'Previše zahteva. Pokušajte ponovo kasnije.' }, { status: 429 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON payload.', code: 'INVALID_JSON' }, { status: 400 });
  }

  const validation = validateUpgradeCompanyRequestPayload(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Neispravan payload za company billing transfer zahtev.', details: validation.errors, code: 'INVALID_PAYLOAD' },
      { status: 422 },
    );
  }

  const payload = body as {
    expectedTotalUsd: number;
    version: string;
    accountEmail: string;
    ownerName: string;
    acceptanceText: string;
    autoSendToCompanyBilling: boolean;
    sendMode?: 'ready_to_send' | 'dispatch_internal';
  };

  const record = buildUpgradeCompanyRequestRecord(payload);
  const githubEnterprise = getEnterpriseZahtevi().find((z) => z.id === 'github');

  return NextResponse.json({
    status: 'ok',
    route: '/api/billing-upgrade-company-request',
    disclosure: BILLING_UPGRADE_DISCLOSURE,
    requestRecord: record,
    dispatch: {
      kanal: getKontaktKanal('billing')?.email ?? 'billing@spaja.rs',
      cc: [getKontaktKanal('sales')?.email ?? 'sales@spaja.rs'],
      intent: 'company-billing-transfer-and-best-subscription-request',
    },
    githubEnterpriseContext: githubEnterprise
      ? {
          naslov: githubEnterprise.naslov,
          trazeniPlanovi: githubEnterprise.trazeniPlanovi,
          trazeneOpcije: githubEnterprise.trazeneOpcije,
          kanalPodnosenja: githubEnterprise.kanalPodnosenja,
          eksplicitniKontekst: githubEnterprise.eksplicitniKontekst ?? null,
        }
      : null,
    timestamp: new Date().toISOString(),
  });
}
