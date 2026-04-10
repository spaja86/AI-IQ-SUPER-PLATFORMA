import { NextResponse } from 'next/server';
import { spajaBaza, getBazaStatistika } from '@/lib/spaja-baza';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA BAZA — Status',
    verzija: APP_VERSION,
    status: spajaBaza.status,
    tip: spajaBaza.tip,
    statistika: getBazaStatistika(),
    timestamp: new Date().toISOString(),
  });
}
