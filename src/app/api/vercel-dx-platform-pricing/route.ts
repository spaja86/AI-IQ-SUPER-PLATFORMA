import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { VERCEL_DX_PLATFORM_PRICING } from '@/lib/billing/vercel-dx-platform-pricing';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    route: '/api/vercel-dx-platform-pricing',
    verzija: APP_VERSION,
    pricing: VERCEL_DX_PLATFORM_PRICING,
    timestamp: new Date().toISOString(),
  });
}
