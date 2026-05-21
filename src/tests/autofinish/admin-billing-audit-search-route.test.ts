// Autofinish #1342 — Admin Billing Audit Search Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/admin-billing-audit-search-route.test.ts

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
  console.log('\n🏁 Admin Billing Audit Search — Route Coverage Test Suite (#1342)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/admin/billing-audit-search/route.ts',
  );
  const apiRouteSource = fs.readFileSync(apiRoutePath, 'utf8');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Ruta exportuje GET handler', () => {
    assert(
      apiRouteSource.includes('export async function GET'),
      'Nedostaje export async function GET',
    );
  });

  await test('Ruta koristi verifyUserFromToken i hasBillingAuditScope zaštitu', () => {
    assert(apiRouteSource.includes('verifyUserFromToken'), 'Nedostaje verifyUserFromToken');
    assert(apiRouteSource.includes('hasBillingAuditScope'), 'Nedostaje hasBillingAuditScope');
    assert(apiRouteSource.includes('403'), 'Nedostaje 403 Forbidden odgovor');
  });

  await test('Ruta koristi buildAuditChainHash za integritet audit zapisa', () => {
    assert(apiRouteSource.includes('buildAuditChainHash'), 'Nedostaje buildAuditChainHash');
    assert(apiRouteSource.includes('chain_hash'), 'Nedostaje chain_hash polje');
    assert(apiRouteSource.includes('payload_hash'), 'Nedostaje payload_hash polje');
  });

  await test('Ruta podržava sve query parametre: userId, eventId, action, from, to, page, limit', () => {
    assert(apiRouteSource.includes("searchParams.get('userId')"), "Nedostaje userId param");
    assert(apiRouteSource.includes("searchParams.get('eventId')"), "Nedostaje eventId param");
    assert(apiRouteSource.includes("searchParams.get('action')"), "Nedostaje action param");
    assert(apiRouteSource.includes("searchParams.get('from')"), "Nedostaje from param");
    assert(apiRouteSource.includes("searchParams.get('to')"), "Nedostaje to param");
    assert(apiRouteSource.includes("searchParams.get('page')"), "Nedostaje page param");
    assert(apiRouteSource.includes("searchParams.get('limit')"), "Nedostaje limit param");
  });

  await test('Ruta ograničava limit na max 200', () => {
    assert(apiRouteSource.includes('Math.min(200'), 'Nedostaje Math.min(200 limit cap');
  });

  await test('Ruta vraća total, page, limit i results u JSON odgovoru', () => {
    assert(/\btotal\b/.test(apiRouteSource), 'Nedostaje total');
    assert(/\bresults\b/.test(apiRouteSource), 'Nedostaje results');
    assert(/\bpage\b/.test(apiRouteSource), 'Nedostaje page');
    assert(/\blimit\b/.test(apiRouteSource), 'Nedostaje limit');
  });

  await test('Ruta loguje admin.audit.search akciju u financial_audit_log', () => {
    assert(
      apiRouteSource.includes("'admin.audit.search'"),
      "Nedostaje 'admin.audit.search' akcija u audit zapisu",
    );
    assert(apiRouteSource.includes('financial_audit_log'), 'Nedostaje financial_audit_log tabela');
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
