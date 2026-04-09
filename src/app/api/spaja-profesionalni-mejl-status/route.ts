import { NextResponse } from 'next/server';
import { profesionalniMejlSistem } from '@/lib/spaja-profesionalni-mejl';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Profesionalni Mejl — Status',
    verzija: APP_VERSION,
    status: profesionalniMejlSistem.status,
    statistika: profesionalniMejlSistem.statistika,
    domeni: profesionalniMejlSistem.domeni,
    ukupnoMogucnosti: profesionalniMejlSistem.mogucnosti.length,
    timestamp: new Date().toISOString(),
  });
}
