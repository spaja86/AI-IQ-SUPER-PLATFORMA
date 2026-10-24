// Executes repository TypeScript, not a reimplementation of the route logic.
// External effects are in-memory doubles. No host environment is passed to routes.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createContext, Script } from 'node:vm';
import * as crypto from 'node:crypto';
import ts from 'typescript';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server.js';

const require = createRequire(import.meta.url);
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
export const USER = '00000000-0000-4000-8000-000000000001';
export const FIXTURE_SECRET = 'whsec_local_fixture_not_a_real_endpoint';
const sourceCache = new Map();
const clone = value => JSON.parse(JSON.stringify(value));

export function createHarness(options = {}) {
  const networkAttempts = [];
  const denyNetwork = (...args) => {
    networkAttempts.push(args[0]);
    throw new Error('Network disabled in Stripe isolated verification');
  };
  const env = {
    STRIPE_SECRET_KEY: 'sk_test_local_fixture_not_a_real_key',
    STRIPE_WEBHOOK_SECRET: FIXTURE_SECRET,
    STRIPE_PRICE_BASIC: 'price_fixture_basic', STRIPE_PRICE_PRO: 'price_fixture_pro',
    STRIPE_PRICE_ENTERPRISE: 'price_fixture_enterprise', STRIPE_PRICE_UNLIMITED: 'price_fixture_unlimited',
    NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.example.test',
    SUPABASE_SERVICE_ROLE_KEY: 'local-fixture-service-role',
    ...options.env,
  };
  if (env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY !== 'sk_test_local_fixture_not_a_real_key') {
    throw new Error('Only the synthetic fixture key is accepted by this harness');
  }
  const state = {
    profile: {
      id: USER, plan: 'starter', subscription_status: null,
      stripe_customer_id: 'cus_fixture', stripe_subscription_id: null,
      failed_payment_count: 0, created_at: '2025-01-01T00:00:00Z',
      last_plan_changed_at: null, chat_messages_used: 4,
      ...options.profile,
    },
    events: [], audits: [], deadLetters: [], queries: [], authTokens: [],
    fraudInputs: [], sessionCalls: [], sessions: new Map(), customerCalls: [],
    priceCalls: [], listCalls: [], logs: [], networkAttempts,
    profileWrites: 0, eventInsertAttempts: 0,
    price: { id: 'price_fixture_basic', currency: 'eur', active: true, recurring: { interval: 'month' }, unit_amount: 900, livemode: false, ...options.price },
    options,
  };
  const sdk = new Stripe('sk_test_local_fixture_not_a_real_key', {
    maxNetworkRetries: 0,
    httpClient: { getClientName: () => 'NETWORK_DISABLED', makeRequest: async (...args) => denyNetwork(...args) },
  });
  const stripe = {
    webhooks: sdk.webhooks,
    checkout: { sessions: {
      list: async args => {
        state.listCalls.push(clone(args));
        if (options.listError) throw new Error('Fixture list failure');
        return { data: Array.from({ length: options.activeSessions ?? 0 }, (_, i) => ({ id: `cs_test_open_${i}` })) };
      },
      create: async (params, requestOptions) => {
        state.sessionCalls.push({ params: clone(params), options: clone(requestOptions) });
        if (options.sessionError) throw new Error('Fixture Stripe API failure');
        const key = requestOptions.idempotencyKey;
        const previous = state.sessions.get(key);
        if (previous) {
          // Stripe's documented same-key/same-parameters contract. This is a simulation.
          if (JSON.stringify(previous.params) !== JSON.stringify(params)) {
            throw new Error('Fixture idempotency_error: parameters changed');
          }
          return clone(previous.session);
        }
        const session = { id: `cs_test_fixture_${state.sessions.size + 1}`, url: options.noSessionUrl ? null : 'https://checkout.example.test/session', livemode: false };
        state.sessions.set(key, { params: clone(params), session });
        return clone(session);
      },
    } },
    prices: { retrieve: async id => {
      state.priceCalls.push(id);
      if (options.priceError) throw new Error('Fixture missing Price');
      return clone(state.price);
    } },
    customers: { create: async (...args) => {
      state.customerCalls.push(clone(args));
      return { id: `cus_fixture_new_${state.customerCalls.length}` };
    } },
  };

  function query(table) {
    const operation = { table, kind: 'select', payload: null, filters: [] };
    const builder = {
      select(columns) { operation.columns = columns; return this; },
      insert(payload) { operation.kind = 'insert'; operation.payload = payload; return this; },
      update(payload) { operation.kind = 'update'; operation.payload = payload; return this; },
      eq(key, value) { operation.filters.push([key, value]); return this; },
      order(key, opts) { operation.order = [key, opts]; return this; },
      limit(n) { operation.limit = n; return this; },
      single() { operation.single = true; return this; },
      then(onFulfilled, onRejected) { return Promise.resolve().then(execute).then(onFulfilled, onRejected); },
    };
    function execute() {
      state.queries.push(clone(operation));
      const matches = row => operation.filters.every(([key, value]) => row[key] === value);
      if (table === 'profiles') {
        if (operation.kind === 'select') return { data: options.profileReadError ? null : matches(state.profile) ? clone(state.profile) : null, error: options.profileReadError ?? null };
        state.profileWrites++;
        if (options.profileWriteThrow) throw Object.assign(new Error('Fixture profile write failure'), { code: '23514' });
        if (options.profileWriteError) return { data: null, error: options.profileWriteError };
        if (matches(state.profile)) Object.assign(state.profile, operation.payload);
        return { data: null, error: null };
      }
      if (table === 'stripe_webhook_events') {
        if (operation.kind === 'insert') {
          state.eventInsertAttempts++;
          if (options.eventInsertError) return { data: null, error: options.eventInsertError };
          if (options.eventInsertThrow) throw Object.assign(new Error('Fixture event storage failure'), { code: '23514' });
          if (state.events.some(row => row.event_id === operation.payload.event_id)) return { data: null, error: { code: '23505' } };
          state.events.push({ ...clone(operation.payload), processed_at: new Date().toISOString() });
        } else if (operation.kind === 'update') {
          for (const row of state.events.filter(matches)) Object.assign(row, operation.payload);
        } else {
          const rows = state.events.filter(matches).sort((a, b) => b.processed_at.localeCompare(a.processed_at));
          return { data: rows.length ? clone(rows[0]) : null, error: null };
        }
        return { data: null, error: null };
      }
      if (table === 'financial_audit_log') {
        if (operation.kind === 'insert') state.audits.push(clone(operation.payload));
        return { data: state.audits.length ? clone(state.audits.at(-1)) : null, error: null };
      }
      if (table === 'webhook_dead_letter') {
        if (options.deadLetterError) return { data: null, error: options.deadLetterError };
        state.deadLetters.push(clone(operation.payload));
        return { data: null, error: null };
      }
      throw new Error(`Unmodelled DB boundary: ${table}`);
    }
    return builder;
  }
  const database = {
    from: query,
    auth: { getUser: async token => {
      state.authTokens.push(token);
      const valid = token === 'fixture-valid-token' || token.startsWith('fixture-user-');
      return { data: { user: valid ? { id: token.startsWith('fixture-user-') ? token : USER, email: 'fixture@example.test' } : null }, error: valid ? null : { message: 'Invalid fixture token' } };
    } },
  };
  const modules = new Map();
  const context = createContext({
    process: { env }, Buffer, URL, URLSearchParams, Headers, Request, Response,
    Date, setTimeout, clearTimeout, fetch: denyNetwork,
    console: Object.fromEntries(['info', 'warn', 'error', 'log'].map(level => [level, (...args) => state.logs.push({ level, args })])),
  });
  function load(relativePath) {
    const absolute = resolve(root, relativePath);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    if (!sourceCache.has(absolute)) sourceCache.set(absolute, ts.transpileModule(readFileSync(absolute, 'utf8'), {
      fileName: absolute, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText);
    const cjsModule = { exports: {} };
    modules.set(absolute, cjsModule);
    function isolatedRequire(specifier) {
      if (specifier === 'next/server') return { NextRequest, NextResponse };
      if (specifier === 'crypto' || specifier === 'node:crypto') return crypto;
      if (specifier === 'stripe') return function StripeFixture() { return stripe; };
      if (specifier === '@/lib/constants') return { BASE_URL: 'http://localhost:3000' };
      if (specifier === '@/lib/notifications') return {
        createSupabaseNotificationRepository: () => { throw new Error('Notifications must remain disabled'); },
        dispatchNotification: () => { throw new Error('Notifications must remain disabled'); },
      };
      if (specifier === './pool') return { getPooledSupabaseServerClient: () => database };
      if (specifier === '@/lib/auth/omega-auth') return { ΩAuthProvider: { verifyIdentity: async () => null } };
      const path = specifier.startsWith('@/') ? `src/${specifier.slice(2)}.ts` : null;
      const allowed = new Set([
        'src/lib/stripe/config.ts', 'src/lib/supabase/server.ts', 'src/lib/rate-limit.ts',
        'src/lib/stripe/billing-guard.ts', 'src/lib/stripe/billing-validators.ts',
        'src/lib/stripe/billing-tracing.ts', 'src/lib/stripe/billing-feature-flags.ts',
        'src/lib/idempotency.ts', 'src/lib/stripe/billing-audit-chain.ts',
      ]);
      if (!allowed.has(path)) throw new Error(`Unmodelled module boundary: ${specifier}`);
      const exports = load(path);
      if (path === 'src/lib/stripe/billing-validators.ts') return {
        ...exports,
        assessFraudRisk: params => {
          state.fraudInputs.push(clone(params));
          return exports.assessFraudRisk(params);
        },
      };
      return exports;
    }
    new Script(`(function(require,module,exports){${sourceCache.get(absolute)}\n})`, { filename: absolute }).runInContext(context)(isolatedRequire, cjsModule, cjsModule.exports);
    return cjsModule.exports;
  }
  const flags = load('src/lib/stripe/billing-feature-flags.ts');
  for (const [id, enabled] of Object.entries(options.flags ?? {})) {
    const flag = flags.getBillingFlag(id);
    if (!flag) throw new Error(`Unknown fixture flag: ${id}`);
    flag.enabled = enabled;
    flag.rolloutPct = enabled ? 100 : 0;
  }
  const checkout = load('src/app/api/stripe/checkout/route.ts');
  const webhook = load('src/app/api/stripe/webhook/route.ts');
  return {
    state, env, load, sdk,
    checkout(body = { planId: 'basic' }, headers = {}) {
      return checkout.POST(new NextRequest('http://localhost/api/stripe/checkout', {
        method: 'POST', headers: { authorization: 'Bearer fixture-valid-token', 'content-type': 'application/json', ...headers },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      }));
    },
    webhook(event, options = {}) {
      const payload = typeof event === 'string' ? event : JSON.stringify(event);
      const signature = sdk.webhooks.generateTestHeaderString({
        payload, secret: options.secret ?? FIXTURE_SECRET, timestamp: options.timestamp ?? Math.floor(Date.now() / 1000),
      });
      return webhook.POST(new NextRequest('http://localhost/api/stripe/webhook', {
        method: 'POST', body: options.body ?? payload,
        headers: options.noSignature ? {} : { 'stripe-signature': signature },
      }));
    },
  };
}

export function checkoutEvent(overrides = {}, eventOverrides = {}) {
  return {
    id: 'evt_fixture_checkout', object: 'event', type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000), livemode: false,
    data: { object: { id: 'cs_test_fixture', object: 'checkout.session', mode: 'subscription',
      payment_status: 'paid', customer: 'cus_fixture', subscription: 'sub_fixture',
      metadata: { supabase_user_id: USER, plan_id: 'basic' }, ...overrides } },
    ...eventOverrides,
  };
}

export function invoiceEvent() {
  return checkoutEvent({}, { id: 'evt_fixture_invoice', type: 'invoice.payment_failed',
    data: { object: { id: 'in_fixture', customer: 'cus_fixture', amount_due: 900 } } });
}

export const versions = {
  node: process.version, typescript: ts.version,
  stripe: JSON.parse(readFileSync(resolve(dirname(require.resolve('stripe')), '../package.json'), 'utf8')).version,
};
