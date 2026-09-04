import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getNotificationPreferencesView } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get('state') ?? 'US';
  const userId = searchParams.get('userId') ?? 'preview-user';

  return NextResponse.json(
    {
      data: getNotificationPreferencesView(stateCode, userId),
      timestamp: new Date().toISOString(),
    },
    { headers: { 'X-App-Version': APP_VERSION } },
  );
}
