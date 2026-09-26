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

async function run(): Promise<void> {
  console.log('\n🚀 EXTRIMLI START deploy governance doc test\n');
  const root = process.cwd();
  const startDeployDoc = fs.readFileSync(path.join(root, 'docs/EXTRIMLI-START-DEPLOY.md'), 'utf8');
  const multiRepoLinksDoc = fs.readFileSync(path.join(root, 'docs/MULTI-REPO-LINKS.md'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/extrimli-spaja-deploy.yml'), 'utf8');

  await test('START deploy doc locks canonical domain strategy and required labels', () => {
    assert(startDeployDoc.includes('<!-- START_DEPLOY_REQUIRED_LABELS -->'), 'required-labels marker missing');
    assert(startDeployDoc.includes('<!-- START_DEPLOY_CANONICAL_DOMAIN_STRATEGY -->'), 'canonical-domain marker missing');
    assert(startDeployDoc.includes('`spaja.nivo*spaja`'), 'requested invalid domain pattern missing');
    assert(startDeployDoc.includes('❌ Invalid'), 'invalid requested domain pattern must stay explicitly rejected');
    assert(startDeployDoc.includes('`spaja.nivo-spaja`'), 'canonical apex domain missing');
    assert(startDeployDoc.includes('`*.spaja.nivo-spaja`'), 'canonical wildcard domain missing');
    assert(startDeployDoc.includes('`extrimli:logic-change`, `extrimli:external-github`, `agent:config-change`'), 'required labels missing');
  });

  await test('START deploy doc records WAWE 1 through WAWE 5 evidence and activation lock', () => {
    assert(startDeployDoc.includes('<!-- START_DEPLOY_WAWE_1 -->'), 'WAWE 1 marker missing');
    assert(startDeployDoc.includes('<!-- START_DEPLOY_WAWE_2 -->'), 'WAWE 2 marker missing');
    assert(startDeployDoc.includes('<!-- START_DEPLOY_WAWE_3 -->'), 'WAWE 3 marker missing');
    assert(startDeployDoc.includes('<!-- START_DEPLOY_WAWE_4 -->'), 'WAWE 4 marker missing');
    assert(startDeployDoc.includes('<!-- START_DEPLOY_WAWE_5 -->'), 'WAWE 5 marker missing');
    assert(startDeployDoc.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AKTIVACIJA'), 'Developer/Create activation lock missing');
    assert(startDeployDoc.includes('Mandatory before merge / release per `AGENTS.md`'), 'human review gate value missing');
    assert(startDeployDoc.includes('| Rollback path validated |'), 'rollback evidence row missing');
  });

  await test('downstream doc and workflow preserve START deploy governance evidence', () => {
    assert(multiRepoLinksDoc.includes('<!-- START_DEPLOY_MULTI_REPO_SECTION -->'), 'multi-repo section marker missing');
    assert(multiRepoLinksDoc.includes('<!-- START_DEPLOY_WAWE3_EVIDENCE -->'), 'WAWE 3 evidence marker missing');
    assert(multiRepoLinksDoc.includes('<!-- START_DEPLOY_ISSUE_GATE -->'), 'issue gate marker missing');
    assert(multiRepoLinksDoc.includes('WAWE 4 promocije'), 'WAWE 4 downstream issue gate missing');
    assert(multiRepoLinksDoc.includes('konkretan downstream issue'), 'concrete downstream issue requirement missing');
    assert(multiRepoLinksDoc.includes('DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AKTIVACIJA'), 'downstream activation lock missing');
    assert(workflow.includes('START_DEPLOY_DOMAIN_GATE'), 'workflow domain gate marker missing');
    assert(workflow.includes('START_DEPLOY_MULTI_REPO_SYNC'), 'workflow multi-repo sync marker missing');
    assert(workflow.includes('START_DEPLOY_PROMOTION_FREEZE'), 'workflow promotion freeze marker missing');
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
