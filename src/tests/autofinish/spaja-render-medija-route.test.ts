// Autofinish — spaja-render-medija Route Coverage Test
// Generisano: scripts/generate-route-tests.mjs

import fs from 'node:fs';
import path from 'node:path';
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_API_ROUTES, TOTAL_ROUTES } from '../../lib/constants';
import {
  evaluateNikolaSpajicFormule,
  evaluateNikolaSpajicFormuleFromChatGpt,
} from '../../lib/spaja-render-medija';

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
import { GET } from '../../app/api/spaja-render-medija/route';

async function runTests(): Promise<void> {
  console.log('\n🏁 spaja-render-medija — Route Coverage Test Suite\n');

  const routePath = path.resolve(process.cwd(), 'src/app/api/spaja-render-medija/route.ts');

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

  await test('GET smoke provera', async () => {
    const response = await GET();
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
      if (typeof body['status'] === 'string') {
        assert((body['status'] as string).length > 0, 'status string');
      }

      if (typeof body['verzija'] === 'string') {
        assertEqual(body['verzija'], APP_VERSION, 'verzija');
      } else if (isObject(body['data']) && typeof body['data']['verzija'] === 'string') {
        assertEqual(body['data']['verzija'], APP_VERSION, 'data.verzija');
      }

      assert(Array.isArray(body['engini']), 'engini ostaje niz');
      assert(Array.isArray(body['pipeline']), 'pipeline ostaje niz');
      assert(isObject(body['formulaStatusPoKategoriji']), 'formulaStatusPoKategoriji postoji');
      const formula = body['formulaStatusPoKategoriji'];
      if (isObject(formula)) {
        const slika = formula['slika'];
        const video = formula['video'];
        assert(isObject(slika), 'formula slika postoji');
        assert(isObject(video), 'formula video postoji');
        if (isObject(slika) && isObject(video)) {
          assert(typeof slika['score'] === 'number' && Number.isFinite(slika['score']), 'slika score');
          assert(typeof video['score'] === 'number' && Number.isFinite(video['score']), 'video score');
          assert(typeof slika['status'] === 'string' && (slika['status'] as string).length > 0, 'slika status');
          assert(typeof video['status'] === 'string' && (video['status'] as string).length > 0, 'video status');
        }
      }
    }
  });

  await test('Nikola Spajić formula daje validan score za sliku i video', () => {
    const slika = evaluateNikolaSpajicFormule('slika');
    const video = evaluateNikolaSpajicFormule('video');
    assert(Number.isFinite(slika.score), 'slika score je broj');
    assert(Number.isFinite(video.score), 'video score je broj');
    assert(slika.score >= 0 && slika.score <= 100, 'slika score 0-100');
    assert(video.score >= 0 && video.score <= 100, 'video score 0-100');
  });

  await test('Nikola Spajić formula fallback radi za NaN/Infinity/prazan payload', () => {
    const nevalidanInput = evaluateNikolaSpajicFormule('video', {
      kvalitetIzvora: Number.NaN,
      kompleksnostScene: Number.POSITIVE_INFINITY,
      dinamikaPokreta: Number.NEGATIVE_INFINITY,
      aiPouzdanost: Number.NaN,
      vremenskiBudzetMs: Number.NaN,
    });
    assert(nevalidanInput.fallbackUsed, 'fallback aktivan za nevalidan input');
    assert(nevalidanInput.warnings.length > 0, 'warnings za nevalidan input');

    const chatGptFallback = evaluateNikolaSpajicFormuleFromChatGpt('slika', {});
    assert(chatGptFallback.fallbackUsed, 'chatgpt fallback aktivan za prazan payload');
    assert(chatGptFallback.warnings.length > 0, 'warnings za chatgpt fallback');
    assert(Number.isFinite(chatGptFallback.score), 'chatgpt fallback score je broj');
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
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
