import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { canReadB2BControlCenter } from '@/lib/b2b-control-center-auth';
import { getPlatformMonitoringSnapshot } from '@/lib/b2b-platform-monitoring';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });
  if (!canReadB2BControlCenter(user)) return NextResponse.json({ error: 'B2B read-only pristup nije odobren.' }, { status: 403 });

  return NextResponse.json({
    rezim: 'read-only',
    napomena: 'Nadzor ne pokreće akcije. Bez konfigurisanog monitoring izvora ne prikazuje se izmišljeni live status.',
    platforme: getPlatformMonitoringSnapshot(),
    timestamp: new Date().toISOString(),
  });
}
