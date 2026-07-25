// SpajaUltraOmegaCore -∞Ω+∞ — Platform Feature Flags
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 10 (kontinuirano): Hardening, load/chaos validacija i feature flag rollout.
//
// Implementira:
//   • Generički platform-wide feature flag sistem
//   • Canary/AB rollout sa determinističkim hash-om
//   • Emergency kill switches za kritične funkcionalnosti
//   • Environment-aware flagovi (dev/staging/prod)
//   • Admin override mehanizam
//
// Upotreba:
//   import { isFeatureEnabled } from '@/lib/feature-flags';
//   if (isFeatureEnabled('new-gaming-engine', userId)) { ... }

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type FeatureFlagEnv = 'development' | 'staging' | 'production' | 'all';

export type RolloutStrategy =
  | 'disabled'     // Kompletno isključeno
  | 'enabled'      // Kompletno uključeno
  | 'percentage'   // Procenat korisnika (canary)
  | 'users'        // Specifičan skup user ID-ova
  | 'plans'        // Specifični planovi
  | 'env';         // Samo određena okruženja

export interface FeatureFlag {
  id: string;
  naziv: string;
  opis: string;
  /** Strategija rollout-a. */
  strategy: RolloutStrategy;
  /** Procenat korisnika (0-100) — koristi se sa `strategy: 'percentage'`. */
  rolloutPct?: number;
  /** Specific user IDs — koristi se sa `strategy: 'users'`. */
  userIds?: string[];
  /** Planovi koji imaju pristup — koristi se sa `strategy: 'plans'`. */
  plans?: string[];
  /** Okruženja u kojima je flag aktivan. */
  envs?: FeatureFlagEnv[];
  /** Kill switch — odmah isključuje flag bez pipeline-a. */
  killSwitch?: boolean;
  /** Datum aktiviranja (ISO). */
  activeFrom?: string;
  /** Datum deaktivacije (ISO). */
  activeTo?: string;
  /** Metapodaci za praćenje. */
  meta?: {
    owner?: string;
    ticket?: string;
    createdAt?: string;
  };
}

// ─── Flag Registry ────────────────────────────────────────────────────────────

/**
 * Centralni registar svih platform-wide feature flagova.
 *
 * KONVENCIJA:
 *   - Novi flagovi uvek kreću sa strategy: 'disabled' ili malim rolloutPct
 *   - Kill switches uvek na kraju liste za brzu preglednost
 *   - Svaki flag mora imati ticket vezan za praćenje
 */
