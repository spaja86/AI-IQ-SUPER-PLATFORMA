// SpajaUltraOmegaCore -∞Ω+∞ — Evoluciona Persistencija (Supabase)
// Kompanija SPAJA — Digitalna Industrija
//
// Trajna pohrana evolucijskih ciklusa i preporuka u Supabase.
// Koristi migration 003_audit_evolution.sql tabele.
//
// Arhitektura:
//   - Svaki kreirani ciklus se snima u evolution_cycles
//   - Preporuke se snimaju u evolution_recommendations
//   - Health snapshot-i se snimaju u health_snapshots
//   - Sve operacije su non-blocking (ne lome cron pri Supabase grešci)

import type { EvolucijaCiklus, EvolucijskaIstorija } from './types';
import { APP_VERSION } from '@/lib/constants';

// ─── Supabase klijent (lazy) ──────────────────────────────────────────────────
// Ne importujemo direktno da bismo izbegli crash ako env vars nisu postavljene.

async function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Pohrana ciklusa ──────────────────────────────────────────────────────────

/**
 * Snima evolucioni ciklus i sve preporuke u Supabase.
 * Ne baca grešku — sve greške se loguju i ignorišu.
 */
export async function saveEvolucijaCiklus(ciklus: EvolucijaCiklus): Promise<void> {
  const supabase = await getClient();
  if (!supabase) return;

  try {
    // 1. Inserta ciklus
    const { error: cyklusError } = await supabase.from('evolution_cycles').insert({
      id: ciklus.id,
      started_at: ciklus.pocetak,
      finished_at: ciklus.zavrsetak ?? null,
      status: ciklus.status,
      zdravlje: ciklus.dijagnostika.zdravlje,
      ukupno_provera: ciklus.dijagnostika.ukupnoProvera,
      uspesnih: ciklus.dijagnostika.uspesnih,
      upozorenja: ciklus.dijagnostika.upozorenja,
      gresaka: ciklus.dijagnostika.gresaka,
      kriticnih: ciklus.dijagnostika.kriticnih,
      verzija: APP_VERSION,
    });

    if (cyklusError) {
      console.warn('[EVOLUCIJA PERSISTENCE] Greška pri snimanju ciklusa:', cyklusError.message);
      return;
    }

    // 2. Inserta preporuke
    if (ciklus.dijagnostika.preporuke.length > 0) {
      const preporukeRows = ciklus.dijagnostika.preporuke.map((p) => {
        const akcija = ciklus.akcije.find((a) => a.preporukaId === p.id);
        return {
          id: p.id,
          cycle_id: ciklus.id,
          naslov: p.naslov,
          opis: p.opis,
          tip: p.tip,
          prioritet: p.prioritet,
          persona: p.persona,
          procenjeni_napor: p.procenjeniNapor,
          github_issue_id: akcija?.githubIssueId ?? null,
          github_pr_id: akcija?.githubPrId ?? null,
          akcija_status: akcija?.status ?? 'kreirana',
        };
      });

      const { error: prepError } = await supabase
        .from('evolution_recommendations')
        .insert(preporukeRows);

      if (prepError) {
        console.warn(
          '[EVOLUCIJA PERSISTENCE] Greška pri snimanju preporuka:',
          prepError.message,
        );
      }
    }
  } catch (err) {
    console.warn('[EVOLUCIJA PERSISTENCE] Neočekivana greška:', err);
  }
}

/**
 * Dohvata istoriju evolucijskih ciklusa iz Supabase.
 * Vraća null ako Supabase nije konfigurisan.
 */
export async function loadEvolucijskaIstorija(
  limit = 30,
): Promise<EvolucijskaIstorija | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  try {
    const { data: cycles, error } = await supabase
      .from('evolution_cycles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !cycles) return null;

    const ukupnoCiklusa = cycles.length;
    const uspesnihCiklusa = cycles.filter((c) => c.status === 'completed').length;
    const poslednjiCiklus = cycles[0]?.started_at ?? null;

    return {
      ciklusi: cycles.map((c) => ({
        id: c.id as string,
        pocetak: c.started_at as string,
        zavrsetak: c.finished_at as string | null,
        status: (c.status as EvolucijaCiklus['status']) ?? 'zavrsen',
        dijagnostika: {
          zdravlje: c.zdravlje as number,
          ukupnoProvera: c.ukupno_provera as number,
          uspesnih: c.uspesnih as number,
          upozorenja: c.upozorenja as number,
          gresaka: c.gresaka as number,
          kriticnih: c.kriticnih as number,
          preporuke: [],
        },
        akcije: [],
        verzija: (c.verzija as string) ?? APP_VERSION,
      })),
      ukupnoCiklusa,
      uspesnihCiklusa,
      ukupnoAkcija: 0,
      uspesnihAkcija: 0,
      poslednjiCiklus: poslednjiCiklus as string | null,
      sledeciCiklus: izracunajSledeciCiklus(),
    };
  } catch {
    return null;
  }
}

/**
 * Snima health snapshot u Supabase.
 */
export async function saveHealthSnapshot(params: {
  zdravlje: number;
  status: 'zdravo' | 'upozorenje' | 'kriticno';
  ukupnoProvera: number;
  uspesnih: number;
  upozorenja: number;
  gresaka: number;
  kriticnih: number;
}): Promise<void> {
  const supabase = await getClient();
  if (!supabase) return;

  try {
    await supabase.from('health_snapshots').insert({
      zdravlje: params.zdravlje,
      status: params.status,
      ukupno_provera: params.ukupnoProvera,
      uspesnih: params.uspesnih,
      upozorenja: params.upozorenja,
      gresaka: params.gresaka,
      kriticnih: params.kriticnih,
      verzija: APP_VERSION,
    });
  } catch (err) {
    console.warn('[HEALTH PERSISTENCE] Greška pri snimanju snapshot-a:', err);
  }
}

/**
 * Dohvata poslednji zdravlje snapshot iz Supabase.
 */
export async function loadLastHealthSnapshot(): Promise<{
  zdravlje: number;
  status: string;
  snapshot_at: string;
} | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('health_snapshots')
      .select('zdravlje, status, snapshot_at')
      .order('snapshot_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return {
      zdravlje: data.zdravlje as number,
      status: data.status as string,
      snapshot_at: data.snapshot_at as string,
    };
  } catch {
    return null;
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function izracunajSledeciCiklus(): string {
  const sada = new Date();
  sada.setHours(sada.getHours() + 6);
  sada.setMinutes(0, 0, 0);
  return sada.toISOString();
}
