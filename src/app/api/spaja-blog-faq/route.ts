import { NextResponse } from 'next/server';
import { spajaBlogFaq } from '@/lib/spaja-blog-faq';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Blog & FAQ',
    verzija: APP_VERSION,
    blogFaq: spajaBlogFaq,
    timestamp: new Date().toISOString(),
  });
}
