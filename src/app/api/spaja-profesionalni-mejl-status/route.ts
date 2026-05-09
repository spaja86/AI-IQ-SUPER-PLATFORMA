import { NextResponse } from 'next/server';
import { profesionalniMejlSistem } from '@/lib/spaja-profesionalni-mejl';
import { APP_VERSION } from '@/lib/constants';
import { getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';

export async function GET() {
  const operativa = getOperativnaSpremnost();

  return NextResponse.json({
    sistem: 'SPAJA Profesionalni Mejl — Status',
    verzija: APP_VERSION,
    status: profesionalniMejlSistem.status,
    statistika: profesionalniMejlSistem.statistika,
    domeni: profesionalniMejlSistem.domeni,
    operativniKanali: profesionalniMejlSistem.operativniKanali,
    operativniTokovi: profesionalniMejlSistem.operativniTokovi,
    fallbackKontakt: profesionalniMejlSistem.fallbackKontakt,
    runtimeSpremnost: operativa.spremnost.mail,
    ukupnoMogucnosti: profesionalniMejlSistem.mogucnosti.length,
    timestamp: new Date().toISOString(),
  });
}
