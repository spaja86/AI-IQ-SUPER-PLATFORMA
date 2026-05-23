import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getKastlerSignalReadinessSummary, getKastlerTVMonetizationSummary } from '@/lib/kastler-tv-signal-request';
import { getTVSignalReadiness } from '@/lib/spaja-digitalni-televizor';

export async function GET() {
  const kastler = getKastlerSignalReadinessSummary();
  const tv = getTVSignalReadiness();
  const monetizacija = getKastlerTVMonetizationSummary();

  return NextResponse.json({
    status: 'aktivan',
    route: '/api/kastler-tv-signal-status',
    naziv: 'Kastler TV Signal Status',
    verzija: APP_VERSION,
    kastler,
    tv,
    monetizacija,
    timestamp: new Date().toISOString(),
  });
}
