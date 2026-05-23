import { NextRequest, NextResponse } from 'next/server';
import { rateLimitKey, checkRateLimitGlobal } from '@/lib/rate-limit';
import {
  KASTLER_TV_REQUEST_VERSION,
  getKastlerTVSignalRequestPackage,
  validateKastlerRequestPayload,
  buildKastlerRequestRecord,
  type KastlerRequestPayload,
} from '@/lib/kastler-tv-signal-request';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const paket = getKastlerTVSignalRequestPackage();
  return NextResponse.json({
    status: 'aktivan',
    route: '/api/kastler-tv-signal-request',
    verzija: APP_VERSION,
    packageVersion: KASTLER_TV_REQUEST_VERSION,
    paket,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (clientIp !== 'unknown') {
    const allowed = await checkRateLimitGlobal(rateLimitKey(clientIp, '/api/kastler-tv-signal-request'), 30, 3600);
    if (!allowed) {
      return NextResponse.json({ error: 'Previše zahteva. Pokušajte ponovo kasnije.' }, { status: 429 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: 'Neispravan JSON payload.',
        code: 'INVALID_JSON',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    );
  }

  const validation = validateKastlerRequestPayload(body);
  if (!validation.valid) {
    return NextResponse.json(
      {
        error: 'Neispravan payload za Kastler TV signal rikvest.',
        details: validation.errors,
        code: 'INVALID_PAYLOAD',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 422 },
    );
  }

  const payload = body as KastlerRequestPayload;
  const record = buildKastlerRequestRecord(payload);

  return NextResponse.json(
    {
      status: 'ok',
      route: '/api/kastler-tv-signal-request',
      packageVersion: KASTLER_TV_REQUEST_VERSION,
      requestRecord: record,
      dispatch: {
        kanal: 'partners@kastler.tv',
        intent: 'tv-signal-release-and-monetization-request',
      },
      napomena:
        'Ovaj endpoint validira i generiše rikvest zapis; ne šalje automatski eksterni zahtev ka Kastler partneru.',
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
