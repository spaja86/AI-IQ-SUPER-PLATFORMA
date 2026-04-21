// SpajaUltraOmegaCore -∞Ω+∞ — Memory API
// GET/PUT /api/spaja-pro/memory — upravljanje korisničkom memorijom

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import {
  parsirajMemoriju,
  dodajUMemoriju,
  formatirajZaSystemPrompt,
} from '@/lib/spaja-pro-mozak/kontekst-memorija';
import type { MemorijaStavka } from '@/lib/spaja-pro-mozak/kontekst-memorija';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('memory')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronađen.' }, { status: 404 });
    }

    const { stavke } = parsirajMemoriju(profile.memory);
    const sistemPromptRezultat = formatirajZaSystemPrompt(profile.memory);

    return NextResponse.json({
      memorijaTekst: profile.memory ?? '',
      stavke,
      jeRelevantna: sistemPromptRezultat.jeRelevantna,
      brojStavki: stavke.length,
    });
  } catch (error) {
    console.error('Memory GET error:', error);
    return NextResponse.json({ error: 'Greška servera.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = (await request.json()) as {
      akcija?: 'dodaj' | 'zameni' | 'obrisi';
      stavka?: Omit<MemorijaStavka, 'timestamp'>;
      memorijaTekst?: string;
    };

    const supabase = getSupabaseServerClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('memory')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil nije pronađen.' }, { status: 404 });
    }

    let novaMemorija: string | null = profile.memory;

    if (body.akcija === 'zameni' && typeof body.memorijaTekst === 'string') {
      // Direktna zamena celog memorijskog stringa
      if (body.memorijaTekst.length > 4000) {
        return NextResponse.json({ error: 'Memorija je preduga (max 4000 karaktera).' }, { status: 400 });
      }
      novaMemorija = body.memorijaTekst || null;
    } else if (body.akcija === 'dodaj' && body.stavka) {
      const stavkaSaTimestampom: MemorijaStavka = {
        ...body.stavka,
        timestamp: new Date().toISOString(),
      };
      novaMemorija = dodajUMemoriju(profile.memory, stavkaSaTimestampom);
    } else if (body.akcija === 'obrisi') {
      novaMemorija = null;
    } else {
      return NextResponse.json({ error: 'Nevalidna akcija. Koristite: dodaj, zameni, obrisi.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ memory: novaMemorija, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Greška pri ažuriranju memorije.' }, { status: 500 });
    }

    const { stavke } = parsirajMemoriju(novaMemorija);

    return NextResponse.json({
      success: true,
      memorijaTekst: novaMemorija ?? '',
      stavke,
      brojStavki: stavke.length,
    });
  } catch (error) {
    console.error('Memory PUT error:', error);
    return NextResponse.json({ error: 'Greška servera.' }, { status: 500 });
  }
}
