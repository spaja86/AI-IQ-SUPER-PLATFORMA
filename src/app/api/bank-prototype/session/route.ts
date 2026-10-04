import { type NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { readBankSession } from '@/lib/bank-prototype';

export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
  try {
    const result = await readBankSession(request.headers.get('authorization'), verifyUserFromToken);
    if (result.status === 401) return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401, headers });
    return NextResponse.json({ data: result.data }, { headers });
  } catch {
    return NextResponse.json({ error: 'Verifikacija trenutno nije dostupna.' }, { status: 503, headers });
  }
}
