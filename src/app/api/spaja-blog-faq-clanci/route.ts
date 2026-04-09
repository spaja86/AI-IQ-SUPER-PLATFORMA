import { NextResponse } from 'next/server';
import { spajaBlogFaq } from '@/lib/spaja-blog-faq';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Blog & FAQ — Clanci',
    verzija: APP_VERSION,
    ukupnoClanaka: spajaBlogFaq.clanci.length,
    clanci: spajaBlogFaq.clanci,
    timestamp: new Date().toISOString(),
  });
}
