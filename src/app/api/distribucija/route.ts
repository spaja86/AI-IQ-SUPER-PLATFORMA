import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getDistribucijaModel } from '@/lib/distribucija';

export async function GET() {
  const model = getDistribucijaModel();

  return NextResponse.json({
    status: model.status,
    naziv: model.naziv,
    verzija: APP_VERSION,
    distribucija: model,
    timestamp: new Date().toISOString(),
  });
}

