/**
 * Deploy Trigger — AI IQ SUPER PLATFORMA
 *
 * Server-side funkcija za pokretanje deploymenta putem Vercel deploy hook-ova.
 * Zahteva odgovarajući VERCEL_DEPLOY_HOOK_* env var konfigurisan za platformu.
 *
 * Bezbednosna pravila:
 * - Production deploy zahteva confirmToken === 'DEPLOY_PRODUCTION'
 * - Svaki poziv se audit-loguje
 */

import type { DeployEnvironment } from './deploy-registry';
import { getDeployPlatformById } from './deploy-registry';
import { getExtrimliExtrondolReport } from '../extrimli-extrondol';
import type { ExtrimliExtrondolReport } from '../extrimli-extrondol/types';

export interface DeployTriggerRequest {
  platformId: string;
  environment: DeployEnvironment;
  /** Za production deploy: mora biti 'DEPLOY_PRODUCTION' */
  confirmToken?: string;
  triggeredBy: string;
  /** Opcioni platform-scope governance snapshot (ako nije prosleđen koristi se globalni report). */
  governanceReport?: ExtrimliExtrondolReport;
}

export interface DeployTriggerResult {
  success: boolean;
  platformId: string;
  environment: DeployEnvironment;
  deploymentId: string | null;
  message: string;
  triggeredAt: string;
}

interface VercelHookResponse {
  job?: { id?: string };
  id?: string;
}

function isSpajaProductionGatePlatform(platformId: string): boolean {
  return platformId === 'ai-iq-super-platforma' || platformId === 'kompanija-spaja';
}

/**
 * Pokreće deployment za datu platformu putem Vercel deploy hook-a.
 *
 * @throws Nikad ne baca — greške se vraćaju kao `{ success: false }`.
 */
export async function triggerPlatformDeploy(
  req: DeployTriggerRequest,
): Promise<DeployTriggerResult> {
  const triggeredAt = new Date().toISOString();
  const platform = getDeployPlatformById(req.platformId);

  if (!platform) {
    return {
      success: false,
      platformId: req.platformId,
      environment: req.environment,
      deploymentId: null,
      message: `Platforma '${req.platformId}' nije pronađena u registru`,
      triggeredAt,
    };
  }

  if (!platform.manualTriggerEnabled || !platform.deployHookEnvVar) {
    return {
      success: false,
      platformId: req.platformId,
      environment: req.environment,
      deploymentId: null,
      message: `Platforma '${platform.naziv}' nema konfigurisan deploy hook`,
      triggeredAt,
    };
  }

  // Production gate
  if (req.environment === 'production' && req.confirmToken !== 'DEPLOY_PRODUCTION') {
    return {
      success: false,
      platformId: req.platformId,
      environment: req.environment,
      deploymentId: null,
      message: 'Production deploy zahteva confirmToken=DEPLOY_PRODUCTION',
      triggeredAt,
    };
  }

  if (req.environment === 'production' && isSpajaProductionGatePlatform(req.platformId)) {
    const extrondol = req.governanceReport ?? getExtrimliExtrondolReport();
    const rolloutBlocked = extrondol.rollout.promotionFreeze;
    const releaseBlocked = extrondol.releaseAuditSummary.status !== 'READY';
    const invalidDomainStrategy = !extrondol.domainStrategy.valid;
    const downstreamNotAligned = extrondol.releaseAuditSummary.downstreamReference.status !== 'ALIGNED';

    if (rolloutBlocked || releaseBlocked || invalidDomainStrategy || downstreamNotAligned) {
      const blockers: string[] = [];
      if (rolloutBlocked) {
        blockers.push(
          ...(extrondol.rollout.reasons.length > 0
            ? extrondol.rollout.reasons
            : ['rollout-freeze:promotion-freeze-active']),
        );
      }
      if (releaseBlocked) blockers.push(`release-audit:${extrondol.releaseAuditSummary.status}`);
      if (invalidDomainStrategy) blockers.push(`domain-strategy:${extrondol.domainStrategy.invalidReason ?? 'invalid'}`);
      if (downstreamNotAligned) blockers.push('downstream-sync:FOLLOW_UP_REQUIRED');

      return {
        success: false,
        platformId: req.platformId,
        environment: req.environment,
        deploymentId: null,
        message: `Production deploy blokiran EXTRONDOL governance kapijom: ${blockers.join(' | ')}`,
        triggeredAt,
      };
    }
  }

  const hookUrl = process.env[platform.deployHookEnvVar];
  if (!hookUrl) {
    return {
      success: false,
      platformId: req.platformId,
      environment: req.environment,
      deploymentId: null,
      message: `Env var '${platform.deployHookEnvVar}' nije konfigurisan`,
      triggeredAt,
    };
  }

  try {
    const res = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return {
        success: false,
        platformId: req.platformId,
        environment: req.environment,
        deploymentId: null,
        message: `Deploy hook greška HTTP ${res.status}: ${body.slice(0, 200)}`,
        triggeredAt,
      };
    }

    const json = await res.json().catch(() => ({})) as VercelHookResponse;
    const deploymentId = json.job?.id ?? json.id ?? null;

    return {
      success: true,
      platformId: req.platformId,
      environment: req.environment,
      deploymentId,
      message: `Deploy uspešno pokrenut za '${platform.naziv}' (${req.environment})`,
      triggeredAt,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      platformId: req.platformId,
      environment: req.environment,
      deploymentId: null,
      message: `Greška pri pozivu deploy hook-a: ${msg}`,
      triggeredAt,
    };
  }
}
