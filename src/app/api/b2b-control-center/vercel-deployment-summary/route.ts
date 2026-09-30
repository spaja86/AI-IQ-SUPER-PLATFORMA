import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { getB2BVercelDeploymentSummary } from '@/lib/b2b-vercel-deployment-summary';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });

  return NextResponse.json({
    rezim: 'read-only',
    napomena: 'Sažetak prikazuje samo poslednje stanje deploymenta. Ne uključuje billing, tokene, URL-ove, deploy hook-ove ili kontrole akcija.',
    deploymenti: await getB2BVercelDeploymentSummary(),
    timestamp: new Date().toISOString(),
  });
}
