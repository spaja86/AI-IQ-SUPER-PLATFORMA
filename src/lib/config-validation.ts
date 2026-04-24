// Autofinish #837 — Config Validacija i Env Varijable
// Kompanija SPAJA — Digitalna Industrija
//
// Startup validacija obaveznih env varijabli sa graceful degradation.
// Grupe:
//   - CRITICAL: Aplikacija ne može raditi bez ove varijable
//   - REQUIRED: Funkcionalnost je ograničena bez ove varijable
//   - OPTIONAL: Varijabla poboljšava platformu ali nije obavezna
//
// Upotreba (u server-side kodu):
//   import { validateConfig, getEnv } from '@/lib/config-validation';
//   validateConfig(); // loguje upozorenja pri startu
//   const url = getEnv('NEXT_PUBLIC_SUPABASE_URL'); // type-safe dohvat

import { logger } from './logger';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type EnvVarGroup = 'CRITICAL' | 'REQUIRED' | 'OPTIONAL';

export interface EnvVarDefinicija {
  kljuc: string;
  grupa: EnvVarGroup;
  opis: string;
  podrazumevana?: string;
}

export interface ConfigValidacijaRezultat {
  ispravno: boolean;
  kriticni: string[];
  nedostajuci: string[];
  opcionalni: string[];
}

// ─── Definicija varijabli ─────────────────────────────────────────────────────

export const ENV_VARIJABLE: EnvVarDefinicija[] = [
  // Supabase
  {
    kljuc: 'NEXT_PUBLIC_SUPABASE_URL',
    grupa: 'CRITICAL',
    opis: 'Supabase projekat URL',
  },
  {
    kljuc: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    grupa: 'CRITICAL',
    opis: 'Supabase anonimni ključ',
  },
  // OpenAI / AI
  {
    kljuc: 'OPENAI_API_KEY',
    grupa: 'REQUIRED',
    opis: 'OpenAI API ključ za AI asistenta',
  },
  // Stripe
  {
    kljuc: 'STRIPE_SECRET_KEY',
    grupa: 'REQUIRED',
    opis: 'Stripe secret ključ za naplate',
  },
  {
    kljuc: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    grupa: 'REQUIRED',
    opis: 'Stripe publishable ključ za frontend',
  },
  // Autofinish trigger
  {
    kljuc: 'AUTOFINISH_TRIGGER_TOKEN',
    grupa: 'REQUIRED',
    opis: 'Token za ručno pokretanje Autofinish iteracije',
  },
  // Vercel KV (rate limiting)
  {
    kljuc: 'VERCEL_KV_REST_API_URL',
    grupa: 'OPTIONAL',
    opis: 'Vercel KV URL za distribuirani rate limiting',
  },
  {
    kljuc: 'VERCEL_KV_REST_API_TOKEN',
    grupa: 'OPTIONAL',
    opis: 'Vercel KV token za distribuirani rate limiting',
  },
  // App URL
  {
    kljuc: 'NEXT_PUBLIC_APP_URL',
    grupa: 'OPTIONAL',
    opis: 'Javni URL aplikacije (za share linkove)',
    podrazumevana: 'http://localhost:3000',
  },
];

// ─── Validacija ───────────────────────────────────────────────────────────────

/**
 * Validira prisutnost svih env varijabli i loguje upozorenja.
 * Može se pozvati pri startu aplikacije (u layout.tsx ili middleware).
 *
 * @param tihoRezim - Ako true, ne loguje ništa (korisno za testove)
 * @returns ConfigValidacijaRezultat
 */
export function validateConfig(tihoRezim = false): ConfigValidacijaRezultat {
  const kriticni: string[] = [];
  const nedostajuci: string[] = [];
  const opcionalni: string[] = [];

  for (const v of ENV_VARIJABLE) {
    const vrednost = process.env[v.kljuc];
    if (!vrednost) {
      if (v.grupa === 'CRITICAL') {
        kriticni.push(v.kljuc);
      } else if (v.grupa === 'REQUIRED') {
        nedostajuci.push(v.kljuc);
      } else {
        opcionalni.push(v.kljuc);
      }
    }
  }

  const ispravno = kriticni.length === 0;

  if (!tihoRezim) {
    if (kriticni.length > 0) {
      logger.error('CONFIG', 'Kritične env varijable nedostaju — aplikacija neće raditi ispravno', { kriticni });
    }
    if (nedostajuci.length > 0) {
      logger.warn('CONFIG', 'Obavezne env varijable nedostaju — neke funkcionalnosti su onemogućene', { nedostajuci });
    }
    if (opcionalni.length > 0) {
      logger.info('CONFIG', 'Opcionalne env varijable nisu konfigurisane', { opcionalni });
    }
    if (ispravno && nedostajuci.length === 0) {
      logger.info('CONFIG', 'Sve obavezne env varijable su konfigurisane ✅');
    }
  }

  return { ispravno, kriticni, nedostajuci, opcionalni };
}

// ─── Type-safe env dohvat ─────────────────────────────────────────────────────

/**
 * Dohvata env varijablu sa type-safe pristupom.
 * Baca grešku samo za CRITICAL varijable ako nedostaju.
 */
export function getEnv(kljuc: string): string | undefined {
  return process.env[kljuc];
}

/**
 * Dohvata obaveznu env varijablu. Baca grešku ako nedostaje.
 * Koristiti samo za CRITICAL varijable u server-side kodu.
 */
export function requireEnv(kljuc: string): string {
  const vrednost = process.env[kljuc];
  if (!vrednost) {
    throw new Error(`[CONFIG] Obavezna env varijabla '${kljuc}' nije konfigurisana.`);
  }
  return vrednost;
}
