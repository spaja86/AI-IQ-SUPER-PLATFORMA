// Autofinish #1344 — Admin Billing Reconcile Invoices Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/admin-billing-reconcile-invoices-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA } from '../../lib/constants';

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

async function runTests(): Promise<void> {
  console.log('\n🏁 Admin Billing Reconcile Invoices — Route Coverage Test Suite (#1344)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/admin/billing-reconcile-invoices/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Ruta exportuje POST handler', () => {
    assert(
      apiRouteSource.includes('export async function POST'),
      'Nedostaje export async function POST',
    );
  });

  await test('Ruta koristi verifyUserFromToken i isAdminUser zaštitu', () => {
    assert(apiRouteSource.includes('verifyUserFromToken'), 'Nedostaje verifyUserFromToken');
    assert(apiRouteSource.includes('isAdminUser'), 'Nedostaje isAdminUser provjera');
    assert(apiRouteSource.includes('403'), 'Nedostaje 403 Forbidden odgovor');
  });

  await test('Ruta koristi Stripe invoices.list sa limit=100 i created.gte (48h)', () => {
    assert(apiRouteSource.includes('stripe.invoices.list'), 'Nedostaje stripe.invoices.list');
    assert(apiRouteSource.includes('limit: 100'), 'Nedostaje limit: 100');
    assert(apiRouteSource.includes('created: { gte: since }'), 'Nedostaje created.gte filter');
    assert(apiRouteSource.includes('48 * 60 * 60 * 1000'), 'Nedostaje 48h vremenski prozor');
  });

  await test('Ruta koristi STRIPE_INVOICE_STATUS_TO_LOCAL mapiranje', () => {
    assert(apiRouteSource.includes('STRIPE_INVOICE_STATUS_TO_LOCAL'), 'Nedostaje mapiranje statusa');
    assert(apiRouteSource.includes("paid: 'active'"), "Nedostaje paid -> active");
    assert(apiRouteSource.includes("open: 'past_due'"), "Nedostaje open -> past_due");
    assert(apiRouteSource.includes("void: 'canceled'"), "Nedostaje void -> canceled");
    assert(apiRouteSource.includes("uncollectible: 'past_due_locked'"), "Nedostaje uncollectible -> past_due_locked");
    assert(apiRouteSource.includes("draft: 'incomplete'"), "Nedostaje draft -> incomplete");
  });

  await test('Ruta detektuje mismatch i ažurira profiles.subscription_status', () => {
    assert(apiRouteSource.includes("from('profiles')"), 'Nedostaje profiles tabela');
    assert(apiRouteSource.includes('subscription_status'), 'Nedostaje subscription_status polje');
    assert(apiRouteSource.includes('.update({ subscription_status: expectedLocal'), 'Nedostaje update statusa');
    assert(apiRouteSource.includes('mismatches.push'), 'Nedostaje mismatch evidencija');
    assert(apiRouteSource.includes('fixed.push'), 'Nedostaje fixed evidencija');
  });

  await test('Ruta koristi buildAuditChainHash i upisuje reconcile.invoice.status_fixed audit', () => {
    assert(apiRouteSource.includes('buildAuditChainHash'), 'Nedostaje buildAuditChainHash');
    assert(apiRouteSource.includes("'reconcile.invoice.status_fixed'"), "Nedostaje audit akcija reconcile.invoice.status_fixed");
    assert(apiRouteSource.includes('payload_hash'), 'Nedostaje payload_hash');
    assert(apiRouteSource.includes('prev_hash'), 'Nedostaje prev_hash');
    assert(apiRouteSource.includes('chain_hash'), 'Nedostaje chain_hash');
    assert(apiRouteSource.includes("from('financial_audit_log')"), 'Nedostaje financial_audit_log tabela');
  });

  await test('Ruta vraća reconciled, mismatchCount, fixedCount, mismatches i timestamp', () => {
    assert(/\breconciled\b/.test(apiRouteSource), 'Nedostaje reconciled');
    assert(/\bmismatchCount\b/.test(apiRouteSource), 'Nedostaje mismatchCount');
    assert(/\bfixedCount\b/.test(apiRouteSource), 'Nedostaje fixedCount');
    assert(/\bmismatches\b/.test(apiRouteSource), 'Nedostaje mismatches');
    assert(/\btimestamp\b/.test(apiRouteSource), 'Nedostaje timestamp');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1337, 'AUTOFINISH_COUNT baseline');
    assert(TOTAL_API_ROUTES >= 1159, 'TOTAL_API_ROUTES baseline');
    assert(TOTAL_ROUTES >= 1260, 'TOTAL_ROUTES baseline');
    assert(TOTAL_DIAGNOSTIKA >= 2364, 'TOTAL_DIAGNOSTIKA baseline');
  });

  console.log(`\n🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspešni testovi:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Kritična greška u test runneru:', e);
  process.exit(1);
});
