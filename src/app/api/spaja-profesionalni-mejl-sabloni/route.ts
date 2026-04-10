import { NextResponse } from 'next/server';
import { mejlSabloni } from '@/lib/spaja-profesionalni-mejl';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Profesionalni Mejl — Šabloni',
    verzija: APP_VERSION,
    ukupnoSablona: mejlSabloni.length,
    sabloni: mejlSabloni,
    timestamp: new Date().toISOString(),
  });
}
