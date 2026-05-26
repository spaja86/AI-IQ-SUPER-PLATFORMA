import { createClient } from '@supabase/supabase-js';
import { APP_VERSION } from '@/lib/constants';
import {
  getEnterpriseZahtevByProviderAndSubtype,
  type EnterpriseProvajder,
  type EnterpriseZahtevPodtip,
  type EnterpriseZahtevPaket,
} from '@/lib/kompanija-spaja-operativa';

export type EnterpriseUgovorStatus = 'pending' | 'kontaktiran' | 'potpisano';
export type EnterpriseKontaktKanal = 'kontakt_forma' | 'email' | 'poziv' | 'sastanak';

export interface EnterpriseUgovorEvidencija {
  provider: EnterpriseProvajder;
  status: EnterpriseUgovorStatus;
  poslednjaAktivnostAt: string;
  kontaktOsoba: string | null;
  poslednjaNapomena: string | null;
  poslednjiKontaktKanal: EnterpriseKontaktKanal | null;
}

export interface EnterpriseKomunikacijaIstorijaStavka {
  id: string;
  provider: EnterpriseProvajder;
  podtip: EnterpriseZahtevPodtip;
  status: EnterpriseUgovorStatus;
  kanal: EnterpriseKontaktKanal;
  naslov: string;
  telo: string;
  kontaktOsoba: string | null;
  napomena: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface UpisKomunikacijeInput {
  provider: EnterpriseProvajder;
  podtip?: EnterpriseZahtevPodtip;
  status: EnterpriseUgovorStatus;
  kanal: EnterpriseKontaktKanal;
  kontaktOsoba?: string | null;
  napomena?: string | null;
}

interface UpisKomunikacijeResult {
  stored: boolean;
  reason?: string;
}

function envFlag(name: string): boolean {
  return /^(1|true|yes|ok|ready|active|done|signed|contacted)$/i.test(process.env[name] ?? '');
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getStatusFromEnv(provider: EnterpriseProvajder): EnterpriseUgovorStatus {
  const key = provider.toUpperCase();
  if (envFlag(`SPAJA_${key}_UGOVOR_POTPISAN`) || envFlag(`SPAJA_${key}_ENTERPRISE_CONTRACT_SIGNED`)) {
    return 'potpisano';
  }
  if (envFlag(`SPAJA_${key}_KONTAKTIRAN`) || envFlag(`SPAJA_${key}_ENTERPRISE_CONTACTED`)) {
    return 'kontaktiran';
  }
  return 'pending';
}

function getKontaktOsobaFallback(provider: EnterpriseProvajder): string {
  if (provider === 'openai') return 'Nikola Spajić';
  return 'Poslovni kontakt';
}

function resolveEnterprisePaket(
  provider: EnterpriseProvajder,
  podtip: EnterpriseZahtevPodtip = 'osnovni',
): EnterpriseZahtevPaket | undefined {
  return getEnterpriseZahtevByProviderAndSubtype(provider, podtip);
}

export function kreirajFormalniKontaktRikvest(paket: EnterpriseZahtevPaket): {
  naslov: string;
  telo: string;
} {
  const fallbackLinija =
    'Ako dokumenta ne možemo razmeniti digitalno, molimo da nas kontaktirate ili organizujete sastanak za potpisivanje ugovora.';
  const telo = paket.telo.includes(fallbackLinija) ? paket.telo : `${paket.telo}\n\n${fallbackLinija}`;
  return {
    naslov: paket.naslov,
    telo,
  };
}

export function getEnterpriseUgovorPlan(): EnterpriseUgovorEvidencija[] {
  const nowIso = new Date().toISOString();
  return (['vercel', 'github', 'openai'] as const).map((provider) => {
    const paket = resolveEnterprisePaket(provider, 'osnovni');
    if (!paket) {
      throw new Error(`Enterprise paket nije pronađen za provider: ${provider}`);
    }
    return {
    provider: paket.id,
    status: getStatusFromEnv(paket.id),
    poslednjaAktivnostAt: nowIso,
    kontaktOsoba: getKontaktOsobaFallback(paket.id),
    poslednjaNapomena: 'Čeka se odgovor enterprise sales tima ili termin sastanka za potpisivanje ugovora.',
    poslednjiKontaktKanal: paket.kanalPodnosenja.tip === 'kontakt_forma' ? 'kontakt_forma' : 'email',
    };
  });
}

export async function upisiEnterpriseKomunikaciju(
  input: UpisKomunikacijeInput,
): Promise<UpisKomunikacijeResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { stored: false, reason: 'Supabase nije konfigurisan.' };
  }

