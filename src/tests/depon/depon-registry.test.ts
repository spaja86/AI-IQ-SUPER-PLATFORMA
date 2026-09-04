// DEPON Registry — Unit Tests
// AI IQ SUPER PLATFORMA — 120M Scale US States Platform
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/depon/depon-registry.test.ts

import {
  DEPON_MODULES,
  US_STATES,
  SCALING_PHASES,
  getDepon,
  getDeponsByPhase,
  getActiveDepons,
  getDeponsByTag,
  getStateCompliance,
  getDeponSummary,
  getScalingPhase,
  type DeponPhase,
} from '../../depon/depon-registry';

import {
  buildAuthUser,
  buildAuthSession,
  isSessionValid,
  requiresStateAccess,
  AUTH_CONFIG,
} from '../../depon/depon-01-auth';

import {
  buildDefaultLayout,
  getStateInfo,
  getDefaultWidgets,
} from '../../depon/depon-02-dashboard';

import {
  buildEvent,
  computeEventsPerSecond,
  validateEventBatch,
  ANALYTICS_CONFIG,
} from '../../depon/depon-03-analytics';

import {
  calculateStateTax,
  buildPayment,
  buildSubscription,
  STATE_SALES_TAX_RATES,
} from '../../depon/depon-04-payments';

import {
  buildNotification,
  isChannelAllowed,
  buildDefaultPrefs,
} from '../../depon/depon-05-notifications';

import {
  buildContent,
  publishContent,
  matchesQuery,
  SUPPORTED_LOCALES,
} from '../../depon/depon-06-cms';

import {
  buildSearchQuery,
  validateSearchQuery,
  buildIndexDocument,
  SEARCH_CONFIG,
} from '../../depon/depon-07-search';

import {
  buildRequestContext,
  matchRoute,
  checkRateLimit,
  RATE_LIMITS,
} from '../../depon/depon-08-api-gateway';

import {
  buildPredictionRequest,
  getServingModel,
  buildMockPrediction,
} from '../../depon/depon-09-ai-ml';

import {
  buildAuditEntry,
  buildDSR,
  getApplicableLaws,
  DSR_DEADLINE_DAYS,
} from '../../depon/depon-10-compliance';

import {
  buildMobileSession,
  isVersionSupported,
  buildHomePayload,
  MIN_SUPPORTED_VERSION,
} from '../../depon/depon-11-mobile-bff';

import {
  buildReportJob,
  validateDateRange,
  getReportSchema,
  REPORT_SCHEMAS,
} from '../../depon/depon-12-reporting';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

// ─── DEPON Registry Tests ─────────────────────────────────────────────────────

async function runRegistryTests(): Promise<void> {
  console.log('\n🏛️  DEPON Registry Tests\n');

  await test('should have exactly 18 DEPON modules', () => {
    assertEqual(DEPON_MODULES.length, 18, 'module count');
  });

  await test('should cover all 50 US states', () => {
    assertEqual(US_STATES.length, 50, 'US states count');
  });

  await test('should have 3 scaling phases', () => {
    assertEqual(SCALING_PHASES.length, 3, 'scaling phases');
  });

  await test('getDepon returns correct module', () => {
    const d = getDepon('DEPON-01');
    assert(d !== undefined, 'DEPON-01 should exist');
    assertEqual(d!.name, 'User Identity & Auth', 'DEPON-01 name');
  });

  await test('getDepon returns undefined for invalid id', () => {
    // @ts-expect-error testing invalid input
    const d = getDepon('DEPON-99');
    assertEqual(d, undefined, 'invalid depon');
  });

  await test('getDeponsByPhase returns correct modules', () => {
    const phase1 = getDeponsByPhase(1);
    assert(phase1.length >= 4, 'at least 4 phase-1 modules');
    assert(phase1.every((m) => m.phase === 1), 'all are phase 1');
  });

  await test('getActiveDepons returns only active modules', () => {
    const active = getActiveDepons();
    assert(active.length >= 1, 'at least 1 active module');
    assert(active.every((m) => m.status === 'active'), 'all status active');
  });

  await test('getDeponsByTag works correctly', () => {
    const authModules = getDeponsByTag('auth');
    assert(authModules.length >= 1, 'at least 1 auth-tagged module');
  });

  await test('getStateCompliance returns laws for CA', () => {
    const laws = getStateCompliance('CA');
    assert(laws.includes('CCPA'), 'CA should have CCPA');
  });

  await test('getStateCompliance returns empty array for unknown state', () => {
    const laws = getStateCompliance('ZZ');
    assertEqual(laws.length, 0, 'unknown state laws');
  });

  await test('getDeponSummary is consistent', () => {
    const summary = getDeponSummary();
    assertEqual(summary.total, 18, 'total');
    assertEqual(summary.active + summary.planned, 18, 'active+planned');
    const phaseSum = summary.byPhase[1] + summary.byPhase[2] + summary.byPhase[3];
    assertEqual(phaseSum, 18, 'phase sum');
  });

  await test('getScalingPhase returns correct data', () => {
    const p3 = getScalingPhase(3);
    assert(p3 !== undefined, 'phase 3 should exist');
    assertEqual(p3!.regions, 12, 'phase 3 has 12 regions');
  });

  await test('all DEPON modules have unique IDs', () => {
    const ids = new Set(DEPON_MODULES.map((m) => m.id));
    assertEqual(ids.size, DEPON_MODULES.length, 'unique IDs');
  });

  await test('all DEPON modules have unique ports', () => {
    const ports = new Set(DEPON_MODULES.map((m) => m.port));
    assertEqual(ports.size, DEPON_MODULES.length, 'unique ports');
  });
}

