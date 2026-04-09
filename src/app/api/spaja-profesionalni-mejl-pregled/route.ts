import { NextResponse } from 'next/server';
import { getMejlSistemPregled } from '@/lib/spaja-profesionalni-mejl';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Profesionalni Mejl — Pregled',
    verzija: APP_VERSION,
    pregled: getMejlSistemPregled(),
    timestamp: new Date().toISOString(),
  });
}
