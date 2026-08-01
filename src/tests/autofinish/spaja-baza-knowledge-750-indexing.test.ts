// Autofinish #1750 — SPAJA BAZA INDEKSIRANJE 750 (KPI režim)
// Pokretanje: npx tsx src/tests/autofinish/spaja-baza-knowledge-750-indexing.test.ts

import fs from 'node:fs';
import path from 'node:path';

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
const INDEX_ROUTE_PATH = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/index/route.ts');
const STATUS_ROUTE_PATH = path.resolve(process.cwd(), 'src/app/api/spaja-baza-knowledge/index-status/route.ts');
const SCRIPT_PATH = path.resolve(process.cwd(), 'scripts/index-auto-promote.ts');
const WORKFLOW_PATH = path.resolve(process.cwd(), '.github/workflows/index-auto-promote.yml');
const AGENT_CONFIG_PATH = path.resolve(process.cwd(), '.agent-config.json');
const MIGRATION_PATH = path.resolve(process.cwd(), 'supabase/migrations/022_indeksiranje_750.sql');
const ADR_PATH = path.resolve(process.cwd(), 'docs/ADR-INDEKSIRANJE-750.md');
const RUNBOOK_PATH = path.resolve(process.cwd(), 'docs/SPAJA-BAZA-RUNBOOK.md');

async function runTests(): Promise<void> {
  console.log('\n🏁 SPAJA BAZA INDEKSIRANJE 750 — KPI Mode Test Suite\n');

  await test('Migracija 022 postoji', () => {
    assert(fs.existsSync(MIGRATION_PATH), `${MIGRATION_PATH} ne postoji`);
  });

  await test('Migracija 022 uvodi audit tabelu i alerts view', () => {
    const src = fs.readFileSync(MIGRATION_PATH, 'utf8');
    assert(src.includes('CREATE TABLE IF NOT EXISTS knowledge_index_750_audit'), 'Nedostaje knowledge_index_750_audit');
    assert(src.includes('CREATE OR REPLACE VIEW knowledge_index_750_alerts'), 'Nedostaje knowledge_index_750_alerts');
    assert(src.includes('safe_stop_triggered'), 'Nedostaje safe_stop_triggered kolona');
  });

  await test('Lib podržava INDEKSIRANJE 750 opcije i audit log', () => {
    const src = fs.readFileSync(LIB_PATH, 'utf8');
    assert(src.includes('indeksiranje750?: boolean'), 'Nedostaje indeksiranje750 option');
    assert(src.includes('targetCompletionPct?: number'), 'Nedostaje targetCompletionPct option');
    assert(src.includes('degradationThresholdPct?: number'), 'Nedostaje degradationThresholdPct option');
    assert(src.includes('function buildIndexing750Metrics'), 'Nedostaje buildIndexing750Metrics');
    assert(src.includes("from('knowledge_index_750_audit')"), 'Nedostaje upis u knowledge_index_750_audit');
  });

  await test('Index route prihvata INDEKSIRANJE 750 parametre', () => {
    const src = fs.readFileSync(INDEX_ROUTE_PATH, 'utf8');
    assert(src.includes('indeksiranje750?: boolean'), 'Nedostaje indeksiranje750 u route body tipu');
    assert(src.includes('safeStop750?: boolean'), 'Nedostaje safeStop750 u route body tipu');
    assert(src.includes('indeksiranje750: Boolean(body.indeksiranje750)'), 'Nedostaje prosleđivanje indeksiranje750');
  });

  await test('Index status route vraća indexing750 signal', () => {
    const src = fs.readFileSync(STATUS_ROUTE_PATH, 'utf8');
    assert(src.includes('indexing750: status.indexing750'), 'Nedostaje indexing750 u status response-u');
  });

  await test('CLI skripta podržava 750 env kontrole', () => {
    const src = fs.readFileSync(SCRIPT_PATH, 'utf8');
    assert(src.includes('INDEX_750_MODE'), 'Nedostaje INDEX_750_MODE');
    assert(src.includes('INDEX_750_SAFE_STOP'), 'Nedostaje INDEX_750_SAFE_STOP');
    assert(src.includes("knowledge_index_750_audit"), 'Nedostaje 750 audit insert u skripti');
  });

  await test('Workflow podržava 750 inpute', () => {
    const src = fs.readFileSync(WORKFLOW_PATH, 'utf8');
    assert(src.includes('indeksiranje_750:'), 'Nedostaje indeksiranje_750 workflow input');
    assert(src.includes('INDEX_750_MODE'), 'Nedostaje INDEX_750_MODE env');
    assert(src.includes('index_750_safe_stop:'), 'Nedostaje index_750_safe_stop input');
  });

  await test('.agent-config sadrži indeksiranje750 sekciju', () => {
    const src = fs.readFileSync(AGENT_CONFIG_PATH, 'utf8');
    assert(src.includes('"indeksiranje750"'), 'Nedostaje indeksiranje750 sekcija');
    assert(src.includes('"targetCompletionPct": 75'), 'Nedostaje targetCompletionPct');
  });

  await test('ADR i runbook dokumentacija za 750 postoje', () => {
    assert(fs.existsSync(ADR_PATH), `${ADR_PATH} ne postoji`);
    const runbook = fs.readFileSync(RUNBOOK_PATH, 'utf8');
    assert(runbook.includes('## 12) INDEKSIRANJE 750'), 'Nedostaje INDEKSIRANJE 750 runbook sekcija');
  });

  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\n❌ Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('\n✅ Svi INDEKSIRANJE 750 testovi prošli.\n');
  }
}

void runTests();
