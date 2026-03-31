import { NextResponse } from 'next/server';
import { spajaUltraOmegaCore, getSpecSummary } from '@/lib/spaja-ultra-omega-core';
import { univerzalniPromptSistem, getPromptSummary, getBrojPoKategoriji } from '@/lib/spaja-univerzalni-prompt';

export async function GET() {
  const specSummary = getSpecSummary();
  const promptSummary = getPromptSummary();
  const poKategoriji = getBrojPoKategoriji();

  return NextResponse.json({
    sistem: 'SPAJA Univerzalni Prompt',
    jezgro: 'SpajaUltraOmegaCore -∞Ω+∞',
    verzija: spajaUltraOmegaCore.verzija,
    spektar: spajaUltraOmegaCore.spektar,
    jezik: specSummary,
    prompt: promptSummary,
    kategorije: univerzalniPromptSistem.kategorije,
    promptoviPoKategoriji: poKategoriji,
    runtime: {
      naziv: spajaUltraOmegaCore.runtime.naziv,
      status: spajaUltraOmegaCore.runtime.status,
      oktave: spajaUltraOmegaCore.runtime.oktave,
      persone: spajaUltraOmegaCore.runtime.persone,
      kapacitet: spajaUltraOmegaCore.runtime.kapacitet,
    },
    timestamp: new Date().toISOString(),
  });
}
