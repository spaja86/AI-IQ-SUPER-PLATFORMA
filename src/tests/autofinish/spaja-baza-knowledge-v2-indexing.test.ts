// Autofinish #1408 — SPAJA BAZA INDEKSIRANJE 2 (v2 indexing pipeline)
// Pokretanje: npx tsx src/tests/autofinish/spaja-baza-knowledge-v2-indexing.test.ts
//
// Verifikuje sve strukturne invarijante INDEKSIRANJE 2:
// - v2 konstante i helper funkcije u lib-u
// - migracija 013 postoji i sadrži ispravne kolone
// - index route prihvata indexVersion i upgradeToV2 parametre
// - KnowledgeIndexStatus izlaže indexedV1/indexedV2 polja
// - kontrolni panel prikazuje v1/v2 breakdown

import fs from 'node:fs';
import path from 'node:path';
import { AUTOFINISH_COUNT } from '../../lib/constants';

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

const LIB_PATH = path.resolve(process.cwd(), 'src/lib/spaja-baza-knowledge.ts');
const MIGRATION_PATH = path.resolve(process.cwd(), 'supabase/migrations/013_spaja_baza_indeksiranje_v2.sql');
const TYPES_PATH = path.resolve(process.cwd(), 'src/lib/supabase/types.ts');
const INDEX_ROUTE_PATH = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/index/route.ts');
const CONTROL_PAGE_PATH = path.resolve(process.cwd(), 'src/app/spaja-baza-control/page.tsx');

