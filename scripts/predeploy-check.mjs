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

// ── Full contract validation (parallel file reads) ────────────────────────────
const navigationPath = resolve(repoRoot, 'src/lib/navigation.ts');
const sitemapPath = resolve(repoRoot, 'src/app/sitemap.ts');

const filePaths = {
  analizaLib: resolve(repoRoot, 'src/lib/analiza-svega.ts'),
  analizaRoute: resolve(repoRoot, 'src/app/api/analiza-svega/route.ts'),
  potencijalLib: resolve(repoRoot, 'src/lib/potencijal-svega-ovoga-do-sada.ts'),
  potencijalRoute: resolve(repoRoot, 'src/app/api/potencijal-svega-ovoga-do-sada/route.ts'),
  procesuiranjeLib: resolve(repoRoot, 'src/lib/procesuiranje-svega.ts'),
  procesuiranje3Lib: resolve(repoRoot, 'src/lib/procesuiranje-3.ts'),
  procesuiranje3Route: resolve(repoRoot, 'src/app/api/procesuiranje-3/route.ts'),
  ekstremnoRoute: resolve(repoRoot, 'src/app/api/ekstremno-procesuiranje-svega/route.ts'),
  maksimusLib: resolve(repoRoot, 'src/lib/maksimus-svega.ts'),
  maksimusRoute: resolve(repoRoot, 'src/app/api/maksimus-svega/route.ts'),
  maksimus2Lib: resolve(repoRoot, 'src/lib/maksimus-2.ts'),
  maksimus2Route: resolve(repoRoot, 'src/app/api/maksimus-2/route.ts'),
  maksimus3Lib: resolve(repoRoot, 'src/lib/maksimus-3.ts'),
  maksimus3Route: resolve(repoRoot, 'src/app/api/maksimus-3/route.ts'),
  sitemap: sitemapPath,
  navigation: navigationPath,
};

const keys = Object.keys(filePaths);
const sources = await Promise.all(keys.map((k) => readFileAsync(filePaths[k], 'utf8')));
const src = Object.fromEntries(keys.map((k, i) => [k, sources[i]]));

const deployPlatformaRegistryPath = resolve(repoRoot, 'src/lib/deploy/deploy-registry.ts');
const deployPlatformaPagePath = resolve(repoRoot, 'src/app/deploy-platforma/page.tsx');
const deployPlatformaApiStatusPath = resolve(repoRoot, 'src/app/api/deploy-platforma/status/route.ts');

let deployPlatformaReady = false;
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
    src.navigation.includes('/deploy-platforma'),
  ].every(Boolean);
} catch {
  deployPlatformaReady = false;
}

