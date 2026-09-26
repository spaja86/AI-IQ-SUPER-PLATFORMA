import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
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

function extractStartDeployDomainGateScript(workflow: string): string {
  const markerIndex = workflow.indexOf('# START_DEPLOY_DOMAIN_GATE');
  assert(markerIndex >= 0, 'workflow domain gate marker missing');

  const runIndex = workflow.indexOf('run: |\n', markerIndex);
  assert(runIndex >= 0, 'workflow domain gate script block missing');

  const runBlock = workflow.slice(runIndex + 'run: |\n'.length);
  const nextStepIndex = runBlock.search(/\n {6}- name: /);
  const scriptBlock = nextStepIndex >= 0 ? runBlock.slice(0, nextStepIndex) : runBlock;

  return scriptBlock
    .replace(/^ {10}/gm, '')
    .replace(
      'CANONICAL_DOMAIN="${{ github.event.inputs.canonical_domain }}"',
      'CANONICAL_DOMAIN="${CANONICAL_DOMAIN_INPUT:-}"',
    )
    .replace(
      'WILDCARD_DOMAIN="${{ github.event.inputs.wildcard_domain }}"',
      'WILDCARD_DOMAIN="${WILDCARD_DOMAIN_INPUT:-}"',
    );
}

function runStartDeployDomainGateScript(
  script: string,
  inputs: { canonicalDomain?: string; wildcardDomain?: string },
): { ok: boolean; stdout: string; stderr: string; githubOutput: string } {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'start-deploy-domain-gate-'));
  const githubOutputPath = path.join(tempDir, 'github-output.txt');
  const githubStepSummaryPath = path.join(tempDir, 'github-step-summary.md');

  try {
    const stdout = execFileSync('bash', ['-c', script], {
      encoding: 'utf8',
      env: {
        ...process.env,
        CANONICAL_DOMAIN_INPUT: inputs.canonicalDomain ?? '',
        WILDCARD_DOMAIN_INPUT: inputs.wildcardDomain ?? '',
        GITHUB_OUTPUT: githubOutputPath,
        GITHUB_STEP_SUMMARY: githubStepSummaryPath,
      },
    });

    return {
      ok: true,
      stdout,
      stderr: '',
      githubOutput: fs.readFileSync(githubOutputPath, 'utf8'),
    };
  } catch (error) {
    const execError = error as {
      stdout?: string | Buffer;
      stderr?: string | Buffer;
    };

    return {
      ok: false,
      stdout: execError.stdout ? String(execError.stdout) : '',
      stderr: execError.stderr ? String(execError.stderr) : '',
      githubOutput: fs.existsSync(githubOutputPath) ? fs.readFileSync(githubOutputPath, 'utf8') : '',
    };
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function isBashAvailable(): boolean {
  try {
    execFileSync('bash', ['-lc', 'exit 0'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function run(): Promise<void> {
  console.log('\n🚀 EXTRIMLI START deploy governance doc test\n');
  const filePath = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(filePath), '../../..');
  const startDeployDoc = fs.readFileSync(path.join(root, 'docs/EXTRIMLI-START-DEPLOY.md'), 'utf8');
  const multiRepoLinksDoc = fs.readFileSync(path.join(root, 'docs/MULTI-REPO-LINKS.md'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/extrimli-spaja-deploy.yml'), 'utf8');
  const domainGateScript = extractStartDeployDomainGateScript(workflow);

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

  await test('START deploy workflow preserves the canonical pair equality gate', () => {
    assert(
      domainGateScript.includes('EXPECTED_CANONICAL_DOMAIN="spaja.nivo-spaja"'),
      'expected canonical domain lock missing',
    );
    assert(
      domainGateScript.includes('EXPECTED_WILDCARD_DOMAIN="*.spaja.nivo-spaja"'),
      'expected wildcard domain lock missing',
    );
    assert(
      domainGateScript.includes(
        'if [ "$CANONICAL_DOMAIN" != "$EXPECTED_CANONICAL_DOMAIN" ] || [ "$WILDCARD_DOMAIN" != "$EXPECTED_WILDCARD_DOMAIN" ]; then',
      ),
      'canonical pair equality gate missing',
    );
  });

  await test('START deploy workflow accepts only the canonical apex + wildcard pair', () => {
    if (!isBashAvailable()) {
      console.log('    ℹ️ Bash unavailable; skipping extracted workflow execution check.');
      return;
    }

    const result = runStartDeployDomainGateScript(domainGateScript, {
      canonicalDomain: 'spaja.nivo-spaja',
      wildcardDomain: '*.spaja.nivo-spaja',
    });

    assert(result.ok, `canonical domain pair should pass the workflow gate\n${result.stdout}${result.stderr}`);
    assert(result.githubOutput.includes('canonical_domain=spaja.nivo-spaja'), 'canonical domain output missing');
    assert(result.githubOutput.includes('wildcard_domain=*.spaja.nivo-spaja'), 'wildcard domain output missing');
  });

  await test('START deploy workflow rejects valid-but-non-canonical domain pairs', () => {
    if (!isBashAvailable()) {
      console.log('    ℹ️ Bash unavailable; skipping extracted workflow execution check.');
      return;
    }

    const result = runStartDeployDomainGateScript(domainGateScript, {
      canonicalDomain: 'example.com',
      wildcardDomain: '*.example.com',
    });

    assert(!result.ok, 'non-canonical domain pair should be rejected by the workflow gate');
    assert(
      `${result.stdout}${result.stderr}`.includes('START canonical domain strategy mora ostati zaključana'),
      'canonical-pair rejection message missing',
    );
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
