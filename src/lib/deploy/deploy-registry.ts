/**
 * Deploy Registry — AI IQ SUPER PLATFORMA
 *
 * Centralni registar svih deployabilnih platformi sa Vercel project ID-jevima,
 * framework-ovima, okruženjima i health check URL-ovima.
 *
 * Jedan izvor istine za deploy-platforma hub.
 */

export type DeployEnvironment = 'dev' | 'staging' | 'production';
export type DeployPlatformStatus = 'aktivan' | 'u_pripremi' | 'neaktivan' | 'greska';

export interface DeployPlatformEntry {
  /** Jedinstveni identifikator platforme */
  id: string;
  /** Naziv platforme */
  naziv: string;
  /** Opis platforme */
  opis: string;
  /** Ikona */
  ikona: string;
  /** Vercel project ID */
  vercelProjectId: string;
  /** Vercel deploy hook secret env var name (npr. VERCEL_DEPLOY_HOOK_AI_IQ) */
  deployHookEnvVar: string | null;
  /** URL produkcijskog deploymenta */
  produktionUrl: string;
  /** Health check URL (relativna putanja ili apsolutni URL) */
  healthUrl: string | null;
  /** Framework */
  framework: string;
  /** Trenutni status */
  status: DeployPlatformStatus;
  /** Da li podržava ručno pokretanje */
  manualTriggerEnabled: boolean;
}

/** Registar svih deployabilnih platformi */
export const deployRegistry: DeployPlatformEntry[] = [
  {
    id: 'ai-iq-super-platforma',
    naziv: 'AI IQ SUPER PLATFORMA',
    opis: 'Centralna platforma — jezgro ekosistema',
    ikona: '🏢',
    vercelProjectId: 'ai-iq-super-platforma',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_AI_IQ',
    produktionUrl: 'https://ai-iq-super-platforma.vercel.app',
    healthUrl: 'https://ai-iq-super-platforma.vercel.app/api/health',
    framework: 'Next.js 16',
    status: 'aktivan',
    manualTriggerEnabled: true,
  },
  {
    id: 'io-openui-ao',
    naziv: 'IO OPENUI AO',
    opis: 'Laboratorija, demo okruženje i gaming platforma',
    ikona: '🔬',
    vercelProjectId: 'io-openui-ao',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_IO_OPENUI_AO',
    produktionUrl: 'https://io-openui-ao.vercel.app',
    healthUrl: 'https://io-openui-ao.vercel.app/',
    framework: 'React + SpajaPro',
    status: 'aktivan',
    manualTriggerEnabled: true,
  },
  {
    id: 'ai-iq-menjacnica',
    naziv: 'AI IQ Menjačnica',
    opis: 'Kripto i fiat menjačnica sa AI optimizacijom',
    ikona: '💱',
    vercelProjectId: 'ai-iq-menjacnica',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_MENJACNICA',
    produktionUrl: 'https://ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app',
    healthUrl: 'https://ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app/api/health',
    framework: 'Next.js',
    status: 'aktivan',
    manualTriggerEnabled: true,
  },
  {
    id: 'ai-iq-world-bank',
    naziv: 'AI IQ World Bank',
    opis: 'Digitalna banka sa globalnim dometom',
    ikona: '🏦',
    vercelProjectId: 'ai-iq-world-bank',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_WORLD_BANK',
    produktionUrl: 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app',
    healthUrl: 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/api/health',
    framework: 'Next.js',
    status: 'aktivan',
    manualTriggerEnabled: true,
  },
  {
    id: 'omega-ai-vercel',
    naziv: 'OMEGA AI za Vercel',
    opis: 'AI agent za Vercel deploy i monitoring',
    ikona: '🚀',
    vercelProjectId: 'omega-ai-vercel',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_OMEGA_AI',
    produktionUrl: 'https://omega-ai-vercel.vercel.app',
    healthUrl: 'https://omega-ai-vercel.vercel.app/api/health',
    framework: 'Node.js',
    status: 'aktivan',
    manualTriggerEnabled: true,
  },
  {
    id: 'kompanija-spaja',
    naziv: 'Kompanija SPAJA',
    opis: 'Korporativni hub — digitalna industrija, nabavka i poslovni procesi',
    ikona: '🏭',
    vercelProjectId: 'kompanija-spaja',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_KOMPANIJA_SPAJA',
    produktionUrl: 'https://kompanija-spaja.vercel.app',
    healthUrl: 'https://kompanija-spaja.vercel.app/api/health',
    framework: 'Next.js',
    status: 'u_pripremi',
    manualTriggerEnabled: true,
  },
  {
    id: 'poslovni-novcanik',
    naziv: 'Poslovni Novčanik',
    opis: 'Digitalni wallet sa ledger-om, auditom i kripto trezor integracijom',
    ikona: '💼',
    vercelProjectId: 'poslovni-novcanik',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_POSLOVNI_NOVCANIK',
    produktionUrl: 'https://poslovni-novcanik.vercel.app',
    healthUrl: 'https://poslovni-novcanik.vercel.app/api/health',
    framework: 'Next.js',
    status: 'u_pripremi',
    manualTriggerEnabled: true,
  },
  {
    id: 'nova-generacija',
    naziv: 'Nova Generacija',
    opis: 'SpajaPro 16 Hipermreza — unifikacioni gateway svih platformi (v100.0.0+)',
    ikona: '⚡',
    vercelProjectId: 'nova-generacija',
    deployHookEnvVar: 'VERCEL_DEPLOY_HOOK_NOVA_GENERACIJA',
    produktionUrl: 'https://ai-iq-super-platforma.vercel.app/nova-generacija',
    healthUrl: 'https://ai-iq-super-platforma.vercel.app/api/nova-generacija',
    framework: 'Next.js 16 + SpajaPro 16',
    status: 'aktivan',
    manualTriggerEnabled: true,
  },
];

/**
 * Pronalazi platformu po ID-u.
 */
export function getDeployPlatformById(id: string): DeployPlatformEntry | undefined {
  return deployRegistry.find((p) => p.id === id);
}

/**
 * Vraća sve platforme koje imaju konfigurisani deploy hook.
 */
export function getTriggablePlatforms(): DeployPlatformEntry[] {
  return deployRegistry.filter((p) => p.deployHookEnvVar !== null && p.manualTriggerEnabled);
}

/**
 * Vraća sve platforme koje imaju konfigurisani health check URL.
 */
export function getPlatformsWithHealthCheck(): DeployPlatformEntry[] {
  return deployRegistry.filter((p) => p.healthUrl !== null);
}