// ─── DEPON-01 Auth Tests ──────────────────────────────────────────────────────

async function runAuthTests(): Promise<void> {
  console.log('\n🔐 DEPON-01 Auth Tests\n');

  await test('buildAuthUser creates valid user', () => {
    const u = buildAuthUser({ id: 'u1', email: 'test@example.com', stateCode: 'CA', provider: 'email' });
    assertEqual(u.id, 'u1', 'id');
    assertEqual(u.role, 'user', 'default role');
    assertEqual(u.mfaEnabled, false, 'default mfa');
  });

  await test('buildAuthSession creates active session', () => {
    const s = buildAuthSession({ userId: 'u1', stateCode: 'CA', ipAddress: '1.2.3.4', userAgent: 'test' });
    assertEqual(s.status, 'active', 'status');
    assert(s.expiresAt > new Date(), 'expires in future');
  });

  await test('isSessionValid returns true for active session', () => {
    const s = buildAuthSession({ userId: 'u1', stateCode: 'NY', ipAddress: '1.2.3.4', userAgent: 'ua' });
    assert(isSessionValid(s), 'should be valid');
  });

  await test('isSessionValid returns false for expired session', () => {
    const s = buildAuthSession({ userId: 'u1', stateCode: 'NY', ipAddress: '1.2.3.4', userAgent: 'ua' });
    const expired = { ...s, expiresAt: new Date(Date.now() - 1000) };
    assert(!isSessionValid(expired), 'should be invalid');
  });

  await test('requiresStateAccess allows super-admin any state', () => {
    const u = buildAuthUser({ id: 'u1', email: 'a@b.com', stateCode: 'CA', provider: 'email', role: 'super-admin' });
    assert(requiresStateAccess(u, 'TX'), 'super-admin can access TX');
  });

  await test('requiresStateAccess restricts user to own state', () => {
    const u = buildAuthUser({ id: 'u1', email: 'a@b.com', stateCode: 'CA', provider: 'email' });
    assert(!requiresStateAccess(u, 'TX'), 'user cannot access TX');
    assert(requiresStateAccess(u, 'CA'), 'user can access own state');
  });

  await test('AUTH_CONFIG sessionTtlMs is positive', () => {
    assert(AUTH_CONFIG.sessionTtlMs > 0, 'session TTL > 0');
    assert(AUTH_CONFIG.maxFailedAttempts > 0, 'maxFailedAttempts > 0');
  });
}

// ─── DEPON-02 Dashboard Tests ─────────────────────────────────────────────────

