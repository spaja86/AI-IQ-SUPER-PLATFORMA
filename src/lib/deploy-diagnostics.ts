import { TOTAL_API_ROUTES } from '@/lib/constants';
import { getAutofinishMetaInfo } from '@/lib/autofinish-petlja';
import { validateConfig } from '@/lib/config-validation';
import { getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';

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

const BUILD_PATTERNS: RegExp[] = [
  /build error occurred/i,
  /failed to compile/i,
  /turbopack build failed/i,
  /command ["']next build["'] exited/i,
  /module not found/i,
  /export .* doesn't exist/i,
];

const RUNTIME_PATTERNS: RegExp[] = [
  /function_invocation_failed/i,
  /runtime/i,
  /cannot read properties of undefined/i,
  /is not configured/i,
  /timeout/i,
  /edge function/i,
];

function detectSignal(text: string): DeploymentFailureSignal {
  for (const pattern of BUILD_PATTERNS) {
    if (pattern.test(text)) return { kind: 'build', reason: `match:${pattern.source}` };
  }
  for (const pattern of RUNTIME_PATTERNS) {
    if (pattern.test(text)) return { kind: 'runtime', reason: `match:${pattern.source}` };
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

  try {
    const deployment = await fetchVercelJson(`/v13/deployments/${deploymentId}`, token);
    const events = await fetchVercelJson(`/v13/deployments/${deploymentId}/events?limit=100`, token).catch(() => ({}));
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
  };
}
