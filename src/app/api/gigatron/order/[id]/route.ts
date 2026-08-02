import { NextRequest, NextResponse } from 'next/server';
import { getNarudzbinaById } from '@/lib/gigatron/gigatron-procurement';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id?.trim()) {
    return NextResponse.json({ ok: false, poruka: 'ID narudžbine je obavezan.' }, { status: 400 });
  }

  const narudzbina = getNarudzbinaById(id);
  if (!narudzbina) {
    return NextResponse.json({ ok: false, poruka: `Narudžbina '${id}' nije pronađena.` }, { status: 404 });
  }

  return NextResponse.json({ ok: true, narudzbina, timestamp: new Date().toISOString() });
}
