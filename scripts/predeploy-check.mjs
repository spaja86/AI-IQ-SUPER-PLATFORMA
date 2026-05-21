#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

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

const report = {
  appVersion,
  autofinishCount,
  totalApiRoutes,
  routePressure,
  cronCount,
  missingRequiredEnv,
  status: missingRequiredEnv.length > 0 ? 'warning' : 'ok',
};

console.log('=== Predeploy Check ===');
console.log(JSON.stringify(report, null, 2));

if (process.argv.includes('--strict') && missingRequiredEnv.length > 0) {
  console.error('Strict mode: missing required env vars.');
  process.exit(1);
}
