import { TOTAL_API_ROUTES } from '@/lib/constants';
import { getAutofinishMetaInfo } from '@/lib/autofinish-petlja';
import { validateConfig } from '@/lib/config-validation';
import { getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';
import { isKvAvailable, kvPing } from '@/lib/kv-client';

export type DeploymentFailureKind = 'build' | 'runtime' | 'unknown';

export interface DeploymentFailureSignal {
  kind: DeploymentFailureKind;
  reason: string;
}

export interface VercelProbeResult {
  available: boolean;
  deploymentId?: string;
  status?: string;
  url?: string;
  inspector: 'vercel-api';
  error?: string;
  rawSample?: string;
  signal: DeploymentFailureSignal;
}

const BUILD_MARKERS = [
  'build error occurred',
  'failed to compile',
  'turbopack build failed',
  'next build',
  'module not found',
  `doesn't exist`,
] as const;

const RUNTIME_MARKERS = [
  'function_invocation_failed',
  'runtime',
  'cannot read properties of undefined',
  'is not configured',
  'timeout',
  'edge function',
] as const;

function detectSignal(text: string): DeploymentFailureSignal {
  const normalized = text.toLowerCase();
  for (const marker of BUILD_MARKERS) {
    if (normalized.includes(marker)) return { kind: 'build', reason: `marker:${marker}` };
  }
  for (const marker of RUNTIME_MARKERS) {
    if (normalized.includes(marker)) return { kind: 'runtime', reason: `marker:${marker}` };
  }
  return { kind: 'unknown', reason: 'no-known-pattern-match' };
}

export function classifyDeploymentFailure(input: string | null | undefined): DeploymentFailureSignal {
  const text = (input ?? '').trim();
  if (!text) return { kind: 'unknown', reason: 'empty-input' };
  return detectSignal(text);
}

async function fetchVercelJson(path: string, token: string): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.vercel.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Vercel API ${res.status}: ${JSON.stringify(payload)}`);
  }
  return typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {};
}

function normalizeSample(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export async function probeVercelDeployment(deploymentId?: string): Promise<VercelProbeResult> {
  const token = process.env.VERCEL_TOKEN;
  if (!deploymentId) {
    return {
      available: false,
      inspector: 'vercel-api',
      error: 'deploymentId-missing',
      signal: { kind: 'unknown', reason: 'deployment-id-missing' },
    };
  }
  if (!token) {
    return {
      available: false,
      deploymentId,
      inspector: 'vercel-api',
      error: 'VERCEL_TOKEN-missing',
      signal: { kind: 'unknown', reason: 'vercel-token-missing' },
    };
  }

  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(deploymentId)) {
    return {
      available: false,
      deploymentId,
      inspector: 'vercel-api',
      error: 'invalid-deployment-id-format',
      signal: { kind: 'unknown', reason: 'invalid-deployment-id-format' },
    };
  }

  const safeDeploymentId = encodeURIComponent(deploymentId);

  try {
    const deployment = await fetchVercelJson(`/v13/deployments/${safeDeploymentId}`, token);
    const events = await fetchVercelJson(`/v13/deployments/${safeDeploymentId}/events?limit=100`, token).catch(() => ({}));
    const sample = `${normalizeSample(deployment.errorMessage)}\n${normalizeSample(events)}`.slice(0, 8000);
    const signal = detectSignal(sample);
    return {
      available: true,
      deploymentId,
      inspector: 'vercel-api',
      status: typeof deployment.readyState === 'string' ? deployment.readyState : undefined,
      url: typeof deployment.url === 'string' ? deployment.url : undefined,
      rawSample: sample || undefined,
      signal,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      available: false,
      deploymentId,
      inspector: 'vercel-api',
      error: msg,
      signal: detectSignal(msg),
    };
  }
}

export function getStrictEnvModuleStatus() {
  return [
    {
      module: '@/lib/supabase/client',
      strictEnv: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      gracefulAlternative: 'getSupabaseClientSafe',
    },
    {
      module: '@/lib/supabase/server',
      strictEnv: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      gracefulAlternative: 'getSupabaseServerClientSafe',
    },
    {
      module: '@/lib/openai/client',
      strictEnv: ['OPENAI_API_KEY'],
      gracefulAlternative: 'getOpenAISafe',
    },
    {
      module: '@/lib/stripe/config',
      strictEnv: ['STRIPE_SECRET_KEY'],
      gracefulAlternative: 'getStripeSafe',
    },
  ] as const;
}

export function getDeployDiagnosticsSnapshot() {
  const operativa = getOperativnaSpremnost();
  const cfg = validateConfig(true);
  const autofinishMeta = getAutofinishMetaInfo();
  const routePressure = TOTAL_API_ROUTES >= 1000 ? 'high' : TOTAL_API_ROUTES >= 400 ? 'medium' : 'low';

  const vercelToken = Boolean(process.env.VERCEL_TOKEN);
  const vercelProjectId = Boolean(process.env.VERCEL_PROJECT_ID);
  const vercelKvConfigured = isKvAvailable();
  const vercelPriključeno = vercelToken && vercelProjectId;

  return {
    env: {
      missingEnv: operativa.spremnost.missingEnv,
      missingVercelEnv: operativa.spremnost.missingVercelEnv,
      modelStanja: operativa.spremnost.modelStanja,
      configValidation: cfg,
    },
    routeSurface: {
      totalApiRoutesDeclared: TOTAL_API_ROUTES,
      pressure: routePressure,
      autofinishEndpointsDeclared: autofinishMeta.autofinishEndpoints.length,
      consolidationCandidate: {
        strategy: 'grouped-dynamic-handler-with-compat-mapping',
        targetAutofinishHandlers: 8,
      },
    },
    strictEnvModules: getStrictEnvModuleStatus(),
    expectedProductionEnv: [
      'OMEGA_JWT_SECRET',
      'CRON_SECRET',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'OPENAI_API_KEY',
      'STRIPE_SECRET_KEY',
      'VERCEL_PROJECT_ID',
      'VERCEL_TEAM_ID',
      'VERCEL_TOKEN',
    ],
    vercelPriključenost: {
      vercelPriključeno,
      vercelToken,
      vercelProjectId,
      vercelTeamId: Boolean(process.env.VERCEL_TEAM_ID ?? process.env.VERCEL_ORG_ID),
      vercelKvConfigured,
      deployHookAiIq: Boolean(process.env.VERCEL_DEPLOY_HOOK_AI_IQ),
      deployHookIoOpenUiAo: Boolean(process.env.VERCEL_DEPLOY_HOOK_IO_OPENUI_AO),
      deployHookMekartor: Boolean(process.env.VERCEL_DEPLOY_HOOK_MEKARTOR),
      mekartorStatusWebhook: Boolean(process.env.MEKARTOR_STATUS_WEBHOOK_URL),
    },
  };
}

/**
 * Async health check: proverava Vercel token i KV ping.
 * Pozivati samo iz server-side konteksta (API route-ovi).
 */
export async function getVercelHealthCheck(): Promise<{
  vercelPriključeno: boolean;
  tokenKonfigurisan: boolean;
  projectIdKonfigurisan: boolean;
  kvOdgovara: boolean;
  kvKonfigurisan: boolean;
}> {
  const tokenKonfigurisan = Boolean(process.env.VERCEL_TOKEN);
  const projectIdKonfigurisan = Boolean(process.env.VERCEL_PROJECT_ID);
  const kvKonfigurisan = isKvAvailable();
  const kvOdgovara = kvKonfigurisan ? await kvPing() : false;
  const vercelPriključeno = tokenKonfigurisan && projectIdKonfigurisan;

  return {
    vercelPriključeno,
    tokenKonfigurisan,
    projectIdKonfigurisan,
    kvOdgovara,
    kvKonfigurisan,
  };
}
