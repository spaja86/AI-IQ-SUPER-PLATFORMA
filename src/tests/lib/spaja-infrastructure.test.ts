import assert from 'node:assert/strict';
import { GET } from '../../app/api/spaja-infrastructure/health/route';
import { getSpajaInfrastructureHealth } from '../../lib/spaja-infrastructure';

async function run(): Promise<void> {
  const report = getSpajaInfrastructureHealth();

  assert.equal(report.product, 'SPAJA SERVER / SPAJA BAZA');
  assert.equal(report.runtime, 'vercel-functions');
  assert.equal(report.adapters.length, 3);
  assert.deepEqual(
    report.adapters.map((adapter) => adapter.id),
    ['supabase-postgres', 'vercel-blob', 'upstash-redis'],
  );
  assert(report.limits.some((limit) => limit.includes('does not claim unlimited')));
  assert(report.adapters.every((adapter) => adapter.missingConfiguration.every((name) => !process.env[name])));

  const response = await GET();
  const body = (await response.json()) as { product?: string; adapters?: unknown[] };
  assert.equal(response.status, 200);
  assert.equal(body.product, 'SPAJA SERVER / SPAJA BAZA');
  assert(Array.isArray(body.adapters));

  console.log('SPAJA infrastructure v1 tests passed');
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
