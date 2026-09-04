/**
 * Deploy Status — AI IQ SUPER PLATFORMA
 *
 * Server-side funkcije za dohvatanje živog statusa deploymenta sa Vercel API-ja.
 * Pozivati samo iz server-side konteksta (API route-ovi, Server Components).
 */

import type { DeployPlatformEntry } from './deploy-registry';

export type VercelDeployState =
  | 'READY'
  | 'BUILDING'
  | 'ERROR'
  | 'CANCELED'
  | 'QUEUED'
  | 'INITIALIZING'
  | 'UNKNOWN';

export interface PlatformDeployStatus {
  platformId: string;
  naziv: string;
  ikona: string;
  vercelProjectId: string;
  state: VercelDeployState;
  url: string | null;
  deploymentId: string | null;
  createdAt: string | null;
  error: string | null;
  checkedAt: string;
}

interface VercelDeploymentPayload {
  uid?: string;
  id?: string;
  readyState?: string;
  state?: string;
  url?: string;
  createdAt?: number;
}

function normalizeState(raw: string | undefined): VercelDeployState {
  if (!raw) return 'UNKNOWN';
  const upper = raw.toUpperCase();
  const known: VercelDeployState[] = ['READY', 'BUILDING', 'ERROR', 'CANCELED', 'QUEUED', 'INITIALIZING'];
  return known.includes(upper as VercelDeployState) ? (upper as VercelDeployState) : 'UNKNOWN';
}

/**
 * Dohvata status najnovijeg deploymenta za dati Vercel project.
 * Zahteva VERCEL_TOKEN env varijablu.
 */
export async function fetchVercelProjectStatus(
  platform: DeployPlatformEntry,
): Promise<PlatformDeployStatus> {
  const checkedAt = new Date().toISOString();
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return {
      platformId: platform.id,
      naziv: platform.naziv,
      ikona: platform.ikona,
      vercelProjectId: platform.vercelProjectId,
      state: 'UNKNOWN',
      url: platform.produktionUrl,
      deploymentId: null,
      createdAt: null,
      error: 'VERCEL_TOKEN nije konfigurisan',
      checkedAt,
    };
  }

  try {
    const teamId = process.env.VERCEL_TEAM_ID ?? process.env.VERCEL_ORG_ID ?? null;
    const params = new URLSearchParams({ limit: '1', projectId: platform.vercelProjectId });
    if (teamId) params.set('teamId', teamId);

    const res = await fetch(`https://api.vercel.com/v6/deployments?${params.toString()}`, {
      headers: {
        Authorization: ['Bearer', token].join(' '),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return {
        platformId: platform.id,
        naziv: platform.naziv,
        ikona: platform.ikona,
        vercelProjectId: platform.vercelProjectId,
        state: 'UNKNOWN',
        url: platform.produktionUrl,
        deploymentId: null,
        createdAt: null,
        error: `Vercel API greška ${res.status}: ${body.slice(0, 200)}`,
        checkedAt,
      };
    }

    const json = await res.json() as { deployments?: VercelDeploymentPayload[] };
    const deployment = json.deployments?.[0] ?? null;

    return {
      platformId: platform.id,
      naziv: platform.naziv,
      ikona: platform.ikona,
      vercelProjectId: platform.vercelProjectId,
      state: normalizeState(deployment?.readyState ?? deployment?.state),
      url: deployment?.url ? `https://${deployment.url}` : platform.produktionUrl,
      deploymentId: deployment?.uid ?? deployment?.id ?? null,
      createdAt: deployment?.createdAt ? new Date(deployment.createdAt).toISOString() : null,
      error: null,
      checkedAt,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      platformId: platform.id,
      naziv: platform.naziv,
      ikona: platform.ikona,
      vercelProjectId: platform.vercelProjectId,
      state: 'UNKNOWN',
      url: platform.produktionUrl,
      deploymentId: null,
      createdAt: null,
      error: msg,
      checkedAt,
    };
  }
}

/**
 * Dohvata status svih platformi u paralelu.
 */
export async function fetchAllPlatformStatuses(
  platforms: DeployPlatformEntry[],
): Promise<PlatformDeployStatus[]> {
  return Promise.all(platforms.map((p) => fetchVercelProjectStatus(p)));
}
