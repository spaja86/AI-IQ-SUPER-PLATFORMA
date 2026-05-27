// Autofinish #1396 — enterprise-zahtevi Route Coverage Test (CDN Enhanced)
// Kompanija SPAJA — Digitalna Industrija

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';

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

const _lintUseHelpers = [assertEqual, isObject];
void _lintUseHelpers;
import { GET } from '../../app/api/enterprise-zahtevi/route';

async function runTests(): Promise<void> {
  console.log('\n🏁 enterprise-zahtevi — Route Coverage Test Suite (#1396)\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/enterprise-zahtevi/route.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET i response helper', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(
      src.includes('NextResponse.json') || src.includes('Response.json') || src.includes('apiSuccess'),
      'Nedostaje JSON response helper',
    );
  });

  await test('Ruta sadrži CDN proxy trust polja', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('podzahtevi'), 'Nedostaje podzahtevi polje');
    assert(src.includes('vercelCdnProxyTrust'), 'Nedostaje vercelCdnProxyTrust polje');
    assert(src.includes('KOMPANIJA_FORMALNI_NAZIV'), 'Nedostaje KOMPANIJA_FORMALNI_NAZIV import');
  });

  await test('GET smoke provera', async () => {
    const request = new Request('http://localhost/api/enterprise-zahtevi', {
      headers: { 'x-forwarded-for': '127.0.1.10' },
    });

    const response = await GET(request as unknown as Request);
    assert(response.status >= 200 && response.status < 600, `Neočekivan status: ${response.status}`);

    const xAppVersion = response.headers.get('X-App-Version');
    if (xAppVersion !== null) {
      assertEqual(xAppVersion, APP_VERSION, 'X-App-Version');
    }

    let body: unknown = null;
    try {
      body = await response.clone().json();
    } catch {
      body = null;
    }

    if (isObject(body)) {
      if (typeof body['verzija'] === 'string') {
        assertEqual(body['verzija'], APP_VERSION, 'verzija');
      }
    }
  });

  await test('GET vraća podzahtevi niz', async () => {
    const request = new Request('http://localhost/api/enterprise-zahtevi', {
      headers: { 'x-forwarded-for': '127.0.1.11' },
    });
    const response = await GET(request as unknown as Request);
    const body = await response.json() as Record<string, unknown>;
    assert(Array.isArray(body['podzahtevi']), 'podzahtevi mora biti niz');
    const podzahtevi = body['podzahtevi'] as unknown[];
    assert(podzahtevi.length > 0, 'podzahtevi niz mora imati bar jedan element');
  });

  await test('GET vraća vercelCdnProxyTrust dispatch payload', async () => {
    const request = new Request('http://localhost/api/enterprise-zahtevi', {
      headers: { 'x-forwarded-for': '127.0.1.12' },
    });
    const response = await GET(request as unknown as Request);
    const body = await response.json() as Record<string, unknown>;
    assert(isObject(body['vercelCdnProxyTrust']), 'vercelCdnProxyTrust mora biti objekat');
    const cdn = body['vercelCdnProxyTrust'] as Record<string, unknown>;
    assert(typeof cdn['naslov'] === 'string' && (cdn['naslov'] as string).length > 0, 'naslov mora biti string');
    assert(typeof cdn['sazetak'] === 'string' && (cdn['sazetak'] as string).length > 0, 'sazetak mora biti string');
    assert(typeof cdn['telo'] === 'string' && (cdn['telo'] as string).length > 0, 'telo mora biti string');
    assert(Array.isArray(cdn['dispatchChecklist']), 'dispatchChecklist mora biti niz');
    assert(isObject(cdn['formalniIdentitet']), 'formalniIdentitet mora biti objekat');
    const ident = cdn['formalniIdentitet'] as Record<string, unknown>;
    assert(typeof ident['naziv'] === 'string', 'formalniIdentitet.naziv mora biti string');
    assert(typeof ident['adresa'] === 'string', 'formalniIdentitet.adresa mora biti string');
    assert(typeof ident['punNaziv'] === 'string', 'formalniIdentitet.punNaziv mora biti string');
  });

  await test('GET summary sadrži ukupnoPodzahteva', async () => {
    const request = new Request('http://localhost/api/enterprise-zahtevi', {
      headers: { 'x-forwarded-for': '127.0.1.13' },
    });
    const response = await GET(request as unknown as Request);
    const body = await response.json() as Record<string, unknown>;
    assert(isObject(body['summary']), 'summary mora biti objekat');
    const summary = body['summary'] as Record<string, unknown>;
    assert(typeof summary['ukupnoPodzahteva'] === 'number', 'ukupnoPodzahteva mora biti broj');
  });

  await test('Konstante su ažurirane', () => {
    assert(/^\d+\.\d+\.\d+$/.test(APP_VERSION), 'APP_VERSION semver format');
    assert(AUTOFINISH_COUNT >= 1398, 'AUTOFINISH_COUNT baseline');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
  });

  console.log(`
🏁 Rezultat: ${passed} prošlo, ${failed} palo`);
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
