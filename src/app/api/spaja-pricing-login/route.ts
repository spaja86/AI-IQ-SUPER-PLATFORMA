import { NextResponse } from 'next/server';
import { spajaPricingLogin } from '@/lib/spaja-pricing-login';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Pricing & Login',
    verzija: APP_VERSION,
    standardizovaniPretplataStatusi: spajaPricingLogin.standardizovaniPretplataStatusi,
    onboardingGoNoGoModel: spajaPricingLogin.onboardingGoNoGoModel,
    pricingLogin: spajaPricingLogin,
    timestamp: new Date().toISOString(),
  });
}