async function runDashboardTests(): Promise<void> {
  console.log('\n🗺️  DEPON-02 Dashboard Tests\n');

  await test('buildDefaultLayout creates layout with widgets', () => {
    const layout = buildDefaultLayout({ stateCode: 'CA', userId: 'u1' });
    assert(layout.widgets.length > 0, 'has widgets');
    assertEqual(layout.stateCode, 'CA', 'stateCode');
    assertEqual(layout.theme, 'light', 'default theme');
  });

  await test('getDefaultWidgets returns more widgets for big states', () => {
    const caWidgets = getDefaultWidgets('CA');
    const wyWidgets = getDefaultWidgets('WY');
    assert(caWidgets.length >= wyWidgets.length, 'CA has >= widgets than WY');
  });

  await test('getStateInfo returns data for known states', () => {
    const info = getStateInfo('NY');
    assert(info !== null, 'NY info not null');
    assertEqual(info!.stateName, 'New York', 'stateName');
  });

  await test('getStateInfo returns null for unknown state', () => {
    const info = getStateInfo('ZZ');
    assertEqual(info, null, 'unknown state is null');
  });
}

// ─── DEPON-03 Analytics Tests ─────────────────────────────────────────────────

async function runAnalyticsTests(): Promise<void> {
  console.log('\n📊 DEPON-03 Analytics Tests\n');

  await test('buildEvent creates valid event', () => {
    const e = buildEvent({ category: 'page_view', name: 'home_loaded', stateCode: 'TX' });
    assert(e.eventId.startsWith('evt_TX_'), 'eventId prefix');
    assertEqual(e.category, 'page_view', 'category');
  });

  await test('computeEventsPerSecond is correct', () => {
    const eps = computeEventsPerSecond(86_400);
    assertEqual(eps, 1, '1 event/sec for 86400/day');
    const eps120M = computeEventsPerSecond(ANALYTICS_CONFIG.targetEventsPerDay);
    assert(eps120M > 0, '120M events/day > 0 eps');
  });

  await test('validateEventBatch separates valid/invalid', () => {
    const events = [
      buildEvent({ category: 'api_call', name: 'login', stateCode: 'FL' }),
      { eventId: '', category: 'error', name: 'crash', stateCode: 'FL', userId: null, sessionId: null, properties: {}, timestamp: new Date(), deponSource: 'DEPON-01' } as any,
    ];
    const { valid, invalid } = validateEventBatch(events);
    assertEqual(valid.length, 1, 'valid count');
    assertEqual(invalid.length, 1, 'invalid count');
  });

  await test('ANALYTICS_CONFIG target is 120M', () => {
    assertEqual(ANALYTICS_CONFIG.targetEventsPerDay, 120_000_000, 'target events/day');
    assertEqual(ANALYTICS_CONFIG.targetUsersTotal, 120_000_000, 'target users');
  });
}

// ─── DEPON-04 Payments Tests ──────────────────────────────────────────────────

async function runPaymentsTests(): Promise<void> {
  console.log('\n💳 DEPON-04 Payments Tests\n');

  await test('calculateStateTax CA', () => {
    const { taxRate, taxAmount, totalAmount } = calculateStateTax(100, 'CA');
    assertEqual(taxRate, 0.0725, 'CA tax rate');
    assertEqual(taxAmount, 7.25, 'CA tax amount');
    assertEqual(totalAmount, 107.25, 'CA total');
  });

  await test('calculateStateTax AK is 0%', () => {
    const { taxRate, taxAmount } = calculateStateTax(100, 'AK');
    assertEqual(taxRate, 0, 'AK no tax');
    assertEqual(taxAmount, 0, 'AK tax amount');
  });

  await test('buildPayment creates valid payment with state tax', () => {
    const p = buildPayment({ userId: 'u1', stateCode: 'NY', amount: 50, method: 'card', idempotencyKey: 'ik1' });
    assertEqual(p.status, 'pending', 'status');
    assertEqual(p.stateCode, 'NY', 'stateCode');
    assert(p.paymentId.startsWith('pay_NY_'), 'paymentId prefix');
  });

  await test('buildSubscription creates valid subscription', () => {
    const s = buildSubscription({ userId: 'u1', stateCode: 'TX', tier: 'pro', cycle: 'monthly' });
    assertEqual(s.status, 'active', 'status');
    assertEqual(s.tier, 'pro', 'tier');
    assert(s.currentPeriodEnd > s.currentPeriodStart, 'period end > start');
  });

  await test('STATE_SALES_TAX_RATES has all 50 states', () => {
    assertEqual(Object.keys(STATE_SALES_TAX_RATES).length, 50, '50 state tax rates');
  });
}

