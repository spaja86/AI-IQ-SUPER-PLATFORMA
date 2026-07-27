import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getMikiMausIPajaPatakData } from '@/lib/miki-maus-i-paja-patak';

export async function GET() {
  const data = getMikiMausIPajaPatakData();

  return NextResponse.json({
    status: 'aktivan',
    modul: data.naziv,
    verzija: APP_VERSION,
    data,
    timestamp: new Date().toISOString(),
  });
}
