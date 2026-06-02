// Autofinish #1411 — SPAJA BAZA INDEKSIRANJE 3 (v3 FTS + position signal pipeline)
// Pokretanje: npx tsx src/tests/autofinish/spaja-baza-knowledge-v3-indexing.test.ts
//
// Verifikuje sve strukturne invarijante INDEKSIRANJE 3:
// - migracija 014 postoji i sadrži ispravne kolone/indekse
// - types.ts sadrži position_score
// - lib sadrži v3 konstante, SEARCH_SCORE_WEIGHTS_V3, computePositionScore
// - KnowledgeIndexingOptions sadrži indexVersion 'v3' i upgradeToV3
// - KnowledgeIndexStatus izlaže indexedV3 polje
// - searchKnowledge koristi textSearch (FTS) umesto ilike za primarnu pretragu
// - index route prihvata indexVersion 'v3' i upgradeToV3
// - kontrolni panel prikazuje Indexed v3 karticu

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
const MIGRATION_PATH = path.resolve(process.cwd(), 'supabase/migrations/014_spaja_baza_indeksiranje_v3.sql');
const TYPES_PATH = path.resolve(process.cwd(), 'src/lib/supabase/types.ts');
const INDEX_ROUTE_PATH = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/index/route.ts');
const CONTROL_PAGE_PATH = path.resolve(process.cwd(), 'src/app/spaja-baza-control/page.tsx');

