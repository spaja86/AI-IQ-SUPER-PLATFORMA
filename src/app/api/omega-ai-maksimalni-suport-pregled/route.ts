import { NextResponse } from 'next/server';
import { getMaksimalniSuportPregled } from '@/lib/omega-ai-maksimalni-suport';
import { APP_VERSION } from '@/lib/constants';

/**
 * 📞 OMEGA AI Maksimalni Suport — Pregled API
 *
 * Sažeti pregled sistema maksimalnog suporta.
 */
export async function GET() {
  const pregled = getMaksimalniSuportPregled();

  return NextResponse.json({
    sistem: 'OMEGA AI Maksimalni Suport — Pregled',
    ...pregled,
    verzija: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
}