// ─── DEPON-05 Notifications Tests ────────────────────────────────────────────

async function runNotificationsTests(): Promise<void> {
  console.log('\n🔔 DEPON-05 Notifications Tests\n');

  await test('buildNotification creates queued notification', () => {
    const n = buildNotification({ userId: 'u1', stateCode: 'WA', channel: 'email', subject: 'Hello', body: 'World' });
    assertEqual(n.status, 'queued', 'status');
    assertEqual(n.channel, 'email', 'channel');
    assertEqual(n.priority, 'normal', 'default priority');
  });

  await test('isChannelAllowed blocks disabled channels', () => {
    const prefs = buildDefaultPrefs({ userId: 'u1', stateCode: 'CA' });
    assert(!isChannelAllowed('sms', 'CA', prefs), 'sms blocked by default in CA');
    assert(isChannelAllowed('email', 'CA', prefs), 'email allowed');
  });

  await test('buildDefaultPrefs sets correct defaults', () => {
    const prefs = buildDefaultPrefs({ userId: 'u1', stateCode: 'NY' });
    assertEqual(prefs.channels.email, true, 'email default on');
    assertEqual(prefs.channels.push, false, 'push default off');
  });
}

// ─── DEPON-06 CMS Tests ───────────────────────────────────────────────────────

async function runCmsTests(): Promise<void> {
  console.log('\n📝 DEPON-06 CMS Tests\n');

  await test('buildContent creates draft content', () => {
    const c = buildContent({ type: 'page', slug: 'home', title: 'Home', body: 'Welcome', authorId: 'a1' });
    assertEqual(c.status, 'draft', 'status');
    assertEqual(c.version, 1, 'version');
    assertEqual(c.publishedAt, null, 'not published');
  });

  await test('publishContent sets status and publishedAt', () => {
    const c = buildContent({ type: 'article', slug: 'news', title: 'News', body: 'body', authorId: 'a1' });
    const published = publishContent(c);
    assertEqual(published.status, 'published', 'published status');
    assert(published.publishedAt !== null, 'publishedAt set');
  });

  await test('matchesQuery filters correctly', () => {
    const c = buildContent({ type: 'faq', slug: 'faq-1', title: 'FAQ', body: 'A', authorId: 'a1', stateCode: 'CA' });
    assert(matchesQuery(c, { type: 'faq' }), 'matches by type');
    assert(!matchesQuery(c, { type: 'page' }), 'no match on wrong type');
  });

  await test('SUPPORTED_LOCALES includes en-US', () => {
    assert(SUPPORTED_LOCALES.includes('en-US'), 'en-US supported');
    assert(SUPPORTED_LOCALES.includes('es-US'), 'es-US supported');
  });
}

// ─── DEPON-07 Search Tests ────────────────────────────────────────────────────

async function runSearchTests(): Promise<void> {
  console.log('\n🔍 DEPON-07 Search Tests\n');

  await test('buildSearchQuery creates valid query', () => {
    const q = buildSearchQuery({ index: 'users', q: 'john doe', stateCode: 'CA' });
    assertEqual(q.index, 'users', 'index');
    assertEqual(q.q, 'john doe', 'q');
    assertEqual(q.pagination.page, 1, 'default page');
    assertEqual(q.pagination.pageSize, SEARCH_CONFIG.defaultPageSize, 'default page size');
  });

  await test('validateSearchQuery rejects short query', () => {
    const q = buildSearchQuery({ index: 'content', q: 'a' });
    const { valid, errors } = validateSearchQuery(q);
    assert(!valid, 'should be invalid');
    assert(errors.length > 0, 'should have errors');
  });

  await test('validateSearchQuery accepts valid query', () => {
    const q = buildSearchQuery({ index: 'content', q: 'test query' });
    const { valid } = validateSearchQuery(q);
    assert(valid, 'should be valid');
  });

  await test('buildIndexDocument creates document', () => {
    const doc = buildIndexDocument({ index: 'products', body: { name: 'test' }, stateCode: 'TX' });
    assertEqual(doc.index, 'products', 'index');
    assertEqual(doc.stateCode, 'TX', 'stateCode');
  });
}

// ─── DEPON-08 API Gateway Tests ───────────────────────────────────────────────

