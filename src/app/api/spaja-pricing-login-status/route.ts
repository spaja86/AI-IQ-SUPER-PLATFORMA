import { NextResponse } from 'next/server';
import { spajaPricingLogin } from '@/lib/spaja-pricing-login';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Pricing & Login — Status',
    verzija: APP_VERSION,
    status: spajaPricingLogin.status,
    ukupnoPlanova: spajaPricingLogin.planovi.length,
    ukupnoLoginMetoda: spajaPricingLogin.loginMetode.length,
    timestamp: new Date().toISOString(),
  });
}
