// Mekartor deployment contract tests

import { getMekartorSnapshot, mekartorEnvRequirements, mekartorKpis } from '../../lib/mekartor';
import { getDeployPlatformById } from '../../lib/deploy/deploy-registry';
import { platforme } from '../../lib/platforme';

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

async function runTests(): Promise<void> {
  console.log('\n🧭 Mekartor Test Suite\n');

  await test('Mekartor snapshot exposes deploy-ready scope', () => {
    const snapshot = getMekartorSnapshot();
    assert(snapshot.id === 'mekartor', 'id mora biti mekartor');
    assert(snapshot.scope.targetEnvironments.length === 3, 'mora imati dev/staging/production');
    assert(snapshot.deployment.manualTriggerEnabled === true, 'manual trigger mora biti uključen');
    assert(snapshot.crossRepo.downstreamDependency === false, 'ne sme imati downstream dependency');
  });

  await test('Mekartor KPI i env registri nisu prazni', () => {
    assert(mekartorKpis.length >= 3, 'mora imati KPI definicije');
    assert(mekartorEnvRequirements.length >= 2, 'mora imati env zahteve');
  });

  await test('Deploy registry sadrži Mekartor', () => {
    const platform = getDeployPlatformById('mekartor');
    assert(platform !== undefined, 'mekartor mora biti u deploy registru');
    assert(platform?.healthUrl?.includes('/api/mekartor') === true, 'health URL mora voditi na /api/mekartor');
  });

  await test('Platform inventory sadrži Mekartor', () => {
    const platform = platforme.find((entry) => entry.id === 'mekartor');
    assert(platform !== undefined, 'mekartor mora biti u platforme registru');
    assert(platform?.deploy.projectId === 'ai-iq-super-platforma', 'repo-local project treba da koristi ai-iq-super-platforma project');
  });

  console.log(`\nRezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
}

void runTests();
