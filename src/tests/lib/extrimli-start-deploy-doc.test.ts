import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function extractRunBlock(workflow: string, marker: string): string {
  const lines = workflow.split('\n');
  const markerIndex = lines.findIndex((line) => line.includes(marker));
  assert(markerIndex >= 0, `${marker} marker missing`);

  const runIndex = lines.findIndex((line, index) => index > markerIndex && line.includes('run: |'));
  assert(runIndex >= 0, `run block missing for ${marker}`);

  const scriptLines: string[] = [];
  let blockIndent: string | undefined;
  for (let index = runIndex + 1; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === '') {
      scriptLines.push('');
      continue;
    }

    const indentMatch = line.match(/^(\s+)/);
    if (!indentMatch) break;

    if (!blockIndent) blockIndent = indentMatch[1];
    if (indentMatch[1].length < blockIndent.length) break;

    scriptLines.push(line.slice(blockIndent.length));
  }

  assert(scriptLines.length > 0, `script body missing for ${marker}`);
  return scriptLines.join('\n');
}

function executeStartDeployDomainGate(
  script: string,
  envOverrides: Record<string, string | undefined>,
): { output: string; summary: string } {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'start-deploy-gate-'));
  const summaryPath = path.join(tempDir, 'summary.md');
  const outputPath = path.join(tempDir, 'output.txt');
  try {
    fs.writeFileSync(summaryPath, '', 'utf8');
    fs.writeFileSync(outputPath, '', 'utf8');

    execFileSync('bash', ['-c', script], {
      env: {
        ...process.env,
        ...envOverrides,
        GITHUB_STEP_SUMMARY: summaryPath,
        GITHUB_OUTPUT: outputPath,
      },
      stdio: 'pipe',
      encoding: 'utf8',
    });

    return {
      output: fs.readFileSync(outputPath, 'utf8'),
      summary: fs.readFileSync(summaryPath, 'utf8'),
    };
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run(): Promise<void> {
  console.log('\n🚀 EXTRIMLI START deploy governance doc test\n');
  const filePath = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(filePath), '../../..');
  const startDeployDoc = fs.readFileSync(path.join(root, 'docs/EXTRIMLI-START-DEPLOY.md'), 'utf8');
  const multiRepoLinksDoc = fs.readFileSync(path.join(root, 'docs/MULTI-REPO-LINKS.md'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/extrimli-spaja-deploy.yml'), 'utf8');
  const startDeployDomainGateScript = extractRunBlock(workflow, 'START_DEPLOY_DOMAIN_GATE');

  await test('START deploy doc locks canonical domain strategy and required labels', () => {
    assert(startDeployDoc.includes('<!-- START_DEPLOY_REQUIRED_LABELS -->'), 'required-labels marker missing');
    assert(startDeployDoc.includes('<!-- START_DEPLOY_CANONICAL_DOMAIN_STRATEGY -->'), 'canonical-domain marker missing');
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

  await test('workflow reads domain inputs from step environment before shell validation', () => {
    assert(
      workflow.includes('INPUT_CANONICAL_DOMAIN: ${{ github.event.inputs.canonical_domain }}'),
      'canonical domain input must be passed through step env',
    );
    assert(
      workflow.includes('INPUT_WILDCARD_DOMAIN: ${{ github.event.inputs.wildcard_domain }}'),
      'wildcard domain input must be passed through step env',
    );
    assert(
      startDeployDomainGateScript.includes('CANONICAL_DOMAIN="${INPUT_CANONICAL_DOMAIN}"'),
      'script must read canonical domain from step env',
    );
    assert(
      startDeployDomainGateScript.includes('WILDCARD_DOMAIN="${INPUT_WILDCARD_DOMAIN}"'),
      'script must read wildcard domain from step env',
    );
  });

  await test('START deploy domain gate accepts the locked canonical pair', () => {
    const { output, summary } = executeStartDeployDomainGate(startDeployDomainGateScript, {
      INPUT_CANONICAL_DOMAIN: 'spaja.nivo-spaja',
      INPUT_WILDCARD_DOMAIN: '*.spaja.nivo-spaja',
    });

    assert(output.includes('canonical_domain=spaja.nivo-spaja'), 'canonical domain output missing');
    assert(output.includes('wildcard_domain=*.spaja.nivo-spaja'), 'wildcard domain output missing');
    assert(summary.includes('`spaja.nivo-spaja`'), 'summary missing canonical domain');
    assert(summary.includes('`*.spaja.nivo-spaja`'), 'summary missing wildcard domain');
  });

  await test('START deploy domain gate rejects non-canonical domain pairs', () => {
    let rejected = false;

    try {
      executeStartDeployDomainGate(startDeployDomainGateScript, {
        INPUT_CANONICAL_DOMAIN: 'spaja.nivo-spaja',
        INPUT_WILDCARD_DOMAIN: '*.example.com',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      rejected = message.includes('START canonical domain strategy mora ostati zaključana');
    }

    assert(rejected, 'non-canonical domain pair should be rejected by the gate');
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
