import { NextResponse } from 'next/server';
import { profesionalniMejlSistem } from '@/lib/spaja-profesionalni-mejl';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Profesionalni Mejl Sistem',
    verzija: APP_VERSION,
    mejlSistem: profesionalniMejlSistem,
    timestamp: new Date().toISOString(),
  });
}
