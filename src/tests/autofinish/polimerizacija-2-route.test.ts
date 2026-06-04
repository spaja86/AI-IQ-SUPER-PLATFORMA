import fs from 'node:fs';
import path from 'node:path';
import sitemap from '../../app/sitemap';
import { metadata } from '../../app/polimerizacija-2/page';
import { navigation } from '../../lib/navigation';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_PAGES, TOTAL_ROUTES } from '../../lib/constants';
import { GET as getReport } from '../../app/api/polimerizacija-2/route';
import { GET as getStatus } from '../../app/api/polimerizacija-2/status/route';
import { GET as getLanci } from '../../app/api/polimerizacija-2/lanci/route';
import { GET as getSken } from '../../app/api/polimerizacija-2/sken/route';
import { GET as getIstorija } from '../../app/api/polimerizacija-2/istorija/route';
import { GET as getTrendovi } from '../../app/api/polimerizacija-2/trendovi/route';

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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

async function runTests(): Promise<void> {
  console.log('\n🏁 polimerizacija-2 - Route Coverage Test Suite\n');

  const entries = sitemap();
  const routeUrl = 'https://ai-iq-super-platforma.vercel.app/polimerizacija-2';
  const requiredFiles = [
    'src/lib/polimerizacija-2.ts',
    'src/lib/sekvence/polimerizacija-2-page.ts',
    'src/app/polimerizacija-2/page.tsx',
    'src/app/polimerizacija-2/PolimerizacijaLanciTable.tsx',
    'src/app/api/polimerizacija-2/route.ts',
    'src/app/api/polimerizacija-2/status/route.ts',
    'src/app/api/polimerizacija-2/lanci/route.ts',
    'src/app/api/polimerizacija-2/sken/route.ts',
    'src/app/api/polimerizacija-2/istorija/route.ts',
    'src/app/api/polimerizacija-2/trendovi/route.ts',
  ];

  for (const rel of requiredFiles) {
    await test(`Fajl postoji: ${rel}`, () => {
      const full = path.resolve(process.cwd(), rel);
      assert(fs.existsSync(full), `${full} ne postoji`);
    });
  }

  await test('Sitemap sadrži /polimerizacija-2 i API rute', () => {
    const urls = entries.map((e) => e.url);
    assert(urls.includes(routeUrl), '/polimerizacija-2 nije u sitemap-u');
    assert(urls.some((u) => u.endsWith('/api/polimerizacija-2')), 'api ruta nije u sitemap-u');
    assert(urls.some((u) => u.endsWith('/api/polimerizacija-2/trendovi')), 'trendovi ruta nije u sitemap-u');
  });

  await test('metadata.title sadrži Polimerizacija 2', () => {
    assert(
      typeof metadata.title === 'string' && metadata.title.includes('Polimerizacija 2'),
      `metadata.title: ${String(metadata.title)}`,
    );
  });

  await test('Navigation sadrži /polimerizacija-2', () => {
    assert(
      navigation.some((item) => item.href === '/polimerizacija-2' && item.label === 'Polimerizacija 2'),
      'navigation nema Polimerizacija 2 link',
    );
  });

  await test('GET /api/polimerizacija-2 smoke', async () => {
    const request = new Request('http://localhost/api/polimerizacija-2', {
      headers: { 'x-forwarded-for': '127.0.2.71' },
    });
    const response = await getReport(request as never);
    assert(response.status >= 200 && response.status < 600, `status: ${response.status}`);
    const body = (await response.clone().json()) as unknown;
    assert(isObject(body), 'body objekat');
    assert(isObject(body['data']), 'body.data objekat');
    assertEqual(body['verzija'], APP_VERSION, 'verzija');
    if (isObject(body['data'])) {
      assertEqual((body['data']['sistem'] as string), 'Polimerizacija 2', 'sistem');
      assert(isObject(body['data']['rezultat']), 'rezultat objekat');
    }
  });

  await test('GET /api/polimerizacija-2/status smoke', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/status', {
      headers: { 'x-forwarded-for': '127.0.2.72' },
    });
    const res = await getStatus(req as never);
    assert(res.status >= 200 && res.status < 600, `status: ${res.status}`);
    const body = (await res.clone().json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assertEqual(data['status'], 'aktivan', 'status');
  });

  await test('GET /api/polimerizacija-2/lanci filter smoke', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/lanci?faza=propagacija&status=aktivan', {
      headers: { 'x-forwarded-for': '127.0.2.73' },
    });
    const res = await getLanci(req as never);
    assert(res.status >= 200 && res.status < 600, `status: ${res.status}`);
    const body = (await res.clone().json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assert(Array.isArray(data['lanci']), 'lanci je niz');
  });

  await test('GET /api/polimerizacija-2/lanci invalid faza vraća 400', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/lanci?faza=xyz', {
      headers: { 'x-forwarded-for': '127.0.2.74' },
    });
    const res = await getLanci(req as never);
    assertEqual(res.status, 400, 'status 400');
  });

  await test('GET /api/polimerizacija-2/sken vraća 202 ili 429', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/sken', {
      headers: { 'x-forwarded-for': '127.0.2.75' },
    });
    const res = await getSken(req as never);
    assert(res.status === 202 || res.status === 429, `status: ${res.status}`);
  });

  await test('GET /api/polimerizacija-2/istorija smoke', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/istorija', {
      headers: { 'x-forwarded-for': '127.0.2.76' },
    });
    const res = await getIstorija(req as never);
    assert(res.status >= 200 && res.status < 600, `status: ${res.status}`);
    const body = (await res.clone().json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assert(Array.isArray(data['istorija']), 'istorija niz');
  });

  await test('GET /api/polimerizacija-2/trendovi?n=3 smoke', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/trendovi?n=3', {
      headers: { 'x-forwarded-for': '127.0.2.77' },
    });
    const res = await getTrendovi(req as never);
    assert(res.status >= 200 && res.status < 600, `status: ${res.status}`);
    const body = (await res.clone().json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    assertEqual(data['n'], 3, 'n');
  });

  await test('GET /api/polimerizacija-2/trendovi?n=99 vraća 400', async () => {
    const req = new Request('http://localhost/api/polimerizacija-2/trendovi?n=99', {
      headers: { 'x-forwarded-for': '127.0.2.78' },
    });
    const res = await getTrendovi(req as never);
    assertEqual(res.status, 400, 'status 400');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.85.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1433, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1254, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1393, 'TOTAL_ROUTES');
    assertEqual(TOTAL_PAGES, 139, 'TOTAL_PAGES');
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
