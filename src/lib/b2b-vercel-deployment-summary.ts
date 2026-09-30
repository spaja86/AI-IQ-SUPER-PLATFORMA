import { B2B_PLATFORM_CATALOG } from './b2b-platform-catalog';

export type B2BDeploymentState = 'READY' | 'BUILDING' | 'ERROR' | 'UNKNOWN';
export type B2BDeploymentAlert = 'none' | 'warning' | 'critical';

const BUILDING_ALERT_AFTER_MS = 15 * 60 * 1000;

export interface B2BDeploymentSummary {
  id: string;
  naziv: string;
  state: B2BDeploymentState;
  checkedAt: string;
  source: 'vercel-api' | 'configuration';
  message: string;
  alert: B2BDeploymentAlert;
  alertMessage: string | null;
}

const PROJECT_NAMES: Record<string, string> = {
  'ai-iq-super-platforma': 'ai-iq-super-platforma',
  'io-openui-ao': 'io-openui-ao',
  'ai-iq-menjacnica': 'ai-iq-menja-nica-6cnf',
  'kompanija-spaja': 'kompanija-spaja',
  'svetska-organizacija': 'svetska-organizacija',
  'ai-iq-world-bank': 'ai-iq-world-bank',
};

export function getAlert(state: B2BDeploymentState, createdAt: unknown): { alert: B2BDeploymentAlert; alertMessage: string | null } {
  if (state === 'ERROR') return { alert: 'critical', alertMessage: 'Poslednji deployment je prijavio grešku. Potrebna je ljudska provera.' };
  if (state === 'BUILDING' && typeof createdAt === 'number' && Date.now() - createdAt > BUILDING_ALERT_AFTER_MS) {
    return { alert: 'warning', alertMessage: 'Deployment je u BUILDING stanju duže od 15 minuta. Proverite build logove.' };
  }
  return { alert: 'none', alertMessage: null };
}

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
      alert: 'none' as const,
      alertMessage: null,
    }));
  }

  return Promise.all(B2B_PLATFORM_CATALOG.map(async (platforma) => {
    const projectName = PROJECT_NAMES[platforma.id];
    if (!projectName) {
      return { id: platforma.id, naziv: platforma.naziv, state: 'UNKNOWN' as const, checkedAt, source: 'configuration' as const, message: 'Nije Vercel projekat u ovom status izvoru.', alert: 'none' as const, alertMessage: null };
    }

    try {
      const params = new URLSearchParams({ projectId: projectName, limit: '1' });
      if (teamId) params.set('teamId', teamId);
      const response = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!response.ok) {
        return { id: platforma.id, naziv: platforma.naziv, state: 'UNKNOWN' as const, checkedAt, source: 'vercel-api' as const, message: 'Vercel status nije dostupan.', alert: 'none' as const, alertMessage: null };
      }
      const payload = await response.json() as { deployments?: Array<{ readyState?: unknown; createdAt?: unknown }> };
      const deployment = payload.deployments?.[0];
      const state = normalizeState(deployment?.readyState);
      const alert = getAlert(state, deployment?.createdAt);
      return { id: platforma.id, naziv: platforma.naziv, state, checkedAt, source: 'vercel-api' as const, message: state === 'UNKNOWN' ? 'Nema dostupnog deployment statusa.' : 'Poslednji deployment status.', ...alert };
    } catch {
      return { id: platforma.id, naziv: platforma.naziv, state: 'UNKNOWN' as const, checkedAt, source: 'vercel-api' as const, message: 'Vercel status nije dostupan.', alert: 'none' as const, alertMessage: null };
    }
  }));
}

export interface B2BIncidentSummary {
  level: Exclude<B2BDeploymentAlert, 'none'>;
  platformId: string;
  naziv: string;
  message: string;
  checkedAt: string;
  checklist: readonly string[];
}

/** Creates a read-only review queue. It intentionally has no deployment or notification side effects. */
export function getIncidentSummaries(deployments: B2BDeploymentSummary[]): B2BIncidentSummary[] {
  return deployments.flatMap((deployment) => {
    if (deployment.alert === 'none' || !deployment.alertMessage) return [];
    return [{
      level: deployment.alert,
      platformId: deployment.id,
      naziv: deployment.naziv,
      message: deployment.alertMessage,
      checkedAt: deployment.checkedAt,
      checklist: [
        'Potvrdite stanje u Vercel dashboard-u.',
        'Pregledajte build ili runtime logove.',
        'Odredite vlasnika i sledeći ručni korak.',
        'Ne pokrećite redeploy bez ljudske potvrde.',
      ],
    }];
  });
}