  const podtip = input.podtip ?? 'osnovni';
  const paket = resolveEnterprisePaket(input.provider, podtip);
  if (!paket) {
    return { stored: false, reason: `Nepoznat enterprise provider/podtip: ${input.provider}/${podtip}` };
  }

  const requestPayload = kreirajFormalniKontaktRikvest(paket);
  const now = new Date().toISOString();
  const kontaktOsoba = input.kontaktOsoba ?? getKontaktOsobaFallback(input.provider);
  const napomena = input.napomena ?? null;

  const { data: historyInsert, error: historyError } = await supabase
    .from('enterprise_komunikacija_istorija')
    .insert({
      provider: input.provider,
      status: input.status,
      kanal: input.kanal,
      naslov: requestPayload.naslov,
      telo: requestPayload.telo,
      kontakt_osoba: kontaktOsoba,
      napomena,
      metadata: {
        appVerzija: APP_VERSION,
        podtip,
        kanalPodnosenja: paket.kanalPodnosenja.url,
        trazeniPlanovi: paket.trazeniPlanovi,
      },
      created_at: now,
    })
    .select('id')
    .single();

  if (historyError || !historyInsert) {
    return {
      stored: false,
      reason: historyError?.message ?? 'Nije moguće upisati istoriju komunikacije.',
    };
  }

  const statusTimestamps: Record<string, string | null> = {
    pending_at: input.status === 'pending' ? now : null,
    kontaktiran_at: input.status === 'kontaktiran' ? now : null,
    potpisano_at: input.status === 'potpisano' ? now : null,
  };

  const { error: ugovorError } = await supabase.from('enterprise_ugovori').upsert(
    {
      provider: input.provider,
      status: input.status,
      poslednja_aktivnost_at: now,
      poslednja_napomena: napomena,
      poslednji_kontakt_kanal: input.kanal,
      kontakt_osoba: kontaktOsoba,
      poslednji_istorija_id: historyInsert.id,
      ...statusTimestamps,
      updated_at: now,
    },
    { onConflict: 'provider' },
  );

  if (ugovorError) {
    return {
      stored: false,
      reason: ugovorError.message,
    };
  }

  return { stored: true };
}

export async function ucitajEnterpriseKomunikacijaIstoriju(
  limit = 50,
): Promise<EnterpriseKomunikacijaIstorijaStavka[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('enterprise_komunikacija_istorija')
    .select('id, provider, status, kanal, naslov, telo, kontakt_osoba, napomena, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(Math.max(1, Math.min(limit, 200)));

  if (error || !data) return [];

  return data.map((item) => ({
    id: String(item.id),
    provider: item.provider as EnterpriseProvajder,
    podtip: ((item.metadata as Record<string, unknown> | null)?.podtip as EnterpriseZahtevPodtip | undefined) ?? 'osnovni',
    status: item.status as EnterpriseUgovorStatus,
    kanal: item.kanal as EnterpriseKontaktKanal,
    naslov: String(item.naslov),
    telo: String(item.telo),
    kontaktOsoba: (item.kontakt_osoba as string | null) ?? null,
    napomena: (item.napomena as string | null) ?? null,
    metadata: (item.metadata as Record<string, unknown>) ?? {},
    createdAt: String(item.created_at),
  }));
}

export async function ucitajEnterpriseUgovore(): Promise<EnterpriseUgovorEvidencija[]> {
  const fallback = getEnterpriseUgovorPlan();
  const supabase = getSupabaseClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from('enterprise_ugovori')
    .select(
      'provider, status, poslednja_aktivnost_at, kontakt_osoba, poslednja_napomena, poslednji_kontakt_kanal',
    );
  if (error || !data) return fallback;

  const fromDb = new Map(
    data.map((item) => [
      item.provider as EnterpriseProvajder,
      {
        provider: item.provider as EnterpriseProvajder,
        status: item.status as EnterpriseUgovorStatus,
        poslednjaAktivnostAt:
          (item.poslednja_aktivnost_at as string | null) ?? new Date().toISOString(),
        kontaktOsoba: (item.kontakt_osoba as string | null) ?? null,
        poslednjaNapomena: (item.poslednja_napomena as string | null) ?? null,
        poslednjiKontaktKanal: (item.poslednji_kontakt_kanal as EnterpriseKontaktKanal | null) ?? null,
      } satisfies EnterpriseUgovorEvidencija,
    ]),
  );

  return fallback.map((item) => fromDb.get(item.provider) ?? item);
}
