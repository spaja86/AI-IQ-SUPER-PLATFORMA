import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { canReadB2BControlCenter } from '@/lib/b2b-control-center-auth';
import { getB2BVercelDeploymentSummary, getIncidentSummaries } from '@/lib/b2b-vercel-deployment-summary';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });
  if (!canReadB2BControlCenter(user)) return NextResponse.json({ error: 'B2B read-only pristup nije odobren.' }, { status: 403 });

  const deploymenti = await getB2BVercelDeploymentSummary();
  return NextResponse.json({
    rezim: 'read-only',
    napomena: 'Sažetak prikazuje samo poslednje stanje deploymenta. Ne uključuje billing, tokene, URL-ove, deploy hook-ove ili kontrole akcija.',
    deploymenti,
    incidenti: getIncidentSummaries(deploymenti),
    timestamp: new Date().toISOString(),
  });
}
