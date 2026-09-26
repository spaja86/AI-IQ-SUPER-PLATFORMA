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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const startDeployDoc = fs.readFileSync(path.join(root, 'docs/EXTRIMLI-START-DEPLOY.md'), 'utf8');
const multiRepoLinksDoc = fs.readFileSync(path.join(root, 'docs/MULTI-REPO-LINKS.md'), 'utf8');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/extrimli-spaja-deploy.yml'), 'utf8');

async function run(): Promise<void> {
  console.log('\n🚀 EXTRIMLI START deploy governance doc test\n');

  await test('START deploy doc locks canonical domain strategy and required labels', () => {
    assert(startDeployDoc.includes('`spaja.nivo*spaja`'), 'requested invalid domain pattern missing');
    assert(startDeployDoc.includes('`spaja.nivo-spaja`'), 'canonical apex domain missing');
    assert(startDeployDoc.includes('`*.spaja.nivo-spaja`'), 'canonical wildcard domain missing');
    assert(startDeployDoc.includes('`extrimli:logic-change`, `extrimli:external-github`, `agent:config-change`'), 'required labels missing');
  });

  await test('START deploy doc records WAWE 1 through WAWE 5 evidence and activation lock', () => {
    assert(startDeployDoc.includes('### WAWE 1 — Pre-release validation evidence'), 'WAWE 1 evidence heading missing');
    assert(startDeployDoc.includes('### WAWE 2 — Build + staging + KPI evidence'), 'WAWE 2 evidence heading missing');
    assert(startDeployDoc.includes('### WAWE 3 — Downstream sync evidence'), 'WAWE 3 evidence heading missing');
    assert(startDeployDoc.includes('### WAWE 4 — Production rollout evidence'), 'WAWE 4 evidence heading missing');
    assert(startDeployDoc.includes('### WAWE 5 — Post-release resilience + analytics + audit evidence'), 'WAWE 5 evidence heading missing');
    assert(startDeployDoc.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AKTIVACIJA'), 'Developer/Create activation lock missing');
    assert(startDeployDoc.includes('Human review remains mandatory pre-promotion'), 'human review gate evidence missing');
    assert(startDeployDoc.includes('Rollback path validated'), 'rollback evidence missing');
  });

  await test('downstream doc and workflow preserve START deploy governance evidence', () => {
    assert(multiRepoLinksDoc.includes('**Cross-repo issue gate:**'), 'cross-repo issue gate block missing');
    assert(multiRepoLinksDoc.includes('IO-OPENUI-AO#<number>'), 'concrete downstream issue format requirement missing');
    assert(multiRepoLinksDoc.includes('Placeholder reference nije dovoljan'), 'placeholder rejection missing');
    assert(multiRepoLinksDoc.includes('**WAWE 3 execution evidence:**'), 'WAWE 3 downstream evidence block missing');
    assert(multiRepoLinksDoc.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AKTIVACIJA'), 'downstream activation lock missing');
    assert(workflow.includes('🌐 Validate canonical domain strategy'), 'workflow domain strategy gate missing');
    assert(workflow.includes('multi-repo-sync-agent: Sinhronizacija EXTRONDOL START payload-a'), 'workflow multi-repo sync summary missing');
    assert(workflow.includes('Release promotion mora biti zaustavljen ako KPI/audit/sync status nije potpun.'), 'workflow promotion freeze summary missing');
  });

  console.log(`\nPassed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    console.error('\nFailures:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
