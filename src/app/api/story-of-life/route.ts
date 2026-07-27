import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getStoryOfLifeData } from '@/lib/story-of-life';

export async function GET() {
  const data = getStoryOfLifeData();

  return NextResponse.json({
    status: 'aktivan',
    modul: data.naziv,
    verzija: APP_VERSION,
    data,
    timestamp: new Date().toISOString(),
  });
}
