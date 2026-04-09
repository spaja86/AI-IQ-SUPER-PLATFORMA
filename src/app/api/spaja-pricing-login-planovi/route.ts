import { NextResponse } from 'next/server';
import { spajaPricingLogin } from '@/lib/spaja-pricing-login';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Pricing & Login — Planovi',
    verzija: APP_VERSION,
    ukupnoPlanova: spajaPricingLogin.planovi.length,
    planovi: spajaPricingLogin.planovi,
    timestamp: new Date().toISOString(),
  });
}