async function runTests(): Promise<void> {
  console.log('\n🏁 SPAJA BAZA INDEKSIRANJE 3 — v3 FTS + Position Signal Test Suite (#1411)\n');

  // ─── Autofinish baseline ────────────────────────────────────────────────────

  await test('AUTOFINISH_COUNT je ažuriran za #1411', () => {
    assert(AUTOFINISH_COUNT >= 1411, `AUTOFINISH_COUNT mora biti >= 1411, dobijeno: ${AUTOFINISH_COUNT}`);
  });

  // ─── Migracija 014 ──────────────────────────────────────────────────────────

  await test('Migracija 014 postoji', () => {
    assert(fs.existsSync(MIGRATION_PATH), `${MIGRATION_PATH} ne postoji`);
  });

  await test('Migracija 014 sadrži position_score kolonu', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('position_score'), 'Nedostaje position_score ALTER');
  });

  await test('Migracija 014 kreira indeks za v3 status', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('idx_knowledge_chunks_v3_status'), 'Nedostaje v3 status indeks');
  });

  await test('Migracija 014 kreira indeks za position_score', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('idx_knowledge_chunks_position_score'), 'Nedostaje position_score indeks');
  });

  // ─── TypeScript tipovi ──────────────────────────────────────────────────────

  await test('Types fajl sadrži position_score na knowledge_chunks', () => {
    const src = fs.readFileSync(TYPES_PATH, 'utf8');
    assert(src.includes('position_score'), 'Nedostaje position_score u types.ts');
  });

  // ─── Lib — v3 konstante i helper funkcije ───────────────────────────────────

  await test('Lib sadrži KNOWLEDGE_INDEX_VERSION_V3 konstantu', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("KNOWLEDGE_INDEX_VERSION_V3 = 'v3'"), 'Nedostaje KNOWLEDGE_INDEX_VERSION_V3');
  });

  await test('Lib sadrži SEARCH_SCORE_WEIGHTS_V3 objekat', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('SEARCH_SCORE_WEIGHTS_V3'), 'Nedostaje SEARCH_SCORE_WEIGHTS_V3');
    assert(src.includes('positionScore'), 'SEARCH_SCORE_WEIGHTS_V3 mora imati positionScore signal');
  });

  await test('Lib sadrži computePositionScore funkciju', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function computePositionScore'), 'Nedostaje computePositionScore');
    assert(src.includes('Math.exp'), 'computePositionScore mora koristiti eksponencijalni decay');
  });

  // ─── Lib — KnowledgeIndexingOptions v3 proširenje ──────────────────────────

  await test("KnowledgeIndexingOptions sadrži indexVersion 'v3'", () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("'v1' | 'v2' | 'v3'"), "Nedostaje 'v3' u indexVersion uniji");
  });

  await test('KnowledgeIndexingOptions sadrži upgradeToV3 polje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('upgradeToV3?: boolean'), 'Nedostaje upgradeToV3 u KnowledgeIndexingOptions');
  });

  // ─── Lib — KnowledgeIndexStatus v3 breakdown ────────────────────────────────

  await test('KnowledgeIndexStatus.queue sadrži indexedV3 polje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('indexedV3:'), 'Nedostaje indexedV3 u KnowledgeIndexStatus.queue');
  });

  // ─── Lib — runKnowledgeIndexing v3 podrška ──────────────────────────────────

  await test('runKnowledgeIndexing podržava upgradeToV3 filtriranje', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('upgradeToV3'), 'Nedostaje upgradeToV3 logika u runKnowledgeIndexing');
    assert(src.includes('KNOWLEDGE_INDEX_VERSION_V3'), 'Nedostaje filter na v3 verziju za upgrade');
  });

  await test('runKnowledgeIndexing piše position_score', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('position_score: positionScore'), 'Nedostaje position_score u update');
    assert(src.includes('computePositionScore'), 'runKnowledgeIndexing mora pozivati computePositionScore');
  });

  await test('runKnowledgeIndexing selektuje chunk_index u kandidatima', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('chunk_index') && src.includes('IndexCandidateRow'), 'Nedostaje chunk_index u IndexCandidateRow');
  });

  // ─── Lib — searchKnowledge v3 FTS i scoring ─────────────────────────────────

  await test('searchKnowledge koristi textSearch za primarnu pretragu', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('textSearch'), 'Nedostaje textSearch poziv u searchKnowledge');
    assert(src.includes("type: 'plain'"), "textSearch mora koristiti type: 'plain'");
    assert(src.includes("config: 'simple'"), "textSearch mora koristiti config: 'simple'");
  });

  await test('searchKnowledge selektuje position_score kolonu', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('position_score,'), 'Nedostaje position_score u search select');
  });

  await test('searchKnowledge koristi v3 scoring za v3 chunk-ove', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('isV3Chunk'), 'Nedostaje isV3Chunk provera u scoring-u');
    assert(src.includes('SEARCH_SCORE_WEIGHTS_V3'), 'Nedostaje SEARCH_SCORE_WEIGHTS_V3 u searchKnowledge');
  });

  // ─── Index route — v3 parametri ─────────────────────────────────────────────

  await test("Index route prihvata indexVersion 'v3'", () => {
    const src = fs.readFileSync(INDEX_ROUTE_PATH, 'utf8');
    assert(src.includes("'v1' | 'v2' | 'v3'"), "Nedostaje 'v3' u body tipu index route-a");
  });

  await test('Index route prihvata upgradeToV3 parametar', () => {
    const src = fs.readFileSync(INDEX_ROUTE_PATH, 'utf8');
    assert(src.includes('upgradeToV3?: boolean'), 'Nedostaje upgradeToV3 u body tipu');
    assert(src.includes('upgradeToV3: Boolean(body.upgradeToV3)'), 'Nedostaje upgradeToV3 prosleđivanje');
  });

  // ─── Kontrolni panel — v3 breakdown ─────────────────────────────────────────

  await test('Kontrolni panel sadrži indexedV3 u interfejsu', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('indexedV3:'), 'Nedostaje indexedV3 u IndexStatusResponse interfejsu');
  });

  await test('Kontrolni panel prikazuje Indexed v3 StatCard', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('"Indexed v3"'), 'Nedostaje Indexed v3 stat kartica');
    assert(src.includes('indexedV3'), 'Nedostaje indexedV3 vrednost u kartici');
  });

  // ─── Rezultat ───────────────────────────────────────────────────────────────

  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('\n✅ Svi INDEKSIRANJE 3 v3 testovi prošli.\n');
  }
}

void runTests();
