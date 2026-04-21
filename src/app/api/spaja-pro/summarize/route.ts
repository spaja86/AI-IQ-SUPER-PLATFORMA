// SpajaUltraOmegaCore -∞Ω+∞ — Summarize API
// POST /api/spaja-pro/summarize — sumarizuje tekst u TL;DR blok

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { sumirajTekst, primenjiSumarizaciju } from '@/lib/spaja-pro-mozak/summarizer';
import type { SumarizerMod } from '@/lib/spaja-pro-mozak/summarizer';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      tekst?: string;
      mod?: SumarizerMod;
      pragReci?: number;
      maxKljucnihTacaka?: number;
    };

    const { tekst, mod = 'auto', pragReci = 300, maxKljucnihTacaka = 5 } = body;

    if (!tekst || typeof tekst !== 'string' || tekst.trim().length === 0) {
      return NextResponse.json({ error: 'Tekst je obavezan.' }, { status: 400 });
    }

    if (tekst.length > 50000) {
      return NextResponse.json({ error: 'Tekst je predug (max 50.000 karaktera).' }, { status: 400 });
    }

    const rezultat = sumirajTekst(tekst, { mod, pragReci, maxKljucnihTacaka });
    const tekstSaSazetkom = primenjiSumarizaciju(tekst, { mod, pragReci, maxKljucnihTacaka });

    return NextResponse.json({
      trebaSazetak: rezultat.trebaSazetak,
      brojReci: rezultat.brojReci,
      kljucneTacke: rezultat.kljucneTacke,
      tldrBlok: rezultat.tldrBlok,
      procenatSkracivanja: rezultat.procenatSkracivanja,
      tekstSaSazetkom,
    });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Greška pri sumarizaciji.' }, { status: 500 });
  }
}
