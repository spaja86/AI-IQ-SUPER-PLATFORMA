import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { B2B_PLATFORM_CATALOG } from '@/lib/b2b-platform-catalog';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });

  return NextResponse.json({
    rezim: 'read-only',
    napomena: 'Katalog sadrži javne linkove. Ne deli korisnike, sesije, podatke, novčanike niti finansijske funkcije između platformi.',
    platforme: B2B_PLATFORM_CATALOG,
  });
}
