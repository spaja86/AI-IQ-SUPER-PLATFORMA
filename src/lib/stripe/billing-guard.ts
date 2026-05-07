// SpajaUltraOmegaCore -∞Ω+∞ — Billing Guard
// Kompanija SPAJA — Digitalna Industrija
//
// Implementira:
//   • Retry/backoff politiku za privremene DB greške (#8)
//   • Circuit Breaker za Stripe API fallback (#9)
//   • Dead-Letter Queue za webhook događaje koji padnu (#7)
//   • Enkriptovanje osetljivih metadata polja u audit logu (#39)

// ─── Retry / Exponential Backoff ─────────────────────────────────────────────

export interface RetryOptions {
  /** Maksimalan broj pokušaja (podrazumevano 3). */
  maxAttempts?: number;
  /** Početno čekanje u ms (podrazumevano 200). */
  initialDelayMs?: number;
  /** Faktor množenja odlaganja (podrazumevano 2). */
  backoffFactor?: number;
  /** Maksimalno čekanje u ms (podrazumevano 5000). */
  maxDelayMs?: number;
  /** Kódovi koji se smatraju privremenim (Supabase/PostgreSQL). */
  retryableCodes?: string[];
}

const DEFAULT_RETRY_OPTS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 200,
  backoffFactor: 2,
  maxDelayMs: 5000,
  retryableCodes: [
    '57P03', // cannot_connect_now
    '08006', // connection_failure
    '08001', // sqlclient_unable_to_establish_sqlconnection
    '40001', // serialization_failure
    '40P01', // deadlock_detected
    '53300', // too_many_connections
  ],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Izvršava `fn` sa retry + exponential backoff za privremene DB greške.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const o = { ...DEFAULT_RETRY_OPTS, ...opts };
  let lastError: unknown;
  let delay = o.initialDelayMs;

  for (let attempt = 1; attempt <= o.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const code = (err as { code?: string })?.code;
      const isRetryable = code ? o.retryableCodes.includes(code) : false;

      if (!isRetryable || attempt === o.maxAttempts) {
        throw err;
      }

      const jitter = Math.random() * delay * 0.2;
      const wait = Math.min(delay + jitter, o.maxDelayMs);
      console.warn(`[billing-guard] Attempt ${attempt}/${o.maxAttempts} failed (code=${code}). Retrying in ${Math.round(wait)}ms…`);
      await sleep(wait);
      delay = Math.min(delay * o.backoffFactor, o.maxDelayMs);
    }
  }

  throw lastError;
}

// ─── Circuit Breaker ──────────────────────────────────────────────────────────

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  /** Broj grešaka koje otvaraju kolo (podrazumevano 5). */
  failureThreshold?: number;
  /** Broj uspešnih poziva koji zatvaraju polu-otvoreno kolo (podrazumevano 2). */
  successThreshold?: number;
  /** Vreme čekanja pre half-open stanja u ms (podrazumevano 30000). */
  recoveryTimeMs?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures = 0;
  private successes = 0;
  private openedAt: number | null = null;
  private readonly opts: Required<CircuitBreakerOptions>;
  readonly name: string;

  constructor(name: string, opts: CircuitBreakerOptions = {}) {
    this.name = name;
    this.opts = {
      failureThreshold: opts.failureThreshold ?? 5,
      successThreshold: opts.successThreshold ?? 2,
      recoveryTimeMs: opts.recoveryTimeMs ?? 30_000,
    };
  }

  getState(): CircuitState {
    if (this.state === 'open' && this.openedAt !== null) {
      if (Date.now() - this.openedAt >= this.opts.recoveryTimeMs) {
        this.state = 'half-open';
        this.successes = 0;
      }
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    const state = this.getState();

    if (state === 'open') {
      console.warn(`[circuit-breaker:${this.name}] Circuit OPEN — using fallback`);
      return fallback();
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.successes++;
      if (this.successes >= this.opts.successThreshold) {
        this.state = 'closed';
        this.openedAt = null;
        console.info(`[circuit-breaker:${this.name}] Circuit CLOSED`);
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    if (this.state === 'half-open' || this.failures >= this.opts.failureThreshold) {
      this.state = 'open';
      this.openedAt = Date.now();
      console.error(`[circuit-breaker:${this.name}] Circuit OPENED after ${this.failures} failures`);
    }
  }

  /** Vraća metrike circuit breaker-a za health check. */
  metrics(): { name: string; state: CircuitState; failures: number; openedAt: number | null } {
    return { name: this.name, state: this.getState(), failures: this.failures, openedAt: this.openedAt };
  }
}

// Singleton circuit breaker-i za Stripe operacije
export const stripeCheckoutCircuit = new CircuitBreaker('stripe-checkout', { failureThreshold: 3 });
export const stripePortalCircuit = new CircuitBreaker('stripe-portal', { failureThreshold: 3 });
export const stripeWebhookCircuit = new CircuitBreaker('stripe-webhook-db', { failureThreshold: 5 });

// ─── Dead-Letter Queue ────────────────────────────────────────────────────────

export interface DeadLetterEntry {
  eventId: string;
  eventType: string;
  payload: string;
  failureReason: string;
  occurredAt: string;
  retryCount: number;
}

/**
 * Upisuje neuspeli webhook event u dead-letter tabelu radi kasnijeg replay-a.
 * Greška u pisanju DLQ-a se samo loguje — ne sme blokirati odgovor Stripe-u.
 */
export async function enqueueDeadLetter(
  supabase: ReturnType<typeof import('@/lib/supabase/server').getSupabaseServerClient>,
  entry: DeadLetterEntry,
): Promise<void> {
  try {
    const { error } = await supabase.from('webhook_dead_letter').insert({
      event_id: entry.eventId,
      event_type: entry.eventType,
      payload: entry.payload,
      failure_reason: entry.failureReason,
      retry_count: entry.retryCount,
      occurred_at: entry.occurredAt,
    });
    if (error) {
      console.error('[dead-letter] Failed to enqueue:', error);
    }
  } catch (err) {
    console.error('[dead-letter] Unexpected error during enqueue:', err);
  }
}

// ─── Metadata Encryption ──────────────────────────────────────────────────────
// Lagana obfuskacija osetljivih polja u audit logu.
// Za produkcijsku enkripciju zahteva Supabase Vault ili KMS integraciju.

const SENSITIVE_KEYS = ['card_last4', 'bank_account', 'iban', 'routing_number', 'ssn', 'tax_id'];

/**
 * Maskira osetljiva polja u metadata objektu pre upisa u audit log.
 * Primer: { card_last4: "4242" } → { card_last4: "****" }
 */
export function maskSensitiveMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      result[key] = typeof value === 'string' ? value.replace(/./g, '*') : '****';
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = maskSensitiveMetadata(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}
