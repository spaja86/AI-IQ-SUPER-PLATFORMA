// Autofinish #1361 — AI IQ World Bank Procesiranje Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/ai-iq-world-bank-procesiranje-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/ai-iq-world-bank-procesiranje/route';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
  TOTAL_PAGES,
} from '../../lib/constants';

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
  console.log('\n⚙️ AI IQ World Bank Procesiranje — Route Coverage Test Suite (#1361)\n');

  const apiRoutePath = path.resolve(process.cwd(), 'src/app/api/ai-iq-world-bank-procesiranje/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/ai-iq-world-bank-procesiranje.ts');

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(apiRoutePath), `${apiRoutePath} ne postoji`);
  });

  await test('Lib modul fajl postoji', () => {
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
  });

  await test('API ruta koristi očekivane gradivne blokove', () => {
    const src = fs.readFileSync(apiRoutePath, 'utf8');
    assert(src.includes('buildAiIqWorldBankProcesiranje'), 'Nedostaje buildAiIqWorldBankProcesiranje');
    assert(src.includes('checkRateLimitGlobal'), 'Nedostaje checkRateLimitGlobal');
    assert(src.includes('apiError'), 'Nedostaje apiError');
    assert(src.includes('apiSuccess'), 'Nedostaje apiSuccess');
    assert(src.includes('apiInternalError'), 'Nedostaje apiInternalError');
    assert(src.includes('force-dynamic'), 'Nedostaje force-dynamic');
  });

  await test('GET vraća 200 i ispravnu strukturu', async () => {
    const request = new Request('http://localhost/api/ai-iq-world-bank-procesiranje', {
      headers: { 'x-forwarded-for': '127.0.0.50' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'HTTP status');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['timestamp'] === 'string', 'timestamp string');
    assert(!Number.isNaN(Date.parse(body['timestamp'] as string)), 'timestamp ISO');
  });

  await test('Rezultat ima sva obavezna polja', async () => {
    const request = new Request('http://localhost/api/ai-iq-world-bank-procesiranje', {
      headers: { 'x-forwarded-for': '127.0.0.51' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;

    assertEqual(data['status'] as string, 'aktivan', 'status');
    assert(typeof data['sistem'] === 'string', 'sistem string');
    assert(typeof data['kompanija'] === 'string', 'kompanija string');
    assertEqual(data['verzija'] as string, APP_VERSION, 'data.verzija');
    assert(Array.isArray(data['transakcijeUObradi']), 'transakcijeUObradi niz');
    assert(Array.isArray(data['kamatnaObrada']), 'kamatnaObrada niz');
    assert(Array.isArray(data['racuniUObradi']), 'racuniUObradi niz');
    assert(Array.isArray(data['fraudChecks']), 'fraudChecks niz');
    assert(Array.isArray(data['rutingOdluke']), 'rutingOdluke niz');
    assert(typeof data['kpi'] === 'object' && data['kpi'] !== null, 'kpi objekat');
    assert(!Number.isNaN(Date.parse(data['timestamp'] as string)), 'data.timestamp ISO');
  });

  await test('KPI polja su validna', async () => {
    const request = new Request('http://localhost/api/ai-iq-world-bank-procesiranje', {
      headers: { 'x-forwarded-for': '127.0.0.52' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const kpi = (body['data'] as Record<string, unknown>)['kpi'] as Record<string, unknown>;

    assert(typeof kpi['transakcijaUDanu'] === 'number', 'kpi.transakcijaUDanu number');
    assert(typeof kpi['uspesnostProcenata'] === 'number', 'kpi.uspesnostProcenata number');
    assert(kpi['uspesnostProcenata'] as number >= 0 && kpi['uspesnostProcenata'] as number <= 100, 'kpi.uspesnostProcenata 0-100');
    assert(typeof kpi['prosecnoVremeMs'] === 'number', 'kpi.prosecnoVremeMs number');
    assert(typeof kpi['fraudBlokirano'] === 'number', 'kpi.fraudBlokirano number');
    assert(typeof kpi['aktivnihRacuna'] === 'number', 'kpi.aktivnihRacuna number');
  });

  await test('transakcijeUObradi stavke imaju ispravna polja', async () => {
    const request = new Request('http://localhost/api/ai-iq-world-bank-procesiranje', {
      headers: { 'x-forwarded-for': '127.0.0.53' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const transakcije = data['transakcijeUObradi'] as Array<Record<string, unknown>>;

    assert(transakcije.length > 0, 'transakcijeUObradi nije prazno');
    const prvaT = transakcije[0] as Record<string, unknown>;
    assert(typeof prvaT['id'] === 'string', 'transakcija.id string');
    assert(typeof prvaT['iznos'] === 'number', 'transakcija.iznos number');
    assert(typeof prvaT['valuta'] === 'string', 'transakcija.valuta string');
    assert(typeof prvaT['status'] === 'string', 'transakcija.status string');
    assert(typeof prvaT['fraudCheck'] === 'string', 'transakcija.fraudCheck string');
  });

  await test('Stranica ai-iq-world-bank-procesiranje postoji', () => {
    const pagePath = path.resolve(process.cwd(), 'src/app/ai-iq-world-bank-procesiranje/page.tsx');
    assert(fs.existsSync(pagePath), `${pagePath} ne postoji`);
    const src = fs.readFileSync(pagePath, 'utf8');
    assert(src.includes('aiIqWorldBankProcesiranjeSekvence'), 'Nedostaje aiIqWorldBankProcesiranjeSekvence');
    assert(src.includes('StranicaRenderer'), 'Nedostaje StranicaRenderer');
  });

  await test('Sekvence fajl postoji', () => {
    const sekvencePath = path.resolve(process.cwd(), 'src/lib/sekvence/ai-iq-world-bank-procesiranje-page.ts');
    assert(fs.existsSync(sekvencePath), `${sekvencePath} ne postoji`);
    const src = fs.readFileSync(sekvencePath, 'utf8');
    assert(src.includes('aiIqWorldBankProcesiranjeSekvence'), 'Nedostaje aiIqWorldBankProcesiranjeSekvence export');
  });

  await test('Navigacija sadrži ai-iq-world-bank-procesiranje link', () => {
    const navPath = path.resolve(process.cwd(), 'src/lib/navigation.ts');
    const navSrc = fs.readFileSync(navPath, 'utf8');
    assert(navSrc.includes('/ai-iq-world-bank-procesiranje'), 'Navigacija ne sadrži /ai-iq-world-bank-procesiranje');
  });

  await test('Sitemap sadrži ai-iq-world-bank-procesiranje i api/ai-iq-world-bank-procesiranje', () => {
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemapSrc.includes('/ai-iq-world-bank-procesiranje'), 'Sitemap ne sadrži /ai-iq-world-bank-procesiranje');
    assert(sitemapSrc.includes('/api/ai-iq-world-bank-procesiranje'), 'Sitemap ne sadrži /api/ai-iq-world-bank-procesiranje');
  });

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.37.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1367, 'AUTOFINISH_COUNT');
    assertEqual(TOTAL_API_ROUTES, 1166, 'TOTAL_API_ROUTES');
    assertEqual(TOTAL_ROUTES, 1270, 'TOTAL_ROUTES');
    assertEqual(TOTAL_PAGES, 62, 'TOTAL_PAGES');
  });

  console.log(`\n⚙️ Rezultat: ${passed} prošlo, ${failed} palo`);
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
