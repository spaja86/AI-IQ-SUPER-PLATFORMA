import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getNotificationHistoryView } from '@/lib/notifications';

export async function GET() {
  return NextResponse.json(
    {
      data: getNotificationHistoryView(),
      timestamp: new Date().toISOString(),
    },
    { headers: { 'X-App-Version': APP_VERSION } },
  );
}
