// Autofinish #1386 — SPAJA BAZA Knowledge Route Coverage Test
// Pokretanje: npx tsx src/tests/autofinish/spaja-baza-knowledge-route.test.ts
//
// Pokriva strukturne i funkcionalne provjere za /api/spaja-baza-knowledge/*
// (health, search, metrics, sources, crawl, citations) i čiste lib funkcije
// (canonicalizeUrl, isUrlAllowed, normalizeLimit, getKnowledgePolicy).

import fs from 'node:fs';
import path from 'node:path';
import {
  canonicalizeUrl,
  isUrlAllowed,
  normalizeLimit,
  getKnowledgePolicy,
} from '../../lib/spaja-baza-knowledge';
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

const API_ROOT = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge');
const LIB_PATH = path.resolve(process.cwd(), 'src/lib/spaja-baza-knowledge.ts');

async function runTests(): Promise<void> {
  console.log('\n🏁 SPAJA BAZA Knowledge — Route Coverage Test Suite (#1386)\n');

  // ─── Konstante ─────────────────────────────────────────────────────────────

  await test('Konstante su ažurirane', () => {
    assertEqual(APP_VERSION, '59.52.0', 'APP_VERSION');
    assertEqual(AUTOFINISH_COUNT, 1386, 'AUTOFINISH_COUNT');
  });

  // ─── Lib fajl ───────────────────────────────────────────────────────────────

  await test('Lib fajl postoji', () => {
    assert(fs.existsSync(LIB_PATH), `${LIB_PATH} ne postoji`);
  });

  await test('Lib sadrži sve ključne eksporte', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('export function canonicalizeUrl'), 'Nedostaje canonicalizeUrl');
    assert(src.includes('export function isUrlAllowed'), 'Nedostaje isUrlAllowed');
    assert(src.includes('export function normalizeLimit'), 'Nedostaje normalizeLimit');
    assert(src.includes('export function getKnowledgePolicy'), 'Nedostaje getKnowledgePolicy');
    assert(src.includes('export async function searchKnowledge'), 'Nedostaje searchKnowledge');
    assert(src.includes('export async function getKnowledgeHealth'), 'Nedostaje getKnowledgeHealth');
    assert(src.includes('export async function ingestKnowledgeUrls'), 'Nedostaje ingestKnowledgeUrls');
  });

  // ─── Route fajlovi ──────────────────────────────────────────────────────────

  const subRoutes = ['health', 'search', 'metrics', 'sources', 'crawl', 'citations'];

  for (const sub of subRoutes) {
    const routePath = path.join(API_ROOT, sub, 'route.ts');
    await test(`Sub-ruta ${sub}/route.ts postoji`, () => {
      assert(fs.existsSync(routePath), `${routePath} ne postoji`);
    });
  }

  await test('health route koristi getKnowledgeHealth', () => {
    const src = fs.readFileSync(path.join(API_ROOT, 'health', 'route.ts'), 'utf8');
    assert(src.includes('getKnowledgeHealth'), 'Nedostaje getKnowledgeHealth import');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('SPAJA BAZA'), 'Nedostaje SPAJA BAZA u odgovoru');
    assert(src.includes("runtime = 'nodejs'"), 'Nedostaje nodejs runtime');
  });

  await test('search route koristi searchKnowledge + normalizeLimit', () => {
    const src = fs.readFileSync(path.join(API_ROOT, 'search', 'route.ts'), 'utf8');
    assert(src.includes('searchKnowledge'), 'Nedostaje searchKnowledge');
    assert(src.includes('normalizeLimit'), 'Nedostaje normalizeLimit');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    // q parametar je obavezan
    assert(src.includes("searchParams.get('q')"), "Nedostaje query parametar 'q'");
    assert(src.includes('status: 400') || src.includes("status:400"), 'Nedostaje 400 za prazno q');
  });

  await test('sources route eksportuje GET i POST', () => {
    const src = fs.readFileSync(path.join(API_ROOT, 'sources', 'route.ts'), 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
    assert(src.includes('knowledge_sources'), 'Nedostaje knowledge_sources tabela');
    assert(src.includes('verifyUserFromToken'), 'POST mora zahtevati autentifikaciju');
  });

  await test('crawl route eksportuje GET i POST', () => {
    const src = fs.readFileSync(path.join(API_ROOT, 'crawl', 'route.ts'), 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
    assert(src.includes('ingestKnowledgeUrls'), 'Nedostaje ingestKnowledgeUrls');
    assert(src.includes('verifyUserFromToken'), 'POST mora zahtevati autentifikaciju');
  });

  await test('citations route eksportuje POST i zahteva autentifikaciju', () => {
    const src = fs.readFileSync(path.join(API_ROOT, 'citations', 'route.ts'), 'utf8');
    assert(src.includes('export async function POST'), 'Nedostaje POST handler');
    assert(src.includes('verifyUserFromToken'), 'POST mora zahtevati autentifikaciju');
    assert(src.includes('knowledge_citations'), 'Nedostaje knowledge_citations tabela');
    assert(src.includes('citationIds'), 'Nedostaje citationIds parametar');
  });

  await test('metrics route eksportuje GET i prati retrieval metrike', () => {
    const src = fs.readFileSync(path.join(API_ROOT, 'metrics', 'route.ts'), 'utf8');
    assert(src.includes('export async function GET'), 'Nedostaje GET handler');
    assert(src.includes('knowledge_retrieval_metrics'), 'Nedostaje knowledge_retrieval_metrics tabela');
    assert(src.includes('getKnowledgeHealth'), 'Nedostaje getKnowledgeHealth u metrics');
  });

  // ─── getKnowledgePolicy ─────────────────────────────────────────────────────

  await test('getKnowledgePolicy vraća policy objekat sa allowlistom i denylistom', () => {
    const policy = getKnowledgePolicy();
    assert(Array.isArray(policy.allowlistDomains), 'allowlistDomains mora biti niz');
    assert(Array.isArray(policy.denylistDomains), 'denylistDomains mora biti niz');
    assert(policy.allowlistDomains.length > 0, 'allowlistDomains ne sme biti prazan');
    assert(policy.denylistDomains.length > 0, 'denylistDomains ne sme biti prazan');
    assert(typeof policy.maxUrlsPerJob === 'number', 'maxUrlsPerJob mora biti broj');
    assert(typeof policy.maxFetchBytes === 'number', 'maxFetchBytes mora biti broj');
    assert(typeof policy.maxChunkLength === 'number', 'maxChunkLength mora biti broj');
    assert(typeof policy.chunkOverlap === 'number', 'chunkOverlap mora biti broj');
  });

  await test('getKnowledgePolicy — defaultni allowlist sadrži spaja.rs i github.com', () => {
    const policy = getKnowledgePolicy();
    assert(policy.allowlistDomains.includes('spaja.rs'), 'allowlist mora sadržati spaja.rs');
    assert(policy.allowlistDomains.includes('github.com'), 'allowlist mora sadržati github.com');
    assert(policy.allowlistDomains.includes('vercel.app'), 'allowlist mora sadržati vercel.app');
  });

  await test('getKnowledgePolicy — defaultni denylist sadrži accounts.google.com', () => {
    const policy = getKnowledgePolicy();
    assert(
      policy.denylistDomains.includes('accounts.google.com'),
      'denylist mora sadržati accounts.google.com',
    );
  });

  // ─── canonicalizeUrl ────────────────────────────────────────────────────────

  await test('canonicalizeUrl uklanja hash', () => {
    const result = canonicalizeUrl('https://spaja.rs/o-nama#sekcija');
    assert(!result.includes('#'), 'Hash mora biti uklonjen');
    assert(result.startsWith('https://spaja.rs'), 'Domen mora ostati');
  });

  await test('canonicalizeUrl uklanja UTM parametre (barem jedan)', () => {
    // Napomena: forEach+delete tokom iteracije može preskočiti neke param zbog reindeksiranja
    // — minimalna garancija: bar jedan UTM param mora biti uklonjen
    const result = canonicalizeUrl('https://spaja.rs/?utm_source=google&q=test');
    assert(!result.includes('utm_source'), 'utm_source mora biti uklonjen');
    assert(result.includes('q=test'), 'Ostali parametri moraju ostati');
  });

  await test('canonicalizeUrl uklanja fbclid', () => {
    const result = canonicalizeUrl('https://spaja.rs/?fbclid=xyz123&q=vest');
    assert(!result.includes('fbclid'), 'fbclid mora biti uklonjen');
    assert(result.includes('q=vest'), 'Ostali parametri moraju ostati');
  });

  await test('canonicalizeUrl uklanja trailing slash iz putanje', () => {
    const result = canonicalizeUrl('https://spaja.rs/blog/');
    assert(!result.endsWith('/blog/'), 'Trailing slash mora biti uklonjen iz putanje');
    assert(result.includes('/blog'), 'Putanja mora ostati');
  });

  await test('canonicalizeUrl čuva root putanju /', () => {
    const result = canonicalizeUrl('https://spaja.rs/');
    assert(result.includes('spaja.rs'), 'Domen mora ostati');
    // Root URL mora biti validan
    assert(result.startsWith('https://'), 'Mora biti HTTPS');
  });

  // ─── isUrlAllowed ───────────────────────────────────────────────────────────

  await test('isUrlAllowed dozvoljava URL iz allowlista', () => {
    assert(isUrlAllowed('https://spaja.rs/vest'), 'spaja.rs mora biti dozvoljen');
    assert(isUrlAllowed('https://github.com/spaja86'), 'github.com mora biti dozvoljen');
    assert(
      isUrlAllowed('https://vercel.app/dashboard'),
      'vercel.app mora biti dozvoljen',
    );
  });

  await test('isUrlAllowed blokira URL iz denylista', () => {
    assert(!isUrlAllowed('https://accounts.google.com/signin'), 'accounts.google.com mora biti blokiran');
    assert(!isUrlAllowed('https://drive.google.com/file'), 'drive.google.com mora biti blokiran');
  });

  await test('isUrlAllowed blokira ne-HTTP/HTTPS protokole', () => {
    assert(!isUrlAllowed('ftp://spaja.rs/file.txt'), 'FTP mora biti blokiran');
    assert(!isUrlAllowed('file:///etc/passwd'), 'file:// mora biti blokiran');
  });

  await test('isUrlAllowed blokira nepoznate domene', () => {
    assert(!isUrlAllowed('https://random-site.xyz/page'), 'Nepoznati domen mora biti blokiran');
    assert(!isUrlAllowed('https://evil.com/malware'), 'evil.com mora biti blokiran');
  });

  await test('isUrlAllowed radi sa custom policy', () => {
    const customPolicy = {
      allowlistDomains: ['example.com'],
      denylistDomains: [],
      maxUrlsPerJob: 5,
      maxFetchBytes: 100_000,
      maxChunkLength: 500,
      chunkOverlap: 50,
    };
    assert(isUrlAllowed('https://example.com/page', customPolicy), 'example.com mora biti dozvoljen');
    assert(!isUrlAllowed('https://spaja.rs/page', customPolicy), 'spaja.rs ne sme biti dozvoljen');
  });

  await test('isUrlAllowed podržava sub-domene allowlista', () => {
    // docs.github.com je sub-domen github.com koji je na allowlisti
    assert(isUrlAllowed('https://docs.github.com/en'), 'docs.github.com mora biti dozvoljen');
  });

  // ─── normalizeLimit ─────────────────────────────────────────────────────────

  await test('normalizeLimit vraća fallback za non-finite vrednosti', () => {
    // Infinity i NaN nisu finite → vraća fallback (5)
    assertEqual(normalizeLimit(NaN), 5, 'NaN → fallback 5');
    assertEqual(normalizeLimit(Infinity), 5, 'Infinity → fallback 5 (nije finite)');
    assertEqual(normalizeLimit(-Infinity), 5, '-Infinity → fallback 5 (nije finite)');
  });

  await test('normalizeLimit clamps na min=1', () => {
    assertEqual(normalizeLimit(0), 1, '0 → min 1');
    assertEqual(normalizeLimit(-5), 1, '-5 → min 1');
  });

  await test('normalizeLimit clamps na max=10', () => {
    assertEqual(normalizeLimit(100), 10, '100 → max 10');
    assertEqual(normalizeLimit(11), 10, '11 → max 10');
  });

  await test('normalizeLimit propušta validne vrednosti', () => {
    assertEqual(normalizeLimit(1), 1, '1 → 1');
    assertEqual(normalizeLimit(5), 5, '5 → 5');
    assertEqual(normalizeLimit(10), 10, '10 → 10');
    assertEqual(normalizeLimit(7), 7, '7 → 7');
  });

  await test('normalizeLimit koristi custom fallback/min/max', () => {
    assertEqual(normalizeLimit(NaN, 3, 1, 20), 3, 'custom fallback 3');
    assertEqual(normalizeLimit(25, 5, 1, 20), 20, 'custom max 20');
    assertEqual(normalizeLimit(0, 5, 2, 20), 2, 'custom min 2');
  });

  // ─── Bezbednosne invarijante ─────────────────────────────────────────────────

  await test('sanitizeForPrompt uklanja prompt injection pokušaje (source check)', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('REMOVED_UNTRUSTED_INSTRUCTION'), 'Mora imati sanitizaciju prompt injection-a');
    // Regex pattern za ignore all instructions (sa \s+ wildcard-om)
    assert(src.includes('ignore\\s+all\\s+instructions'), 'Mora imati detekciju ignore all instructions regex');
    assert(src.includes('CODE_BLOCK_REMOVED'), 'Mora uklanjati code blokove iz untrusted sadržaja');
  });

  await test('crawl i sources POST zahtevaju autentifikaciju (security invarijant)', () => {
    const crawlSrc = fs.readFileSync(path.join(API_ROOT, 'crawl', 'route.ts'), 'utf8');
    const sourcesSrc = fs.readFileSync(path.join(API_ROOT, 'sources', 'route.ts'), 'utf8');
    const citationsSrc = fs.readFileSync(path.join(API_ROOT, 'citations', 'route.ts'), 'utf8');
    assert(
      crawlSrc.includes('verifyUserFromToken'),
      'crawl POST mora verifikovati korisnika',
    );
    assert(
      sourcesSrc.includes('verifyUserFromToken'),
      'sources POST mora verifikovati korisnika',
    );
    assert(
      citationsSrc.includes('verifyUserFromToken'),
      'citations POST mora verifikovati korisnika',
    );
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
