import { NextResponse } from 'next/server';
import {
  univerzalniPromptovi,
  univerzalniPromptSistem,
  promptKategorije,
  getAktivnePromptove,
  getKriticnePromptove,
  getBrojPoKategoriji,
  getPromptSummary,
} from '@/lib/spaja-univerzalni-prompt';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivni = getAktivnePromptove();
  const kriticni = getKriticnePromptove();
  const poKategoriji = getBrojPoKategoriji();
  const summary = getPromptSummary();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Univerzalni Prompt Pregled — Kompletni Prompt Sistem',
    verzija: APP_VERSION,

    pregled: {
      ukupnoPromptova: univerzalniPromptovi.length,
      aktivnih: aktivni.length,
      kriticnih: kriticni.length,
      kategorija: promptKategorije.length,
    },

    sistem: {
      naziv: univerzalniPromptSistem.naziv,
      verzija: univerzalniPromptSistem.verzija,
    },

    poKategoriji: Object.entries(poKategoriji).map(([kategorija, broj]) => ({
      kategorija,
      broj,
    })),

    summary,

    promptovi: univerzalniPromptovi.slice(0, 10).map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      kategorija: p.kategorija,
      prioritet: p.prioritet,
    })),

    timestamp: new Date().toISOString(),
  });
}
