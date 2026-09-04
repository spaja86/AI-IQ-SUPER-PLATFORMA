import { NextResponse } from 'next/server';
import { buildDigitalnaIndustrijaPregled } from '@/lib/digitalna-industrija-domen';

export async function GET() {
  return NextResponse.json(buildDigitalnaIndustrijaPregled());
}