export const PLATFORM_FLAGS: FeatureFlag[] = [
  // ── AI Engine ─────────────────────────────────────────────────
  {
    id: 'ai-prompt-versioning',
    naziv: 'AI Prompt Versioning',
    opis: 'Aktivira novi sistem verzioniranja promptova sa fallback mehanizmom.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'ai-team', ticket: 'SPAJA-2001' },
  },
  {
    id: 'ai-response-caching',
    naziv: 'AI Response Caching',
    opis: 'Kešira identične AI odgovore za 5 minuta (smanjuje OpenAI troškove).',
    strategy: 'percentage',
    rolloutPct: 50,
    envs: ['production', 'staging'],
    activeFrom: '2026-05-07',
    meta: { owner: 'ai-team', ticket: 'SPAJA-2002' },
  },
  {
    id: 'ai-confidence-scoring',
    naziv: 'AI Confidence Scoring',
    opis: 'Prikazuje confidence score uz AI odgovore.',
    strategy: 'plans',
    plans: ['pro', 'enterprise', 'unlimited'],
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'ai-team', ticket: 'SPAJA-2003' },
  },
  {
    id: 'ai-tool-web-search',
    naziv: 'AI Web Search Tool',
    opis: 'Omogućava AI-u da pretražuje web u realnom vremenu (Tavily API).',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'ai-team', ticket: 'SPAJA-2004' },
  },
  // ── Gaming ────────────────────────────────────────────────────
  {
    id: 'gaming-anti-cheat-v2',
    naziv: 'Gaming Anti-Cheat V2',
    opis: 'Napredna anti-cheat validacija sa session guard-om i replay zaštitom.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'gaming-team', ticket: 'SPAJA-3001' },
  },
  {
    id: 'gaming-replay-guard',
    naziv: 'Gaming Replay Guard',
    opis: 'Deduplicira duplikat gaming akcije (anti-replay).',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'gaming-team', ticket: 'SPAJA-3002' },
  },
  {
    id: 'gaming-highscore-ledger',
    naziv: 'Gaming High Score Ledger',
    opis: 'Globalni high score leaderboard sa persistencijom.',
    strategy: 'percentage',
    rolloutPct: 20,
    envs: ['production'],
    activeFrom: '2026-05-07',
    meta: { owner: 'gaming-team', ticket: 'SPAJA-3003' },
  },
  {
    id: 'gaming-master-poker-runner-v1',
    naziv: 'MASTER POKER Runner v1',
    opis: 'Aktivira namenski Texas Hold’em runner sa anti-cheat i audit tragom.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-07-25',
    meta: { owner: 'gaming-team', ticket: 'SPAJA-3004' },
  },
  // ── Security ──────────────────────────────────────────────────
  {
    id: 'security-csp-headers',
    naziv: 'Security CSP Headers',
    opis: 'Content Security Policy i HSTS headeri na svim rutama.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'security-team', ticket: 'SPAJA-1001' },
  },
  {
    id: 'security-idempotency-checkout',
    naziv: 'Idempotency Za Checkout',
    opis: 'Idempotency-Key dedupliciranje za checkout API pozive.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'billing-team', ticket: 'SPAJA-1002' },
  },
  // ── Analytics ─────────────────────────────────────────────────
  {
    id: 'analytics-funnel-tracking',
    naziv: 'Analytics Funnel Tracking',
    opis: 'Aktivira standardizovani funnel event tracking za konverzijsku analizu.',
    strategy: 'enabled',
    envs: ['production', 'staging'],
    activeFrom: '2026-05-07',
    meta: { owner: 'analytics-team', ticket: 'SPAJA-4001' },
  },
  {
    id: 'analytics-cohort-reporting',
    naziv: 'Analytics Cohort Reporting',
    opis: 'Cohort analiza u admin panelu.',
    strategy: 'plans',
    plans: ['enterprise', 'unlimited'],
    envs: ['production'],
    activeFrom: '2026-05-07',
    meta: { owner: 'analytics-team', ticket: 'SPAJA-4002' },
  },
  // ── DX/Preview ────────────────────────────────────────────────
  {
    id: 'dx-openapi-docs',
    naziv: 'OpenAPI Dokumentacija',
    opis: 'Publična /api/docs stranica sa OpenAPI specifikacijom.',
    strategy: 'disabled',
    envs: ['development', 'staging'],
    meta: { owner: 'dx-team', ticket: 'SPAJA-5001' },
  },
  {
    id: 'dx-preview-env',
    naziv: 'Preview Environment',
    opis: 'Per-PR preview okruženja na Vercel-u.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-07',
    meta: { owner: 'dx-team', ticket: 'SPAJA-5002' },
  },
  // ── Enterprise ────────────────────────────────────────────────
  {
    id: 'enterprise-sla-monitoring',
    naziv: 'Enterprise SLA Monitoring',
    opis: 'Real-time SLA monitoring i breach alerting za enterprise korisnike.',
    strategy: 'plans',
    plans: ['enterprise', 'unlimited'],
    envs: ['production'],
    activeFrom: '2026-05-07',
    meta: { owner: 'enterprise-team', ticket: 'SPAJA-6001' },
  },
  {
    id: 'enterprise-sso',
    naziv: 'Enterprise SSO',
    opis: 'SAML/OIDC SSO za enterprise korisnika.',
    strategy: 'disabled',
    envs: ['production'],
    meta: { owner: 'enterprise-team', ticket: 'SPAJA-6002' },
  },
  // ── Browser Features ──────────────────────────────────────
  {
    id: 'brouvzer-inkognito-mode',
    naziv: 'Brouvzer Inkognito Mod',
    opis: 'Aktivira inkognito mod u SPAJA Digitalnom Brouvzeru — istorija i bookmarkovi se ne čuvaju u localStorage. Autentifikacija ostaje aktivna.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-24',
    meta: { owner: 'browser-team', ticket: 'SPAJA-7001' },
  },
  {
    id: 'brouvzer-tab-menadzer',
    naziv: 'Brouvzer Tab Menadžer',
    opis: 'Aktivira napredni tab menadžer u SPAJA Digitalnom Brouvzeru — grupisanje, hibernacija, pin tabovi i sinhronizacija između uređaja.',
    strategy: 'enabled',
    envs: ['all'],
    activeFrom: '2026-05-24',
    meta: { owner: 'browser-team', ticket: 'SPAJA-7002' },
  },
  // ── Kill Switches ─────────────────────────────────────────────
  {
    id: 'kill-switch-checkout',
    naziv: 'Kill Switch — Checkout',
    opis: 'Globalno gasi sve checkout operacije (emergency).',
    strategy: 'disabled',
    killSwitch: true,
    envs: ['all'],
    meta: { owner: 'billing-team', ticket: 'SPAJA-KS-001' },
  },
  {
    id: 'kill-switch-ai',
    naziv: 'Kill Switch — AI Chat',
    opis: 'Globalno gasi AI chat (emergency, npr. OpenAI outage).',
    strategy: 'disabled',
    killSwitch: true,
    envs: ['all'],
    meta: { owner: 'ai-team', ticket: 'SPAJA-KS-002' },
  },
  {
    id: 'kill-switch-gaming',
    naziv: 'Kill Switch — Gaming',
    opis: 'Globalno gasi gaming engine (emergency).',
    strategy: 'disabled',
    killSwitch: true,
    envs: ['all'],
    meta: { owner: 'gaming-team', ticket: 'SPAJA-KS-003' },
  },
];

