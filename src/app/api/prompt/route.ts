import { NextResponse } from 'next/server';
import { getPromptBiblioteka, getPromptKategorije } from '@/lib/prompt';
import { omegaPersone } from '@/lib/omega-ai';

export async function GET() {
  const biblioteka = getPromptBiblioteka();
  const kategorije = getPromptKategorije();

  return NextResponse.json({
    sistem: 'Prompt Sistem — Kompanija SPAJA',
    verzija: '1.0.0',
    opis: 'Centralni Prompt sistem za ceo ekosistem. Prompt je svuda.',
    engine: 'SpajaPro 6-15',
    statistike: {
      ukupnoPromptova: biblioteka.ukupnoPromptova,
      kategorija: kategorije.length,
      personaPromptova: biblioteka.personaPromptovi,
      platformaPromptova: biblioteka.platformaPromptovi,
      spajaProVerzije: biblioteka.spajaProVerzije,
    },
    kategorije: biblioteka.kategorije,
    personeSaPromptom: omegaPersone.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      ikona: p.ikona,
      prompt: p.prompt,
      spajaProVerzija: p.spajaProVerzija,
      oktavniNivo: p.oktavniNivo,
    })),
    promptovi: biblioteka.promptovi.map((p) => ({
      id: p.id,
      naziv: p.naziv,
      kategorija: p.kategorija,
      spajaProVerzija: p.spajaProVerzija,
      ciljnaPersona: p.ciljnaPersona,
      ciljnaPlatforma: p.ciljnaPlatforma,
      tagovi: p.tagovi,
      prioritet: p.prioritet,
    })),
    timestamp: new Date().toISOString(),
  });
}
