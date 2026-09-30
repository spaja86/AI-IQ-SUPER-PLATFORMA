import { B2B_PLATFORM_CATALOG } from './b2b-platform-catalog';

export type B2BDeploymentState = 'READY' | 'BUILDING' | 'ERROR' | 'UNKNOWN';

export interface B2BDeploymentSummary {
  id: string;
  naziv: string;
  state: B2BDeploymentState;
  checkedAt: string;
  source: 'vercel-api' | 'configuration';
  message: string;
}

const PROJECT_NAMES: Record<string, string> = {
  'ai-iq-super-platforma': 'ai-iq-super-platforma',
  'io-openui-ao': 'io-openui-ao',
  'ai-iq-menjacnica': 'ai-iq-menja-nica-6cnf',
  'kompanija-spaja': 'kompanija-spaja',
  'svetska-organizacija': 'svetska-organizacija',
  'ai-iq-world-bank': 'ai-iq-world-bank',
};

function normalizeState(value: unknown): B2BDeploymentState {
  if (value === 'READY' || value === 'BUILDING' || value === 'ERROR') return value;
  return 'UNKNOWN';
}

/** Returns a minimal deployment summary without exposing tokens, URLs, billing, or API errors. */
export async function getB2BVercelDeploymentSummary(): Promise<B2BDeploymentSummary[]> {
  const checkedAt = new Date().toISOString();
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID ?? process.env.VERCEL_ORG_ID;

  if (!token) {
    return B2B_PLATFORM_CATALOG.map((platforma) => ({
      id: platforma.id,
      naziv: platforma.naziv,
      state: 'UNKNOWN' as const,
      checkedAt,
      source: 'configuration' as const,
      message: 'Vercel read-only token nije konfigurisan.',
    }));
  }

  return Promise.all(B2B_PLATFORM_CATALOG.map(async (platforma) => {
    const projectName = PROJECT_NAMES[platforma.id];
    if (!projectName) {
      return { id: platforma.id, naziv: platforma.naziv, state: 'UNKNOWN' as const, checkedAt, source: 'configuration' as const, message: 'Nije Vercel projekat u ovom status izvoru.' };
    }

    try {
      const params = new URLSearchParams({ projectId: projectName, limit: '1' });
      if (teamId) params.set('teamId', teamId);
      const response = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!response.ok) {
        return { id: platforma.id, naziv: platforma.naziv, state: 'UNKNOWN' as const, checkedAt, source: 'vercel-api' as const, message: 'Vercel status nije dostupan.' };
      }
      const payload = await response.json() as { deployments?: Array<{ readyState?: unknown }> };
      const state = normalizeState(payload.deployments?.[0]?.readyState);
      return { id: platforma.id, naziv: platforma.naziv, state, checkedAt, source: 'vercel-api' as const, message: state === 'UNKNOWN' ? 'Nema dostupnog deployment statusa.' : 'Poslednji deployment status.' };
    } catch {
      return { id: platforma.id, naziv: platforma.naziv, state: 'UNKNOWN' as const, checkedAt, source: 'vercel-api' as const, message: 'Vercel status nije dostupan.' };
    }
  }));
}
