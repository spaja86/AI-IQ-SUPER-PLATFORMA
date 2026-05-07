// SpajaUltraOmegaCore -∞Ω+∞ — Billing Feature Flags
// Kompanija SPAJA — Digitalna Industrija
//
// Implementira:
//   • Feature flag za billing promene (safe rollout) (#33)
//   • Canary release za API rute vezane za naplatu (#47)

export interface BillingFlag {
  id: string;
  naziv: string;
  opis: string;
  enabled: boolean;
  /** Rollout procenat 0-100 za canary/AB release. */
  rolloutPct: number;
  /** Datum od kada je flag aktivan (ISO8601). */
  activeFrom?: string;
}

/**
 * Centralni billing feature flags.
 *
 * Menjati ovde pre deploy-a za safe rollout novih billing funkcija.
 * Svaki flag kontroliše jednu kategoriju billing funkcionalnosti.
 */
export const BILLING_FLAGS: BillingFlag[] = [
  {
    id: 'billing-hardening-v2',
    naziv: 'Billing Hardening V2',
    opis: 'Kompletna billing zaštita: retry, circuit breaker, dead-letter, soft-lock, grace period',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-fraud-heuristics',
    naziv: 'Anti-Fraud Heuristike',
    opis: 'Blokiranje checkout-a za korisnike sa visokim fraud score-om',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-grace-period',
    naziv: 'Grace Period Pre Downgrade-a',
    opis: 'Korisnik dobija grace period od 3 dana pre automatskog downgrade-a na starter plan',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-soft-lock',
    naziv: 'Soft-Lock Za Neuspela Plaćanja',
    opis: 'Nalog se soft-lockuje posle 3+ neuspelih naplate',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-event-ordering',
    naziv: 'Webhook Event Ordering Zaštita',
    opis: 'Out-of-order Stripe eventovi se odbijaju kako bi se sprečila regresija stanja',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-schema-validation',
    naziv: 'Schema Validacija Webhook Payload-a',
    opis: 'Svaki Stripe webhook event se validira pre obrade',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-user-notifications',
    naziv: 'Automatska Korisničke Notifikacije',
    opis: 'Korisnik dobija notifikaciju za key billing događaje (aktivacija, otkazivanje, neuspelo plaćanje)',
    enabled: false,
    rolloutPct: 0,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-plan-sync',
    naziv: 'Periodična Sinhronizacija Planova',
    opis: 'Automatska sinhronizacija cena i planova sa Stripe dashboard-om',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-circuit-breaker',
    naziv: 'Circuit Breaker Za Stripe API',
    opis: 'Circuit breaker sprečava kaskadne greške pri Stripe API problemima',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-07',
  },
  {
    id: 'billing-canary-checkout',
    naziv: 'Canary Release — Checkout V2',
    opis: '10% korisnika koristi novu checkout logiku sa idempotency ključem i dual rate limitingom',
    enabled: false,
    rolloutPct: 0,
    activeFrom: '2026-05-07',
  },
];

/**
 * Vraća flag po ID-u.
 */
export function getBillingFlag(id: string): BillingFlag | undefined {
  return BILLING_FLAGS.find((f) => f.id === id);
}

/**
 * Proverava da li je billing flag uključen za dati user ID (canary support).
 * Za 100% rollout uvek vraća `true` ako je flag enabled.
 * Za djelimičan rollout koristi hash user ID-a za determinizam.
 */
export function isBillingFlagEnabled(flagId: string, userId?: string): boolean {
  const flag = getBillingFlag(flagId);
  if (!flag || !flag.enabled) return false;
  if (flag.rolloutPct >= 100) return true;
  if (flag.rolloutPct <= 0) return false;

  // Deterministički hash za canary — isti user uvek dobija isti odgovor
  if (!userId) return false;
  const hash = simpleHash(userId + flagId) % 100;
  return hash < flag.rolloutPct;
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Vraća pregled svih billing flagova za admin panel.
 */
export function getBillingFlagsReport() {
  const aktivnih = BILLING_FLAGS.filter((f) => f.enabled).length;
  const neaktivnih = BILLING_FLAGS.filter((f) => !f.enabled).length;
  return {
    ukupno: BILLING_FLAGS.length,
    aktivnih,
    neaktivnih,
    flags: BILLING_FLAGS,
  };
}
