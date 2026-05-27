// Autofinish #1343 — Admin Billing PII Scan Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/admin-billing-pii-scan-route.test.ts

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
  console.log('\n🏁 Admin Billing PII Scan — Route Coverage Test Suite (#1343)\n');

  const apiRoutePath = path.resolve(
    process.cwd(),
    'src/app/api/admin/billing-pii-scan/route.ts',
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

  await test('Ruta koristi verifyUserFromToken i isAdminUser zaštitu', () => {
    assert(apiRouteSource.includes('verifyUserFromToken'), 'Nedostaje verifyUserFromToken');
    assert(apiRouteSource.includes('isAdminUser'), 'Nedostaje isAdminUser provjera');
    assert(apiRouteSource.includes('403'), 'Nedostaje 403 Forbidden odgovor');
  });

  await test('Ruta sadrži PII_PATTERNS sa svim tipovima (email, card_number, iban, phone, ssn_like)', () => {
    assert(apiRouteSource.includes("'email'"), "Nedostaje email PII pattern");
    assert(apiRouteSource.includes("'card_number'"), "Nedostaje card_number PII pattern");
    assert(apiRouteSource.includes("'iban'"), "Nedostaje iban PII pattern");
    assert(apiRouteSource.includes("'phone'"), "Nedostaje phone PII pattern");
    assert(apiRouteSource.includes("'ssn_like'"), "Nedostaje ssn_like PII pattern");
  });

  await test('Ruta sadrži scanForPii helper funkciju', () => {
    assert(apiRouteSource.includes('scanForPii'), 'Nedostaje scanForPii funkcija');
    assert(apiRouteSource.includes('piiFindings'), 'Nedostaje piiFindings u odgovoru');
  });

  await test('Ruta podržava limit i since query parametre', () => {
    assert(apiRouteSource.includes("searchParams.get('limit')") || apiRouteSource.includes('searchParams.get("limit")'), "Nedostaje limit param");
    assert(apiRouteSource.includes("searchParams.get('since')") || apiRouteSource.includes('searchParams.get("since")'), "Nedostaje since param");
  });

  await test('Ruta ograničava limit na max 500', () => {
    assert(apiRouteSource.includes('Math.min(limit, 500)') || apiRouteSource.includes('Math.min(500'), 'Nedostaje Math.min(... 500 limit cap');
  });

  await test('Ruta vraća scannedEntries, violationCount, violations, piiPatternsChecked i timestamp', () => {
    assert(/\bscannedEntries\b/.test(apiRouteSource), 'Nedostaje scannedEntries');
    assert(/\bviolationCount\b/.test(apiRouteSource), 'Nedostaje violationCount');
    assert(/\bviolations\b/.test(apiRouteSource), 'Nedostaje violations');
    assert(/\bpiiPatternsChecked\b/.test(apiRouteSource), 'Nedostaje piiPatternsChecked');
    assert(/\btimestamp\b/.test(apiRouteSource), 'Nedostaje timestamp');
  });

  await test('Ruta skenira financial_audit_log tabelu', () => {
    assert(apiRouteSource.includes('financial_audit_log'), 'Nedostaje financial_audit_log tabela');
    assert(apiRouteSource.includes("'metadata'") || apiRouteSource.includes('"metadata"') || apiRouteSource.includes('metadata'), 'Nedostaje metadata kolona u selekciji');
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
