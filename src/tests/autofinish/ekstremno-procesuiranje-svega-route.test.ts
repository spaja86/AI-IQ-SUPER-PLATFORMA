// Autofinish — Ekstremno Procesuiranje Svega Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/ekstremno-procesuiranje-svega-route.test.ts

import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import {
  EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_LIMIT,
  GET,
} from '../../app/api/ekstremno-procesuiranje-svega/route';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

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
  console.log('\n⚡ Ekstremno Procesuiranje Svega — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/ekstremno-procesuiranje-svega/route.ts');
  const libPath = path.resolve(process.cwd(), 'src/lib/procesuiranje-svega.ts');
  const cronPath = path.resolve(process.cwd(), 'src/app/api/cron/ekstremno-procesuiranje-svega/route.ts');
  const predeployPath = path.resolve(process.cwd(), 'scripts/predeploy-check.mjs');

  await test('Route/lib/cron fajlovi postoje', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
    assert(fs.existsSync(libPath), `${libPath} ne postoji`);
    assert(fs.existsSync(cronPath), `${cronPath} ne postoji`);
  });

  await test('GET vraća 200 i sadrži ekstremna polja', async () => {
    const request = new Request('http://localhost/api/ekstremno-procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.200' },
    });
    const response = await GET(request as NextRequest);
    assertEqual(response.status, 200, 'status');
    assert(response.headers.get('X-Procesuiranje-Mode') === 'extreme', 'X-Procesuiranje-Mode extreme');
    assert(typeof response.headers.get('X-Procesuiranje-Contract-Version') === 'string', 'contract header');
    assert(typeof response.headers.get('X-Procesuiranje-Model-Version') === 'string', 'model header');

    const body = (await response.json()) as Record<string, unknown>;
    assert(typeof body['data'] === 'object' && body['data'] !== null, 'data objekat');
    assertEqual(body['verzija'] as string, APP_VERSION, 'wrapper verzija');

    const data = body['data'] as Record<string, unknown>;
    assertEqual(data['verzija'] as string, APP_VERSION, 'data.verzija');
    assertEqual(data['autofinishBroj'] as number, AUTOFINISH_COUNT, 'autofinishBroj');
    assert(typeof data['ukupanProcenat'] === 'number', 'ukupanProcenat');
    assert(typeof data['domeni'] === 'object' && data['domeni'] !== null, 'domeni objekat');
    assert(Array.isArray(data['aktivneStavke']), 'aktivneStavke niz');
    assert(typeof data['scheduler'] === 'object' && data['scheduler'] !== null, 'scheduler');
    assert(typeof data['meta'] === 'object' && data['meta'] !== null, 'meta');
    assert(Array.isArray(data['uskaGrla']), 'uskaGrla niz');
    assert(Array.isArray(data['preporuke']), 'preporuke niz');
    assert(Array.isArray(data['kriticniProcesi']), 'kriticniProcesi niz');

    const scheduler = data['scheduler'] as Record<string, unknown>;
    assert(typeof scheduler['queueDepth'] === 'number', 'queueDepth broj');
    assert(typeof scheduler['fairnessIndex'] === 'number', 'fairnessIndex broj');
    assert(typeof scheduler['starvationRizik'] === 'number', 'starvationRizik broj');
    assert(Array.isArray(scheduler['redovi']), 'redovi niz');
  });

  await test('Prioritetni red je sortiran po prioritetu', async () => {
    const request = new Request('http://localhost/api/ekstremno-procesuiranje-svega', {
      headers: { 'x-forwarded-for': '127.0.0.201' },
    });
    const response = await GET(request as NextRequest);
    const body = (await response.json()) as Record<string, unknown>;
    const data = body['data'] as Record<string, unknown>;
    const scheduler = data['scheduler'] as Record<string, unknown>;
    const redovi = scheduler['redovi'] as Array<Record<string, unknown>>;

    const rank: Record<string, number> = { kriticno: 0, visoko: 1, srednje: 2, nisko: 3 };
    for (let i = 1; i < redovi.length; i++) {
      const prev = rank[String(redovi[i - 1]['prioritet'])];
      const curr = rank[String(redovi[i]['prioritet'])];
      assert(prev <= curr, `redovi nisu sortirani po prioritetu na indeksu ${i}`);
    }
  });

  await test('Rate limit vraća 429 nakon prekoračenja limita', async () => {
    const ip = `ekstremno-rate-test-${process.pid}-${Date.now()}`;
    const statusi: number[] = [];
    for (let i = 0; i < EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_LIMIT + 1; i++) {
      const req = new Request('http://localhost/api/ekstremno-procesuiranje-svega', {
        headers: { 'x-forwarded-for': ip },
      });
      const res = await GET(req as NextRequest);
      statusi.push(res.status);
    }
    assertEqual(statusi[EKSTREMNO_PROCESUIRANJE_SVEGA_RATE_LIMIT], 429, 'limit+1 status');
  });

  await test('Sitemap/Vercel/predeploy uključuju ekstremni režim', () => {
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    const sitemapSrc = fs.readFileSync(sitemapPath, 'utf8');
    assert(sitemapSrc.includes('/api/ekstremno-procesuiranje-svega'), 'Sitemap nema ekstremni API');

    const vercelPath = path.resolve(process.cwd(), 'vercel.json');
    const vercelSrc = fs.readFileSync(vercelPath, 'utf8');
    assert(vercelSrc.includes('/api/cron/ekstremno-procesuiranje-svega'), 'Vercel cron nije dodat');

    const predeploySrc = fs.readFileSync(predeployPath, 'utf8');
    assert(predeploySrc.includes('ekstremnoProcesuiranjeSvega'), 'Predeploy check nema ekstremni contract blok');
  });

  console.log(`\n⚡ Rezultat: ${passed} prošlo, ${failed} palo`);
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
