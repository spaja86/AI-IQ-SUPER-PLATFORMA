import {
  classifyDeploymentFailure,
  getDeployDiagnosticsSnapshot,
  getStrictEnvModuleStatus,
} from '../../lib/deploy-diagnostics';

let passed = 0;
let failed = 0;

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
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests() {
  console.log('\n🚀 Deploy Diagnostics Test Suite\n');

  await test('classifyDeploymentFailure prepoznaje build signal', () => {
    const result = classifyDeploymentFailure('Build error occurred: Failed to compile');
    assert(result.kind === 'build', 'mora biti build');
  });

  await test('classifyDeploymentFailure prepoznaje runtime signal', () => {
    const result = classifyDeploymentFailure('FUNCTION_INVOCATION_FAILED runtime timeout');
    assert(result.kind === 'runtime', 'mora biti runtime');
  });

  await test('classifyDeploymentFailure vraća unknown za prazan ulaz', () => {
    const result = classifyDeploymentFailure('');
    assert(result.kind === 'unknown', 'mora biti unknown');
  });

  await test('strict env modul lista sadrži expected module', () => {
    const modules = getStrictEnvModuleStatus().map((m) => m.module);
    assert(modules.includes('@/lib/supabase/client'), 'mora sadržati supabase client');
    assert(modules.includes('@/lib/openai/client'), 'mora sadržati openai client');
  });

  await test('snapshot sadrži routeSurface i env sekcije', () => {
    const snapshot = getDeployDiagnosticsSnapshot();
    assert(typeof snapshot.routeSurface.totalApiRoutesDeclared === 'number', 'mora imati totalApiRoutesDeclared');
    assert(Array.isArray(snapshot.env.missingEnv), 'mora imati missingEnv niz');
    assert(Array.isArray(snapshot.expectedProductionEnv), 'mora imati expectedProductionEnv niz');
  });

  console.log(`\n📊 Rezultat: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

void runTests();
