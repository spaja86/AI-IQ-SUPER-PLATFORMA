import { APP_VERSION } from '../../lib/constants';
import {
  API_CHANGELOG,
  API_TAGS,
  API_VERSION_POLICIES,
  defineRouteDoc,
  getApiVersionPolicy,
  getDeprecationHeaders,
  OPENAPI_INFO,
} from '../../lib/openapi-meta';

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
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function runTests(): Promise<void> {
  console.log('\n📘 OpenAPI Meta Test Suite\n');

  await test('OPENAPI_INFO ima očekivanu strukturu i koristi APP_VERSION', () => {
    assertEqual(OPENAPI_INFO.openapi, '3.1.0', 'openapi version');
    assertEqual(OPENAPI_INFO.info.version, APP_VERSION, 'info.version');
    assert(OPENAPI_INFO.info.title.length > 0, 'title ne sme biti prazan');
    assert(OPENAPI_INFO.info.description.includes('Bearer'), 'description treba da pokrije autentifikaciju');
    assert(Array.isArray(OPENAPI_INFO.servers) && OPENAPI_INFO.servers.length >= 3, 'servers mora imati >= 3');
    assert(OPENAPI_INFO.servers.some((s) => s.description === 'Produkcija'), 'mora postojati produkcioni server');
  });

  await test('API_TAGS sadrži ključne taksonomije bez duplikata', () => {
    assert(API_TAGS.length >= 10, 'mora postojati najmanje 10 tagova');
    const names = API_TAGS.map((tag) => tag.name);
    const uniqueNames = new Set(names);
    assertEqual(uniqueNames.size, names.length, 'tag imena moraju biti jedinstvena');

    const requiredTags = ['auth', 'billing', 'ai', 'autofinish', 'admin'];
    for (const tag of requiredTags) {
      assert(names.includes(tag), `nedostaje tag: ${tag}`);
    }
  });

  await test('getApiVersionPolicy vraća politiku za postojeću verziju i null za nepostojeću', () => {
    const v1 = getApiVersionPolicy('v1');
    assert(v1 !== null, 'v1 politika mora postojati');
    if (v1) {
      assertEqual(v1.status, 'current', 'v1 status');
      assertEqual(v1.sendDeprecationHeader, false, 'v1 sendDeprecationHeader');
    }

    const missing = getApiVersionPolicy('v999');
    assertEqual(missing, null, 'nepostojeća verzija');
  });

  await test('getDeprecationHeaders za v1 vraća prazan objekat', () => {
    const headers = getDeprecationHeaders('v1');
    assertEqual(Object.keys(headers).length, 0, 'v1 headers treba da bude prazan');
  });

  await test('getDeprecationHeaders generiše Deprecation/Sunset/Link za sunset politiku', () => {
    const tempPolicy = {
      version: 'v0-temp-test',
      status: 'sunset' as const,
      deprecatedSince: '2026-01-01',
      sunsetDate: '2026-07-01',
      migrationPath: 'https://docs.spaja.ai/migration/v0-to-v1',
      migrateTo: 'v1',
      sendDeprecationHeader: true,
    };

    API_VERSION_POLICIES.push(tempPolicy);
    try {
      const headers = getDeprecationHeaders(tempPolicy.version);
      assertEqual(headers.Deprecation, '2026-01-01', 'Deprecation');
      assert(typeof headers.Sunset === 'string' && headers.Sunset.includes('GMT'), 'Sunset mora biti UTC date string');
      assertEqual(headers.Link, '<https://docs.spaja.ai/migration/v0-to-v1>; rel="deprecation"', 'Link');
    } finally {
      API_VERSION_POLICIES.pop();
    }
  });

  await test('getDeprecationHeaders koristi fallback Deprecation=true ako deprecatedSince nije definisan', () => {
    const tempPolicy = {
      version: 'v0-fallback-test',
      status: 'deprecated' as const,
      sendDeprecationHeader: true,
    };

    API_VERSION_POLICIES.push(tempPolicy);
    try {
      const headers = getDeprecationHeaders(tempPolicy.version);
      assertEqual(headers.Deprecation, 'true', 'Deprecation fallback');
      assertEqual(Object.prototype.hasOwnProperty.call(headers, 'Sunset'), false, 'Sunset ne treba da postoji');
      assertEqual(Object.prototype.hasOwnProperty.call(headers, 'Link'), false, 'Link ne treba da postoji');
    } finally {
      API_VERSION_POLICIES.pop();
    }
  });

  await test('defineRouteDoc vraća isti doc objekat i čuva polja', () => {
    const doc = {
      summary: 'Test ruta',
      description: 'Opis test rute',
      tags: ['billing'],
      requiresAuth: true,
      rateLimit: '10/min',
      idempotent: true,
    };

    const result = defineRouteDoc(doc);
    assertEqual(result, doc, 'defineRouteDoc treba da vrati isti objekat');
    assertEqual(result.summary, 'Test ruta', 'summary');
    assertEqual(result.requiresAuth, true, 'requiresAuth');
    assertEqual(result.tags[0], 'billing', 'tags');
  });

  await test('API_CHANGELOG ima validne i konzistentne stavke', () => {
    assert(API_CHANGELOG.length >= 3, 'changelog mora imati najmanje 3 stavke');

    for (const entry of API_CHANGELOG) {
      assertEqual(entry.version, APP_VERSION, 'entry.version');
      assert(typeof entry.datum === 'string' && entry.datum.length > 0, 'datum mora biti string');
      assert(['breaking', 'feature', 'fix', 'deprecation', 'security'].includes(entry.tip), 'tip mora biti validan');
      assert(typeof entry.opis === 'string' && entry.opis.length > 10, 'opis mora biti smislen');
      if (entry.affectedRoutes) {
        assert(Array.isArray(entry.affectedRoutes), 'affectedRoutes mora biti niz');
        assert(entry.affectedRoutes.length > 0, 'affectedRoutes ne sme biti prazan niz');
      }
    }
  });

  console.log(`\n🧪 OpenAPI Meta: ${passed} prošlo, ${failed} palo`);
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
