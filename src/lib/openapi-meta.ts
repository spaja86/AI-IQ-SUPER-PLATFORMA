// SpajaUltraOmegaCore -∞Ω+∞ — OpenAPI Metadata & Versioning Politike
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 8 (P2): DX i developer platforma — OpenAPI, versioning politike, preview env.
//
// Implementira:
//   • OpenAPI 3.1 info blok za automatsku dokumentaciju
//   • API versioning politike (deprecation, sunset, migration)
//   • Route tag taksonomija
//   • Developer-facing changelog za API promene
//
// Upotreba:
//   import { OPENAPI_INFO, getApiVersionPolicy } from '@/lib/openapi-meta';

import { APP_VERSION } from '@/lib/constants';

// ─── OpenAPI Info Blok ────────────────────────────────────────────────────────

// ─── API Tags / Taksonomija ───────────────────────────────────────────────────

export const API_TAGS = [
  { name: 'auth', description: 'Autentifikacija i autorizacija' },
  { name: 'billing', description: 'Billing, pretplate i plaćanja (Stripe)' },
  { name: 'ai', description: 'AI chat, alati i generisanje' },
  { name: 'gaming', description: 'Gaming engine i igrice' },
  { name: 'analytics', description: 'Analytics i metrike' },
  { name: 'omega-ai', description: 'OMEGA AI mreža i persona' },
  { name: 'health', description: 'Health check i monitoring' },
  { name: 'admin', description: 'Admin operacije (zahteva admin rolu)' },
  { name: 'autofinish', description: 'Autofinish automatizacija' },
  { name: 'webhook', description: 'Webhook handleri (Stripe, eksterni)' },
];

export const OPENAPI_INFO = {
  openapi: '3.1.0',
  info: {
    title: 'AI IQ SUPER PLATFORMA API',
    description: `
## AI IQ SUPER PLATFORMA — REST API

Kompanija **SPAJA** Digitalna Industrija

### Autentifikacija
API koristi Bearer token autentifikaciju (JWT):
\`\`\`
Authorization: Bearer <token>
\`\`\`

### Verzioniranje
Sve rute koriste \`/api/v1/\` prefiks. Verzioniranje se vrši na nivou rute.

### Rate Limiting
Sve rute podležu rate limitingu. Limit se vraća u \`X-RateLimit-*\` headerima.

### Idempotency
Mutativne operacije prihvataju \`Idempotency-Key\` header za dedupliciranje.

### Standardni formati
- Timestamps: ISO 8601 (\`2026-05-07T16:00:00Z\`)
- Greške: \`{ error: string, code: string, timestamp: string }\`
- Uspeh: \`{ data: T, verzija: string, timestamp: string }\`
    `.trim(),
    version: APP_VERSION,
    contact: {
      name: 'SPAJA Support',
      url: 'https://ai-iq-super-platforma.vercel.app/omega-ai-suport',
      email: 'support@spaja.ai',
    },
    license: {
      name: 'Proprietary',
      url: 'https://ai-iq-super-platforma.vercel.app/kompanija',
    },
    'x-logo': {
      url: '/favicon.ico',
      altText: 'AI IQ SUPER PLATFORMA',
    },
  },
  servers: [
    {
      url: 'https://ai-iq-super-platforma.vercel.app',
      description: 'Produkcija',
    },
    {
      url: 'https://staging.ai-iq-super-platforma.vercel.app',
      description: 'Staging',
    },
    {
      url: 'http://localhost:3000',
      description: 'Lokalni razvoj',
    },
  ],
  tags: API_TAGS,
} as const;

// ─── Versioning Politika ──────────────────────────────────────────────────────

export type ApiVersionStatus =
  | 'current'     // Aktuelna verzija
  | 'deprecated'  // Zastarela — nastaviće da radi, ali se ne preporučuje
  | 'sunset'      // Planirana za gašenje
  | 'legacy';     // Stara, nije za nove integracije

export interface ApiVersionPolicy {
  version: string;
  status: ApiVersionStatus;
  /** Datum od kada je deprecated (ISO). */
  deprecatedSince?: string;
  /** Datum gašenja (ISO). */
  sunsetDate?: string;
  /** Migracioni vodič. */
  migrationPath?: string;
  /** Verzija na koju treba migrirati. */
  migrateTo?: string;
  /** Da li se šalju deprecation headeri. */
  sendDeprecationHeader: boolean;
}

/**
 * Politike verzioniranja po API versiji.
 */
export const API_VERSION_POLICIES: ApiVersionPolicy[] = [
  {
    version: 'v1',
    status: 'current',
    sendDeprecationHeader: false,
  },
  // Primer deprecation:
  // {
  //   version: 'v0',
  //   status: 'sunset',
  //   deprecatedSince: '2026-01-01',
  //   sunsetDate: '2026-07-01',
  //   migrationPath: 'https://docs.spaja.ai/migration/v0-to-v1',
  //   migrateTo: 'v1',
  //   sendDeprecationHeader: true,
  // },
];

/**
 * Dohvata politiku za datu API verziju.
 */
export function getApiVersionPolicy(version: string): ApiVersionPolicy | null {
  return API_VERSION_POLICIES.find((p) => p.version === version) ?? null;
}

/**
 * Generiše deprecation headere za deprecated/sunset verzije.
 */
export function getDeprecationHeaders(version: string): Record<string, string> {
  const policy = getApiVersionPolicy(version);
  if (!policy || !policy.sendDeprecationHeader) return {};

  const headers: Record<string, string> = {
    Deprecation: policy.deprecatedSince ?? 'true',
  };

  if (policy.sunsetDate) {
    headers['Sunset'] = new Date(policy.sunsetDate).toUTCString();
  }

  if (policy.migrationPath) {
    headers['Link'] = `<${policy.migrationPath}>; rel="deprecation"`;
  }

  return headers;
}

// ─── API Changelog ────────────────────────────────────────────────────────────

export interface ApiChangelogEntry {
  version: string;
  datum: string;
  tip: 'breaking' | 'feature' | 'fix' | 'deprecation' | 'security';
  opis: string;
  affectedRoutes?: string[];
}

/**
 * Changelog API promena za developer-facing komunikaciju.
 */
export const API_CHANGELOG: ApiChangelogEntry[] = [
  {
    version: APP_VERSION,
    datum: '2026-05-07',
    tip: 'feature',
    opis: 'Dodat Idempotency-Key support za checkout mutacije.',
    affectedRoutes: ['/api/billing/checkout'],
  },
  {
    version: APP_VERSION,
    datum: '2026-05-07',
    tip: 'feature',
    opis: 'Security headeri (CSP, HSTS) uključeni za sve rute.',
    affectedRoutes: ['*'],
  },
  {
    version: APP_VERSION,
    datum: '2026-05-07',
    tip: 'feature',
    opis: 'Analytics event tracking API za funnel/cohort metrike.',
    affectedRoutes: ['/api/analytics/*'],
  },
];

// ─── Route Dokumentacija Helper ───────────────────────────────────────────────

export interface RouteDoc {
  summary: string;
  description?: string;
  tags: string[];
  requiresAuth: boolean;
  rateLimit?: string;
  idempotent?: boolean;
}

/**
 * Helper za inline route dokumentaciju.
 * Koristi se u route handleru za generisanje OpenAPI specifikacije.
 *
 * @example
 * export const routeDoc = defineRouteDoc({
 *   summary: 'Pokrenite checkout sesiju',
 *   tags: ['billing'],
 *   requiresAuth: true,
 *   idempotent: true,
 * });
 */
export function defineRouteDoc(doc: RouteDoc): RouteDoc {
  return doc;
}
