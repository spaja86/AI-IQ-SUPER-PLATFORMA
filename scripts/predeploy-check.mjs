#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

const repoRoot = resolve(process.cwd());
const constantsPath = resolve(repoRoot, 'src/lib/constants.ts');
const vercelPath = resolve(repoRoot, 'vercel.json');
const analizaLibPath = resolve(repoRoot, 'src/lib/analiza-svega.ts');
const analizaRoutePath = resolve(repoRoot, 'src/app/api/analiza-svega/route.ts');
const potencijalLibPath = resolve(repoRoot, 'src/lib/potencijal-svega-ovoga-do-sada.ts');
const potencijalRoutePath = resolve(repoRoot, 'src/app/api/potencijal-svega-ovoga-do-sada/route.ts');
const procesuiranjeLibPath = resolve(repoRoot, 'src/lib/procesuiranje-svega.ts');
const ekstremnoRoutePath = resolve(repoRoot, 'src/app/api/ekstremno-procesuiranje-svega/route.ts');
const maksimusLibPath = resolve(repoRoot, 'src/lib/maksimus-svega.ts');
const maksimusRoutePath = resolve(repoRoot, 'src/app/api/maksimus-svega/route.ts');
const sitemapPath = resolve(repoRoot, 'src/app/sitemap.ts');
const navigationPath = resolve(repoRoot, 'src/lib/navigation.ts');

const constantsSrc = readFileSync(constantsPath, 'utf8');
const vercel = readJson(vercelPath);
const analizaLibSrc = readFileSync(analizaLibPath, 'utf8');
const analizaRouteSrc = readFileSync(analizaRoutePath, 'utf8');
const potencijalLibSrc = readFileSync(potencijalLibPath, 'utf8');
const potencijalRouteSrc = readFileSync(potencijalRoutePath, 'utf8');
const procesuiranjeLibSrc = readFileSync(procesuiranjeLibPath, 'utf8');
const ekstremnoRouteSrc = readFileSync(ekstremnoRoutePath, 'utf8');
const maksimusLibSrc = readFileSync(maksimusLibPath, 'utf8');
const maksimusRouteSrc = readFileSync(maksimusRoutePath, 'utf8');
const sitemapSrc = readFileSync(sitemapPath, 'utf8');
const navigationSrc = readFileSync(navigationPath, 'utf8');

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
const analizaContractVersion = analizaLibSrc.match(/export const ANALIZA_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const analizaModelVersion = analizaLibSrc.match(/export const ANALIZA_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const analizaContractReady = [
  analizaLibSrc.includes('sourceOfTruth: \'/api/analiza-svega\''),
  analizaRouteSrc.includes('X-Analiza-Contract-Version'),
  sitemapSrc.includes('/api/analiza-svega'),
  navigationSrc.includes('/analiza-svega'),
].every(Boolean);
const potencijalContractVersion = potencijalLibSrc.match(/export const POTENCIJAL_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const potencijalModelVersion = potencijalLibSrc.match(/export const POTENCIJAL_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const potencijalContractReady = [
  potencijalLibSrc.includes('sourceOfTruth: \'/api/potencijal-svega-ovoga-do-sada\''),
  potencijalRouteSrc.includes('X-Potencijal-Contract-Version'),
  sitemapSrc.includes('/api/potencijal-svega-ovoga-do-sada'),
  navigationSrc.includes('/potencijal-svega-ovoga-do-sada'),
].every(Boolean);
const procesuiranjeContractVersion = procesuiranjeLibSrc.match(/export const PROCESUIRANJE_SVEGA_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const procesuiranjeModelVersion = procesuiranjeLibSrc.match(/export const PROCESUIRANJE_SVEGA_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const procesuiranjeContractReady = [
  procesuiranjeLibSrc.includes('PROCESUIRANJE_SVEGA_SOURCE_OF_TRUTH = \'/api/procesuiranje-svega\''),
  ekstremnoRouteSrc.includes('X-Procesuiranje-Contract-Version'),
  sitemapSrc.includes('/api/ekstremno-procesuiranje-svega'),
  navigationSrc.includes('/procesuiranje-svega'),
].every(Boolean);
const maksimusContractVersion = maksimusLibSrc.match(/export const MAKSIMUS_SVEGA_CONTRACT_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimusModelVersion = maksimusLibSrc.match(/export const MAKSIMUS_SVEGA_MODEL_VERSION = '([^']+)'/)?.[1] ?? 'unknown';
const maksimusContractReady = [
  maksimusLibSrc.includes('MAKSIMUS_SVEGA_SOURCE_OF_TRUTH = \'/api/maksimus-svega\''),
  maksimusRouteSrc.includes('X-Maksimus-Contract-Version'),
  sitemapSrc.includes('/api/maksimus-svega'),
  navigationSrc.includes('/maksimus-svega'),
].every(Boolean);
const hasDeploymentBlockers = missingRequiredEnv.length > 0 || !analizaContractReady || !potencijalContractReady || !procesuiranjeContractReady || !maksimusContractReady;

const report = {
  appVersion,
  autofinishCount,
  totalApiRoutes,
  routePressure,
  cronCount,
  missingRequiredEnv,
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
  maksimusSvega: {
    contractVersion: maksimusContractVersion,
    modelVersion: maksimusModelVersion,
    contractReady: maksimusContractReady,
  },
  status: hasDeploymentBlockers ? 'warning' : 'ok',
};

console.log('=== Predeploy Check ===');
console.log(JSON.stringify(report, null, 2));

if (process.argv.includes('--strict') && hasDeploymentBlockers) {
  console.error('Strict mode: missing required env vars or ANALIZA/POTENCIJAL/PROCESUIRANJE/MAKSIMUS contract is not ready.');
  process.exit(1);
}
