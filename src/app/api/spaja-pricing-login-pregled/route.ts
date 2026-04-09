import { NextResponse } from 'next/server';
import { getPricingLoginPregled } from '@/lib/spaja-pricing-login';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Pricing & Login — Pregled',
    verzija: APP_VERSION,
    pregled: getPricingLoginPregled(),
    timestamp: new Date().toISOString(),
  });
}
