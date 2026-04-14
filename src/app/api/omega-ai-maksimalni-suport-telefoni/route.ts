import { NextResponse } from 'next/server';
import { omegaAiMaksimalniSuport } from '@/lib/omega-ai-maksimalni-suport';
import { APP_VERSION } from '@/lib/constants';

/**
 * 📞 OMEGA AI Maksimalni Suport — Telefoni API
 *
 * Lista svih telefonskih linija za 21 OMEGA AI persona.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Maksimalni Suport — Telefoni',
    verzija: APP_VERSION,
    telefoni: omegaAiMaksimalniSuport.telefoni,
    timestamp: new Date().toISOString(),
  });
}
