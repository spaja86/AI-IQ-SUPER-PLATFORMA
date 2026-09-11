import { NextResponse } from 'next/server';
import { getPricingLoginPregled } from '@/lib/spaja-pricing-login';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const pregled = getPricingLoginPregled();
  return NextResponse.json({
    sistem: 'SPAJA Pricing & Login — Pregled',
    verzija: APP_VERSION,
    standardizovaniPretplataStatusi: pregled.standardizovaniPretplataStatusi,
    pregled,
    timestamp: new Date().toISOString(),
  });
}
