import { NextResponse } from 'next/server';
import { spajaBlogFaq } from '@/lib/spaja-blog-faq';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Blog & FAQ — Status',
    verzija: APP_VERSION,
    status: spajaBlogFaq.status,
    ukupnoClanaka: spajaBlogFaq.clanci.length,
    ukupnoFaqPitanja: spajaBlogFaq.faqPitanja.length,
    timestamp: new Date().toISOString(),
  });
}
