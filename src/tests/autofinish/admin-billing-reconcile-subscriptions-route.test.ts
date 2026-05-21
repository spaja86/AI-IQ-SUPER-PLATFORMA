// Autofinish #1345 — Admin Billing Reconcile Subscriptions Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/admin-billing-reconcile-subscriptions-route.test.ts

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
  console.log('\n🏁 Admin Billing Reconcile Subscriptions — Route Coverage Test Suite (#1345)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/admin/billing-reconcile-subscriptions/route.ts',
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

  await test('Ruta dohvata profiles sa stripe_subscription_id i koristi subscriptions.retrieve', () => {
    assert(apiRouteSource.includes("from('profiles')"), 'Nedostaje profiles tabela');
    assert(apiRouteSource.includes('stripe_subscription_id'), 'Nedostaje stripe_subscription_id polje');
    assert(apiRouteSource.includes('stripe.subscriptions.retrieve'), 'Nedostaje subscriptions.retrieve');
    assert(apiRouteSource.includes("expand: ['items.data.price']"), 'Nedostaje price expand');
  });

  await test('Ruta koristi STRIPE_STATUS_TO_LOCAL mapiranje sa svim ključnim statusima', () => {
    assert(apiRouteSource.includes('STRIPE_STATUS_TO_LOCAL'), 'Nedostaje mapiranje statusa');
    assert(apiRouteSource.includes("active: 'active'"), "Nedostaje active -> active");
    assert(apiRouteSource.includes("trialing: 'trialing'"), "Nedostaje trialing -> trialing");
    assert(apiRouteSource.includes("past_due: 'past_due'"), "Nedostaje past_due -> past_due");
    assert(apiRouteSource.includes("canceled: 'canceled'"), "Nedostaje canceled -> canceled");
    assert(apiRouteSource.includes("unpaid: 'past_due_locked'"), "Nedostaje unpaid -> past_due_locked");
    assert(apiRouteSource.includes("paused: 'paused'"), "Nedostaje paused -> paused");
  });

  await test('Ruta koristi stripePriceIdToPlan i PLANOVI za plan reconcile', () => {
    assert(apiRouteSource.includes('stripePriceIdToPlan'), 'Nedostaje stripePriceIdToPlan');
    assert(apiRouteSource.includes('PLANOVI'), 'Nedostaje PLANOVI import');
    assert(apiRouteSource.includes('remotePlan'), 'Nedostaje remotePlan logika');
  });

  await test('Ruta ažurira subscription_status i plan u profiles pri mismatch-u', () => {
    assert(apiRouteSource.includes("field: 'subscription_status'"), 'Nedostaje mismatch za subscription_status');
    assert(apiRouteSource.includes("field: 'plan'"), 'Nedostaje mismatch za plan');
    assert(apiRouteSource.includes("updates['subscription_status']"), 'Nedostaje subscription_status update');
    assert(apiRouteSource.includes("updates['plan']"), 'Nedostaje plan update');
    assert(apiRouteSource.includes('mismatches.push'), 'Nedostaje mismatch evidencija');
    assert(apiRouteSource.includes('fixed.push'), 'Nedostaje fixed evidencija');
  });

  await test('Ruta koristi buildAuditChainHash i upisuje reconcile.subscription.fixed audit', () => {
    assert(apiRouteSource.includes('buildAuditChainHash'), 'Nedostaje buildAuditChainHash');
    assert(apiRouteSource.includes("'reconcile.subscription.fixed'"), "Nedostaje audit akcija reconcile.subscription.fixed");
    assert(apiRouteSource.includes('payload_hash'), 'Nedostaje payload_hash');
    assert(apiRouteSource.includes('prev_hash'), 'Nedostaje prev_hash');
    assert(apiRouteSource.includes('chain_hash'), 'Nedostaje chain_hash');
    assert(apiRouteSource.includes("from('financial_audit_log')"), 'Nedostaje financial_audit_log tabela');
  });

  await test('Ruta vraća reconciled, profilesChecked, mismatchCount, fixedCount, mismatches i timestamp', () => {
    assert(/\breconciled\b/.test(apiRouteSource), 'Nedostaje reconciled');
    assert(/\bprofilesChecked\b/.test(apiRouteSource), 'Nedostaje profilesChecked');
    assert(/\bmismatchCount\b/.test(apiRouteSource), 'Nedostaje mismatchCount');
    assert(/\bfixedCount\b/.test(apiRouteSource), 'Nedostaje fixedCount');
    assert(/\bmismatches\b/.test(apiRouteSource), 'Nedostaje mismatches');
    assert(/\btimestamp\b/.test(apiRouteSource), 'Nedostaje timestamp');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.16.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1337, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1159, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1260, 'TOTAL_ROUTES');
    assertEqual(TOTAL_DIAGNOSTIKA, 2364, 'TOTAL_DIAGNOSTIKA');
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