async function runApiGatewayTests(): Promise<void> {
  console.log('\n🚦 DEPON-08 API Gateway Tests\n');

  await test('buildRequestContext creates context', () => {
    const ctx = buildRequestContext({ ipAddress: '1.2.3.4', userAgent: 'ua', method: 'GET', path: '/api/auth/login' });
    assert(ctx.requestId.startsWith('req_'), 'requestId prefix');
    assertEqual(ctx.tier, 'free', 'default tier');
  });

  await test('matchRoute finds correct route', () => {
    const route = matchRoute('/api/auth/login', 'POST');
    assert(route !== null, 'route found');
    assertEqual(route!.targetDepon, 'DEPON-01', 'target depon');
  });

  await test('matchRoute returns null for unknown path', () => {
    const route = matchRoute('/api/unknown/xyz', 'GET');
    assertEqual(route, null, 'unknown route is null');
  });

  await test('checkRateLimit allows within limit', () => {
    const result = checkRateLimit('pro', 100);
    assert(result.allowed, 'should allow within limit');
    assert(result.retryAfterMs === null, 'no retry delay');
  });

  await test('checkRateLimit blocks over limit', () => {
    const result = checkRateLimit('free', 999999);
    assert(!result.allowed, 'should block over limit');
    assert(result.retryAfterMs !== null && result.retryAfterMs > 0, 'retry delay set');
  });

  await test('RATE_LIMITS enterprise > pro', () => {
    assert(
      RATE_LIMITS.enterprise.requestsPerMinute > RATE_LIMITS.pro.requestsPerMinute,
      'enterprise > pro rate limit',
    );
  });
}

// ─── DEPON-09 AI/ML Tests ─────────────────────────────────────────────────────

async function runAiMlTests(): Promise<void> {
  console.log('\n🤖 DEPON-09 AI/ML Tests\n');

  await test('buildPredictionRequest creates valid request', () => {
    const req = buildPredictionRequest({ modelType: 'recommendation', userId: 'u1', stateCode: 'CA', features: { age: 30 } });
    assert(req.requestId.startsWith('pred_recommendation_'), 'requestId prefix');
    assertEqual(req.topK, 5, 'default topK');
  });

  await test('getServingModel finds recommendation model', () => {
    const model = getServingModel('recommendation', 'CA');
    assert(model !== null, 'model found');
    assertEqual(model!.status, 'serving', 'serving status');
  });

  await test('getServingModel returns null for unavailable model', () => {
    const model = getServingModel('usage-forecast', 'CA');
    assertEqual(model, null, 'no usage-forecast model');
  });

  await test('buildMockPrediction generates correct count', () => {
    const req = buildPredictionRequest({ modelType: 'fraud-detection', userId: 'u1', stateCode: 'NY', features: {}, topK: 3 });
    const result = buildMockPrediction(req, '2.0.0');
    assertEqual(result.predictions.length, 3, 'topK predictions');
    assert(result.predictions[0].score >= result.predictions[1].score, 'sorted by score');
  });
}

// ─── DEPON-10 Compliance Tests ────────────────────────────────────────────────

async function runComplianceTests(): Promise<void> {
  console.log('\n🛡️  DEPON-10 Compliance Tests\n');

  await test('buildAuditEntry creates valid entry', () => {
    const e = buildAuditEntry({ action: 'user.login', actorId: 'u1', actorRole: 'user', stateCode: 'CA', ipAddress: '1.2.3.4' });
    assert(e.auditId.startsWith('aud_user_login_'), 'auditId prefix');
    assert(e.laws.includes('CCPA'), 'CA includes CCPA');
  });

  await test('buildDSR creates pending request with deadline', () => {
    const dsr = buildDSR({ type: 'deletion', userId: 'u1', stateCode: 'NY' });
    assertEqual(dsr.status, 'pending', 'pending status');
    assert(dsr.deadline > dsr.submittedAt, 'deadline after submission');
  });

  await test('DSR deadline is 45 days for deletion', () => {
    const dsr = buildDSR({ type: 'deletion', userId: 'u1', stateCode: 'CA' });
    const diffDays = Math.round((dsr.deadline.getTime() - dsr.submittedAt.getTime()) / 86_400_000);
    assertEqual(diffDays, DSR_DEADLINE_DAYS.deletion, 'deletion deadline');
  });

  await test('getApplicableLaws includes HIPAA for all states', () => {
    for (const state of ['CA', 'NY', 'TX', 'FL', 'CO', 'VA']) {
      const laws = getApplicableLaws(state);
      assert(laws.includes('HIPAA'), `${state} should include HIPAA`);
    }
  });
}

