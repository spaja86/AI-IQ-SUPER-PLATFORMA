import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getPlatformMonitoringSnapshot } from '@/lib/b2b-platform-monitoring';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });

  return NextResponse.json({
    rezim: 'read-only',
    napomena: 'Nadzor ne pokreće akcije. Bez konfigurisanog monitoring izvora ne prikazuje se izmišljeni live status.',
    platforme: getPlatformMonitoringSnapshot(),
    timestamp: new Date().toISOString(),
  });
}
