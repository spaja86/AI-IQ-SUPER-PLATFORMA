import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getNotificationHealthView } from '@/lib/notifications';

export async function GET() {
  return NextResponse.json(
    {
      data: getNotificationHealthView(),
      timestamp: new Date().toISOString(),
    },
    { headers: { 'X-App-Version': APP_VERSION } },
  );
}
