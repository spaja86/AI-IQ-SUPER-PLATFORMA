// Autofinish — openai-partnership-lifecycle route coverage test
// Kompanija SPAJA — Digitalna Industrija

import fs from 'node:fs';
import path from 'node:path';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_API_ROUTES,
  TOTAL_ROUTES,
} from '../../lib/constants';
import {
  getCurrentOpenAIState,
  getFallbackPlan,
  getLifecycleStanje,
  getOpenAIEvidencePack,
  getOpenAILifecycleStatus,
  getPostAcceptancePlan,
  LIFECYCLE_STANJA,
  type OpenAIPartnershipState,
} from '../../lib/openai-partnership-lifecycle';
import { GET, POST } from '../../app/api/openai-partnership-lifecycle/route';

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

const _lint = [assertEqual, isObject];
void _lint;

async function runTests(): Promise<void> {
  console.log('\n🏁 openai-partnership-lifecycle — Route Coverage Test Suite\n');

  const routePath = path.resolve(
    process.cwd(),
    'src/app/api/openai-partnership-lifecycle/route.ts',
  );

  await test('API route fajl postoji', () => {
    assert(fs.existsSync(routePath), `${routePath} ne postoji`);
  });

  await test('Ruta eksportuje GET i POST', () => {
    const src = fs.readFileSync(routePath, 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
  });

  // ─── Lib testovi ─────────────────────────────────────────

  await test('LIFECYCLE_STANJA sadrži 8 stanja', () => {
    assertEqual(LIFECYCLE_STANJA.length, 8, 'LIFECYCLE_STANJA.length');
  });

  await test('Sva lifecycle stanja imaju obavezna polja', () => {
    for (const s of LIFECYCLE_STANJA) {
      assert(typeof s.id === 'string' && s.id.length > 0, `id prazan: ${JSON.stringify(s)}`);
      assert(typeof s.naziv === 'string' && s.naziv.length > 0, `naziv prazan: ${s.id}`);
      assert(typeof s.opis === 'string' && s.opis.length > 0, `opis prazan: ${s.id}`);
      assert(Array.isArray(s.sledecaStanja), `sledecaStanja nije niz: ${s.id}`);
      assert(typeof s.zahtevaRucnoOdobrenje === 'boolean', `zahtevaRucnoOdobrenje: ${s.id}`);
    }
  });

  await test('getCurrentOpenAIState vraća validan state bez env varijabli', () => {
    const state = getCurrentOpenAIState();
    const validStanja: OpenAIPartnershipState[] = [
      'u_pripremi', 'spreman_za_slanje', 'poslato', 'kontaktiran',
      'u_pregovorima', 'prihvaceno', 'odbijeno', 'fallback_aktiviran',
    ];
    assert(validStanja.includes(state), `Nevalidan state: ${state}`);
  });

  await test('getLifecycleStanje vraća stanje za svaki id', () => {
    for (const s of LIFECYCLE_STANJA) {
      const result = getLifecycleStanje(s.id);
      assertEqual(result.id, s.id, `getLifecycleStanje(${s.id}).id`);
    }
  });

  await test('getOpenAIEvidencePack vraća validnu strukturu', () => {
    const pack = getOpenAIEvidencePack();
    assert(typeof pack.naziv === 'string', 'naziv');
    assert(typeof pack.verzija === 'string', 'verzija');
    assert(typeof pack.generisanoAt === 'string', 'generisanoAt');
    assert(Array.isArray(pack.sekcije) && pack.sekcije.length > 0, 'sekcije');
    for (const s of pack.sekcije) {
      assert(typeof s.id === 'string', `sekcija.id: ${s.naziv}`);
      assert(typeof s.naziv === 'string', `sekcija.naziv`);
      assert(s.sadrzaj !== undefined, `sekcija.sadrzaj: ${s.naziv}`);
    }
  });

  await test('getPostAcceptancePlan vraća 3 faze', () => {
    const plan = getPostAcceptancePlan();
    assertEqual(plan.length, 3, 'getPostAcceptancePlan.length');
    const faze = plan.map((p) => p.faza);
    assert(faze.includes('pilot'), 'pilot faza');
    assert(faze.includes('ogranicena_produkcija'), 'ogranicena_produkcija faza');
    assert(faze.includes('puna_integracija'), 'puna_integracija faza');
  });

  await test('Svaka faza post-acceptance plana ima aktivnosti', () => {
    const plan = getPostAcceptancePlan();
    for (const faza of plan) {
      assert(Array.isArray(faza.aktivnosti) && faza.aktivnosti.length > 0, `Faza ${faza.faza} nema aktivnosti`);
      for (const a of faza.aktivnosti) {
        assert(typeof a.id === 'string', `aktivnost.id: ${faza.faza}`);
        assert(typeof a.naziv === 'string', `aktivnost.naziv: ${faza.faza}`);
        assert(a.tip === 'auto' || a.tip === 'rucno', `aktivnost.tip: ${a.id}`);
      }
    }
  });

  await test('getFallbackPlan vraća validnu strukturu', () => {
    const fallback = getFallbackPlan();
    assert(typeof fallback.naziv === 'string' && fallback.naziv.length > 0, 'naziv');
    assert(typeof fallback.uslov === 'string' && fallback.uslov.length > 0, 'uslov');
    assert(Array.isArray(fallback.alternativeAIProvider) && fallback.alternativeAIProvider.length > 0, 'alternativeAIProvider');
    assert(Array.isArray(fallback.omegaRoadmapNastavak) && fallback.omegaRoadmapNastavak.length > 0, 'omegaRoadmapNastavak');
    assert(typeof fallback.timeout === 'string', 'timeout');
  });

  await test('getOpenAILifecycleStatus vraća kompletnu strukturu', () => {
    const status = getOpenAILifecycleStatus();
    assert(typeof status.trenutnoStanje === 'string', 'trenutnoStanje');
    assert(isObject(status.stanjeDetalji), 'stanjeDetalji');
    assert(Array.isArray(status.svaStanja), 'svaStanja');
    assert(isObject(status.evidencePack), 'evidencePack');
    assert(Array.isArray(status.postAcceptancePlan), 'postAcceptancePlan');
    assert(Array.isArray(status.acceptanceGates), 'acceptanceGates');
    assert(isObject(status.fallbackPlan), 'fallbackPlan');
    assert(isObject(status.summary), 'summary');
    assert(typeof status.summary.accepted === 'boolean', 'summary.accepted');
    assert(typeof status.summary.fallbackActive === 'boolean', 'summary.fallbackActive');
  });

  // ─── Route testovi ────────────────────────────────────────

  await test('GET smoke provera', async () => {
    const response = await GET();
    assert(response.status >= 200 && response.status < 600, `Neočekivan status: ${response.status}`);

    const body = await response.clone().json() as Record<string, unknown>;
    assert(isObject(body), 'body nije objekat');
    assert(typeof body['status'] === 'string', 'body.status');
    assert(typeof body['naziv'] === 'string', 'body.naziv');
    assert(typeof body['verzija'] === 'string', 'body.verzija');
    assertEqual(body['verzija'] as string, APP_VERSION, 'verzija');
    assert(typeof body['trenutnoStanje'] === 'string', 'body.trenutnoStanje');
    assert(isObject(body['summary']), 'body.summary');
  });

  await test('POST odbija nevalidan JSON', async () => {
    const request = new Request('http://localhost/api/openai-partnership-lifecycle', {
      method: 'POST',
      body: 'nije-json',
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await POST(request as unknown as import('next/server').NextRequest);
    assert(response.status >= 400, `Očekivan 4xx, dobijen: ${response.status}`);
  });

  await test('POST odbija nevalidan state', async () => {
    const request = new Request('http://localhost/api/openai-partnership-lifecycle', {
      method: 'POST',
      body: JSON.stringify({ state: 'nepostoji_stanje' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await POST(request as unknown as import('next/server').NextRequest);
    assert(response.status >= 400, `Očekivan 4xx, dobijen: ${response.status}`);
    const body = await response.clone().json() as Record<string, unknown>;
    assert(typeof body['error'] === 'string', 'error poruka');
    assert(Array.isArray(body['validnaStanja']), 'validnaStanja lista');
  });

  await test('POST odbija nevalidan kanal', async () => {
    const request = new Request('http://localhost/api/openai-partnership-lifecycle', {
      method: 'POST',
      body: JSON.stringify({ state: 'poslato', kanal: 'whatsapp' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await POST(request as unknown as import('next/server').NextRequest);
    assert(response.status >= 400, `Očekivan 4xx, dobijen: ${response.status}`);
  });

  await test('Konstante su dostupne', () => {
    assert(typeof APP_VERSION === 'string' && APP_VERSION.length > 0, 'APP_VERSION');
    assert(typeof AUTOFINISH_COUNT === 'number' && AUTOFINISH_COUNT > 0, 'AUTOFINISH_COUNT');
    assert(typeof TOTAL_API_ROUTES === 'number' && TOTAL_API_ROUTES > 0, 'TOTAL_API_ROUTES');
    assert(typeof TOTAL_ROUTES === 'number' && TOTAL_ROUTES > 0, 'TOTAL_ROUTES');
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
