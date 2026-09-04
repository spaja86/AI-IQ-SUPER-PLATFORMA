import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliateEvent, type TrackAffiliateInput } from '@/lib/gigatron/gigatron-affiliate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: TrackAffiliateInput;
  try {
    body = await request.json() as TrackAffiliateInput;
  } catch {
    return NextResponse.json({ ok: false, poruka: 'Neispravan JSON format zahteva.' }, { status: 400 });
  }

  const rezultat = trackAffiliateEvent(body);

  if (!rezultat.ok) {
    return NextResponse.json({ ok: false, poruka: rezultat.poruka }, { status: 422 });
  }

  return NextResponse.json(
    { ok: true, event: rezultat.event, timestamp: new Date().toISOString() },
    { status: 201 },
  );
}
