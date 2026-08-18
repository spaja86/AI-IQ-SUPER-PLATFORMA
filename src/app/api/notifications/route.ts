import { NextRequest, NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  createSupabaseNotificationRepository,
  dispatchNotification,
  getNotificationOverview,
} from '@/lib/notifications';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  return NextResponse.json(
    {
      data: getNotificationOverview(),
      timestamp: new Date().toISOString(),
    },
    { headers: { 'X-App-Version': APP_VERSION } },
  );
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  if (typeof payload.userId !== 'string' || payload.userId.length === 0) {
    return NextResponse.json({ error: 'userId je obavezan' }, { status: 400 });
  }
  if (typeof payload.action !== 'string' || payload.action.length === 0) {
    return NextResponse.json({ error: 'action je obavezan' }, { status: 400 });
  }

  const persist = payload.persist === true;
  const repository = persist ? createSupabaseNotificationRepository(getSupabaseServerClient()) : undefined;
  const result = await dispatchNotification(
    {
      userId: payload.userId,
      action: payload.action,
      stateCode: typeof payload.stateCode === 'string' ? payload.stateCode : undefined,
      category: payload.category === 'billing' || payload.category === 'system' || payload.category === 'alert'
        ? payload.category
        : undefined,
      subject: typeof payload.subject === 'string' ? payload.subject : undefined,
      body: typeof payload.body === 'string' ? payload.body : undefined,
      channels: Array.isArray(payload.channels)
        ? payload.channels.filter((value): value is 'email' | 'sms' | 'push' | 'in-app' | 'webhook' => (
          value === 'email' || value === 'sms' || value === 'push' || value === 'in-app' || value === 'webhook'
        ))
        : undefined,
      templateId: typeof payload.templateId === 'string' ? payload.templateId : undefined,
      templateVars: typeof payload.templateVars === 'object' && payload.templateVars !== null
        ? Object.fromEntries(
          Object.entries(payload.templateVars).map(([key, value]) => [key, String(value)]),
        )
        : undefined,
      metadata: typeof payload.metadata === 'object' && payload.metadata !== null
        ? payload.metadata as Record<string, unknown>
        : undefined,
    },
    { repository },
  );

  return NextResponse.json(
    {
      data: result,
      mode: persist ? 'persisted' : 'dry-run',
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: { 'X-App-Version': APP_VERSION } },
  );
}