// ── Contract readiness checks ─────────────────────────────────────────────────
const analizaContractVersion = src.analizaLib.match(/export const ANALIZA_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const analizaModelVersion = src.analizaLib.match(/export const ANALIZA_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const analizaContractReady = [
  src.analizaLib.includes('sourceOfTruth: \'/api/analiza-svega\''),
  src.analizaRoute.includes('X-Analiza-Contract-Version'),
  src.sitemap.includes('/api/analiza-svega'),
  src.navigation.includes('/analiza-svega'),
].every(Boolean);

const potencijalContractVersion = src.potencijalLib.match(/export const POTENCIJAL_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const potencijalModelVersion = src.potencijalLib.match(/export const POTENCIJAL_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const potencijalContractReady = [
  src.potencijalLib.includes('sourceOfTruth: \'/api/potencijal-svega-ovoga-do-sada\''),
  src.potencijalRoute.includes('X-Potencijal-Contract-Version'),
  src.sitemap.includes('/api/potencijal-svega-ovoga-do-sada'),
  src.navigation.includes('/potencijal-svega-ovoga-do-sada'),
].every(Boolean);

const procesuiranjeContractVersion = src.procesuiranjeLib.match(/export const PROCESUIRANJE_SVEGA_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const procesuiranjeModelVersion = src.procesuiranjeLib.match(/export const PROCESUIRANJE_SVEGA_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const procesuiranjeContractReady = [
  src.procesuiranjeLib.includes('PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH = \'/api/procesuiranje-svega\''),
  src.ekstremnoRoute.includes('X-Procesuiranje-Contract-Version'),
  src.sitemap.includes('/api/ekstremno-procesuiranje-svega'),
  src.navigation.includes('/procesuiranje-svega'),
].every(Boolean);

const procesuiranje3ContractVersion = src.procesuiranje3Lib.match(/export const PROCESUIRANJE_3_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const procesuiranje3ModelVersion = src.procesuiranje3Lib.match(/export const PROCESUIRANJE_3_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const procesuiranje3ContractReady = [
  src.procesuiranje3Lib.includes('PROCESUIRANJE_3_SOURCE_OF_TRUTH = \'/api/procesuiranje-3\''),
  src.procesuiranje3Route.includes('X-Procesuiranje3-Contract-Version'),
  src.sitemap.includes('/api/procesuiranje-3'),
  src.navigation.includes('/procesuiranje-3'),
].every(Boolean);

const maksimusContractVersion = src.maksimusLib.match(/export const MAKSIMUS_SVEGA_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimusModelVersion = src.maksimusLib.match(/export const MAKSIMUS_SVEGA_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimusContractReady = [
  src.maksimusLib.includes('MAKSIMUS_SVEGA_SOURCE_OF_TRUTH = \'/api/maksimus-svega\''),
  src.maksimusRoute.includes('X-Maksimus-Contract-Version'),
  src.sitemap.includes('/api/maksimus-svega'),
  src.navigation.includes('/maksimus-svega'),
].every(Boolean);

// maksimus2 and maksimus3 are not yet production-activated — demoted to warnings.
const maksimus2ContractVersion = src.maksimus2Lib.match(/export const MAKSIMUS_2_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimus2ModelVersion = src.maksimus2Lib.match(/export const MAKSIMUS_2_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimus2ContractReady = [
  src.maksimus2Lib.includes('MAKSIMUS_2_SOURCE_OF_TRUTH = \'/api/maksimus-2\''),
  src.maksimus2Route.includes('X-Maksimus2-Contract-Version'),
  src.sitemap.includes('/api/maksimus-2'),
  src.navigation.includes('/maksimus-2'),
].every(Boolean);

const maksimus3ContractVersion = src.maksimus3Lib.match(/export const MAKSIMUS_3_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimus3ModelVersion = src.maksimus3Lib.match(/export const MAKSIMUS_3_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimus3ContractReady = [
  src.maksimus3Lib.includes('MAKSIMUS_3_SOURCE_OF_TRUTH = \'/api/maksimus-3\''),
  src.maksimus3Route.includes('X-Maksimus3-Contract-Version'),
  src.sitemap.includes('/api/maksimus-3'),
  src.navigation.includes('/maksimus-3'),
].every(Boolean);

// ── Deployment blockers (critical contracts only) ─────────────────────────────
// maksimus2 and maksimus3 are warnings, not blockers.
const hasDeploymentBlockers = missingRequiredEnv.length > 0
  || !analizaContractReady
  || !potencijalContractReady
  || !procesuiranjeContractReady
  || !procesuiranje3ContractReady
  || !maksimusContractReady;

const contractWarnings = [
  !maksimus2ContractReady && 'maksimus2ContractReady=false (warning only)',
  !maksimus3ContractReady && 'maksimus3ContractReady=false (warning only)',
].filter(Boolean);

const report = {
  mode: 'full',
  appVersion,
  autofinishCount,
  totalApiRoutes,
  routePressure,
  cronCount,
  missingRequiredEnv,
  contractWarnings,
  analizaSvega: {
    contractVersion: analizaContractVersion,
    modelVersion: analizaModelVersion,
    contractReady: analizaContractReady,
  },
  potencijalSvegaOvogaDoSada: {
    contractVersion: potencijalContractVersion,
    modelVersion: potencijalModelVersion,
    contractReady: potencijalContractReady,
  },
  ekstremnoProcesuiranjeSvega: {
    contractVersion: procesuiranjeContractVersion,
    modelVersion: procesuiranjeModelVersion,
    contractReady: procesuiranjeContractReady,
  },
  procesuiranje3: {
    contractVersion: procesuiranje3ContractVersion,
    modelVersion: procesuiranje3ModelVersion,
    contractReady: procesuiranje3ContractReady,
  },
  maksimusSvega: {
    contractVersion: maksimusContractVersion,
    modelVersion: maksimusModelVersion,
    contractReady: maksimusContractReady,
  },
  maksimus2: {
    contractVersion: maksimus2ContractVersion,
    modelVersion: maksimus2ModelVersion,
    contractReady: maksimus2ContractReady,
    blocker: false,
  },
  maksimus3: {
    contractVersion: maksimus3ContractVersion,
    modelVersion: maksimus3ModelVersion,
    contractReady: maksimus3ContractReady,
    blocker: false,
  },
  deployPlatforma: {
    ready: deployPlatformaReady,
    registryPath: 'src/lib/deploy/deploy-registry.ts',
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