// ─── Admin Override Store ─────────────────────────────────────────────────────
// In-memory overrides (u produkciji: Vercel KV)

const _overrides = new Map<string, boolean>();

/**
 * Postavlja admin override za flag.
 * Koristi za hitne intervencije (kill switches).
 */
export function setFlagOverride(flagId: string, enabled: boolean): void {
  _overrides.set(flagId, enabled);
}

/**
 * Uklanja admin override.
 */
export function removeFlagOverride(flagId: string): void {
  _overrides.delete(flagId);
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Proverava da li je feature flag aktivan za datog korisnika.
 *
 * @param flagId  - ID flaga
 * @param userId  - ID korisnika (za canary/users strategiju)
 * @param context - Dodatni kontekst (plan, env)
 */
export function isFeatureEnabled(
  flagId: string,
  userId?: string,
  context?: {
    plan?: string;
    env?: FeatureFlagEnv;
  },
): boolean {
  // Admin override ima prednost
  if (_overrides.has(flagId)) {
    return _overrides.get(flagId)!;
  }

  const flag = PLATFORM_FLAGS.find((f) => f.id === flagId);
  if (!flag) return false;

  // Kill switch — uvek false ako je kill switch i isključeno
  if (flag.killSwitch && flag.strategy === 'disabled') return false;

  // Vremenski opseg
  const now = new Date();
  if (flag.activeFrom && new Date(flag.activeFrom) > now) return false;
  if (flag.activeTo && new Date(flag.activeTo) < now) return false;

  // Environment check
  const currentEnv = context?.env ?? getCurrentEnv();
  if (flag.envs && !flag.envs.includes('all') && !flag.envs.includes(currentEnv)) {
    return false;
  }

  switch (flag.strategy) {
    case 'disabled':
      return false;

    case 'enabled':
      return true;

    case 'percentage': {
      if (!userId) return false;
      const pct = flag.rolloutPct ?? 0;
      if (pct >= 100) return true;
      if (pct <= 0) return false;
      return deterministicHash(userId + flagId) % 100 < pct;
    }

    case 'users':
      return !!(userId && flag.userIds?.includes(userId));

    case 'plans':
      return !!(context?.plan && flag.plans?.includes(context.plan));

    case 'env':
      return flag.envs?.includes(currentEnv) ?? false;

    default:
      return false;
  }
}

/**
 * Dohvata flag po ID-u.
 */
export function getFlag(flagId: string): FeatureFlag | null {
  return PLATFORM_FLAGS.find((f) => f.id === flagId) ?? null;
}

/**
 * Vraća sve aktivne flagove za datog korisnika/kontekst.
 */
export function getEnabledFlags(
  userId?: string,
  context?: { plan?: string; env?: FeatureFlagEnv },
): string[] {
  return PLATFORM_FLAGS
    .filter((f) => isFeatureEnabled(f.id, userId, context))
    .map((f) => f.id);
}

/**
 * Vraća report svih flagova za admin panel.
 */
export function getFlagsReport() {
  const total = PLATFORM_FLAGS.length;
  const enabled = PLATFORM_FLAGS.filter((f) => f.strategy === 'enabled' && !f.killSwitch).length;
  const disabled = PLATFORM_FLAGS.filter((f) => f.strategy === 'disabled').length;
  const killSwitches = PLATFORM_FLAGS.filter((f) => f.killSwitch).length;
  const canary = PLATFORM_FLAGS.filter((f) => f.strategy === 'percentage').length;
  const overrides = _overrides.size;

  return {
    total,
    enabled,
    disabled,
    killSwitches,
    canary,
    overrides,
    flags: PLATFORM_FLAGS.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      strategy: f.strategy,
      killSwitch: f.killSwitch ?? false,
      override: _overrides.get(f.id),
    })),
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function getCurrentEnv(): FeatureFlagEnv {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === 'production') return 'production';
  if (vercelEnv === 'preview') return 'staging';
  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'test') return 'staging';
  return 'development';
}

function deterministicHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
