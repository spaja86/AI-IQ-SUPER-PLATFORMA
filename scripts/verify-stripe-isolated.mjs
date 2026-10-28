import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { root, versions } from '../src/tests/billing/fixtures/stripe-isolated-harness.mjs';

const args = process.argv.slice(2);
let characterize = false;
let reportPath;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--characterize') characterize = true;
  else if (args[i] === '--report' && args[i + 1]) reportPath = resolve(args[++i]);
  else throw new Error(`Unknown argument: ${args[i]}. Usage: node scripts/verify-stripe-isolated.mjs [--characterize] [--report path.json]`);
}
const configNames = [
  'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_BASIC', 'STRIPE_PRICE_PRO',
  'STRIPE_PRICE_ENTERPRISE', 'STRIPE_PRICE_UNLIMITED',
  'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'STRIPE_CHECKOUT_PROXY_ID', 'STRIPE_CHECKOUT_PROXY_AUDIENCE',
  'STRIPE_CHECKOUT_PROXY_KEY', 'STRIPE_CHECKOUT_IP_HASH_KEY',
  'VERCEL_KV_REST_API_URL', 'VERCEL_KV_REST_API_TOKEN',
];
// Presence only: no values are printed, loaded from files, or passed to tests.
const hostConfiguration = Object.fromEntries(configNames.map(name => [name, process.env[name] ? 'present-not-used' : 'absent']));
const sourceFiles = [
  'src/app/api/stripe/checkout/route.ts', 'src/app/api/stripe/webhook/route.ts',
  'src/lib/stripe/config.ts', 'src/lib/stripe/billing-validators.ts', 'src/lib/stripe/billing-guard.ts',
  'src/lib/stripe/billing-feature-flags.ts', 'src/lib/idempotency.ts', 'src/lib/rate-limit.ts',
  'src/lib/supabase/server.ts', 'src/lib/supabase/types.ts', 'package-lock.json',
  'src/tests/billing/stripe-isolated.test.mjs', 'src/tests/billing/fixtures/stripe-isolated-harness.mjs',
  'scripts/verify-stripe-isolated.mjs', 'supabase/sql/stripe-p0-atomic.sql',
  'src/lib/stripe/checkout-fraud.ts', 'src/lib/stripe/checkout-proxy.ts',
  'supabase/sql/stripe-checkout-fraud.sql',
];
const sourceHashes = Object.fromEntries(sourceFiles.map(file => [file, createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex')]));
const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'src/tests/billing/stripe-isolated.test.mjs'], {
  cwd: root, encoding: 'utf8', timeout: 90_000, maxBuffer: 8 * 1024 * 1024,
  // Explicit allowlist excludes credentials, NODE_OPTIONS and network/KV settings.
  env: { TZ: 'UTC', NO_COLOR: '1', STRIPE_READINESS_STRICT: characterize ? '0' : '1' },
});
if (result.error) throw result.error;
const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.replaceAll(root, '<repo>').replace(/[ \t]+$/gm, '');
const counts = Object.fromEntries(['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo'].map(key => {
  const value = output.match(new RegExp(`^# ${key} (\\d+)$`, 'm'))?.[1];
  if (value === undefined) throw new Error(`Missing test count ${key}; refusing incomplete evidence`);
  return [key, Number(value)];
}));
const failedExpectations = [...output.matchAll(/^not ok \d+ - (.+)$/gm)].map(match => match[1].split(' # TODO')[0]);
const report = {
  generatedAt: new Date().toISOString(), scope: 'LOCAL_SIMULATION_ONLY',
  mode: characterize ? 'characterization' : 'strict-readiness',
  readiness: counts.fail || counts.todo || counts.cancelled || counts.skipped ? 'NO_GO' : 'LOCAL_CHECKS_ONLY_NOT_SANDBOX_CERTIFICATION',
  sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  versions, sourceHashes, hostConfiguration,
  stripeSandboxApiOperations: 0, livePaymentOperations: 0,
  limitations: ['Stripe HTTP, Supabase database and identity provider responses are doubles.',
    'Actual route/helper code and Stripe SDK signature verification execute locally.',
    'No remote JWT validation, PostgreSQL transactions/RLS, distributed store, browser or deployment verified.',
    'Present host configuration is not proof of valid credentials or account mapping.'],
  counts, exitCode: result.status, failedExpectations,
};
if (reportPath) {
  if (!reportPath.endsWith('.json')) throw new Error('--report must end with .json');
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(reportPath.replace(/\.json$/, '.tap'), output);
}
process.stdout.write(output);
console.log(`\n${report.readiness}: ${counts.pass} passed, ${counts.fail} failed, ${counts.todo} executed TODO. Stripe sandbox API operations: 0.`);
process.exitCode = result.status ?? 1;
