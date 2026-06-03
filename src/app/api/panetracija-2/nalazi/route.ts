// Panetracija 2 — GET /api/panetracija-2/nalazi
// Kompanija SPAJA — Digitalna Industrija
//
// Vraća filtrirani niz V2 PentestFindingV2.
// Query params:
//   ?severity=critical|high|medium|low|info
//   ?kategorija=injection|broken-auth|xss|xxe|insecure-deserialization|
//               vulnerable-components|security-misconfiguration|
//               sensitive-data-exposure|broken-access-control|logging-monitoring
//   ?status=open|mitigated|fixed|accepted|wontfix
// Zahteva: ΩClearanceLevel.ADMIN, scope: panetracija2:read

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPentestFindingsV2 } from '@/lib/panetracija-2';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const VALID_SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'] as const;
const VALID_KATEGORIJE = [
  'injection',
  'broken-auth',
  'xss',
  'xxe',
  'insecure-deserialization',
  'vulnerable-components',
  'security-misconfiguration',
  'sensitive-data-exposure',
  'broken-access-control',
  'logging-monitoring',
] as const;
const VALID_STATUSI = ['open', 'mitigated', 'fixed', 'accepted', 'wontfix'] as const;

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/panetracija-2/nalazi'), 60, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'TOO_MANY_REQUESTS',
        verzija: APP_VERSION,
        autofinishIteracija: AUTOFINISH_COUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity') ?? undefined;
  const kategorija = searchParams.get('kategorija') ?? undefined;
  const status = searchParams.get('status') ?? undefined;

  if (severity !== undefined && !(VALID_SEVERITIES as readonly string[]).includes(severity)) {
    return NextResponse.json(
      {
        error: 'INVALID_SEVERITY',
        dozvoljeni: [...VALID_SEVERITIES],
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 400, headers: { 'X-App-Version': APP_VERSION } },
    );
  }

  if (kategorija !== undefined && !(VALID_KATEGORIJE as readonly string[]).includes(kategorija)) {
    return NextResponse.json(
      {
        error: 'INVALID_KATEGORIJA',
        dozvoljeni: [...VALID_KATEGORIJE],
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 400, headers: { 'X-App-Version': APP_VERSION } },
    );
  }

  if (status !== undefined && !(VALID_STATUSI as readonly string[]).includes(status)) {
    return NextResponse.json(
      {
        error: 'INVALID_STATUS',
        dozvoljeni: [...VALID_STATUSI],
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 400, headers: { 'X-App-Version': APP_VERSION } },
    );
  }

  const nalazi = getPentestFindingsV2({ severity, kategorija, status });

  return NextResponse.json(
    {
      status: 'ok',
      filteri: {
        severity: severity ?? 'all',
        kategorija: kategorija ?? 'all',
        status: status ?? 'all',
      },
      ukupno: nalazi.length,
      nalazi,
      verzija: APP_VERSION,
      autofinishIteracija: AUTOFINISH_COUNT,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-App-Version': APP_VERSION,
        'X-Autofinish-Iteracija': String(AUTOFINISH_COUNT),
      },
    },
  );
}
