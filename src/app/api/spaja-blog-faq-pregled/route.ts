import { NextResponse } from 'next/server';
import { getBlogFaqPregled } from '@/lib/spaja-blog-faq';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Blog & FAQ — Pregled',
    verzija: APP_VERSION,
    pregled: getBlogFaqPregled(),
    timestamp: new Date().toISOString(),
  });
}
