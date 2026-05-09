import { NextResponse } from 'next/server';
import { omegaAiMaksimalniSuport } from '@/lib/omega-ai-maksimalni-suport';
import { APP_VERSION } from '@/lib/constants';
import { getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';

/**
 * 📞 OMEGA AI Maksimalni Suport — Status API
 *
 * Zdravlje i status sistema maksimalnog suporta.
 */
export async function GET() {
  const operativa = getOperativnaSpremnost();

  return NextResponse.json({
    sistem: 'OMEGA AI Maksimalni Suport — Status',
    verzija: APP_VERSION,
    status: omegaAiMaksimalniSuport.status,
    statistika: omegaAiMaksimalniSuport.statistika,
    ukupnoTelefona: omegaAiMaksimalniSuport.telefoni.length,
    javniBrojevi: omegaAiMaksimalniSuport.javniBrojevi,
    routingPravila: omegaAiMaksimalniSuport.routingPravila,
    operativniOpseg: omegaAiMaksimalniSuport.operativniOpseg,
    runtimeSpremnost: operativa.spremnost.support,
    ukupnoTiketa: omegaAiMaksimalniSuport.statistika.ukupnoTiketa,
    timestamp: new Date().toISOString(),
  });
}
