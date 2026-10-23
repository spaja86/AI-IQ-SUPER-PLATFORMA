#!/usr/bin/env node

import { readFile, readFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const readFileAsync = promisify(readFile);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

const fast = process.argv.includes('--fast');
const strict = process.argv.includes('--strict');

const repoRoot = resolve(process.cwd());
const constantsPath = resolve(repoRoot, 'src/lib/constants.ts');
const vercelPath = resolve(repoRoot, 'vercel.json');

const constantsSrc = readFileSync(constantsPath, 'utf8');
const vercel = readJson(vercelPath);

function extractNumber(name) {
  const match = constantsSrc.match(new RegExp(`export const ${name} = (\\d+);`));
  return match ? Number(match[1]) : null;
}

const totalApiRoutes = extractNumber('TOTAL_API_ROUTES');
const autofinishCount = extractNumber('AUTOFINISH_COUNT');
const appVersion = constantsSrc.match(/export const APP_VERSION = '([^']+)'/)?.[1] ?? 'unknown';

const requiredEnv = [
  'OMEGA_JWT_SECRET',
  'CRON_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
];

const missingRequiredEnv = requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === '');
const cronCount = Array.isArray(vercel.crons) ? vercel.crons.length : 0;
const routePressure = totalApiRoutes === null ? 'unknown' : totalApiRoutes >= 1000 ? 'high' : totalApiRoutes >= 400 ? 'medium' : 'low';

// In fast mode, skip contract detail checks and only validate env + cron count.
if (fast) {
  const hasBlockers = missingRequiredEnv.length > 0;
  const report = {
    mode: 'fast',
    appVersion,
    totalApiRoutes,
    routePressure,
    cronCount,
    missingRequiredEnv,
    status: hasBlockers ? 'warning' : 'ok',
  };
  console.log('=== Predeploy Check (fast mode) ===');
  console.log(JSON.stringify(report, null, 2));
  if (strict && hasBlockers) {
    console.error('Strict mode: missing required env vars.');
    process.exit(1);
  }
  process.exit(0);
}

// Full source validation intentionally does not read the public-page sitemap.
// Load the parser only in full mode; --fast retains its env/cron-only behavior.
const { checkSourceContracts } = await import('./predeploy-source-contracts.mjs');
const contracts = await checkSourceContracts(repoRoot);
const navigation = await readFileAsync(resolve(repoRoot, 'src/lib/navigation.ts'), 'utf8').catch(() => '');

const deployPlatformaRegistryPath = resolve(repoRoot, 'src/lib/deploy/deploy-registry.ts');
const deployPlatformaPagePath = resolve(repoRoot, 'src/app/deploy-platforma/page.tsx');
const deployPlatformaApiStatusPath = resolve(repoRoot, 'src/app/api/deploy-platforma/status/route.ts');

let deployPlatformaReady = false;
let deployHistoryExportReady = false;
let deployRegistryHealthUrlsReady = false;
try {
  const [registrySrc, pageSrc, apiStatusSrc] = await Promise.all([
    readFileAsync(deployPlatformaRegistryPath, 'utf8'),
    readFileAsync(deployPlatformaPagePath, 'utf8'),
    readFileAsync(deployPlatformaApiStatusPath, 'utf8'),
  ]);
  deployPlatformaReady = [
    registrySrc.includes('deployRegistry'),
    pageSrc.includes('deploy-platforma'),
    apiStatusSrc.includes('/api/deploy-platforma/status'),
    navigation.includes('/deploy-platforma'),
  ].every(Boolean);

  // Verify deploy-history exports getDeployHistory
  const deployHistoryPath = resolve(repoRoot, 'src/lib/deploy/deploy-history.ts');
  try {
    const deployHistorySrc = await readFileAsync(deployHistoryPath, 'utf8');
    deployHistoryExportReady = deployHistorySrc.includes('export function getDeployHistory');
  } catch {
    deployHistoryExportReady = false;
  }

  // Verify all 'aktivan' platforms in registry have healthUrl configured
  const healthUrlWarnings = [];
  const registryEntries = registrySrc.matchAll(/status:\s*'aktivan'[^}]*healthUrl:\s*(null|'[^']*')/gs);
  for (const match of registryEntries) {
    if (match[1] === 'null') {
      healthUrlWarnings.push('platforma sa statusom=aktivan nema healthUrl');
    }
  }
  deployRegistryHealthUrlsReady = healthUrlWarnings.length === 0;

} catch {
  deployPlatformaReady = false;
}

// Preserve the five mandatory contracts and the two warning-only contracts.
const requiredContracts = ['analizaSvega', 'potencijalSvegaOvogaDoSada',
  'ekstremnoProcesuiranjeSvega', 'procesuiranje3', 'maksimusSvega'];
const hasDeploymentBlockers = missingRequiredEnv.length > 0
  || requiredContracts.some(name => contracts[name]?.contractReady !== true);
const contractWarnings = ['maksimus2', 'maksimus3']
  .filter(name => contracts[name]?.contractReady !== true)
  .map(name => `${name}ContractReady=false (warning only)`);

const report = {
  mode: 'full',
  appVersion,
  autofinishCount,
  totalApiRoutes,
  routePressure,
  cronCount,
  missingRequiredEnv,
  contractWarnings,
  ...contracts,
  deployPlatforma: {
    ready: deployPlatformaReady,
    deployHistoryExportReady,
    deployRegistryHealthUrlsReady,
    registryPath: 'src/lib/deploy/deploy-registry.ts',
    historyPath: 'src/lib/deploy/deploy-history.ts',
    pagePath: 'src/app/deploy-platforma/page.tsx',
    apiStatusPath: 'src/app/api/deploy-platforma/status/route.ts',
  },
  status: hasDeploymentBlockers ? 'warning' : 'ok',
};

console.log('=== Predeploy Check ===');
console.log(JSON.stringify(report, null, 2));

if (contractWarnings.length > 0) {
  console.warn('⚠️  Contract warnings (non-blocking):', contractWarnings.join(', '));
}

if (strict && hasDeploymentBlockers) {
  console.error('Strict mode: missing required env vars or ANALIZA/POTENCIJAL/PROCESUIRANJE/PROCESUIRANJE3/MAKSIMUS contract is not ready.');
  process.exit(1);
}

