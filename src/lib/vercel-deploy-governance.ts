import {
  EXPECTED_VERCEL_INVOICE_AMOUNT,
  EXPECTED_VERCEL_INVOICE_NUMBER,
} from '@/lib/vercel-billing-governance';

export const VERCEL_STATUS_ROUTE_PATH = '/api/vercel-status' as const;
export const VERCEL_OWNERSHIP_ROUTE_PATH = '/api/owner/vercel-ownership' as const;
export const VERCEL_PRIMARY_DEPLOY_WORKFLOW = 'Vercel Git integracija' as const;
export const VERCEL_FALLBACK_DEPLOY_WORKFLOW_PATH = '.github/workflows/vercel-deploy.yml' as const;
export const VERCEL_CANONICAL_APEX_DOMAIN = 'spaja.nivo-spaja' as const;
export const VERCEL_CANONICAL_WILDCARD_DOMAIN = '*.spaja.nivo-spaja' as const;
export const VERCEL_INVALID_DOMAIN_PATTERN = 'spaja.nivo*spaja' as const;

export type VercelDeployWaweStatus = 'BLOCKED' | 'READY' | 'PENDING';

export interface BuildVercelDeployGovernanceSummaryOptions {
  sourceOfTruthPath: typeof VERCEL_STATUS_ROUTE_PATH | typeof VERCEL_OWNERSHIP_ROUTE_PATH;
  blockers: string[];
  tokenConfigured: boolean;
  projectIdConfigured: boolean;
  teamOrOrgConfigured: boolean;
  deployHookConfigured: boolean;
}

function resolveRecommendedNextAction(blockers: string[]): string {
  if (blockers.some((item) => item.includes('faktura') || item.includes('invoice'))) {
    return `Prvo razrešiti fakturu ${EXPECTED_VERCEL_INVOICE_NUMBER} ($${EXPECTED_VERCEL_INVOICE_AMOUNT}) putem pay ili correction-resolved putanje.`;
  }

  if (blockers.some((item) => item.includes('dokaz') || item.includes('izvod') || item.includes('reference'))) {
    return 'Zatvoriti payment evidence paket: invoice dokaz, bank statement, payment reference klasifikacija i redigovan javni sažetak.';
  }

  if (blockers.some((item) => item.includes('Billing owner') || item.includes('Enterprise zahtev') || item.includes('Telefon vlasnika') || item.includes('Privredni intake') || item.includes('Pretplata nije označena'))) {
    return 'Poravnati ownership i enterprise gate pre deploy pokušaja.';
  }

  if (blockers.some((item) => item.includes('VERCEL_'))) {
    return 'Dopuniti Vercel infrastrukturu (token, project, team/org) pre pokretanja deploy-a.';
  }

  return 'Pokrenuti deploy prvo push-em kroz Vercel Git integraciju, a ručni workflow koristiti samo kao fallback.';
}

function resolveWaweStatus(blockers: string[], infraReady: boolean, phaseNumber: number): VercelDeployWaweStatus {
  if (blockers.length > 0) {
    return 'BLOCKED';
  }

  if (!infraReady && phaseNumber <= 2) {
    return 'BLOCKED';
  }

  if (phaseNumber === 3 || phaseNumber === 5) {
    return 'PENDING';
  }

  return 'READY';
}

export function buildVercelDeployGovernanceSummary({
  sourceOfTruthPath,
  blockers,
  tokenConfigured,
  projectIdConfigured,
  teamOrOrgConfigured,
  deployHookConfigured,
}: BuildVercelDeployGovernanceSummaryOptions) {
  const mirrorPath =
    sourceOfTruthPath === VERCEL_STATUS_ROUTE_PATH
      ? VERCEL_OWNERSHIP_ROUTE_PATH
      : VERCEL_STATUS_ROUTE_PATH;
  const infraReady = tokenConfigured && projectIdConfigured && teamOrOrgConfigured;

  return {
    blockerSourceOfTruth: {
      primaryEndpoint: sourceOfTruthPath,
      mirroredEndpoint: mirrorPath,
      currentStatus: blockers.length === 0 ? 'READY' : 'BLOCKED',
      mustStayAligned: true,
      policy: 'Deploy ostaje blokiran dok oba endpointa ne potvrde da su governance i billing uslovi kompletni.',
    },
    invoiceGovernance: {
      governedInvoiceNumber: EXPECTED_VERCEL_INVOICE_NUMBER,
      governedInvoiceAmountUsd: EXPECTED_VERCEL_INVOICE_AMOUNT,
      allowedResolutionPaths: ['paid', 'correction-resolved'],
      blockedWithoutResolution: true,
    },
    infrastructure: {
      tokenConfigured,
      projectIdConfigured,
      teamOrOrgConfigured,
      deployHookConfigured,
    },
    deployTriggerOrder: [
      {
        order: 1,
        mode: 'push',
        handler: VERCEL_PRIMARY_DEPLOY_WORKFLOW,
        role: 'primary-source-of-truth',
        guidance: 'Prvo uraditi normalan push i pustiti Vercel Git integraciju da sama pokrene deploy.',
      },
      {
        order: 2,
        mode: 'workflow_dispatch',
        handler: VERCEL_FALLBACK_DEPLOY_WORKFLOW_PATH,
        role: 'manual-fallback-only',
        guidance: 'Ručno pokrenuti fallback workflow samo ako Git integracija ne startuje deploy.',
      },
    ],
    canonicalDomainStrategy: {
      invalidRequestedPattern: VERCEL_INVALID_DOMAIN_PATTERN,
      apexDomain: VERCEL_CANONICAL_APEX_DOMAIN,
      wildcardDomain: VERCEL_CANONICAL_WILDCARD_DOMAIN,
    },
    developerCreateBoundary: {
      canonicalAlias: 'DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA',
      additiveOnly: true,
      ownershipSplit: {
        extrem: 'technical-signal',
        extrondol: 'governance-promotion-freeze',
        spajaKod: 'summary-only-boundary',
      },
      noNewDeployMechanism: true,
    },
    wawePhases: [
      {
        id: 'WAWE 1',
        name: 'Pre-release validation',
        status: resolveWaweStatus(blockers, infraReady, 1),
        gate: 'typecheck + test + smoke + predeploy + security',
      },
      {
        id: 'WAWE 2',
        name: 'Build + staging verification',
        status: resolveWaweStatus(blockers, infraReady, 2),
        gate: 'build + staging smoke + KPI verification',
      },
      {
        id: 'WAWE 3',
        name: 'Downstream sync + audit reference',
        status: resolveWaweStatus(blockers, infraReady, 3),
        gate: 'linked-repo sync + audit references',
      },
      {
        id: 'WAWE 4',
        name: 'Production rollout',
        status: resolveWaweStatus(blockers, infraReady, 4),
        gate: 'progressive production promotion',
      },
      {
        id: 'WAWE 5',
        name: 'Post-release resilience + audit',
        status: resolveWaweStatus(blockers, infraReady, 5),
        gate: 'stability, analytics, audit closure',
      },
    ],
    recommendedNextAction: resolveRecommendedNextAction(blockers),
  };
}
