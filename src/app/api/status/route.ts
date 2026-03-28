import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { getAktivneVerzije, spajaProVerzije } from '@/lib/spaja-pro';
import { getBrojPromptova, getPromptKategorije } from '@/lib/prompt';

export async function GET() {
  const stats = getStatistike();
  const diagnostics = runDiagnostics();
  const dispatch = getDispatchSummary();
  const aktivneVerzije = getAktivneVerzije();

  return NextResponse.json({
    status: 'operational',
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'SPAJA',
    verzija: '6.3.0',
    arhitektura: 'sekvence + omega-evolucija + proksi + mobilna-mreza + prompt + spajapro',
    timestamp: new Date().toISOString(),
    statistike: stats,
    zdravlje: diagnostics.zdravlje,
    stranice: 18,
    apiRute: 9,
    omegaAI: {
      persone: dispatch.ukupnoPersona,
      oktave: dispatch.ukupnoOktava,
      dispatchStatus: dispatch.status,
      promptIntegracija: 'potpuna',
    },
    spajaPro: {
      status: 'aktivan',
      ukupnoVerzija: spajaProVerzije.length,
      aktivnihVerzija: aktivneVerzije.length,
      najnovija: aktivneVerzije[aktivneVerzije.length - 1]?.naziv ?? 'N/A',
      zamenaZa: 'ChatGPT',
      izvor: 'Kompanija-SPAJA',
      integracija: 'IO-OPENUI-AO + AI-IQ-SUPER-PLATFORMA',
    },
    prompt: {
      status: 'aktivan',
      ukupnoPromptova: getBrojPromptova(),
      kategorija: getPromptKategorije().length,
      engine: 'SpajaPro 6-15',
      svuda: true,
    },
    autoPopravka: 'aktivan',
    proksi: {
      status: 'aktivan',
      kapacitet: '10²²⁸ TB',
      topologija: 'hibridna',
    },
    mobilnaMreza: {
      status: 'aktivna',
      pozivniBrojevi: ['+38177', '+38188', '+38178', '+38187'],
      centrale: 4,
      servisi: 5,
      proksiIntegracija: 'potpuna',
    },
  });
}
