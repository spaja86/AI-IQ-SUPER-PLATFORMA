// Autofinish #1413 — SPAJA BAZA INDEKSIRANJE 4 (v4 semantic + hybrid pipeline)
// Pokretanje: npx tsx src/tests/autofinish/spaja-baza-knowledge-v4-indexing.test.ts

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
const MIGRATION_PATH = path.resolve(process.cwd(), 'supabase/migrations/015_spaja_baza_indeksiranje_v4.sql');
const TYPES_PATH = path.resolve(process.cwd(), 'src/lib/supabase/types.ts');
const INDEX_ROUTE_PATH = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/index/route.ts');
const CONTROL_PAGE_PATH = path.resolve(process.cwd(), 'src/app/spaja-baza-control/page.tsx');
const METRICS_ROUTE_PATH = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/metrics/route.ts');

async function runTests(): Promise<void> {
  console.log('\n🏁 SPAJA BAZA INDEKSIRANJE 4 — v4 Semantic + Hybrid Test Suite (#1413)\n');

  await test('AUTOFINISH_COUNT je ažuriran za #1413', () => {
    assert(AUTOFINISH_COUNT >= 1413, `AUTOFINISH_COUNT mora biti >= 1413, dobijeno: ${AUTOFINISH_COUNT}`);
  });

  await test('Migracija 015 postoji', () => {
    assert(fs.existsSync(MIGRATION_PATH), `${MIGRATION_PATH} ne postoji`);
  });

  await test('Migracija 015 uvodi pgvector i v4 RPC', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('CREATE EXTENSION IF NOT EXISTS vector'), 'Nedostaje pgvector extension');
    assert(src.includes('embedding_vector vector(1536)'), 'Nedostaje embedding_vector kolona');
    assert(src.includes('match_knowledge_chunks_v4'), 'Nedostaje v4 retrieval RPC');
  });

  await test('Types fajl sadrži v4 polja na knowledge_chunks', () => {
    const src = fs.readFileSync(TYPES_PATH, 'utf8');
    assert(src.includes('embedding_model_version'), 'Nedostaje embedding_model_version u types.ts');
    assert(src.includes('embedding_vector'), 'Nedostaje embedding_vector u types.ts');
    assert(src.includes('semantic_score'), 'Nedostaje semantic_score u types.ts');
  });

  await test('Types fajl sadrži retrieval_index_version metrike', () => {
    const src = fs.readFileSync(TYPES_PATH, 'utf8');
    assert(src.includes('retrieval_index_version'), 'Nedostaje retrieval_index_version u types.ts');
    assert(src.includes('semantic_retrieval_used'), 'Nedostaje semantic_retrieval_used u types.ts');
  });

  await test('Lib sadrži v4 konstante i scoring', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("KNOWLEDGE_INDEX_VERSION_V4 = 'v4'"), 'Nedostaje KNOWLEDGE_INDEX_VERSION_V4');
    assert(src.includes('SEARCH_SCORE_WEIGHTS_V4'), 'Nedostaje SEARCH_SCORE_WEIGHTS_V4');
    assert(src.includes('semanticSimilarity'), 'v4 scoring mora imati semanticSimilarity signal');
  });

  await test('Lib sadrži embedding helper funkcije', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('function createEmbeddingVector'), 'Nedostaje createEmbeddingVector');
    assert(src.includes('openai.embeddings.create'), 'Nedostaje embeddings API poziv');
    assert(src.includes('function toVectorLiteral'), 'Nedostaje toVectorLiteral helper');
  });

  await test("KnowledgeIndexingOptions sadrži indexVersion 'v4' i upgradeToV4", () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("'v1' | 'v2' | 'v3' | 'v4'"), "Nedostaje 'v4' u indexVersion uniji");
    assert(src.includes('upgradeToV4?: boolean'), 'Nedostaje upgradeToV4 u KnowledgeIndexingOptions');
  });

  await test('runKnowledgeIndexing podržava upgradeToV4 i upis embedding kolona', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('upgradeToV4'), 'Nedostaje upgradeToV4 logika');
    assert(src.includes('embedding_vector: embeddingVector'), 'Nedostaje embedding_vector update');
    assert(src.includes('embedding_model_version'), 'Nedostaje embedding_model_version update');
  });

  await test('searchKnowledge koristi v4 RPC i hybrid scoring', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes("rpc('match_knowledge_chunks_v4'"), 'Nedostaje v4 RPC retrieval');
    assert(src.includes('isV4Chunk'), 'Nedostaje v4 branch u scoring-u');
    assert(src.includes('semanticRetrievalUsed'), 'Nedostaje semantic retrieval observability flag');
  });

  await test("Index route prihvata indexVersion 'v4' i upgradeToV4", () => {
    const src = fs.readFileSync(INDEX_ROUTE_PATH, 'utf8');
    assert(src.includes("'v1' | 'v2' | 'v3' | 'v4'"), "Nedostaje 'v4' u body tipu index route-a");
    assert(src.includes('upgradeToV4?: boolean'), 'Nedostaje upgradeToV4 u body tipu');
    assert(src.includes('upgradeToV4: Boolean(body.upgradeToV4)'), 'Nedostaje upgradeToV4 prosleđivanje');
  });

  await test('Kontrolni panel prikazuje indexedV4', () => {
    const src = fs.readFileSync(CONTROL_PAGE_PATH, 'utf8');
    assert(src.includes('indexedV4:'), 'Nedostaje indexedV4 u kontrolnom panelu');
    assert(src.includes('"Indexed v4"'), 'Nedostaje Indexed v4 kartica');
  });

  await test('Metrics route prikazuje retrievalByVersion i semanticUsageRate', () => {
    const src = fs.readFileSync(METRICS_ROUTE_PATH, 'utf8');
    assert(src.includes('retrievalByVersion'), 'Nedostaje retrievalByVersion metric');
    assert(src.includes('semanticUsageRate'), 'Nedostaje semanticUsageRate metric');
  });

  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('\n✅ Svi INDEKSIRANJE 4 v4 testovi prošli.\n');
  }
}

void runTests();
