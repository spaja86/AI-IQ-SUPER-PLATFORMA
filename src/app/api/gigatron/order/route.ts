import { NextRequest, NextResponse } from 'next/server';
import { kreirajNarudzbu, type KreirajNarudzbuInput } from '@/lib/gigatron/gigatron-procurement';
import { gigatronKatalog } from '@/lib/gigatron/gigatron-catalog';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let body: KreirajNarudzbuInput;
  try {
    body = await request.json() as KreirajNarudzbuInput;
  } catch {
    return NextResponse.json({ ok: false, poruka: 'Neispravan JSON format zahteva.' }, { status: 400 });
  }

  const rezultat = kreirajNarudzbu(body, gigatronKatalog);

  if (!rezultat.ok) {
    return NextResponse.json({ ok: false, greske: rezultat.greske }, { status: 422 });
  }

  return NextResponse.json(
    { ok: true, narudzbina: rezultat.narudzbina, timestamp: new Date().toISOString() },
    { status: 201 },
  );
}