async function runTests(): Promise<void> {
  console.log('\n🏁 SPAJA BAZA INDEKSIRANJE 2 — v2 Indexing Pipeline Test Suite (#1408)\n');

  // ─── Autofinish baseline ────────────────────────────────────────────────────

  await test('AUTOFINISH_COUNT je ažuriran za #1408', () => {
    assert(AUTOFINISH_COUNT >= 1408, `AUTOFINISH_COUNT mora biti >= 1408, dobijeno: ${AUTOFINISH_COUNT}`);
  });

  // ─── Migracija 013 ──────────────────────────────────────────────────────────

  await test('Migracija 013 postoji', () => {
    assert(fs.existsSync(MIGRATION_PATH), `${MIGRATION_PATH} ne postoji`);
  });

  await test('Migracija 013 sadrži keyword_density kolonu', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('keyword_density'), 'Nedostaje keyword_density ALTER');
  });

  await test('Migracija 013 sadrži unique_term_count kolonu', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('unique_term_count'), 'Nedostaje unique_term_count ALTER');
  });

  await test('Migracija 013 kreira indeks za v2 status', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('idx_knowledge_chunks_v2_status'), 'Nedostaje v2 status indeks');
  });

  await test('Migracija 013 kreira indeks za keyword_density', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('idx_knowledge_chunks_keyword_density'), 'Nedostaje keyword_density indeks');
  });

  // ─── TypeScript tipovi ──────────────────────────────────────────────────────

  await test('Types fajl sadrži keyword_density na knowledge_chunks', () => {
    const src = fs.readFileSync(TYPES_PATH, 'utf8');
    assert(src.includes('keyword_density'), 'Nedostaje keyword_density u types.ts');
  });

  await test('Types fajl sadrži unique_term_count na knowledge_chunks', () => {
    const src = fs.readFileSync(TYPES_PATH, 'utf8');
    assert(src.includes('unique_term_count'), 'Nedostaje unique_term_count u types.ts');
  });

  // ─── Lib — v2 konstante i helper funkcije ───────────────────────────────────

  await test('Lib sadrži KNOWLEDGE_INDEX_VERSION_V2 konstantu', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("KNOWLEDGE_INDEX_VERSION_V2 = 'v2'"), 'Nedostaje KNOWLEDGE_INDEX_VERSION_V2');
  });

  await test('Lib sadrži SEARCH_SCORE_WEIGHTS_V2 objekat', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('SEARCH_SCORE_WEIGHTS_V2'), 'Nedostaje SEARCH_SCORE_WEIGHTS_V2');
    assert(src.includes('termFrequency'), 'SEARCH_SCORE_WEIGHTS_V2 mora imati termFrequency signal');
    assert(src.includes('keywordDensity'), 'SEARCH_SCORE_WEIGHTS_V2 mora imati keywordDensity signal');
  });

  await test('Lib sadrži buildIndexedContentV2 funkciju', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function buildIndexedContentV2'), 'Nedostaje buildIndexedContentV2');
  });

  await test('Lib sadrži extractBigrams helper', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function extractBigrams'), 'Nedostaje extractBigrams');
  });

  await test('Lib sadrži computeKeywordDensity funkciju', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function computeKeywordDensity'), 'Nedostaje computeKeywordDensity');
  });

  await test('Lib sadrži computeUniqueTermCount funkciju', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function computeUniqueTermCount'), 'Nedostaje computeUniqueTermCount');
  });

  await test('Lib sadrži computeTermFrequencyScore funkciju', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function computeTermFrequencyScore'), 'Nedostaje computeTermFrequencyScore');
  });

  // ─── Lib — KnowledgeIndexingOptions v2 proširenje ──────────────────────────

  await test('KnowledgeIndexingOptions sadrži indexVersion polje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("indexVersion?: 'v1' | 'v2'"), 'Nedostaje indexVersion u KnowledgeIndexingOptions');
  });

  await test('KnowledgeIndexingOptions sadrži upgradeToV2 polje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('upgradeToV2?: boolean'), 'Nedostaje upgradeToV2 u KnowledgeIndexingOptions');
  });

  // ─── Lib — KnowledgeIndexStatus v1/v2 breakdown ─────────────────────────────

  await test('KnowledgeIndexStatus.queue sadrži indexedV1 polje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('indexedV1:'), 'Nedostaje indexedV1 u KnowledgeIndexStatus.queue');
  });

  await test('KnowledgeIndexStatus.queue sadrži indexedV2 polje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('indexedV2:'), 'Nedostaje indexedV2 u KnowledgeIndexStatus.queue');
  });

  // ─── Lib — runKnowledgeIndexing v2 podrška ──────────────────────────────────

  await test('runKnowledgeIndexing koristi targetVersion umesto hardkodovanog v1', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('targetVersion'), 'Nedostaje targetVersion varijabla u runKnowledgeIndexing');
    assert(src.includes('buildIndexedContentV2'), 'runKnowledgeIndexing mora pozivati buildIndexedContentV2');
  });

  await test('runKnowledgeIndexing podržava upgradeToV2 filtriranje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('upgradeToV2'), 'Nedostaje upgradeToV2 logika u runKnowledgeIndexing');
    assert(src.includes('KNOWLEDGE_INDEX_VERSION_V2'), 'Nedostaje filter na v2 verziju za upgrade');
  });

  await test('runKnowledgeIndexing piše keyword_density i unique_term_count', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('keyword_density: keywordDensity'), 'Nedostaje keyword_density u update');
    assert(src.includes('unique_term_count: uniqueTermCount'), 'Nedostaje unique_term_count u update');
  });

  // ─── Lib — searchKnowledge v2 scoring ───────────────────────────────────────

  await test('searchKnowledge selectuje index_version i keyword_density', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('index_version,'), 'Nedostaje index_version u search select');
    assert(src.includes('keyword_density,'), 'Nedostaje keyword_density u search select');
  });

  await test('searchKnowledge koristi v2 scoring za v2 chunk-ove', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('isV2Chunk'), 'Nedostaje isV2Chunk provera u scoring-u');
    assert(src.includes('SEARCH_SCORE_WEIGHTS_V2'), 'Nedostaje SEARCH_SCORE_WEIGHTS_V2 u searchKnowledge');
  });

  // ─── Index route — v2 parametri ─────────────────────────────────────────────

  await test('Index route prihvata indexVersion parametar', () => {
    const src = fs.readFileSync(INDEX_ROUTE_PATH, 'utf8');
    assert(src.includes("indexVersion?: 'v1' | 'v2'"), 'Nedostaje indexVersion u body tipu');
    assert(src.includes('indexVersion: body.indexVersion'), 'Nedostaje indexVersion prosleđivanje');
  });

  await test('Index route prihvata upgradeToV2 parametar', () => {
    const src = fs.readFileSync(INDEX_ROUTE_PATH, 'utf8');
    assert(src.includes('upgradeToV2?: boolean'), 'Nedostaje upgradeToV2 u body tipu');
    assert(src.includes('upgradeToV2: Boolean(body.upgradeToV2)'), 'Nedostaje upgradeToV2 prosleđivanje');
  });

  // ─── Kontrolni panel — v1/v2 breakdown ──────────────────────────────────────

  await test('Kontrolni panel sadrži indexedV1 u interfejsu', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('indexedV1:'), 'Nedostaje indexedV1 u IndexStatusResponse interfejsu');
  });

  await test('Kontrolni panel sadrži indexedV2 u interfejsu', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('indexedV2:'), 'Nedostaje indexedV2 u IndexStatusResponse interfejsu');
  });

  await test('Kontrolni panel prikazuje Indexed v1 StatCard', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('"Indexed v1"'), 'Nedostaje Indexed v1 stat kartica');
    assert(src.includes('indexedV1'), 'Nedostaje indexedV1 vrednost u kartici');
  });

  await test('Kontrolni panel prikazuje Indexed v2 StatCard', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('"Indexed v2"'), 'Nedostaje Indexed v2 stat kartica');
    assert(src.includes('indexedV2'), 'Nedostaje indexedV2 vrednost u kartici');
  });

  // ─── Rezultat ───────────────────────────────────────────────────────────────

  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('\n✅ Svi INDEKSIRANJE 2 v2 testovi prošli.\n');
  }
}

void runTests();