// ─── DEPON-11 Mobile BFF Tests ────────────────────────────────────────────────

async function runMobileTests(): Promise<void> {
  console.log('\n📱 DEPON-11 Mobile BFF Tests\n');

  const device = {
    deviceId: 'd1',
    os: 'ios' as const,
    osVersion: '17.0',
    appVersion: { major: 2, minor: 1, patch: 0, build: '2100' },
    pushToken: 'tok123',
    locale: 'en-US',
    timezone: 'America/New_York',
  };

  await test('buildMobileSession creates active session', () => {
    const s = buildMobileSession({ userId: 'u1', device, stateCode: 'FL' });
    assert(s.sessionId.startsWith('mob_ios_'), 'sessionId prefix');
    assert(s.isActive, 'is active');
  });

  await test('isVersionSupported accepts current version', () => {
    assert(isVersionSupported({ major: 3, minor: 0, patch: 0, build: '3000' }), '3.0.0 is supported');
    assert(isVersionSupported(MIN_SUPPORTED_VERSION), 'min version is supported');
  });

  await test('isVersionSupported rejects old version', () => {
    assert(!isVersionSupported({ major: 1, minor: 9, patch: 9, build: '1999' }), '1.9.9 not supported');
  });

  await test('buildHomePayload has correct defaults', () => {
    const payload = buildHomePayload({ userId: 'u1', stateCode: 'WA' });
    assertEqual(payload.unreadNotifications, 0, 'default 0 unread');
    assertEqual(payload.recentActivity.length, 0, 'empty activity');
  });
}

// ─── DEPON-12 Reporting Tests ─────────────────────────────────────────────────

async function runReportingTests(): Promise<void> {
  console.log('\n📈 DEPON-12 Reporting Tests\n');

  const start = new Date('2025-01-01');
  const end = new Date('2025-03-31');

  await test('buildReportJob creates queued job', () => {
    const job = buildReportJob({ type: 'user-summary', requestedBy: 'admin', dateRangeStart: start, dateRangeEnd: end });
    assertEqual(job.status, 'queued', 'status');
    assertEqual(job.type, 'user-summary', 'type');
    assert(job.expiresAt !== null, 'has expiry');
  });

  await test('validateDateRange accepts valid range', () => {
    const { valid } = validateDateRange(start, end);
    assert(valid, 'should be valid');
  });

  await test('validateDateRange rejects start >= end', () => {
    const { valid, error } = validateDateRange(end, start);
    assert(!valid, 'should be invalid');
    assert(error !== undefined, 'should have error');
  });

  await test('validateDateRange rejects range > 366 days', () => {
    const longEnd = new Date(start);
    longEnd.setFullYear(longEnd.getFullYear() + 2);
    const { valid } = validateDateRange(start, longEnd);
    assert(!valid, 'should reject 2-year range');
  });

  await test('REPORT_SCHEMAS has all 7 types', () => {
    assertEqual(Object.keys(REPORT_SCHEMAS).length, 7, '7 report types');
  });

  await test('getReportSchema returns correct schema', () => {
    const schema = getReportSchema('compliance-audit');
    assertEqual(schema.defaultFormat, 'pdf', 'compliance-audit defaults to pdf');
    assert(schema.columns.length > 0, 'has columns');
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runAll(): Promise<void> {
  console.log('🚀 DEPON 120M Platform Test Suite');
  console.log('   AI IQ SUPER PLATFORMA — US States Edition');
  console.log('   Kompanija SPAJA — Digitalna Industrija\n');

  await runRegistryTests();
  await runAuthTests();
  await runDashboardTests();
  await runAnalyticsTests();
  await runPaymentsTests();
  await runNotificationsTests();
  await runCmsTests();
  await runSearchTests();
  await runApiGatewayTests();
  await runAiMlTests();
  await runComplianceTests();
  await runMobileTests();
  await runReportingTests();

  console.log('\n─────────────────────────────────────────────');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) console.log(`  • ${f}`);
  }
  console.log('─────────────────────────────────────────────\n');
  if (failed > 0) process.exit(1);
}

runAll();
