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
      billing_revision: 0, failed_payment_count: 0, created_at: '2025-01-01T00:00:00Z',
      last_plan_changed_at: null, chat_messages_used: 4,
      ...options.profile,
    },
    events: [], commits: [], effects: [], audits: [], deadLetters: [], queries: [], authTokens: [],
    fraudInputs: [], sessionCalls: [], sessions: new Map(), customerCalls: [],
    subscriptionCalls: [], priceCalls: [], listCalls: [], logs: [], networkAttempts,
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
    subscriptions: { retrieve: async id => {
      state.subscriptionCalls.push(id);
      if (options.subscriptionError) throw new Error('Fixture subscription unavailable');
      return clone({ id: 'sub_fixture', customer: 'cus_fixture', status: 'active', livemode: false,
        items: { data: [{ price: { id: 'price_fixture_basic' }, quantity: 1 }] },
        latest_invoice: { id: 'in_fixture', customer: 'cus_fixture', status: 'paid', livemode: false },
        ...options.subscription });
    } },
    customers: { create: async (...args) => {
      state.customerCalls.push(clone(args));
      return { id: 'cus_fixture_new_1' }; // Same per-user customer idempotency key.
    } },
  };

  function query(table) {
    const operation = { table, kind: 'select', payload: null, filters: [] };
    const builder = {
      select(columns) { operation.columns = columns; return this; },
      insert(payload) { operation.kind = 'insert'; operation.payload = payload; return this; },
      update(payload) { operation.kind = 'update'; operation.payload = payload; return this; },
      is(key, value) { operation.filters.push([key, value]); return this; },
      maybeSingle() { operation.single = true; return this; },
      eq(key, value) { operation.filters.push([key, value]); return this; },
      order(key, opts) { operation.order = [key, opts]; return this; },
      limit(n) { operation.limit = n; return this; },
      single() { operation.single = true; return this; },
      then(onFulfilled, onRejected) { return Promise.resolve().then(execute).then(onFulfilled, onRejected); },
    };
    function execute() {
      state.queries.push(clone(operation));
      if (options.queryExecutor) return options.queryExecutor(operation);
      const matches = row => operation.filters.every(([key, value]) => row[key] === value);
      if (table === 'profiles') {
        if (operation.kind === 'select') return { data: options.profileReadError || options.missingProfile ? null : matches(state.profile) ? clone(state.profile) : null, error: options.profileReadError ?? null };
        state.profileWrites++;
        if (options.profileWriteThrow) throw Object.assign(new Error('Fixture profile write failure'), { code: '23514' });
        if (options.profileWriteError) return { data: null, error: options.profileWriteError };
        if (options.zeroProfileWrite) return { data: null, error: null };
        const matched = matches(state.profile);
        if (matched) Object.assign(state.profile, operation.payload);
        return { data: operation.columns && matched ? clone(state.profile) : null, error: null };
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
      if (table === 'stripe_billing_commits') {
        return { data: state.commits.find(matches) ?? null, error: options.commitReadError ?? null };
      }
      if (table === 'financial_audit_log') {
        if (options.auditReadError) return { data: null, error: options.auditReadError };
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
    rpc: async (name, args) => {
      if (options.rpcExecutor) return options.rpcExecutor(name, args);
      if (name !== 'commit_stripe_billing_event') throw new Error('Unmodelled RPC');
      state.queries.push({ rpc: name, args: clone(args) });
      state.eventInsertAttempts++;
      if (options.eventInsertThrow) throw Object.assign(new Error('Fixture event storage failure'), { code: '23514' });
      if (options.eventInsertError) return { data: null, error: options.eventInsertError };
      const { p_event: event, p_patch: patch, p_audit: audit, p_user_id: userId } = args;
      const prior = state.commits.find(e => e.event_id === event.id);
      if (prior) return prior.payload_hash === event.payload_hash
        ? { data: { ...prior.result, duplicate: true, applied: false }, error: null }
        : { data: null, error: { code: '23514' } };
      const duplicateEffect = state.effects.includes(event.effect_key);
      const last = state.commits.filter(e => e.subscription_id === event.subscription_id && e.result.applied)
        .reduce((max, e) => Math.max(max, e.event_created), 0);
      const stale = event.created < last;
      const applied = !!userId && Object.keys(patch).length > 0 && !duplicateEffect && !stale;
      if (applied) {
        if (state.profile.billing_revision !== args.p_expected_revision) return { data: null, error: { code: '40001' } };
        state.profileWrites++;
        if (options.profileWriteThrow) throw Object.assign(new Error('Fixture profile write failure'), { code: '23514' });
        if (options.profileWriteError) return { data: null, error: options.profileWriteError };
        if (options.auditWriteError) return { data: null, error: options.auditWriteError };
      }
      if (event.quarantine_reason && options.deadLetterError) return { data: null, error: options.deadLetterError };
      if (options.commitWriteError) return { data: null, error: options.commitWriteError };
      // Transaction boundary: all injected failures above leave financial state untouched.
      if (applied) {
        Object.assign(state.profile, clone(patch)); state.profile.billing_revision++;
        state.audits.push(clone(audit));
        if (event.effect_key) state.effects.push(event.effect_key);
      }
      if (event.quarantine_reason) state.deadLetters.push({ event_id: event.id, quarantine: true });
      const result = { committed: true, applied, duplicate_effect: duplicateEffect, out_of_order: stale, quarantined: !!event.quarantine_reason };
      state.commits.push({ event_id: event.id, subscription_id: event.subscription_id, event_created: event.created, payload_hash: event.payload_hash, result });
      state.events.push({ event_id: event.id, event_type: event.type });
      if (options.loseCommitResponseOnce) {
        options.loseCommitResponseOnce = false;
        return { data: null, error: { code: '08006' } };
      }
      return { data: result, error: null };
    },
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
    data: { object: { id: 'in_fixture', customer: 'cus_fixture', amount_due: 900, attempt_count: 1, parent: { subscription_details: { subscription: 'sub_fixture' } } } } });
}

export const versions = {
  node: process.version, typescript: ts.version,
  stripe: JSON.parse(readFileSync(resolve(dirname(require.resolve('stripe')), '../package.json'), 'utf8')).version,
};
